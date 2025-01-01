// CampusDropdown.js
import React from "react";
import { Form } from 'react-bootstrap';
import '../InputField/InputField';
import { campuses } from "../../Components/data/Campuses";

const CampusDropdown = ({ registerData, setRegisterData }) => {
  const handleCampusChange = (e) => {
    const selectedCampus = campuses.find(
      (campus) => campus.address === e.target.value
    );
    if (selectedCampus) {
      setRegisterData((prevData) => ({
        ...prevData,
        address: selectedCampus.address,
        addressLine1:selectedCampus.addressLine1,
        city: selectedCampus.city,
        postalCode: selectedCampus.postalCode,
        province: selectedCampus.province,
        country: selectedCampus.country,
      }));
    }
  };

  return (
    <Form.Group className="input-field mb-3">
      <Form.Label htmlFor="Select your Conestoga campus">Conestoga Campus Name</Form.Label>
      <Form.Control
        as="select"
        name="address"
        value={registerData.address}
        onChange={handleCampusChange}
        className="form-control"
      >
        <option value="">Select your Conestoga campus</option>
        {campuses.map((campus) => (
          <option key={campus.address} value={campus.address}>
            {campus.address}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default CampusDropdown;
