import React, { useReducer, useCallback, useMemo, useLayoutEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase';

// Define the actions.
const ACTIONS = {
  SET_TASKS: 'set-tasks',
};

// Define the reducer function.
const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_TASKS:
      return { ...state, tasks: action.payload };
    default:
      return state;
  }
};

const NotificationsPage = () => {
  const initialState = { tasks: [] };
  const [state, dispatch] = useReducer(reducer, initialState);
  const [filter, setFilter] = useState('all'); // The filter state.

  const fetchTasks = useCallback(() => {
    let unsubscribe;
    const tasksCollection = collection(db, `users/${auth.currentUser.uid}/projects`);
    unsubscribe = onSnapshot(tasksCollection, (snapshot) => {
      const tasksData = [];
      snapshot.forEach((doc) => {
        const projectData = doc.data();
        if (projectData.columns) {
          projectData.columns.forEach((column) => {
            if (column.items) {
              column.items.forEach((item) => {
                tasksData.push(item);
              });
            }
          });
        }
      });

      const filteredTasks = tasksData.map((task) => {
        const currentDate = new Date();
        const expirationDate = new Date(task.expirationDate);
        const timeDifference = expirationDate.getTime() - currentDate.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        const isExpired = daysDifference < 0;
        return { ...task, daysDifference, isExpired };
      });

      // Sort tasks by daysDifference in ascending order
      filteredTasks.sort((a, b) => a.daysDifference - b.daysDifference);

      // Dispatch action to set tasks.
      dispatch({ type: ACTIONS.SET_TASKS, payload: filteredTasks });
    });
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    let unsubscribe;

    if (auth.currentUser) {
      unsubscribe = fetchTasks();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [fetchTasks]);

  const taskElements = useMemo(() => {
    const filteredTasks = state.tasks.filter((task) => {
      if (filter === 'expired') return task.isExpired;
      if (filter === 'upcoming') return !task.isExpired && task.daysDifference <= 7;
      return true;
    });

    return filteredTasks.map((task) => {
      const taskMessage = task.isExpired
        ? `Expired ${Math.abs(task.daysDifference)} days ago`
        : `${task.daysDifference} days left`;
      return (
        <li key={task.id} className={task.isExpired ? "bg-red-500 rounded-md p-3 shadow-md" : "bg-blue-500 rounded-md p-3 shadow-md"}>
          <span className="text-white font-medium">{task.name}</span>
          <span className="text-white ml-2">({taskMessage})</span>
        </li>
      );
    });
  }, [state.tasks, filter]);

  if (!state.tasks.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-500">Notifications</h1>
      <div className="flex justify-around mb-4">
        <label>
          <input
            type="radio"
            value="all"
            checked={filter === 'all'}
            onChange={() => setFilter('all')}
          />
          All tasks
        </label>
        <label>
          <input
            type="radio"
            value="upcoming"
            checked={filter === 'upcoming'}
            onChange={() => setFilter('upcoming')}
          />
          Upcoming tasks
        </label>
        <label>
          <input
            type="radio"
            value="expired"
            checked={filter === 'expired'}
            onChange={() => setFilter('expired')}
          />
          Expired tasks
        </label>
      </div>
      <ul className="space-y-2">{taskElements}</ul>
    </div>
  );
};

export default NotificationsPage;
