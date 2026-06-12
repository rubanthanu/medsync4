const EmptyState = ({ icon, message }) => {
    return (
        <div className="text-center py-5 text-muted">
            <i className={`bi ${icon} display-6`}></i>
            <p className="mt-2 mb-0">{message}</p>
        </div>
    );
};

export default EmptyState;
