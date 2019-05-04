# coding=utf-8
import json
import operator
import re

from django import forms

from common.pxfilter import XssHtml
from common.utils import html_escape
from home_application.models import MyApply, OrganizationsUser, Awards
from functools import reduce




class InvalidData(Exception):
    pass

def valid_organization(data):
    if data['name'] != '':
        pass
        # if re.match(
        #         r'^[\s\u4e00-\u9fa5a-z0-9_-]{0,}$',
        #         data['name']) is not None:
        #     raise Exception(u'含有非法字符')
    else:
        raise InvalidData(u'组织名字不能为空')

    if len(data['head']) == 0 or len(data['eva_member']) == 0:
        raise InvalidData(u'负责人或评价人员不能为空')

    data = json.loads(html_escape(json.dumps(data), is_json=True))


def valid_award(data):
    if data['name'] != '':
        pass
        # if re.match(
        #         r'^[\s\u4e00-\u9fa5a-z0-9_-]{0,}$',
        #         data['name']) is not None:
        #     raise Exception(u'含有非法字符')
    else:
        raise InvalidData(u'奖项名字不能为空')

    for k, v in data.items():
        if v is '' or v is None:
            raise InvalidData(u'不能为空')

    # 验证时xss富文本过滤
    parser = XssHtml()
    parser.feed(data['content'])
    parser.close()
    data['content'] = parser.getHtml()
    data['name'] = html_escape(data['name'])


def valid_apply(data):
    for k, v in data.items():
        if v is '' or v is None:
            raise InvalidData(u'不能为空')

    data = json.loads(html_escape(json.dumps(data), is_json=True))


def valid_decide(data):
    for k, v in data.items():
        if v is '' or v is None:
            raise InvalidData(u'不能为空')
    data = json.loads(html_escape(json.dumps(data), is_json=True))


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


def get_my_not_apply(self, user_qq, award_Q_list=[], apply_Q_list=[]):
    organs = OrganizationsUser.objects.filter(
        user=user_qq, type=u'1').all()
    awards = []
    for item in organs:
        if len(award_Q_list) > 0:
            temp = Awards.objects.filter(
                reduce(
                    operator.or_,
                    award_Q_list),
                organization=item.organization).all()
        else:
            temp = Awards.objects.filter(organization=item.organization).all()
        for item_t in temp:
            awards.append(item_t.id)

    applys = MyApply.objects.filter(award_id__in=awards, user=self).all()
    not_awards_id = [item.award.id for item in applys]
    not_awards = Awards.objects.in_bulk(not_awards_id)
    if len(apply_Q_list) > 0:
        not_awards = Awards.objects.exclude(
            id__in=not_awards_id).filter(
            reduce(
                operator.or_,
                apply_Q_list)).all()
    else:
        not_awards = Awards.objects.exclude(id__in=not_awards_id).order_by('-id').all()

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


def get_my_apply(self, user_qq,apply_Q_list, sql_where_list):
    awards = Awards.objects.raw('select `awards`.id from `awards` join `organizations` o on `awards`.`organization_id` = `o`.`id` join `home_application_organizationsuser` `hao` on `o`.`id` = `hao`.`organization_id` where `hao`.`type` = \'0\' and o.soft_del = 0')
    awards = [str(item.id) for item in awards]
    awards = ','.join(awards)
    awards = ' `awards`.`id` in (' + awards + ') '
    # if len(apply_Q_list) > 0:
    #     applys = MyApply.objects.filter(
    #         reduce(
    #             operator.or_,
    #             apply_Q_list),
    #         award_id__in=awards).order_by('-id').all()
    # else:
    #     applys = MyApply.objects.filter(award_id__in=awards).order_by('-id').all()
    print sql_where_list
    if len(apply_Q_list) > 0:
        applys = MyApply.objects.raw('select `awards`.`id`,`awards`.id as award_id, `my_applys`.id as apply_id, `my_applys`.`apply_info`, `o`.`name`, `awards`.`name` as apply_award, `awards`.`is_active` as award_state, `my_applys`.`state`, `my_applys`.`apply_time` from `awards` left join `my_applys` on `awards`.`id` = `my_applys`.`award_id` join organizations o on awards.organization_id = o.id' + sql_where_list + awards +' order by award_id desc', apply_Q_list)
    else:
        applys = MyApply.objects.raw('select `awards`.`id`,`awards`.id as award_id, `my_applys`.id as apply_id, `my_applys`.`apply_info`, `o`.`name`, `awards`.`name` as apply_award, `awards`.`is_active` as award_state, `my_applys`.`state`, `my_applys`.`apply_time` from `awards` left join `my_applys` on `awards`.`id` = `my_applys`.`award_id` join organizations o on awards.organization_id = o.id' + sql_where_list + awards +' and awards.soft_del = 0 order by award_id desc')
    ret = []
    print applys

    for item in applys:
        ret.append({
            'apply_id': item.apply_id,
            'apply_info': item.apply_info,
            'award_id': item.award_id,
            'organization': item.name,
            'apply_award': item.apply_award,
            'award_state': item.award_state,
            'state': item.state if item.state is not None else '-1',
            'apply_time': str(item.apply_time),
        })
    return ret


def get_my_check(self, user_qq):
    organs = OrganizationsUser.objects.filter(user=user_qq, type=u'0').all()
    awards = []
    for item in organs:
        temp = Awards.objects.filter(organization=item.organization).all()
        for item_t in temp:
            awards.append(item_t.id)

    applys = MyApply.objects.filter(award_id__in=awards).order_by('-id').all()
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
