import { Routes, Route } from 'react-router-dom'
import { Navigate, useLocation } from 'react-router-dom';
import { getCookie } from './utils/cookie-manager';
import { decodeToken } from './utils/decoded-token';
import PropTypes from "prop-types";
// User Pages
import Anasayfa from './pages/Anasayfa';
import KayıtOl from './pages/Register/index';
import Giris from './pages/Login/index';
import Dashboard from './pages/Dashboard/index'
import ProfilePage from './pages/Dashboard/Profile/index';
import QuestionAddPage from './pages/Dashboard/Question/AddQuestion/index';
import AllQuestionPage from './pages/Dashboard/Question/AllQuestion/index';
// Admin Pages
import AdminAnasayfa from './pages/admin/anasayfa'
import AdminProfilePage from './pages/admin/profile';
import GetAllUsers from './pages/admin/UserDelete';







const userRole = () => {
  const token = getCookie("access_token");
  if (!token) {
    return null;
  }

  const decodedToken = decodeToken(token);
  return decodedToken ? decodedToken.role : null;
};

function PrivateRoute({ children }) {
  const from = useLocation().state;
  const role = userRole();

  if (!role) {
    return <Navigate to="/giris" replace state={{ from }} />;
  }

  if (role === 'admin') {
    return <Navigate to="/admin" replace state={{ from }} />;
  }

  return children;
}

function PublicRoute({ children }) {
  const from = useLocation().state;

  if (userRole()) {
    return <Navigate to="/dashboard" replace state={{ from }} />;
  }

  return children;
};

function AdminRoute({ children }) {
  const from = useLocation().state;
  const role = userRole();

  if (role !== 'admin') {
    return <Navigate to="/giris" replace state={{ from }} />;
  }

  return children;
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};


PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <>

      <Routes>

        {/* Public Route */}

        <Route path='/' element={<PublicRoute><Anasayfa></Anasayfa></PublicRoute>} />
        <Route path='/giris' element={<PublicRoute><Giris></Giris></PublicRoute>} />
        <Route path='/kayıt-ol' element={<PublicRoute><KayıtOl></KayıtOl></PublicRoute>} />

        {/* Private Route */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path='/dashboard/profile' element={<PrivateRoute><ProfilePage></ProfilePage></PrivateRoute>} />
        <Route path='/dashboard/question-add' element={<PrivateRoute><QuestionAddPage></QuestionAddPage></PrivateRoute>} />
        <Route path='/dashboard/AllQuestion' element={<PrivateRoute><AllQuestionPage></AllQuestionPage></PrivateRoute>} />


        {/* Admin Route */}
        <Route path='/admin' element={<AdminRoute><AdminAnasayfa></AdminAnasayfa></AdminRoute>} />
        <Route path='/admin/profile' element={<AdminRoute><AdminProfilePage></AdminProfilePage></AdminRoute>} />
        <Route path='/admin/getallusers' element={<AdminRoute><GetAllUsers></GetAllUsers></AdminRoute>} />
        
        
        
        
        
        </Routes>
      
    
    </>
  );
}

export default App;
