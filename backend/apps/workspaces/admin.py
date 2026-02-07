from django.contrib import admin
from .models import Workspace, WorkspaceMember

@admin.register(Workspace)
class WorkspaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'created_at')
    search_fields = ('name', 'owner__email')

@admin.register(WorkspaceMember)
class WorkspaceMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'workspace', 'role', 'joined_at')
    search_fields = ('user__email', 'workspace__name')
    list_filter = ('role', 'workspace')