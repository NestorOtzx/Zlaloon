import './App.css';
import Home from './Pages/Home'
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home></Home> } />
        <Route path="login" element={ <Login></Login> } />
        <Route path="signup" element={ <Signup></Signup> } />
      </Routes>
      
    </div>
  );
}

export default App;
