import styled from "styled-components";

interface DayProps {
  isValidDay: boolean;
}

export const CalendarWrapper = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 10px;
  background-color: #1c1c1e;
  color: #fff;
  height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const MonthLabel = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

export const NavigationButton = styled.button`
  background-color: transparent;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  &:hover {
    color: #007bff;
  }
`;

export const DaysOfWeek = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const DayOfWeek = styled.div`
  padding: 8px;
  color: #ccc;
  @media (max-width: 768px) {
    display: none;
  }
`;

export const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  @media (max-width: 768px) {
    display: block;
  }
`;

export const Day = styled.div<DayProps>`
  background-color: #2c2c2e;
  border-radius: 4px;
  padding: 8px;
  min-height: 80px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  @media (max-width: 768px) {
    display: ${({ isValidDay }) => (isValidDay ? "flex" : "none")};
    margin-bottom: 10px;
  }
`;

export const DayRow = styled.div`
  display: flex;
`;

export const DayLabel = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

export const MobDay = styled.div`
  font-weight: bold;
  margin-left: 5px;
  @media (min-width: 768px) {
    display: none;
  }
`;

export const EventsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Event = styled.div`
  background-color: #007bff;
  color: #fff;
  padding: 4px 6px;
  border-radius: 3px;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
