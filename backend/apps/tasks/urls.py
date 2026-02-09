from django.urls import path
from .views import TaskListCreateView, TaskDetailView, AssignUserToTask, UnassignUserFromTask, ChangeTaskStatusView

urlpatterns = [
    path("projects/<uuid:project_id>/tasks/", TaskListCreateView.as_view()),
    path("tasks/<uuid:pk>/", TaskDetailView.as_view()),
    path("tasks/<uuid:pk>/assign/", AssignUserToTask.as_view()),
    path("tasks/<uuid:pk>/unassign/<uuid:user_id>/", UnassignUserFromTask.as_view()),
    path("tasks/<uuid:pk>/change-status/", ChangeTaskStatusView.as_view()),
]
