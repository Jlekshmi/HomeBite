// SpecialtyCuisinesOptions.js
import React from "react";
import PropTypes from "prop-types";
import "./SpecialtyCuisinesOptions.scss";

const SpecialtyCuisinesOptions = ({ cuisines, onCuisineChange }) => {
  const cuisineData = [
    { name: "Indian", description: "Traditional and aromatic spices." },
    { name: "Italian", description: "Pasta, pizza, and Mediterranean flavors." },
    { name: "Mexican", description: "Bold flavors with a hint of spice." },
    { name: "Chinese", description: "Wok-fried, savory, and delicious." },
    { name: "Other", description: "Unique flavors from around the world." },
  ];

  return (
    <>
      <label className="d-block">Specialty Cuisines</label>
      <div className="d-grid d-lg-flex">
        {cuisineData.map((cuisine) => (
          <div className="form-check form-check-inline mt-2">
          <label
            className={`form-check-label ${cuisines.includes(cuisine.name) ? "checked" : ""}`}
            key={cuisine.name}
          >
            <input
              type="checkbox"
              className="form-check-input"
              name="specialtyCuisines"
              value={cuisine.name}
              checked={cuisines.includes(cuisine.name)}
              onChange={onCuisineChange}
            />
            <p className="mb-0">
              <b>{cuisine.name}</b>
              <br />
              {/* {cuisine.description} */}
            </p>
          </label>
          </div>
        ))}
      </div>
    </>
  );
};

SpecialtyCuisinesOptions.propTypes = {
  cuisines: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCuisineChange: PropTypes.func.isRequired,
};

export default SpecialtyCuisinesOptions;
