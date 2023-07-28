import React, { useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { serverTimestamp } from 'firebase/firestore';
import { ProjectContext } from './ProjectContext';
import './styles/ProjectForm.css';
import { withTranslation } from 'react-i18next';

const AddProjectForm = ({ t }) => {
  const { handleAddProject } = useContext(ProjectContext);
  const [projectName, setProjectName] = useState('');
  const [columns, setColumns] = useState([{ id: uuidv4(), name: '', limit: null, required: true }]);

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleColumnChange = (e, index, field) => {
    const updatedColumns = [...columns];
    updatedColumns[index][field] = e.target.value;
    setColumns(updatedColumns);
  };

  const addColumn = () => {
    if (columns.length < 6) {
      setColumns([...columns, { id: uuidv4(), name: '', limit: null, required: false }]);
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
      columns: columns.filter((column) => column.name.trim() !== '').map(column => ({
        ...column,
        limit: column.limit ? Number(column.limit) : null
      })),
      createdAt: serverTimestamp(),
    };

    try {
      await handleAddProject(newProject);
      alert(t('addProjectForm.projectAdded'));
    } catch (error) {
      console.error('Error adding project:', error);
    }

    setProjectName('');
    setColumns([{ id: uuidv4(), name: '', limit: null, required: true }]);
  };

  return (
    <form className="add-project-form-container" onSubmit={handleSubmit}>
      <h2 className="title">{t('addProjectForm.addProject')}</h2>
      <div className="form-group">
        <label htmlFor="projectName">{t('addProjectForm.projectName')}:</label>
        <input type="text" id="projectName" value={projectName} onChange={handleProjectNameChange} required />
      </div>
      <div className="form-group">
        <label>{t('addProjectForm.columns')}:</label>
        {columns.map((column, index) => (
  <div key={index} className="column-input">
    <input
      type="text"
      value={column.name}
      onChange={(e) => handleColumnChange(e, index, 'name')}
      required={column.required}
    />
    <input
      type="number"
      value={column.limit || ''}
      onChange={(e) => handleColumnChange(e, index, 'limit')}
      placeholder={t('addProjectForm.columnLimit')}
    />
    {index > 0 && (
      <button type="button" className="remove-button" onClick={() => removeColumn(index)}>
        &minus;
      </button>
    )}
  </div>
))}
        <button type="button" className="add-column-button" onClick={addColumn}>
          {t('addProjectForm.addColumn')}
        </button>
      </div>
      <div className="button-group">
        <button type="submit">{t('addProjectForm.addProject')}</button>
      </div>
    </form>
  );
};

export default withTranslation()(AddProjectForm);
