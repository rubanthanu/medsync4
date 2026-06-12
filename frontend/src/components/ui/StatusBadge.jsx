import { getStatusPillClass, getQueueBadgeClass, getCertificateBadgeClass, getCategoryBadgeClass } from '../../utils/statusUtils';

const StatusBadge = ({ status, type = 'appointment' }) => {
    if (type === 'appointment') {
        return (
            <span className={`status-pill ${getStatusPillClass(status)}`}>
                {status}
            </span>
        );
    }

    if (type === 'queue') {
        return (
            <span className={`badge ${getQueueBadgeClass(status)} px-3 py-2 rounded-pill`}>
                {status}
            </span>
        );
    }

    if (type === 'certificate') {
        return (
            <span className={`badge rounded-pill px-3 py-1 fw-semibold ${getCertificateBadgeClass(status)}`}>
                {status}
            </span>
        );
    }

    if (type === 'category') {
        return (
            <span className={`badge rounded-pill px-3 py-2 shadow-sm fw-semibold ${getCategoryBadgeClass(status)}`}>
                {status}
            </span>
        );
    }

    return <span className="badge bg-secondary rounded-pill px-3">{status}</span>;
};

export default StatusBadge;
