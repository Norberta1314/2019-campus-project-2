# -*- coding: utf-8 -*-
from django.conf.urls import patterns

urlpatterns = patterns(
    'home_application.views',
    # 首页--your index
    (r'^$', 'home'),
    (r'^dev_guide/$', 'dev_guide'),
    (r'^contact/$', 'contact'),
    (r'^user$', 'user_info'),
    (r'^organization$', 'create_organization'),
    (r'^organization/([0-9]{1,})$', 'organization_get_put_delete'),
)
