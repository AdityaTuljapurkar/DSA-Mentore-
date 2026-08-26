import { Navigate, Outlet } from "react-router-dom";

export default function HomeRedirect(){
    const accessToken = localStorage.getItem('accessToken') 
    

    return accessToken ? <Outlet/> : <Navigate to={"/login"} replace />
}