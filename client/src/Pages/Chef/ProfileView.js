import React, { useState, useEffect } from 'react';
import { Container, Row, Col,Alert } from "react-bootstrap";
import Button from "../../Components/Button/Button";
import { Link,useLocation } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

const ProfileView = () => {
  const [userInfo, setUserInfo] = useState({});
  const [chefInfo, setChefInfo] = useState({});
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
            getUserProfile {
              user {
                first_name last_name email mobile_number gender
                address_line_1 address_line_2 city province postal_code
                country nearby_landmark role profile_image
              }
              chef {
                specialty_cuisines type_of_meals cooking_experience
                max_orders_per_day preferred_working_days
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();
    const { user, chef } = data.data.getUserProfile;

    setUserInfo(user || {});
    setProfileImageUrl(user?.profile_image);
    setChefInfo(chef || {});
  };

  useEffect(() => {
    fetchData();
  }, []);

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
            <Link className="btn-link  mb-3" to="/chef/orders">Dashboard</Link><span className="material-icons">
              arrow_forward
            </span><span>Profile Details</span>
          </Col>
        </Row>
        <div className='row mt-5'>
          <div className='col-12 col-md-6 align-content-center'>
            <h5>Profile Details</h5>
          </div>
          <div className='col-12 col-md-6 text-start text-md-end '>
            <Button variant='secondary' className='small' onClick={() => navigate('/chef/profile/edit')} >Edit</Button>
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
              <div className='card-body'>
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
                        <div className="clearfix"></div>
                        <p className="mb-0 text-muted"><span className="material-icons me-2">email</span>{userInfo.email}</p>
                        <div className="clearfix"></div>
                        <p className="mb-0 text-muted mt-3"><span className="material-icons me-2">call</span>{userInfo.mobile_number}</p>
                        <div className="clearfix"></div>
                        <p className="mb-0 text-muted mt-3"><span className="material-icons me-2">wc</span>{userInfo.gender}</p>
                        <div className="clearfix"></div>
                        <div className="d-flex text-muted  mt-3">
                          <span className="material-icons me-2">map</span>
                          <div className="flex-grow-1">
                            <p className="mb-0 text-muted">{userInfo.address_line_1}</p>
                            <p className="mb-0 text-muted">{userInfo.address_line_2}</p>
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
                <h5 class="card-title">Chef Information</h5>
                <hr />
                <div className='row'>


                  {chefInfo && (
                    <>
                      <div className='col-md-4'>
                        <p><small>Specialty Cuisines</small><br /> {chefInfo.specialty_cuisines?.join(', ')}</p>
                      </div><div className='col-md-4'>
                        <p><small>Type of Meals</small><br /> {chefInfo.type_of_meals?.join(', ')}</p>
                      </div><div className='col-md-4'>
                        <p><small>Cooking Experience</small><br /> {chefInfo.cooking_experience}</p>
                      </div><div className='col-md-4'>
                        <p><small>Max Orders Per Day</small><br /> {chefInfo.max_orders_per_day}</p>
                      </div><div className='col-md-4'>
                        <p><small>Preferred Working Days</small><br /> {chefInfo.preferred_working_days?.join(', ')}</p>
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
