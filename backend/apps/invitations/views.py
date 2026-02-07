from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from apps.workspaces.models import Workspace, WorkspaceMember
from core.permissions import IsTeamLeader
from .models import Invitation
from .serializers import InvitationCreateSerializer, AcceptInvitationSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class SendInvitationView(APIView):
    permission_classes = [IsAuthenticated, IsTeamLeader]

    def post(self, request, workspace_id):

        serializer = InvitationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        workspace = Workspace.objects.get(id=workspace_id)

        invitation = Invitation.objects.create(
            email=serializer.validated_data["email"],
            role=serializer.validated_data["role"],
            workspace=workspace,
            invited_by=request.user
        )

        return Response(
            {
                "message": "Invitation created",
                "token": str(invitation.token)
            },
            status=status.HTTP_201_CREATED
        )


class AcceptInvitationView(APIView):
    def post(self, request):

        serializer = AcceptInvitationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        invitation = serializer.validated_data["invitation"]
        email = invitation.email

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": serializer.validated_data.get("first_name", ""),
                "last_name": serializer.validated_data.get("last_name", "")
            }
        )

        if created:
            password = serializer.validated_data.get("password")
            if not password:
                return Response(
                    {"error": "Password required for new users"},
                    status=400
                )
            user.set_password(password)
            user.save()

        WorkspaceMember.objects.get_or_create(
            user=user,
            workspace=invitation.workspace,
            defaults={"role": invitation.role}
        )

        invitation.status = Invitation.Status.ACCEPTED
        invitation.save()

        return Response({"message": "Invitation accepted"})