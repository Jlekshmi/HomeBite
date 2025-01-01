import React from "react";
import { Card, Button, Alert } from "react-bootstrap";
import "./ProductCard.scss";
import defaultProductImage from "../../assets/images/product.jpg";
import veg from "../../assets/images/veg.svg";
import nonveg from "../../assets/images/non-veg.svg";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  product,
  cart = {}, // Default to an empty cart object
  addToCart = () => {},
  incrementQuantity = () => {},
  decrementQuantity = () => {},
}) {
  const navigate = useNavigate(); // Always call hooks at the top level

  // Check if product is invalid and render an error message
  if (!product || !product.id) {
    return (
      <Alert variant="danger" className="m-3">
        Product data is missing or incomplete!
      </Alert>
    );
  }

  const dietaryIcon =
    product.dietary === "Veg"
      ? veg
      : product.dietary === "Non Veg"
      ? nonveg
      : null;

  const campusName =
    product?.user?.address_line_1 || "Campus information unavailable";

  const quantity = cart[product.id] || 0;

  return (
    <Card className="product-card mb-3">
      {/* Fallback image logic */}
      {product.image_url ? (
        <Card.Img
          variant="top"
          src={product.image_url}
          alt={product.name || "Product Image"}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = defaultProductImage; // Use fallback image on error
          }}
        />
      ) : (
        <Card.Img
          variant="top"
          src={defaultProductImage} // Default image if image_url is missing
          alt="Default Product"
        />
      )}
      <Card.Body className="pb-0">
        <Card.Title className="justify-content-between d-flex" onClick={() =>
              navigate(`/Customer/ProductDetails/${product.id}`)
            }>
          {product.name || "Unnamed Product"}
          {dietaryIcon && (
            <img
              className="align-bottom"
              src={dietaryIcon}
              alt={product.dietary || "Unknown"}
              title={product.dietary || "Unknown"}
            />
          )}
        </Card.Title>
        <Card.Text className="text-truncate">
          {product.description || "No description available."}
        </Card.Text>

        <Card.Text className="campus-name">
          <span className="material-icons">location_on</span> {campusName}
        </Card.Text>
        {/* <Card.Text>
          <a
            onClick={() =>
              navigate(`/Customer/ProductDetails/${product.id}`)
            }
          >
            Product Details
          </a>
        </Card.Text> */}
        <hr />
        <div className="d-flex justify-content-between align-center">
          <p className="price mb-0">
            ${product.price ? product.price.toFixed(2) : "0.00"}
          </p>
          {quantity > 0 ? (
            <div className="cart-controls">
              <Button
                variant="secondary small"
                onClick={() => decrementQuantity(product.id)}
              >
                -
              </Button>
              <span>{quantity}</span>
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
      </Card.Body>
    </Card>
  );
}
