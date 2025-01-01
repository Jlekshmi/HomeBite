import React, { useState } from "react";
import InputField from "../../Components/InputField/InputField";
import Button from "../../Components/Button/Button";
import { Container, Row, Col, Alert } from "react-bootstrap";
import loginbg from "../../assets/images/login-bg.jpg";
import Logo from "../../assets/images/logo.svg";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email ) {
        setMessage("Please enter the email.");
        return;
      }
      const emailPattern=/^(?!.*\.\.)(?!.*@.*@)(?!.*\s)(?!.*[,'`])([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.(com|org|net|gov|edu|mil|info|biz|name|us|uk|ca|au|in|de|fr|cn|jp|br|ru|za|mx|nl|es|it|app|blog|shop|online|site|tech|io|ai|co|xyz|photography|travel|museum|jobs|health)$/
      if (!emailPattern.test(email)) {
        setMessage("Please enter a valid email address.");
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
              forgotPassword(email: "${email}") {
                message
              }
            }
          `,
        }),
      });
      
      const result = await response.json();
      if (result.errors) {
        setMessage(result.errors[0].message);
      } else {
        setMessage("Check your email for reset instructions.");
      }
    } catch (error) {
      setMessage("Error processing request");
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={7} className="p-0">
    <div className="login-container">
    <div className="login-box">
    <a href="/"><img src={Logo} className="logo" alt="Logo" /></a>
    <h4 className="mt-5 mb-2">Forgot Password </h4>
      {message && <Alert variant="danger">{message}</Alert>}
      <form onSubmit={handleSubmit}>
        <InputField
          label="Enter your registered email"
          name="email"
          type="text"
          placeholder="Your Email Address"
          
          onChange={handleChange}
        />
        <Button type="submit" className="btn-primary w-100 mt-3">
          Send Reset Link
        </Button>
        <p className="text-center d-grid d-lg-flex mb-3 gap-2 mt-3">
                        Already Have an Account?{" "}
                        <a href="/login" className="btn-link">
                          Sign in here
                        </a>
                      </p>
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

export default ForgotPassword;
