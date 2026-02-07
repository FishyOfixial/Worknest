from rest_framework.permissions import BasePermission
from apps.workspaces.models import WorkspaceMember, Workspace

def get_workspace_role(user, workspace):
    """
    Return the role of the user in the given workspace.
    If the user is not a member, return None.
    """

    try:
        membership = WorkspaceMember.objects.get(user=user, workspace=workspace)
        return membership.role
    except WorkspaceMember.DoesNotExist:
        return None
    

class IsTeamLeader(BasePermission):
    """
    Gives access only if the user is Team Leader in the Workspace
    """

    def has_permission(self, request, view):
        workspace_id = view.kwargs.get('workspace_id')

        if not workspace_id:
            return False
        
        try:
            workspace = Workspace.objects.get(id=workspace_id)
        except Workspace.DoesNotExist:
            return False
        
        role = get_workspace_role(request.user, workspace)

        return role == WorkspaceMember.Role.TEAM_LEADER