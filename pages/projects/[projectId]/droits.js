import { useState, useEffect } from 'react';
import {useRouter} from "next/router";

export default function ManagePermissions() {
    const [usersWithPermissions, setUsersWithPermissions] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();
    const { projectId } = router.query;
    useEffect(() => {
        async function fetchUsersWithPermissions(projectId) {
            try {
                const response = await fetch(`/api/projects/assignees?projectId=${projectId}`);
                if (response.ok) {
                    const usersData = await response.json();
                    console.log(usersData);
                    setUsersWithPermissions(usersData);
                } else {
                    setError('Error fetching users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('An error occurred while fetching users');
            }
        }

        if (projectId) {
            fetchUsersWithPermissions(projectId);
        }
    }, [projectId]);

    const handlePermissionChange = async (assigneeName, accessType) => {
        try {
            const response = await fetch('/api/projects/permissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assigneeName, accessType }),
            });
            if (!response.ok) {
                throw new Error('Failed to update permissions');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h1>Manage Permissions</h1>
            {usersWithPermissions.map(({ userName, accessType }) => ( // Corrected destructuring
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
            {error && <div>Error: {error}</div>}
        </div>
    );

}