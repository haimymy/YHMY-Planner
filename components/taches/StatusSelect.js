import React from 'react';

const StatusSelect = ({ value, onChange }) => {
    const getStatusString = (status) => {
        const statut = parseInt(status);
        switch (statut) {
            case 0:
                return 'À faire';
            case 1:
                return 'En cours';
            case 2:
                return 'Terminé';
            default:
                return 'Unknown';
        }
    };
    const handleStatusChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div>
            <label>Statut:</label>
            <select value={value} onChange={handleStatusChange} required>
                <option value="" disabled>Select status</option>
                <option value="0">{getStatusString(0)}</option>
                <option value="1">{getStatusString(1)}</option>
                <option value="2">{getStatusString(2)}</option>
            </select>

        </div>

    );
};

export default StatusSelect;
