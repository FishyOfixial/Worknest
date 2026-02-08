from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Task, TaskAssignment
from .serializers import TaskSerializer, TaskAssignmentSerializer
from .permissions import CanModifyTask
from apps.projects.models import Project
from apps.workspaces.models import WorkspaceMember

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        project_id = self.kwargs["project_id"]
        return Task.objects.filter(project_id=project_id)

    def perform_create(self, serializer):
        project_id = self.kwargs["project_id"]
        project = Project.objects.get(id=project_id)
        serializer.save(project=project)


class TaskDetailView(generics.RetrieveUpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, CanModifyTask]


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
