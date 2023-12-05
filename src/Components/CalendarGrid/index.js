import React from "react";
import { CalendarGridHeader } from "../CalendarGridHeader";
import { MonthDaysList } from "../MonthDaysList";
import { GridWrapper } from "../../Containers/StyledComponents";

const CalendarGrid = ({
  startDay,
  today,
  appointments,
  openFormHandler,
  setDisplayMode,
  setToday,
}) => {
  return (
    <>
      <GridWrapper isHeader>
        <CalendarGridHeader />
      </GridWrapper>
      <GridWrapper>
        <MonthDaysList
          startDay={startDay}
          today={today}
          appointments={appointments}
          openFormHandler={openFormHandler}
          setDisplayMode={setDisplayMode}
          setToday={setToday}
        />
      </GridWrapper>
    </>
  );
};

export { CalendarGrid };
