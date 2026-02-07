from django.urls import path
from .views import SendInvitationView, AcceptInvitationView

urlpatterns = [
    path(
        "workspaces/<uuid:workspace_id>/invite/", SendInvitationView.as_view(), name="send-invite"),
    path("invitations/accept/", AcceptInvitationView.as_view(), name="accept-invite"),
]
