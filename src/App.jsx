import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Quiz from './pages/Quiz';
import Report from './pages/Report';
import Navbar from './components/Navbar';
import './styles/dynamic.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="quiz-card">
            {/* <Navbar />*/}
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/quiz" element={<ProtectedRoute> <Quiz /> </ProtectedRoute>}/>
              <Route path="/report" element={<ProtectedRoute> <Report /> </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
