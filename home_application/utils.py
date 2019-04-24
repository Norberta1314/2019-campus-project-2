# coding=utf-8
import re

from django import forms


def valid_organization(data):
    if data['name'] != '':
        if re.match(r'^[\s\u4e00-\u9fa5a-z0-9_-]{0,}$', data['name']) is None:
            raise Exception(u'含有非法字符')
    else:
        raise Exception(u'组织名字不能为空')

    if len(data['head']) == 0 or len(data['eva_member']) == 0:
        raise Exception(u'负责人或评价人员不能为空')
