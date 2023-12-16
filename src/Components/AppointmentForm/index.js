import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Button, Col, Input, Row } from "reactstrap";
import styled from "styled-components";
import moment from "moment";
import {
  AppointmentBody,
  AppointmentTitle,
  ShadowWrapper,
} from "../../Containers/StyledComponents";
import axios from "axios";

const FormPositionWrapper = styled.div`
  position: absolute;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.35);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormWrapper = styled(ShadowWrapper)`
  width: 320px;
  min-width: 320px;
  display: block;
  height: auto;
  background-color: #1e1f21;
  color: #dddddd;
  box-shadow: unset;
`;

export const AppointmentForm = ({
  appointment,
  refreshAppointments,
  setIsShowForms,
  changeEventHandler,
  setAppointment,
  patient,
  setIsShowPatientsModal,
}) => {
  const saveAppointment = () => {
    const validate = validateAppointment(appointment);
    if (Object.values(validate).every((item) => item)) {
      if (!appointment.id) {
        axios
          .post("https://localhost:7070/api/AppointmentModels", {
            ...appointment,
          })
          .then(() => refreshAppointments());
      } else {
        axios
          .put(
            `https://localhost:7070/api/AppointmentModels/${appointment.id}`,
            {
              ...appointment,
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

  const deleteAppointment = () => {
    axios
      .delete(`https://localhost:7070/api/AppointmentModels/${appointment.id}`)
      .then(() => refreshAppointments());
    setIsShowForms(false);
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

  return (
    <FormPositionWrapper onClick={() => setIsShowForms(false)}>
      <FormWrapper onClick={(e) => e.stopPropagation()}>
        <AppointmentTitle
          value={appointment?.title}
          placeholder="title"
          onChange={(e) => {
            changeEventHandler(e.target.value, "title");
          }}
          invalid={!validateObject.title}
        />
        <AppointmentBody
          value={appointment?.description}
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
              placeholder="patient"
              invalid={!validateObject.patientId}
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
          value={appointment?.date}
          onChange={(e) => {
            changeEventHandler(e.target.value, "date");
          }}
          invalid={!validateObject.date}
        />
        <AppointmentBody
          value={appointment?.duration}
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
          value={appointment?.email}
          onChange={(e) => {
            changeEventHandler(e.target.value, "email");
          }}
          invalid={!validateObject.email}
        />
        <AppointmentBody
          value={appointment?.phoneNumber}
          placeholder="phone number"
          onChange={(e) => {
            changeEventHandler(e.target.value, "phoneNumber");
          }}
          invalid={!validateObject.phoneNumber}
        />
        <Row>
          <Button
            className="border-bottom border-dark"
            onClick={() => {
              validateAppointment(appointment);
              saveAppointment();
            }}
          >
            {appointment?.id ? "Save Changes" : "Create"}
          </Button>
          {appointment?.id && (
            <Button color="danger" onClick={() => deleteAppointment()}>
              Delete
            </Button>
          )}
          <Button
            onClick={() => {
              setIsShowForms(false);
              setAppointment(null);
            }}
          >
            Cancel
          </Button>
        </Row>
      </FormWrapper>
    </FormPositionWrapper>
  );
};
