import React, { createContext, useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setProjects([]);
      setLoading(false);
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
      setLoading(false);
    });
  
    return () => {
      unsubscribeProjects();
    };
  }, [auth.currentUser]);
  
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
    <ProjectContext.Provider value={{ projects, handleAddProject, handleDeleteProject, handleEditProject, loading }}>
      {children}
    </ProjectContext.Provider>
  );
};
