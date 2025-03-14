import React, { useState, useEffect } from "react";
import {
  fetchQuestionsBySection,
  updateStudent,
  markTestAsCompleted,
} from "../../api/service";
import { useNavigate, useLocation } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "./TestPage.css";

// Converts time in seconds to MM:SS format
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

const TestPage = () => {
  const [questionsByPart, setQuestionsByPart] = useState({});
  const [answers, setAnswers] = useState({});
  const [currentPart, setCurrentPart] = useState("part1");
  const [score, setScore] = useState({
    embedded: { part1: 0, part2: 0, part3: 0 },
    vlsi: { part1: 0, part2: 0, part3: 0 },
  });
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [showError, setShowError] = useState(false);
  const [timer, setTimer] = useState(3600); // 1 hour in seconds
  const [showInstructions, setShowInstructions] = useState(true); // Instructions modal
  const navigate = useNavigate();
  const location = useLocation();
  const { studentId, section, isBothTests } = location.state || {};

  useEffect(() => {
    if (!studentId || !section) {
      alert("Student ID or section not provided");
      navigate("/");
      return;
    }
    setCurrentPart("part1");
    loadQuestions(section);

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "hidden") {
        try {
          await handleSubmit();
          alert("Test auto-submitted as you switched tabs.");
          navigate("/thank-you");
        } catch (error) {
          console.error("Error auto-submitting test:", error);
        }
      }
    };

    const handleBeforeUnload = (event) => {
      handleSubmit();
      event.preventDefault();
      event.returnValue = "";
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [studentId, section, navigate]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(countdown);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown); // Cleanup on unmount
  }, []);

  const loadQuestions = async (section) => {
    try {
      const data = await fetchQuestionsBySection(section);
      setQuestionsByPart(data);
      setAnswers({});
      setScore((prevScore) => ({
        ...prevScore,
        [section.toLowerCase()]: { part1: 0, part2: 0, part3: 0 },
      }));
    } catch (error) {
      console.error("Failed to load questions:", error);
      alert("Failed to load questions");
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(questionsByPart).length === 0) {
      setShowError(true);
      return;
    }

    const currentSectionScore = { part1: 0, part2: 0, part3: 0 };

    Object.keys(questionsByPart).forEach((part) => {
      questionsByPart[part].forEach((q) => {
        if (answers[q.id] === q.correctOption) {
          currentSectionScore[part] += 1;
        }
      });
    });

    const updatedScore = {
      ...score,
      [section.toLowerCase()]: currentSectionScore,
    };

    setScore(updatedScore);

    try {
      const response = await fetch(
        `http://localhost:3000/students/${studentId}`
      );
      if (!response.ok) throw new Error("Failed to fetch student");
      const student = await response.json();

      const updatedMarks = {
        ...student.marks,
        [section.toLowerCase()]: currentSectionScore,
      };

      const updatedStudent = {
        ...student,
        marks: updatedMarks,
      };

      await updateStudent(studentId, updatedStudent);

      if (isBothTests && section === "Embedded") {
        setCurrentPart("part1");
        loadQuestions("VLSI");
      } else {
        await handleTestCompletion();
        alert(
          `Test completed! Embedded: ${
            updatedScore.embedded.part1 +
            updatedScore.embedded.part2 +
            updatedScore.embedded.part3
          }, VLSI: ${
            updatedScore.vlsi.part1 +
            updatedScore.vlsi.part2 +
            updatedScore.vlsi.part3
          }`
        );
        navigate("/thank-you");
      }
    } catch (error) {
      console.error("Failed to submit test:", error);
      alert("Failed to submit test");
    }
  };

  const handleTestCompletion = async () => {
    try {
      await markTestAsCompleted(studentId);
    } catch (error) {
      console.error("Error marking test as completed:", error);
    }
  };

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex,
    });
  };

  const handleNextPart = () => {
    const parts = ["part1", "part2", "part3"];
    const currentPartIndex = parts.indexOf(currentPart);
    if (currentPartIndex === parts.length - 1) {
      setShowSubmitConfirmation(true);
    } else {
      setCurrentPart(parts[currentPartIndex + 1]);
    }
  };

  const getQuestionStatus = (questionId) => {
    if (answers[questionId] !== undefined) {
      return "answered"; // green
    } else if (
      /* You might want to track skipped questions separately */ false
    ) {
      return "skipped"; // blue
    }
    return "";
  };

  return (
    <div className="test-page">
      <div className="sidebar">
        <div className="question-numbers">
          {Object.keys(questionsByPart).map((part) => (
            <div key={part} className="part-navigation">
              <h3>{part}</h3>
              {questionsByPart[part].map((q, index) => (
                <Button
                  key={q.id}
                  className={`question-btn ${getQuestionStatus(q.id)}`}
                  onClick={() => setCurrentPart(part)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="main-content">
        <header className="test-header">
          <h1>{section} Test</h1>
          <div className="timer">Time Left: {formatTime(timer)}</div>
        </header>
        <div className="question-container">
          {questionsByPart[currentPart] &&
            questionsByPart[currentPart].length > 0 && (
              <>
                <h3>Questions for {currentPart}</h3>
                {questionsByPart[currentPart].map((q, index) => (
                  <div
                    key={q.id}
                    className={`question-box ${
                      answers[q.id] !== undefined ? "answered" : ""
                    }`}
                  >
                    <p>
                      {index + 1}. {q.question}
                    </p>
                    {q.imageUrl && (
                      <img
                        src={q.imageUrl}
                        alt={`Question ${q.id}`}
                        className="question-image"
                      />
                    )}
                    <div className="options-container">
                      {q.options.map((option, i) => (
                        <label
                          key={i}
                          className={`option-label ${
                            answers[q.id] === i ? "selected" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            value={i}
                            checked={answers[q.id] === i}
                            onChange={() => handleOptionChange(q.id, i)}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <Button className="next-btn" onClick={handleNextPart}>
                  {currentPart === "part3" ? "Submit" : "Next Part"}
                </Button>
              </>
            )}
        </div>
      </div>

      {/* Submit confirmation modal */}
      <Modal
        show={showSubmitConfirmation}
        onHide={() => setShowSubmitConfirmation(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Submit Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to submit the test?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSubmitConfirmation(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error modal */}
      <Modal show={showError} onHide={() => setShowError(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          There was an error submitting the test. Please try again.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowError(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Instructions modal */}
      <Modal show={showInstructions} onHide={() => setShowInstructions(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add your instructions here */}
          Please read the instructions carefully before starting the test.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowInstructions(false)}>
            Start Test
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TestPage;
