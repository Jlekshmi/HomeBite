import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import Logo from "../../assets/images/logo.svg";
import { useEffect, useState } from "react";
import { Container, Nav, Navbar, Badge } from "react-bootstrap";
import "./Header.scss";

export default function Header({
  cart = {},
  roles = {},
  currentRole,
  onRoleSelect,
  showCartSummary,
}) {
  const totalItems = cart
    ? Object.values(cart).reduce((sum, qty) => sum + qty, 0)
    : 0;

  const navigate = useNavigate();
  const location = useLocation(); // Get the current URL path
  const urole = localStorage.getItem("urole");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    setIsLoggedIn(!!userId);
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem("user_id");
      localStorage.removeItem("urole"); // Clear the urole value
      localStorage.removeItem("cart");
      setIsLoggedIn(false);
      navigate("/Login");
    } else {
      navigate("/Login");
    }
  };
  const handleOrderDetailsClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault(); // Prevent default navigation
      navigate("/Login"); // Redirect to login page
    }
  };

  // Function to check if the current path matches
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary site-header">
        <Container fluid>
          {/* Logo */}
          <img src={Logo} className="logo" alt="Logo" />

          {/* Burger Menu */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#basic-navbar-nav"
            aria-controls="basic-navbar-nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Links */}
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="gap-2 justify-content-between align-self-end">
              {/* Home */}
              <Nav.Link
                href="/"
                className={` ${isActive("/") ? "active" : ""}`}
              >
                Home
              </Nav.Link>

              {/* Conditional Dashboard Links */}
              {urole && (
                <>
                  {/* {urole === "customer" && (
                    <Nav.Link
                      href="/customer/dashboard"
                      className={` ${
                        isActive("/customer/dashboard") ? "active" : ""
                      }`}
                      onClick={() => onRoleSelect("customer")}
                    >
                      Customer
                    </Nav.Link>
                  )} */}
                  {urole.includes("chef") && (
                    <Nav.Link
                      href="/chef/orders"
                      className={` ${
                        isActive("/chef/orders") && location.pathname !== "/"
                          ? "active"
                          : ""
                      }`} // Chef Dashboard active only when not on Home
                      onClick={() => onRoleSelect("chef")}
                    >Chef Dashboard<div className="position-relative header-icon d-none d-lg-inline-block">
                    <span className="material-icons align-middle ">room_service</span>
                   
                  </div>
                      
                    </Nav.Link>
                  )}
                  {urole.includes("rider") && (
                    <Nav.Link
                      href="/rider/orders"
                      className={` ${
                        isActive("/rider/orders") && location.pathname !== "/" ? "active" : ""
                      }`}
                      onClick={() => onRoleSelect("rider")}
                    >Rider Dashboard<div className="position-relative header-icon d-none d-lg-inline-block">
                      <span className="material-icons align-middle ">two_wheeler</span>
                      </div>
                    </Nav.Link>
                  )}
                </>
              )}

              {/* Cart */}
              <Nav.Link onClick={showCartSummary} 
              >
                <div className="position-relative header-icon d-none d-lg-inline-block">
                Cart<span className="material-icons align-middle ">shopping_cart</span>
                  {totalItems > 0 && (
                    <Badge bg="danger" pill className="position-absolute">
                      {totalItems}
                    </Badge>
                  )}
                </div>
                 <span className="d-inline-block d-lg-none">Cart ({totalItems})</span>
              </Nav.Link>
              {/* Order */}
              <Nav.Link
              href={isLoggedIn ? "/Customer/OrderDetails" : "#"}
              onClick={(e) => handleOrderDetailsClick(e)}
                className={` ${isActive("/Customer/OrderDetails") ? "active" : ""}`}
              >
                Order Details
              </Nav.Link>
              {/* Login/Logout */}
              <Nav.Link onClick={handleLoginLogout} className="">
                {isLoggedIn ? "Logout" : "Login"}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
