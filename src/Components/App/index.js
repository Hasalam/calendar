import moment from "moment";
import { Title } from "../Title";
import { Monitor } from "../Monitor";
import { CalendarGrid } from "../CalendarGrid";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { PatientsModal } from "../PatientsModal";
import {
  DISPLAY_MODE_DAY,
  DISPLAY_MODE_MONTH,
  emptyAssessment,
} from "../../Helpers/const";
import { DayShowComponent } from "../DayShowComponent";
import { AppointmentForm } from "../AppointmentForm";
import { ShadowWrapper } from "../../Containers/StyledComponents";

function App() {
  moment.updateLocale("en", { week: { dow: 1 } });
  const [displayMode, setDisplayMode] = useState("month");
  const [today, setToday] = useState(moment().startOf("day"));
  const [appointment, setAppointment] = useState(null);
  const [isShowForm, setIsShowForms] = useState(false);
  const [isShowPatientsModal, setIsShowPatientsModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [patient, setPatient] = useState(null);

  const start = useMemo(
    () => moment(today).startOf("month").startOf("week"),
    [today]
  );
  const end = useMemo(
    () => moment(today).endOf("month").endOf("week"),
    [today]
  );

  window.moment = moment;

  useEffect(() => {
    if (appointment?.patientId && patient?.id !== appointment.patientId) {
      axios
        .get(`https://localhost:7070/api/Patients/${appointment.patientId}`)
        .then((response) => setPatient(response.data));
    }
  }, [appointment]);

  const prevHendler = () => {
    setAppointment(null);
    setToday((prev) => prev.clone().subtract(1, displayMode));
  };

  const nextHandler = () => {
    setAppointment(null);
    setToday((prev) => prev.clone().add(1, displayMode));
  };

  const todayHandler = () => {
    setAppointment(null);
    setToday(moment());
  };

  useEffect(() => {
    if (!appointment?.patientId) setPatient(null);
  }, [appointment]);

  const refreshAppointments = useCallback(() => {
    axios
      .get("https://localhost:7070/api/AppointmentModels/InRange", {
        params: {
          from: start.format("MM.DD.YYYY"),
          to: end.format("MM.DD.YYYY"),
        },
      })
      .then((response) => {
        setAppointments(response.data);
        setAppointment(emptyAssessment);
        setPatient(null);
      });
  }, [end, start]);

  useEffect(() => {
    refreshAppointments();
  }, [end, refreshAppointments, start]);

  const openFormHandler = (method, appointmentForUpdate) => {
    setAppointment(appointmentForUpdate);
    setIsShowForms(true);
  };

  const changeEventHandler = (value, field) => {
    setAppointment((prevState) => ({ ...prevState, [field]: value }));
  };

  return (
    <>
      {isShowForm ? (
        <AppointmentForm
          appointment={appointment}
          refreshAppointments={refreshAppointments}
          setIsShowForms={setIsShowForms}
          changeEventHandler={changeEventHandler}
          setAppointment={setAppointment}
          patient={patient}
          setIsShowPatientsModal={setIsShowPatientsModal}
        />
      ) : null}
      <ShadowWrapper className="App">
        <Title />
        <Monitor
          today={today}
          nextHandler={nextHandler}
          prevHendler={prevHendler}
          todayHandler={todayHandler}
          setDisplayMode={setDisplayMode}
          displayMode={displayMode}
          setAppointment={setAppointment}
        />
        {displayMode === DISPLAY_MODE_MONTH ? (
          <CalendarGrid
            startDay={start}
            today={today}
            setToday={setToday}
            appointments={appointments}
            openFormHandler={openFormHandler}
            setDisplayMode={setDisplayMode}
          />
        ) : null}
        {displayMode === DISPLAY_MODE_DAY ? (
          <DayShowComponent
            patient={patient}
            refreshAppointments={refreshAppointments}
            setIsShowForms={setIsShowForms}
            changeEventHandler={changeEventHandler}
            appointments={appointments}
            today={today}
            selectedAppointment={appointment}
            setSelectedAppointment={setAppointment}
            setIsShowPatientsModal={setIsShowPatientsModal}
          />
        ) : null}
      </ShadowWrapper>
      {isShowPatientsModal ? (
        <PatientsModal
          isOpened={isShowPatientsModal}
          modalOnClose={() => setIsShowPatientsModal(false)}
          changeEventHandler={changeEventHandler}
        />
      ) : null}
    </>
  );
}

export default App;
