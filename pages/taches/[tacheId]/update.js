import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import StatusSelect from '@/components/taches/StatusSelect';
import EffortSelect from '@/components/taches/EffortSelect';
import MultiSelectAssignees from '@/components/taches/MultiSelectAssignees'; // Import the MultiSelectAssignees component

const UpdateTache = () => {
    const [tasksWithAssignees, setTasksWithAssignees] = useState({
        title: '',
        description: '',
        effort: 0,
        status: 'à faire',
        assignees: [],
    });
    const router = useRouter();
    const { tacheId } = router.query;
    const [users, setUsers] = useState([]);
    const [success, setSuccess] = useState('');



    useEffect(() => {
        const fetchTaskInfo = async () => {
            try {
                const response = await fetch(`/api/taches/tacheFiche?tacheId=${tacheId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                const data = await response.json();
                setTasksWithAssignees(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        if (tacheId) {
            fetchTaskInfo();
        }
    }, [tacheId]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch('/api/users/liste');
                if (response.ok) {
                    const usersData = await response.json();
                    setUsers(usersData);
                } else {
                    setError('Error fetching users');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('An error occurred while fetching users');
            }
        }

        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTasksWithAssignees({ ...tasksWithAssignees, [name]: value });
    };

    const handleAssigneesChange = (selectedAssignees) => {
        const formattedAssignees = selectedAssignees.map(assignee => ({
            taskId: tasksWithAssignees.id, // Assuming taskId is the ID of the task
            userName: assignee
        }));
        setTasksWithAssignees({ ...tasksWithAssignees, assignees: formattedAssignees });
    };


    const handleEffortChange = (value) => {
        const parsedValue = parseInt(value, 10); // Base 10
        if (!isNaN(parsedValue)) {
            setTasksWithAssignees({ ...tasksWithAssignees, effort: parsedValue });
        }
    };


    const handleStatusChange = (value) => {
        setTasksWithAssignees({ ...tasksWithAssignees, status: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/taches/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tasksWithAssignees),
            });
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            setSuccess('Task updated successfully');
            setTimeout(() => setSuccess(''), 5000);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    return (
        <div>
            <h2>Modification de tache</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" name="title" value={tasksWithAssignees.title} onChange={handleInputChange} />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" value={tasksWithAssignees.description} onChange={handleInputChange}></textarea>
                </div>
                <EffortSelect value={tasksWithAssignees.effort} onChange={handleEffortChange} />
                <StatusSelect value={tasksWithAssignees.status} onChange={handleStatusChange} />
                <div>
                    <label>Assignees:</label>
                    <MultiSelectAssignees
                        users={users}
                        selectedAssignees={tasksWithAssignees.assignees.map(assignee => assignee.userName)}
                        setSelectedAssignees={handleAssigneesChange}
                    />
                </div>
                <button type="submit">Save Changes</button>
            </form>
            {success && <div style={{ color: 'green' }}>Success: {success}</div>}

        </div>
    );
};

export default UpdateTache;
