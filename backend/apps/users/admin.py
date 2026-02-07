from django.contrib import admin
from .models import User

@admin.register(User)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name')
    search_fields = ('email', 'first_name')
