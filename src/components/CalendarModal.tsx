import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  ModalContainer,
  ModalBox,
  Input,
  ActionContainer,
  Save,
  Cancel,
  Error
} from "./Calendar.styles";

export const Modal = ({
  day,
  currentEvent,
  addEvent,
  closeModal,
}: {
  day: number;
  currentEvent: { id: string; time: string; description: string } | null;
  addEvent: (day: number, event: { id: string; time: string; description: string }) => void;
  closeModal: () => void;
}) => {
  const [eventTime, setEventTime] = useState(currentEvent?.time || "");
  const [eventDescription, setEventDescription] = useState(currentEvent?.description || "");
  const [error, setError] = useState("");

  //Sanitize the description
  const sanitizeDescription = (input: string): string => {
    return input.replace(/[^a-zA-Z0-9\s]/g, "").trim();
  };

  // Sanitize the Time
  const isValidTime = (time: string): boolean => {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
  };

  // Handle Save
  const handleSave = () => {
    const sanitizedDescription = sanitizeDescription(eventDescription);
    if (isValidTime(eventTime) && sanitizedDescription.length > 0) {
      const eventId = currentEvent ? currentEvent.id : uuidv4();
      addEvent(day, { id: eventId, time: eventTime.trim(), description: sanitizedDescription });
      closeModal();
    } else {
      setError("Please provide a valid time and description.");
    }
  };

  return (
    <ModalContainer>
      <ModalBox>
        <h2>{currentEvent ? "Edit" : "Add"} Event for Day {day}</h2>
        <Input
          placeholder="Enter time"
          type="time"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Enter description"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
        />
        {error && (<Error>{error}</Error>)}
        <ActionContainer>
          <Save onClick={handleSave}>Save</Save>
          <Cancel onClick={closeModal}>Cancel</Cancel>
        </ActionContainer>
      </ModalBox>
    </ModalContainer>
  );
};

export default Modal;
