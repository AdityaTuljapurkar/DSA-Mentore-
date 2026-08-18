import { useState } from "react";
import {useNavigate } from "react-router-dom";
import axios from "axios" ; 

export default function Login(){
    const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);  
  const navigate = useNavigate() ; 
  
  async function handleSubmit(event){
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
        const response =  await axios.post(
            "http://127.0.0.1:8000/api/login/", 
            {username , password}
        ) ; 
        localStorage.setItem("accessToken",response.data.access)
        localStorage.setItem("refreshToken", response.data.refresh)
        navigate("/dashboard")
    } catch(err){
        if (err.response?.status == 401){
            setError("Invalid username or password");
        }
        else {
            setError("could not connet to the server.") 
        }
    }
    finally{
        setLoading(false)
    }
  }

  return (
    <main>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}

