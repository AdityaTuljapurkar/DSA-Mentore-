from django.contrib import admin
from . models import UserInfo , Dashboard , Statistics , Question

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

@admin.register(Question)
class questionModel(admin.ModelAdmin):
    list_display = ('question_containt','ques_no','topic','question','constraints','hint_1','hint_2','hint_3','timeLimit','memoryLimit','stdin')
    list_filter = ('ques_no','topic')
    search_fields = ('topic','ques_no','question')

