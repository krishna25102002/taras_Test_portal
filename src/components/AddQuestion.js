import React, { useState } from 'react';
import { addQuestion } from '../api/service';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddQuestion = () => {
  const [section, setSection] = useState('Embedded');
  const [part, setPart] = useState('part1');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // For success message
  const [errorMessage, setErrorMessage] = useState(''); // For error message

  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const resetForm = () => {
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectOption('');
    setImageUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question || options.some(opt => !opt) || correctOption === '') {
      setErrorMessage('Please fill all fields except the image URL');
      return;
    }

    const correctIndex = parseInt(correctOption, 10);
    if (isNaN(correctIndex) || correctIndex < 1 || correctIndex > 4) {
      setErrorMessage('Correct option must be between 1 and 4');
      return;
    }

    const newQ = {
      section,
      part,
      question,
      options,
      correctOption: correctIndex - 1,
      imageUrl: imageUrl || '',
    };

    try {
      await addQuestion(newQ);
      setSuccessMessage('Question added successfully!');
      resetForm(); // Reset only the question fields
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to add question');
    }
  };

  return (
    <Container className="my-4" style={{ maxWidth: '600px', backgroundColor: '#f7f9f9', padding: '20px', borderRadius: '8px' }}>
      <Row className="mb-4">
        <Col className="text-start">
          <Button variant="secondary" onClick={() => navigate(-1)} className="student-portal-button">
            Back
          </Button>
        </Col>
      </Row>
      <h2 className="mb-4" style={{ color: '#004080' }}>Add New Question</h2>

      {/* Success Message */}
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </Alert>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
          {errorMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Section Selector */}
        <Form.Group controlId="formSection" className="mb-3">
          <Form.Label style={{ color: '#004080' }}>Section</Form.Label>
          <Form.Control
            as="select"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            style={{ borderColor: '#004080', boxShadow: 'none' }}
          >
            <option value="Embedded">Embedded</option>
            <option value="VLSI">VLSI</option>
          </Form.Control>
        </Form.Group>

        {/* Part Selector */}
        <Form.Group controlId="formPart" className="mb-3">
          <Form.Label style={{ color: '#004080' }}>Part</Form.Label>
          <Form.Control
            as="select"
            value={part}
            onChange={(e) => setPart(e.target.value)}
            style={{ borderColor: '#004080', boxShadow: 'none' }}
          >
            <option value="part1">Part 1</option>
            <option value="part2">Part 2</option>
            <option value="part3">Part 3</option>
          </Form.Control>
        </Form.Group>

        {/* Question Textarea */}
        <Form.Group controlId="formQuestion" className="mb-3">
          <Form.Label style={{ color: '#004080' }}>Question</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            style={{ borderColor: '#004080', boxShadow: 'none' }}
          />
        </Form.Group>

        {/* Options */}
        {options.map((opt, index) => (
          <Form.Group controlId={`formOption${index}`} className="mb-3" key={index}>
            <Form.Label style={{ color: '#004080' }}>Option {index + 1}</Form.Label>
            <Form.Control
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
              style={{ borderColor: '#004080', boxShadow: 'none' }}
            />
          </Form.Group>
        ))}

        {/* Correct Option */}
        <Form.Group controlId="formCorrectOption" className="mb-3">
          <Form.Label style={{ color: '#004080' }}>Correct Option (1-4)</Form.Label>
          <Form.Control
            type="number"
            value={correctOption}
            onChange={(e) => setCorrectOption(e.target.value)}
            min="1"
            max="4"
            required
            style={{ borderColor: '#004080', boxShadow: 'none' }}
          />
        </Form.Group>

        {/* Image URL (Optional) */}
        <Form.Group controlId="formImageUrl" className="mb-3">
          <Form.Label style={{ color: '#004080' }}>Image URL (Optional)</Form.Label>
          <Form.Control
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            style={{ borderColor: '#004080', boxShadow: 'none' }}
          />
        </Form.Group>

        <Button variant="primary" type="submit" style={{ backgroundColor: '#004080', borderColor: '#004080' }}>
          Add Question
        </Button>
      </Form>
    </Container>
  );
};

export default AddQuestion;
