# -*- coding: utf-8 -*-
from django.conf.urls import patterns

urlpatterns = patterns(
    'home_application.views',
    # 首页--your index
    (r'^$', 'home'),
    (r'^dev_guide/$', 'dev_guide'),
    (r'^contact/$', 'contact'),
    (r'^organization/$', 'create_organization'),
    (r'^organization/([0-9]{1,})$', 'update_organiztion'),
    (r'^organization/del/([0-9]{1,})$', 'del_organization'),
)
