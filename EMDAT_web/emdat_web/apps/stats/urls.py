from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^emdat_output$', views.emdat_output, name='emdat_output'),
]
