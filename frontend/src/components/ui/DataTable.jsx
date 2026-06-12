import EmptyState from './EmptyState';

const DataTable = ({ columns, data, renderRow, emptyMessage = 'No data found.', emptyIcon = 'bi-inbox' }) => {
    return (
        <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-secondary">
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} className={col.className || ''}>{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item, index) => renderRow(item, index))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="p-0 border-0">
                                <EmptyState icon={emptyIcon} message={emptyMessage} />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
