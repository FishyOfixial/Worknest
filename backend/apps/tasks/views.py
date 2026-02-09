from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import Task, TaskAssignment
from .serializers import TaskSerializer, TaskAssignmentSerializer
from .permissions import CanModifyTask
from apps.projects.models import Project
from apps.workspaces.models import WorkspaceMember

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs["project_id"]
        project = Project.objects.get(id=project_id)

        is_member = WorkspaceMember.objects.filter(
            workspace_id=project.workspace,
            user=self.request.user
        ).exists()

        if not is_member:
            raise PermissionDenied("You are not part of this workspace")
        
        return Task.objects.filter(project_id=project_id)

    def perform_create(self, serializer):
        project_id = self.kwargs["project_id"]
        project = Project.objects.get(id=project_id)

        project = Project.objects.get(id=project_id)
        
        is_member = WorkspaceMember.objects.filter(
            workspace_id=project.workspace,
            user=self.request.user
        ).exists()
        
        if not is_member:
            raise PermissionDenied("You are not part of this workspace")
        
        serializer.save(project=project)


class TaskDetailView(generics.RetrieveUpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, CanModifyTask]

    def update(self, request, *args, **kwargs):
        task = self.get_object()

        member = WorkspaceMember.objects.filter(
            workspace=task.project.workspace,
            user=request.user
        ).first()

        if not member or member.role != "TEAM_LEADER":
            raise PermissionDenied("Solo Team Leaders pueden editar tareas")

        return super().update(request, *args, **kwargs)


class AssignUserToTask(APIView):
    def post(self, request, pk):
        task = Task.objects.get(pk=pk)

        serializer = TaskAssignmentSerializer(
            data=request.data,
            context={'task': task}
        )

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User assigned'}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UnassignUserFromTask(APIView):

    def delete(self, request, pk, user_id):
        try:
            assignment = TaskAssignment.objects.get(task_id=pk, user_id=user_id)
            assignment.delete()
            return Response({"message": "User unassigned"}, status=204)
        except TaskAssignment.DoesNotExist:
            return Response({"error": "Assignment does not exist"}, status=404)


class ChangeTaskStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        task = Task.objects.get(id=pk)
        new_status = request.data.get("status")

        member = WorkspaceMember.objects.filter(
            workspace=task.project.workspace,
            user=request.user
        ).first()

        if not member:
            raise PermissionDenied("You are not part of this Workspace.")
        
        if member.role == 'client':
            raise PermissionDenied('Clients cannot modify tasks.')
        
        if member.role != 'team_leader':
            assigned = TaskAssignment.objects.filter(
                task=task,
                user=member
            ).exists()

            if not assigned:
                raise PermissionDenied("You are not assigned to this task.")
            
        
        allowed_transitions = {
            "todo": ["in_progress"],
            "in_progress": ["done"],
            "done": []
        }

        if new_status not in allowed_transitions[task.status]:
            raise PermissionDenied(f"You cannot update from {task.status} to {new_status}")
        
        task.status = new_status
        task.save()

        return Response({'status': task.status})