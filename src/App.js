// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import AdminPortal from './components/AdminPortal';
import AddQuestion from './components/AddQuestion';
import StudentPortal from './components/StudentPortal';
import TestPage from './components/TestPage';
import Home from './components/Home';
import AdminResults from './components/AdminResults';
import EditEmbeddedQuestion from './components/EditEmbeddedQuestion';
import EditVLSIQuestion from './components/EditVLSIQuestion';
import ThankYouPage from './components/ThankYouPage';
// import MarksPieChart from './components/charts/MarksPieChart';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Admin Portal Routes */}
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/admin/add" element={<AddQuestion />} />
          <Route path="/admin/edit/embedded/:id" element={<EditEmbeddedQuestion />} />
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
  );
}

// A wrapper component to extract section parameter
const TestPageWrapper = () => {
  const { section } = useParams();
  const formattedSection = section.charAt(0).toUpperCase() + section.slice(1);
  return <TestPage section={formattedSection} />;
};

export default App;
