import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import PrivateRoute from './utils/PrivateRoute';
import Dashboard from './components/Employee/Dashboard';
import ManagerHome from './components/Manager/ManagerHome';
import ManagerLeaveReport from './components/Manager/ManagerReportPage';
import LeaveHistory from './components/Employee/HistoryModal';
import ManagerLeaveHistory from './components/Manager/LeaveHistory';
import PublicRoute from './utils/PublicRoute';



function App() {
  return (
    <Router>
            <Routes>
            <Route path="/register" element={<PublicRoute><Register/></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login/></PublicRoute>}/>
            <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}/> 
            <Route path="/manager/home" element={<PrivateRoute><ManagerHome/></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/managerhistoryleave" element={<PrivateRoute><ManagerLeaveHistory/></PrivateRoute>}/> 
                <Route path="/historyleave" element={<PrivateRoute><LeaveHistory/></PrivateRoute>}/> 
               
                <Route path="/manreport" element={<PrivateRoute><ManagerLeaveReport/></PrivateRoute>}/>
          
       </Routes>
  </Router>
  );
}

export default App;
