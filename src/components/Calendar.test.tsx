import { render, screen, fireEvent } from "@testing-library/react";
import Calendar from "./Calendar";

describe("Calendar Component", () => {
  test("renders the calendar with correct month and year", () => {
    render(<Calendar />);
    const monthLabel = screen.getByText(/November 2024/i);
    expect(monthLabel).toBeInTheDocument();
  });
  
  test("renders correct days of the week", () => {
    render(<Calendar />);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    daysOfWeek.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });
  
  test("renders the correct number of days in the grid", () => {
    render(<Calendar />);
    const days = screen.getAllByTestId("day-cell");
    expect(days.length).toBeGreaterThanOrEqual(35);
  });
 
  test("navigates to the previous month", () => {
    render(<Calendar />);
    const prevButton = screen.getByText("←");
    fireEvent.click(prevButton);
    const monthLabel = screen.getByText(/October 2024/i);
    expect(monthLabel).toBeInTheDocument();
  });
  
  test("navigates to the next month", () => {
    render(<Calendar />);
    const nextButton = screen.getByText("→");
    fireEvent.click(nextButton);
    const monthLabel = screen.getByText(/December 2024/i);
    expect(monthLabel).toBeInTheDocument();
  });
  
});

  