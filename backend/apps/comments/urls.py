from django.urls import path
from .views import TaskCommentsView

urlpatterns = [
    path("tasks/<uuid:task_id>/comments/", TaskCommentsView.as_view()),
]
