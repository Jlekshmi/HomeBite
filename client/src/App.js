import { Route, Routes } from "react-router-dom";
//import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import ForgotPassword from "./Pages/Login/ForgotPassword";
import ResetPassword from "./Pages/Login/ResetPassword";
import Dashboard from "./Pages/Customer/Dashboard";
import Register from "./Pages/Register/Register";
import ChefDash from "./Pages/Chef/Dashboard";
import Products from "./Pages/Chef/Product/Products";
import AddProduct from "./Pages/Chef/Product/AddProduct";
import EditProduct from "./Pages/Chef/Product/EditProduct";
import CurrentOrders from "./Pages/Chef/CurrentOrders";
import CompletedOrders from "./Pages/Chef/OrderCompleted";
import Profile from "./Pages/Chef/ProfileView";
import EditProfile from "./Pages/Chef/Profile";
import ProductDetails from "./Pages/Customer/ProductDetails";
import ChefDetails from "./Pages/Customer/ChefDetails";
import OrderDetails from "./Pages/Customer/OrderDetails";
import RiderDash from "./Pages/Rider/Dashboard";
import CurrentOrdersRider from "./Pages/Rider/CurrentOrders";
import CompletedOrdersRider from "./Pages/Rider/OrderCompleted";
import InprogressOrders from "./Pages/Rider/InprogressOrders";
import ProfileRider from "./Pages/Rider/ProfileView";
import EditProfileRider from "./Pages/Rider/Profile";
import PastOrders from "./Pages/Customer/PastOrders";
import "./App.scss";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/Customer/ProductDetails/:productId" element={<ProductDetails />} />
      <Route path="/Customer/ChefDetails/:chefId" element={<ChefDetails />} />
      <Route path="/Customer/OrderDetails" element={<OrderDetails />} />
      <Route path="/Customer/PastOrders" element={<PastOrders />} />
      {/* <Route path="/Home" element={<Home />} /> */}
      <Route path="/Login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* Chef routes */}
      {/* Chef Dashboard Layout with Nested Routes */}
      <Route path="/chef" element={<ChefDash />}>
        {/* <Route index element={<Dashboard />} /> This could be the main dashboard view */}
        <Route path="orders" element={<CurrentOrders />} />
        <Route path="orders/completed" element={<CompletedOrders />} />
        <Route path="products" element={<Products />} />
        <Route path="product/add" element={<AddProduct />} />
        <Route path="product/edit/:id" element={<EditProduct />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/edit" element={<EditProfile />} />
      </Route>
       {/* Rider Dashboard Layout with Nested Routes */}
       <Route path="/rider" element={<RiderDash />}>
        <Route path="orders" element={<CurrentOrdersRider />} />
        <Route path="orders/completed" element={<CompletedOrdersRider />} />
        <Route path="orders/in-progress" element={<InprogressOrders />} />
        <Route path="profile" element={<ProfileRider />} />
        <Route path="profile/edit" element={<EditProfileRider />} />
      </Route>
    </Routes>
  );
}

export default App;
