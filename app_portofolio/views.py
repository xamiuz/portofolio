from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm
from .models import Project, Profile, Experience, Education, Award, ProjectMedia
from .forms import ProjectForm, ProfileForm, ExperienceForm, AwardForm, ProjectMediaForm

def home(request):
    projects = Project.objects.all().order_by('-created_at').prefetch_related('media')
    for proj in projects:
        proj.tag_list = [tag.strip() for tag in proj.tags.split(',') if tag.strip()]
        
    profile = Profile.objects.first()
    experiences = Experience.objects.all().order_by('-order')
    educations = Education.objects.all().order_by('start_year')
    awards = Award.objects.all()
    
    context = {
        'projects': projects,
        'profile': profile,
        'experiences': experiences,
        'educations': educations,
        'awards': awards,
    }
    return render(request, 'home.html', context)

# --- Dashboard Views ---

def dashboard_login(request):
    if request.user.is_authenticated:
        return redirect('dashboard_index')
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('dashboard_index')
    else:
        form = AuthenticationForm()
    return render(request, 'dashboard/login.html', {'form': form})

@login_required(login_url='dashboard_login')
def dashboard_logout(request):
    logout(request)
    return redirect('dashboard_login')

@login_required(login_url='dashboard_login')
def dashboard_index(request):
    projects = Project.objects.all()
    return render(request, 'dashboard/index.html', {'projects': projects})

# -- Project CRUD --
@login_required(login_url='dashboard_login')
def dashboard_create(request):
    if request.method == 'POST':
        form = ProjectForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('dashboard_index')
    else:
        form = ProjectForm()
    return render(request, 'dashboard/form.html', {'form': form, 'title': 'Tambah Proyek'})

@login_required(login_url='dashboard_login')
def dashboard_edit(request, id):
    project = get_object_or_404(Project, id=id)
    if request.method == 'POST':
        form = ProjectForm(request.POST, request.FILES, instance=project)
        if form.is_valid():
            form.save()
            return redirect('dashboard_index')
    else:
        form = ProjectForm(instance=project)
    return render(request, 'dashboard/form.html', {'form': form, 'title': 'Edit Proyek'})

@login_required(login_url='dashboard_login')
def dashboard_delete(request, id):
    project = get_object_or_404(Project, id=id)
    if request.method == 'POST':
        project.delete()
        return redirect('dashboard_index')
    return render(request, 'dashboard/delete_confirm.html', {'item': project, 'back_url': 'dashboard_index'})

# -- Project Media CRUD --
@login_required(login_url='dashboard_login')
def media_index(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    medias = project.media.all()
    return render(request, 'dashboard/media_index.html', {'project': project, 'medias': medias})

@login_required(login_url='dashboard_login')
def media_create(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    if request.method == 'POST':
        form = ProjectMediaForm(request.POST, request.FILES)
        if form.is_valid():
            media = form.save(commit=False)
            media.project = project
            media.save()
            return redirect('media_index', project_id=project.id)
    else:
        form = ProjectMediaForm()
    return render(request, 'dashboard/form.html', {'form': form, 'title': f'Tambah Media untuk: {project.title}'})

@login_required(login_url='dashboard_login')
def media_delete(request, id):
    media = get_object_or_404(ProjectMedia, id=id)
    project_id = media.project.id
    if request.method == 'POST':
        media.delete()
        return redirect('media_index', project_id=project_id)
    return render(request, 'dashboard/delete_confirm.html', {'item': media, 'back_url': 'dashboard_index'})

# -- Profile Management --
@login_required(login_url='dashboard_login')
def dashboard_profile(request):
    profile = Profile.objects.first()
    if not profile:
        profile = Profile()
    if request.method == 'POST':
        form = ProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()
            return redirect('dashboard_profile')
    else:
        form = ProfileForm(instance=profile)
    return render(request, 'dashboard/form.html', {'form': form, 'title': 'Manajemen Profil & CV'})

# -- Experience CRUD --
@login_required(login_url='dashboard_login')
def experience_index(request):
    experiences = Experience.objects.all()
    return render(request, 'dashboard/experience_index.html', {'experiences': experiences})

@login_required(login_url='dashboard_login')
def experience_create(request):
    if request.method == 'POST':
        form = ExperienceForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('experience_index')
    else:
        form = ExperienceForm()
    return render(request, 'dashboard/form.html', {'form': form, 'title': 'Tambah Pengalaman'})

@login_required(login_url='dashboard_login')
def experience_edit(request, id):
    exp = get_object_or_404(Experience, id=id)
    if request.method == 'POST':
        form = ExperienceForm(request.POST, instance=exp)
        if form.is_valid():
            form.save()
            return redirect('experience_index')
    else:
        form = ExperienceForm(instance=exp)
    return render(request, 'dashboard/form.html', {'form': form, 'title': 'Edit Pengalaman'})

@login_required(login_url='dashboard_login')
def experience_delete(request, id):
    exp = get_object_or_404(Experience, id=id)
    if request.method == 'POST':
        exp.delete()
        return redirect('experience_index')
    return render(request, 'dashboard/delete_confirm.html', {'item': exp, 'back_url': 'experience_index'})

# -- Award CRUD --
@login_required(login_url='dashboard_login')
def award_index(request):
    awards = Award.objects.all()
    return render(request, 'dashboard/award_index.html', {'awards': awards})

@login_required(login_url='dashboard_login')
def award_create(request):
    if request.method == 'POST':
        form = AwardForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('award_index')
    else:
        form = AwardForm()
    return render(request, 'dashboard/form.html', {'form': form, 'title': 'Tambah Penghargaan'})

@login_required(login_url='dashboard_login')
def award_edit(request, id):
    award = get_object_or_404(Award, id=id)
    if request.method == 'POST':
        form = AwardForm(request.POST, request.FILES, instance=award)
        if form.is_valid():
            form.save()
            return redirect('award_index')
    else:
        form = AwardForm(instance=award)
    return render(request, 'dashboard/form.html', {'form': form, 'title': 'Edit Penghargaan'})

@login_required(login_url='dashboard_login')
def award_delete(request, id):
    award = get_object_or_404(Award, id=id)
    if request.method == 'POST':
        award.delete()
        return redirect('award_index')
    return render(request, 'dashboard/delete_confirm.html', {'item': award, 'back_url': 'award_index'})
