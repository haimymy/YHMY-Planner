import React from 'react';

const EffortSelect = ({ value, onChange }) => {
    const handleEffortChange = (e) => {
        onChange(e.target.value);
    };

    const fibonacci = [0, 1];
    for (let i = 2; i <= 6; i++) {
        fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
    }

    return (
        <div>
            <label>Effort:</label>
            <select value={value} onChange={handleEffortChange} required={true}>
                <option value="" disabled>Select effort</option>
                {fibonacci.map((number, index) => (
                    <option key={index} value={number}>
                        {number}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default EffortSelect;
