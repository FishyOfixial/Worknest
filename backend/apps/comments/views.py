from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from apps.tasks.models import Task
from apps.workspaces.models import WorkspaceMember
from .models import Comment
from .serializers import CommentSerializer

class TaskCommentsView(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_task(self):
        return Task.objects.get(id=self.kwargs["task_id"])

    def get_queryset(self):
        task = self.get_task()

        is_member = WorkspaceMember.objects.filter(
            workspace=task.project.workspace,
            user=self.request.user
        ).exists()

        if not is_member:
            raise PermissionDenied("You are not part of this Workspace")

        return Comment.objects.filter(task=task).order_by("created_at")

    def perform_create(self, serializer):
        task = self.get_task()

        member = WorkspaceMember.objects.filter(
            workspace=task.project.workspace,
            user=self.request.user
        ).first()

        if not member:
            raise PermissionDenied("You are not part of this Workspace")

        serializer.save(task=task, author=member)
