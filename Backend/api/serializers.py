from rest_framework import serializers 

from .models import Question , Submitted_question

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question 
        fields = [
            'ques_no' , 'question' ,'question_containt' ,'constraints' , 'hint_1' , 'hint_2' , 'hint_3' ,'topic','timeLimit','memoryLimit','stdin'
        ]

class SubmittedQuestionSeralizer(serializers.ModelSerializer):
    class Meta:
        model = Submitted_question 
        fields = ['question_no','language','source_code','stdin','stdout','memeory','cpu_time','user_id']