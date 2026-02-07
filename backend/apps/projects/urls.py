from django.urls import path
from .views import ProjectListCreateView

urlpatterns = [
    path('workspaces/<uuid:workspace_id>/projects/', ProjectListCreateView.as_view()),
]