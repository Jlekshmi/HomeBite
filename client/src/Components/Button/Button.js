import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';
import './Button.scss';

const Button = ({ type = 'button', className = '', variant = 'primary', onClick, children }) => {
  // Dynamically construct class names
  const classes = [`btn-${variant}`, className].join(' ').trim();

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
