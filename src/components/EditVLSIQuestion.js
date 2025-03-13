import React, { useState, useEffect } from 'react';
import { updateQuestion } from '../api/service';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

const EditVLSIQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // New state for image URL

  useEffect(() => {
    loadQuestion();
  }, []);

  const loadQuestion = async () => {
    try {
      const response = await fetch(`http://localhost:3000/vlsiquestions/${id}`);
      if (!response.ok) throw new Error('Failed to fetch question');
      const q = await response.json();
      setQuestion(q.question);
      setOptions(q.options);
      setCorrectOption(q.correctOption + 1);
      setImageUrl(q.imageUrl || ''); // Set the image URL if available
    } catch (error) {
      console.error(error);
      alert('Failed to load question');
      navigate('/admin');
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question || options.some((opt) => !opt) || correctOption === '') {
      alert('Please fill all fields');
      return;
    }

    const correctIndex = parseInt(correctOption, 10);
    if (isNaN(correctIndex) || correctIndex < 1 || correctIndex > 4) {
      alert('Correct option must be between 1 and 4');
      return;
    }

    const updatedQ = {
      section: 'VLSI',
      question,
      options,
      correctOption: correctIndex - 1,
      imageUrl, // Include image URL in the updated question
    };

    try {
      await updateQuestion('VLSI', id, updatedQ);
      navigate('/admin');
    } catch (error) {
      console.error(error);
      alert('Failed to update question');
    }
  };

  return (
    <Container className="my-4" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">Edit VLSI Question</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Question</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </Form.Group>
        {options.map((opt, index) => (
          <Form.Group className="mb-3" key={index}>
            <Form.Label>Option {index + 1}</Form.Label>
            <Form.Control
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
          </Form.Group>
        ))}
        <Form.Group className="mb-3">
          <Form.Label>Correct Option (1-4)</Form.Label>
          <Form.Control
            type="number"
            value={correctOption}
            onChange={(e) => setCorrectOption(e.target.value)}
            min="1"
            max="4"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Image URL (optional)</Form.Label>
          <Form.Control
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Update Question
        </Button>
      </Form>
    </Container>
  );
};

export default EditVLSIQuestion;
