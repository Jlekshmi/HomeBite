import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import Loader from "../../Components/Loader/Loader";
import CartSummary from "../Customer/CartSummary";
import MainLayout from "../../Components/Layouts/MainLayout";

export default function ChefDetails() {
  const navigate = useNavigate();
  const { chefId } = useParams(); // Extract chefId from the URL
  const [chef, setChef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchChefDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://homebite-app-c680d0ee15d5.herokuapp.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query GetChefById($id: ID!) {
                getChefById(id: $id) {
                  id
                  bio
                  specialty_cuisines
                  type_of_meals
                  user {
                    first_name
                    last_name
                    profile_image
                    address_line_1
                    address_line_2
                    city
                    province
                  }
                  products {
                    id
                    name
                    description
                    price
                    image_url
                    dietary
                  }
                }
              }
            `,
            variables: { id: chefId },
          }),
        });

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0].message || "Failed to fetch chef details");
        }

        setChef(data.data.getChefById);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchChefDetails();
  }, [chefId]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1,
    }));
  };

  const incrementQuantity = (productId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: prevCart[productId] + 1,
    }));
  };

  const decrementQuantity = (productId) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[productId] > 1) {
        updatedCart[productId] -= 1;
      } else {
        delete updatedCart[productId];
      }
      return updatedCart;
    });
  };

  if (loading) return <Loader />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  if (!chef) {
    return (
      <Container>
        <Alert variant="warning">Chef not found!</Alert>
      </Container>
    );
  }

  const chefName = `${chef.user?.first_name || "Unknown"} ${chef.user?.last_name || ""}`;

  return (
    <>
      <MainLayout cart={cart} handleShowCart={() => setShowCart(true)} />
      <Container  className="my-5">
        <Row>
          <div className="col-12 mb-3">
            <a className="btn-link" variant="link" onClick={() => navigate("/")}>
              Home
            </a> <span className="material-icons">chevron_right</span> {chefName}'s Details
          </div>
          <div className="col-12 mb-5">
            <div className="card">
              <div className="card-body pt-0 pb-0">
                <div className="row">
                  <div className='col-md-4 text-center bg-light p-5'>
                    <img src={chef.user?.profile_image || "default-profile.jpg"} alt="Profile" className="img-fluid profile-img" style={{ maxWidth: "150px" }} />
                    <h5 className="mb-1 mt-3">{chefName}</h5>
                  </div>
                  <div className="col-md-8 mt-md-4 pb-3">
                    <div className="row">
                      <div className="col-md-6">
                        <p>{chef.bio || "No bio available."}</p>
                        <div className="d-flex text-muted  mt-3 mb-3">
                          <span className="material-icons me-2">map</span>
                          <div className="flex-grow-1">
                            <p className="mb-0 text-muted">{chef.user?.address_line_1}</p>
                            <p className="mb-0 text-muted">{chef.user?.address_line_2}</p>
                            <p className="mb-0 text-muted">{chef.user?.city}</p>
                            <p className="mb-0 text-muted">{chef.user?.province}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">


                      {chef && (
                        <>
                          <div className='col-md-4'>
                            <p><small>Specialty Cuisines</small><br /> {chef.specialty_cuisines?.join(', ')}</p>
                          </div>
                          <div className='col-md-4'>
                            <p><small>Type of Meals</small><br /> {chef.type_of_meals?.join(', ')}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Col md={12}>

            <Row>
              {Array.isArray(chef.products) && chef.products.length > 0 ? (
                chef.products.map((product) => (
                  <Col md={3} key={product.id}>
                    <Card className="mb-3">
                      <Card.Img variant="top" src={product.image_url || "default-image.jpg"} />
                      <Card.Body>
                        <h5>{product.name}</h5>
                        <p>${product.price?.toFixed(2)}</p>
                        {cart[product.id] > 0 ? (
                          <div className="cart-controls d-flex align-items-center">
                            <Button
                              variant="outline-secondary"
                              onClick={() => decrementQuantity(product.id)}
                            >
                              -
                            </Button>
                            <span className="mx-2">{cart[product.id]}</span>
                            <Button
                              variant="outline-secondary"
                              onClick={() => incrementQuantity(product.id)}
                            >
                              +
                            </Button>
                          </div>
                        ) : (
                          <Button variant="primary" onClick={() => addToCart(product.id)}>
                            Add to Cart
                          </Button>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <Alert variant="warning">No products found!</Alert>
              )}

            </Row>
          </Col>
        </Row>
      </Container>
      <CartSummary
        show={showCart}
        handleClose={() => setShowCart(false)}
        cart={cart}
        products={chef.products || []} // Pass chef's products to CartSummary
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
      />
    </>
  );
}
