import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import MultiSelectAssignees from "@/components/taches/MultiSelectAssignees";
import Link from "next/link";

export default function ProjectDetails() {
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [error, setError] = useState('');
    const { projectId } = router.query;
    const [users, setUsers] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null); // State variable to store loggedInUser

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

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

    useEffect(() => {
        async function fetchProject() {
            try {
                const loggedInUser = sessionStorage.getItem('loggedInUser')?.replaceAll('"', '');
                setLoggedInUser(loggedInUser);
                const response = await fetch(`/api/projects/projectFiche?projectId=${projectId}`);
                if (response.ok) {
                    const projectData = await response.json();
                    setProject(projectData);
                } else {
                    setError('Error fetching project');
                }
            } catch (error) {
                console.error('Error fetching project:', error);
                setError('An error occurred while fetching project');
            }
        }
        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    return (
        <div>
            <h1>Project Details</h1>
            <TaskForm users={users} projectId={projectId}/>

            {project && (
                <>
                    <h2>{project.title}</h2>
                    <p>Description: {project.description}</p>
                    <p>Manager: {project.manager.name}</p>
                    {buttonGestionDroit(loggedInUser, project.manager.name, projectId)}
                    <table style={{borderCollapse: 'collapse', border: '1px solid black'}}>
                        <thead>
                        <tr>
                            <th style={{
                                borderRight: '1px solid black',
                                borderBottom: '1px solid black',
                                padding: '8px'
                            }}>ID
                            </th>
                            <th style={{
                                borderRight: '1px solid black',
                                borderBottom: '1px solid black',
                                padding: '8px'
                            }}>Title
                            </th>
                            <th style={{
                                borderRight: '1px solid black',
                                borderBottom: '1px solid black',
                                padding: '8px'
                            }}>Description
                            </th>
                            <th style={{
                                borderRight: '1px solid black',
                                borderBottom: '1px solid black',
                                padding: '8px'
                            }}>Status
                            </th>
                            <th style={{
                                borderRight: '1px solid black',
                                borderBottom: '1px solid black',
                                padding: '8px'
                            }}>Added By
                            </th>
                            <th style={{
                                borderRight: '1px solid black',
                                borderBottom: '1px solid black',
                                padding: '8px'
                            }}>Assignees
                            </th>
                            <th style={{
                                borderRight: '1px solid black',
                                borderBottom: '1px solid black',
                                padding: '8px'
                            }}>Action
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {project.tasks.map((task) => (
                            <tr key={task.id}>
                                <td style={{
                                    borderRight: '1px solid black',
                                    borderBottom: '1px solid black',
                                    padding: '8px'
                                }}>{task.id}</td>
                                <td style={{
                                    borderRight: '1px solid black',
                                    borderBottom: '1px solid black',
                                    padding: '8px'
                                }}>{task.title}</td>
                                <td style={{
                                    borderRight: '1px solid black',
                                    borderBottom: '1px solid black',
                                    padding: '8px'
                                }}>{task.description}</td>
                                <td style={{
                                    borderRight: '1px solid black',
                                    borderBottom: '1px solid black',
                                    padding: '8px'
                                }}>{getStatusString(task.status)}</td>
                                <td style={{
                                    borderRight: '1px solid black',
                                    borderBottom: '1px solid black',
                                    padding: '8px'
                                }}>{task.authorName}</td>
                                <td style={{
                                    borderRight: '1px solid black',
                                    borderBottom: '1px solid black',
                                    padding: '8px'
                                }}>
                                    {task.assignees.map((assignee, index) => (
                                        <span key={index}>
                        {assignee.userName}
                                            {index !== task.assignees.length - 1 && ', '}
                    </span>
                                    ))}
                                </td>
                                <td style={{
                                    borderRight: '1px solid black',
                                    borderBottom: '1px solid black',
                                    padding: '8px'
                                }}>
                                    <Link href={`/taches/${task.id}/update`}>Modifier</Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>

                    </table>
                </>
            )}
            {error && <div>Error: {error}</div>}
        </div>
    );
}

function TaskForm({users, projectId}) {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedUserName, setSelectedUserName] = useState([]);
    const [selectedEffort, setSelectedEffort] = useState('');
    const [error, setError] = useState('');

    const fibonacci = [0, 1];
    for (let i = 2; i <= 6; i++) {
        fibonacci[i] = fibonacci[i - 1] + fibonacci[i - 2];
    }

    const handleEffortChange = (e) => {
        setSelectedEffort(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const loggedInUser = sessionStorage.getItem('loggedInUser').replaceAll('"', '');

            const response = await fetch('/api/taches/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskName,
                    taskDescription,
                    selectedUserNames: selectedUserName,
                    selectedEffort,
                    projectId,
                    loggedInUser
                }),
            });

            if (response.ok) {
                window.location.reload();
            } else {
                setError('Error creating task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            setError('An error occurred while creating task');
        }
    };

    return (
        <div>
            <h3>Ajouter une tache</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom de la tâche:</label>
                    <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} required={true}/>
                </div>
                <div>
                    <label>Description de la tâche:</label>
                    <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} required={true}></textarea>
                </div>
                <div>
                    <label>Effort:</label>
                    <select value={selectedEffort} onChange={handleEffortChange} required={true}>
                        <option value="" disabled>Select effort</option>
                        {fibonacci.map((number, index) => (
                            <option key={index} value={number}>{number}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Délégué à:</label>
                    <MultiSelectAssignees users={users} selectedAssignees={selectedUserName} setSelectedAssignees={setSelectedUserName} />
                </div>
                <div>
                    <button type="submit">Ajouter</button>
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </form>
        </div>
    );
}

function buttonGestionDroit(loggedInUser, manager, projectId) {
    if (loggedInUser === manager) {
        return (
            <Link href={`/projects/${projectId}/droits`}>Gestion de droits</Link>
        );
    }
}

function getStatusString(status) {
    const statut = parseInt(status);
    switch (statut) {
        case 0:
            return 'à faire';
        case 1:
            return 'en cours';
        case 2:
            return 'terminé';
        default:
            return 'Unknown';
    }
}





