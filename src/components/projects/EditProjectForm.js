import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './styles/AddProjectForm.css';

const EditProjectForm = ({ onEditProject }) => {
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState('');
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const projectDoc = doc(db, 'projects', projectId);
      const projectSnapshot = await getDoc(projectDoc);
      if (projectSnapshot.exists()) {
        setProjectName(projectSnapshot.data().name);
        setColumns(projectSnapshot.data().columns);
      } else {
        console.log('No such document!');
      }
      setIsLoading(false);
    };

    fetchProject();
  }, [projectId]);

  const handleColumnChange = (e, index) => {
    const updatedColumns = [...columns];
    updatedColumns[index].name = e.target.value;
    setColumns(updatedColumns);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditProject({ id: projectId, name: projectName, columns });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-project-form-container">
      <h2>Edit Project</h2>
      <form onSubmit={handleSubmit} className="add-project-form">
      
      <label htmlFor="projectName">Project Name:</label>
      <div className="form-group">
        <input
          type="text"
          name="projectName"
          required
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="project-name-input"
        /></div>
        <label>Columns:</label>
        <div className="form-group">
        {columns.map((column, index) => (
          <input
            key={index}
            type="text"
            value={column.name}
            onChange={(e) => handleColumnChange(e, index)}
            className="column-input"
            required
          />
        ))}</div>
        <div className="button-group">
        <button type="submit">Update Project</button>
        </div>
      </form>
    </div>
  );
};

export default EditProjectForm;
