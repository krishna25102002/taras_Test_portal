import React, { useState, useEffect } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { addStudent, getEnabledSections } from "../../api/service";
import { useNavigate } from "react-router-dom";
import "./StudentPortal.css";

const StudentPortal = () => {
  // Fetch user info from local storage or session state (assuming you store the user data upon login)
  const user = JSON.parse(localStorage.getItem("user"));

  const [studentDetails, setStudentDetails] = useState({
    name: user ? user.name : "", // Pre-fill from user data
    email: user ? user.email : "", // Pre-fill from user data
    class: "",
    department: "",
    city: "",
    collegeName: "",
    phoneNumber: "",
    testSection: "", // Default test section empty
  });

  const [enabledSections, setEnabledSections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnabledSections = async () => {
      try {
        const sections = await getEnabledSections();
        const enabled = Object.keys(sections).filter((key) => sections[key]);
        setEnabledSections(enabled);

        // Set the default test section based on enabled sections
        if (enabled.length > 0) {
          setStudentDetails((prevDetails) => ({
            ...prevDetails,
            testSection:
              enabled[0] === "both"
                ? "Both"
                : enabled[0].charAt(0).toUpperCase() + enabled[0].slice(1),
          }));
        }
      } catch (error) {
        console.error("Error fetching enabled sections:", error);
      }
    };
    fetchEnabledSections();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      class: cls,
      department,
      city,
      collegeName,
      phoneNumber,
      testSection,
    } = studentDetails;
    if (!name || !cls || !department || !city || !collegeName || !phoneNumber) {
      alert("Please fill all fields");
      return;
    }

    try {
      const student = {
        ...studentDetails,
        marks: { embedded: 0, vlsi: 0 },
        testSection,
      };
      const addedStudent = await addStudent(student);

      if (testSection === "Both") {
        navigate("/test/embedded", {
          state: {
            studentId: addedStudent.id,
            section: "Embedded",
            isBothTests: true,
          },
        });
      } else {
        navigate(`/test/${testSection.toLowerCase()}`, {
          state: { studentId: addedStudent.id, section: testSection },
        });
      }
    } catch (error) {
      console.error("Error submitting student details:", error);
      alert("Failed to submit student details");
    }
  };

  return (
    <Container className="student-portal-container">
      <Row className="mb-4">
        <Col className="text-start">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="student-portal-button"
          >
            Back
          </Button>
        </Col>
      </Row>
      <h1 className="student-portal-header">Student Portal</h1>
      <Form onSubmit={handleSubmit} className="student-portal-form">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            {/* Pre-filled and disabled Name field */}
            <Form.Group controlId="formName">
              <Form.Label className="student-portal-label">NAME</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={studentDetails.name}
                onChange={handleChange}
                className="student-portal-input"
                disabled // Disable this field
              />
            </Form.Group>

            {/* Pre-filled and disabled Email field */}
            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Label className="student-portal-label">EMAIL</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={studentDetails.email}
                onChange={handleChange}
                className="student-portal-input"
                disabled // Disable this field
              />
            </Form.Group>

            {/* Other fields */}
            {Object.keys(studentDetails)
              .filter(
                (key) =>
                  key !== "name" && key !== "email" && key !== "testSection"
              )
              .map((key) => (
                <Form.Group controlId={`form${key}`} key={key}>
                  <Form.Label className="student-portal-label">
                    {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                  </Form.Label>
                  <Form.Control
                    type={key === "phoneNumber" ? "tel" : "text"}
                    name={key}
                    value={studentDetails[key]}
                    onChange={handleChange}
                    className="student-portal-input"
                    required
                  />
                </Form.Group>
              ))}

            <Form.Group controlId="formTestSection">
              <Form.Label className="student-portal-label">
                Test Section
              </Form.Label>
              <Form.Control
                as="select"
                name="testSection"
                value={studentDetails.testSection}
                onChange={handleChange}
                className="student-portal-input"
              >
                {enabledSections.includes("embedded") && (
                  <option value="Embedded">Embedded</option>
                )}
                {enabledSections.includes("vlsi") && (
                  <option value="VLSI">VLSI</option>
                )}
                {enabledSections.includes("both") && (
                  <option value="Both">Attend Both</option>
                )}
              </Form.Control>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="student-portal-button"
            >
              Start Test
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default StudentPortal;
