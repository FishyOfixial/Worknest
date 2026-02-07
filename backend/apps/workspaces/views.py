from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Workspace
from .serializers import WorkspaceSerializer


class WorkspaceViewSet(ModelViewSet):
    serializer_class = WorkspaceSerializer
    permission_classes = [IsAuthenticated]

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