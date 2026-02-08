from rest_framework.permissions import BasePermission
from apps.workspaces.models import WorkspaceMember
from .models import TaskAssignment

class CanModifyTask(BasePermission):

    def has_object_permission(self, request, view, obj):
        user = request.user

        is_leader = WorkspaceMember.objects.filter(
            workspace=obj.project.workspace,
            user=user,
            role=WorkspaceMember.Role.TEAM_LEADER
        ).exists()

        if is_leader:
            return True

        is_assigned = TaskAssignment.objects.filter(
            task=obj,
            user__user=user
        ).exists()

        return is_assigned
