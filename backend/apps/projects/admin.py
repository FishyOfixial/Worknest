from django.contrib import admin
from .models import Project, Team

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'workspace', 'created_at')
    search_fields = ('workspace', 'name')
    list_filter = ('workspace', 'name')

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'leader')
    search_fields = ('name', 'project')
