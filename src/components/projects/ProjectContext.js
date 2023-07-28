import React, { createContext, useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]); // Stan przechowujący projekty
  const [loading, setLoading] = useState(true); // Stan określający, czy dane są ładowane

  useEffect(() => {
    if (!auth.currentUser) { // Sprawdzenie, czy użytkownik jest zalogowany
      setProjects([]); // Resetowanie stanu projektów
      setLoading(false); // Ustawienie loading na false
      return;
    }
  
    const projectsCollection = collection(db, `users/${auth.currentUser.uid}/projects`); // Referencja do kolekcji projektów użytkownika
    const projectsQuery = query(projectsCollection, orderBy('createdAt')); // Zapytanie do bazy danych o projekty posortowane według pola createdAt
  
    const unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => { // Subskrypcja zmian w wynikach zapytania do bazy danych
      const projectsData = [];
      snapshot.forEach((doc) => {
        projectsData.push({ id: doc.id, ...doc.data() }); // Przekształcenie dokumentów na obiekty JavaScript i zapisanie ich w projectsData
      });
      setProjects(projectsData); // Aktualizacja stanu projects
      setLoading(false); // Ustawienie loading na false po pobraniu danych
    });
  
    return () => {
      unsubscribeProjects(); // Odsubskrybowanie zmian w wynikach zapytania po zakończeniu używania komponentu
    };
  }, [auth.currentUser]);
  
  const handleAddProject = async (newProject) => { // Obsługa dodawania nowego projektu
    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/projects`), {
        ...newProject,
        createdAt: Timestamp.fromDate(new Date()), // Ustawienie pola createdAt na aktualną datę i czas
      });
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleDeleteProject = async (projectId) => { // Obsługa usuwania projektu
    try {
      await deleteDoc(doc(db, `users/${auth.currentUser.uid}/projects`, projectId)); // Usunięcie dokumentu na podstawie jego ID
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleEditProject = async (updatedProject) => { // Obsługa edycji projektu
    try {
      await updateDoc(doc(db, `users/${auth.currentUser.uid}/projects`, updatedProject.id), updatedProject); // Aktualizacja dokumentu na podstawie jego ID
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
