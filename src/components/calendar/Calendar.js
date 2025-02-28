'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function Calendar() {
    return (
        <div className="w-full h-full p-5">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                editable={true}
                height="100%"
                selectable={true}
                events={[
                    { title: 'Event 1', start: '2025-03-01' },
                    { title: 'Event 2', start: '2025-03-05' },
                ]}
                dateClick={(info) => alert(`Clicked on: ${info.dateStr}`)}
            />
        </div>
    );
}
