import React from 'react';
import { Link } from 'react-router-dom';
import './styles/ProjectList.css';

const ProjectList = ({ projects, onDeleteProject }) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="project-list">
        <h2>Project List</h2>
        <p>No projects available</p>
        <Link to="/projects/add" >
          <button className="add-project-button">Add Project</button>
        </Link>
      </div>
    );
  }

  const handleDeleteProject = (projectId) => {
    onDeleteProject(projectId);
  };

  return (
    <div className="project-list">
      <h2>Project List</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id} className="project-item">
            <span className="project-name">{project.name}</span>
            <div className="project-actions">
              <Link to={`/projects/${project.id}`} className="view-kanban-board-button">
                View Kanban Board
              </Link>
              <Link to={`/projects/${project.id}/edit`} className="edit-project-button">
                Edit
              </Link>
              <Link to={`/projects/`} className="delete-project-button">
              <button
                className="delete-project-button"
                onClick={() => handleDeleteProject(project.id)}
              >
                Delete
              </button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <Link to="/projects/add">
        <button className="add-project-button">Add Project</button>
      </Link>
    </div>
  );
};

export default ProjectList;