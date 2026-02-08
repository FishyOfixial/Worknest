from rest_framework import serializers
from .models import Task, TaskAssignment
from apps.workspaces.models import WorkspaceMember

class TaskSerializer(serializers.ModelSerializer):

    project = serializers.UUIDField(read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "project",
            "team",
            "name",
            "description",
            "status",
            "priority",
            "due_date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "project"]

class TaskAssignmentSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = TaskAssignment
        fields = ["user_id"]

    def create(self, validated_data):
        task = self.context["task"]
        user_id = validated_data["user_id"]

        member = WorkspaceMember.objects.get(id=user_id)

        assignment, created = TaskAssignment.objects.get_or_create(
            task=task,
            user=member
        )

        return assignment
