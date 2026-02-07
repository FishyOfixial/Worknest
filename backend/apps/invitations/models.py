from django.db import models
from django.conf import settings
from apps.workspaces.models import Workspace, WorkspaceMember
import uuid

User = settings.AUTH_USER_MODEL


class Invitation(models.Model):

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACCEPTED = "accepted", "Accepted"
        EXPIRED = "expired", "Expired"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    email = models.EmailField()

    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="invitations"
    )

    role = models.CharField(
        max_length=20,
        choices=WorkspaceMember.Role.choices
    )

    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    invited_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sent_invitations"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} -> {self.workspace}"
