import React, { useReducer, useCallback, useMemo, useLayoutEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { withTranslation } from 'react-i18next';

const ACTIONS = {
  SET_TASKS: 'set-tasks',
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_TASKS:
      return { ...state, tasks: action.payload };
    default:
      return state;
  }
};

const NotificationsPage = ({ t }) => {
  const initialState = { tasks: [] };
  const [state, dispatch] = useReducer(reducer, initialState);
  const [filter, setFilter] = useState('all');

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

      filteredTasks.sort((a, b) => a.daysDifference - b.daysDifference);

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
        ? t('notificationsPage.expired', { days: Math.abs(task.daysDifference) })
        : t('notificationsPage.left', { days: task.daysDifference });
      const className = task.isExpired ? "bg-red-500 rounded-md p-3 shadow-md" : "bg-blue-500 rounded-md p-3 shadow-md";
      return (
        <li key={task.id} className={className}>
          <span className="text-white font-medium">{task.name}</span>
          <span className="text-white ml-2">({taskMessage})</span>
        </li>
      );
    });
  }, [state.tasks, filter, t]);

  if (!state.tasks.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">{t('notificationsPage.loading')}</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-500">{t('notificationsPage.title')}</h1>
      <div className="flex justify-around mb-4">
        <label>
          <input
            type="radio"
            value="all"
            checked={filter === 'all'}
            onChange={() => setFilter('all')}
          />
          {t('notificationsPage.allTasks')}
        </label>
        <label>
          <input
            type="radio"
            value="upcoming"
            checked={filter === 'upcoming'}
            onChange={() => setFilter('upcoming')}
          />
          {t('notificationsPage.upcomingTasks')}
        </label>
        <label>
          <input
            type="radio"
            value="expired"
            checked={filter === 'expired'}
            onChange={() => setFilter('expired')}
          />
          {t('notificationsPage.expiredTasks')}
        </label>
      </div>
      <ul className="space-y-2">{taskElements}</ul>
    </div>
  );
};

export default withTranslation()(NotificationsPage);
