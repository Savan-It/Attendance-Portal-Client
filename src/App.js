import './App.css';
import Employee from './Components/Employee';
import Header from './Components/Header';
import Home from './Components/Home';
import Salary from './Components/Salary';
import { Routes, Route } from 'react-router-dom';
import Upad from './Components/Upad';
import AllAttendance from './Components/AllAttendance';


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/salary" element={<Salary />} />
        <Route path="/attendance-details" element={<AllAttendance />} />
        <Route path="/upad" element={<Upad />} />
        <Route path="/employee" element={<Employee />} />
      </Routes>
    </>

  );
}

export default App;
