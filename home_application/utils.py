# coding=utf-8
import re

from django import forms

from common.pxfilter import XssHtml


def valid_organization(data):
    if data['name'] != '':
        if re.match(r'^[\s\u4e00-\u9fa5a-z0-9_-]{0,}$', data['name']) is None:
            raise Exception(u'含有非法字符')
    else:
        raise Exception(u'组织名字不能为空')

    if len(data['head']) == 0 or len(data['eva_member']) == 0:
        raise Exception(u'负责人或评价人员不能为空')


def valid_award(data):
    if data['name'] != '':
        if re.match(r'^[\s\u4e00-\u9fa5a-z0-9_-]{0,}$', data['name']) is None:
            raise Exception(u'含有非法字符')
    else:
        raise Exception(u'奖项名字不能为空')

    for k, v in data.items():
        if v is '' or v is None:
            raise Exception(u'不能为空')

    # 验证时xss富文本过滤
    parser = XssHtml()
    parser.feed(data['content'])
    parser.close()
    data['content'] = parser.getHtml()


def valid_apply(data):
    for k, v in data.items():
        if v is '' or v is None:
            raise Exception(u'不能为空')

    if re.match(
        r'^[\s\u4e00-\u9fa5a-z0-9_-]{0,}$',
        data['apply_info']) is None or re.match(
        r'^[\s\u4e00-\u9fa5a-z0-9_-]{0,}$',
            data['apply_des']) is None:
        raise Exception(u'含有非法字符')


def valid_decide(data):
    for k, v in data.items():
        if v is '' or v is None:
            raise Exception(u'不能为空')

    if re.match(
        r'^[\s\u4e00-\u9fa5a-z0-9_-]{0,}$',
        data['remark']) is None:
        raise Exception(u'含有非法字符')