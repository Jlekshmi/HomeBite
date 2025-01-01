import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";




const RiderOrderCompleted = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const rider_id = localStorage.getItem("user_id"); // Fetch rider ID from local storage
    try {
      const response = await fetch("https://homebite-app-c680d0ee15d5.herokuapp.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query {
              getCompletedOrdersRider(rider_id: "${rider_id}") {
                _id
                order_no
                status
                total_amount
                created_at
                customer_id {
                  first_name
                  last_name
                  address_line_1
                  city
                  province
                }
                items {
                  product_id {
                    name
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
        }),
      });
      const json = await response.json();
      if (json.errors) {
        throw new Error(json.errors[0].message);
      }
      setOrders(json.data.getCompletedOrdersRider || []);
    } catch (error) {
      console.error("Error fetching rider's completed orders:", error);
    }
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col className="mb-4">
          <h2>Welcome back, Rider</h2>
          <h6>Track, manage and review your completed deliveries.</h6>
        </Col>
      </Row>

      <Row>
        <Col xs={12} lg={6} xl={3} className="mb-3">
          <div className="card alert alert-primary">
            <div className="card-body">
              <h5>Today's Deliveries</h5>
              <h3>12</h3>
            </div>
          </div>
        </Col>
        <Col xs={12} lg={6} xl={3} className="mb-3">
          <div className="card alert alert-success">
            <div className="card-body">
              <h5>Today's Earnings</h5>
              <h3>$320</h3>
            </div>
          </div>
        </Col>
        <Col xs={12} lg={6} xl={3} className="mb-3">
          <div className="card alert alert-warning">
            <div className="card-body">
              <h5>Total Deliveries</h5>
              <h3>48</h3>
            </div>
          </div>
        </Col>
        <Col xs={12} lg={6} xl={3} className="mb-3">
          <div className="card alert alert-danger">
            <div className="card-body">
              <h5>Total Earnings</h5>
              <h3>$1,200</h3>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2>Completed Orders</h2>
          {orders.length > 0 ? (
            orders.map((order) => (
              <div className="card mb-3 order-card" key={order._id}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h5 className="card-title">
                        {order.customer_id?.first_name}{" "}
                        {order.customer_id?.last_name}
                      </h5>
                    </div>
                    <div className="col-md-6 text-end mb-3">
                      <span className="badge rounded-pill text-bg-light text-wrap">
                        <span className="material-icons link-color me-2">
                          location_on
                        </span>
                        Delivery Address: {order.customer_id?.address_line_1},{" "}
                        {order.customer_id?.city}, {order.customer_id?.province}
                      </span>
                    </div>
                    <div className="col-md-12 text-muted small">
                      Order No : # {order.order_no}
                    </div>
                    <div className="col-md-12 mb-3">
                      {order.items.map((item, index) => (
                        <span
                          className="badge rounded-pill text-bg-light me-3"
                          key={index}
                        >
                          {item.product_id?.name || "Unknown Product"} x
                          {item.quantity}
                        </span>
                      ))}
                    </div>
                    <div className="col-md-6 text-muted small d-lg-flex gap-2">
                      <div className="mb-2">
                        <span className="material-icons link-color me-1">
                          schedule
                        </span>
                        {new Date(order.created_at).toLocaleString()}
                      </div>
                      <div className="mb-2">
                        <span className="material-icons link-color me-1">
                          attach_money
                        </span>
                        ${order.payment.amount.toFixed(2)}
                      </div>
                      <div className="mb-2">
                        <span className="badge rounded-pill text-bg-success">
                          <span className="material-icons">check_circle</span>{" "}
                          {order.payment.payment_method}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No completed orders available.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default RiderOrderCompleted;
