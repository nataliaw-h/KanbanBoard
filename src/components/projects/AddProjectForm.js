import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import { serverTimestamp } from 'firebase/firestore'
import './styles/AddProjectForm.css';

const AddProjectForm = ({ onAddProject }) => {
  const [projectName, setProjectName] = useState('');
  const [columns, setColumns] = useState([{ id: uuidv4(), name: '', required: true }]); // Add id to initial column

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleColumnChange = (e, index) => {
    const updatedColumns = [...columns];
    updatedColumns[index].name = e.target.value;
    setColumns(updatedColumns);
  };

  const addColumn = () => {
    if (columns.length < 6) {
      setColumns([...columns, { id: uuidv4(), name: '', required: false }]); // Add id to new column
    }
  };

  const removeColumn = (index) => {
    const updatedColumns = [...columns];
    updatedColumns.splice(index, 1);
    setColumns(updatedColumns);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName || !columns.some((column) => column.name.trim() !== '')) {
      return;
    }

    const newProject = {
      name: projectName,
      columns: columns.filter((column) => column.name.trim() !== ''),
      createdAt: serverTimestamp(),
    };

    try {
      await onAddProject(newProject);
    } catch (error) {
      console.error('Error adding project:', error);
    }

    setProjectName('');
    setColumns([{ id: uuidv4(), name: '', required: true }]); // Add id to reset column
  };


  return (
    <form className="add-project-form-container" onSubmit={handleSubmit}>
      <h2 className='title'>Add Project</h2>
      <div className="form-group">
        <label htmlFor="projectName">Project Name:</label>
        <input
          type="text"
          id="projectName"
          value={projectName}
          onChange={handleProjectNameChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Columns:</label>
        {columns.map((column, index) => (
          <div key={index} className="column-input">
            <input
              type="text"
              value={column.name}
              onChange={(e) => handleColumnChange(e, index)}
              required={column.required}
            />
            {index > 0 && (
              <button
                type="button"
                className="remove-button"
                onClick={() => removeColumn(index)}
              >
                &minus;
              </button>
            )}
          </div>
        ))}
        <button type="button" className="add-column-button" onClick={addColumn}>
          Add Column
        </button>
      </div>
      <div className="button-group">
        <button type="submit">Add Project</button>
      </div>
    </form>
  );
};

export default AddProjectForm;