import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getCookie } from "./utils/cookie-manager";
import { decodeToken } from "./utils/decoded-token";
import PropTypes from "prop-types";
import { useNotifications } from "./context/NotificationContext";
import { useUser } from "./context/UserContext";

// User Pages
import Anasayfa from "./pages/Anasayfa";
import KayıtOl from "./pages/Register/index";
import Giris from "./pages/Login/index";
import Dashboard from "./pages/Dashboard/index";
import ProfilePage from "./pages/Dashboard/Profile/index";
import QuestionAddPage from "./pages/Dashboard/Question/AddQuestion/index";
import AllQuestionPage from "./pages/Dashboard/Question/AllQuestion/index";
import MyQuestion from "./pages/Dashboard/Question/MyQuestion/index";
import MyAnswers from "./pages/Dashboard/MyAnswers";
import FeedPage from "./pages/Dashboard/Feed";

// Admin Pages
import AdminAnasayfa from "./pages/admin/anasayfa";
import AdminProfilePage from "./pages/admin/profile";
import GetAllUsers from "./pages/admin/UserDelete";
import AnnouncementPage from "./pages/admin/Announcement";

// Sokcet İo
import { io } from "socket.io-client";

const userRole = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = getCookie("access_token");
      if (!token) {
        console.warn("access_token bulunamadı");
        resolve(null);
        return;
      }
      const decodedToken = decodeToken(token);
      resolve(decodedToken ? decodedToken.role : null);
    }, 100); // 100ms gecikme
  });
};

function PrivateRoute({ children }) {
  const from = useLocation().state;
  const role = userRole();

  if (!role) {
    return <Navigate to="/giris" replace state={{ from }} />;
  }

  if (role === "admin") {
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
}

function AdminRoute({ children }) {
  const from = useLocation().state;
  const role = userRole();

  if (role !== "admin") {
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
  const { setNotifications } = useNotifications();
  const { setLikeNotifications } = useNotifications();
  const { user } = useUser();

  useEffect(() => {
    const { REACT_APP_SOCKET_URL } = process.env;
    const socket = io(REACT_APP_SOCKET_URL);
    socket.on("announcement", (announcement) => {
      setNotifications((prev) => [...prev, announcement]);
      // Bildirimleri başka bir komponentte göstermek için state'i güncelliyoruz.
    });

    return () => {
      socket.off("announcement");
    };
  }, [setNotifications]);

  useEffect(() => {
    let userId;

    if (user) {
      userId = user.id;
    } else {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser && JSON.parse(storedUser);
      userId = parsedUser ? parsedUser.id : null;
    }

    if (userId) {
      const { REACT_APP_SOCKET_URL } = process.env;
      const socket = io(REACT_APP_SOCKET_URL, {
        query: { userId: userId },
      });

      socket.on("likeNotification", (data) => {
        console.log("appJs Data", data);
        setLikeNotifications((prev) => [...prev, data]);
        toast.info(`Beğenen: ${data.likedBy} soru: ${data.questionTitle}`);
      });

      return () => {
        socket.off("likeNotification");
      };
    }
  }, [user, setLikeNotifications]); //

  return (
    <>
      <Routes>
        {/* Public Route */}

        <Route
          path="/"
          element={
            <PublicRoute>
              <Anasayfa></Anasayfa>
            </PublicRoute>
          }
        />
        <Route
          path="/giris"
          element={
            <PublicRoute>
              <Giris></Giris>
            </PublicRoute>
          }
        />
        <Route
          path="/kayıt-ol"
          element={
            <PublicRoute>
              <KayıtOl></KayıtOl>
            </PublicRoute>
          }
        />

        {/* Private Route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <PrivateRoute>
              <ProfilePage></ProfilePage>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/question-add"
          element={
            <PrivateRoute>
              <QuestionAddPage></QuestionAddPage>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/AllQuestion"
          element={
            <PrivateRoute>
              <AllQuestionPage></AllQuestionPage>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/myQuestions"
          element={
            <PrivateRoute>
              <MyQuestion></MyQuestion>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/myAnswers"
          element={
            <PrivateRoute>
              <MyAnswers></MyAnswers>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/feed"
          element={
            <PrivateRoute>
              <FeedPage></FeedPage>
            </PrivateRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminAnasayfa></AdminAnasayfa>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminProfilePage></AdminProfilePage>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/getallusers"
          element={
            <AdminRoute>
              <GetAllUsers></GetAllUsers>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/Announcement"
          element={
            <AdminRoute>
              <AnnouncementPage></AnnouncementPage>
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
