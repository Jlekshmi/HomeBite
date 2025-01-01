import React from 'react';
import { Form } from 'react-bootstrap';
import './InputField.scss';

const InputField = ({ id, label, type, name, value, onChange, placeholder, readOnly, required, options = [],multiple = false, disabled = false }) => {
  return (
    <Form.Group className="input-field mb-3">
      <Form.Label htmlFor={id}>{label}</Form.Label>
      {type === 'select' ? (
        
        <Form.Control
          as="select"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          multiple={multiple}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Control>
      ) : (
        <Form.Control
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
        />
      )}
    </Form.Group>
  );
};

export default InputField;
