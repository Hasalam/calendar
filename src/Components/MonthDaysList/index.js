import React from "react";
import {
  CellWrapper,
  RowInCell,
  ShowDayWrapper,
  DayWrapper,
  CurrentDayWrapper,
  EventListWrapper,
  EventItemWrapper,
  EventListItemWrapper,
} from "../../Containers/StyledComponents";
import moment from "moment";
import { DISPLAY_MODE_DAY } from "../../Helpers/const";
import { Tooltip } from "react-tooltip";

export const MonthDaysList = ({
  startDay,
  today,
  appointments,
  openFormHandler,
  setDisplayMode,
  setToday,
}) => {
  const day = moment(startDay).subtract(1, "day");
  const daysArray = [...Array(42)].map(() => moment(day.add(1, "day")));
  return (
    <>
      {daysArray.map((dayItem, i) => (
        <CellWrapper
          key={dayItem.unix()}
          isWeekend={dayItem.day() === 0 || dayItem.day() === 6}
          isSelectedMonth={today.isSame(dayItem, "month")}
        >
          <RowInCell justifyContent={"flex-end"}>
            <ShowDayWrapper>
              <DayWrapper
                onDoubleClick={() => openFormHandler("Update")}
                onClick={() => {
                  setDisplayMode(DISPLAY_MODE_DAY);
                  setToday(dayItem);
                }}
                className="day-item"
              >
                {dayItem.isSame(moment(), "day") ? (
                  <CurrentDayWrapper>{dayItem.format("D")}</CurrentDayWrapper>
                ) : (
                  <div>{dayItem.format("D")}</div>
                )}
              </DayWrapper>
            </ShowDayWrapper>
            <EventListWrapper>
              {appointments
                .filter((a) => moment(a.date).isSame(dayItem, "day"))
                .slice(0, 2)
                .map((a, index) => {
                  return (
                    <EventListItemWrapper key={a.id}>
                      <EventItemWrapper
                        onDoubleClick={() => openFormHandler("Update", a)}
                        data-tooltip-id="appointmentTooltip"
                        data-tooltip-content={a.title}
                        data-tooltip-place="right"
                        data-tooltip-variant="light"
                        data-tooltip-hidden={a.title.length < 16}
                      >
                        {a.title}
                      </EventItemWrapper>
                    </EventListItemWrapper>
                  );
                })}
              {appointments.filter((a) => moment(a.date).isSame(dayItem, "day"))
                .length > 2 ? (
                <EventListItemWrapper
                  onClick={() => {
                    setDisplayMode(DISPLAY_MODE_DAY);
                    setToday(dayItem);
                  }}
                >
                  <EventItemWrapper>show more...</EventItemWrapper>
                </EventListItemWrapper>
              ) : null}
            </EventListWrapper>
          </RowInCell>
        </CellWrapper>
      ))}
      <Tooltip id="appointmentTooltip" />
    </>
  );
};
