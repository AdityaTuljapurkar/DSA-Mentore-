from rest_framework import serializers 

from .models import Question 

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question 
        fields = [
            'ques_no' , 'question' ,'question_containt' ,'constraints' , 'hint_1' , 'hint_2' , 'hint_3' ,'topic','timeLimit','memoryLimit','stdin'
        ]