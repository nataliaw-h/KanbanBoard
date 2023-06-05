import React, { useState } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

const EditTaskForm = ({ task, onUpdate, onCancel }) => {
  const { t } = useTranslation();
  const [taskPriority, setTaskPriority] = useState(task.priority);

  const validationSchema = Yup.object().shape({
    taskName: Yup.string().required(t('editTaskForm.taskNameRequired')),
    taskDescription: Yup.string().required(t('editTaskForm.taskDescriptionRequired')),
    taskExpirationDate: Yup.string().required(t('editTaskForm.taskExpirationDateRequired')),
  });

  const handleSubmit = (values) => {
    onUpdate({
      ...task,
      name: values.taskName,
      description: values.taskDescription,
      priority: taskPriority,
      expirationDate: values.taskExpirationDate,
    });
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
          placeholder={t('editTaskForm.enterTaskName')}
          maxLength="100"
        />
        <ErrorMessage name="taskName" component="div" className="validation-error" />

        <Field
          className="input-field"
          component="textarea"
          name="taskDescription"
          placeholder={t('editTaskForm.enterTaskDescription')}
          maxLength="500"
          rows="4"
        />
        <ErrorMessage name="taskDescription" component="div" className="validation-error" />

        <Field
          className="input-field"
          type="date"
          name="taskExpirationDate"
          placeholder={t('editTaskForm.enterExpirationDate')}
        />
        <ErrorMessage
          name="taskExpirationDate"
          component="div"
          className="validation-error"
        />

        <div className="stars">{renderStars()}</div>

        <div className="button-container">
          <button type="submit" className="update-task-button">
            {t('editTaskForm.updateTaskButton')}
          </button>
          <button type="button" className="cancel-task-button" onClick={onCancel}>
            {t('editTaskForm.cancelButton')}
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default EditTaskForm;
