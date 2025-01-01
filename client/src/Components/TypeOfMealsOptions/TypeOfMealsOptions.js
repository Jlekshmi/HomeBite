import React from "react";
import PropTypes from "prop-types";
import "./TypeOfMealsOptions.scss"; // Reusing RoleOptions styles

const TypeOfMealsOptions = ({ meals, onMealChange }) => {
  const mealData = ["Breakfast", "Lunch", "Dinner", "Snacks", "Other"];

  return (
    <>
      <label className="d-block">Type of Meals</label>
      <div className="d-grid d-lg-flex">
      {mealData.map((meal) => (
        <div className="form-check form-check-inline mt-2">
          <label className={`form-check-label ${meals.includes(meal) ? "checked" : ""}`} key={meal}>
            <input
              type="checkbox"
              className="form-check-input"
              name="typeOfMeals"
              value={meal}
              checked={meals.includes(meal)}
              onChange={(e) => onMealChange(e, "typeOfMeals")}
            />
            <p className="mb-0">
              <b>{meal}</b>
            </p>
          </label>
        </div>
      ))}
</div>
    </>

  );
};

TypeOfMealsOptions.propTypes = {
  meals: PropTypes.arrayOf(PropTypes.string).isRequired,
  onMealChange: PropTypes.func.isRequired,
};

export default TypeOfMealsOptions;
