# -*- coding: utf-8 -*-

# import from apps here


# import from lib
# ===============================================================================
from django.contrib import admin
# from apps.__.models import aaaa
#
# admin.site.register(aaaa)
# ===============================================================================
from home_application.models import Awards, Organizations, MyApply, Attachment, OrganizationsUser


class AwardAdmin(admin.ModelAdmin):
    pass


admin.site.register(Awards, AwardAdmin)


class OrganizationAdmin(admin.ModelAdmin):
    pass


admin.site.register(Organizations, OrganizationAdmin)


class MyApplyAdmin(admin.ModelAdmin):
    pass


admin.site.register(MyApply, MyApplyAdmin)


class AttachmentAdmin(admin.ModelAdmin):
    pass


admin.site.register(Attachment, AttachmentAdmin)


class OrganizationsUserAdmin(admin.ModelAdmin):
    pass


admin.site.register(OrganizationsUser, OrganizationsUserAdmin)
