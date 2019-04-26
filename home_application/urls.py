# -*- coding: utf-8 -*-
from django.conf.urls import patterns

from home_application.views import OrganizationView, AwardView

urlpatterns = patterns(
    'home_application.views',
    # 首页--your index
    (r'^$', 'home'),
    (r'^dev_guide/$', 'dev_guide'),
    (r'^contact/$', 'contact'),
    (r'^user$', 'user_info'),
    (r'^organization$', 'create_organization'),
    (r'^organization/([0-9]{1,})$', OrganizationView.as_view()),
    (r'^organizations$', 'organizations'),
    (r'^award', 'create_award'),
    (r'^awards', 'awards'),
    (r'^award/([0-9]{1,})', AwardView.as_view()),
    (r'^attachment$', 'upload_attachment'),

)
