import React from "react";
import PropTypes from "prop-types";
import "./AvailabilityOptions"; // Reusing RoleOptions styles
import "./AvailabilityOptions.scss";

const AvailabilityOptions = ({ selectedDays, onDayChange }) => {
  const workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <>
    
   <h5  className="mt-3 mb-3">Availability</h5>
    <label className="d-block">Preferred Working Days</label>
    <div className="row mb-3">
      {workingDays.map((day) => (
        <div className="col-md-3 col">
          <div className="form-check form-check-inline mt-2">
        <label className={`form-check-label ${selectedDays.includes(day) ? "checked" : ""}`} key={day}>
          <input
           className="form-check-input"
            type="checkbox"
            name="preferredWorkingDays"
            value={day}
            checked={selectedDays.includes(day)}
            onChange={(e) => onDayChange(e, "preferredWorkingDays")}
            
          />
          <p className="mb-0">{day}<br /></p>
        </label>
        </div></div>
      ))}
      </div>
    </>
  );
};

AvailabilityOptions.propTypes = {
  selectedDays: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDayChange: PropTypes.func.isRequired,
};

export default AvailabilityOptions;
