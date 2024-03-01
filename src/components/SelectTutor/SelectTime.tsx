import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { ReactComponent as DownArrowIcon } from '../../assets/icons/arrow_down.svg';
// import { generateTimeIntervalsWithDate } from "../../constants/formatter";
// import Dropdown from "../Dropdown";
import { TDropdownList } from '../../constants/types';
import { reminderStore } from '../../store/reminderStore';
import toast from 'react-hot-toast';
import { userStore } from '../../store/userStore';
// import ButtonGroup from "../ButtonGroup";
// import { meridianList } from "../../constants/data";

const SelectTimeContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  gap: 40px;
  margin-bottom: 40px;

  h4 {
    font-weight: 500;
    font-size: 18px;
    color: var(--black, #000);
  }
`;

const BlockOne = styled.div`
  .slider {
    display: flex;
    align-items: center;
    gap: 15px;

    @media (max-width: 600px) {
      display: none;
    }

    button {
      all: unset;
      border-radius: 50%;
      padding: 10px;
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: background-color 100ms linear;

      &:hover {
        background-color: #ccc;
      }

      &.prev {
        transform: rotate(90deg);
      }
      &.next {
        transform: rotate(270deg);
      }
    }
  }

  ul {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 16px;
    margin-top: 20px;

    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      cursor: pointer;

      &.active {
        p {
          color: var(--primary);
        }

        span {
          background-color: var(--primary-2, #fff1e0);
        }
      }

      &.invalid-date {
        opacity: 0.5;
        cursor: no-drop;
      }

      p {
        color: var(--gray-2, #62635e);
        font-size: 16px;
      }

      span {
        border-radius: 10px;
        border: 1px solid #ccc;
        background: #fff;
        padding: 5px;
        aspect-ratio: 1;
        display: grid;
        place-items: center;
        font-size: 14px;
      }
    }
  }

  .slider-mob {
    display: none;
    max-width: 100%;
    width: 100%;

    @media (max-width: 600px) {
      display: flex;
    }

    ul {
      grid-template-columns: repeat(4, 1fr);
    }
  }
`;

// const BlockTwo = styled.div`
//   .flex {
//     display: flex;
//     justify-content: space-between;
//     gap: 20px;

//     > div:nth-child(1) {
//       min-width: 300px;

//       .select-time-dropdown-list {
//         text-align: center;
//       }
//     }
//   }
// `;

interface ISelectTimeProps {
  selectedTime: TDropdownList | undefined;
  setSelectedTime: React.Dispatch<React.SetStateAction<TDropdownList | undefined>>;
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}

const SelectTime: React.FC<ISelectTimeProps> = ({ selectedDate, setSelectedDate }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState('');
  const endDate = reminderStore((store) => store.endDate);
  const subscriptionData = userStore((store) => store.subscriptionData);

  // const [selectedMeridian, setSelectedMeridian] = useState<TDropdownList>(meridianList[0]);

  // const intervals = generateTimeIntervalsWithDate(selectedDate, 9, 24, 30);

  // const filteredIntervals = intervals
  //   .map((m) => ({
  //     name: dayjs(m.start).format("hh:mm a"),
  //     value: m.start.toISOString(),
  //   }))
  //   .filter((f) => f.name.includes(selectedMeridian.value));

  const getWeekDays = () => {
    const startDateCopy = new Date(startDate);

    const weekDays = [...Array(7)].map((_, index) => {
      const date = new Date(startDateCopy);

      return date.setDate(date.getDate() + index);
    });

    return weekDays;
  };

  const getWeekDaysMobile = () => {
    const startDateCopy = new Date(startDate);

    const weekDays = [...Array(4)].map((_, index) => {
      const date = new Date(startDateCopy);

      return date.setDate(date.getDate() + index);
    });

    return weekDays;
  };

  useEffect(() => {
    const monthName = startDate.toLocaleString('default', { month: 'long' });
    setCurrentMonth(monthName);
  }, [startDate]);

  const handlePrevWeek = () => {
    const today = new Date();
    const startOfPrevWeek = new Date(startDate);
    startOfPrevWeek.setDate(startOfPrevWeek.getDate() - 7);

    if (startOfPrevWeek < today) {
      setStartDate(today);
    } else {
      setStartDate(startOfPrevWeek);
    }
  };

  const handleNextWeek = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + 7);
    setStartDate(newDate);
  };

  const handleNextWeekMob = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + 4);
    setStartDate(newDate);
  };

  const isCurrentWeek = () => {
    const today = new Date();
    const startOfCurrentWeek = new Date(startDate);
    startOfCurrentWeek.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return (
      today >= startOfCurrentWeek &&
      today < new Date(startOfCurrentWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
    );
  };

  useMemo(() => {
    if (subscriptionData) {
    }
  }, [subscriptionData]);

  return (
    <SelectTimeContainer>
      <BlockOne className="session-card">
        <div className="flex-between">
          <h4>Select Date :</h4>
          <p>
            {currentMonth} {startDate.getFullYear()}
          </p>
        </div>
        <div className="slider">
          <button className="prev" onClick={() => handlePrevWeek()} disabled={isCurrentWeek()}>
            <DownArrowIcon />
          </button>
          <ul>
            {getWeekDays().map((data, index) => (
              <li
                key={index.toString()}
                className={
                  // selectedDate.toISOString() === new Date(data).toISOString() ? "active" : ""
                  dayjs(selectedDate).isSame(data, 'day')
                    ? 'active'
                    : dayjs(data).isBefore(endDate, 'day')
                    ? 'valid-date'
                    : dayjs(data).isSame(endDate, 'day')
                    ? 'valid-date'
                    : subscriptionData
                    ? 'invalid-date'
                    : 'valid-date'
                }
                onClick={() => {
                  if (!subscriptionData) {
                    setSelectedDate(new Date(data));
                    return;
                  }
                  if (dayjs(data).isBefore(endDate, 'day')) {
                    setSelectedDate(new Date(data));
                  } else if (dayjs(data).isSame(endDate, 'day')) {
                    setSelectedDate(new Date(data));
                  } else {
                    toast.error('Booking on this date is restricted');
                  }
                }}
              >
                <p>{dayjs(data).format('ddd')}</p>
                <span>{dayjs(data).format('DD')}</span>
              </li>
            ))}
          </ul>
          <button className="next" onClick={() => handleNextWeek()}>
            <DownArrowIcon />
          </button>
        </div>
        <div className="slider slider-mob">
          <button className="prev" onClick={() => handlePrevWeek()} disabled={isCurrentWeek()}>
            <DownArrowIcon />
          </button>
          <ul>
            {getWeekDaysMobile().map((data, index) => (
              <li
                key={index.toString()}
                className={
                  // selectedDate.toISOString() === new Date(data).toISOString() ? "active" : ""
                  dayjs(selectedDate).isSame(data, 'day')
                    ? 'active'
                    : dayjs(data).isBefore(endDate, 'day')
                    ? 'valid-date'
                    : dayjs(data).isSame(endDate, 'day')
                    ? 'valid-date'
                    : 'invalid-date'
                }
                onClick={() => {
                  if (dayjs(data).isBefore(endDate, 'day')) {
                    setSelectedDate(new Date(data));
                  } else if (dayjs(data).isSame(endDate, 'day')) {
                    setSelectedDate(new Date(data));
                  } else {
                    toast.error('Booking on this date is restricted');
                  }
                }}
              >
                <p>{dayjs(data).format('ddd')}</p>
                <span>{dayjs(data).format('DD')}</span>
              </li>
            ))}
          </ul>
          <button className="next" onClick={() => handleNextWeekMob()}>
            <DownArrowIcon />
          </button>
        </div>
      </BlockOne>
      {/* {selectedDate && (
        <BlockTwo className="session-card">
          <div className="flex-between">
            <h4>Select Time :</h4>
          </div>
          <div className="flex">
            <Dropdown
              list={filteredIntervals}
              selectedList={selectedTime}
              setSelectedList={setSelectedTime}
              placeholder="Select a Time Range"
              dropdownListClassName="select-time-dropdown-list"
            />
            <ButtonGroup
              list={meridianList}
              activeList={selectedMeridian}
              setActiveList={setSelectedMeridian}
            />
          </div>
        </BlockTwo>
      )} */}
    </SelectTimeContainer>
  );
};

export default SelectTime;
