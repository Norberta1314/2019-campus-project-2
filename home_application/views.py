# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import datetime
import json
import operator

from django.core.files.storage import DefaultStorage
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db import transaction
from django.db.models import Q
from django.http import JsonResponse, response, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET, require_http_methods
from django.views.generic import View

from account.decorators import login_exempt
from bkoauth.jwt_client import JWTClient
from bkoauth.utils import transform_uin
from common.context_processors import mysetting
from common.mymako import render_mako_context, render_json
from bkoauth.client import oauth_client
import logging
# 开发框架中通过中间件默认是需要登录态的，如有不需要登录的，可添加装饰器login_exempt【装饰器引入from account.decorators import login_exempt】
from common.utils import html_escape
from home_application.decorators import require_admin, require_head
from home_application.models import Organizations, Awards, Attachment, MyApply
from home_application.utils import valid_organization, valid_award, valid_apply, valid_decide, is_organ_head, \
    get_my_apply, get_my_not_apply, get_my_check, is_head, InvalidData
from functools import reduce


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
组织管理api {start}
"""

"""
@api {get} /user
@apiDescription 获取用户信息
@apiGroup all user
@apiSuccessExample {json} Success-Response:
    {

        'nick': 用户昵称,
        'avatar': 用户头像,
        'permission': [
            'admin',
            'head',
            'apply'
        ]
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
    if is_head(user, user_qq):
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


@require_admin
@require_POST
def create_organization(request):
    data = {}
    try:
        data = json.loads(request.body)
        valid_organization(data)
    except Exception as e:
        logging.debug(u'%s' % e)
        return HttpResponse(status=422)

    try:
        Organizations.objects.create_organization(data, request.user)
    except Exception as e:
        logging.debug(u'%s' % e)
        return HttpResponse(status=400)

    return HttpResponse(status=201)


"""
分发 get delete put请求
"""


class AdminRequire(object):
    @classmethod
    def as_view(cls, **initkwargs):
        view = super(AdminRequire, cls).as_view(**initkwargs)
        return require_admin(view)


class OrganizationView(AdminRequire, View):
    http_method_names = ['get', 'delete', 'put']

    def get(self, request, organization_id):
        return get_organization(request, organization_id)

    def delete(self, request, organization_id):
        return del_organization(request, organization_id)

    def put(self, request, organization_id):
        return update_organiztion(request, organization_id)


@require_http_methods(["GET", "DELETE", "PUT"])
def organization_get_put_delete(request, organization_id):
    if not request.user.is_admin():
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
        "counts": "xxxx",
        "organizations":  [{
            id: 'xxx'
            name: '蓝鲸'，
            head: ['xxx', 'xxx'],
            eva_member: ['xxxx','xxx'],
            create_time: 'xxxx'
        }]
    }
"""


@require_admin
@require_GET
def organizations(request):
    organization_all = Organizations.objects.filter(soft_del=False).order_by('id').all()
    paginator = Paginator(organization_all, 10)
    page = request.GET.get('page', 1)
    try:
        organizations = paginator.page(page)
    except PageNotAnInteger:
        organizations = paginator.page(1)
    except EmptyPage:
        organizations = paginator.page(paginator.num_pages)
    return render_json({'counts': paginator.count,
                        'organizations': Organizations.to_array(organizations)})


"""
@api {GET} /organization/:id
@apiDescription 查询组织
@apiGroup admin

@apiParam {String} id 组织id
@apiSuccessExample {json} Success-Response:
    {

        id: 'xxx',
        name: '蓝鲸'，
        head: ['xxx', 'xxx'],
        eva_member: ['xxxx','xxx'],
        create_time: 'xxxx'
    }
"""


def get_organization(request, organization_id):
    try:
        organization = Organizations.objects.filter(
            soft_del=False).get(id=organization_id)
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
        data = json.loads(request.body)
        valid_organization(data)
    except Exception as e:
        logging.debug(u'%s' % e)
        return HttpResponse(status=422)

    organization = {}
    try:
        organization = Organizations.objects.filter(
            soft_del=False).get(id=organization_id)
        Organizations.objects.update_organization(
            organization, data, request.user)
    except Exception as e:
        logging.debug(u'%s' % e)

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
        organization = Organizations.objects.filter(
            soft_del=False).get(id=organization_id)
        organization.delete()
    except Exception as e:
        logging.debug(u'%s' % e)
        return HttpResponse(status=410)

    return HttpResponse(status=204, content=u'删除成功')


"""
组织管理api {end}
"""


"""
奖项管理api {start}
"""


"""
@api {POST} /award
@apiDescription 创建一个奖项
@apiGroup admin

@apiParam {String} name 奖项名称 非法字符过滤
@apiParam {String}  content 评价条件 需要xss过滤
@apiParam {String}  level 奖项级别 0: 中心级 1：部门级 2：小组级 4：公司级
@apiParam {Number}  organization_id 所属组织id
@apiParam {String}  start_time 开始时间
@apiParam {String}  end_time 结束时间
@apiParam {Bool}  have_attachment 是否允许附件
@apiParam {Bool}  is_active 是否生效

@apiGroup admin

@apiParamExample {json} Request-Example:
    {
        name: "蓝鲸",
        content: "xxxxxx", // 富文本
        level: "0",
        organization_id: "23",
        start_time: "2014-12-31 18:20:1",
        end_time: "2014-12-31 18:20:1",
        have_attachment: true,
        is_active: true,
    }
"""


@require_POST
@require_admin
def create_award(request):
    data = {}
    try:
        data = json.loads(request.body)
        valid_award(data)
    except Exception as e:
        logging.debug(u'%s' % e)

        return HttpResponse(status=422)

    try:
        Awards.objects.create(**data)
    except Exception as e:
        logging.debug(u'%s' % e)

        return HttpResponse(status=400)

    return HttpResponse(status=201)


"""
分发 get delete put请求
"""


class AwardView(AdminRequire, View):
    http_method_names = ['get', 'delete', 'put']

    def get(self, request, organization_id):
        return get_award(request, organization_id)

    def delete(self, request, organization_id):
        return del_award(request, organization_id)

    def put(self, request, organization_id):
        return update_award(request, organization_id)


"""
@api {GET} /awards?page=?
@apiDescription 查询奖项
@apiGroup admin

@apiParam {String} page 第几页 不存在为第一页
@apiParam {Number} organization 查询参数 可选 所属组织
@apiParam {Number} apply_award 查询参数 可选 申请奖项
@apiParam {Number} check_state 查询参数 可选 审核状态 1 True 0 False
@apiParam {Number} start_time 查询参数 可选
@apiParam {Number} end_time 查询参数 可选
@apiSuccessExample {json} Success-Response:
    {
        "counts": "15",
        "awards":  [{
            id: 'xxx'
            name: '季度之星'
            organization: '蓝鲸'，
            level: '0'，
            is_active: True，
            start_time: '2014-12-31 18:20:1'，
            apply_count: '10'，
            apply_award_count: '10'，
        }]
    }
"""


@require_admin
@require_GET
def awards(request):
    # 过滤字段
    organization_f = request.GET.get('organization')
    apply_award_f = request.GET.get('apply_award')
    check_state_f = request.GET.get('check_state')
    start_time_f = request.GET.get('start_time')
    end_time_f = request.GET.get('end_time')
    query_list = []

    if organization_f is not None:
        query_list.append(Q(organization__name__contains=organization_f))
    if apply_award_f is not None:
        query_list.append(Q(name__contains=apply_award_f))
    if check_state_f is not None:
        check_state_f = True if check_state_f == '1' else False
        query_list.append(Q(is_active=check_state_f))
    if start_time_f is not None and end_time_f is not None:
        query_list.append(Q(start_time__gt=datetime.datetime.strptime(
            start_time_f, "%Y-%m-%d")) & Q(end_time__lt=datetime.datetime.strptime(end_time_f, "%Y-%m-%d")))
    if len(query_list) > 0:
        award_all = Awards.objects.filter(
            reduce(
                operator.or_,
                query_list),
            soft_del=False).order_by('-id').all()
    else:
        award_all = Awards.objects.filter(soft_del=False).order_by('-id').all()
    paginator = Paginator(award_all, 10)
    page = request.GET.get('page', 1)
    try:
        awards = paginator.page(page)
    except PageNotAnInteger:
        awards = paginator.page(1)
    except EmptyPage:
        awards = paginator.page(paginator.count)
    return render_json(
        {'counts': paginator.count, 'awards': Awards.to_array(awards)})


"""
@api {GET} /award/:id
@apiDescription 查询奖项
@apiGroup admin

@apiParam {Number} id 奖项id
@apiSuccessExample {json} Success-Response:
    {
        id: 'xxx'
        name: '季度之星'
        organization: '蓝鲸'，
        content: 'xxxxxx'，
        heads: ['xxx', 'xxxx']，
        level: '0'，
        is_active: True，
        start_time: '2014-12-31 18:20:1'，
        end_time: '2014-12-31 18:20:1'，
        applys: [{
            name: 'xxx',
            state: '1',
            apply_des: 'xxxxx',
            apply_time: '2014-12-31 18:20:1'，
            attachment: {
                "url": "http://pqg00vuko.bkt.clouddn.com/None/%E6%9C%AA%E5%91%BD%E5%90%8D%E8%A1%A8%E5%8D%95.png",
                "attachment_name": "未命名表单.png",
                "attachment_id": 1
            },
            remark: 'xxxx'
        }]
    }
"""


def get_award(request, award_id):
    try:
        award = Awards.objects.filter(soft_del=False).get(id=award_id)
    except Exception as e:
        return HttpResponse(status=404)

    return render_json(award.to_json())


"""
@api {PUT} /award/:id
@apiDescription 更新奖项信息
@apiGroup admin

@apiParam {String} name 奖项名称 非法字符过滤
@apiParam {String}  content 评价条件 需要xss过滤
@apiParam {String}  level 奖项级别 0: 中心级 1：部门级 2：小组级 4：公司级
@apiParam {Number}  organization_id 所属组织id
@apiParam {String}  start_time 开始时间
@apiParam {String}  end_time 结束时间
@apiParam {Bool}  have_attachment 是否允许附件
@apiParam {Bool}  is_active 是否生效


@apiParamExample {json} Request-Example:
    {
        name: "蓝鲸",
        content: "xxxxxx", // 富文本
        level: "0",
        organization_id: "23",
        start_time: "2014-12-31 18:20:1",
        end_time: "2014-12-31 18:20:1",
        have_attachment: true,
        is_active: true,
    }
"""


def update_award(request, award_id):
    data = {}
    try:
        data = json.loads(request.body)
        valid_award(data)
    except InvalidData as e:
        logging.debug(u'%s' % e)
        return HttpResponse(status=422, content=u'%s' % e.message)

    award = {}
    try:
        Awards.objects.filter(soft_del=False, id=award_id).update(**data)
    except Exception as e:
        return HttpResponse(status=400)

    return HttpResponse(status=201)


"""
@api {DELETE} /award/:id
@apiDescription 删除奖项
@apiGroup admin
"""


def del_award(request, award_id):
    award = {}
    try:
        award = Awards.objects.filter(soft_del=False).get(id=award_id)
        award.delete()
    except Exception as e:
        logging.debug(u'%s' % e)
        return HttpResponse(status=410)

    return HttpResponse(status=204, content=u'删除成功')


"""
@api {GET} /award/organizations
@apiDescription 查询组织名录
@apiGroup admin


@apiSuccessExample {json} Success-Response:
    {
        "result": "John",
        "message":  [{
            id: 'xxx'
            name: '蓝鲸'，
        }]
    }
"""


@require_admin
@require_GET
def get_award_organizations(request):
    try:
        organizations = Organizations.objects.filter(soft_del=False).all()
    except BaseException:
        return HttpResponse(status=404)
    ret = []
    for item in organizations:
        ret.append({
            'id': item.id,
            'name': item.name
        })
    return render_json(ret)


"""
@api {POST} /awards/clone
@apiDescription 批量克隆奖项
@apiGroup admin

@apiParam {String} name 奖项名称 非法字符过滤
@apiParam {Array}  content 评价条件 需要xss过滤
@apiParam {String}  level 奖项级别 0: 中心级 1：部门级 2：小组级 4：公司级
@apiParam {Number}  organization 所属组织id
@apiParam {String}  start_time 开始时间
@apiParam {String}  end_time 结束时间
@apiParam {Bool}  have_attachment 是否允许附件
@apiParam {Bool}  is_active 是否生效

@apiGroup admin

@apiParamExample {json} Request-Example:
    [{
        name: "蓝鲸",
        content: "xxxxxx", // 富文本
        level: "0",
        organization: "23",
        start_time: "2014-12-31 18:20:1",
        end_time: "2014-12-31 18:20:1",
        have_attachment: true,
        is_active: true,
    }]



"""


@require_POST
@require_admin
@transaction.atomic
def awards_clone(request):
    """
    需要事务保证批量操作
    :param request:
    :return:
    """
    data = {}
    try:
        data = json.loads(request.body)
        for item in data:
            valid_award(item)
    except InvalidData as e:
        logging.debug(u'%s' % e)
        return HttpResponse(status=422)

    try:
        for item in data:
            Awards.objects.create(**item)
    except Exception as e:
        logging.debug(u'%s' % e)
        return HttpResponse(status=400)

    return HttpResponse(status=201)


"""
奖项管理api {end}
"""


"""
我的申请api {start}
"""


"""
@api {GET} /my/applys?page=?
@apiDescription 我的申请list
@apiGroup apply

@apiParam {Number} page 第几页 无 默认第一页


@apiParam {Number} apply_award 查询参数 可选 申请奖项
@apiParam {Number} check_state 查询参数 可选 审核状态
@apiParam {Number} start_time 查询参数 可选
@apiParam {Number} end_time 查询参数 可选
@apiSuccessExample {json} Success-Response:
    {
        "counts": "15",
        "awards":  [{
            apply_id: 'xxx'
            apply_info: '季度之星'
            award_id: '12'，
            organization: 'xxxx'，
            apply_award: 'xxx'，
            award_state: True or False，
            state: '0'，-1 未申报 0 申报中 1 未通过 2 已通过 3未获奖 4 已获奖
            apply_time: '2014-12-31 18:20:1'，
        },
        {
            award_id: 'xx',
            organization: 'xxx',
            apply_award: 'xxx',
            award_state: 'xxx',
            state: 'xxx',
        }
        ]
    }
"""


@require_GET
def my_applys(request):
    """
    对django 模型跨表查询 不怎么熟悉 暂且使用 后期视性能优化
    :param request:
    :return:
    """
    # 过滤字段获取
    apply_award_f = request.GET.get('apply_award')
    check_state_f = request.GET.get('check_state')
    start_time_f = request.GET.get('start_time')
    end_time_f = request.GET.get('end_time')
    apply_query_list = []
    apply_query_sql_where = ''
    temp_sql_list = []

    if apply_award_f is not None:
        apply_query_sql_where += '`awards`.`name` like %s '
        temp_sql_list.append('`awards`.`name` like %s ')
        apply_query_list.append('%%%s%%' % apply_award_f)
        # apply_query_list.append(Q(name__contains=apply_award_f))

    uin = request.COOKIES.get('uin', '')
    user_qq = transform_uin(uin)
    user = request.user
    if check_state_f is not None:
        if check_state_f == '-1':
            temp_sql_list.append('`my_applys`.`state` is null ')
            # apply_query_list.append(Q(state=None))
        else:
            temp_sql_list.append('`my_applys`.`state` = %s')
            apply_query_list.append(check_state_f)
    if start_time_f is not None and end_time_f is not None:
        apply_query_sql_where += 'or `my_applys`.`apply_time` BETWEEN %s AND %s'
        temp_sql_list.append('`my_applys`.`apply_time` BETWEEN %s AND %s')
        apply_query_list.append(datetime.datetime.strptime(
            start_time_f, "%Y-%m-%d"))
        apply_query_list.append(datetime.datetime.strptime(
            end_time_f, "%Y-%m-%d"))
    if len(apply_query_list) > 0 or check_state_f is not None:
        apply_query_sql_where = ' where (' + ' or '.join(temp_sql_list) + ') and'
    else:
        apply_query_sql_where = ' where '
    applys = get_my_apply(
        user,
        user_qq,
        apply_query_list,
        apply_query_sql_where
        )
    paginator = Paginator(applys, 10)
    page = request.GET.get('page', 1)
    try:
        my_applys = paginator.page(page)
    except PageNotAnInteger:
        my_applys = paginator.page(1)
    except EmptyPage:
        my_applys = paginator.page(paginator.count)

    return render_json(
        {'counts': paginator.count, 'my_applys': my_applys.object_list})


class MyApplyView(AdminRequire, View):
    http_method_names = ['get', 'put', 'post']

    def get(self, request, id):
        return get_myapply(request, id)

    def post(self, request, id):
        return apply_award(request, id)

    def put(self, request, id):
        return update_myapply(request, id)


"""
@api {POST} /my/apply/:id
@apiDescription 申请一个奖项
@apiGroup admin

@apiParam {Number} id 申请的奖项id
@apiParam {String}  apply_info 申报人/团队 需要xss过滤
@apiParam {String}  apply_des 事迹介绍
@apiParam {Number}  attachment_id 附件id 无就-1


@apiGroup apply

@apiParamExample {json} Request-Example:
    {
        apply_info: "申报人/团队", 非法字符校验
        apply_des: "事迹介绍", // xss 过滤 非法字符校验
        attachment_id: "233",
    }
"""


def apply_award(request, award_id):
    data = {}
    try:
        data = json.loads(request.body)
        valid_apply(data)
    except InvalidData as e:
        logging.debug(u'%s' % e)
        return HttpResponse(status=422, content=u'%s' % e.message)
    try:
        if data['attachment_id'] == -1:
            del data['attachment_id']
            MyApply.objects.create(
                award_id=award_id,
                user=request.user,
                **data)
        else:
            MyApply.objects.create(
                award_id=award_id,
                user=request.user,
                **data)
    except Exception as e:
        logging.debug(u'%s' % e)
        return HttpResponse(status=400)

    return HttpResponse(status=201)


"""
@api {POST} /attachenment
@apiDescription 上传附件

@apiParam {File} file 上传的文件
@apiGroup apply


@apiSuccessExample {json} Success-Response:
    {
    "url": "http://pqg00vuko.bkt.clouddn.com/None/%E6%9C%AA%E5%91%BD%E5%90%8D%E8%A1%A8%E5%8D%95.png",
    "attachment_name": "未命名表单.png",
    "attachment_id": 1
    }
"""


@require_POST
def upload_attachment(request):
    # 限制上传附件小于 20M
    if request.FILES['file'].size >= 20971520:
        return HttpResponse(status=413, content=u'请求文件过大')
    storage = DefaultStorage()
    real_name = request.FILES['file'].name
    name = storage.save(
        '/%s/%s' %
        (request.user.id,
         request.FILES['file'].name),
        request.FILES['file'])
    try:
        attachment = Attachment.objects.create(real_name=real_name, path=name)
    except BaseException:
        return HttpResponse(status=201)

    url = storage.url(name)
    ret = {
        'url': url,
        'attachment_name': real_name,
        'attachment_id': attachment.id
    }
    return render_json(ret)


"""
@api {GET} /myapply/award/:id
@apiDescription 申请查询奖项详细信息
@apiGroup apply

@apiParam {Number} id 奖项id
@apiSuccessExample {json} Success-Response:
    {
        id: 'xxx'
        name: '季度之星'
        organization: '蓝鲸'，
        content: 'xxxxxx'，
        heads: ['xxx', 'xxxx']，
        level: '0'，
        is_active: True，
        start_time: '2014-12-31 18:20:1'，
        end_time: '2014-12-31 18:20:1'，
        have_attachment: 'true，

    }
"""


@require_GET
def get_apply_award(request, award_id):
    try:
        award = Awards.objects.get(id=award_id)
    except Exception as e:
        return HttpResponse(status=404)
    ret = award.to_json()
    del ret['applys']
    return render_json(ret)


"""
@api {PUT} /my/apply/:id
@apiDescription 更新我的申请 兼容重新申请
@apiGroup apply

@apiParam {Number} id 申请id
@apiParam {String}  apply_info 申报人/团队 需要xss过滤
@apiParam {String}  apply_des 事迹介绍
@apiParam {Number}  attachment_id 附件id 无就-1


@apiParamExample {json} Request-Example:
    {
        apply_info: "申报人/团队", 非法字符校验
        apply_des: "事迹介绍", // xss 过滤 非法字符校验
        attachment_id: "233",
        is_reapply: true
    }
"""


def update_myapply(request, myapply_id):
    data = {}
    try:
        data = json.loads(request.body)
        valid_apply(data)
    except InvalidData as e:
        logging.debug(u'%s' % e)
        return HttpResponse(status=422)
    try:
        print data
        myapply = MyApply.objects.get(id=myapply_id)
        if data['is_reapply']:
            if myapply.state == '1':
                del data['is_reapply']
                if data['attachment_id'] == -1:
                    del data['attachment_id']
                    MyApply.objects.filter(id=myapply_id).update(
                        state=u'0',
                        **data)
                else:
                    MyApply.objects.filter(id=myapply_id).update(
                        state=u'0',
                        **data)
        else:
            del data['is_reapply']

            if data['attachment_id'] == -1:
                del data['attachment_id']

                MyApply.objects.filter(id=myapply_id).update(**data)
            else:
                MyApply.objects.filter(id=myapply_id).update(**data)
    except Exception as e:
        return HttpResponse(status=400, content=u'%s' % e)

    return HttpResponse(status=201)


"""
@api {GET} /my/apply/:id
@apiDescription 我的申请查询
@apiGroup apply

@apiParam {Number} id 我的申请id
@apiSuccessExample {json} Success-Response:
   {
    award: {
            id: 'xxx'
            name: '季度之星'
            organization: '蓝鲸'，
            content: 'xxxxxx'，
            heads: ['xxx', 'xxxx']，
            level: '0'，
            is_active: True，
            start_time: '2014-12-31 18:20:1'，
            end_time: '2014-12-31 18:20:1'，
        },
    myapply: {
        apply_id: 申请id
        apply_info: "申报人/团队", 非法字符校验
        content: "事迹介绍", // xss 过滤 非法字符校验
        state: '1',
        remark: 'xxxx',
        attachment:     {
            "url": "http://pqg00vuko.bkt.clouddn.com/None/%E6%9C%AA%E5%91%BD%E5%90%8D%E8%A1%A8%E5%8D%95.png",
            "attachment_name": "未命名表单.png",
            "attachment_id": 1
         },
    }

   }

"""


def get_myapply(request, myapply_id):
    try:
        myapply = MyApply.objects.get(id=myapply_id)
    except Exception as e:
        return HttpResponse(status=404)
    return render_json(myapply.to_json())


"""
我的申请api {end}
"""


"""
我的审核api {start}
"""


"""
@api {GET} /my/checks?page=?
@apiDescription 查询我的审核
@apiGroup head

@apiParam {Number} page 第几页 无 默认第一页
@apiSuccessExample {json} Success-Response:
    {
        "counts": "15",
        "awards":  [{
            apply_id: 'xxx'
            apply_info: '季度之星'
            award_id: '12'，
            award_name: 'xxxx'，
            organization: 'xxxx'，
            apply_award: 'xxx'，
            award_state: True or False，
            state: '0' 0 申报中 1 未通过 2 已通过 3未获奖 4 已获奖
            apply_time: '2014-12-31 18:20:1'，
            op_user: 'xxxxx'
        }]
    }
"""


@require_head
def get_check_list(request):
    uin = request.COOKIES.get('uin', '')
    user_qq = transform_uin(uin)
    user = request.user
    check_list = get_my_check(user, user_qq)
    paginator = Paginator(check_list, 10)
    page = request.GET.get('page', 1)
    try:
        my_checks = paginator.page(page)
    except PageNotAnInteger:
        my_checks = paginator.page(1)
    except EmptyPage:
        my_checks = paginator.page(paginator.count)
    return render_json(
        {'counts': paginator.count, 'my_checks': my_checks.object_list})


"""
@api {PUT} /my/check/reject/:apply_id
@apiDescription 驳回申请
@apiGroup head

@apiParam {Number} id 申请id


"""


@require_http_methods(['PUT'])
@require_head
def reject(request, apply_id):
    try:
        apply = MyApply.objects.get(id=apply_id)
    except Exception as e:
        return HttpResponse(status=404)

    uin = request.COOKIES.get('uin', '')
    user_qq = transform_uin(uin)
    user = request.user
    if not is_organ_head(user, user_qq, apply.award.organization):
        return HttpResponse(status=401)
    try:
        apply.reject()
    except Exception as e:
        logging.debug(u'%s' % e)
        return HttpResponse(status=403)
    return HttpResponse(status=201)


"""
@api {PUT} /my/check/pass/:apply_id
@apiDescription 通过申请
@apiGroup head

@apiParam {Number} id 申请id
"""


@require_head
@require_http_methods(['PUT'])
def pass_check(request, apply_id):
    try:
        apply = MyApply.objects.get(id=apply_id)
    except Exception as e:
        return HttpResponse(status=404)

    uin = request.COOKIES.get('uin', '')
    user_qq = transform_uin(uin)
    user = request.user
    if not is_organ_head(user, user_qq, apply.award.organization):
        return HttpResponse(status=401)
    try:
        apply.pass_check()
    except Exception as e:
        logging.debug(u'%s' % e)
        return HttpResponse(status=403)
    return HttpResponse(status=201)


"""
@api {PUT} /my/check/award/:apply_id
@apiDescription 评奖
@apiGroup head

@apiParam {Number} id 申请id
@apiParamExample {json} Request-Example:
    {
        remark: '评语'
        state: "3/4" 3 未获奖 4 未获奖
    }
"""


@require_http_methods(['PUT'])
@require_head
def decide_award(request, apply_id):
    try:
        apply = MyApply.objects.get(id=apply_id)
    except Exception as e:
        return HttpResponse(status=404)

    uin = request.COOKIES.get('uin', '')
    user_qq = transform_uin(uin)
    user = request.user
    if not is_organ_head(user, user_qq, apply.award.organiztion):
        return HttpResponse(status=401)

    try:
        data = json.loads(request.body)
        valid_decide(data)
    except InvalidData as e:
        logging.debug(u'%s' % e)

        return HttpResponse(status=422)

    try:
        apply.decide_award(data)
    except BaseException:
        return HttpResponse(status=403)

    return HttpResponse(status=201)


"""
我的审核api {end}
"""


"""
首页api {start}
"""


"""
@api {GET} /index/applys
@apiDescription 首页可以申请list
@apiGroup apply

@apiSuccessExample {json} Success-Response:
    {
        "counts": "15",
        "awards":  [
        {
            award_id: 'xx',
            organization: 'xxx',
            apply_award: 'xxx',
            award_state: 'xxx',
            state: 'xxx',
            count: 'xxx'
        }
        ]
    }
"""


@require_GET
def can_apply_list(request):
    uin = request.COOKIES.get('uin', '')
    user_qq = transform_uin(uin)
    user = request.user
    can_applys = get_my_not_apply(user, user_qq)
    return render_json(can_applys)


"""
@api {GET} /index/last
@apiDescription 历史获奖
@apiGroup apply

@apiSuccessExample {json} Success-Response:
    {
        "counts": "15",
        "awards":  [
        {
            award_id: 'xx',
            organization: 'xxx',
            apply_award: 'xxx',
            award_state: 'xxx',
            state: 'xxx',
            count: 'xxx'
        }
        ]
    }
"""


@require_GET
def last_award_list(request):
    user = request.user
    last_awards = MyApply.objects.filter(
        user=user, state=u'4').order_by('apply_time').all()
    ret = []
    for item in last_awards:
        ret.append(item.to_json())
    return render_json(ret)


"""
首页api {end}
"""
