// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AdminPortal from "./components/AdminSide/AdminPortal";
import AddQuestion from "./components/AdminAddingQuestions/AddQuestion";
import StudentPortal from "./components/StudentSidePages/StudentPortal";
import TestPage from "./components/TestAttendingPages/TestPage";
import Home from "./components/HomePage/Home";
import AdminResults from "./components/AdminSide/AdminResults";
import EditEmbeddedQuestion from "./components/EditQuestionsPages/EditEmbeddedQuestion";
import EditVLSIQuestion from "./components/EditQuestionsPages/EditVLSIQuestion";
import ThankYouPage from "./components/ThanksPages/ThankYouPage";
// import MarksPieChart from './components/charts/MarksPieChart';

function App() {
  return (
    <GoogleOAuthProvider clientId="448430774246-9bu60as3s9fcjapbabln7fsfs4nuc43k.apps.googleusercontent.com">
      <Router>
        <div className="App">
          <Routes> 
            {/* Admin Portal Routes */}
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/admin/add" element={<AddQuestion />} />
            <Route
              path="/admin/edit/embedded/:id"
              element={<EditEmbeddedQuestion />}
            />
            <Route path="/admin/edit/vlsi/:id" element={<EditVLSIQuestion />} />
            <Route path="/admin/results" element={<AdminResults />} />
            {/* <Route path="/admin/charts" element={<MarksPieChart />} /> */}

            {/* Student Portal Route */}
            <Route path="/student" element={<StudentPortal />} />

            {/* Test Page Routes */}
            <Route path="/test/:section" element={<TestPageWrapper />} />
            <Route path="/thank-you" element={<ThankYouPage />} />

            {/* Default Route with Portal selection */}
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

// A wrapper component to extract section parameter
const TestPageWrapper = () => {
  const { section } = useParams();
  const formattedSection = section.charAt(0).toUpperCase() + section.slice(1);
  return <TestPage section={formattedSection} />;
};

export default App;
