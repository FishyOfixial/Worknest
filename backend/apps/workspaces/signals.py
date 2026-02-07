from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Workspace, WorkspaceMember

@receiver(post_save, sender=Workspace)
def create_owner_membership(sender, instance, created, **kwargs):
    """
    After creating a workspace, automatically
    create a WorkspaceMember entry for the owner with the role of TEAM_LEADER.
    """

    if created:
        WorkspaceMember.objects.create(
            user=instance.owner,
            workspace=instance,
            role=WorkspaceMember.Role.TEAM_LEADER
        )