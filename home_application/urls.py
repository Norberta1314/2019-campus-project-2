# -*- coding: utf-8 -*-
from django.conf.urls import patterns

from home_application.views import OrganizationView, AwardView, MyApplyView

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
    (r'^award$', 'create_award'),
    (r'^award/organizations$', 'get_award_organizations'),
    (r'^awards$', 'awards'),
    (r'^award/([0-9]{1,})$', AwardView.as_view()),
    (r'^my/applys$', 'my_applys'),
    (r'^my/apply/([0-9]{1,})$', MyApplyView.as_view()),
    (r'^myapply/award/([0-9]{1,})$', 'get_apply_award'),
    (r'^my/checks$', 'get_check_list'),
    (r'^my/check/reject/([0-9]{1,})$', 'reject'),
    (r'^my/check/pass/([0-9]{1,})$', 'pass_check'),
    (r'^my/check/award/([0-9]{1,})$', 'decide_award'),
    (r'^index/applys$', 'can_apply_list'),
    (r'^index/last$', 'last_award_list'),
)
