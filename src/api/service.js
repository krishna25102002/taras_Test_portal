const BASE_URL = "http://localhost:3000";
import bcrypt from "bcryptjs"; // Add this import for password hashing

// Original function to fetch all questions for admin functionality
export const getQuestions = async (section) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${encodeURIComponent(section.toLowerCase())}questions`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

// New function to fetch and organize questions by part for the test page
export const fetchQuestionsBySection = async (section) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${encodeURIComponent(section.toLowerCase())}questions`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    const allQuestions = await response.json();

    // Organize questions by part
    const questionsByPart = allQuestions.reduce((acc, question) => {
      if (!acc[question.part]) {
        acc[question.part] = [];
      }
      acc[question.part].push(question);
      return acc;
    }, {});

    return questionsByPart;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

// Add a new question
export const addQuestion = async (question) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${question.section.toLowerCase()}questions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add question");
    }
    return response.json();
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
};

// Update an existing question by its ID
export const updateQuestion = async (section, id, updatedQuestion) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${section.toLowerCase()}questions/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedQuestion),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update question");
    }
    return response.json();
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

// Delete a question by its ID
export const deleteQuestion = async (section, id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${section.toLowerCase()}questions/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete question");
    }
    return response.json();
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
};

// Fetch all students
export const getStudents = async () => {
  try {
    const response = await fetch(`${BASE_URL}/students`);
    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

// Add a new student
export const addStudent = async (student) => {
  try {
    // Encrypt the password ssword, salt);

    const response = await fetch(`${BASE_URL}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    if (!response.ok) {
      throw new Error("Failed to add student");
    }
    return response.json();
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
};

// Update an existing student by its ID
export const updateStudent = async (id, updatedStudent) => {
  try {
    // Encrypt the password if it is being updated
    if (updatedStudent.password) {
      const salt = await bcrypt.genSalt(10);
      updatedStudent.password = await bcrypt.hash(
        updatedStudent.password,
        salt
      );
    }

    const response = await fetch(`${BASE_URL}/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedStudent),
    });
    if (!response.ok) {
      throw new Error("Failed to update student");
    }
    return response.json();
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};

// Delete a student by its ID
export const deleteStudent = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/students/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete student");
    }
    return response.json();
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};

// Delete all students one by one
export const deleteAllStudents = async () => {
  try {
    const students = await getStudents();
    for (const student of students) {
      await deleteStudent(student.id);
    }
    console.log("All students deleted successfully");
  } catch (error) {
    console.error("Error deleting all students:", error);
  }
};

// Mark a test as completed for a specific student
export const markTestAsCompleted = async (studentId) => {
  try {
    const student = await fetch(`${BASE_URL}/students/${studentId}`).then(
      (res) => res.json()
    );
    const updatedStudent = { ...student, testCompleted: true };
    const response = await fetch(`${BASE_URL}/students/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedStudent),
    });
    if (!response.ok) {
      throw new Error("Failed to mark test as completed");
    }
    return response.json();
  } catch (error) {
    console.error("Error marking test as completed:", error);
    throw error;
  }
};

// Fetch enabled sections from the backend
export const getEnabledSections = async () => {
  try {
    const response = await fetch(`${BASE_URL}/AdminTestControl`);
    if (!response.ok) {
      throw new Error("Failed to fetch enabled sections");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching enabled sections:", error);
    throw error;
  }
};

// Update enabled sections in the backend
export const updateEnabledSections = async (updatedSections) => {
  try {
    const response = await fetch(`${BASE_URL}/AdminTestControl`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedSections),
    });
    if (!response.ok) {
      throw new Error("Failed to update enabled sections");
    }
    return response.json();
  } catch (error) {
    console.error("Error updating enabled sections:", error);
    throw error;
  }
};

export const registerUser = async (user) => {
  try {
    // Check if email already exists
    const emailCheckResponse = await fetch(
      `${BASE_URL}/users?email=${user.email}`
    );
    const existingUsers = await emailCheckResponse.json();

    if (existingUsers.length > 0) {
      throw new Error("Email already in use. Please choose a different email.");
    }

    // Encrypt the password before storing
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Register the new user
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    return response.json();
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Login a user (admin or student)
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/users?email=${email}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const users = await response.json();
    if (users.length === 0) {
      throw new Error("User not found");
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error("Invalid credentials");
    }
    return user;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};
