import React from "react";
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

function App() {
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
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/our-team" element={<OurTeam />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/code-editor" element={<Practice />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/report" element={<Report />} />
                {/* sub routes */}
                <Route path="/resources/view" element = {<FileView />}/> 
                <Route path="/users/:id/verify/:token" element = {<EmailVerification />}/> 
              </Routes>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
