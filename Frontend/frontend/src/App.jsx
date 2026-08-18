import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ConnectionCheck from './pages/ConnectionCheck'
import Homepage from './pages/homepage'
import Login from './pages/Login';
import Dashboard from './Dashboard';
import RegisterUser from './pages/Register_user';
function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Homepage />}/>
      <Route path='check-django' element={<ConnectionCheck/>}/>
      <Route path='/login' element={<Login></Login>} ></Route>
      <Route path='/dashboard'element={<Dashboard/>}/>
      <Route path='/register' element={<RegisterUser/>}/>
      </Routes>
     
    </BrowserRouter>  
  )
}

export default App
