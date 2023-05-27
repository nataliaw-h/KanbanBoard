import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './styles/KanbanBoard.css';
import AddTaskForm from './AddTaskForm';
import EditTaskForm from './EditTaskForm';
import { FaStar } from 'react-icons/fa';

const KanbanBoard = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const fetchProject = async () => {
    const projectDoc = doc(db, 'projects', projectId);
    const projectSnapshot = await getDoc(projectDoc);
    if (projectSnapshot.exists()) {
      setProject({ id: projectSnapshot.id, ...projectSnapshot.data() });
    } else {
      console.log('No such document!');
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    // Make a copy of project's columns and ensure items is always an array
    const newColumns = project.columns.map((column) => ({
      ...column,
      items: Array.isArray(column.items) ? [...column.items] : [],
    }));

    // Find source and destination column indexes
    const srcIndex = newColumns.findIndex((col) => col.id === source.droppableId);
    const destIndex = newColumns.findIndex((col) => col.id === destination.droppableId);

    // Remove the dragged item from source column items
    const [removed] = newColumns[srcIndex].items.splice(source.index, 1);
    // Add the dragged item to destination column items
    newColumns[destIndex].items.splice(destination.index, 0, removed);

    // Update project's columns in state and Firestore
    setProject((prevProject) => ({ ...prevProject, columns: newColumns }));
    await updateDoc(doc(db, 'projects', projectId), {
      columns: newColumns,
    });

    // Fetch the project again to update the local state
    fetchProject();
  };

  const handleAddTask = async (columnId, taskDetails) => {
    const newTask = {
      id: `task-${Date.now()}`,
      name: taskDetails.name,
      description: taskDetails.description,
      priority: taskDetails.priority,
      expirationDate: taskDetails.expirationDate,
    };

    // Update the local state
    await setProject((prevProject) => {
      const updatedColumns = prevProject.columns.map((column) => {
        if (column.id === columnId) {
          const items = Array.isArray(column.items) ? column.items : [];
          return {
            ...column,
            items: [...items, newTask],
          };
        } else {
          return column;
        }
      });

      return { ...prevProject, columns: updatedColumns };
    });

    // Update Firestore
    const projectDoc = doc(db, 'projects', projectId);
    await updateDoc(projectDoc, project);
  };

  const handleEditTask = (taskId) => {
    if (editingTaskId === taskId) {
      // Clicked on the same task again, toggle form visibility
      setEditingTaskId(null);
    } else {
      setEditingTaskId(taskId);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    // Update the task in the project's columns
    const updatedColumns = project.columns.map((column) => {
      const updatedItems = column.items.map((item) => {
        if (item.id === updatedTask.id) {
          return updatedTask;
        }
        return item;
      });

      return { ...column, items: updatedItems };
    });

    // Update the project in state and Firestore
    setProject((prevProject) => ({ ...prevProject, columns: updatedColumns }));
    await updateDoc(doc(db, 'projects', projectId), { columns: updatedColumns });

    setEditingTaskId(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  const handleDeleteTask = async (taskId) => {
    // Remove the task from the project's columns
    const updatedColumns = project.columns.map((column) => {
      const updatedItems = column.items.filter((item) => item.id !== taskId);
      return { ...column, items: updatedItems };
    });

    // Update the project in state and Firestore
    setProject((prevProject) => ({ ...prevProject, columns: updatedColumns }));
    await updateDoc(doc(db, 'projects', projectId), { columns: updatedColumns });
  };

  const isTaskNearDueDate = (task) => {
    const currentDate = new Date();
    const expirationDate = new Date(task.expirationDate);
    const timeDifference = expirationDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference <= 7;
  };

  const isTaskPastDueDate = (task) => {
    const currentDate = new Date();
    const expirationDate = new Date(task.expirationDate);
    return expirationDate < currentDate;
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="kanban-board">
        {project.columns &&
          project.columns.map((column, columnIndex) => (
            <div key={columnIndex} className="kanban-column">
              <h3 className="kanban-column-title">{column.name}</h3>
              <AddTaskForm columnId={column.id} onAdd={handleAddTask} />
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <ul className="tasks" {...provided.droppableProps} ref={provided.innerRef}>
                    {column.items &&
                      column.items.map((item, itemIndex) => {
                        const isNearDueDate = isTaskNearDueDate(item);
                        const isPastDueDate = isTaskPastDueDate(item);
                        const taskClass = `task${isNearDueDate ? ' task-near-due-date' : ''}${
                          isPastDueDate ? ' task-past-due-date' : ''
                        }`;

                        return (
                          <Draggable key={item.id} draggableId={item.id} index={itemIndex}>
                            {(provided) => (
                              <li
                                className={taskClass}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {editingTaskId === item.id ? (
                                  <EditTaskForm
                                    task={item}
                                    onUpdate={handleUpdateTask}
                                    onCancel={handleCancelEdit}
                                  />
                                ) : (
                                  <>
                                    <div className="task-name">{item.name}</div>
                                    <div className="task-description">{item.description}</div>
                                    <div className="task-stars">
                                      {Array.from({ length: item.priority }).map((_, index) => (
                                        <FaStar key={index} className="task-star" />
                                      ))}
                                    </div>
                                    <div className="task-expiration-date">
                                      {item.expirationDate}
                                    </div>
                                    <div className="task-buttons">
                                      <button
                                        className="update-task-button"
                                        onClick={() => handleEditTask(item.id)}
                                      >
                                        Edit
                                      </button>
                                      <button
                                        className="delete-task-button"
                                        onClick={() => handleDeleteTask(item.id)}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </>
                                )}
                              </li>
                            )}
                          </Draggable>
                        );
                      })}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </div>
          ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
