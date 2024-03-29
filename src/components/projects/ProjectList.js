import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './styles/ProjectList.css';
import { ProjectContext } from './ProjectContext';
import { withTranslation } from 'react-i18next';

const ProjectList = ({ t }) => {
  // Wykorzystanie kontekstu ProjectContext
  const { projects, handleDeleteProject } = useContext(ProjectContext);

  // Inicjalizacja stanów sortBy i filterBy
  const [sortBy, setSortBy] = useState('default');
  const [filterBy, setFilterBy] = useState('');

  // Obsługa zmiany sortowania
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Obsługa zmiany filtracji
  const handleFilterChange = (event) => {
    setFilterBy(event.target.value);
  };

  // Sortowanie projektów
  const sortProjects = (projects) => {
    if (sortBy === 'name-asc') {
      return [...projects].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      return [...projects].sort((a, b) => b.name.localeCompare(a.name));
    } else {
      return projects;
    }
  };

  // Filtrowanie projektów na podstawie nazwy
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(filterBy.toLowerCase())
  );

  // Sortowanie i filtrowanie projektów
  const sortedProjects = sortProjects(filteredProjects);

  return (
    <div className="project-list">
      <h1 className="title">{t('projectList.title')}</h1>
      <div className="filter-sort-container">
        <div className="filter-container">
          <label htmlFor="filter">{t('projectList.filterByName')}:</label>
          <input
            type="text"
            id="filter"
            value={filterBy}
            onChange={handleFilterChange}
            placeholder={t('projectList.enterProjectName')}
          />
        </div>
        <div className="sort-container">
          <label htmlFor="sort">{t('projectList.sortByName')}:</label>
          <select id="sort" value={sortBy} onChange={handleSortChange}>
            <option value="default">{t('projectList.default')}</option>
            <option value="name-asc">{t('projectList.nameAsc')}</option>
            <option value="name-desc">{t('projectList.nameDesc')}</option>
          </select>
        </div>
      </div>
      {sortedProjects.length === 0 ? (
        <p>{t('projectList.noProjectsAvailable')}</p>
      ) : (
        <ul>
          {sortedProjects.map((project) => (
            <li key={project.id} className="project-item">
              <span className="project-name">{project.name}</span>
              <div className="project-actions">
                <Link to={`/projects/${project.id}`} className="view-kanban-board-button">
                  {t('projectList.viewKanbanBoard')}
                </Link>
                <Link to={`/projects/${project.id}/edit`} className="edit-project-button">
                  {t('projectList.edit')}
                </Link>
                <Link to={`/projects`} className="delete-project-button">
                  <button
                    className="delete-project-button"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    {t('projectList.delete')}
                  </button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Link to="/projects/add">
        <button className="add-project-button">{t('projectList.addProject')}</button>
      </Link>
    </div>
  );
};

// Dodanie tłumaczenia do komponentu
export default withTranslation()(ProjectList);
