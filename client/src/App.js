import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/common/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
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

function App() {
  const [isAutheticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log(isAutheticated)
    if (Cookies.get("token")) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  },[window.location.pathname]);

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
                {isAutheticated ? (
                  <>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/resources" element={<Resources />} />
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/report" element={<Report />} />
                    <Route
                      path="/discuss/ask-question"
                      element={<AskQuestion />}
                    />
                  </>
                ) : (
                  "Unauthorized Access"
                )}
                <Route path="/profile/:id" element={<Profile />} />
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
              </Routes>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
