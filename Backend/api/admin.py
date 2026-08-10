from django.contrib import admin
from . models import UserInfo , Dashboard , Statistics

@admin.register(UserInfo)
class UserInfoAdmin(admin.ModelAdmin):
    list_display = ('user','user_streak','last_activity')

@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display=('sr_no','question','solution_note','topic','subtopic','date','remark')
    list_filter = ('topic','subtopic','date')
    search_fields=('question','topic','subtopic')

@admin.register(Statistics)
class StatisticsAdmin(admin.ModelAdmin):
    list_display = ('total_questions','difficulty','topic','subtopic')
    list_filter = ('topic','subtopic','difficulty')


