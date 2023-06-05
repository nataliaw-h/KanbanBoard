import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectContext } from './ProjectContext';
import './styles/ProjectForm.css';
import { withTranslation } from 'react-i18next';

const EditProjectForm = ({ t }) => {
  const { projectId } = useParams();
  const { projects, handleEditProject } = useContext(ProjectContext);
  const [project, setProject] = useState(null);

  useEffect(() => {
    const projectToEdit = projects.find((project) => project.id === projectId);
    if (projectToEdit) {
      setProject({ ...projectToEdit });
    }
  }, [projectId, projects]);

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
      await handleEditProject(project);
      alert(t('editProjectForm.projectUpdated'));
    } catch (error) {
      console.error('Error editing project:', error);
    }
  };

  if (!project) {
    return <div>{t('editProjectForm.loading')}</div>;
  }

  return (
    <form className="add-project-form-container" onSubmit={handleSubmit}>
      <h2 className="title">{t('editProjectForm.title')}</h2>
      <div className="form-group">
        <label htmlFor="projectName">{t('editProjectForm.projectName')}:</label>
        <input
          type="text"
          id="projectName"
          value={project.name}
          onChange={handleProjectNameChange}
          required
        />
      </div>
      <div className="form-group">
        <label>{t('editProjectForm.columns')}:</label>
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
        <button type="submit">{t('editProjectForm.updateButton')}</button>
      </div>
    </form>
  );
};

export default withTranslation()(EditProjectForm);
