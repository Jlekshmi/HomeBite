import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import "./Register.scss";
import loginbg from "../../assets/images/login-bg.jpg";
import Logo from "../../assets/images/logo.svg";
import InputField from "../../Components/InputField/InputField";
import CampusDropdown from "../../Components/CampusDropdown/CampusDropdown";
import Checkbox from "../../Components/Checkbox/Checkbox";
import RadioButton from "../../Components/RadioButton/RadioButton";
import Button from "../../Components/Button/Button";
import RoleOptions from "../../Components/RoleOptions/RoleOptions";
import SpecialtyCuisinesOptions from "../../Components/SpecialtyCuisinesOptions/SpecialtyCuisinesOptions";
import TypeOfMealsOptions from "../../Components/TypeOfMealsOptions/TypeOfMealsOptions";
import AvailabilityOptions from "../../Components/AvailabilityOptions/AvailabilityOptions";
import CarouselComponent from "../../Components/CarouselComponent/CarouselComponent";
import { Form, Container, Row, Col, Alert } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { CREATE_USER, CREATE_RIDER, CREATE_CHEF } from "../../queries";
import { CREATE_PAYMENT_INFO } from "../../queries";


const client = new ApolloClient({
  uri: 'https://homebite-app-c680d0ee15d5.herokuapp.com/graphql',
  cache: new InMemoryCache(),
});

const Register = () => {
  const [step, setStep] = useState(1);
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    address: "",
    address2: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
    gender: "Other",
    roles: [],
    nearby_landmark: "",
    // Rider-specific fields
    vehicleType: "",
    vehicleRegNumber: "",
    vehicleInsuranceNumber: "",
    insuranceExpiryDate: "",
    driverLicenseNumber: "",
    licenseExpiryDate: "",
    //document_upload_path: "",
    preferredDeliveryRadius: "",
    preferredWorkingDays: [],
    preferredStartTime: "",
    preferredEndTime: "",
    longDistancePreference: false,
    // Chef-specific fields
    specialtyCuisines: [],
    typeOfMeals: [],
    cookingExperience: "",
    maxOrdersPerDay: "",
    profilePicture: null,
    preferredStartTimeChef: "",
    preferredEndTimeChef: "",
    // Payment information
    bankAccountNumber: "",
    transitNumber: "",
  });


  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [createUser] = useMutation(CREATE_USER);
  const [createRider] = useMutation(CREATE_RIDER);
  const [createChef] = useMutation(CREATE_CHEF);
  const [createPaymentInfo] = useMutation(CREATE_PAYMENT_INFO);

  const handleChange = (e) => {
    //const { name, value } = e.target;
    const { name, value, multiple, options } = e.target;
    if (multiple) {
      // For multi-selects, collect all selected options
      const selectedOptions = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);

      setRegisterData((prevData) => ({
        ...prevData,
        [name]: selectedOptions, // Set the array of selected values
      }));
    } else {
      setRegisterData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    setMessage("");
  };

  const handleCheckboxChange = (e, fieldName) => {
    const { value, checked } = e.target;
    setRegisterData((prevData) => {
      const updatedArray = checked
        ? [...prevData[fieldName], value]
        : prevData[fieldName].filter((item) => item !== value);
      return { ...prevData, [fieldName]: updatedArray };
    });
  };
  const handleWorkingDaysChange = (e) => {
    const { value, checked } = e.target;
    setRegisterData((prevData) => {
      const updatedDays = checked
        ? [...prevData.preferredWorkingDays, value]
        : prevData.preferredWorkingDays.filter((day) => day !== value);
      return { ...prevData, preferredWorkingDays: updatedDays };
    });
  };
  // const workingDaysOptions = [
  //   { label: "Monday", value: "Monday" },
  //   { label: "Tuesday", value: "Tuesday" },
  //   { label: "Wednesday", value: "Wednesday" },
  //   { label: "Thursday", value: "Thursday" },
  //   { label: "Friday", value: "Friday" },
  //   { label: "Saturday", value: "Saturday" },
  //   { label: "Sunday", value: "Sunday" },
  // ];
  // Validation helper functions
  const validateEmail = (email) => /^(?!.*\.\.)(?!.*@.*@)(?!.*\s)(?!.*[,'`])([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.(com|org|net|gov|edu|mil|info|biz|name|us|uk|ca|au|in|de|fr|cn|jp|br|ru|za|mx|nl|es|it|app|blog|shop|online|site|tech|io|ai|co|xyz|photography|travel|museum|jobs|health)$/.test(email);
  const validatePhoneNumber = (mobile) => /^[0-9]{10}$/.test(mobile.trim());
  const validatePostalCode = (postalCode) =>
    /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(postalCode); // Canadian format
  const validateFutureDate = (date) => new Date(date) >= new Date();

  const validatePasswordStrength = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password); // At least 8 chars, 1 letter, 1 number

  const validateName = (name) => /^[a-zA-Z\s]+$/.test(name);

  const validateStep1 = async () => {
    const {
      firstName,
      lastName,
      gender,
      email,
      mobile,
      password,
      confirmPassword,
      roles,
    } = registerData;

    let isValid = true;

    if (
      !firstName ||
      !lastName ||
      !gender ||
      !email ||
      !mobile ||
      !password ||
      !confirmPassword
    ) {
      setMessage("Please fill in all fields.");
      isValid = false;
    } else if (!validateName(firstName)) {
      setMessage("First name must only contain letters and spaces.");
      isValid = false;
    } else if (!validateName(lastName)) {
      setMessage("Last name must only contain letters and spaces.");
      isValid = false;
    } else if (!validateEmail(email)) {
      setMessage("Please enter a valid email.");
      isValid = false;
    } else if (!validatePhoneNumber(mobile)) {
      setMessage("Please enter a valid 10-digit mobile number.");
      isValid = false;
    } else if (!validatePasswordStrength(password)) {
      setMessage(
        "Password must be at least 8 characters long and include at least one number."
      );
      isValid = false;
    } else if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      isValid = false;
    } else if (!registerData.roles || registerData.roles.length === 0) {
      setMessage("Please select at least one role.");
      isValid = false;
    } else {
      // Check if email is unique
      const isUniqueEmail = await checkDuplicateEmail(registerData.email);
      if (!isUniqueEmail) return false; // Stop if email already exists
    }
    return isValid;

  };

  const checkDuplicateEmail = async (email) => {
    try {
      const { data } = await client.query({
        query: gql`
          query IsEmailUnique($email: String!) {
            isEmailUnique(email: $email)
          }
        `,
        variables: { email },
      });

      if (!data.isEmailUnique) {
        setMessage("An account with this email already exists.");
        return false; // Email is not unique
      } else {
        setMessage("");
        return true; // Email is unique
      }
    } catch (error) {
      console.error("Error checking for duplicate email:", error);
      setMessage("An error occurred. Please try again.");
      return false;
    }
  };

  const validateStep2 = () => {
    const { address, address2, city, province, postalCode, country } =
      registerData;
    let isValid = true;

    // Validate each field and set message accordingly if missing
    if (!address.trim()) {
      setMessage("Campus Name is required.");
      isValid = false;
    } else if (!address2.trim()) {
      setMessage("Building Name is required.");
      isValid = false;
    } else if (!city.trim()) {
      setMessage("City is required.");
      isValid = false;
    } else if (!province.trim()) {
      setMessage("Province is required.");
      isValid = false;
    } else if (!country.trim()) {
      setMessage("Country is required.");
      isValid = false;
    } else if (!postalCode.trim()) {
      setMessage("Postal code is required.");
      isValid = false;
    } else if (!/^([a-zA-Z]\d[a-zA-z]( )?\d[a-zA-Z]\d)$/.test(postalCode)) {
      // Adjust regex as needed for postal code format
      setMessage("Please enter a valid postal code.");
      isValid = false;
    } else {
      setMessage(""); // Clear message if all validations pass
    }

    return isValid;
  };
  const validateRider = () => {
    const {
      vehicleType,
      vehicleRegNumber,
      vehicleInsuranceNumber,
      driverLicenseNumber,
      preferredDeliveryRadius,
      preferredWorkingDays,
      preferredStartTime,
      preferredEndTime,
      insuranceExpiryDate,
      licenseExpiryDate,
    } = registerData;

    // Regular expressions for formats
    const regNumberPattern = /^[A-Z0-9-]{5,10}$/; // Example pattern for a vehicle registration number
    const licensePattern = /^[A-Z0-9-]{5,15}$/;   // Example pattern for a driver's license number
    const insurancePattern = /^[a-zA-Z0-9]{8,}$/; // At least 8 alphanumeric characters for insurance number

    // Check for required fields
    if (
      !vehicleType ||
      !vehicleRegNumber ||
      !vehicleInsuranceNumber ||
      !driverLicenseNumber ||
      !preferredDeliveryRadius ||
      !Array.isArray(preferredWorkingDays) || preferredWorkingDays.length === 0 ||
      !preferredStartTime ||
      !preferredEndTime
    ) {
      setMessage("Please fill in all required fields for Rider.");
      return false;
    }
    setMessage(""); // Reset message if this check passes

    // Validate vehicle registration number
    if (!regNumberPattern.test(vehicleRegNumber)) {
      setMessage("Please enter a valid vehicle registration number.");
      return false;
    }
    setMessage(""); // Reset message if this check passes

    // Validate driver’s license number
    if (!licensePattern.test(driverLicenseNumber)) {
      setMessage("Please enter a valid driver's license number.");
      return false;
    }
    setMessage(""); // Reset message if this check passes

    // Validate vehicle insurance number
    if (!insurancePattern.test(vehicleInsuranceNumber)) {
      setMessage("Vehicle insurance number must be alphanumeric and at least 8 characters long.");
      return false;
    }
    setMessage(""); // Reset message if this check passes

    // Validate future dates for insurance and license expiry
    if (insuranceExpiryDate && !validateFutureDate(insuranceExpiryDate)) {
      setMessage("Insurance expiry date cannot be in the past.");
      return false;
    }
    if (licenseExpiryDate && !validateFutureDate(licenseExpiryDate)) {
      setMessage("License expiry date cannot be in the past.");
      return false;
    }

    // All validations passed
    return true;
  };

  const validateChef = () => {
    const { specialtyCuisines, typeOfMeals, cookingExperience, preferredWorkingDays, maxOrdersPerDay } = registerData;

    const validExperienceOptions = ["Less than 1 year", "1-3 years", "3-5 years", "5+ years"];

    if (!specialtyCuisines.length || !typeOfMeals.length || !cookingExperience || !validExperienceOptions.includes(cookingExperience) || !preferredWorkingDays.length || !maxOrdersPerDay) {
      setMessage("Please ensure all chef details are filled in and valid.");
      return false;
    }
    // if (isNaN(maxOrdersPerDay) || parseInt(maxOrdersPerDay, 10) <= 0) {
    //   setMessage("Max Orders Per Day must be a valid positive number.");
    //   return false;
    // }
    return true;
  };

  const ValidatePayment = () => {
    const { bankAccountNumber, transitNumber } = registerData;

    // Define regular expressions for format validations
    const bankAccountPattern = /^\d{8,12}$/;  // Bank account: 8-12 digits
    const transitPattern = /^\d{5}$/;          // Transit number: exactly 5 digits

    if (!bankAccountNumber || !transitNumber) {
      setMessage("Please fill in all required fields for Payment.");
      return false;
    }

    // Validate bank account number
    if (!bankAccountPattern.test(bankAccountNumber)) {
      setMessage("Please enter a valid bank account number (8-12 digits).");
      return false;
    }

    // Validate transit number
    if (!transitPattern.test(transitNumber)) {
      setMessage("Please enter a valid 5-digit transit number.");
      return false;
    }

    // Clear the message if all validations pass
    setMessage("");
    return true;
  };

  // const handleRoleChange = (e) => {
  //   const { name, checked } = e.target;
  //   setRegisterData((prevData) => ({
  //     ...prevData,
  //     roles: {
  //       ...prevData.roles,
  //       [name]: checked,
  //     },
  //   }));
  //   setMessage("");
  // };

  // const handleRoleChange = (e) => {
  //   console.log("Roles before validation:", registerData.roles);
  //   const { name, checked } = e.target;
  //   setRegisterData((prevData) => {
  //     const roles = prevData.roles || [];
  //     return {
  //       ...prevData,
  //       roles: checked
  //         ? [...roles, name] // Add role if checked
  //         : roles.filter((role) => role !== name), // Remove role if unchecked
  //     };
  //   });
  //   setMessage("");
  // };
  
  const handleRoleChange = (e) => {
    const { name, checked } = e.target;
  
    setRegisterData((prevData) => {
      const roles = prevData.roles || [];
      const updatedRoles = checked
        ? [...roles, name] // Add role if checked
        : roles.filter((role) => role !== name); // Remove role if unchecked
  
      console.log(`Role change: ${name}, Checked: ${checked}`);
      console.log("Updated roles:", updatedRoles);
  
      return {
        ...prevData,
        roles: updatedRoles,
      };
    });
  
    setMessage("");
  };

  const createUserAccount = async () => {
    const userInput = {
      first_name: registerData.firstName || "",
      last_name: registerData.lastName || "",
      email: registerData.email || "",
      mobile_number: registerData.mobile || "",
      password_hash: registerData.password || "",
      role: registerData.roles || [],
      gender: registerData.gender || "Other", // Set a default gender value if none selected
      profile_image: registerData.profilePicture || "",
      status: "active",
      address_line_1: registerData.address || "",
      address_line_2: registerData.address2 || "",
      city: registerData.city || "",
      province: registerData.province || "",
      postal_code: registerData.postalCode || "",
      country: registerData.country || "",
      nearby_landmark: registerData.addressLine1 || "",
    };
    console.log("User input for mutation:", userInput);
    const { data } = await createUser({ variables: { input: userInput } });
    if (data && data.createUser) {
      console.log("User ID for Rider:", data.createUser.id);
      console.log("User created successfully!!");
      return data.createUser.id;
    } else {
      setMessage("Failed to register user. Please try again.");
    }
    return null;
  };

  const createRiderAccount = async (userId) => {
    try {
      if (!userId) {
        setMessage("User ID is missing. Rider cannot be created.");
        console.error("User ID missing for Rider creation");
        return;
      }
      const riderInput = {
        user_id: userId,
        vehicle_type: registerData.vehicleType || "",
        vehicle_registration_number: registerData.vehicleRegNumber || "",
        vehicle_insurance_number: registerData.vehicleInsuranceNumber || null,
        insurance_expiry_date: registerData.insuranceExpiryDate || null,
        driver_license_number: registerData.driverLicenseNumber || "",
        license_expiry_date: registerData.licenseExpiryDate || null,
        preferred_delivery_radius: registerData.preferredDeliveryRadius || "",
        preferred_working_days: registerData.preferredWorkingDays || [],
        preferred_start_time: registerData.preferredStartTime || null,
        preferred_end_time: registerData.preferredEndTime || null,
        long_distance_preference: registerData.longDistancePreference || false,
      };
      console.log("Rider input for mutation:", riderInput);
      console.log("Rider input for mutation:", JSON.stringify(riderInput, null, 2));
      const { data } = await createRider({ variables: { input: riderInput } });
      if (!data || !data.createRider) {
        setMessage("Failed to register rider. Please try again.");
      } else {
        console.log("Rider input for mutation:", riderInput);
        console.log("Rider created successfully!");
      }
    } catch (error) {
      console.error("Error creating rider:", error);
      setMessage("Failed to register rider.");
    }
  };

  const createChefAccount = async (userId) => {
    if (!userId) {
      setMessage("User ID is missing. Chef account cannot be created.");
      console.error("User ID missing for Chef creation");
      return;
    }

    const chefInput = {
      user_id: userId,
      specialty_cuisines: registerData.specialtyCuisines || [],
      type_of_meals: registerData.typeOfMeals || [],
      cooking_experience: registerData.cookingExperience || "",
      max_orders_per_day: parseInt(registerData.maxOrdersPerDay) || 0,
      preferred_working_days: registerData.preferredWorkingDays || [],
      preferred_start_time: registerData.preferredStartTimeChef || "",
      preferred_end_time: registerData.preferredEndTimeChef || "",
    };

    console.log("Chef input for mutation:", chefInput);
    console.log("chef input...", chefInput);
    const { data } = await createChef({ variables: { input: chefInput } });
    if (!data || !data.createChef) {
      setMessage("Failed to register chef. Please try again.");
    } else {
      console.log("Chef created successfully!");
    }
  };

  // const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     const { customer, chef, rider } = registerData.roles;

  //     if (step === 1) {
  //       if (validateStep1()) {
  //         setStep(customer || chef ? 2 : 3);
  //       }
  //     } else if (step === 2) {
  //       if (validateStep2()) {
  //         if (rider) {
  //           setStep(3);
  //         } else {
  //           setStep(4);
  //          // await handleFormSubmission();
  //         }
  //       }
  //     } else if (step === 3) {
  //       if (validateRider()) {
  //         await handleFormSubmission();
  //       }
  //     }else if (step === 4) {
  //       await handleFormSubmission();
  //     }
  //   };

  const handleSubmit = async (e) => {
    console.log("Step1:", step);
    e.preventDefault();
    //const { customer, chef, rider } = registerData.roles;
  const  roles = registerData.roles;
  const customer = roles.includes("customer");
  const chef = roles.includes("chef");
  const rider = roles.includes("rider");


    if (step === 1) {
      console.log("A1");
      // Step 1 validation (common fields)
      const isValidStep1 = await validateStep1();
      if (isValidStep1) {
        console.log("A2");
        setStep(2); // Proceed to customer form if validation passes
      }
    } else if (step === 2) {
      console.log("A3");
      // Customer-specific validation at step 2
      if (validateStep2()) {
        if (customer && !chef && !rider) {
          console.log("A4 - Customer only");
          await handleFormSubmission(); // Save and navigate for Customer only
        } else if (rider && chef) {
          console.log("Step2:", step);
          console.log("A5 - Customer, Rider, and Chef");
          setStep(3); // Move to Rider form, then Chef form after Rider
        } else if (rider) {
          console.log("Step3:", step);
          console.log("A6 - Customer and Rider only");
          setStep(3); // Move to Rider form if Customer and Rider are selected
        } else if (chef) {
          console.log("Step4:", step);
          console.log("A7 - Customer and Chef only");
          setStep(4); // Move to Chef form if Customer and Chef are selected
        }
      }
    } else if (step === 3 && rider) {
      console.log("Step5:", step);
      console.log("Roles:", registerData.roles);
      console.log("Rider selected:", registerData.roles.includes("rider"));
      console.log("Chef selected:", registerData.roles.includes("chef"));
      console.log("A8 - Rider step");
      // Rider-specific validation at step 3
      if (validateRider()) {
        console.log("Step6:", step);
        if (chef) {
          console.log("A9 - Proceed to Chef after Rider");
          setStep(4); // Move to Chef form after completing Rider form
        } else {
          console.log("A10 - Rider only or Customer + Rider complete");
          await handleFormSubmission(); // Save for Rider only or Customer + Rider
        }
      }
    } else if (step === 4 && chef) {
      console.log("Step7:", step);
      console.log("A11 - Chef step");
      // Chef-specific validation at step 4
      if (validateChef()) {
        console.log("A12 - Complete Chef");
        await handleFormSubmission(); // Save and complete for Chef or all roles
      }
    } else if (customer && chef && rider) {
      console.log("Step8:", step);
      console.log("A13 - All roles selected");
      // All validations at once for Customer, Rider, and Chef
      if (
        await validateStep1() &&
        validateStep2() &&
        validateRider() &&
        validateChef()
      ) {
        console.log("A14 - All validations passed");
        await handleFormSubmission(); // Save and navigate for all roles
      }
    }
  };


  const handleFormSubmission = async () => {
    const  roles = registerData.roles;
    const customer = roles.includes("customer");
    const chef = roles.includes("chef");
    const rider = roles.includes("rider");
    try {
      // Step 1: Create User Account and get `user_id`
      const userId = await createUserAccount();
      console.log("User ID created:", userId);
      if (!userId) {
        throw new Error("User ID creation failed.");
      }
      // Update `user_id` in `registerData` for further use
      setRegisterData((prevData) => ({ ...prevData, user_id: userId }));

      // Step 2: Based on selected roles, create additional accounts
      //const { rider, chef } = registerData.roles;

      if (rider) {
        await createRiderAccount(userId); // Create Rider account if selected
        console.log("Rider account created successfully.");
      }

      if (chef) {
        await createChefAccount(userId); // Create Chef account if selected
        console.log("Chef account created successfully.");
      }

      // Step 3: Validate Payment Information if filled and create Payment Info
      // if (ValidatePayment()) {
      //   await createPaymentInfo({
      //     variables: {
      //       input: {
      //         user_id: userId,
      //         bank_account_number: registerData.bankAccountNumber || "",
      //         transit_number: registerData.transitNumber || "",
      //       },
      //     },
      //   });
      //   console.log("Payment information saved successfully.");
      // }

      // Step 4: Navigate to home or success page
      navigate("/Login", { state: { successMessage: "User registered successfully!" } });
    } catch (error) {
      console.error("Error in form submission:", error);
      setMessage("Failed to register. Please try again.");
    }
  };
  const getCurrentStep = (role) => {
    const roleOrder = ["customer", "rider", "chef"];
    const activeRoles = roleOrder.filter((r) => registerData.roles[r]);
    return activeRoles.indexOf(role) + 2; // Step 1 is general info, roles start from step 2
  };
  
  const selectedRolesCount = Object.values(registerData.roles).filter(
    Boolean
  ).length;

  return (
    <Container fluid>
      <Row>
        <Col lg={7} className="p-0">
          <div className="login-container">
            <div className="login-box">
              <a href="/"><img src={Logo} className="logo mb-5" alt="Logo" /></a>
              {message && <Alert variant="danger">{message}</Alert>}
              {step === 1 && (
                <>
                  <h4 className="mb-2">Get Started</h4>
                  <p className="mb-4">
                    Enjoy the best home-cooked meals delivered to your doorstep.
                  </p>
                  <hr />
                </>
              )}

              <form onSubmit={handleSubmit} className="row p-0 mt-3" noValidate>
                {step === 1 && (
                  <>
                    <Col lg={6}>
                      <InputField
                        label="First Name"
                        name="firstName"
                        placeholder="Enter your First Name"
                        value={registerData.firstName}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col lg={6}>
                      <InputField
                        label="Last Name"
                        name="lastName"
                        placeholder="Enter your Last Name"
                        value={registerData.lastName}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col lg={6}>
                      <InputField
                        label="Create a Password"
                        type="password"
                        name="password"
                        placeholder="Create a strong password"
                        value={registerData.password}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col lg={6}>
                      <InputField
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-enter your password to confirm"
                        value={registerData.confirmPassword}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col lg={12}>
                      <label>Select your Gender</label>
                      <div className="gender-options mb-3 d-grid d-lg-flex">
                        <RadioButton
                          label="Male"
                          name="gender"
                          id="gender-male"
                          value="male"
                          checked={registerData.gender === "male"}
                          onChange={handleChange}
                        />
                        <RadioButton
                          label="Female"
                          name="gender"
                          id="gender-female"
                          value="female"
                          checked={registerData.gender === "female"}
                          onChange={handleChange}
                        />
                        <RadioButton
                          label="Other"
                          name="gender"
                          id="gender-other"
                          value="other"
                          checked={registerData.gender === "other"}
                          onChange={handleChange}
                        />
                      </div>

                    </Col>
                    <Col lg={6}>
                      <InputField
                        label="Your Email Address"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={registerData.email}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col lg={6}>
                      <InputField
                        label="Mobile Number"
                        name="mobile"
                        placeholder="Mobile Number"
                        value={registerData.mobile}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col lg={12}>
                      <RoleOptions
                        roles={registerData.roles}
                        onRoleChange={handleRoleChange}
                      />
                    </Col>
                    <Col lg={12}>
                      <Button type="submit" className="btn-primary w-100 mb-3 mt-3">
                        Proceed
                      </Button>
                    </Col>
                    <Col lg={12}>
                      <p className="text-center d-grid d-lg-flex mb-3 gap-2">
                        Already Have an Account?{" "}
                        <a href="/login" className="btn-link">
                          Sign in here
                        </a>
                      </p>
                    </Col>
                  </>
                )}

                {step === 2 && (
                  <>
                    <Col md={12}>
                    <h4 className="mb-2">Home Campus Details</h4>
                      <hr />
                      <h5>Step 1 of {selectedRolesCount}</h5>
                      <h6>
                        For Customer
                      </h6>
                      <hr />
                    </Col>
                    
                    {/* <InputField
                        label="Address"
                        name="address"
                        placeholder="Start Typing Your Address"
                        value={registerData.address}
                        onChange={handleChange}
                      /> */}

                    {/* Campus Selection */}

                    <Col md={6}>
                      <CampusDropdown
                        registerData={registerData}
                        setRegisterData={setRegisterData}
                      />
                    </Col>

                    
                    <Col md={6}>
                      <InputField
                        label="Building Name/ Block Name"
                        name="address2"
                        placeholder="Enter Building / Block Name to Deliver Food"
                        value={registerData.address2}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField 
                        label="Address Line 1"
                        name="landmark"
                        placeholder="Address Line 1"
                        value={registerData.addressLine1}
                        onChange={handleChange}
                        disabled={true}
                      />
                    </Col>
                    <Col md={3}>
                      <InputField
                        label="City"
                        name="city"
                        value={registerData.city}
                        onChange={handleChange}
                        disabled={true}
                      />
                    </Col>
                    
                    <Col md={3}>
                      <InputField
                        label="Postal Code"
                        name="postalCode"
                        value={registerData.postalCode}
                        onChange={handleChange}
                        disabled={true}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Province"
                        name="province"
                        value={registerData.province}
                        onChange={handleChange}
                        disabled={true}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Country"
                        name="country"
                        value={registerData.country}
                        onChange={handleChange}
                        disabled={true}
                      />
                    </Col>

                    <Col md={6}>
                      <div className="d-flex justify-content-between mb-3 mt-3">
                        <Button
                          type="button"
                          className="btn-secondary w-100"
                          onClick={() => setStep(1)}
                        >
                          Back
                        </Button>
                      </div>
                    </Col>

                    <Col md={6}>
                      <Button type="submit" className="btn-primary w-100 mt-3">
                        Proceed Registration
                      </Button>
                    </Col>
                  </>
                )}
                {step === 3 && registerData.roles.includes("rider") && (
                  <>
                    <Col md={12}>
                    <h4 className="mb-2">Additional Information</h4>
                      <hr />
                      <h5>Step 2 of {selectedRolesCount}</h5>
                      <h6>
                        For Rider
                      </h6>
                      <hr />
                    </Col>
                    
                    <Col md={12}>
                      <h5 className="mt-3 mb-3"><b>Vehicle Information</b></h5>
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Vehicle Type"
                        name="vehicleType"
                        type="select" // Assuming InputField can handle a select type
                        value={registerData.vehicleType}
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
                        name="vehicleRegNumber"
                        placeholder="Vehicle Registration Number"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Vehicle Insurance Number"
                        name="vehicleInsuranceNumber"
                        placeholder="Vehicle Insurance Number"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Insurance Expiry Date"
                        type="date"
                        name="insuranceExpiryDate"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Driver's License Number"
                        name="driverLicenseNumber"
                        placeholder="Driver's License Number"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="License Expiry Date"
                        type="date"
                        name="licenseExpiryDate"
                        onChange={handleChange}
                      />
                    </Col>

                    <Col md={12}>

                      <AvailabilityOptions
                        selectedDays={registerData.preferredWorkingDays}
                        onDayChange={handleWorkingDaysChange}
                      />
                    </Col>


                    <Col md={3}>
                      <InputField
                        label="Start Time"
                        name="preferredStartTime"
                        type="time"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={3}>
                      <InputField
                        label="End Time"
                        name="preferredEndTime"
                        type="time"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Preferred Delivery Radius"
                        name="preferredDeliveryRadius"
                        type="select"
                        value={registerData.preferredDeliveryRadius}
                        onChange={handleChange}
                        options={[
                          { value: "", label: "Select Radius" },
                          { value: "5 km", label: "5 km" },
                          { value: "10 km", label: "10 km" },
                          { value: "15 km", label: "15 km" },
                          { value: "20+ km", label: "20+ km" },
                        ]}
                      />
                    </Col>

                    {/* Submit Button */}
                    <Col md={6}>
                      <div className="d-flex justify-content-between mb-3 mt-3">
                        <Button
                          type="button"
                          className="btn-secondary w-100"
                          onClick={() => setStep(2)}
                        >
                          Back
                        </Button>
                      </div>
                    </Col>
                    <Col md={6}>
                      <Button type="submit" className="btn-primary w-100  mb-3 mt-3">
                        Proceed Registration
                      </Button>
                    </Col>
                  </>
                )}
                {/* Step 4 - Chef-Specific Fields */}
                {step === 4 && registerData.roles.includes("chef") && (
                  <>
                    <Col md={12}>
                    <h4 className="mb-2">Additional Information</h4>
                      <hr />
                      <h5>Step 3 of {selectedRolesCount}</h5>
                      <h6>
                        For Chef
                      </h6>
                      <hr />
                    </Col>
                    {/* <h2>Additional Information</h2>
                    <p>Step 2 of {selectedRolesCount}</p>
                    <hr /> */}

                    {/* Profile Picture */}
                    {/* <Col md={12}>
                      <InputField
                        label="Upload Profile Picture"
                        type="file"
                        name="profilePicture"
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            profilePicture: e.target.files[0],
                          })
                        }
                      />
                    </Col> */}

                    {/* Culinary Information */}
                    <Col md={12}>
                    <h5 className="mt-3 mb-3"><b>Culinary Information</b></h5>
                    </Col>
                    <Col md={12} className="mb-3">
                      <SpecialtyCuisinesOptions 
                        cuisines={registerData.specialtyCuisines}
                        onCuisineChange={(e) =>
                          handleCheckboxChange(e, "specialtyCuisines")
                        }
                      />
                    </Col>
                    <Col md={12} className="mb-3">
                      <TypeOfMealsOptions
                        meals={registerData.typeOfMeals}
                        onMealChange={(e) =>
                          handleCheckboxChange(e, "typeOfMeals")
                        }
                      />
                    </Col>
                    <Col md={5}>
                      <Form.Group className="input-field mb-3">
                        <Form.Label htmlFor="Experience in Cooking">
                          Experience in Cooking
                        </Form.Label>
                        <Form.Control
                          as="select"
                          name="cookingExperience"
                          value={registerData.cookingExperience}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              cookingExperience: e.target.value,
                            })
                          }
                        >
                          <option value="" disabled>
                            Select your experience
                          </option>
                          <option value="Less than 1 year">
                            Less than 1 year
                          </option>
                          <option value="1-3 years">1-3 years</option>
                          <option value="3-5 years">3-5 years</option>
                          <option value="5+ years">5+ years</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md={12}  className="mb-3">

                      <AvailabilityOptions
                        selectedDays={registerData.preferredWorkingDays}
                        onDayChange={handleWorkingDaysChange}
                      />
                    </Col>
                    <Col md={3}>
                      <InputField
                        label="Start Time"
                        name="preferredStartTimeChef"
                        type="time"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={3}>
                      <InputField
                        label="End Time"
                        name="preferredEndTimeChef"
                        type="time"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Maximum Orders Per day"
                        name="maxOrdersPerDay"
                        placeholder="Enter the numebr"
                        onChange={handleChange}
                      />
                    </Col>
                    {/* Payment Information */}
                    {/* <Col md={12}>
                      <h5>Payment Information</h5>
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Bank Account Number"
                        name="bankAccountNumber"
                        placeholder="Bank Account Number"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={6}>
                      <InputField
                        label="Transit Number"
                        name="transitNumber"
                        placeholder="Transit Number"
                        onChange={handleChange}
                      />
                    </Col> */}
                    <Col md={6}>
                      <div className="d-flex justify-content-between mb-3 mt-3">
                        <Button
                          type="button"
                          className="btn-secondary w-100"
                          onClick={() => setStep(1)}
                        >
                          Back
                        </Button>
                      </div>
                    </Col>
                    <Col md={6}>
                      <Button type="submit" className="btn-primary w-100  mt-3">
                        Proceed Registration
                      </Button>
                    </Col>
                  </>
                )}
              </form>
            </div>
          </div>
        </Col>
        <Col
          lg={5}
          className="d-none d-lg-flex align-items-center justify-content-center p-0 position-relative"
        >
          <div className="overlay position-absolute w-100 h-100"></div>
          <img
            src={loginbg}
            className="img-fluid login-bg w-100 h-100"
            alt="Background"
          />
          <CarouselComponent
            carouselId="textCarousel"
            items={[
              "Bringing the taste of home, made by local chefs, for everyone to enjoy.",
              "Fresh, homemade meals from your neighbors, straight to your table.",
              "Crafted with care by local hands, for the heart of our community",
            ]}
          />
        </Col>

      </Row>
    </Container>
  );
};

export default Register;
