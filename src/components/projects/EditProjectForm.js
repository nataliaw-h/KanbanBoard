import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import './styles/AddProjectForm.css';

const EditProjectForm = ({ onEditProject }) => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectDoc = doc(db, `users/${auth.currentUser.uid}/projects`, projectId);
        const projectSnapshot = await getDoc(projectDoc);
        if (projectSnapshot.exists()) {
          setProject({ id: projectId, ...projectSnapshot.data() });
        } else {
          console.log('No such project exists!');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching project:', error);
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleProjectNameChange = (e) => {
    setProject((prevProject) => ({
      ...prevProject,
      name: e.target.value,
    }));
  };

  const handleColumnChange = (e, columnIndex) => {
    const updatedColumns = [...project.columns];
    updatedColumns[columnIndex].name = e.target.value;
    setProject((prevProject) => ({
      ...prevProject,
      columns: updatedColumns,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!project) return;

    try {
      await onEditProject(project);
      alert('Project updated successfully!');
    } catch (error) {
      console.error('Error editing project:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form className="add-project-form-container" onSubmit={handleSubmit}>
      <h2 className="title">Edit Project</h2>
      <div className="form-group">
        <label htmlFor="projectName">Project Name:</label>
        <input
          type="text"
          id="projectName"
          value={project.name}
          onChange={handleProjectNameChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Columns:</label>
        {project.columns.map((column, index) => (
          <div key={index} className="column-input">
            <input
              type="text"
              value={column.name}
              onChange={(e) => handleColumnChange(e, index)}
              required
            />
          </div>
        ))}
      </div>
      <div className="button-group">
        <button type="submit">Update Project</button>
      </div>
    </form>
  );
};

export default EditProjectForm;
