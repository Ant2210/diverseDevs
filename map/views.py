from django.shortcuts import render

# Create your views here.
def map(request):
    """ A view to return the map.html page """
    return render(request, 'map/map.html')