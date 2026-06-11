from django.contrib import admin
from .models import Project, Profile, Experience, Education, Award, ProjectMedia

class ProjectMediaInline(admin.TabularInline):
    model = ProjectMedia
    extra = 1

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    search_fields = ('title', 'tags')
    inlines = [ProjectMediaInline]

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('institution', 'degree', 'start_year', 'end_year')

admin.site.register(Profile)
admin.site.register(Experience)
admin.site.register(Award)
