import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHEFS_AND_PRODUCTS } from "../../queries";
import { Container, Alert, Col, Row, Dropdown, Form } from "react-bootstrap";
import Button from "../../Components/Button/Button";
import MainLayout from "../../Components/Layouts/MainLayout";
import Carousel from "../../Components/Carousel/Carousel";
import ChefCard from "../../Components/ChefCard/ChefCard";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { Navigate, useLocation } from "react-router-dom";
import { campuses } from "../../Components/data/Campuses";
import CartSummary from "../Customer/CartSummary";
import Homebg from "../../assets/images/home-bg.jpeg";
import "./Dashboard.scss";
import { useNavigate } from 'react-router-dom';
import Loader from "../../Components/Loader/Loader";

export default function Dashboard() {
  const [selectedCampus, setSelectedCampus] = useState(null);
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_CHEFS_AND_PRODUCTS, {
    variables: { campus: selectedCampus },
  });
  const [viewAllChefs, setViewAllChefs] = useState(false);
  const [viewAllProducts, setViewAllProducts] = useState(false);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const successMessage = location.state?.successMessage;
  const [cart, setCart] = useState(() => { 
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [showCart, setShowCart] = useState(false); // State for cart modal visibility

  // useEffect(() => {
  //   localStorage.setItem("cart", JSON.stringify(cart));
  // }, [cart]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "{}");
    setCart(savedCart);
  }, []);
  
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);
  
  const handleShowCart = () => setShowCart(true);
  const handleCloseCart = () => setShowCart(false);

  if (loading) return <Loader />;
  if (error) return <Alert variant="danger">{error.message}</Alert>;

  const handleCampusSelect = (campus) => {
    setSelectedCampus(campus);
  };

  const handleResetCampus = () => {
    setSelectedCampus(null);
  };

  // Filter chefs and products based on the selected campus
  const filteredChefs = selectedCampus
    ? data.getAllChefs.filter((chef) => {
        console.log(
          `Filtering chef campus: ${chef.user.address_line_1} against selected campus: ${selectedCampus}`
        );
        return chef.user.address_line_1 === selectedCampus;
      })
    : data.getAllChefs; // If no campus is selected, show all chefs

  const filteredProducts = selectedCampus
    ? data.getAllProducts.filter((product) => {
        const address = product.chef?.user?.address_line_1 || "Unknown";
        console.log(
          `Filtering product: ${address} against campus: ${selectedCampus}`
        );
        return address === selectedCampus;
      })
    : data.getAllProducts;

  const searchedProducts = filteredProducts
    ? filteredProducts.filter(
        (product) =>
          product &&
          product.name &&
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  console.log("Selected Campus:", selectedCampus);
  console.log("Filtered Products:", data?.getAllProducts);

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

  return (
    <>
      <MainLayout cart={cart} handleShowCart={handleShowCart} />
      <Container fluid className="home-bg mb-5">
        <div className="overlay"></div>
        <Row>
          <Col md={12} className="p-0">
            <section className="pt-5 pb-5 position-relative home-search text-center">
              <Container>
                <Row className="align-items-center">
                  <Col lg={12} className="col-12">
                    <div className="homepage-search-title">
                      <h1 className="mb-2">
                        <b>Enjoy Fresh, Homemade Meals on Campus</b>
                      </h1>
                      <h5 className="mb-5 text-secondary font-weight-normal">
                        Order delicious, home-cooked food made by students,
                        delivered straight to you!
                      </h5>
                    </div>
                    <div className="homepage-search-form">
                      <Form className="form-noborder">
                        <div className="form-row row justify-content-center">
                          <Form.Group className="col-12 col-md-3 mb-3">
                            <Dropdown onSelect={handleCampusSelect}>
                              <Dropdown.Toggle
                                variant="secondary"
                                id="dropdown-campus"
                                className="w-100"
                              >
                                {selectedCampus || "Select Campus"}
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                {campuses.map((campus) => (
                                  <Dropdown.Item
                                    key={campus.address}
                                    eventKey={campus.address}
                                  >
                                    {campus.address}
                                  </Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                              <Button
                                className={`small icon-btn ${
                                  !selectedCampus ? "d-none" : "d-inline-block"
                                }`}
                                onClick={handleResetCampus}
                              >
                                <span className="material-icons">close</span>
                              </Button>
                            </Dropdown>
                          </Form.Group>
                          <div className="col-md-4 col-12 position-relative">
                            <Form.Control
                              type="text"
                              placeholder="Search for products"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && ( // Show the close button only if there is a search query
                              <Button
                                className="small icon-btn pl-2 right-10"
                                onClick={() => setSearchQuery("")}
                              >
                                <span className="material-icons">close</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </Form>
                    </div>
                  </Col>
                </Row>
              </Container>
            </section>
          </Col>
        </Row>
      </Container>
      <Container fluid>
        <Row>
          {successMessage && (
            <Col md={12}>
              <Alert variant="success" className="my-3">
                {successMessage}
              </Alert>
            </Col>
          )}
        </Row>

        <Row>
          {/* <Col md={6} className="mb-4">
            <Dropdown onSelect={handleCampusSelect}>
              <Dropdown.Toggle variant="secondary" id="dropdown-campus">
                {selectedCampus || "Select Campus"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {campuses.map((campus) => (
                  <Dropdown.Item key={campus.address} eventKey={campus.address}>
                    {campus.address}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Button className="btn-secondary ms-2" onClick={handleResetCampus}>
              Reset
            </Button>
          </Col> */}
          {/* <Col md={6} className="mb-4">
            <Form.Control
              type="text"
              placeholder="Search for products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col> */}

          {searchQuery ? (
            <Col md={12}>
              <h6>
                <b>Search results for "{searchQuery}"</b>
              </h6>
              <div className="product-list row">
                {searchedProducts.length > 0 ? (
                  searchedProducts.map((product) => (
                    <div className="col-md-3">
                      <ProductCard
                        key={product.id}
                        product={product}
                        cart={cart}
                        addToCart={addToCart}
                        incrementQuantity={incrementQuantity}
                        decrementQuantity={decrementQuantity}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <div className="alert alert-warning" role="alert">
                      No products found.
                    </div>
                  </div>
                )}
              </div>
            </Col>
          ) : (
            <>
              <Col md={12} className="mb-5">
                <div className="d-flex justify-content-between align-items-baseline">
                  <div>
                    <h5>Top Picks</h5>
                    <p className="d-none d-lg-block">
                      Discover our most-loved homemade dishes at{" "}
                      {selectedCampus || "all campuses"}
                    </p>
                  </div>
                  <a
                    className="btn-link"
                    onClick={() => setViewAllProducts(!viewAllProducts)}
                  >
                    {viewAllProducts ? "Show Less" : "View All"}
                  </a>
                </div>
                <hr className="mt-0" />
                <div className="row">
                  {data?.getAllProducts?.length > 0 ? (
                    data.getAllProducts.slice(0, viewAllProducts ? data.getAllProducts.length : 4).map((product) => (
                      <div className="col-md-3">
                        <ProductCard
                          key={product.id}
                          product={product}
                          cart={cart}
                          addToCart={addToCart}
                          incrementQuantity={incrementQuantity}
                          decrementQuantity={decrementQuantity}
                          
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-12">
                      <div className="alert alert-warning" role="alert">
                        No products available for the selected campus.
                      </div>
                    </div>
                  )}
                </div>
              </Col>
              <Col md={12} className="mb-5">
                <div className="d-flex justify-content-between align-items-baseline">
                  <div>
                    <h5>Chefs Around You</h5>
                    <p className="d-none d-lg-block">
                      Connect with chefs at {selectedCampus || "all campuses"}
                    </p>
                  </div>
                  <a
                    className="btn-link"
                    onClick={() => setViewAllChefs(!viewAllChefs)}
                  >
                    {viewAllChefs ? "Show Less" : "View All"}
                  </a>
                </div>
                <hr className="mt-0" />

                <div className="row">
                  {filteredChefs.length > 0 ? (
                    filteredChefs
                      .slice(0, viewAllChefs ? filteredChefs.length : 4)
                      .map((chef) => (
                        <div className="col-md-3">
                          <ChefCard key={chef.id} chef={chef}/>
                        </div>
                      ))
                  ) : (
                    <div className="col-12">
                      <div className="alert alert-warning" role="alert">
                        No chefs available for the selected campus.
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </>
          )}
        </Row>
      </Container>
      <CartSummary
        show={showCart}
        handleClose={handleCloseCart}
        cart={cart}
        products={data.getAllProducts}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
      />
    </>
  );
}
