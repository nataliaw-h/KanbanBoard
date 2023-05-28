import React, { useRef, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import './styles/KanbanBoard.css';
import AddTaskForm from './AddTaskForm';
import EditTaskForm from './EditTaskForm';
import { FaStar } from 'react-icons/fa';

const KanbanBoard = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const fetchProject = async () => {
    const projectDoc = doc(db, `users/${auth.currentUser.uid}/projects`, projectId);
    const projectSnapshot = await getDoc(projectDoc);
    if (projectSnapshot.exists()) {
      setProject({ id: projectSnapshot.id, ...projectSnapshot.data() });
    } else {
      console.log('No such document!');
    }
  };
  

  useEffect(() => {
    const fetchProject = async () => {
      const projectDoc = doc(db, `users/${auth.currentUser.uid}/projects`, projectId);
      const projectSnapshot = await getDoc(projectDoc);
      if (projectSnapshot.exists()) {
        setProject({ id: projectSnapshot.id, ...projectSnapshot.data() });
      } else {
        console.log('No such document!');
      }
    };
    fetchProject();
}, [projectId]);


const handleOnDragEnd = async (result) => {
  if (!result.destination) return;
  const { source, destination } = result;

  const newColumns = project.columns.map((column) => ({
    ...column,
    items: Array.isArray(column.items) ? [...column.items] : [],
  }));

  const srcIndex = newColumns.findIndex((col) => col.id === source.droppableId);
  const destIndex = newColumns.findIndex((col) => col.id === destination.droppableId);

  const [removed] = newColumns[srcIndex].items.splice(source.index, 1);
  newColumns[destIndex].items.splice(destination.index, 0, removed);

  setProject((prevProject) => ({ ...prevProject, columns: newColumns }));

  await updateDoc(doc(db, `users/${auth.currentUser.uid}/projects`, projectId), {
    columns: newColumns,
  });

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

    setProject((prevProject) => {
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

    const updatedProject = {
      ...project,
      columns: project.columns.map(column => {
        if (column.id === columnId) {
          return { ...column, items: [...(column.items || []), newTask] };
        } else {
          return column;
        }
      })
    };

    const projectDoc = doc(db, `users/${auth.currentUser.uid}/projects`, projectId);
    await updateDoc(projectDoc, updatedProject);
  };

  const handleEditTask = (taskId) => {
    if (editingTaskId === taskId) {
      setEditingTaskId(null);
    } else {
      setEditingTaskId(taskId);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    const updatedColumns = project.columns.map((column) => {
      const updatedItems = column.items.map((item) => {
        if (item.id === updatedTask.id) {
          return updatedTask;
        }
        return item;
      });

      return { ...column, items: updatedItems };
    });

    setProject((prevProject) => ({ ...prevProject, columns: updatedColumns }));
    await updateDoc(doc(db, `users/${auth.currentUser.uid}/projects`, projectId), { columns: updatedColumns });

    setEditingTaskId(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  const handleDeleteTask = async (taskId) => {
    const updatedColumns = project.columns.map((column) => {
      const updatedItems = column.items.filter((item) => item.id !== taskId);
      return { ...column, items: updatedItems };
    });

    setProject((prevProject) => ({ ...prevProject, columns: updatedColumns }));
    await updateDoc(doc(db, `users/${auth.currentUser.uid}/projects`, projectId), { columns: updatedColumns });
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

  const fileInputRef = useRef();

  const handleExportData = async () => {
    const dataStr = JSON.stringify(project);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'data.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportData = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = JSON.parse(e.target.result);
      // update the data to Firestore
      const projectDoc = doc(db, `users/${auth.currentUser.uid}/projects`, projectId);
      await updateDoc(projectDoc, data);
      fetchProject();
    };
    reader.readAsText(file);
    fileInputRef.current.value = '';
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
                                    <div className="button-container">
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
      <div className="button-container">
        <button className="json-button" onClick={handleExportData}>Export Data</button>
        <input type="file" accept=".json" onChange={handleImportData} ref={fileInputRef} style={{display: 'none'}} />
        <button className="json-button" onClick={() => fileInputRef.current.click()}>Import Data</button>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;