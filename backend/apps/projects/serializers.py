from rest_framework import serializers
from .models import Project, Team
from apps.workspaces.models import Workspace

class ProjectSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Project
        fields = [
            "id",
            "workspace",
            "name",
            "description",
            "created_at",
            "updated_at",
        ]

        read_only_fields = ["id", "created_at", "updated_at", "workspace"]

