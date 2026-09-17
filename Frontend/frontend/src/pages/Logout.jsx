import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`access token : ${localStorage.getItem("accessToken")}`);
    
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    console.log(`logout is been clicked \n the access token : ${localStorage.getItem("accessToken")} ` );
    

    navigate("/login", { replace: true });
  }, [navigate]);

  return null;
}