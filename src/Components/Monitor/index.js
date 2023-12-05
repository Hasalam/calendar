import React from "react";
import styled from "styled-components";
import { DISPLAY_MODE_DAY, DISPLAY_MODE_MONTH } from "../../Helpers/const";

const DivWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #1e1f21;
  color: #dcdddd;
  padding: 16px;
  position: relative;
`;

const TextWrappet = styled.span`
  font-size: 32px;
`;

const TitleWrapper = styled(TextWrappet)`
  font-weight: bold;
  margin-right: 8px;
  margin-left: 8px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonCenterWrapper = styled(ButtonsWrapper)`
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
`;

const ButtonWrapper = styled.button`
    border:unset;
    background-color:${(props) => (props.unPressed ? "#2728A" : "#565759")};
    border: 1px solid #565759
    margin-right:2px;
    border-radius:4px;
    color: ${(props) => (props.unPressed ? "#565759" : "#E6E6E6")};
    outline:unset;
    cursor:pointer;
    &:not(:last-child){
      margin-right: 2px;
    }
    display: flex;
    justify-content: center;
    align-items:center;
`;

const TodayButton = styled(ButtonWrapper)`
  padding-right: 16px;
  padding-left: 16px;
  font-weight: bold;
`;

const Monitor = ({
  today,
  prevHendler,
  nextHandler,
  todayHandler,
  setDisplayMode,
  displayMode,
}) => {
  return (
    <DivWrapper>
      <div>
        {displayMode === DISPLAY_MODE_DAY && (
          <TitleWrapper>{today.format("DD ")}</TitleWrapper>
        )}
        <TitleWrapper>{today.format("MMMM")}</TitleWrapper>
        <TextWrappet>{today.format("YYYY")}</TextWrappet>
      </div>
      <ButtonCenterWrapper>
        <ButtonWrapper
          unPressed={displayMode === DISPLAY_MODE_MONTH}
          onClick={() => {
            setDisplayMode(DISPLAY_MODE_MONTH);
          }}
        >
          Month
        </ButtonWrapper>
        <ButtonWrapper
          unPressed={displayMode === DISPLAY_MODE_DAY}
          onClick={() => {
            setDisplayMode(DISPLAY_MODE_DAY);
          }}
        >
          Day
        </ButtonWrapper>
      </ButtonCenterWrapper>
      <ButtonsWrapper>
        <ButtonWrapper onClick={prevHendler}>&lt;</ButtonWrapper>
        <TodayButton onClick={todayHandler}>Today</TodayButton>
        <ButtonWrapper onClick={nextHandler}>&gt;</ButtonWrapper>
      </ButtonsWrapper>
    </DivWrapper>
  );
};

export { Monitor };
