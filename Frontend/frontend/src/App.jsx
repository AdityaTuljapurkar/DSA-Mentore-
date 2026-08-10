import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ConnectionCheck from './pages/ConnectionCheck'
import Homepage from './pages/homepage'
function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Homepage />}/>
      <Route path='check-django' element={<ConnectionCheck/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
