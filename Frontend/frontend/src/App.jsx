import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ConnectionCheck from './pages/ConnectionCheck'
import Homepage from './pages/homepage'
import Login from './pages/Login';
import Dashboard from './Dashboard';
import RegisterUser from './pages/Register_user';
import HomeRedirect from './components/HomeRedirect';
import Logout from './pages/Logout';
import ProblemWorkspace from './pages/ProblemWorkspace';

function handelHomeRedirect(){
  const accessToken = localStorage.getItem("accessToken")
  return (
    <Navigate to={accessToken ? "/dashborad":"/login"}/> 
  )
}

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Homepage />}/>
      <Route path='check-django' element={<ConnectionCheck/>}/>
      <Route path='/login' element={<Login></Login>} ></Route>
      <Route path='/dashboard'element={<Dashboard/>}/>
      <Route path='/register' element={<RegisterUser/>}/>
      <Route path='/logout' element={<Logout/>}/>
      <Route path='/workspace' element={<ProblemWorkspace/>}/>
        <Route path='/problem/:id' element={<ProblemWorkspace/>}/>
      </Routes>
     
    </BrowserRouter>  
  )
}

export default App
