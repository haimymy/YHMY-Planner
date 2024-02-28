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
            if(loggedInUser===userName) {
                const response = await fetch(`/api/users/${loggedInUser}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserProjects(data.projects);
                } else {
                    setError('Failed to fetch user projects');
                }
            } else router.replace('/users/login');
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
            <ul>
                {userProjects.map((project) => (
                    <li key={project.id}>
                        <strong>{project.title}</strong>
                        <p>Description: {project.description}</p>
                        <Link href={`/projects/${project.id}`}>
                            View Project Details
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
