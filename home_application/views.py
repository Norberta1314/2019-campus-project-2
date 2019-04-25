# -*- coding: utf-8 -*-
import json

from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import JsonResponse, response, HttpResponse
from django.views.decorators.http import require_POST, require_GET, require_http_methods

from bkoauth.jwt_client import JWTClient
from bkoauth.utils import transform_uin
from common.context_processors import mysetting
from common.mymako import render_mako_context, render_json
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
@api {get} /user
@apiDescription 获取用户信息
@apiGroup all user
@apiSuccessExample {json} Success-Response:
    {
        "result": "John",
        "message": {
            'nick': 用户昵称,
            'avatar': 用户头像,
            'permission': [
                'admin',
                'head',
                'apply'
            ]
        }
    }
"""


@require_GET
def user_info(request):
    uin = request.COOKIES.get('uin', '')
    user_qq = transform_uin(uin)
    user = request.user
    permission = ['apply']
    if user.is_admin():
        permission.append('admin')
    if user.is_head(user_qq):
        permission.append('head')

    setting = mysetting(request)
    data = {
        'nick': setting['NICK'],
        'avatar': setting['AVATAR'],
        'permission': permission
    }
    return render_json(data)


"""
@api {POST} /organization
@apiDescription 创建一个组织
@apiGroup admin

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
    if not request.user.is_admin():
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


"""
分发 get delete put请求
"""


@require_http_methods(["GET", "DELETE", "PUT"])
def organization_get_put_delete(request, organization_id):
    if  not request.user.is_admin():
        return HttpResponse(status=401, content=u'无此权限')
    if request.method == "GET":
        return get_organization(request, organization_id)
    if request.method == "DELETE":
        return del_organization(request, organization_id)
    if request.method == "PUT":
        return update_organiztion(request, organization_id)


"""
@api {GEt} /organizations?page=?
@apiDescription 查询组织
@apiGroup admin

@apiParam {String} page 第几页 不存在为第一页
@apiSuccessExample {json} Success-Response:
    {
        "result": "John",
        "message": {
            'organizations': [{
                id: 'xxx'
                name: '蓝鲸'，
                head: ['xxx', 'xxx'],
                eva_member: ['xxxx','xxx'],
                create_time: 'xxxx'
            }]
        }
    }
"""


@require_GET
def organizations(request):
    if  not request.user.is_admin():
        return HttpResponse(status=401, content=u'无此权限')
    organization_all = Organizations.objects.all()
    paginator = Paginator(organization_all, 10)
    page = request.GET.get('page', 1)
    try:
        organizations = paginator.page(page)
    except PageNotAnInteger:
        organizations = paginator.page(1)
    except EmptyPage:
        organizations = paginator.page(paginator.num_pages)
    return render_json({'organizations': Organizations.to_array(organizations)})



"""
@api {GEt} /organization/:id
@apiDescription 查询组织
@apiGroup admin

@apiParam {String} id 组织id
@apiSuccessExample {json} Success-Response:
    {
        "result": "John",
        "message": {
            id: 'xxx',
            name: '蓝鲸'，
            head: ['xxx', 'xxx'],
            eva_member: ['xxxx','xxx'],
            create_time: 'xxxx'
        }
    }
"""

def get_organization(request, organization_id):
    if  not request.user.is_admin():
        return HttpResponse(status=401, content=u'无此权限')
    try:
        organization = Organizations.objects.get(id=organization_id)
    except Exception as e:
        return HttpResponse(status=404)

    return render_json(organization.to_json())



"""
@api {PUT} /organization/:id 
@apiDescription 更新组织信息
@apiGroup admin

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


def update_organiztion(request, organization_id):
    data = {}
    try:
        data = json.dumps(request.body)
        valid_organization(data)
    except Exception as e:
        return HttpResponse(status=422, content=u'%s' % e.message)

    organization = {}
    try:
        organization = Organizations.objects.get(id=organization_id)
        Organizations.objects.update_organization(
            organization, data, request.user)
    except Exception as e:
        return HttpResponse(status=400)

    return HttpResponse(status=201)


"""
@api {DELETE} /organization/:id
@apiDescription 删除组织
@apiGroup admin
"""


def del_organization(request, organization_id):
    organization = {}
    try:
        organization = Organizations.objects.get(id=organization_id)
        organization.delete()
    except Exception as e:
        return HttpResponse(status=400)

    return HttpResponse(status=204, content=u'删除成功')
