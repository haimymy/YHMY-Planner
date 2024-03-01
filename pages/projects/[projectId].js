/*
// pages/projects/[projectId].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default function ProjectDetails() {
    const router = useRouter();
    const { projectId } = router.query;
    const [project, setProject] = useState(null);
    const [projectTasks, setProjectTasks] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch('/api/users/liste');
                if (response.ok) {
                    const usersData = await response.json();
                    console.log(usersData);
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
        if (projectId) {
            // Fetch project data based on projectId
            const project = projectData.projects.find(proj => proj.id === projectId);
            setProject(project);
            console.log(project);
            // Fetch tasks for the project
            const tasks = tacheData.taches.filter(task => task.project_id === projectId);
            setProjectTasks(tasks);
        }
    }, [projectId]);

    // Function to convert statut values to status strings


    const getSalarieNameForTask = (taskId) => {
        const salarieTache = salarieTacheData.salarie_tache.find(entry => entry.tache_id === taskId);
        if (salarieTache) {
            const salarie = salarieData.salarie.find(s => s.id === salarieTache.salarie_id);
            return salarie ? `${salarie.nom}` : 'Unknown';
        }
        return 'Unknown';
    };

    const getChefDeProjetName = (chefDeProjetId) => {
        const chefDeProjet = salarieData.salarie.find(salarie => salarie.id === chefDeProjetId);
        return chefDeProjet ? `${chefDeProjet.nom} ` : 'Unknown';
    };

    return (
        <div>
            <h1>Project Details</h1>
            <h3>Ajouter une tache</h3>
            <div>
                <label>Nom de la tâche:</label>
                <input type="text" onChange={(e) => setTaskName(e.target.value)}
                />
            </div>
            <div>
                <label>Description de la tâche:</label>
                <textarea  onChange={(e) => setTaskDescription(e.target.value)}></textarea>
            </div>
            <div>
                <label>Délégué à:</label>
                <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                    <option value="" selected={1} hidden={1} disabled={1}>Choisir un salarié</option>
                    {users.map(user => (
                        <option key={user.name} value={user.name}>{user.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label>Droit d'accèés:</label>
                <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                >
                    <option value="" selected={1} hidden={1} disabled={1}>Choisir un droit</option>
                    <option value="l">Lecture seule</option>
                    <option value="le">Lecture et écriture</option>


                </select>
            </div>
            <button>Ajouter</button>

        </div>
    );
}
*/
// pages/projects/[projectId].js

import { PrismaClient } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from "next/link";
const prisma = new PrismaClient();

export default function ProjectDetails() {
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [error, setError] = useState('');
    const {projectId} = router.query;
    const [selectedUserId, setSelectedUserId] = useState('');
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
                    console.log(usersData);
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
                    console.log(projectData);
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
    {
        project && (
            <>
                <h2>{project.title}</h2>
                <p>Description: {project.description}</p>
                <p>Manager: {project.manager.name}</p>
                {buttonGestionDroit(loggedInUser, project.manager.name, projectId)}
                <h3>Tasks:</h3>
                <ul>
                    {project.tasks.map((task) => (
                        <li key={task.id}>
                            <strong>{task.id}. {task.title}</strong>
                            <p>Description: {task.description}</p>
                            <p>Status: {getStatusString(task.status)}</p>
                            <p>Ajoutée par: {task.author.name}</p>
                            <p>Assignee: {task.assignee.name}</p>
                        </li>
                    ))}
                </ul>
            </>
        )
    }
    {
        error && <div>Error: {error}</div>
    }
</div>
)
    ;
}

function TaskForm({ users,projectId }) {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedUserName, setSelectedUserName] = useState('');
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
                        selectedUserName,
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
                    <input type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)}/>
                </div>
                <div>
                    <label>Description de la tâche:</label>
                    <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)}></textarea>
                </div>
                <div>
                    <label>Effort:</label>
                    <select value={selectedEffort} onChange={handleEffortChange}>
                        <option value="" disabled>Select effort</option>
                        {fibonacci.map((number, index) => (
                            <option key={index} value={number}>{number}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Délégué à:</label>
                    <select value={selectedUserName} onChange={(e) => setSelectedUserName(e.target.value)}>
                        <option value="" disabled={true}>Choisir un salarié</option>
                        {users.map(user => (
                            <option key={user.name} value={user.name}>{user.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button type="submit">Ajouter</button>
                </div>
                {error && <div style={{color: 'red'}}>{error}</div>}
            </form>
        </div>
    );
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

function buttonGestionDroit(loggedInUser, manager, projectId){
    if(loggedInUser===manager){
        return(
            <Link href={`/projects/${projectId}/droits`}>Gestion de droits</Link>
        );
    }
}




