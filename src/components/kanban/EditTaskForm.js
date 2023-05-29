import React from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EditTaskForm = ({ task, onUpdate, onCancel }) => {
  const validationSchema = Yup.object().shape({
    taskName: Yup.string().required('Task name is required.'),
    taskDescription: Yup.string().required('Task description is required.'),
    taskExpirationDate: Yup.string().required('Task expiration date is required.'),
  });

  const handleSubmit = (values) => {
    onUpdate({
      ...task,
      name: values.taskName,
      description: values.taskDescription,
      priority: values.taskPriority,
      expirationDate: values.taskExpirationDate,
    });
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= task.priority) {
        stars.push(<FaStar key={i} className="star" />);
      } else {
        stars.push(<FaRegStar key={i} className="star" />);
      }
    }
    return stars;
  };

  return (
    <Formik
      initialValues={{
        taskName: task.name,
        taskDescription: task.description,
        taskPriority: task.priority,
        taskExpirationDate: task.expirationDate,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="edit-task-form">
        <Field
          className="input-field"
          type="text"
          name="taskName"
          placeholder="Enter task name"
          maxLength="100"
        />
        <ErrorMessage name="taskName" component="div" className="validation-error" />

        <Field
          className="input-field"
          component="textarea"
          name="taskDescription"
          placeholder="Enter task description"
          maxLength="500"
          rows="4"
        />
        <ErrorMessage name="taskDescription" component="div" className="validation-error" />

        <Field
          className="input-field"
          type="date"
          name="taskExpirationDate"
          placeholder="Enter task expiration date"
        />
        <ErrorMessage
          name="taskExpirationDate"
          component="div"
          className="validation-error"
        />

        <div className="stars">{renderStars()}</div>

        <div className="button-container">
          <button type="submit" className="update-task-button">
            Update Task
          </button>
          <button type="button" className="cancel-task-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default EditTaskForm;
