import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_LATEST_ORDER } from "../../queries";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Alert, Button, Card } from "react-bootstrap";
import MainLayout from "../../Components/Layouts/MainLayout";

export default function OrderDetails() {
  const [customerId, setCustomerId] = useState(
    localStorage.getItem("user_id") || null
  );
  const navigate = useNavigate();

  // Validate customerId and redirect if invalid
  useEffect(() => {
    if (!customerId || !/^[a-f\d]{24}$/i.test(customerId)) {
      console.error("Invalid or missing customer ID in localStorage");
      navigate("/Login");
    }
  }, [customerId, navigate]);

  const { loading, error, data } = useQuery(GET_LATEST_ORDER, {
    skip: !customerId || !/^[a-f\d]{24}$/i.test(customerId), // Skip query if invalid
    variables: { customerId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">{error.message}</Alert>;

  const {
    order_no,
    customer_id,
    chef_id,
    items,
    total_amount,
    status,
    created_at,
  } = data.getLatestOrder;

  // Handle case where no orders are found
 
    return (
      <>
        <MainLayout />
        <Container className="mt-5">
          <h2>Order Details</h2>
        <Row>
          <div className="tab-selector">
            <Button variant="link" className="active">
              Current Orders
            </Button>
            <Button
              variant="link"
              onClick={() => navigate("/Customer/PastOrders")}
            >
              Past Orders
            </Button>
          </div>
        </Row>
        {data.getLatestOrder.length === 0 ? (
          <Row>
            <Col md={12}>
              <h1>No Orders Found</h1>
              <p>
                You haven't placed any orders yet. Start exploring our menu and
                order your favorite dishes!
              </p>
              <Button variant="primary" onClick={() => navigate("/")}>
                Order Now
              </Button>
            </Col>
          </Row>
        ) : (
        <div className="card mt-4 mb-4">
          <div className="card-body">
            <Row>
              <Col md={12}>
                <h5>Order Number:</h5>
                <p>{order_no}</p>
              </Col>
              <Col md={4}>
                <h6>Status:</h6>
                <p>{status}</p>
              </Col>
              <Col md={4}>
                <h6>Total Amount:</h6>
                <p>${total_amount.toFixed(2)}</p>
              </Col>
              <Col md={4}>
                <h6>Date:</h6>
                <p>{created_at}</p>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md={6}>
                <h6>Rider Details:</h6>
                
                  <p>
                    Jayalekshmi <br />
                    jayalekshmivj08@gmail.com<br />
                    2268999385<br />
                    Doon Campus
                  </p>
                
              </Col>
               {/*<Col md={6}>
                <h6>Customer Details:</h6>
                <p>
                  {customer_id.first_name} {customer_id.last_name} <br />
                  {customer_id.email}
                </p> 
              </Col>*/}
              
            </Row>
            <hr />
            <h6>Order Items:</h6>
            {items.map((item, index) => (
              <Row key={index} className="mb-2">
                <Col md={2}>
                  <img
                    src={item.product_id.image_url}
                    alt={item.product_id.name}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                </Col>
                <Col md={10}>
                  <p>
                    <strong>{item.product_id.name}</strong> x {item.quantity}
                  </p>
                  <p>Unit Price: ${item.unit_price.toFixed(2)}</p>
                </Col>
              </Row>
            ))}
            <hr />
            <Button
              variant="btn btn-primary mb-2"
              onClick={() => navigate("/")}
            >
              Order More
            </Button>
          </div>
        </div>
)}
      </Container>
    </>
  );
}