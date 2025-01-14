import './App.css';
import Home from './Pages/Home'
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import Find from './Pages/Find';
import Following from './Pages/Following';
import Followers from './Pages/Followers';
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home></Home> } />
        <Route path="/login" element={ <Login></Login> } />
        <Route path="/signup" element={ <Signup></Signup> } />
        <Route path="/find" element={ <Find></Find> } />
        <Route path="/:username/following" element={ <Following></Following> } />
        <Route path="/:username/followers" element={ <Followers></Followers> } />
        <Route path="/:username" element={ <Profile></Profile> } />
      </Routes>
      
    </div>
  );
}

export default App;
