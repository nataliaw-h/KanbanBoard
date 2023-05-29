import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { auth, db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const TaskCalendar = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const projectCollection = collection(db, `users/${auth.currentUser.uid}/projects`);
      const projectSnapshot = await getDocs(projectCollection);

      let allTasks = [];
      projectSnapshot.docs.forEach((doc) => {
        const projectData = doc.data();
        if (projectData.columns) {
          projectData.columns.forEach((column) => {
            if (column.items) {
              column.items.forEach((item) => {
                const date = moment(item.expirationDate, 'YYYY-MM-DD');
                allTasks.push({
                  id: item.id,
                  title: item.name,
                  start: date.toDate(),
                  end: date.toDate(),
                });
              });
            }
          });
        }
      });

      setTasks(allTasks);
    };

    fetchTasks();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-blue-200">
      <div className="w-1/2 p-4 rounded-lg bg-blue-400">
        <Calendar
          localizer={localizer}
          events={tasks}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          views={['month']}
          defaultView="month"
        />
      </div>
    </div>
  );
};

export default TaskCalendar;
