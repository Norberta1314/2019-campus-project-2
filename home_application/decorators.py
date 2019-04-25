# coding=utf-8
from functools import wraps

from django.http import HttpResponse
from django.utils.decorators import available_attrs


def require_admin(func):
    """
    验证是否管理员装饰器
    :return:
    """
    @wraps(func, assigned=available_attrs(func))
    def inner(request, *args, **kwargs):
        if not request.user.is_admin():
            return HttpResponse(status=401, content=u'无此权限')
        return func(request, *args, **kwargs)
    return inner



def require_head(func):
    """
    todo : 待完成
    验证是否负责人
    :return:
    """
    @wraps(func, assigned=available_attrs(func))
    def inner(request, *args, **kwargs):
        if not request.user.is_admin():
            return HttpResponse(status=401, content=u'无此权限')
        return func(request, *args, **kwargs)
    return inner