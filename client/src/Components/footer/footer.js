import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";



const Footer = () => {
  return (
    <footer className="bg-dark text-white">
      <Container>
        <Row className="justify-content-between">
          <Col md={5}>
            {/* <h5>About Us</h5>
            <p>
              We connect you with the best chefs to deliver home cooked meals at your doorstep.
            </p> */}
            <p className="mb-0">
              &copy; {new Date().getFullYear()} HomeBite. All Rights Reserved.
            </p>
          </Col>
          <Col md={3} >
            <h5>Contact</h5>
            <p>Email: homebitecuisines@gmail.com</p>
            {/* <p>Phone: +1 234 567 890</p> */}
          </Col>
        </Row>
        {/* <Row className="mt-3">
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} HomeBite. All Rights Reserved.
            </p>
          </Col>
        </Row> */}
      </Container>
    </footer>
  );
};

export default Footer;
