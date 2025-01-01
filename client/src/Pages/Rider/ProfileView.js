import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from "react-bootstrap";
import Button from "../../Components/Button/Button";
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ProfileView = () => {
  const [userInfo, setUserInfo] = useState({});
  const [RiderInfo, setRiderInfo] = useState({});
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const location = useLocation();
  const successMessage = location.state?.successMessage;
  const navigate = useNavigate();

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`https://homebite-app-c680d0ee15d5.herokuapp.com/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query {
            getUserProfileRider {
              user {
                first_name last_name email mobile_number gender
                address_line_1 address_line_2 city province postal_code
                country nearby_landmark role profile_image
              }
              rider {
                vehicle_type vehicle_registration_number vehicle_insurance_number
                insurance_expiry_date driver_license_number license_expiry_date
                preferred_delivery_radius preferred_working_days preferred_start_time
                preferred_end_time long_distance_preference
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();
    const { user, rider } = data.data.getUserProfileRider;

    setUserInfo(user || {});
    setProfileImageUrl(user?.profile_image);
    // Convert timestamps to readable dates
    if (rider) {
      rider.insurance_expiry_date = convertToReadableDate(rider.insurance_expiry_date);
      rider.license_expiry_date = convertToReadableDate(rider.license_expiry_date);
    }
    setRiderInfo(rider || {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper function to convert timestamp to readable date
  const convertToReadableDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(parseInt(timestamp, 10));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Container fluid className="orders-page mt-3 bt-1">
        <Row>
          {successMessage && (
            <Col md={12}>
              <Alert variant="success" className="my-3">
                {successMessage}
              </Alert>
            </Col>
          )}
        </Row>
        <Row>
          <Col>
            <Link className="btn-link mb-3" to="/rider/orders">Dashboard</Link><span className="material-icons">
              arrow_forward
            </span><span>Profile Details</span>
          </Col>
        </Row>
        <div className='row mt-5'>
          <div className='col-12 col-md-6 align-content-center'>
            <h5>Profile Details</h5>
          </div>
          <div className='col-12 col-md-6 text-start text-md-end '>
            <Button variant='secondary' className='small' onClick={() => navigate('/rider/profile/edit')} >Edit</Button>
          </div>
          <div className='col-12 pt-3'>
            <hr className="mt-0" />
          </div>
        </div>
      </Container>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12'>
            <div className='card'>
              <div className='card-body pt-0 pb-0'>
                <div className='row'>
                  <div className='col-md-4 text-center bg-light p-5'>
                    {profileImageUrl && (
                      <img src={profileImageUrl} alt="Profile" className="img-fluid profile-img" style={{ maxWidth: "150px" }} />
                    )}
                    <h5 className="mb-1 mt-3">{userInfo.first_name} {userInfo.last_name}</h5>
                  </div>
                  <div className="col-md-8 mt-md-4 pb-3">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-0 text-muted"><span className="material-icons me-2">email</span>{userInfo.email}</p>
                        <p className="mb-0 text-muted mt-3"><span className="material-icons me-2">call</span>{userInfo.mobile_number}</p>
                        <p className="mb-0 text-muted mt-3"><span className="material-icons me-2">wc</span>{userInfo.gender}</p>
                        <div className="d-flex text-muted mt-3">
                          <span className="material-icons me-2">map</span>
                          <div className="flex-grow-1">
                            <p className="mb-0 text-muted">{userInfo.address_line_1}</p>
                            <p className="mb-0 text-muted">{userInfo.city}</p>
                            <p className="mb-0 text-muted">{userInfo.province}, {userInfo.country} - {userInfo.postal_code}</p>
                            <p className="mb-0 text-muted mt-2">Nearby landmark - {userInfo.nearby_landmark}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 mt-5'>
            <div className='card'>
              <div className='card-body'>
                <h5 className="card-title">Rider Information</h5>
                <hr />
                <div className='row'>
                  {RiderInfo && (
                    <>
                      <div className='col-md-4'>
                        <p><small>Vehicle Type</small><br /> {RiderInfo.vehicle_type}</p>
                      </div>
                      <div className='col-md-4'>
                        <p><small>Vehicle Registration Number</small><br /> {RiderInfo.vehicle_registration_number}</p>
                      </div>
                      <div className='col-md-4'>
                        <p><small>Vehicle Insurance Number</small><br /> {RiderInfo.vehicle_insurance_number}</p>
                      </div>
                      <div className='col-md-4'>
                        <p><small>Insurance Expiry Date</small><br /> {RiderInfo.insurance_expiry_date}</p>
                      </div>
                      <div className='col-md-4'>
                        <p><small>Driver License Number</small><br /> {RiderInfo.driver_license_number}</p>
                      </div>
                      <div className='col-md-4'>
                        <p><small>License Expiry Date</small><br /> {RiderInfo.license_expiry_date}</p>
                      </div>
                      <div className='col-md-4'>
                        <p><small>Preferred Delivery Radius</small><br /> {RiderInfo.preferred_delivery_radius}</p>
                      </div>
                      <div className='col-md-4'>
                        <p><small>Preferred Working Days</small><br /> {RiderInfo.preferred_working_days?.join(', ')}</p>
                      </div>
                      <div className='col-md-4'>
                        <p><small>Preferred Start Time</small><br /> {RiderInfo.preferred_start_time}</p>
                      </div>
                      <div className='col-md-4'>
                        <p><small>Preferred End Time</small><br /> {RiderInfo.preferred_end_time}</p>
                      </div>
                      <div className='col-md-4'>
                        <p><small>Long Distance Preference</small><br /> {RiderInfo.long_distance_preference}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default ProfileView;
