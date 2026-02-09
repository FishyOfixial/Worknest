from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Workspace, WorkspaceMember
from .serializers import WorkspaceSerializer, WorkspaceMemberSerializer
from .permissions import IsWorkspaceMember


class WorkspaceViewSet(ModelViewSet):
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated, IsWorkspaceMember])
    def members(self, request, pk=None):
        workspace = self.get_object()

        members = WorkspaceMember.objects.filter(workspace=workspace)
        serializer = WorkspaceMemberSerializer(members, many=True)

        return Response(serializer.data)

    def get_queryset(self):
        """
        Only returns the workspaces where the user is member.
        (multi-tenant security) 
        """
        return Workspace.objects.filter(
            members__user=self.request.user
        ).distinct()
    
    def perform_create(self, serializer):
        """
        The owner is ALWAYS the authenticated user
        """
        serializer.save(owner=self.request.user)