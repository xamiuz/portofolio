from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=200, verbose_name="Judul Proyek")
    description = models.TextField(verbose_name="Deskripsi Proyek")
    image = models.ImageField(upload_to='projects/', blank=True, null=True, verbose_name="Gambar/Cover Proyek")
    tags = models.CharField(max_length=200, verbose_name="Tags (Pisahkan dengan koma)", help_text="Contoh: Django, Python, HTML")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Proyek"
        verbose_name_plural = "Proyek-Proyek"
        ordering = ['-created_at']

class ProjectMedia(models.Model):
    MEDIA_TYPES = (
        ('image', 'Gambar'),
        ('video', 'Video'),
    )
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='media')
    file = models.FileField(upload_to='project_media/', blank=True, null=True, verbose_name="File Media (Kosongkan jika pakai link)")
    external_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="Link Eksternal (Google Drive / YouTube)")
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPES, default='image', verbose_name="Jenis Media")
    order = models.IntegerField(default=0, verbose_name="Urutan")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.project.title} - {self.media_type}"

class Profile(models.Model):
    about_text = models.TextField(verbose_name="Tentang Saya", blank=True)
    cv_file = models.FileField(upload_to='cv/', blank=True, null=True, verbose_name="File CV (PDF/Word)")
    
    def __str__(self):
        return "Profil Portofolio"

class Experience(models.Model):
    title = models.CharField(max_length=200, verbose_name="Posisi / Peran")
    company = models.CharField(max_length=200, verbose_name="Perusahaan / Institusi")
    start_date = models.CharField(max_length=50, verbose_name="Waktu Mulai (misal: Jan 2023)")
    end_date = models.CharField(max_length=50, verbose_name="Waktu Selesai (misal: Sekarang)")
    description = models.TextField(verbose_name="Deskripsi Pekerjaan")
    order = models.IntegerField(default=0, verbose_name="Urutan Tampilan")

    class Meta:
        ordering = ['order', '-id']

    def __str__(self):
        return f"{self.title} di {self.company}"

class Education(models.Model):
    degree = models.CharField(max_length=200, verbose_name="Gelar/Jurusan")
    institution = models.CharField(max_length=200, verbose_name="Nama Institusi/Universitas")
    description = models.TextField(verbose_name="Deskripsi/Prestasi", blank=True)
    start_year = models.CharField(max_length=4, verbose_name="Tahun Mulai")
    end_year = models.CharField(max_length=4, verbose_name="Tahun Lulus (Atau 'Sekarang')", blank=True)

    class Meta:
        verbose_name_plural = "Pendidikan"

    def __str__(self):
        return f"{self.degree} di {self.institution}"

class Award(models.Model):
    title = models.CharField(max_length=200, verbose_name="Judul Penghargaan")
    description = models.TextField(verbose_name="Deskripsi (Opsional)", blank=True)
    image = models.ImageField(upload_to='awards/', verbose_name="Gambar/Sertifikat")
    date = models.CharField(max_length=50, verbose_name="Tanggal/Tahun", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Penghargaan"
        verbose_name_plural = "Penghargaan"
        ordering = ['-created_at']
