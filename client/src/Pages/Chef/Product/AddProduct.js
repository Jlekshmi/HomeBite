import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert } from "react-bootstrap";
import InputField from '../../../Components/InputField/InputField';
import Button from "../../../Components/Button/Button";
import ImageUpload from '../../../Components/ImageUpload/ImageUpload';
import { Link } from 'react-router-dom';
import { Card } from "react-bootstrap";
import "../chef.scss";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    dietary: '', // Default value for dietary field
    image_url: '',
    is_available: '', // Default value for is_available field
  });

  const [message, setMessage] = useState(''); // To display validation messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleImageUpload = (imageData) => {
    setProduct({
      ...product,
      image_url: imageData,
    });
    setMessage(''); // Clear message on valid image upload
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
    if (!product.price || parseFloat(product.price) <= 0) {
      setMessage('Price must be a positive number.');
      return false;
    }

    // Validate Quantity
    if (!product.quantity || parseInt(product.quantity, 10) < 0) {
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
    if (!product.image_url) {
      setMessage('Product image is required.');
      return false;
    }


    setMessage(''); // Clear any previous messages if validation passes
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return; // Stop submission if validation fails
    }

    console.log("Product:", product);

    await fetch('https://homebite-app-c680d0ee15d5.herokuapp.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
            mutation {
              addProduct(chef_id: "${localStorage.getItem("user_id")}", input: {
                name: "${product.name}",
                description: "${product.description}",
                price: ${product.price},
                quantity: ${product.quantity},
                dietary: "${product.dietary}",
                image_url: "${product.image_url}",
                is_available: "${product.is_available}"
              }) {
                id
              }
            }
          `,
      }),
    });
    setMessage('Product added successfully!');
    navigate('/chef/products');
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
          </span><span>Add Menu</span>
        </Col>
      </Row>
      <Row className=' mt-5'>
        <Col md={3} className='mb-3'>
          <Card>
            <Card className="product-card" key={product.id}>
              <Card.Title><h6>Upload Image</h6></Card.Title>
              <Card.Body className="pb-0">
                <ImageUpload label="Product Image" onImageUpload={handleImageUpload} />
              </Card.Body>
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
                type="text"
                placeholder="Enter product name"
                value={product.name}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <InputField
                label="Price $"
                name="price"
                type="number"
                placeholder="Enter price"
                value={product.price}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <InputField
                label="Quantity"
                name="quantity"
                type="number"
                placeholder="Enter quantity"
                value={product.quantity}
                onChange={handleChange}
              />
            </Col>
            <Col md={4}>
              <label className='mb-2'>Availability</label>
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
              <label className='mb-2'>Dietary</label>
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
                type="text"
                placeholder="Enter product description"
                value={product.description}
                onChange={handleChange}
              />
            </Col>
            <Col md={12}>
              <hr />
              <Button variant='secondary' type="button" onClick={handleCancel}>Cancel</Button>
              <Button variant='primary' type="submit" className="mx-3" >Save</Button></Col>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProduct;
