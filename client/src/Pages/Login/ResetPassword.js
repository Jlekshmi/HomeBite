import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import InputField from "../../Components/InputField/InputField";
import Button from "../../Components/Button/Button";
import { Container, Row, Col, Alert } from "react-bootstrap";
import loginbg from "../../assets/images/login-bg.jpg";
import Logo from "../../assets/images/logo.svg";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
console.log(`token${token}`)
  const handleChangePassword = (e) => setPassword(e.target.value);
  const handleChangeConfirmPassword = (e) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword ) {
      setMessage("Please enter all the fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("https://homebite-app-c680d0ee15d5.herokuapp.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation {
              resetPassword(token: "${token}", newPassword: "${password}") {
                message
              }
            }
          `,
        }),
      });

      const result = await response.json();
      if (result.errors) {
        setError(result.errors[0].message);
      } else {
        setMessage("Password has been reset successfully!");
        setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
      }
    } catch (error) {
      setError("Error resetting password. Please try again.");
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={7} className="p-0">
        <div className="login-container">
        <div className="login-box">
        <a href="/"><img src={Logo} className="logo" alt="Logo" /></a>
        <h2 className="form-title mt-5 mb-2">Reset Password </h2>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <InputField
          label="New Password"
          name="password"
          type="password"
          placeholder="Enter new password"
          
          onChange={handleChangePassword}
        />
        <InputField
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          
          onChange={handleChangeConfirmPassword}
        />
        <Button type="submit" className="btn-primary w-100 mt-3">
          Reset Password
        </Button>
      </form>
    </div>
    </div>
    </Col>
    <Col
          md={5}
          className="d-flex align-items-center justify-content-center p-0 position-relative"
        >
          <div className="overlay position-absolute w-100 h-100"></div>
          <img
            src={loginbg}
            className="img-fluid login-bg w-100 h-100"
            alt="Background"
          />
          {/* Carousel omitted for brevity */}
        </Col>
    </Row>
    </Container>
  );
};

export default ResetPassword;
