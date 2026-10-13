// {
//   "topic": "Dynamic Programming",
//   "subtopic": "auto",
//   "level": "learner",
//   "count": 3,
//   "language": "python",
//   "known_concepts": ["arrays", "basic recursion"],
//   "goal": "interview_prep",
//   "explanation_depth": "detailed",
//   "include_solution": true,
//   "hint_count": 3,
//   "note": "",
//   "already_generated": ["Fibonacci Number", "Climbing Stairs"],
//   "learning_path": ["recursion", "memoization", "tabulation", "space optimization"]
// }
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; 

export default function QuestionForm(){
    const [topic, setTopic] = useState("")
    const [subtopic, setSubtopic] = useState("")
    const [level, setLevel] = useState("learner")
    const [known_topics, setKnown_topics] = useState("")
    const [goal, setGoal] = useState("learn_basics")
    const [additional_info, setAdditional_info] = useState("")
    const [submitQuestion, setSubmitQuestion] = useState(false)
    const handle_submit = async (e)=>{
        e.preventDefault()
        try{
            setSubmitQuestion(true)
            const accesstkn = localStorage.getItem('accessToken')
            const payload = {
                'topic' : topic , 
                'subtopic' : subtopic , 
                'level' : level , 
                'known_topics' : known_topics , 
                'goal' : goal , 
                'additional_info' : additional_info , 
                
            } ;
            const url = 'http://127.0.0.1:8000/api/submit_question_form' ;
         const header = accesstkn ? {Authorization: `Bearer ${accesstkn}`} : {} ;
        const response = await axios.post(url,payload,{headers : header})
        console.log("question created sucessfully : " , response.data);
        
        }
        catch (error){
            console.log("error while submitting the answer : ",error);
        }
        finally{
            setSubmitQuestion(false)
        }
    }
    return (
        <>
        <div>
            <form onSubmit={handle_submit}>
                <fieldset>
                    <legend>Custom Question</legend>
                    <label htmlFor="topic">Topic : </label>
                    <input type="text "  onChange={(e)=>setTopic(e.target.value)} required  name="topic" id="topic" />
                    <label htmlFor = "subtopic">Subtopic : </label>
                    <input type="text"  onChange={(e)=>setSubtopic(e.target.value)} name="subtopic" id="subtopic" />
                    <label htmlFor="level" >level : </label>
                    <select id="level" onChange={(e)=>setLevel(e.target.value)} name="level" required>
                        <option value="learner">
                        Learner
                        </option>
                        <option value="easy">
                        Easy
                        </option>
                        <option value="medium">
                        Medium
                        </option>
                        <option value="hard">
                        Hard
                        </option>
                    </select>
                    <label htmlFor="known_topics"  >Known Topics</label>
                    <input name="known_topics" id="known_topics" onChange={(e)=>setKnown_topics(e.target.value)} ></input>
                    <label htmlFor="goal" onChange={(e)=>setGoal(e.target.value)}></label>
                    <select>
        <option value="learn_basics">learn basics</option>
        <option value="interview_prep">interview prep</option>
        <option value="college_exam">college exam</option>
        <option value="revision">revision</option>
                    </select>
                <label htmlFor="additional_info" >additional info</label>
                <input type="text" name="additional_topic" id="additional_topic" onChange={(e)=>setAdditional_info(e.target.value)} />
                    

                </fieldset>
                <button type="submit" disabled={submitQuestion}>Submit</button>
                
            </form>
        </div>
        </>
    )
}