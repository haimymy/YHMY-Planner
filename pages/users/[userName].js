import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";
import {redirect} from "next/navigation";

export default function AddProject() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const { userName } = router.query;
    const [userProjects, setUserProjects] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);

    const fetchUserProjects = async () => {
        try {
            const loggedInUser = sessionStorage.getItem('loggedInUser').replaceAll('"', '');
            setLoggedInUser(loggedInUser);
            console.log(userName);
            if(loggedInUser===userName) {
                const response = await fetch(`/api/users/${loggedInUser}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserProjects(data.projects);
                } else {
                    setError('Failed to fetch user projects');
                }
            } else console.log('login');
        } catch (error) {
            console.error('Error fetching user projects:', error);
            setError('An error occurred while fetching user projects');
        }
    };

    useEffect(() => {
        fetchUserProjects();
    }, [userName]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/projects/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description, userName }),
            });

            if (response.ok) {
                await fetchUserProjects();
                setTitle('');
                setDescription('');
            } else {
                setError('Error adding project');
            }
        } catch (error) {
            console.error('Error adding project:', error);
            setError('An error occurred while adding project');
        }
    };

    const handleDeleteProject = async (projectId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this project?");
        if (!confirmDelete) return;
        try {
            const response = await fetch(`/api/projects/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ projectId }),
            });
            if (response.ok) {
                router.replace(router.asPath);
            } else {
                setError('Error deleting project');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            setError('An error occurred while deleting project');
        }
    };

    return (
        <div>
            <h1>Add Project</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Manager:</label>
                    <input
                        type="text"
                        value={userName || ''}
                        disabled
                    />
                </div>
                {error && <div style={{color: 'red'}}>{error}</div>}
                <button type="submit">Add Project</button>
            </form>

            <h3>Mes projets :</h3>
            <h5>Y compris les projets que l'utilisateur a créés ou auxquels il'a été assigné des tâches </h5>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {userProjects.map((project) => (
                    <tr key={project.id}>
                        <td>{project.id}</td>
                        <td>{project.title}</td>
                        <td>{project.description}</td>
                        <td>
                            <Link href={`/projects/${project.id}`}>
                                View Project Details
                            </Link>
                            <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
}
