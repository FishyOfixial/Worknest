from rest_framework.permissions import BasePermission
from .models import WorkspaceMember

class IsWorkspaceMember(BasePermission):
    def has_permission(self, request, view):
        workspace_id = view.kwargs.get("workspace_id")

        if not request.user.is_authenticated:
            return False

        return WorkspaceMember.objects.filter(
            workspace_id=workspace_id,
            user=request.user
        ).exists()

class IsTeamLeader(BasePermission):
    def has_permission(self, request, view):
        workspace_id = view.kwargs.get("workspace_id")

        if request.method == "GET":
            return True

        return WorkspaceMember.objects.filter(
            workspace_id=workspace_id,
            user=request.user,
            role=WorkspaceMember.Role.TEAM_LEADER
        ).exists()
