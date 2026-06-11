"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from app_portofolio import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    
    # Dashboard URLs
    path('dasbor/', views.dashboard_index, name='dashboard_index'),
    path('dasbor/login/', views.dashboard_login, name='dashboard_login'),
    path('dasbor/logout/', views.dashboard_logout, name='dashboard_logout'),
    path('dasbor/tambah/', views.dashboard_create, name='dashboard_create'),
    path('dasbor/edit/<int:id>/', views.dashboard_edit, name='dashboard_edit'),
    path('dasbor/hapus/<int:id>/', views.dashboard_delete, name='dashboard_delete'),
    
    # Project Media URLs
    path('dasbor/media/<int:project_id>/', views.media_index, name='media_index'),
    path('dasbor/media/<int:project_id>/tambah/', views.media_create, name='media_create'),
    path('dasbor/media/hapus/<int:id>/', views.media_delete, name='media_delete'),
    
    # Profile & Experience URLs
    path('dasbor/profil/', views.dashboard_profile, name='dashboard_profile'),
    path('dasbor/pengalaman/', views.experience_index, name='experience_index'),
    path('dasbor/pengalaman/tambah/', views.experience_create, name='experience_create'),
    path('dasbor/pengalaman/edit/<int:id>/', views.experience_edit, name='experience_edit'),
    path('dasbor/pengalaman/hapus/<int:id>/', views.experience_delete, name='experience_delete'),
    
    # Award URLs
    path('dasbor/penghargaan/', views.award_index, name='award_index'),
    path('dasbor/penghargaan/tambah/', views.award_create, name='award_create'),
    path('dasbor/penghargaan/edit/<int:id>/', views.award_edit, name='award_edit'),
    path('dasbor/penghargaan/hapus/<int:id>/', views.award_delete, name='award_delete'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
