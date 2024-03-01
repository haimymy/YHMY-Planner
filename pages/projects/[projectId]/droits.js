import { useState, useEffect } from 'react';
import {useRouter} from "next/router";

export default function ManagePermissions() {
    const [usersWithPermissions, setUsersWithPermissions] = useState([]);
    const [error, setError] = useState('');
    const router = useRouter();
    const { projectId } = router.query;
    useEffect(() => {
        async function fetchUsers(projectId ) {
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
            fetchUsers(projectId);
        }
    }, [projectId]);// Make sure to include projectId in the dependency array to trigger the effect when it changes

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
            {usersWithPermissions.map(({ assignee, accessType }) => (
                <div key={assignee.name}>
                    <p>User: {assignee.name}</p>
                    <label>
                        <input
                            type="radio"
                            name={assignee.name}
                            value="ls"
                            checked={accessType === 'ls'}
                            onChange={() => handlePermissionChange(assignee.name, 'ls')}
                        />
                        Lecture seule
                    </label>
                    <label>
                        <input
                            type="radio"
                            name={assignee.name}
                            value="le"
                            checked={accessType === 'le'}
                            onChange={() => handlePermissionChange(assignee.name, 'le')}
                        />
                        Lecture et écriture
                    </label>
                </div>
            ))}
            {error && <div>Error: {error}</div>}
        </div>
    );
}