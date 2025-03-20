'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import brLocale from '@fullcalendar/core/locales/pt-br';
import { useState, useRef, useEffect } from 'react';
import './calendar.css';

export default function Calendar() {
    const [events, setEvents] = useState([
        {
            id: 1,
            title: 'teste 1',
            start: '2025-03-04',
            classNames: ['event-primary-block'],
            display: 'block',
        },
        {
            id: 2,
            title: 'teste 2',
            start: '2025-03-14',
            end: '2025-03-16',
            classNames: ['event-primary-block'],
            display: 'block',
        },
    ]);
    // ---- Modal variables
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalType, setModalType] = useState('');

    // ---- Event variables
    let newEventId = useRef(3);
    const [eventId, setEventId] = useState('');
    const [eventTitle, setEventTitle] = useState('');
    const [eventType, setEventType] = useState('block');
    const [eventAllDay, setEventAllDay] = useState('');
    const [eventStart, setEventStart] = useState('');
    const [eventEnd, setEventEnd] = useState('');

    useEffect(() => {
        Modal.setAppElement('#calendar-element');
    }, []);

    function closeModal() {
        setModalIsOpen(false);
        setEventTitle('');
        setEventStart('');
        setEventEnd('');
    }

    function createEvent() {
        setModalIsOpen(false);

        const newEvent = {
            id: newEventId.current, // Use `.current`
            title: eventTitle,
            start: eventStart,
            allDay: eventAllDay || false,
            classNames: [`event-primary-${eventType}`],
            display: eventType || 'block', // Default to "block"
        };

        if (eventEnd) {
            newEvent.end = eventEnd;
        }

        if (events) {
            setEvents([newEvent, ...events]);
        } else {
            setEvents([newEvent]);
        }

        newEventId.current++; // Increment ref correctly
    }

    function updateEvent() {
        setEvents(
            events.map((event) =>
                event.id == eventId
                    ? {
                          ...event,
                          title: eventTitle,
                          start: eventStart,
                          allDay: eventAllDay,
                          display: eventType,
                          end: eventEnd,
                      }
                    : event
            )
        );
        console.log(events);
        
        setModalIsOpen(false);
    }

    function deleteEvent() {
        setEvents(events.filter((event) => event.id != eventId));
        setModalIsOpen(false);
    }

    /**
     *
     * @param {Date object} date
     * @returns string (formated as 'YYYY-MM-DDTHH:mm')
     */
    function formatDate(date) {
        return date.toISOString().slice(0, 16);
    }

    return (
        <div className="w-full h-full p-5 flex flex-col" id="calendar-element">
            <FullCalendar
                timeZone="UTC"
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                editable={true}
                height="100%"
                selectable={true}
                events={events}
                eventTimeFormat= {{ // like '14:30
                    hour: '2-digit',
                    minute: '2-digit',
                    // meridiem: false
                }}
                select={(info) => {
                    setModalIsOpen(true);
                    setModalTitle('Criar evento');
                    setEventTitle('');
                    setEventStart(formatDate(info.start));
                    info.end.setDate(info.end.getDate() - 1);
                    setEventEnd(formatDate(info.end));
                    setModalType('add');
                }}
                dateClick={(info) => {
                    setModalIsOpen(true);
                    setModalTitle('Criar evento');
                    setEventTitle('');
                    setEventStart(formatDate(info.date));
                    setEventEnd(formatDate(info.date));
                    setModalType('add');
                }}
                eventClick={(info) => {
                    setModalTitle('Atualizar evento');
                    setModalType('update');
                    setEventId(info.event.id);
                    setEventTitle(info.event.title);
                    setEventStart(formatDate(info.event.start));
                    if (info.event.end) {
                        setEventEnd(formatDate(info.event.end));
                    }
                    setEventAllDay(info.event.allDay);
                    setEventType(info.event.display);
                    setModalIsOpen(true);
                }}
                dayMaxEvents={1}
                fixedWeekCount={true}
                customButtons={{
                    openModalButton: {
                        text: 'Adicionar evento',
                        click: () => {
                            setModalIsOpen(true);
                            setModalTitle('Criar evento');
                            setModalType('add');
                        },
                    },
                }}
                locale={brLocale}
                navLinks="true"
                headerToolbar={{
                    left: 'today openModalButton', // Place the button in the header
                    center: 'title',
                    right: 'prev,next dayGridMonth,timeGridDay',
                }}
            />
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                className="calendar-modal-content"
                overlayClassName="calendar-modal-overlay"
            >
                <h2 className="text-base/7 font-semibold">{modalTitle}</h2>

                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-12 h-fit">
                    <div className="sm:col-span-12">
                        <label htmlFor="event-title" className="block text-sm/6 font-medium">
                            Título
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="event-title"
                                id="event-title"
                                className="input-primary"
                                value={eventTitle}
                                onChange={(e) => {
                                    setEventTitle(e.target.value);
                                }}
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label htmlFor="event-start" className="block text-sm/6 font-medium">
                            Data de início
                        </label>
                        <div className="mt-2">
                            <input
                                type="datetime-local"
                                name="event-start"
                                id="event-start"
                                className="input-primary"
                                value={eventStart}
                                onChange={(e) => {
                                    setEventStart(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-6">
                        <label htmlFor="event-end" className="block text-sm/6 font-medium">
                            Data final
                        </label>
                        <div className="mt-2">
                            <input
                                type="datetime-local"
                                name="event-end"
                                id="event-end"
                                className="input-primary"
                                value={eventEnd}
                                onChange={(e) => {
                                    setEventEnd(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-6">
                        <label htmlFor="event-type" className="block text-sm/6 font-medium">
                            Tipo
                        </label>
                        <div className="mt-2">
                            <select
                                id="event-type"
                                name="event-type"
                                className="input-primary"
                                value={eventType}
                                onChange={(e) => setEventType(e.target.value)}
                            >
                                <option value="block">Bloco</option>
                                <option value="list-item">Lista</option>
                            </select>
                        </div>
                    </div>
                    <div className="sm:col-span-6">
                        <label htmlFor="event-all-day" className="block text-sm/6 font-medium">
                            Dia todo
                        </label>
                        <div className="mt-2">
                            <select
                                id="event-all-day"
                                name="event-all-day"
                                className="input-primary"
                                value={eventAllDay}
                                onChange={(e) => setEventAllDay(e.target.value === 'true')}
                            >
                                <option value="false">Não</option>
                                <option value="true">Sim</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <button className="mt-6 me-auto btn-primary" onClick={closeModal}>
                        Close
                    </button>
                    {modalType === 'update' && (
                        <div className="flex gap-2 mt-6 ms-auto">
                            <button className="btn-primary" onClick={updateEvent}>
                                Editar
                            </button>
                            <button className="btn-primary" onClick={deleteEvent}>
                                Excluir
                            </button>
                        </div>
                    )}
                    {modalType == 'add' && (
                        <button className="mt-6 ms-auto btn-primary" onClick={createEvent}>
                            Criar
                        </button>
                    )}
                </div>
            </Modal>
        </div>
    );
}
