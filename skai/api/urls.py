from django.urls import path
from .views import query_nasa

urlpatterns = [
    path('query', query_nasa, name='query_nasa'),
]