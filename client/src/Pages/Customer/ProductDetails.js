import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../Components/Layouts/MainLayout";
import CartSummary from "../Customer/CartSummary";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import defaultProductImage from "../../assets/images/product.jpg";
import Loader from "../../Components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import veg from "../../assets/images/veg.svg";
import nonveg from "../../assets/images/non-veg.svg";


export default function ProductDetails() {
  const navigate = useNavigate();
  const { productId } = useParams(); // Extract productId from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : [];
  }); // Retrieve saved products from localStorage
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        setError("Product ID is missing from the URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("https://homebite-app-c680d0ee15d5.herokuapp.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query GetProductById($id: ID!) {
                getProductById(id: $id) {
                  id
                  name
                  description
                  price
                  quantity
                  image_url
                  dietary
                  chef {
                    id
                    user {
                      first_name
                      last_name
                      address_line_1
                    }
                  }
                }
              }
            `,
            variables: { id: productId },
          }),
        });

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0].message || "Failed to fetch product details");
        }

        const fetchedProduct = data.data.getProductById;

        // Normalize product to include chef_id
        const normalizedProduct = {
          ...fetchedProduct,
          chef_id: fetchedProduct.chef.id,
        };

        setProduct(normalizedProduct);

        // Save product to localStorage if not already present
        setProducts((prevProducts) => {
          const updatedProducts = [...prevProducts];
          if (!prevProducts.find((p) => p.id === normalizedProduct.id)) {
            updatedProducts.push(normalizedProduct);
            localStorage.setItem("products", JSON.stringify(updatedProducts));
          }
          return updatedProducts;
        });
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

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
  const dietaryIcon =
    product?.dietary === "Veg"
      ? veg
      : product?.dietary === "Non Veg"
        ? nonveg
        : null;



  if (loading) return <Loader />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  const cartQuantity = cart[product?.id] || 0; // Get the current quantity of the product in the cart

  return (
    <>
      <MainLayout cart={cart} handleShowCart={() => setShowCart(true)} />
      <Container className="my-5">
      <div className="col-12 mb-3">
            <a className="btn-link" variant="link" onClick={() => navigate("/")}>
              Home
            </a> <span className="material-icons">chevron_right</span> {product.name}
          </div>
        {product ? (
          <Row>
            <Col md={4}>
              <img src={product.image_url || defaultProductImage} class="w-100" alt={product.name || "Product Image"} />
            </Col>
            <Col md={8}>
              <div class="product-card card ht-100">
                <h5 class="card-title cursor-default">{product.name} {dietaryIcon && (
                  <img
                    className="align-bottom"
                    src={dietaryIcon}
                    alt={product?.dietary || "Unknown"}
                    title={product?.dietary || "Unknown"}
                  />
                )}</h5>
                <p className="price mb-0">${product.price?.toFixed(2)}</p>
                <hr />
                <div class="card-body">
                  <ul class="list-group list-group-flush border-0">
                    <li class="list-group-item bg-transparent border-0 ps-0"><p class="card-text">{product.description || "No description available."}</p></li>
                    <li class="list-group-item bg-transparent border-0 ps-0 campus-name"><span className="material-icons me-2">location_on</span>{`${product.chef?.user?.address_line_1}` || "Unknown"}</li>
                    <li class="list-group-item bg-transparent border-0 ps-0 campus-name"><span className="material-icons me-2">room_service</span>{`${product.chef?.user?.first_name} ${product.chef?.user?.last_name}` || "Unknown"}</li>
                    <li className="list-group-item bg-transparent border-0 ps-0 campus-name">
                    <span className="material-icons me-2">production_quantity_limits</span>Quantity Remaining: {product.quantity !== null ? product.quantity : "Not Available"}
                    </li>
                  </ul>
                  <div className="d-md-flex justify-content-between align-center">

                    {cartQuantity > 0 ? (
                      <div className="cart-controls justify-content-start mt-3">
                        <Button
                          variant="secondary small"
                          onClick={() => decrementQuantity(product.id)}
                        >
                          -
                        </Button>
                        <span>{cartQuantity}</span>
                        <Button
                          variant="secondary small"
                          onClick={() => incrementQuantity(product.id)}
                        >
                          +
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="secondary small"
                        onClick={() => addToCart(product.id)}
                      >
                        Add
                      </Button>
                    )}

                  </div>
                </div>

              </div>
              {/* <Card>
                <Card.Img
                  variant="top"
                  src={product.image_url || "default-image.jpg"}
                  alt={product.name || "Product Image"}
                />
              </Card> */}
            </Col>
            {/* <Col md={6}>
              <h2>{product.name}</h2>
              <p className="text-secondary">{product.description || "No description available."}</p>
              <h4>Unit Price: ${product.price?.toFixed(2)}</h4>
              <h5>Chef: {`${product.chef?.user?.first_name} ${product.chef?.user?.last_name}` || "Unknown"}</h5>
              <h5>Campus: {`${product.chef?.user?.address_line_1}` || "Unknown"}</h5>
              {cartQuantity > 0 ? (
                <div className="quantity-controls d-flex align-items-center mt-3">
                  <Button
                    variant="outline-secondary"
                    onClick={() => decrementQuantity(product.id)}
                  >
                    -
                  </Button>
                  <span className="mx-3">{cartQuantity}</span>
                  <Button
                    variant="outline-secondary"
                    onClick={() => incrementQuantity(product.id)}
                  >
                    +
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={() => addToCart(product.id)}
                >
                  Add to Cart
                </Button>
              )}
            </Col> */}
          </Row>
        ) : (
          <Alert variant="warning">Product not found!</Alert>
        )}

      </Container>
      <CartSummary
        show={showCart}
        handleClose={() => setShowCart(false)}
        cart={cart}
        products={products} // Pass all products to ensure correct lookup
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
      />

    </>
  );
}
