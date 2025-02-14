from django.shortcuts import render,redirect
from .models import Prescription

from .forms import PrescriptionForm

def homepage(request):
    return render(request, 'cms/home.html')

def about(request):
    return render(request, 'cms/about.html')

def contact(request):
    return render(request, 'cms/contact.html')


def prescriptions_list(request):
    prescriptions = Prescription.objects.all()
    return render(request, 'cms/prescriptions_list.html', {'prescriptions': prescriptions})


def add_prescription(request):
    if request.method == 'POST':
        form = PrescriptionForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('prescriptions_list')
    else:
        form = PrescriptionForm()
    return render(request, 'cms/add_prescription.html', {'form': form})

def chatbot(request):
    return render(request, 'cms/chatbot.html')


