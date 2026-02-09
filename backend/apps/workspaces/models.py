from django.db import models
from django.conf import settings
import uuid

User = settings.AUTH_USER_MODEL

class Workspace(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    name = models.CharField(max_length=255)

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='owned_workspaces'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

class WorkspaceMember(models.Model):
    
    class Role(models.TextChoices):
        TEAM_LEADER = 'team_leader', 'Team Leader'
        COLABORATOR = 'collaborator', 'Collaborator'
        CLIENT = 'client', 'Client'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='workspace_memberships'
    )

    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name='members'
    )

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.COLABORATOR)

    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} in {self.workspace} ({self.role})'
    
    class Meta:
        unique_together = ('user', 'workspace')