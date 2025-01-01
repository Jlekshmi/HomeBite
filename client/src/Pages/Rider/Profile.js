import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from "react-bootstrap";
import InputField from '../../Components/InputField/InputField';
import ImageUpload from '../../Components/ImageUpload/ImageUpload';
import Button from "../../Components/Button/Button";
import RadioButton from "../../Components/RadioButton/RadioButton";
import AvailabilityOptions from "../../Components/AvailabilityOptions/AvailabilityOptions";
import { UPDATE_USER_PROFILES_RIDER } from "../../queries";
import { useMutation } from "@apollo/client";
import { Link,useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    gender: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    province: '',
    postal_code: '',
    country: '',
    nearby_landmark: '',
    profile_image: '',
    //password_hash: '',
  });

  const [riderInfo, setRiderInfo] = useState({
    vehicle_registration_number: '',
    vehicle_type: '',
    vehicle_insurance_number: '',
    insurance_expiry_date:'',
    driver_license_number: '',
    preferred_working_days: '',
    license_expiry_date:'',
    preferred_delivery_radius:'',
    long_distance_preference:''

  });

  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [message, setMessage] = useState(""); // State to store feedback messages
  const navigate = useNavigate();
  const [updateUserProfileRider] = useMutation(UPDATE_USER_PROFILES_RIDER);

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
                preferred_delivery_radius preferred_working_days 
                 long_distance_preference
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();
    const { user, rider } = data.data.getUserProfileRider;
console.log("UserRider:",data)
    setUserInfo(user || {});
    setProfileImageUrl(user?.profile_image);
    
    setRiderInfo({
      ...rider,
      insurance_expiry_date: rider?.insurance_expiry_date 
        ? new Date(parseInt(rider.insurance_expiry_date)).toISOString().split('T')[0] 
        : '',
      license_expiry_date: rider?.license_expiry_date 
        ? new Date(parseInt(rider.license_expiry_date)).toISOString().split('T')[0] 
        : '',
    });
  //  setRiderInfo(rider || {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validateInputs = () => {
    const errors = [];
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^(?!.*\.\.)(?!.*@.*@)(?!.*\s)(?!.*[,'`])([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.(com|org|net|gov|edu|mil|info|biz|name|us|uk|ca|au|in|de|fr|cn|jp|br|ru|za|mx|nl|es|it|app|blog|shop|online|site|tech|io|ai|co|xyz|photography|travel|museum|jobs|health)$/;
    const phoneRegex = /^[0-9]{10}$/;
    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/;
     // Regular expressions for formats
     const regNumberPattern = /^[A-Z0-9-]{5,10}$/; // Example pattern for a vehicle registration number
     const licensePattern = /^[A-Z0-9-]{5,15}$/;   // Example pattern for a driver's license number
     const insurancePattern = /^[a-zA-Z0-9]{8,}$/; // At least 8 alphanumeric characters for insurance number
     const validateFutureDate = (date) => new Date(date) >= new Date();
    if (!userInfo.first_name || !nameRegex.test(userInfo.first_name)) {
      errors.push("First name is required and must contain only letters.");
    }
    if (!userInfo.last_name || !nameRegex.test(userInfo.last_name)) {
      errors.push("Last name is required and must contain only letters.");
    }
    if (!userInfo.email || !emailRegex.test(userInfo.email)) {
      errors.push("A valid email address is required.");
    }
    if (!userInfo.mobile_number || !phoneRegex.test(userInfo.mobile_number)) {
      errors.push("A valid 10-digit mobile number is required.");
    }
    // if (userInfo.postal_code && !postalCodeRegex.test(userInfo.postal_code)) {
    //   errors.push("Postal code can only contain letters, numbers, and dashes.");
    // }
    if (!riderInfo.vehicle_registration_number) {
      errors.push("Vehicle Reg. Number is required for riders.");
    }
    if (!riderInfo.driver_license_number) {
      errors.push("Driver License Number is required for riders.");
    }
    if (!regNumberPattern.test(riderInfo.vehicle_registration_number)) {
      errors.push("Please enter a valid vehicle registration number.");
     
    }
        // Validate driver’s license number
    if (!licensePattern.test(riderInfo.driver_license_number)) {
      errors.push("Please enter a valid driver's license number.");
      
    }
    if (!insurancePattern.test(riderInfo.vehicle_insurance_number)) {
      errors.push("Vehicle insurance number must be alphanumeric and at least 8 characters long.");
     
    }
    if (riderInfo.insurance_expiry_date && !validateFutureDate(riderInfo.insurance_expiry_date)) {
      errors.push("Insurance expiry date cannot be in the past.");
      
    }
    if (riderInfo.license_expiry_date && !validateFutureDate(riderInfo.license_expiry_date)) {
      errors.push("License expiry date cannot be in the past.");
      
    }
    if (errors.length > 0) {
      setMessage(errors.join(" "));
      return false;
    }
    return true;
  };

  const handleInputChange = (e, stateSetter) => {
    const { name, value, type, checked } = e.target;
    stateSetter((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleProfileImageUpload = (imageUrl) => {
    setProfileImageUrl(imageUrl);
  };



  const handleWorkingDaysChange = (e) => {
    const { value, checked } = e.target;
    setRiderInfo((prev) => {
      const updatedDays = checked
        ? [...prev.preferred_working_days, value]
        : prev.preferred_working_days.filter((day) => day !== value);
      return { ...prev, preferred_working_days: updatedDays };
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }
    const formattedRiderData = {
      ...riderInfo,
      insurance_expiry_date: riderInfo.insurance_expiry_date
        ? new Date(riderInfo.insurance_expiry_date).toISOString()
        : null,
      license_expiry_date: riderInfo.license_expiry_date
        ? new Date(riderInfo.license_expiry_date).toISOString()
        : null,
    };
    

    try {
      const result = await updateUserProfileRider({
        variables: {
          id: localStorage.getItem("user_id"),
          userInput: {
            ...userInfo,
            profile_image: profileImageUrl,
            //password_hash: userInfo.password_hash|| "",
            //role: userInfo.role ? userInfo.role[0] : undefined,
          },
          riderInput: formattedRiderData,
        },
      });
      navigate("/rider/profile", { state: { successMessage: "Profile updated successfully!" } });
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile. Please try again.");
    }
  };
  const handleChange = (e) => {
    //const { name, value } = e.target;
    const { name, value, multiple, options } = e.target;
    if (multiple) {
      // For multi-selects, collect all selected options
      const selectedOptions = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);

      setRiderInfo((prevData) => ({
        ...prevData,
        [name]: selectedOptions, // Set the array of selected values
      }));
    } else {
      setRiderInfo((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    setMessage("");
  };
  const handleCancel = () => {
    navigate("/rider/profile"); // Redirect to ProfileView.js
  };

  return (
    <>
      <Container fluid className="orders-page mt-3 bt-1">
        <Row>
          <Col>
            <Link className="btn-link  mb-3" to="/rider/orders">Dashboard</Link><span className="material-icons">
              arrow_forward
            </span>
            <Link className="btn-link  mb-3" to="/rider/profile">Profile Details</Link><span className="material-icons">
              arrow_forward
            </span><span>Edit Details</span>
          </Col>
        </Row>
        <div className='row mt-5'>
          <div className='col-12 align-content-center'>
            <h5>Edit Details</h5>
          </div>
          <div className='col-12 pt-3'>
            <hr className="mt-0" />
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            {message && (
              // <Alert variant={message.includes("Error") ? "danger" : "success"}>
              <Alert variant="danger" >
                {message}
              </Alert>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <Row>
            <Col md={12} className='mb-3'>
              <ImageUpload label="Profile Image" currentImageUrl={profileImageUrl} onImageUpload={handleProfileImageUpload} />
            </Col>
            <Col md={6}>
              <InputField label="First Name" name="first_name" value={userInfo.first_name || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            </Col>
            <Col md={6}>
              <InputField label="Last Name" name="last_name" value={userInfo.last_name || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            </Col>
            <Col md={6}>
              <InputField label="Email" name="email" value={userInfo.email || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            </Col>
            <Col md={6}>
              <InputField label="Mobile Number" name="mobile_number" value={userInfo.mobile_number || ''} onChange={(e) => handleInputChange(e, setUserInfo)} />
            </Col>
            <Col md={6}>
              <h5 className="form-sub-title">Select your Gender</h5>
              <div className="gender-options mb-3">
                <RadioButton label="Male" name="gender" value="Male" checked={userInfo.gender === "Male"} onChange={(e) => handleInputChange(e, setUserInfo)} />
                <RadioButton label="Female" name="gender" value="Female" checked={userInfo.gender === "Female"} onChange={(e) => handleInputChange(e, setUserInfo)} />
                <RadioButton label="Other" name="gender" value="Other" checked={userInfo.gender === "Other"} onChange={(e) => handleInputChange(e, setUserInfo)} />
              </div>
            </Col>
            <Col md={6}>
             
              {/* <InputField
  label="New Password"
  name="password_hash"
  type="password"
  placeholder="Enter new password"
  value={userInfo.password_hash || ''}
  onChange={(e) => handleInputChange(e, setUserInfo)}
/> */}
            </Col>
            <Col md={12}><hr /></Col>
          </Row>

          <div className='row mt-3'>
            <div className='col-12'>
              <h4>Rider Information</h4>
            </div>

            
            <Col md={12}>
                      <h5 className="mt-3 mb-3"><b>Vehicle Information</b></h5>
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Vehicle Type"
                        name="vehicle_type"
                        type="select" // Assuming InputField can handle a select type
                        value={riderInfo.vehicle_type}
                        onChange={handleChange}
                        options={[
                          { value: "", label: "Select Vehicle Type" },
                          { value: "Bike", label: "Bike" },
                          { value: "Scooter", label: "Scooter" },
                          { value: "Motorcycle", label: "Motorcycle" },
                          { value: "Car", label: "Car" },
                          { value: "Other", label: "Other" },
                        ]}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Vehicle Registration Number"
                        name="vehicle_registration_number"
                        value={riderInfo.vehicle_registration_number}
                        placeholder="Vehicle Registration Number"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Vehicle Insurance Number"
                        name="vehicle_insurance_number"
                        value={riderInfo.vehicle_insurance_number}
                        placeholder="Vehicle Insurance Number"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Insurance Expiry Date"
                        type="date"
                        value={riderInfo.insurance_expiry_date}
                        name="insurance_expiry_date"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Driver's License Number"
                        name="driver_license_number"
                        value={riderInfo.driver_license_number}
                        placeholder="Driver's License Number"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="License Expiry Date"
                        type="date"
                        value={riderInfo.license_expiry_date}
                        name="license_expiry_date"
                        onChange={handleChange}
                      />
                    </Col>
            <Col md={12}>
              <AvailabilityOptions selectedDays={riderInfo.preferred_working_days} onDayChange={handleWorkingDaysChange} />
            </Col>
            <Col md={12} className="mb-3">
            <hr />
            <Button variant='secondary' type="button" onClick={handleCancel}>Cancel</Button>
            <Button variant='primary' className="mx-3" type="submit">Save Changes</Button>
          </Col>
          </div>
        </form>
      </Container>
    </>
  );
};

export default Profile;
