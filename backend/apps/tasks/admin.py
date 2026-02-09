from django.contrib import admin
from .models import Task, TaskAssignment

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('project', 'name', 'status', 'priority')
    search_fields = ('project', 'workspace__name')
    list_filter = ('status', 'priority', 'project')

@admin.register(TaskAssignment)
class TaskAssignmentAdmin(admin.ModelAdmin):
    list_display = ('task', 'user')
    search_fields = ('task', 'user')