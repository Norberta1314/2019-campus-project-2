# -*- coding: utf-8 -*-
import json

from django.http import JsonResponse, response, HttpResponse
from django.views.decorators.http import require_POST

from bkoauth.jwt_client import JWTClient
from common.mymako import render_mako_context
from bkoauth.client import oauth_client
import logging
# 开发框架中通过中间件默认是需要登录态的，如有不需要登录的，可添加装饰器login_exempt【装饰器引入from account.decorators import login_exempt】
from home_application.models import Organizations
from home_application.utils import valid_organization


def home(request):
    """
    首页
    """
    return render_mako_context(request, '/home_application/home.html')


def dev_guide(request):
    """
    开发指引
    """
    return render_mako_context(request, '/home_application/dev_guide.html')


def contact(request):
    """
    联系我们
    """
    return render_mako_context(request, '/home_application/contact.html')


"""
@api {POST} /ogranization
@apiName createOrganization
@apiGroup superAdmin

@apiParam {String} name 组织名称
@apiParam {Array}  head 负责人
@apiParam {Array}  eva_member 评议人员
@apiParamExample {json} Request-Example:
    {
        name: "蓝鲸",
        head: [
            "7047xxxxx",
            "2234xxxxx",
        ],
        eva_member: [
            "xxxxxx",
            "xxxxxx",
        ]
    }
"""


@require_POST
def create_organization(request):
    if not request.user.is_authenticated():
        return HttpResponse(status=401, content=u'无此权限')
    data = {}
    try:
        data = json.loads(request.body)
        valid_organization(data)
    except Exception as e:
        return HttpResponse(status=422, content=u'%s' % e.message)

    try:
        Organizations.objects.create_organization(data, request.user)
    except Exception as e:
        return HttpResponse(status=400, content=u'%s' % e)

    return HttpResponse(status=201)


@require_POST
def updage_organiztion(request):
    pass


@require_POST
def del_organiztion(request):
    pass
