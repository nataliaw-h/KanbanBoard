import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import './styles/KanbanBoard.css';

const KanbanBoard = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const projectDoc = doc(db, 'projects', projectId);
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

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = project.columns.find(
        (col) => col.id === source.droppableId
      );
      const destColumn = project.columns.find(
        (col) => col.id === destination.droppableId
      );
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setProject({
        ...project,
        columns: project.columns.map((col) => {
          if (col.id === source.droppableId) {
            return {
              ...col,
              items: sourceItems,
            };
          } else if (col.id === destination.droppableId) {
            return {
              ...col,
              items: destItems,
            };
          } else {
            return col;
          }
        }),
      });

      // Update Firestore with new column state
      const projectDoc = doc(db, 'projects', projectId);
      await setDoc(projectDoc, project);
    } else {
      const column = project.columns.find(
        (col) => col.id === source.droppableId
      );
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setProject({
        ...project,
        columns: project.columns.map((col) => {
          if (col.id === source.droppableId) {
            return {
              ...col,
              items: copiedItems,
            };
          } else {
            return col;
          }
        }),
      });

      // Update Firestore with new column state
      const projectDoc = doc(db, 'projects', projectId);
      await setDoc(projectDoc, project);
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="kanban-board">
        {project.columns && project.columns.map((column, index) => (
          <div key={index} className="kanban-column">
            <h3>{column.name}</h3>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <ul
                  className="tasks"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {column.items && column.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {item.content}
                        </li>
                      )}
                    </Draggable>
                  ))}
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