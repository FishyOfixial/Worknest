from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import TaskAssignment
from django.core.mail import send_mail
from django.conf import settings


@receiver(post_save, sender=TaskAssignment)
def notify_user_task_assigned(sender, instance, created, **kwargs):

    if not created:
        return

    user = instance.user.user
    task = instance.task
    project = task.project
    workspace = project.workspace

    subject = f"You got asigned to a task in {workspace.name}"

    message = f"""
Hi {user.first_name},

You got asigned to a task in Worknest.

Workspace: {workspace.name}
Proyect: {project.name}
Task: {task.name}

Enter to Worknest for more information.

— Worknest
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
