import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import UserRegistrationForm from './components/auth/UserRegistrationForm';
import UserLoginForm from './components/auth/UserLoginForm';
import LogoutButton from './components/auth/LogoutButton';
import Calendar from './components/calendar/Calendar';
import ProjectList from './components/projects/ProjectList';
import AddProjectForm from './components/projects/AddProjectForm';
import EditProjectForm from './components/projects/EditProjectForm';
import Home from './components/common/Home';
import KanbanBoard from './components/kanban/KanbanBoard';
import NotificationsPage from './components/notification/NotificationsPage';
import { auth, db } from './firebase';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setEmail(user.email || '');
      } else {
        setIsLoggedIn(false);
        setEmail('');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setProjects([]);
      setTasks([]);
      setNotifications([]);
      return;
    }

    const projectsCollection = collection(db, `users/${auth.currentUser.uid}/projects`);
    const projectsQuery = query(projectsCollection, orderBy('createdAt'));

    const unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
      const projectsData = [];
      snapshot.forEach((doc) => {
        projectsData.push({ id: doc.id, ...doc.data() });
      });
      setProjects(projectsData);
    });

    const tasksCollection = collection(db, `users/${auth.currentUser.uid}/tasks`);
    const tasksQuery = query(tasksCollection, orderBy('expirationDate'));

    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = [];
      snapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksData);
    });

    const notificationsCollection = collection(db, `users/${auth.currentUser.uid}/notifications`);
    const notificationsQuery = query(notificationsCollection);

    const unsubscribeNotifications = onSnapshot(notificationsQuery, (snapshot) => {
      const notificationsData = [];
      snapshot.forEach((doc) => {
        notificationsData.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(notificationsData);
    });

    return () => {
      unsubscribeProjects();
      unsubscribeTasks();
      unsubscribeNotifications();
    };
  }, [isLoggedIn]);

  const handleAddProject = async (newProject) => {
    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/projects`), {
        ...newProject,
        createdAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteDoc(doc(db, `users/${auth.currentUser.uid}/projects`, projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleEditProject = async (updatedProject) => {
    try {
      await updateDoc(doc(db, `users/${auth.currentUser.uid}/projects`, updatedProject.id), updatedProject);
    } catch (error) {
      console.error('Error editing project:', error);
    }
  };

  return (
    <div className="app-container">
      <Header isLoggedIn={isLoggedIn} email={email} onLogout={() => signOut(auth)} />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <UserRegistrationForm />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <UserLoginForm />} />
          <Route path="/logout" element={isLoggedIn ? <LogoutButton /> : <Navigate to="/" />} />
          <Route
            path="/projects"
            element={isLoggedIn ? <ProjectList projects={projects} onDeleteProject={handleDeleteProject} /> : <Navigate to="/login" />}
          />
          <Route
            path="/projects/add"
            element={isLoggedIn ? <AddProjectForm onAddProject={handleAddProject} /> : <Navigate to="/login" />}
          />
          <Route
          path="/projects/:projectId/edit"
          element={
          isLoggedIn ? (
          <EditProjectForm onEditProject={handleEditProject} />
          ) : (
          <Navigate to="/login" />
          )
          }
          />
          <Route
            path="/projects/:projectId"
            element={isLoggedIn ? <KanbanBoard /> : <Navigate to="/login" />}
          />
          <Route
            path="/calendar"
            element={isLoggedIn ? <Calendar tasks={tasks} /> : <Navigate to="/login" />}
          />
          <Route
            path="/notifications"
            element={isLoggedIn ? <NotificationsPage notifications={notifications} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
