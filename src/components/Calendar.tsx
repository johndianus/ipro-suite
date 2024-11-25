/**
 * Calendar Component
 * 
 * A responsive calendar component that displays the days of the current month.
 * Users can navigate between months using the previous and next buttons.
 * Users can add and edit events
 * 
 * Features:
 * - Display the days of the current month.
 * - Navigate between months.
 * - Responsive layout with a different structure for mobile and desktop.
 * - Displays the days in a grid on desktop and in a simple row on mobile.
 * - Events can be added and changed. 
 * - Events are persisted in the Browser.
 * 
 * @component
 * 
 * @example
 * <Calendar />
 * 
 * @returns {JSX.Element} The Calendar component.
 */

import { useState, useEffect } from "react";
import {
  CalendarWrapper,
  DaysGrid,
  DaysOfWeek,
  Header,
  NavigationButton,
  MonthLabel,
  DayOfWeek,
  Day,
  DayRow,
  DayLabel,
  MobDay,
  EventWrap,
  EventContainer
} from "./Calendar.styles";
import Modal from "./CalendarModal";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [events, setEvents] = useState<{ [key: string]: { id: string; time: string; description: string }[] }>(() => {
    const savedEvents = localStorage.getItem("calendar-events");
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  
  const [currentEvent, setCurrentEvent] = useState<{ id: string; time: string; description: string } | null>(null);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Load events from local storage on component load
  useEffect(() => {
    const savedEvents = localStorage.getItem("calendar-events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to local storage whenever events change
  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events));
  }, [events]);

  // Handler to navigate previous month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Handler to navigate next month
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Add event to the selected day
  const handleAddEvent = (day: number) => {
    setSelectedDay(day);
    setCurrentEvent(null);
  };

  // Edit event to the selected event
  const handleEditEvent = (day:  number, event:{ id: string; time: string; description: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDay(day); // Open modal for selected day
    setCurrentEvent(event);
  };
  
  // Save the event for the selected day
  const saveEvent = (day: number, event: { id: string; time: string; description: string }) => {
    
    const dayKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
  
      const existingEvents = events[dayKey] || [];
      const eventIndex = existingEvents.findIndex((e) => e.id === event.id);
  
      if (eventIndex >= 0) {
        // Event exists, so we alter (update) it
        const updatedEvents = [...existingEvents];
        updatedEvents[eventIndex] = { ...updatedEvents[eventIndex], time: event.time, description: event.description };
  
        // Update the state with the modified events list
        setEvents((prevEvents) => ({
          ...prevEvents,
          [dayKey]: updatedEvents,
        }));
      }
    else {
      // If event doesn't exists, we add a new event
      setEvents((prevEvents) => ({
        ...prevEvents,
        [dayKey]: [...(prevEvents[dayKey] || []), event],
      }));
    }
  
    setSelectedDay(null);
  };

  // Generate cells for the calendar
  const renderDays = () => {
    const cells = [];
    const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDayOfMonth + 1;
      const isValidDay = day > 0 && day <= daysInMonth;
      const dayKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${day}`;
      const dayEvents = events[dayKey] || [];

      cells.push(
        <Day
          data-testid="day-cell"
          key={i}
          isValidDay={isValidDay}
          onDoubleClick={() => isValidDay && handleAddEvent(day)}
        >
          {isValidDay && (
            <DayRow>
              <DayLabel>{day}</DayLabel>
              <MobDay>{weekDays[(firstDayOfMonth + day - 1) % 7]}</MobDay>
              <EventContainer>
                {dayEvents
                .sort((a, b) => {
                  const timeA = new Date(`1970-01-01T${a.time}`);
                  const timeB = new Date(`1970-01-01T${b.time}`);
                  return timeA.getTime() - timeB.getTime();
                })
                .map((event, index) => (
                  <EventWrap
                    key={index}
                    onDoubleClick={(e) => handleEditEvent(day, event,e)}
                  >
                    <span data-testid="event-time" style={{ fontWeight: "bold"}}>{event.time}</span>
                    <span data-testid="event-description">{event.description}</span>
                  </EventWrap>
                ))}
              </EventContainer>
            </DayRow>
          )}
        </Day>
      );
    }

    return cells;
  };

  return (
    <>
      <CalendarWrapper>
        <Header>
          <NavigationButton onClick={handlePrevMonth}>←</NavigationButton>
          <MonthLabel>
            {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
          </MonthLabel>
          <NavigationButton onClick={handleNextMonth}>→</NavigationButton>
        </Header>
        <DaysOfWeek>
          {weekDays.map((day) => (
            <DayOfWeek key={day}>{day}</DayOfWeek>
          ))}
        </DaysOfWeek>
        <DaysGrid>{renderDays()}</DaysGrid>
      </CalendarWrapper>

      {/* Render Modal if a day is selected */}
      {selectedDay !== null && (
        <Modal
          day={selectedDay}
          currentEvent={currentEvent}
          addEvent={saveEvent}
          closeModal={() => setSelectedDay(null)}
        />
      )}
    </>
  );
};

export default Calendar;
