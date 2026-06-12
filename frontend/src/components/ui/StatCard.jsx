const StatCard = ({ title, value, bgClass }) => {
    return (
        <div className={`card border-0 shadow-sm ${bgClass} text-white p-4 rounded-4`}>
            <h6 className="opacity-75 text-uppercase fw-bold mb-1 small">{title}</h6>
            <h2 className="display-5 fw-bold mb-0">{value}</h2>
        </div>
    );
};

export default StatCard;
