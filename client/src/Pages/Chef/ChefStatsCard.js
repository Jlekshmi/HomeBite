import React from "react";
import StatsCard from "../../Components/StatusCard/StatusCard";

const ChefStatsCard = ({ stats }) => {
    return (
        <div className="row mb-4">
            <div className="col-md-3">
                <StatsCard
                    title="Today's Orders"
                    value={stats.todaysOrders || 0}
                    variant="primary"
                />
            </div>
            <div className="col-md-3">
                <StatsCard
                    title="Today's Earnings"
                    value={stats.todaysEarnings ? `$ ${stats.todaysEarnings.toFixed(2)}` : "$ 0.00"}
                    variant="success"
                />
            </div>
            <div className="col-md-3">
                <StatsCard
                    title="Total Orders"
                    value={stats.totalOrders || 0}
                    variant="warning"
                />
            </div>
            <div className="col-md-3">
                <StatsCard
                    title="Total Earnings"
                    value={stats.totalEarnings ? `$ ${stats.totalEarnings.toFixed(2)}` : "$ 0.00"}
                    variant="danger"
                />
            </div>
        </div>
    );
};

export default ChefStatsCard;
