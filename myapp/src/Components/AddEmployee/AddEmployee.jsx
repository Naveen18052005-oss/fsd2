import React, { useState } from "react";
import "./AddEmployee.css";

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phoneNumber: "",
    department: "",
    dateOfJoining: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const departments = ["HR", "Engineering", "Marketing", "Sales"]; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.employeeId) newErrors.employeeId = "Employee ID is required.";
    if (!formData.email.match(/^[\w-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/))
      newErrors.email = "Invalid email format.";
    if (!formData.phoneNumber.match(/^\d{10}$/))
      newErrors.phoneNumber = "Phone number must be 10 digits.";
    if (!formData.department) newErrors.department = "Department is required.";
    if (!formData.dateOfJoining || new Date(formData.dateOfJoining) > new Date())
      newErrors.dateOfJoining = "Date of Joining cannot be in the future.";
    if (!formData.role) newErrors.role = "Role is required.";

    return newErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage("");
    } else {
      setErrors({});
      const res = await fetch("https://fsd2.onrender.com/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      }) 

      if (res.ok) {
        setSuccessMessage("Employee added successfully!");
        console.log("Form Submitted Successfully:", formData);
        handleReset()
      }
      else {
        setSuccessMessage("Employee ID or Email already exists")
      }
    }
  };

  const handleReset = (e) => {
    setFormData({
      name: "",
      employeeId: "",
      email: "",
      phoneNumber: "",
      department: "",
      dateOfJoining: "",
      role: "",
    });
  }
  return (
    <div className="form-container">
      <h2>Add New Employee</h2>
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}

        <label>Employee ID:</label>
        <input
          type="text"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          maxLength="10"
        />
        {errors.employeeId && (
          <span className="error">{errors.employeeId}</span>
        )}

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <label>Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          maxLength="10"
        />
        {errors.phoneNumber && (
          <span className="error">{errors.phoneNumber}</span>
        )}

        <label>Department:</label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        {errors.department && (
          <span className="error">{errors.department}</span>
        )}

        <label>Date of Joining:</label>
        <input
          type="date"
          name="dateOfJoining"
          value={formData.dateOfJoining}
          onChange={handleChange}
        />
        {errors.dateOfJoining && (
          <span className="error">{errors.dateOfJoining}</span>
        )}

        <label>Role:</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
        />
        {errors.role && <span className="error">{errors.role}</span>}

        <button type="submit">Submit</button>
        <button
          type="reset"
          onClick={handleReset}
        >
          Reset
        </button>
      </form>
    </div>
  );
}

export default AddEmployee;
