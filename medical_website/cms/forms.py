from django import forms
from .models import Prescription, Contact

class PrescriptionForm(forms.ModelForm):
    class Meta:
        model = Prescription
        fields = ['name', 'description', 'dosage']

class contactForm(forms.ModelForm):
    class Meta:
        model = Contact
        fields = ["name","email","number","dob"]


