import React from "react";
import PropTypes from "prop-types";
import "./CarouselComponent.scss";
const CarouselComponent = ({ carouselId, items }) => {
  return (
    <div
      id={carouselId}
      className="carousel slide position-absolute mb-3"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        {items.map((item, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <div className="d-block p-3 text-white h3 text-carousel">{item}</div>
          </div>
        ))}
      </div>
      <div className="position-relative w-50 mx-3 d-flex">
        <button
          className="carousel-control-prev position-relative w-auto"
          type="button"
          data-bs-target={`#${carouselId}`}
          data-bs-slide="prev"
        >
          <i className="material-icons">arrow_circle_left</i>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next position-relative w-auto mx-3"
          type="button"
          data-bs-target={`#${carouselId}`}
          data-bs-slide="next"
        >
          <i className="material-icons">arrow_circle_right</i>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

CarouselComponent.propTypes = {
  carouselId: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CarouselComponent;
