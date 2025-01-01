import React from 'react';
import { Form } from 'react-bootstrap';
import './Checkbox.scss';

const Checkbox = ({ label, name, value, checked, onChange }) => {
  return (
    
    <Form.Check
      type="checkbox"
      label={label}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="me-3"
    />
  );
};

export default Checkbox;