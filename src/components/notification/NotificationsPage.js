import React, { useReducer, useCallback, useMemo, useLayoutEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { withTranslation } from 'react-i18next';

const ACTIONS = {
  SET_TASKS: 'set-tasks', // Akcja do ustawienia listy zadań
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_TASKS:
      return { ...state, tasks: action.payload }; // Aktualizacja stanu o nową listę zadań
    default:
      return state;
  }
};

const NotificationsPage = ({ t }) => {
  const initialState = { tasks: [] }; // Początkowy stan zawierający pustą listę zadań
  const [state, dispatch] = useReducer(reducer, initialState); // Użycie reducera do zarządzania stanem
  const [filter, setFilter] = useState('all'); // Stan do przechowywania wybranego filtra

  const fetchTasks = useCallback(() => {
    let unsubscribe;
    const tasksCollection = collection(db, `users/${auth.currentUser.uid}/projects`); // Referencja do kolekcji zadań użytkownika
    unsubscribe = onSnapshot(tasksCollection, (snapshot) => { // Subskrypcja zmian w wynikach zapytania do bazy danych
      const tasksData = [];
      snapshot.forEach((doc) => {
        const projectData = doc.data();
        if (projectData.columns) {
          projectData.columns.forEach((column) => {
            if (column.items) {
              column.items.forEach((item) => {
                tasksData.push(item); // Dodanie poszczególnych zadań do tasksData
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
        return { ...task, daysDifference, isExpired }; // Dodanie informacji o dniach różnicy i czy zadanie jest przeterminowane
      });

      filteredTasks.sort((a, b) => a.daysDifference - b.daysDifference); // Sortowanie zadań według różnicy dni

      dispatch({ type: ACTIONS.SET_TASKS, payload: filteredTasks }); // Wywołanie akcji SET_TASKS z zaktualizowaną listą zadań
    });
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    let unsubscribe;

    if (auth.currentUser) {
      unsubscribe = fetchTasks(); // Wywołanie funkcji fetchTasks przy renderowaniu komponentu lub zmianie użytkownika
    }

    return () => {
      if (unsubscribe) {
        unsubscribe(); // Odsubskrybowanie zmian przy zniszczeniu komponentu
      }
    };
  }, [fetchTasks]);

  const taskElements = useMemo(() => {
    const filteredTasks = state.tasks.filter((task) => {
      if (filter === 'expired') return task.isExpired; // Filtrowanie przeterminowanych zadań
      if (filter === 'upcoming') return !task.isExpired && task.daysDifference <= 7; // Filtrowanie zbliżających się zadań (do 7 dni)
      return true;
    });

    return filteredTasks.map((task) => {
      const taskMessage = task.isExpired
        ? t('notificationsPage.expired', { days: Math.abs(task.daysDifference) }) // Wiadomość dla przeterminowanych zadań
        : t('notificationsPage.left', { days: task.daysDifference }); // Wiadomość dla zbliżających się zadań
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
            onChange={() => setFilter('all')} // Zmiana filtra na 'all'
          />
          {t('notificationsPage.allTasks')}
        </label>
        <label>
          <input
            type="radio"
            value="upcoming"
            checked={filter === 'upcoming'}
            onChange={() => setFilter('upcoming')} // Zmiana filtra na 'upcoming'
          />
          {t('notificationsPage.upcomingTasks')}
        </label>
        <label>
          <input
            type="radio"
            value="expired"
            checked={filter === 'expired'}
            onChange={() => setFilter('expired')} // Zmiana filtra na 'expired'
          />
          {t('notificationsPage.expiredTasks')}
        </label>
      </div>
      <ul className="space-y-2">{taskElements}</ul>
    </div>
  );
};

export default withTranslation()(NotificationsPage);
