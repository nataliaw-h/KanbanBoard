import React, { useState } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';

const EditTaskForm = ({ task, onUpdate, onCancel }) => {
  const [taskName, setTaskName] = useState(task.name);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [taskPriority, setTaskPriority] = useState(task.priority);
  const [taskExpirationDate, setTaskExpirationDate] = useState(task.expirationDate);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (taskName.trim() === '' || taskDescription.trim() === '' || taskExpirationDate.trim() === '') {
      setValidationError('All fields must be filled in.');
      return;
    }

    onUpdate({ ...task, name: taskName, description: taskDescription, priority: taskPriority, expirationDate: taskExpirationDate });
  };

  const handleCancel = () => {
    onCancel();
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= taskPriority) {
        stars.push(<FaStar key={i} className="star" onClick={() => setTaskPriority(i)} />);
      } else {
        stars.push(<FaRegStar key={i} className="star" onClick={() => setTaskPriority(i)} />);
      }
    }
    return stars;
  };

  return (
    <form className="edit-task-form" onSubmit={handleSubmit}>
      <input
        className="input-field"
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Enter task name"
        maxLength="100"
      />
      <textarea
        className="input-field"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
        placeholder="Enter task description"
        maxLength="500"
        rows="4"
      />
      <input
        className="input-field"
        type="date"
        value={taskExpirationDate}
        onChange={(e) => setTaskExpirationDate(e.target.value)}
        placeholder="Enter task expiration date"
      />
      <div className="stars">{renderStars()}</div>
      <div className="button-container">
        <button type="submit" className="update-task-button">
          Update Task
        </button>
        <button type="button" className="cancel-task-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
      {validationError && <div className="validation-error">{validationError}</div>}
    </form>
  );
};

export default EditTaskForm;
