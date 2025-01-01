import MainLayout from "../../Components/Layouts/MainLayout"
import Carousel from "../../Components/Carousel/Carousel"
import { useLocation } from "react-router-dom";
import { Alert } from "react-bootstrap";

export default function Home() {
  const location = useLocation();
  const successMessage = location.state?.successMessage; // Retrieve success message
  return (
    <div className="Dashboard">
      <MainLayout></MainLayout>
      {successMessage && (
        <Alert variant="success" className="my-3">
          {successMessage}
        </Alert>
      )}
      <Carousel></Carousel>

    </div>
  )
}
