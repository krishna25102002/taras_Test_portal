import React, { useState, useEffect } from 'react';
import { deleteStudent, deleteAllStudents } from '../api/service';
import { Container, Form, Table, Button, Row, Col } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const AdminResults = () => {
  const [students, setStudents] = useState([]);
  const [filterSection, setFilterSection] = useState('Embedded'); // Set default filter to 'Embedded'
  const [totalMarks, setTotalMarks] = useState({ embedded: 0, vlsi: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    loadStudents();
  }, [filterSection]);

  const loadStudents = async () => {
    try {
      let url = 'http://localhost:3000/students';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      console.log('Fetched Data:', data); // Check fetched data
      setStudents(data);
      calculateScores(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load students');
    }
  };

  const calculateScores = (students) => {
    let embeddedMarks = 0;
    let vlsiMarks = 0;

    students.forEach(student => {
      embeddedMarks += (student.marks.embedded?.part1 || 0) +
        (student.marks.embedded?.part2 || 0) +
        (student.marks.embedded?.part3 || 0);
      vlsiMarks += (student.marks.vlsi?.part1 || 0) +
        (student.marks.vlsi?.part2 || 0) +
        (student.marks.vlsi?.part3 || 0);
    });

    setTotalMarks({ embedded: embeddedMarks, vlsi: vlsiMarks });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        loadStudents();
      } catch (error) {
        console.error(error);
        alert('Failed to delete student');
      }
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all students?')) {
      try {
        await deleteAllStudents();
        loadStudents();
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert('Failed to delete all students');
      }
    }
  };

  const exportToExcel = () => {
    console.log('Exporting Students Data:', students);

    const dataToExport = students.map(({ id, marks, ...student }) => {
      return {
        ...student,
        embeddedPart1: marks.embedded?.part1 || '',
        embeddedPart2: marks.embedded?.part2 || '',
        embeddedPart3: marks.embedded?.part3 || '',
        embeddedTotal: (marks.embedded?.part1 || 0) + (marks.embedded?.part2 || 0) + (marks.embedded?.part3 || 0),
        vlsiPart1: marks.vlsi?.part1 || '',
        vlsiPart2: marks.vlsi?.part2 || '',
        vlsiPart3: marks.vlsi?.part3 || '',
        vlsiTotal: (marks.vlsi?.part1 || 0) + (marks.vlsi?.part2 || 0) + (marks.vlsi?.part3 || 0),
      };
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'students_results.xlsx');
  };

  const filteredStudents = students.filter(student => {
    if (filterSection === 'Embedded') {
      return student.marks.embedded !== undefined;
    } else if (filterSection === 'VLSI') {
      return student.marks.vlsi !== undefined;
    }
    return true; // If 'All' is selected, show all students
  });

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col className="text-start">
          <Button variant="secondary" onClick={() => navigate(-1)} className="me-2">
            Back
          </Button>
        </Col>
      </Row>
      <h1 className="mb-4">Student Results</h1>
      <Form.Group className="mb-4">
        <Form.Label>Filter by Test Section:</Form.Label>
        <Form.Control
          as="select"
          value={filterSection}
          onChange={(e) => setFilterSection(e.target.value)}
        >
          {/* <option value="">All</option> */}
          <option value="Embedded">Embedded</option>
          <option value="VLSI">VLSI</option>
        </Form.Control>
      </Form.Group>
      <div className="d-flex mb-4">
        <Button
          variant="primary"
          onClick={exportToExcel}
          className="me-2"
        >
          Export to Excel
        </Button>
        <Button
          variant="danger"
          onClick={handleDeleteAll}
        >
          Delete All
        </Button>
      </div>
      <div className="overflow-auto">
        {filteredStudents.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Class</th>
                <th>Department</th>
                <th>City</th>
                <th>College Name</th>
                <th>Phone Number</th>
                <th>College Email</th>
                {filterSection !== 'VLSI' && (
                  <>
                    <th>Embedded Part 1</th>
                    <th>Embedded Part 2</th>
                    <th>Embedded Part 3</th>
                    <th>Embedded Total</th>
                  </>
                )}
                {filterSection !== 'Embedded' && (
                  <>
                    <th>VLSI Part 1</th>
                    <th>VLSI Part 2</th>
                    <th>VLSI Part 3</th>
                    <th>VLSI Total</th>
                  </>
                )}
                {filterSection === '' && <th>Total Marks</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const embeddedPart1 = student.marks.embedded?.part1 || 0;
                const embeddedPart2 = student.marks.embedded?.part2 || 0;
                const embeddedPart3 = student.marks.embedded?.part3 || 0;
                const embeddedTotal = embeddedPart1 + embeddedPart2 + embeddedPart3;

                const vlsiPart1 = student.marks.vlsi?.part1 || 0;
                const vlsiPart2 = student.marks.vlsi?.part2 || 0;
                const vlsiPart3 = student.marks.vlsi?.part3 || 0;
                const vlsiTotal = vlsiPart1 + vlsiPart2 + vlsiPart3;

                const totalMarksForStudent = embeddedTotal + vlsiTotal;

                return (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.class}</td>
                    <td>{student.department}</td>
                    <td>{student.city}</td>
                    <td>{student.collegeName}</td>
                    <td>{student.phoneNumber}</td>
                    <td>{student.collegeMailId}</td>
                    {filterSection !== 'VLSI' && (
                      <>
                        <td>{embeddedPart1}</td>
                        <td>{embeddedPart2}</td>
                        <td>{embeddedPart3}</td>
                        <td>{embeddedTotal}</td>
                      </>
                    )}
                    {filterSection !== 'Embedded' && (
                      <>
                        <td>{vlsiPart1}</td>
                        <td>{vlsiPart2}</td>
                        <td>{vlsiPart3}</td>
                        <td>{vlsiTotal}</td>
                      </>
                    )}
                    {filterSection === '' && <td>{totalMarksForStudent}</td>}
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <p>No student results available.</p>
        )}
      </div>
    </Container>
  );
};

export default AdminResults;
