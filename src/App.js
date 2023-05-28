// App.js
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
import { auth, db } from './firebase';
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
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
    const projectsCollection = collection(db, 'projects');
    const projectsQuery = query(projectsCollection, orderBy('createdAt'));

    const unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
      const projectsData = [];
      snapshot.forEach((doc) => {
        projectsData.push({ id: doc.id, ...doc.data() });
      });
      setProjects(projectsData);
    });

    return () => {
      unsubscribeProjects();
    };
  }, []);

  useEffect(() => {
    const tasksCollection = collection(db, 'tasks');
    const tasksQuery = query(tasksCollection, orderBy('expirationDate'));

    const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = [];
      snapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksData);
    });

    return () => {
      unsubscribeTasks();
    };
  }, []);

  const handleAddProject = async (newProject) => {
    try {
      await addDoc(collection(db, 'projects'), {
        ...newProject,
        createdAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleEditProject = async (updatedProject) => {
    try {
      await updateDoc(doc(db, 'projects', updatedProject.id), updatedProject);
    } catch (error) {
      console.error('Error editing project:', error);
    }
  };

  return (
    <div className="app-container">
      <Header isLoggedIn={isLoggedIn} email={email} onLogout={() => auth.signOut()} />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<UserRegistrationForm />} />
          <Route path="/login" element={<UserLoginForm />} />
          <Route path="/logout" element={<LogoutButton />} />
          <Route
            path="/projects"
            element={<ProjectList projects={projects} onDeleteProject={handleDeleteProject} />}
          />
          <Route path="/projects/add" element={<AddProjectForm onAddProject={handleAddProject} />} />
          <Route path="/projects/:projectId/edit" element={<EditProjectForm onEditProject={handleEditProject} />} />
          <Route path="/projects/:projectId" element={<KanbanBoard />} />
          <Route path="/calendar" element={<Calendar tasks={tasks} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
