import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useParams, useNavigate } from 'react-router-dom';
import Button from "../../../Components/Button/Button";
import InputField from '../../../Components/InputField/InputField';
import ImageUpload from '../../../Components/ImageUpload/ImageUpload';
import { Link } from 'react-router-dom';
import { Card } from "react-bootstrap";
import "../chef.scss";

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    dietary: '', // Default dietary value
    image_url: '',
    is_available: '', // Default availability value
  });
  const [newImageUrl, setNewImageUrl] = useState(null); // For new image uploads
  const [message, setMessage] = useState(''); // To display validation messages
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await fetch('https://homebite-app-c680d0ee15d5.herokuapp.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query {
              getProduct(id: "${id}") {
                name
                description
                price
                quantity
                dietary
                image_url
                is_available
              }
            }
          `,
        }),
      });
      const { data } = await response.json();
      setProduct(data.getProduct);
    } catch (error) {
      setMessage('Failed to fetch product details. Please try again.');
      console.error('Error fetching product:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleImageUpload = (imageUrl) => {
    setNewImageUrl(imageUrl); // Update with new image URL
    setMessage(''); // Clear validation message when a valid image is uploaded
  };

  const validateFields = () => {
    const specialCharsPattern = /[!@#$%^&*(),.?":{}|<>]/;

    // Validate Product Name
    if (!product.name.trim()) {
      setMessage('Product name cannot be empty.');
      return false;
    } else if (specialCharsPattern.test(product.name)) {
      setMessage('Product name cannot contain special characters.');
      return false;
    }

    // Validate Price
    if (!product.price || isNaN(product.price) || parseFloat(product.price) <= 0) {
      setMessage('Price must be a positive number.');
      return false;
    }

    // Validate Quantity
    if (!product.quantity || isNaN(product.quantity) || parseInt(product.quantity, 10) < 0) {
      setMessage('Quantity must be a non-negative integer.');
      return false;
    }



    // Validate Dietary
    if (!product.dietary) {
      setMessage('Please select a dietary option.');
      return false;
    }

    // Validate Availability
    if (!product.is_available) {
      setMessage('Please select if the product is available.');
      return false;
    }
    // Validate Description
    if (!product.description.trim()) {
      setMessage('Description cannot be empty.');
      return false;
    }

    // Validate Image
    if (!product.image_url && !newImageUrl) {
      setMessage('Product image is required.');
      return false;
    }

    setMessage(''); // Clear previous messages if validation passes
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return; // Stop submission if validation fails
    }

    const imageUrl = newImageUrl || product.image_url; // Use new image URL if uploaded, otherwise use the original

    try {
      await fetch('https://homebite-app-c680d0ee15d5.herokuapp.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation {
              updateProduct(id: "${id}", input: {
                name: "${product.name}",
                description: "${product.description}",
                price: ${product.price},
                quantity: ${product.quantity},
                dietary: "${product.dietary}",
                image_url: "${imageUrl}",
                is_available: "${product.is_available}"
              }) {
                id
              }
            }
          `,
        }),
      });
      setMessage('Product updated successfully!');
      navigate('/chef/products');
    } catch (error) {
      setMessage('Failed to update product. Please try again.');
      console.error('Error updating product:', error);
    }
  };

  const handleCancel = () => {
    navigate("/chef/products"); // Redirect to products.js
  };
  return (
    <Container fluid className="orders-page mt-3 bt-1">
      <Row>
        <Col>
          <Link className="btn-link  mb-3" to="/chef/orders">Dashboard</Link><span className="material-icons">
            arrow_forward
          </span>
          <Link className="btn-link mb-3" to="/chef/products">Menu</Link><span className="material-icons">
            arrow_forward
          </span><span>Edit Menu</span>
        </Col>
      </Row>

      <Row className='mt-5'>
        <Col md={3} className='mb-3'>
          <Card>
            <Card className="product-card" key={product.id}>
              {product.image_url && (
                <div className='mb-3'>
                  <label>Current Image</label><br />
                  <img src={product.image_url} alt="Product" style={{ width: '100px', height: '100px' }} />
                </div>
              )}

              {/* Image Upload Component */}
              <ImageUpload
                label="Upload New Image"
                currentImageUrl={product.image_url} // Show current image when page loads
                onImageUpload={handleImageUpload} // Update after upload
              />

              {/* Show new image preview after upload */}
              {/* {newImageUrl && (
                <div className='mt-3'>
                  <label>New Image Preview:</label><br />
                  <img src={newImageUrl} alt="New Product" style={{ width: '100px', height: '100px' }} />
                </div>
              )} */}
            </Card>
          </Card>
        </Col>
        <Col md={6} className="p-0">
          {message && <Alert variant="danger">{message}</Alert>}
          <form onSubmit={handleSubmit} className='row'>
            <Col md={12}>
              <InputField
                label="Product Name"
                name="name"
                placeholder="Name"
                value={product.name}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <InputField
                label="Price $"
                name="price"
                type="number"
                placeholder="Price"
                value={product.price}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <InputField
                label="Quantity"
                name="quantity"
                type="number"
                placeholder="Quantity"
                value={product.quantity}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <label>Availability</label>
              <select
                name="is_available"
                className="form-control"
                value={product.is_available}
                onChange={handleChange}
              >
                <option value="">-select-</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Col>
            <Col md={4}>
              <label>Dietary</label>
              <select
                name="dietary"
                className="form-control"
                value={product.dietary}
                onChange={handleChange}
              >
                <option value="">-select-</option>
                <option value="Veg">Veg</option>
                <option value="Non Veg">Non Veg</option>
                <option value="Gluten Free">Gluten Free</option>
              </select>
            </Col>
            <Col md={12} className='mt-3'>
              <InputField
                label="Description"
                name="description"
                placeholder="Description"
                value={product.description}
                onChange={handleChange}
              />
            </Col>
            <Col><hr />
              <Button variant='secondary' type="button" onClick={handleCancel}>Cancel</Button>
              <Button variant='primary' className="mx-3"  type="submit">Update Product</Button>
            </Col>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProduct;
