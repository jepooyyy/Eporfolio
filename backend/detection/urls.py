from django.urls import path
from . import views

urlpatterns = [
    path('detect/', views.detect_persons, name='detect_persons'),
]