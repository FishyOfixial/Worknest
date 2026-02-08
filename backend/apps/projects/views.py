from rest_framework import generics
from .models import Project
from .serializers import ProjectSerializer
from apps.workspaces.models import Workspace
from apps.workspaces.permissions import IsWorkspaceMember, IsTeamLeader
from rest_framework.permissions import IsAuthenticated

class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsWorkspaceMember, IsTeamLeader]

    def get_queryset(self):
        workspace_id = self.kwargs["workspace_id"]
        return Project.objects.filter(workspace_id=workspace_id)
    
    def perform_create(self, serializers):
        workspace_id = self.kwargs["workspace_id"]
        workspace = Workspace.objects.get(id=workspace_id)
        serializers.save(workspace=workspace)

        
