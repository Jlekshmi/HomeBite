import React from "react";
import { Offcanvas, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function CartSummary({
  show,
  handleClose,
  cart,
  products,
  incrementQuantity,
  decrementQuantity,
}) {

    const navigate = useNavigate();
    const cartItems = Object.entries(cart).map(([productId, quantity]) => {
      const product = products.find((p) => p.id === productId);
      return { 
        ...product, 
        quantity, 
        chef_id: product?.chef_id // Ensure chef_id is included
      };
    });

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

// Handle Checkout Logic
const handleCheckout = async () => {
  const userId = localStorage.getItem("user_id"); // Get customer ID

  if (!userId) {
    navigate("/Login"); // Redirect to login page if not logged in
    return;
  }

  if (!cart || cartItems.length === 0) {
    console.error("Error: Cart is empty.");
    return;
  }

  try {
    // Prepare cart items for the checkout session
    const products = cartItems.map((item) => ({
      id: item.id, // Pass product ID
      name: item.name,
      price: Math.round(item.price * 100), // Convert to cents for Stripe
      quantity: item.quantity,
    }));

    // Get the chef_id dynamically from the first product in the cart
    const chefId = cartItems[0]?.chef_id;

    // Define GraphQL mutation
    const mutation = `
      mutation CreateCheckoutSession($orderInput: OrderInput!) {
        createCheckoutSession(orderInput: $orderInput) {
          sessionId
          url
        }
      }
    `;

    // Make a POST request to the GraphQL endpoint
    const response = await fetch("https://homebite-app-c680d0ee15d5.herokuapp.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          orderInput: {
            products,
            successUrl: "http://localhost:3000/Customer/OrderDetails",
            cancelUrl: "http://localhost:3000/",
            customerId: userId,
            chefId, // Pass the derived chef ID
          },
        },
      }),
    });

    const data = await response.json();

    if (data?.data?.createCheckoutSession?.url) {
      // Redirect to Stripe Checkout
      window.location.href = data.data.createCheckoutSession.url;
    } else {
      console.error("Error: Unable to create checkout session.");
    }
  } catch (error) {
    console.error("Error during checkout:", error.message);
  }
};

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Cart</Offcanvas.Title>
        <span> ({cartItems.length})</span>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item mb-3">
              <div>
                <strong>{item.name}</strong>
                <p>${item.price?.toFixed(2)}</p>
              </div>
              <div className="quantity-controls d-flex align-items-center">
                <Button variant="outline-secondary" onClick={() => decrementQuantity(item.id)}>
                  -
                </Button>
                <span className="mx-2">{item.quantity}</span>
                <Button variant="outline-secondary" onClick={() => incrementQuantity(item.id)}>
                  +
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
        <hr />
        {/* <Form>
          <Form.Group controlId="tips" className="mb-3">
            <Form.Control type="number" placeholder="Add tips" />
          </Form.Group>
        </Form> */}
        <div className="subtotal">
          <strong>Subtotal: ${subtotal.toFixed(2)}</strong>
          <p>Extra charges may apply</p>
        </div>
        <Button variant="primary" onClick={handleCheckout} className="w-100">
          Checkout
        </Button>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
