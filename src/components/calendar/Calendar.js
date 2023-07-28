import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { auth, db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/en-gb';
import 'moment/locale/pl';
import './styles/calendar.css';

const localizer = momentLocalizer(moment);

const TaskCalendar = () => {
  const { t, i18n } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [calendarKey, setCalendarKey] = useState(Date.now());

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

  useEffect(() => {
    if (i18n.language === 'pl') {
      moment.locale('pl');
    } else {
      moment.locale('en-gb');
    }
    setCalendarKey(Date.now());
  }, [i18n.language]);

  return (
      <div className="calendar">
        <Calendar
          key={calendarKey}
          localizer={localizer}
          events={tasks}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          views={['month']}
          defaultView="month"
          messages={{
            next: t('calendar.next'),
            previous: t('calendar.previous'),
            today: t('calendar.today'),
            month: t('calendar.month'),
            week: t('calendar.week'),
            day: t('calendar.day'),
            agenda: t('calendar.agenda'),
            date: t('calendar.date'),
            time: t('calendar.time'),
            event: t('calendar.event'),
            noEventsInRange: t('calendar.noEventsInRange'),
            showMore: (count) => t('calendar.showMore', { count }),
          }}
        />
      </div>
  );
};

export default TaskCalendar;
