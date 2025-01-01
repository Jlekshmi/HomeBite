import React, { useState, useEffect } from "react";
import Header from "../Header/Header";

export default function MainLayout({ cart, handleShowCart }) {
  const [roles, setRoles] = useState({ customer: false, chef: false, rider: false });

  useEffect(() => {
    // Fetch the roles from localStorage or API
    const userRoles = JSON.parse(localStorage.getItem("roles")) || {};
    setRoles(userRoles);
  }, []);

  const handleRoleSelect = (role) => {
    console.log(`Navigating to ${role} dashboard`);

  };

  return (
    <div className="mainLayout">
      <Header
        cart={cart}
        showCartSummary={handleShowCart}
        roles={roles}
        currentRole="chef" // Pass the current role dynamically if needed
        onRoleSelect={handleRoleSelect}
      />
      {/* Main content goes here */}
    </div>
  );
}
