import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from '../../Components/Header/Header';
import "./rider.scss";

const Dashboard = () => {
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState(() => { 
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : {};
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "{}");
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleShowCart = () => setShowCart(true);
  const handleCloseCart = () => setShowCart(false);

  return (
    <>
      <Container fluid className="p-0">
        <Header />
      </Container>
      <Container fluid>
        <div className="row">
          <div className="col-12 col-lg-2 sidebar">
            <nav className="mt-3">
              <ul>
                <li>
                  <NavLink
                    to="orders"
                    className={({ isActive }) =>
                      isActive ? "btn-link active" : "btn-link"
                    }
                  >
                    <span className="material-icons">home</span>Dashboard
                  </NavLink>
                </li>
                
                <li>
                  <NavLink
                    to="profile"
                    className={({ isActive }) =>
                      isActive ? "btn-link active" : "btn-link"
                    }
                  >
                    <span className="material-icons">person</span>Profile Details
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
          <div className="col-12 col-lg-10 chef-page">
            <Outlet /> {/* This will render the selected page */}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Dashboard;
