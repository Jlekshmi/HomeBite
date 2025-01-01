import React from 'react';
import { Form } from 'react-bootstrap';
import './RadioButton.scss';

const RadioButton = ({ label, name, id, value, checked, onChange }) => {
  return (
    <Form.Check
      inline
      type="radio"
      label={label}
      name={name}
      id={id}
      value={value}
      checked={checked}
      onChange={onChange}
    />
  );
};

export default RadioButton;
