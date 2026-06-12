const LoadingSpinner = ({ message = '' }) => {
    return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            {message && <p className="text-muted small mt-2">{message}</p>}
        </div>
    );
};

export default LoadingSpinner;
