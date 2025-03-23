import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Register from "./pages/Register"
import Login from "./pages/Login"
import Snippet from './pages/Snippet';


function App() {
  

  return (
    
    
    <Router>
      <Routes>
        <Route path ="/" element ={<Login />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/snippet" element={<Snippet />} />
        
      </Routes>
    </Router>
   
  )
}

export default App
