from django.http import HttpResponse


class CorsMiddleware(object):

    def process_request(self, request):
        if request.method == 'OPTIONS':
            return HttpResponse()

    def process_response(self, request, response):
        response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT, DELETE'
        response['Access-Control-Max-Age'] = '1000'
        response['Access-Control-Allow-Headers'] = 'X-CSRFToken,X-Requested-With,Content-Type,Accept'
        response['Access-Control-ALLOW-Credentials'] = 'true'
        return response
