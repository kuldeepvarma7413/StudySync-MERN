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
import Unauthorized from "./pages/Unauthorized";


function App() {
  const [authenticated, setAuthenticated] = useState(false);

  const authChange = () => {
    if (Cookies.get("token")) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }

  useEffect(() => {
    authChange();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/*"
          element={
            <div>
              <Navbar authChange={ authChange } />
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
                  element={authenticated ? <Admin /> : <Unauthorized />}
                  />
                <Route
                  path="/resources"
                  element={
                    authenticated ? <Resources /> : <Unauthorized />
                  }
                  />
                <Route
                  path="/upload"
                  element={authenticated ? <Upload /> : <Unauthorized />}
                  />
                <Route
                  path="/report"
                  element={authenticated ? <Report /> : <Unauthorized />}
                  />
                <Route
                  path="/discuss/ask-question"
                  element={
                    authenticated ? <AskQuestion /> : <Unauthorized />
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