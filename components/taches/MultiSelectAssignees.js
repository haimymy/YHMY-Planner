import React from 'react';

function MultiSelectAssignees({ users, selectedAssignees, setSelectedAssignees }) {
    const handleAssigneeChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedAssignees(selectedOptions);
    };

    return (
        <select multiple={true} value={selectedAssignees} onChange={handleAssigneeChange} required={true}>
            <option value="" disabled={true}>Choisir un salarié</option>
            {users.map(user => (
                <option key={user.name} value={user.name}>{user.name}</option>
            ))}
        </select>
    );
}

export default MultiSelectAssignees;
