import React, { useState } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';

const AddTaskForm = ({ columnId, onAdd }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState(1);
  const [taskExpirationDate, setTaskExpirationDate] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (taskName.trim() === '' || taskDescription.trim() === '' || taskExpirationDate.trim() === '') {
      setValidationError('All fields must be filled in.');
      return;
    }

    onAdd(columnId, {
      name: taskName,
      description: taskDescription,
      priority: taskPriority,
      expirationDate: taskExpirationDate,
    });
    setTaskName('');
    setTaskDescription('');
    setTaskPriority(1);
    setTaskExpirationDate('');
    setValidationError('');
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= taskPriority) {
        stars.push(
          <FaStar className="star" key={i} onClick={() => setTaskPriority(i)} />
        );
      } else {
        stars.push(
          <FaRegStar className="star" key={i} onClick={() => setTaskPriority(i)} />
        );
      }
    }
    return stars;
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
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
        <button type="submit" className="add-task-button">
          Add Task
        </button>
      </div>
      {validationError && <div className="validation-error">{validationError}</div>}
    </form>
  );
};

export default AddTaskForm;
