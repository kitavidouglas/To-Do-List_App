import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import LoginForm from './components/LoginForm';
import WelcomePage from './components/WelcomePage';
import Home from './components/Home';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WelcomePage />} /> {/* Landing page */}
                <Route path="/signup" element={<SignUp />} /> {/* Sign-up form */}
                <Route path="/login" element={<LoginForm />} /> {/* Login form */}
                <Route path="/home" element={<Home />} /> {/* To-do list/home page */}
            </Routes>
        </Router>
    );
}

export default App;
