import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ConnectionCheck from './pages/ConnectionCheck'
import Homepage from './pages/homepage'
import Login from './pages/Login'
function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Homepage />}/>
      <Route path='check-django' element={<ConnectionCheck/>}/>
      <Route path='login' element={<Login />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
