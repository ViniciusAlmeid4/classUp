'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState } from 'react';

export default function Calendar() {
    const [events, setEvents] = useState([
        {
            title: 'teste 1',
            start: '2025-03-04',
            classNames: ['event-primary-block'],
        },
        {
            title: 'teste 2',
            start: '2025-03-14',
            end: '2025-03-16',
            classNames: ['event-primary-block'],
        },
    ]);

    async function selectInCalendar(info) {
        const title = prompt('Titulo');
        if (title) {
            setEvents([
                ...events,
                {
                    title: title,
                    start: info.startStr,
                    end: info.endStr,
                    display: 'list-item',
                    classNames: ['event-primary-list'],
                },
            ]);
        }
    }

    function clickInEvent(info) {
        alert(`Evento: ${info.event.title}
Começa: ${info.event.startStr}
Termina: ${info.event.endStr}`);
    }

    return (
        <div className="w-full h-full p-5">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                editable={true}
                height="100%"
                selectable={true}
                events={events}
                select={selectInCalendar}
                eventClick={clickInEvent}
                dayMaxEvents={1}
                fixedWeekCount={true}
            />
        </div>
    );
}
