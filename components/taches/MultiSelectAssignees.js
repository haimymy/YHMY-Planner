import React from 'react';

function MultiSelectAssignees({ users, selectedAssignees, setSelectedAssignees }) {
    const handleAssigneeChange = (e) => {
        const selectedOptions = Array.from(e.target.options)
            .filter(option => option.selected)
            .map(option => option.value);
        setSelectedAssignees(selectedOptions);
    };

    return (
        <select multiple={true} value={selectedAssignees} onChange={handleAssigneeChange} required={true}>
            <option value="" disabled={true} key="default">Choisir un salarié</option>
            {users.map(user => (
                <option key={user.name} value={user.name}>{user.name}</option>
            ))}
        </select>
    );
}

export default MultiSelectAssignees;
