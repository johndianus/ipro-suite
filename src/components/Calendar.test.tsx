import { render, screen, fireEvent, waitFor  } from "@testing-library/react";
import Calendar from "./Calendar";

describe("Calendar Component", () => {

  //clear the local storages before each test
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders the calendar with correct month and year", () => {
    // Fake the current date as November
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-11-15T00:00:00Z"));
    render(<Calendar />);
    const monthLabel = screen.getByText(/November 2024/i);
    // Check the current 
    expect(monthLabel).toBeInTheDocument();
  });
  
  test("renders the correct number of days in the grid", () => {
    render(<Calendar />);
    const days = screen.getAllByTestId("day-cell");
    // Check the number of grids are 35
    expect(days.length).toBeGreaterThanOrEqual(35);
  });
 
  test("navigates to the previous month", () => {
    //jest.useFakeTimers();
    //jest.setSystemTime(new Date("2024-11-15T00:00:00Z"));
    render(<Calendar />);
    const prevButton = screen.getByText("←");
    fireEvent.click(prevButton);
    // Check the Previous Month and year are displayed
    const monthLabel = screen.getByText(/October 2024/i);
    expect(monthLabel).toBeInTheDocument();
  });
  
  test("navigates to the next month", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-11-15T00:00:00Z"));
    render(<Calendar />);
    const nextButton = screen.getByText("→");
    fireEvent.click(nextButton);
    const monthLabel = screen.getByText(/December 2024/i);
    // Check the Next Month and year are displayed
    expect(monthLabel).toBeInTheDocument();
  });

  it("opens the modal to add an event when a valid day is clicked", async () => {
    render(<Calendar />);
    const dayCell = screen.getByText("15");
    fireEvent.doubleClick(dayCell);
  
    expect(screen.getByPlaceholderText("Enter time")).toBeInTheDocument(); // Match the actual placeholder
    expect(screen.getByPlaceholderText("Enter description")).toBeInTheDocument(); // Match actual description placeholder
  });

  it("saves a new event and displays it on the calendar", () => {
    render(<Calendar />);
    const dayCell = screen.getByText("15");
    fireEvent.doubleClick(dayCell);

    // Fill out the modal
    const timeInput = screen.getByPlaceholderText("Enter time");
    const descriptionInput = screen.getByPlaceholderText("Enter description");
    fireEvent.change(timeInput, { target: { value: "14:00" } });
    fireEvent.change(descriptionInput, { target: { value: "Team Meeting" } });

    // Save the event
    fireEvent.click(screen.getByText("Save"));

    // Verify the event is displayed on the day
    expect(screen.getByText("14:00")).toBeInTheDocument();
    expect(screen.getByText("Team Meeting")).toBeInTheDocument();
  });

  it("loads saved events from localStorage", () => {
    const savedEvents = {
      "2024-11-15": [{ id: "1", time: "12:00", description: "Lunch with team" }],
    };
    localStorage.setItem("calendar-events", JSON.stringify(savedEvents));

    render(<Calendar />);

    // Verify the event is displayed on the calendar
    expect(screen.getByText("12:00")).toBeInTheDocument();
    expect(screen.getByText("Lunch with team")).toBeInTheDocument();
  });

  it("opens the modal with pre-filled values when clicking an event", () => {
    const savedEvents = {
      "2024-11-15": [{ id: "1", time: "12:00", description: "Lunch with team" }],
    };
    localStorage.setItem("calendar-events", JSON.stringify(savedEvents));

    render(<Calendar />);

    // Click on the event
    const event = screen.getByText("Lunch with team");
    fireEvent.doubleClick(event);

    // Verify the modal is pre-filled
    expect(screen.getByDisplayValue("12:00")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Lunch with team")).toBeInTheDocument();
  });

  it("edits an event and updates it on the calendar", () => {
    const savedEvents = {
      "2024-11-15": [{ id: "1", time: "12:00", description: "Lunch with team" }],
    };
    localStorage.setItem("calendar-events", JSON.stringify(savedEvents));

    render(<Calendar />);

    // Click on the event
    const event = screen.getByText("Lunch with team");
    fireEvent.doubleClick(event);

    // Edit the event in the modal
    const descriptionInput = screen.getByDisplayValue("Lunch with team");
    fireEvent.change(descriptionInput, { target: { value: "Lunch with client" } });
    fireEvent.click(screen.getByText("Save"));

    // Verify the updated event is displayed
    expect(screen.getByText("Lunch with client")).toBeInTheDocument();
    expect(screen.queryByText("Lunch with team")).not.toBeInTheDocument();
  });

  it("closes the modal when clicking the close button", () => {
    render(<Calendar />);
    const dayCell = screen.getByText("15");
    fireEvent.doubleClick(dayCell);

    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.queryByPlaceholderText("Enter time")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Enter description")).not.toBeInTheDocument();
  });

  it("sorts events by time for the same day", () => {
    const savedEvents = {
      "2024-11-15": [
        { id: "2", time: "15:00", description: "Afternoon Meeting" },
        { id: "1", time: "09:00", description: "Morning Call" },
        { id: "3", time: "12:00", description: "Lunch with Client" },
      ],
    };
    localStorage.setItem("calendar-events", JSON.stringify(savedEvents));
  
    render(<Calendar />);
  
    const dayCell = screen.getByText("15");
    expect(dayCell).toBeInTheDocument();

    const eventTimes = screen.getAllByTestId("event-time").map((el) => el.textContent);
    const eventDescriptions = screen.getAllByTestId("event-description").map((el) => el.textContent);
  
    expect(eventTimes).toEqual(["09:00", "12:00", "15:00"]);
    expect(eventDescriptions).toEqual(["Morning Call", "Lunch with Client", "Afternoon Meeting"]);
  });
  
  it("sets an error message when time or description is invalid", () => {
    render(<Calendar />);
    const dayCell = screen.getByText("15");
    fireEvent.doubleClick(dayCell);
    // Leave both inputs empty and click Save
    fireEvent.click(screen.getByText("Save"));
    // Check if error message is displayed
    expect(screen.getByText("Please provide a valid time and description.")).toBeInTheDocument();
  });

});

  