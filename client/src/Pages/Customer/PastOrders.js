import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Alert, Button, Card } from "react-bootstrap";
import MainLayout from "../../Components/Layouts/MainLayout";

export default function PastOrders() {
  const customerId = localStorage.getItem("user_id"); // Retrieve the customerId from localStorage
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!customerId || !/^[a-f\d]{24}$/i.test(customerId)) {
      console.error("Invalid or missing customer ID in localStorage");
      navigate("/Login");
      return;
    }

    const fetchPastOrders = async () => {
      try {
        const response = await fetch("https://homebite-app-c680d0ee15d5.herokuapp.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query GetPastOrders($customer_id: ID!) {
                getPastOrdersCustomer(customer_id: $customer_id) {
                  _id
                  order_no
                  status
                  total_amount
                  created_at
                  customer_id {
                    first_name
                    last_name
                  }
                  items {
                    product_id {
                      name
                      image_url
                    }
                    quantity
                  }
                  payment {
                    payment_method
                    amount
                    payment_status
                  }
                }
              }
            `,
            variables: { customer_id: customerId }, // Use the correct variable key
          }),
        });

        const json = await response.json();
        console.log("GraphQL Response:", json); // Debugging log

        if (json.errors) {
          throw new Error(json.errors[0].message);
        }

        setOrders(json.data.getPastOrdersCustomer || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching past orders:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPastOrders();
  }, [customerId, navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <MainLayout />
      <Container className="mt-5 vh-100">
      <h2>Order Details</h2>
        <Row>
          <div className="tab-selector">
            <Button
              variant="link"
              onClick={() => navigate("/Customer/OrderDetails")}
            >
              Current Orders
            </Button>
            <Button variant="link" className="active">
              Past Orders
            </Button>
          </div>
        </Row>
        {orders.length === 0 ? (
          <Row>
            <Col md={12}>
              <h1>No Completed Orders</h1>
              <p>
                You haven't placed any completed orders yet. Explore our menu
                and start placing orders!
              </p>
              {/* <Button variant="primary" onClick={() => navigate("/")}>
                Order Now
              </Button> */}
            </Col>
          </Row>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="card mt-4 mb-4">
              <div className="card-body">
                <Row>
                  <Col md={12}>
                    <h5>Order #{order.order_no}</h5>
                  </Col>
                  <Col md={4}>
                    <h6>Status:</h6>
                    <p>{order.status}</p>
                  </Col>
                  <Col md={4}>
                    <h6>Total Amount:</h6>
                    <p>${order.total_amount.toFixed(2)}</p>
                  </Col>
                  <Col md={4}>
                    {/* <h6>Date:</h6>
                    <p>{new Date(order.created_at).toLocaleString()}</p> */}
                  </Col>
                </Row>
                <hr />
                <h6>Order Items:</h6>
                {order.items.map((item, index) => (
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
                        <strong>{item.product_id.name}</strong> x{" "}
                        {item.quantity}
                      </p>
                    </Col>
                  </Row>
                ))}
                <hr />
                <Row>
                  <Col md={4}>
                    <h6>Payment Method:</h6>
                    <p>{order.payment?.payment_method || "N/A"}</p>
                  </Col>
                  <Col md={4}>
                    <h6>Payment Status:</h6>
                    <p>{order.payment?.payment_status || "N/A"}</p>
                  </Col>
                  <Col md={4}>
                    <h6>Payment Amount:</h6>
                    <p>${order.payment?.amount?.toFixed(2) || "0.00"}</p>
                  </Col>
                </Row>
              </div>
            </div>
          ))
        )}

        <Button variant="primary mb-4" onClick={() => navigate("/")}>
          Order More
        </Button>
      </Container>
    </>
  );
}
