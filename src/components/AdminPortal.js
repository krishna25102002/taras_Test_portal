import React, { useState, useEffect } from 'react';
import { getQuestions, deleteQuestion, getEnabledSections, updateEnabledSections } from '../api/service';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Button, ListGroup, Card, Row, Col, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminPortal = () => {
  const [questions, setQuestions] = useState([]);
  const [section, setSection] = useState('Embedded');
  const [enabledSections, setEnabledSections] = useState({
    embedded: false,
    vlsi: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
    fetchEnabledSections();
  }, [section]);

  const loadQuestions = async () => {
    try {
      const data = await getQuestions(section);
      setQuestions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEnabledSections = async () => {
    try {
      const sections = await getEnabledSections();
      setEnabledSections(sections);
    } catch (error) {
      console.error('Error fetching enabled sections:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(section, id);
        loadQuestions();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Updated function to manage section dependencies
  const toggleSection = async (sectionKey) => {
    let updatedSections = { ...enabledSections };

    if (sectionKey === 'both') {
      if (!enabledSections.both) {
        updatedSections = { embedded: true, vlsi: true, }; // Enable both Embedded and VLSI
      } else {
        updatedSections = { ...updatedSections, both: false };
      }
    } else {
      updatedSections[sectionKey] = !enabledSections[sectionKey];

      if (sectionKey === 'embedded' || sectionKey === 'vlsi') {
        if (!updatedSections.embedded || !updatedSections.vlsi) {
          updatedSections.both = false; // Disable 'Both' if either Embedded or VLSI is disabled
        }
        if (updatedSections.embedded && updatedSections.vlsi) {
          updatedSections.both = true; // Enable 'Both' if both Embedded and VLSI are enabled
        }
      }
    }

    try {
      await updateEnabledSections(updatedSections);
      setEnabledSections(updatedSections);
    } catch (error) {
      console.error('Error updating sections:', error);
    }
  };

  return (
    <Container className="my-4" style={{ background: 'linear-gradient(to right, #e0f7fa, #e3f2fd)', padding: '20px', borderRadius: '10px' }}>
      <Row className="mb-4">
        <Col>
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: '#6c757d',
              borderColor: '#6c757d',
              borderRadius: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              marginBottom: '10px'
            }}
          >
            Back
          </Button>
        </Col>
      </Row>
      <h1 className="mb-4" style={{ color: '#004080', textAlign: 'center', fontWeight: 'bold' }}>Admin Portal</h1>
      <Row className="mb-4">
        <Col>
          <Button
            variant={section === 'Embedded' ? 'primary' : 'outline-primary'}
            onClick={() => setSection('Embedded')}
            style={{
              backgroundColor: section === 'Embedded' ? '#004080' : 'transparent',
              borderColor: '#004080',
              borderRadius: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              marginRight: '10px'
            }}
          >
            Embedded
          </Button>
          <Button
            variant={section === 'VLSI' ? 'primary' : 'outline-primary'}
            onClick={() => setSection('VLSI')}
            style={{
              backgroundColor: section === 'VLSI' ? '#004080' : 'transparent',
              borderColor: '#004080',
              borderRadius: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              marginRight: '10px'
            }}
          >
            VLSI
          </Button>
        </Col>
        <Col className="text-end">
          <Link to="/admin/results">
            <Button
              variant="info"
              className="me-2"
              style={{
                backgroundColor: '#ff6600',
                borderColor: '#ff6600',
                borderRadius: '20px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                color: 'white'
              }}
            >
              View Student Results
            </Button>
          </Link>
          <Button
            variant="success"
            onClick={() => navigate('/admin/add')}
            style={{
              backgroundColor: '#ff6600',
              borderColor: '#ff6600',
              borderRadius: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              color: 'white'
            }}
          >
            Add New Question
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h5>Manage Enabled Sections</h5>
          <Form.Check
            type="switch"
            id="enable-embedded"
            label="Enable Embedded"
            checked={enabledSections.embedded}
            onChange={() => toggleSection('embedded')}
          />
          <Form.Check
            type="switch"
            id="enable-vlsi"
            label="Enable VLSI"
            checked={enabledSections.vlsi}
            onChange={() => toggleSection('vlsi')}
          />
          <Form.Check
            type="switch"
            id="enable-both"
            label="Enable Both"
            checked={enabledSections.both}
            onChange={() => toggleSection('both')}
            disabled={!enabledSections.embedded || !enabledSections.vlsi} // Disable if Embedded or VLSI is not enabled
          />
        </Col>
      </Row>

      <ListGroup>
        {questions.length > 0 ? (
          questions.map((q) => (
            <ListGroup.Item
              key={q.id}
              className="mb-3"
              style={{
                border: '1px solid #004080',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                background: 'white'
              }}
            >
              <Card style={{ borderRadius: '10px' }}>
                <Card.Body>
                  <Row>
                    <Col>
                      <Card.Title style={{ color: '#004080', fontWeight: 'bold' }}>{q.question}</Card.Title>
                      <Card.Text>
                        <ul>
                          {q.options.map((option, index) => (
                            <li
                              key={index}
                              style={{
                                color: index === q.correctOption ? '#ff6600' : 'black',
                                marginBottom: '5px'
                              }}
                            >
                              {index + 1}. {option}{' '}
                              {index === q.correctOption && <strong>(Correct)</strong>}
                            </li>
                          ))}
                        </ul>
                      </Card.Text>
                      <Button
                        variant="warning"
                        as={Link}
                        to={section === 'Embedded' ? `/admin/edit/embedded/${q.id}` : `/admin/edit/vlsi/${q.id}`}
                        className="me-2"
                        style={{
                          backgroundColor: '#ff6600',
                          borderColor: '#ff6600',
                          borderRadius: '20px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(q.id)}
                        style={{
                          backgroundColor: '#cc0000',
                          borderColor: '#cc0000',
                          borderRadius: '20px',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        Delete
                      </Button>
                    </Col>
                    {q.imageUrl && (
                      <Col md={3} className="d-flex justify-content-center align-items-center">
                        <Card.Img
                          src={q.imageUrl}
                          alt="Question Image"
                          style={{
                            maxHeight: '150px',
                            objectFit: 'contain',
                            borderRadius: '10px'
                          }}
                        />
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item style={{ border: '1px solid #004080', borderRadius: '10px', background: 'white' }}>
            No questions available in this section.
          </ListGroup.Item>
        )}
      </ListGroup>
    </Container>
  );
};

export default AdminPortal;
