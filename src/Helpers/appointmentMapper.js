import moment from "moment";

export const appointmentMapper = (appointmentsBunch) => {
  const HOURS = 24;
  const rowHours = new Map([...Array(HOURS)].map((_, i) => [i, new Map()]));
  appointmentsBunch
    .sort((a, b) => b.duration - a.duration)
    .forEach((e) => {
      const date = +moment(e.date).format("H");
      const rowHourItem = rowHours.get(date);
      rowHourItem.set(e.id, e);
    });

  let i = 0;
  let rowNumber = 0;
  let columnNumber = 0;
  const columnsappointmentGroups = new Map();
  columnsappointmentGroups.set(columnNumber, new Map());
  let emptyRowsCount = 0;
  while (true) {
    if (rowHours.size === emptyRowsCount) {
      columnsappointmentGroups.delete(columnNumber);
      break;
    }

    if (rowNumber > rowHours.size - 1) {
      rowNumber = 0;
      columnNumber++;
      columnsappointmentGroups.set(columnNumber, new Map());
      emptyRowsCount = 0;
    }

    const rowAsHourData = rowHours.get(rowNumber);

    if (rowAsHourData.size === 0) {
      rowNumber++;
      emptyRowsCount++;
      continue;
    }

    const iterator = rowAsHourData.keys();
    const key = iterator.next().value;
    const firstEventInRowAsHourData = rowAsHourData.get(key);

    rowAsHourData.delete(key);
    columnsappointmentGroups
      .get(columnNumber)
      .set(key, firstEventInRowAsHourData);
    rowNumber = rowNumber + firstEventInRowAsHourData.duration;
  }

  return columnsappointmentGroups;
};
