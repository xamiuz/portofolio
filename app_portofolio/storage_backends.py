import os
import mimetypes
import requests
from django.core.files.storage import Storage
from django.utils.deconstruct import deconstructible


@deconstructible
class SupabaseStorage(Storage):
    """
    Custom storage backend menggunakan Supabase REST API langsung.
    Lebih andal daripada S3Boto3Storage karena tidak ada masalah signature.
    """

    def __init__(self):
        self.project_id = os.environ.get('SUPABASE_PROJECT_ID', 'aitgjqvhzlxjtozrffqw')
        self.bucket = os.environ.get('SUPABASE_BUCKET_NAME', 'portofolio')
        self.service_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
        self.base_url = f"https://{self.project_id}.supabase.co/storage/v1"
        self.public_url = f"{self.base_url}/object/public/{self.bucket}"

    def _headers(self, content_type='application/octet-stream'):
        return {
            'Authorization': f'Bearer {self.service_key}',
            'Content-Type': content_type,
        }

    def _save(self, name, content):
        # Bersihkan nama file (ganti backslash dengan /)
        name = name.replace('\\', '/')
        content_type = mimetypes.guess_type(name)[0] or 'application/octet-stream'
        file_data = content.read()
        
        upload_url = f"{self.base_url}/object/{self.bucket}/{name}"
        response = requests.post(
            upload_url,
            headers=self._headers(content_type),
            data=file_data,
        )
        if response.status_code in (200, 201):
            return name
        # Jika file sudah ada, coba update (upsert)
        if response.status_code == 409:
            response = requests.put(
                upload_url,
                headers={**self._headers(content_type), 'x-upsert': 'true'},
                data=file_data,
            )
            if response.status_code in (200, 201):
                return name
        raise Exception(f"Supabase upload error {response.status_code}: {response.text}")

    def _open(self, name, mode='rb'):
        raise NotImplementedError("Supabase storage tidak mendukung _open.")

    def exists(self, name):
        # Supabase: cek apakah file ada melalui head request
        name = name.replace('\\', '/')
        url = f"{self.base_url}/object/{self.bucket}/{name}"
        r = requests.head(url, headers=self._headers())
        return r.status_code == 200

    def url(self, name):
        name = name.replace('\\', '/')
        return f"{self.public_url}/{name}"

    def delete(self, name):
        name = name.replace('\\', '/')
        url = f"{self.base_url}/object/{self.bucket}/{name}"
        requests.delete(url, headers=self._headers())

    def size(self, name):
        name = name.replace('\\', '/')
        url = f"{self.base_url}/object/{self.bucket}/{name}"
        r = requests.head(url, headers=self._headers())
        return int(r.headers.get('Content-Length', 0))
