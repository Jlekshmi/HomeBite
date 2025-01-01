import React from "react";

const StatsCard = ({ title, value, variant }) => {
    const displayValue =
    title.includes("Earnings") && typeof value === "number"
      ? `$ ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      : typeof value === "number"
      ? value.toLocaleString(undefined, { minimumFractionDigits: 0 }) // No decimals for order counts
      : value || 0;

    return (
        <div className={`col-12 col-lg-6 col-xl-3`}>
            <div className={`card alert alert-${variant}`}>
                <div className="card-body">
                    <h5>{title}</h5>
                    <h3>{displayValue}</h3>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;



// import React from "react";

// const StatsCard = ({ title, value, variant }) => {
//   const bgColorClass = `bg-${variant} text-white`;
//   const displayValue =
//     typeof value === "number"
//       ? value.toFixed(2) // Display as a fixed decimal if it's a number
//       : value || 0; // Default to 0 if undefined or not a number

//   return (
//     <div className={`card shadow-sm border-0 mb-3 ${bgColorClass}`} style={{ padding: "20px" }}>
//       <h5>{title}</h5>
//       <h2>{displayValue}</h2>
//     </div>
//   );
// };

//export default StatsCard;

