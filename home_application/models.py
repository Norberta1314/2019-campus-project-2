# -*- coding: utf-8 -*-

# import from apps here


# import from lib
from django.db import models
from django.utils.translation import ugettext_lazy as _


from account.models import BkUser




class Organiztions(models.Model):
    name = models.CharField(max_length=255, verbose_name='所属组织')
    head = models.TextField(verbose_name='负责人员 json序列化')
    eva_member = models.TextField(verbose_name='参评人员 json序列化')
    update_user = models.ForeignKey(BkUser, verbose_name='更新人')
    update_time = models.DateField(auto_now=True, verbose_name='更新时间')
    create_time =models.DateField(auto_created=True, verbose_name='创建时间')
    soft_del = models.BooleanField(default=False, verbose_name='软删除')


    class Meta:
        db_table = 'organizations'





class Awards(models.Model):
    name = models.CharField(max_length=255, verbose_name='奖项名称')
    content = models.TextField(verbose_name='评价条件')
    LEVEL_CHOICES = (
        (u'0', '中心级'),
        (u'1', '部门级'),
        (u'2', '小组级'),
        (u'3', '公司级'),
    )
    level = models.CharField(max_length=1, choices=LEVEL_CHOICES, verbose_name='奖项级别')
    organiztion = models.ForeignKey(Organiztions, verbose_name='所属组织')
    start_time = models.DateField(verbose_name='开始时间')
    end_time = models.DateField(verbose_name='结束时间')
    have_attachment = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True, verbose_name='生效or过期')

    class Meta:
        db_table = 'awards'

class Attachment(models.Model):
    real_name = models.CharField(max_length=255, verbose_name='文件名称')
    path = models.FilePathField(verbose_name='文件地址')

    class Meta:
        db_table = 'attachment'


class MyApply(models.Model):
    award = models.ForeignKey(Awards, verbose_name='申请奖项')
    apply_info = models.CharField(max_length=255, verbose_name='申请人/团队')
    apply_des = models.TextField(verbose_name='事迹介绍')
    attachment = models.ForeignKey(Attachment, verbose_name='附件')

    STATE_CHOICES = (
        (u'0', '申报中'),
        (u'1', '未通过'),
        (u'2', '已通过'),
        (u'3', '未获奖'),
        (u'4', '已获奖'),
    )
    state = models.CharField(max_length=1, choices=STATE_CHOICES)
    remark = models.TextField('评语')
    apply_time = models.DateField(auto_created=True)

    class Meta:
        db_table = 'my_applys'


