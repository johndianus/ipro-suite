/**
 * Calendar Component
 * 
 * A responsive calendar component that displays the days of the current month.
 * Users can navigate between months using the previous and next buttons.
 * 
 * Features:
 * - Display the days of the current month.
 * - Navigate between months.
 * - Responsive layout with a different structure for mobile and desktop.
 * - Displays the days in a grid on desktop and in a simple row on mobile.
 * 
 * @component
 * 
 * @example
 * <Calendar />
 * 
 * @returns {JSX.Element} The Calendar component.
 */

import { useState } from "react";
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
} from "./Calendar.styles";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Handler to navigate previous month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Handler to navigate next month
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Generate cells for the calendar
  const renderDays = () => {
    const cells = [];
    const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDayOfMonth + 1;
      const isValidDay = day > 0 && day <= daysInMonth;

      cells.push(
        <Day data-testid="day-cell" key={i} isValidDay={isValidDay}>
          {isValidDay && (
            <DayRow>
              <DayLabel>{day}</DayLabel>
              <MobDay>{weekDays[i%7]}</MobDay>
            </DayRow>
          )}
        </Day>
      );
    }

    return cells;
  };

  return (
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
  );
};

export default Calendar;
