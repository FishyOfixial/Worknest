from rest_framework import serializers
from .models import Workspace, WorkspaceMember

class WorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = ["id", "name", "created_at"]
        read_only_fields =  ["id", "created_at"]

class WorkspaceMemberSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = WorkspaceMember
        fields = ["id", "user_id", "email", "role"]