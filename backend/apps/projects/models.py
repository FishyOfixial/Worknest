from django.db import models
from apps.workspaces.models import Workspace, WorkspaceMember
import uuid

class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name="projects")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    team_leaders = models.ManyToManyField(
        WorkspaceMember,
        limit_choices_to={'role': WorkspaceMember.Role.TEAM_LEADER},
        related_name="lead_projects",
        blank=True
    )

    def __str__(self):
        return self.name

class Team(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="teams")
    name = models.CharField(max_length=255)
    
    leader = models.ForeignKey(
        WorkspaceMember,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': WorkspaceMember.Role.TEAM_LEADER},
        related_name="lead_teams"
    )

    members = models.ManyToManyField(
        WorkspaceMember,
        related_name="teams",
        blank=True
    )

    def __str__(self):
        return f"{self.project.name} - {self.name}"
