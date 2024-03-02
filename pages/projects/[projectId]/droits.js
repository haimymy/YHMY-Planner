import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ManagePermissions() {
    const [usersWithPermissions, setUsersWithPermissions] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const { projectId } = router.query;

    // Define fetchUsersWithPermissions function
    const fetchUsersWithPermissions = async (projectId) => {
        try {
            const response = await fetch(`/api/projects/assignees?projectId=${projectId}`);
            if (response.ok) {
                const usersData = await response.json();
                setUsersWithPermissions(usersData);
            } else {
                setError('Error fetching users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('An error occurred while fetching users');
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchUsersWithPermissions(projectId);
        }
    }, [projectId]);

    const handlePermissionChange = async (assigneeName, accessType) => {
        try {
            const response = await fetch('/api/projects/permissions', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assigneeName, accessType, projectId }),
            });
            if (!response.ok) {
                throw new Error('Failed to update permissions');
            }
            // Fetch updated permissions after successful update
            fetchUsersWithPermissions(projectId);
            setSuccess('Permissions updated successfully');
            setTimeout(() => setSuccess(''), 5000); // Clear success message after 5 seconds
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h1>Manage Permissions</h1>
            {usersWithPermissions.map(({ userName, accessType }) => (
                <div key={userName}>
                    <p>User: {userName}</p>
                    <label>
                        <input
                            type="radio"
                            name={userName}
                            value="ls"
                            checked={accessType === 'ls'}
                            onChange={() => handlePermissionChange(userName, 'ls')}
                        />
                        Lecture seule
                    </label>
                    <label>
                        <input
                            type="radio"
                            name={userName}
                            value="le"
                            checked={accessType === 'le'}
                            onChange={() => handlePermissionChange(userName, 'le')}
                        />
                        Lecture et écriture
                    </label>
                </div>
            ))}
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}
            {success && <div style={{ color: 'green' }}>Success: {success}</div>}
        </div>
    );
}
