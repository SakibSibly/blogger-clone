import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import Layout from './Layouts/Layout';
import Home from './components/Home/Home';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Login/Login';
import BlogCreation from './components/BlogCreation/BlogCreation';

import './App.css'


function App() {

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/create-blog" element={<BlogCreation />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
