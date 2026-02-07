from rest_framework import serializers
from .models import Invitation
from apps.workspaces.models import WorkspaceMember
from django.contrib.auth import get_user_model

User = get_user_model()

class InvitationCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Invitation
        fields = ["email", "role"]

    def validate_role(self, value):
        allowed_roles = [
            WorkspaceMember.Role.COLABORATOR,
            WorkspaceMember.Role.CLIENT,
            WorkspaceMember.Role.TEAM_LEADER,
        ]

        if value not in allowed_roles:
            raise serializers.ValidationError("Invalid role")

        return value


class AcceptInvitationSerializer(serializers.Serializer):
    token = serializers.UUIDField()
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True, required=False)

    def validate(self, data):

        try:
            invitation = Invitation.objects.get(token=data["token"])
        except Invitation.DoesNotExist:
            raise serializers.ValidationError("Invalid invitation token")

        if invitation.status != Invitation.Status.PENDING:
            raise serializers.ValidationError("Invitation already used or expired")

        data["invitation"] = invitation
        return data