# coding=utf-8
import re

from django import forms

from common.pxfilter import XssHtml
from home_application.models import MyApply, OrganizationsUser, Awards


def valid_organization(data):
    if data['name'] != '':
        pass
        # if re.match(
        #         r'^[\s\u4e00-\u9fa5a-z0-9_-]{0,}$',
        #         data['name']) is not None:
        #     raise Exception(u'含有非法字符')
    else:
        raise Exception(u'组织名字不能为空')

    if len(data['head']) == 0 or len(data['eva_member']) == 0:
        raise Exception(u'负责人或评价人员不能为空')


def valid_award(data):
    if data['name'] != '':
        pass
        # if re.match(
        #         r'^[\s\u4e00-\u9fa5a-z0-9_-]{0,}$',
        #         data['name']) is not None:
        #     raise Exception(u'含有非法字符')
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




def valid_decide(data):
    for k, v in data.items():
        if v is '' or v is None:
            raise Exception(u'不能为空')




def is_head(self, user_qq):
    """
    是否负责人
    """
    if self.is_superuser:
        return True
    return OrganizationsUser.objects.filter(
        user=user_qq, type=u'0').exists()


def is_organ_head(self, user_qq, organ):
    """
    是否该组织head
    :param user_qq:
    :return:
    """
    if self.is_superuser:
        return True
    return OrganizationsUser.objects.filter(
        user=user_qq, type=u'0', organization=organ).exists()


def get_my_not_apply(self, user_qq):
    organs = OrganizationsUser.objects.filter(
        user=user_qq, type=u'1').all()
    awards = []
    for item in organs:
        temp = Awards.objects.filter(organization=item.organization).all()
        for item_t in temp:
            awards.append(item_t.id)

    applys = MyApply.objects.filter(award_id__in=awards, user=self).all()
    not_awards_id = [item.award.id for item in applys]
    print not_awards_id
    # not_awards = Awards.objects.in_bulk(not_awards_id)
    not_awards = Awards.objects.exclude(id__in=not_awards_id).all()
    ret = []
    for item in not_awards:
        ret.append({
            'award_id': item.id,
            'organization': item.organization.name,
            'apply_award': item.name,
            'award_state': item.is_active,
            'state': -1,
            'count': MyApply.objects.filter(award=item).count()
        })
    return ret


def get_my_apply(self, user_qq):
    organs = OrganizationsUser.objects.filter(
        user=user_qq, type=u'1').all()
    awards = []
    for item in organs:
        temp = Awards.objects.filter(organization=item.organization).all()
        for item_t in temp:
            awards.append(item_t.id)

    applys = MyApply.objects.filter(award_id__in=awards).all()
    ret = []
    for item in applys:
        ret.append({
            'apply_id': item.id,
            'apply_info': item.apply_info,
            'award_id': item.award.id,
            'organization': item.award.organization.name,
            'apply_award': item.award.name,
            'award_state': item.award.is_active,
            'state': item.state,
            'apply_time': item.apply_time.strftime("%Y-%m-%d %H:%M:%S"),
        })
    return ret


def get_my_check(self, user_qq):
    organs = OrganizationsUser.objects.filter(user=user_qq, type=u'0').all()
    awards = []
    for item in organs:
        temp = Awards.objects.filter(organization=item.organization).all()
        for item_t in temp:
            awards.append(item_t.id)

    applys = MyApply.objects.filter(award_id__in=awards).all()
    ret = []
    for item in applys:
        ret.append({
            'apply_id': item.id,
            'apply_info': item.apply_info,
            'award_id': item.award.id,
            'organization': item.award.organization.name,
            'apply_award': item.award.name,
            'award_state': item.award.is_active,
            'state': item.state,
            'apply_time': item.apply_time.strftime("%Y-%m-%d %H:%M:%S"),
            'op_user': user_qq if self.get_full_name() is '' else self.get_full_name()
        })
    return ret
