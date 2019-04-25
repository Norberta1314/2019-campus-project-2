# -*- coding: utf-8 -*-

# import from apps here


# import from lib
from django.utils import timezone
from django.db import models, transaction
from django.utils.translation import ugettext_lazy as _

from account.models import BkUser


class OrganizationsManager(models.Manager):
    """
    启动事务 防止关联关系创建不成功 而组织已经插入
    """
    @transaction.atomic
    def create_organization(self, data, user):
        obj = self.create(name=data['name'], update_user=user)
        OrganizationsUser.create_heads(list(set(data['head'])), obj)
        OrganizationsUser.create_eva_members(
            list(set(data['eva_member'])), obj)
        return obj

    @transaction.atomic
    def update_organization(self, obj, data, user):
        obj.name = obj['name']
        obj.save()
        OrganizationsUser.del_eva_members(obj)
        OrganizationsUser.del_heads(obj)
        OrganizationsUser.create_heads(list(set(data['head'])), obj)
        OrganizationsUser.create_eva_members(
            list(set(data['eva_member'])), obj)


class Organizations(models.Model):
    name = models.CharField(max_length=255, verbose_name='所属组织', unique=True)
    """
        josn 序列化不好查询和删除 改为映射表
    """
    # head = models.TextField(verbose_name='负责人员 json序列化')
    # eva_member = models.TextField(verbose_name='参评人员 json序列化')
    update_user = models.ForeignKey(BkUser, verbose_name='更新人')
    update_time = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    create_time = models.DateTimeField(
        auto_created=True,
        default=timezone.now,
        verbose_name='创建时间')
    soft_del = models.BooleanField(default=False, verbose_name='软删除')

    objects = OrganizationsManager()

    class Meta:
        db_table = 'organizations'
        permissions = (
        )

    def delete(self, using=None):
        self.soft_del = True
        self.save()

    def get_head(self):
        pass

    def get_eva_member(self):
        pass

    @staticmethod
    def is_head(user):
        pass

    @staticmethod
    def is_eva_member(user):
        pass

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'head': OrganizationsUser.get_heads(self),
            'eva_members': OrganizationsUser.get_eva_members(self),
            'update_user': 'admin' if self.update_user.is_superuser else self.update_user.get_full_name(),
            'create_time': self.create_time.strftime("%Y-%m-%d %H:%M:%S")}

    @staticmethod
    def to_array(organizations):
        data = []

        for item in organizations:
            data.append({
                'id': item.id,
                'name': item.name,
                'head': OrganizationsUser.get_heads(item),
                'eva_members': OrganizationsUser.get_eva_members(item),
                'update_user': 'admin' if item.update_user.is_superuser else item.update_user.get_full_name(),
                'create_time': item.create_time.strftime("%Y-%m-%d %H:%M:%S")
            })
        return data


class OrganizationsUser(models.Model):
    organization = models.ForeignKey(Organizations)
    user = models.CharField(max_length=20, verbose_name='人员qq号')
    TYPE_CHOICES = (
        (u'0', u'负责人员'),
        (u'1', u'参评人员'),
    )
    type = models.CharField(max_length=1, choices=TYPE_CHOICES)

    class Meta:
        permissions = (

        )

    @classmethod
    def del_heads(cls, organization):
        cls.objects.filter(organization=organization, type=u'0').delete()

    @classmethod
    def del_eva_members(cls, organization):
        cls.objects.filter(organization=organization, type=u'1').delete()

    @classmethod
    def create_heads(cls, heads, organ):
        for item in heads:
            obj = cls(user=item, organization=organ, type=u'0')
            obj.save()

    @classmethod
    def create_eva_members(cls, eva_members, organ):
        for item in eva_members:
            obj = cls(user=item, organization=organ, type=u'1')
            obj.save()

    @classmethod
    def get_heads(cls, organization):
        heads = cls.objects.filter(organization=organization, type=u'0').all()
        ret = []
        for item in heads:
            ret.append(item.user)

        return ret

    @classmethod
    def get_eva_members(cls, organization):
        eva_members = cls.objects.filter(
            organization=organization, type=u'1').all()
        ret = []
        for item in eva_members:
            ret.append(item.user)

        return ret


class Awards(models.Model):
    name = models.CharField(max_length=255, verbose_name='奖项名称')
    content = models.TextField(verbose_name='评价条件')
    LEVEL_CHOICES = (
        (u'0', u'中心级'),
        (u'1', u'部门级'),
        (u'2', u'小组级'),
        (u'3', u'公司级'),
    )
    level = models.CharField(
        max_length=1,
        choices=LEVEL_CHOICES,
        verbose_name='奖项级别')
    organiztion = models.ForeignKey(Organizations, verbose_name='所属组织')
    start_time = models.DateTimeField(verbose_name='开始时间')
    end_time = models.DateTimeField(verbose_name='结束时间')
    have_attachment = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True, verbose_name='生效or过期')
    soft_del = models.BooleanField(default=False, verbose_name='软删除')

    class Meta:
        db_table = 'awards'
        permissions = (
            ("eva_awards", "Can Evaluation Award"),
        )

    def delete(self, using=None):
        self.soft_del = True
        self.save()

    @property
    def applys_count(self):
        return MyApply.objects.filter(award=self).count()

    @property
    def apply_award_count(self):
        return MyApply.objects.filter(award=self, state=u'4').count()

    def to_json(self):
        applys = Awards.get_award_applys(self)
        heads = OrganizationsUser.get_heads(self.organiztion)
        return {
            'id': self.id,
            'name': self.name,
            'organization': self.organization.name,
            'content': self.content,
            'heads': heads,
            'level': self.level,
            'is_active': self.is_active,
            'start_time': self.start_time.strftime("%Y-%m-%d %H:%M:%S"),
            'end_time': self.end_time.strftime("%Y-%m-%d %H:%M:%S"),
            'applys': applys
        }

    @staticmethod
    def to_array(awards):
        ret = []
        for item in awards:
            ret.append({
                'id': item.id,
                'name': item.name,
                'organization': item.organization.name,
                'level': item.level,
                'is_active': item.is_active,
                'start_time': item.start_time.strftime("%Y-%m-%d %H:%M:%S"),
                'apply_count': item.applys_count,
                'apply_award_count': item.apply_award_count
            })
        return ret


class Attachment(models.Model):
    real_name = models.CharField(max_length=255, verbose_name='文件名称')
    path = models.FilePathField(verbose_name='文件地址')

    class Meta:
        db_table = 'attachment'


class MyApply(models.Model):
    award = models.ForeignKey(Awards, verbose_name='申请奖项')
    apply_info = models.CharField(max_length=255, verbose_name='申请人/团队')
    apply_des = models.TextField(verbose_name='事迹介绍')
    attachment = models.ForeignKey(
        Attachment,
        verbose_name='附件',
        blank=True,
        default=-1)

    STATE_CHOICES = (
        (u'0', u'申报中'),
        (u'1', u'未通过'),
        (u'2', u'已通过'),
        (u'3', u'未获奖'),
        (u'4', u'已获奖'),
    )
    user = models.ForeignKey(BkUser)
    state = models.CharField(max_length=1, choices=STATE_CHOICES, default='0')
    remark = models.TextField(blank=True, verbose_name='评语')
    apply_time = models.DateTimeField(auto_created=True)
    soft_del = models.BooleanField(default=False, verbose_name='软删除')

    class Meta:
        db_table = 'my_applys'

    def delete(self, using=None):
        self.soft_del = True
        self.save()

    @classmethod
    def get_award_applys(cls, award):
        ret = []
        applys = cls.objects.filter(award=award).all()
        for item in applys:
            ret.append({
                'name': item.apply_info,
                'state': item.state,
                'apply_time': item.apply_time.strftime("%Y-%m-%d %H:%M:%S"),
                'apply_des': item.apply_des,
                'attachment': item.attachment.id if item.attachment is not None else -1,
                'remark': item.remark
            })
        return ret



