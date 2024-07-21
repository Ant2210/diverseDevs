from django.conf import settings


def travel_api_keys(request):
    return {
        'TRAVEL_API_KEY': settings.TRAVEL_API_KEY,
        'TRAVEL_API_SECRET': settings.TRAVEL_API_SECRET,
    }
