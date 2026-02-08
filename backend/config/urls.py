from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    #JWT Auth
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Users
    path('api/', include('apps.users.urls')),
    
    # Workspaces & Projects & Tasks
    path('api/', include('apps.workspaces.urls')),
    path('api/', include('apps.projects.urls')),
    path("api/", include("apps.tasks.urls")),

    # Invitations
    path('api/', include('apps.invitations.urls')),
]
