import './App.css';
import Navbar from './Navbar';
import Home from './Home';
import Footer from './Footer';
import Login from './Login';
import SignUpForm from './SignupForm'; // Sign Up form
import Events from './Events';
import AdminDashboard from './AdminDashboard';
import Developers from './Developers';
import Dashboard from './Dashboard';
import MyEvents from './MyEvents';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/events" element={<Events />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/myevents" element={<MyEvents />} />
      </Routes>

    </Router>



  );
}

export default App;


