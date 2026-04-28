from django import forms
from .models import QueueTicket, ServiceType


class TakeQueueForm(forms.ModelForm):
    """Form untuk mengambil nomor antrian"""
    
    class Meta:
        model = QueueTicket
        fields = ['customer_name', 'customer_phone', 'service_type']
        widgets = {
            'customer_name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Masukkan nama sesuai KTP',
                'id': 'customer_name',
            }),
            'customer_phone': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Contoh: 081234567890',
                'id': 'customer_phone',
            }),
            'service_type': forms.Select(attrs={
                'class': 'form-select',
                'id': 'service_type',
            }),
        }
        labels = {
            'customer_name': 'NAMA LENGKAP',
            'customer_phone': 'NOMOR HP',
            'service_type': 'KEPERLUAN PENGAMBILAN',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['service_type'].empty_label = "Pilih keperluan..."
        self.fields['service_type'].queryset = ServiceType.objects.filter(is_active=True)

    def clean_customer_phone(self):
        phone = self.cleaned_data.get('customer_phone', '')
        import re
        phone = re.sub(r'[^0-9]', '', phone)
        if not re.match(r'^08[0-9]{8,11}$', phone):
            raise forms.ValidationError('Nomor tidak valid — gunakan format 08xxxxxxxxxx')
        return phone


class CheckStatusForm(forms.Form):
    """Form untuk cek status antrian"""
    query = forms.CharField(
        max_length=20,
        widget=forms.TextInput(attrs={
            'class': 'form-input search-input',
            'placeholder': 'Contoh: AB-9921 atau 0812...',
            'id': 'status_query',
        }),
        label='',
    )
