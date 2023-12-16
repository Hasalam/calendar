import styled from "styled-components";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import {
  AppointmentBody,
  AppointmentTitle,
  EventItemWrapper,
  EventListItemWrapper,
  EventListWrapper,
} from "../../Containers/StyledComponents";
import { CiSearch } from "react-icons/ci";
import { Button, Col, Input, Row, Alert } from "reactstrap";
import axios from "axios";
import { ITEM_PER_DAY, emptyAssessment } from "../../Helpers/const";
import { appointmentMapper } from "../../Helpers/appointmentMapper";

const DayShowWrapper = styled.div`
  display: flex;
  flex-grow: 1;
`;

const AppointmentsListWrapper = styled.div`
  background-color: #1e1f21;
  color: #dddddd;
  flex-grow: 1;
`;

const AppointmentFormWrapper = styled.div`
  background-color: #27282a;
  color: #dddddd;
  width: 300px;
  position: relative;
`;

const NoAppointmentMsg = styled.div`
  color: #565759;
  position: absolute;
  top: 50%;
  right: 50%;
  width: 200px;
  transform: translate(50%, -50%);
`;

const ScaleWrapper = styled("div")`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 4px;
  position: relative;
`;

const ScaleCellWrapper = styled("div")`
  flex-grow: 1;
  position: relative;
  &:not(:last-child) {
    border-bottom: 1px solid #464648;
  }
  margin-left: 32px;
`;

const ScaleCellTimeWrapper = styled("div")`
  position: absolute;
  left: -26px;
  top: -6px;
  font-size: 10px;
  cursor: pointer;
`;
const ScaleCellAppointmentWrapper = styled("div")`
  min-height: 26px;
`;

const AppointmentItemButton = styled(EventItemWrapper)`
  margin-left: 4px;
  position: absolute;
  width: ${(props) => props.w}px;
  top: 0px;
  left: ${(props) => props.left}px;
  height: ${(props) => props.h}px;
  top: ${(props) => props.top}px;
  padding: 1px;
  display: inline-flex;
  background-color: rgba(71, 132, 255, 0.5);
  border: 1px solid rgba(71, 132, 255, 0.75);
`;

const RedLine = styled("div")`
  background-color: #f00;
  height: 1px;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  top: ${(props) => props.position}%;
`;

const TitleWrapper = styled("span")`
  max-width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const DayShowComponent = ({
  appointments,
  today,
  selectedAppointment,
  setSelectedAppointment,
  refreshAppointments,
  setIsShowForms,
  changeEventHandler,
  patient,
  setIsShowPatientsModal,
}) => {
  const ref = useRef(null);

  const [heightDiv, setHeightDiv] = useState(0);
  const [widthDiv, setWidthDiv] = useState(0);
  const [mappedAppointments, setMappedAppointments] = useState([]);

  useEffect(() => {
    const filteredItems = appointments.filter((a) =>
      moment(a.date).isSame(today, "day")
    );

    const map = appointmentMapper(filteredItems);

    const tempArr = [];
    map.forEach((column, rank) => {
      column.forEach((appointment) => {
        tempArr.push({ ...appointment, rank });
      });
    });
    setMappedAppointments(tempArr);
    setHeightDiv(ref.current.clientHeight / ITEM_PER_DAY);
    setWidthDiv((ref.current.clientWidth - 40) / map.size);
  }, [appointments, today]);

  const saveAppointment = () => {
    const validate = validateAppointment(selectedAppointment);
    if (Object.values(validate).every((item) => item)) {
      if (!selectedAppointment.id) {
        axios
          .post("https://localhost:7070/api/AppointmentModels", {
            ...selectedAppointment,
          })
          .then(() => refreshAppointments());
      } else {
        axios
          .put(
            `https://localhost:7070/api/AppointmentModels/${selectedAppointment.id}`,
            {
              ...selectedAppointment,
            }
          )
          .then(() => {
            refreshAppointments();
            alert("Changed saved!");
          });
      }
      setIsShowForms(false);
    } else {
      setValidateObject(validate);
    }
  };

  const [validateObject, setValidateObject] = useState({
    title: true,
    description: true,
    patientId: true,
    duration: true,
    phoneNumber: true,
    email: true,
    date: true,
  });

  const validateAppointment = (appointment) => {
    var result = {
      title: appointment.title.trim().length > 0,
      description: appointment.description.trim().length > 0,
      patientId: appointment.patientId > 0,
      duration: appointment.duration > 0,
      phoneNumber: appointment.phoneNumber.trim().length > 0,
      email: appointment.email.trim().length > 0,
      date: moment(appointment.date).isValid() > 0,
    };
    return result;
  };

  const saveAppointmentGiven = (appointment) => {
    if (!appointment.id) {
      axios
        .post("https://localhost:7070/api/AppointmentModels", {
          ...appointment,
        })
        .then(() => refreshAppointments());
    } else {
      axios
        .put(`https://localhost:7070/api/AppointmentModels/${appointment.id}`, {
          ...appointment,
        })
        .then(() => refreshAppointments());
    }
    setIsShowForms(false);
  };

  const deleteAppointment = () => {
    axios
      .delete(
        `https://localhost:7070/api/AppointmentModels/${selectedAppointment.id}`
      )
      .then(() => refreshAppointments());
    setSelectedAppointment(null);
  };

  const cells = [...new Array(ITEM_PER_DAY)].map((_, i) => {
    /*const temp = [];
    filteredItems.forEach((appointment) => {
      if (+moment(appointment.date).format("H") === i) {
        temp.push(appointment);
      }
    });
    return temp;*/
  });

  const getRedLinePosition = () => {
    return ((moment().format("X") - today.format("X")) / 86400) * 100;
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 60000);

    return () => clearInterval(timerId);
  }, []);

  const [, setCounter] = useState(0);

  const onDragEndHandler = (e, appointment) => {};

  const onDropHandler = (e, i) => {
    const newDate = moment(selectedAppointment.date);
    newDate.hours(i);
    setSelectedAppointment((prev) => {
      return { ...prev, date: newDate.format("YYYY-MM-DDTHH:mm:ss") };
    });
    saveAppointmentGiven({
      ...selectedAppointment,
      date: newDate.format("YYYY-MM-DDTHH:mm:ss"),
    });
  };

  return (
    <DayShowWrapper>
      <AppointmentsListWrapper>
        <EventListWrapper>
          <ScaleWrapper ref={ref}>
            {today.isSame(moment(), "day") && (
              <RedLine position={getRedLinePosition()} />
            )}
            {cells.map((_, i) => (
              <ScaleCellWrapper
                onDrop={(e) => onDropHandler(e, i)}
                onDragOver={(e) => e.preventDefault()}
              >
                <ScaleCellTimeWrapper
                  onDoubleClick={() =>
                    setSelectedAppointment({
                      ...emptyAssessment,
                      date: `${moment(today)
                        .hour(i)
                        .format("YYYY-MM-DDTHH:mm:ss")}`,
                    })
                  }
                >
                  {i !== 0 ? <>{`${i}`.padStart(2, "0")}:00</> : null}
                </ScaleCellTimeWrapper>
                <ScaleCellAppointmentWrapper />
              </ScaleCellWrapper>
            ))}
            {mappedAppointments.map((appointment, i) => (
              <AppointmentItemButton
                draggable
                onDragStart={(e) => setSelectedAppointment(appointment)}
                onDragEnd={(e) => onDragEndHandler(e, appointment)}
                w={widthDiv}
                onClick={() => setSelectedAppointment(appointment)}
                left={32 + (widthDiv + 1) * appointment.rank}
                h={+appointment.duration * heightDiv.toFixed(0) - 3}
                top={moment(appointment.date).hour() * heightDiv + 1}
              >
                <TitleWrapper>{appointment.title}</TitleWrapper>
              </AppointmentItemButton>
            ))}
          </ScaleWrapper>
        </EventListWrapper>
      </AppointmentsListWrapper>
      <AppointmentFormWrapper>
        {selectedAppointment ? (
          <div>
            <AppointmentTitle
              value={selectedAppointment?.title}
              placeholder="title"
              onChange={(e) => {
                changeEventHandler(e.target.value, "title");
              }}
              invalid={!validateObject.title}
            />
            <AppointmentBody
              value={selectedAppointment?.description}
              placeholder="description"
              onChange={(e) => {
                changeEventHandler(e.target.value, "description");
              }}
              invalid={!validateObject.description}
            />
            <Row>
              <Col xs={10} className="px-0 ps-3">
                <AppointmentBody
                  value={patient?.name}
                  readOnly
                  invalid={!validateObject.patientId}
                  placeholder="patient"
                />
              </Col>
              <Col xs={2} className="px-0">
                <CiSearch
                  onClick={() => setIsShowPatientsModal(true)}
                  style={{ cursor: "pointer" }}
                />
              </Col>
            </Row>
            <AppointmentBody
              id="exampleDate"
              name="date"
              placeholder="date placeholder"
              type="datetime-local"
              value={selectedAppointment?.date}
              onChange={(e) => {
                changeEventHandler(e.target.value, "date");
              }}
              invalid={!validateObject.date}
            />
            <AppointmentBody
              value={selectedAppointment?.duration}
              placeholder="duration"
              type="number"
              max={24}
              min={1}
              onChange={(e) => {
                changeEventHandler(e.target.value, "duration");
              }}
              invalid={!validateObject.duration}
            />
            <AppointmentBody
              id="exampleEmail"
              name="email"
              placeholder="email"
              type="email"
              value={selectedAppointment?.email}
              onChange={(e) => {
                changeEventHandler(e.target.value, "email");
              }}
              invalid={!validateObject.email}
            />
            <AppointmentBody
              value={selectedAppointment?.phoneNumber}
              placeholder="phone number"
              onChange={(e) => {
                changeEventHandler(e.target.value, "phoneNumber");
              }}
              invalid={!validateObject.phoneNumber}
            />
            <Button
              className="border-bottom border-dark w-100"
              onClick={saveAppointment}
            >
              {selectedAppointment?.id ? "Save Changes" : "Create"}
            </Button>
            {selectedAppointment?.id && (
              <Button
                color="danger"
                className="w-100"
                onClick={() => deleteAppointment()}
              >
                Delete
              </Button>
            )}
            <Button
              className="w-100"
              onClick={() => setSelectedAppointment(null)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <>
            <NoAppointmentMsg>No appointment selected</NoAppointmentMsg>
            <Button
              className="w-100"
              onClick={() => setSelectedAppointment(emptyAssessment)}
            >
              Add appointment
            </Button>
          </>
        )}
      </AppointmentFormWrapper>
    </DayShowWrapper>
  );
};
