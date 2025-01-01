import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";
import loginbg from "../../assets/images/login-bg.jpg";
import Logo from "../../assets/images/logo.svg";
import InputField from "../../Components/InputField/InputField";
import Button from "../../Components/Button/Button";
import { useLocation } from "react-router-dom";
import CarouselComponent from "../../Components/CarouselComponent/CarouselComponent";
import { Container, Row, Col, Alert,Nav } from "react-bootstrap";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const location = useLocation();
  const successMessage = location.state?.successMessage;
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Client-side validation
    if (!loginData.email || !loginData.password) {
      setMessage("Please fill in both email and password.");
      return;
    }
    // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const emailPattern=/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    const emailPattern = /^(?!.*\.\.)(?!.*@.*@)(?!.*\s)(?!.*[,'`])([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.(com|org|net|gov|edu|mil|info|biz|name|us|uk|ca|au|in|de|fr|cn|jp|br|ru|za|mx|nl|es|it|app|blog|shop|online|site|tech|io|ai|co|xyz|photography|travel|museum|jobs|health)$/;
    if (!emailPattern.test(loginData.email)) {
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
              login(input: { email: "${loginData.email}", password: "${loginData.password}" }) {
                token
                user {
                  id
                  first_name
                  last_name
                  email
                  role
                }
              }
            }
          `,
        }),
      });

      const result = await response.json();
      if (result.errors) {
        setMessage(result.errors[0].message); // Display error message
      } else {
        localStorage.setItem("token", result.data.login.token);
        localStorage.setItem("user_id", result.data.login.user.id);
        localStorage.setItem("uname", result.data.login.user.first_name);
        localStorage.setItem("urole", result.data.login.user.role);
        const urole = localStorage.getItem("urole");
        //console.log(result.data.login.token)
        //console.log(result.data.login.user.id)
        //console.log(localStorage.getItem("user_id"))
        console.log("urole:",urole);
        if(urole.includes("chef")){
          navigate("/chef/orders");

        }else if(urole.includes("rider")){
          navigate("/rider/orders");

        }else{
          navigate("/");
        }
        
      }
    } catch (error) {
      setMessage("Error logging in");
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col className="home-bg col-12 d-lg-none ht">
        <div className="overlay"></div>
        </Col>
        {successMessage && (
            <Col md={12}>
              <Alert variant="success" className="my-3">
                {successMessage}
              </Alert>
            </Col>
          )}
        <Col lg={7} className="p-0">
          <div className="login-container">
            <div className="login-box">
              
              <Nav.Link href="/"><img src={Logo} className="logo" alt="Logo" /></Nav.Link>
              <h4 className="mt-5 mb-2">Sign In </h4>
              <h4 className="mb-3">
                {/* Sign in to enjoy the best home-cooked meals made with care! */}
              </h4>
              {message && <Alert variant="danger">{message}</Alert>}
              <form onSubmit={handleSubmit}>
                <InputField
                  label="Email "
                  name="email" // Change from "username" to "email"
                  type="text"
                  placeholder="Email"
                  autoComplete="email" // Good practice
                  onChange={handleChange} // Use handleChange here
                />
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Password"

                  autoComplete="current-password" // Add autocomplete
                  onChange={handleChange} // Use handleChange here
                />
                <Button type="submit" className="w-100 mb-3">
                  Let's Go!
                </Button>
                <div className="auth-links d-md-flex justify-content-between">
                  <span>
                  <span className="d-none d-md-inline-block">
                    New to HomeBite?&nbsp; {" "}

                  </span>
                  <a href="/register" className="btn-link d-block d-md-inline-block">
                    Create an account
                  </a>
                  </span>
                  <a href="/forgot-password" className="btn-link">
                    Forgot Password?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </Col>
        <Col
          lg={5}
          className="d-none d-lg-flex align-items-center justify-content-center p-0 position-relative"
        >
          <div className="overlay position-absolute w-100 h-100"></div>
          <img
            src={loginbg}
            className="img-fluid login-bg w-100 h-100"
            alt="Background"
          />
          <CarouselComponent
            carouselId="textCarousel"
            items={[
              "Bringing the taste of home, made by local chefs, for everyone to enjoy.",
              "Fresh, homemade meals from your neighbors, straight to your table.",
              "Crafted with care by local hands, for the heart of our community",
            ]}
          />
        </Col>

      </Row>
    </Container>
  );
};

export default Login;
