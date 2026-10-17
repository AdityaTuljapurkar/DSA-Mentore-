from .models import Submitted_question , Question ,Dashboard


def status_stats(username):
    try : 
        print(f"[status_stats] fetching ....")
        solved = Dashboard.objects.filter(
            username = username ,
            status = True 
        ).count()

        not_solved =  Dashboard.objects.filter(
            username = username , 
            status = False
        ).count()

        return [solved,not_solved]

    except Exception as e : 
        print(f"[status_stats] error : {e}")
        return []

def subtopic_stats(username):
    try:
        print("[subtopic_stats] fetching ....")
        # Returns a list of unique subtopics, excluding None/empty
        subtopics = (
            Dashboard.objects.filter(username=username)
            .exclude(subtopic__isnull=True)
            .exclude(subtopic="")
            .values_list("subtopic", flat=True)
            .distinct()
        )
        arr_subtopics = list(subtopics)
        response_data  = {}
        for i in arr_subtopics : 
            count = Dashboard.objects.filter(
                username = username , 
                subtopic = i
            ).count()
            response_data[i] = count
        print(f"[subtopic_stats] final data :{response_data} ")
        return response_data 
    except Exception as e : 
        print(f"[subtopic_stats] error : {e} ")
        return {}
