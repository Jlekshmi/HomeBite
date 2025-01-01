import React from "react";
import { Card } from "react-bootstrap";
import "./ChefCard.scss";
import { useNavigate } from 'react-router-dom';
import defaultChefImage from "../../assets/images/chef.jpg";

export default function ChefCard({ chef }) {
  const navigate = useNavigate();
  // Check for null or undefined `chef` or `chef.user`
  if (!chef || !chef.user) {
    console.error("Chef data or user data is null or undefined:", chef);
    return (
      <Card className="chef-card mb-3">
        <Card.Img
          variant="top"
          src={defaultChefImage} // Show fallback image
          alt="Default Chef"
        />
        <Card.Body className="pb-0">
          <Card.Title>Chef</Card.Title>
          <Card.Text>Indian</Card.Text>
          <Card.Text>
            <span className="material-icons mr-2">location_on</span>Doon Campus
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="chef-card mb-3">
      {/* <Card.Img
        variant="top"
        src={chef.user.profile_image || defaultChefImage} // Fallback image
        alt={`${chef.user.first_name || "New"} ${chef.user.last_name || "Chef"}`}
      /> */}
      <Card.Img
        variant="top"
        src={chef.user.profile_image || defaultChefImage} // Use profile image or fallback
        alt={`${chef?.user?.first_name || "New"} ${chef?.user?.last_name || "Chef"}`}
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop
          e.target.src = defaultChefImage; // Set fallback image
        }}
      />
      <Card.Body className="pb-0">
        <Card.Title onClick={() => navigate(`/Customer/ChefDetails/${chef.id}`)}>
          {chef.user.first_name || "New"} {chef.user.last_name || "Chef"}
        </Card.Title>
        <Card.Text>
          {chef.specialty_cuisines && chef.specialty_cuisines.length > 0
            ? chef.specialty_cuisines.join(", ")
            : "No specialties available"}
        </Card.Text>
        <Card.Text>
          <span className="material-icons">location_on</span>
          {chef.user.address_line_1 || "Address"}
        </Card.Text>
       
      </Card.Body>
    </Card>
  );
}
