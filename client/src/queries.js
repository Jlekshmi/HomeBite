import { gql } from "@apollo/client";

// Mutation for creating a user
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      first_name
      last_name
      email
      mobile_number
      role
      gender
      profile_image
      status
      address_line_1
      address_line_2
      city
      province
      postal_code
      country
      nearby_landmark
      created_at
    }
  }
`;

// Mutation for updating a user
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      first_name
      last_name
      email
      mobile_number
      role
      gender
      profile_image
      status
      address_line_1
      address_line_2
      city
      province
      postal_code
      country
      nearby_landmark
    }
  }
`;

// Mutation for creating a rider
export const CREATE_RIDER = gql`
  mutation CreateRider($input: CreateRiderInput!) {
    createRider(input: $input) {
      id
      user {
        id
        first_name
        last_name
        email
      }
      vehicle_type
      vehicle_registration_number
      vehicle_insurance_number
      driver_license_number
      preferred_delivery_radius
      preferred_working_days
      preferred_start_time
      preferred_end_time
      long_distance_preference
    }
  }
`;

// Mutation for updating a rider
export const UPDATE_RIDER = gql`
  mutation UpdateRider($id: ID!, $input: UpdateRiderInput!) {
    updateRider(id: $id, input: $input) {
      id
      vehicle_type
      vehicle_registration_number
      vehicleInsuranceNumber
      driver_license_number
      preferred_delivery_radius
      preferred_working_days
      preferred_start_time
      preferred_end_time
      long_distance_preference
    }
  }
`;
// Mutation for creating a chef
export const CREATE_CHEF = gql`
  mutation CreateChef($input: CreateChefInput!) {
    createChef(input: $input) {
      id
      user {
        id
        first_name
        last_name
        email
      }
      specialty_cuisines
      type_of_meals
      cooking_experience
      max_orders_per_day
      preferred_working_days
      preferred_start_time
      preferred_end_time
    }
  }
`;
export const CREATE_PAYMENT_INFO = gql`
  mutation CreatePaymentInfo($input: CreatePaymentInfoInput!) {
    createPaymentInfo(input: $input) {
      id
      user {
        id
        first_name
        last_name
        email
      }
      bank_account_number
      transit_number
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    getUserProfile(userId: $userId) {
      id
      first_name
      last_name
      email
      mobile_number
    }
  }
`;

export const GET_CHEF_PROFILE = gql`
  query GetChefProfile($userId: ID!) {
    getChefProfile(userId: $userId) {
      specialty_cuisines
      type_of_meals
      cooking_experience
      max_orders_per_day
      preferred_working_days
    }
  }
`;

export const GET_RIDER_PROFILE = gql`
  query GetRiderProfile($userId: ID!) {
    getRiderProfile(userId: $userId) {
      vehicle_registration_number
      driver_license_number
      preferred_delivery_radius
      preferred_working_days
      preferred_start_time
      preferred_end_time
      long_distance_preference
    }
  }
`;

export const UPDATE_CHEF = gql`
  mutation UpdateChef($input: ChefInput!) {
    updateChef(input: $input) {
      id
    }
  }
`;
export const UPDATE_USER_PROFILES = gql`
  mutation UpdateUserProfile(
    $id: ID!
    $userInput: UserInput!
    $chefInput: ChefInput!
  ) {
    updateUserProfile(id: $id, userInput: $userInput, chefInput: $chefInput) {
      user {
        id
        first_name
        last_name
        email
        mobile_number
        role
        gender
        profile_image
        status
        address_line_1
        address_line_2
        city
        province
        postal_code
        country
        nearby_landmark
      }
      chef {
        specialty_cuisines
        type_of_meals
        cooking_experience
        max_orders_per_day
        preferred_working_days
      }
    }
  }
`;
export const GET_CHEFS_AND_PRODUCTS = gql`
  query GetChefsAndProducts($campus: String) {
    getAllChefs {
      id
      user {
        first_name
        last_name
        profile_image
        address_line_1
      }
      specialty_cuisines
      type_of_meals
    }
    getAllProducts(campus: $campus) {
      id
      chef_id
      name
      description
      price
      quantity
      image_url
      dietary
      created_at
      is_available
      user {
        id
        address_line_1
        address_line_2
      }
    }
  }
`;

export const GET_PRODUCT_DETAILS = gql`
  query GetProductDetails($id: ID!) {
    getProductById(id: $id) {
    id
    chef_id
      name
      description
      price
      image_url
      dietary
      quantity
      is_available
      chef {
        id
        specialty_cuisines
        type_of_meals
        user {
          first_name
          last_name
          address_line_1
          address_line_2
        }
      }
    }
  }
`;

export const GET_CHEF_DETAILS = gql`
  query GetChefDetails($id: ID!) {
    getChefById(id: $id) {
      id
        specialty_cuisines
        type_of_meals
        cooking_experience
        max_orders_per_day
        preferred_working_days
      user {
        first_name
        last_name
        profile_image
        address_line_1
      }
      products {
        id
      chef_id
      name
      description
      price
      quantity
      image_url
      dietary
      created_at
      is_available
      }
    }
  }
`;
export const GET_LATEST_ORDER = gql`
 query GetLatestOrder($customerId: ID!) {
  getLatestOrder(customerId: $customerId) {
    _id
    order_no
    customer_id {
        first_name
        last_name
        email
        address_line_1
        city
        province
    }
    chef_id {
      user {
        first_name
        last_name
        address_line_1
      }
    }
    items {
      product_id {
        name
        description
        image_url
      }
      quantity
      unit_price
    }
    total_amount
    status
    created_at
  }
}
`;
export const UPDATE_USER_PROFILES_RIDER = gql`
  mutation updateUserProfileRider(
    $id: ID!
    $userInput: UserInput!
    $riderInput: RiderInput!
  ) {
    updateUserProfileRider(id: $id, userInput: $userInput, riderInput: $riderInput) {
      user {
        id
        first_name
        last_name
        email
        mobile_number
        role
        gender
        profile_image
        status
        address_line_1
        address_line_2
        city
        province
        postal_code
        country
        nearby_landmark
      }
      rider {
        vehicle_type
    vehicle_registration_number
    vehicle_insurance_number
    insurance_expiry_date
    driver_license_number
    license_expiry_date
    preferred_delivery_radius
    preferred_working_days
    long_distance_preference
      }
    }
  }
`;