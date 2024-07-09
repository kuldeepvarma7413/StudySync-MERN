import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/common/Navbar";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";
import OurTeam from "./pages/OurTeam";
import Resources from "./pages/Resources";
import "./App.css";
import Upload from "./pages/Upload";
import FileView from "./pages/FileView";
import Report from "./pages/Report";
import EmailVerification from "./pages/EmailVerification";
import Practice from "./pages/Practice";
import Discuss from "./pages/Discuss";
import AskQuestion from "./pages/AskQuestion";
import GoogleSuccess from "./pages/GoogleSuccess";
import QuestionView from "./pages/QuestionView";
import ForgetPassword from "./pages/ForgetPassword";
import NewPassword from "./pages/NewPassword";
import Cookies from "js-cookie";
import Profile from "./pages/Profile";
import EditProfile from "./components/profile/EditProfile";

function App() {
  const [isAutheticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (Cookies.get("token")) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [window.location.pathname]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/*"
          element={
            <div>
              <Navbar />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route
                  path="/profile/:id/edit-profile"
                  element={<Profile content={<EditProfile />} />}
                />
                <Route path="/our-team" element={<OurTeam />} />
                <Route path="/code-editor" element={<Practice />} />
                <Route path="/discuss" element={<Discuss />} />
                <Route path="/forgot-password" element={<ForgetPassword />} />
                {/* sub routes */}
                <Route
                  path="/discuss/view-question/:id"
                  element={<QuestionView />}
                />
                <Route path="/resources/view" element={<FileView />} />
                <Route
                  path="/users/:id/verify/:token"
                  element={<EmailVerification />}
                />
                <Route
                  path="/forgot-password/:id/:token"
                  element={<NewPassword />}
                />
                <Route
                  path="/google-auth-success/:token"
                  element={<GoogleSuccess />}
                />
                <Route
                  path="/admin"
                  element={isAutheticated ? <Admin /> : "Unauthorized Access"}
                />
                <Route
                  path="/resources"
                  element={
                    isAutheticated ? <Resources /> : "Unauthorized Access"
                  }
                />
                <Route
                  path="/upload"
                  element={isAutheticated ? <Upload /> : "Unauthorized Access"}
                />
                <Route
                  path="/report"
                  element={isAutheticated ? <Report /> : "Unauthorized Access"}
                />
                <Route
                  path="/discuss/ask-question"
                  element={
                    isAutheticated ? <AskQuestion /> : "Unauthorized Access"
                  }
                />

                <Route path="*" element={"Invalid URL"} />
              </Routes>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
