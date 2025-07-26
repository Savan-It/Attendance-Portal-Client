import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Employee from './Components/Employee';
import Header from './Components/Header';
import Home from './Components/Home';
import Salary from './Components/Salary';
import Upad from './Components/Upad';
import AllAttendance from './Components/AllAttendance';
import Login from './Components/Login';
import Site from './Components/Site/Site';
import ExpensePage from './Components/Site/ExpensePage';

function App() {
  const [isLogin, setIsLogin] = useState(() => {
    return localStorage.getItem('isLogin') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isLogin', isLogin);
  }, [isLogin]);

  return (
    <>
      {isLogin ? (
        <>
          <Header setIsLogin={setIsLogin} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/salary" element={<Salary />} />
            <Route path="/attendance-details" element={<AllAttendance />} />
            <Route path="/upad" element={<Upad />} />
            <Route path="/employee" element={<Employee />} />
            <Route path="/site" element={<Site />} />
            <Route path="/site/:id" element={<ExpensePage />} /> {/* ✅ New route */}
          </Routes>
        </>
      ) : (
        <Login setIsLogin={setIsLogin} />
      )}
    </>
  );
}

export default App;
