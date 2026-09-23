from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from zoneinfo import ZoneInfo 
from django_ckeditor_5.fields import CKEditor5Field

# Create your models here.
IST = ZoneInfo("Asia/Kolkata")

def get_ist_now():
    return timezone.now().astimezone(IST)
class UserInfo(models.Model):
    user=models.OneToOneField(User , on_delete=models.CASCADE)
    user_streak = models.IntegerField(default=0)
    last_activity = models.DateTimeField(default=get_ist_now,null=True,blank=True)
    
class Dashboard(models.Model):
    sr_no = models.AutoField(primary_key=True)
    username =  models.ForeignKey(User , on_delete=models.CASCADE)
    question = models.TextField()
    solution_note = models.TextField(help_text="at max 3 lines")
    topic= models.CharField(max_length = 150)
    subtopic = models.CharField(max_length=150)
    date = models.DateTimeField(default=get_ist_now)
    remark = models.TextField()

class Statistics(models.Model):
    total_questions = models.IntegerField()
    difficulty = models.CharField()
    topic= models.CharField(max_length = 150)
    subtopic = models.CharField(max_length=150)

class Question(models.Model):
    ques_no = models.AutoField(primary_key=True)
    question = models.TextField()
    question_containt = CKEditor5Field('Content', config_name='extends')
    constraints = models.CharField(max_length=500, blank=True)
    timeLimit = models.FloatField(blank=False,null=False)
    memoryLimit = models.IntegerField(blank=False,null=False)
    hint_1 = models.TextField(blank=True)
    hint_2 = models.TextField(blank=True)
    hint_3 = models.TextField(blank=True)
    topic = models.CharField(max_length=150)
    stdin = models.TextField(blank=True)

class Submitted_question(models.Model):
    question_no = models.ForeignKey(Question,on_delete=models.CASCADE)
    language = models.CharField(max_length=10)
    source_code =  models.TextField()
    stdin  = models.TextField()
    stdout = models.TextField()
    memory = models.CharField(max_length = 50)
    cpu_time = models.CharField(max_length = 50)
    user_id = models.ForeignKey(UserInfo,on_delete=models.CASCADE)
    
    
    
    
      





    
    


