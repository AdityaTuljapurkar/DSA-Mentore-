import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";   
import { json } from "monaco-editor";

export default function Statistics() {
    
    const [subtopicStats, setsubtopicStats] = useState()
    const [statusStats, setStatusStats] = useState([])

    useEffect(() => {
        const accessTkn = localStorage.getItem('accessToken')
        const header =  accessTkn ? {Authorization : `Bearer ${accessTkn}`} : {}
        const fetchStatusData = async ()=>{
            const status = await axios.get('http://127.0.0.1:8000/api/status_stats_endpoint',{headers : header})
            setStatusStats(status.data)}
        
        const fetchSubtopicData = async()=>{
            const subtopic = await axios.get('http://127.0.0.1:8000/api/subtopic_stats_endpoint',{headers : header})
            setsubtopicStats(subtopic.data)}
        
        fetchStatusData() ;
        fetchSubtopicData() ;
    }, []) ; 

    return (
        <>
        <section>
            <p>
                status : {JSON.stringify(statusStats)}
            </p>
            <p>
                subtopic : {JSON.stringify(subtopicStats)}
            </p>
        </section>
        
        </>

    )    
}
