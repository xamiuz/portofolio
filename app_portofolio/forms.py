from django import forms
from .models import Project, Profile, Experience

class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['title', 'description', 'image', 'tags']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Judul Proyek'}),
            'description': forms.Textarea(attrs={'class': 'form-input', 'rows': 4, 'placeholder': 'Deskripsi Singkat'}),
            'tags': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Contoh: Django, Web, HTML'}),
            'image': forms.FileInput(attrs={'class': 'form-input-file'}),
        }

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['about_text', 'cv_file']
        widgets = {
            'about_text': forms.Textarea(attrs={'class': 'form-input', 'rows': 6, 'placeholder': 'Ceritakan tentang diri Anda...'}),
            'cv_file': forms.FileInput(attrs={'class': 'form-input-file'}),
        }

class ExperienceForm(forms.ModelForm):
    class Meta:
        model = Experience
        fields = ['title', 'company', 'start_date', 'end_date', 'description', 'order']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Posisi / Peran'}),
            'company': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Perusahaan / Institusi'}),
            'start_date': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Jan 2023'}),
            'end_date': forms.TextInput(attrs={'class': 'form-input', 'placeholder': 'Sekarang'}),
            'description': forms.Textarea(attrs={'class': 'form-input', 'rows': 4}),
            'order': forms.NumberInput(attrs={'class': 'form-input'}),
        }
