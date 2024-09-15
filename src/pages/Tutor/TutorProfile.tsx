import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { TIME_SLOTS_COLLECTION_NAME, TUTOR_COLLECTION_NAME } from '../../constants/data';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { useLockedBody } from 'usehooks-ts';
// import toast from 'react-hot-toast';

import { db } from '../../utils/firebase';
import ConfirmTutorModal from '../../components/Modal/ConfirmTutorModal';
import { Button } from '../../components';
import BookTutorModal from '../../components/Modal/BookTutorModal';
import { ReactComponent as ArrowLeftIcon } from '../../assets/icons/arrow-left.svg';
import { ITutorProfileData, ITutorSlot, EUserType } from '../../constants/types';
import TutorProfileDetails from './components/TutorProfileDetails';
import { getLocaleDate } from '../../constants/formatDate';
import { config } from '../../constants/config';
import { reminderStore } from '../../store/reminderStore';
import { userStore } from '../../store/userStore';
import SubscriptionEndedModal from '../../components/Modal/SubscriptionEndedModal';

const TutorProfile: React.FC<{ tutorId: string }> = ({ tutorId }) => {
  useLockedBody(true);
  const navigate = useNavigate();
  const [openSelectedTutorModal, setOpenSelectedTutorModal] = useState(false);
  const [selectDateModal, setSelectDateModal] = useState(false);
  const [tutorSlots, setTutorSlots] = useState<{ day: Date; slots: ITutorSlot[] }[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tutorData, setTutorData] = useState<ITutorProfileData | null>(null);
  const currentWeekEndDate = reminderStore((store) => store.endDate);
  const userType = userStore((store) => store.userType);
  const subscriptionData = userStore((store) => store.subscriptionData);
  const [isDemoClass, setIsDemoClass] = useState(false);
  const [openSubscribeToModal, setOpenSubscribeToModal] = useState(false);

  const handleGetData = useCallback(async () => {
    if (!tutorId) return;
    try {
      const docRef = doc(db, TUTOR_COLLECTION_NAME, tutorId);
      const userData = await getDoc(docRef);
      setTutorData(userData.data() as ITutorProfileData);

      let tempCurrentWeekEndDate = currentWeekEndDate;

      if (userType === EUserType.NEW_USER) {
        tempCurrentWeekEndDate = dayjs(currentWeekEndDate).add(3, 'days').toDate();
      }

      if (subscriptionData) {
        tempCurrentWeekEndDate = currentWeekEndDate;
      }

      const timeSlotsRef = collection(db, TIME_SLOTS_COLLECTION_NAME);
      const q = query(
        timeSlotsRef,
        where('startTime', '>=', new Date()),
        where('startTime', '<=', tempCurrentWeekEndDate)
      );

      const querySnapshot = await getDocs(q);

      const slots: any[] = [];
      querySnapshot.forEach((doc) => {
        slots.push({ id: doc.id, ...doc.data() });
      });

      const modifiedSlots = slots
        .filter((f) => f.tutors.some((s: any) => s.tutorId === tutorId))
        .map((b) => ({
          ...b,
          startTime: b.startTime.toDate(),
          endTime: b.endTime.toDate(),
        }));

      const groupedSlots = modifiedSlots.reduce((result, slot) => {
        const slotDay = slot.startTime.toISOString().substring(0, 10);

        if (!result[slotDay]) {
          result[slotDay] = [];
        }

        result[slotDay].push(slot);

        return result;
      }, {});

      // Convert the groupedSlots object into an array
      const groupedSlotsArray: any = Object.entries(groupedSlots).map(([day, slots]) => ({
        day: new Date(day),
        slots,
      }));

      setTutorSlots(groupedSlotsArray);
      if (groupedSlotsArray.length) {
        setSelectedDate(groupedSlotsArray[0].day);
      }
    } catch (error) {
      console.log(error);
    }
  }, [tutorId, currentWeekEndDate, subscriptionData, userType]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  const availableSlots = tutorSlots.filter((f) => dayjs(f.day).isSame(selectedDate, 'day'));

  const confirmTutorBtnDisabled = useMemo(() => {
    if (!availableSlots.length) return true;
    return !availableSlots[0].slots.some((s) => dayjs(s.startTime).isSame(selectedDate));
  }, [availableSlots, selectedDate]);

  const filteredAvailableSlots = useMemo(() => {
    if (!availableSlots.length) return [];

    return availableSlots[0].slots
      .filter((f) => f.tutors.some((s) => s.tutorId === tutorId))
      .filter((f) => {
        let sessionKind: 'DEMO' | 'SUBSCRIBED' | null = null;

        if (userType === EUserType.EXISTING_USER) {
          sessionKind = 'SUBSCRIBED';
        } else {
          sessionKind = 'DEMO';
        }

        if (subscriptionData) {
          if (subscriptionData?.demoClass) sessionKind = 'DEMO';
          else sessionKind = 'SUBSCRIBED';
        }

        const isDemoClass = Boolean(f.tutors.find((s) => s.tutorId === tutorId && s.isDemoClass));

        console.log({
          startTime: f.startTime.toISOString(),
          sessionKind,
          isDemoClass,
        });

        if (sessionKind === 'SUBSCRIBED' && isDemoClass) return false;

        if (sessionKind === 'DEMO' && !isDemoClass) return false;

        return dayjs(f.startTime).isAfter(
          dayjs().add(config.SHOW_AVAILABLE_SLOTS_BEFORE, 'minutes')
        );
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableSlots, subscriptionData]);

  if (!tutorId) return null;

  return (
    <StyledTutorProfile>
      <StyledTutorProfileContainer>
        <div className="banner-image">
          <button className="back-btn pointer" onClick={() => navigate(-1)}>
            <ArrowLeftIcon />
            <b>Back</b>
          </button>
        </div>
        <div className="pad">
          <StyledGridContainer>
            <TutorProfileDetails data={tutorData} />
            <StyledGridChildTwo>
              <div className="flex-column">
                <h6 className="mb-10">Available For Session </h6>
                <p className="mb-24">Start booking your session by selecting a date</p>
                {tutorSlots.length ? (
                  <StyledAvailableSessionWrapper>
                    {tutorSlots.slice(0, 5).map((slot, i) => (
                      <div
                        className={
                          dayjs(slot.day).isSame(selectedDate, 'day')
                            ? 'available-session active'
                            : 'available-session'
                        }
                        key={i.toString()}
                        onClick={() => setSelectedDate(slot.day)}
                      >
                        <p className="mb-10">{dayjs(slot.day).format('ddd')}</p>
                        <p>{getLocaleDate(slot.day)}</p>
                      </div>
                    ))}
                    {/* {tutorSlots.length > 2 && (
                      <button className="view-more" onClick={() => setSelectDateModal(true)}>
                        view more
                      </button>
                    )} */}
                  </StyledAvailableSessionWrapper>
                ) : (
                  <StyledNoDiv>
                    <p>No Slots Available</p>
                  </StyledNoDiv>
                )}
              </div>
              <div className="flex-column">
                <h6 className="mb-10">Available Time Slots </h6>
                <p className="mb-24">Select a Time Slot to Proceed</p>
                {availableSlots.length ? (
                  !availableSlots[0].slots.filter((f) => {
                    return dayjs(f.startTime).isAfter(
                      dayjs().add(config.SHOW_AVAILABLE_SLOTS_BEFORE, 'minutes')
                    );
                  }).length ? (
                    <StyledNoDiv>
                      <p>No Slots Available</p>
                    </StyledNoDiv>
                  ) : !filteredAvailableSlots.length ? (
                    <StyledNoDiv>
                      <p>No Slots Available</p>
                    </StyledNoDiv>
                  ) : (
                    <StyledTimingsWrapper>
                      {filteredAvailableSlots.map((slot, i) => (
                        <button
                          onClick={() => {
                            setSelectedDate(slot.startTime);
                            console.log(currentWeekEndDate);
                            // if (dayjs(slot.startTime).isBefore(endDate, 'minutes')) {
                            //   setSelectedDate(slot.startTime);
                            // } else if (dayjs(slot.startTime).isSame(endDate, 'minutes')) {
                            //   setSelectedDate(slot.startTime);
                            // } else {
                            //   toast.error('Booking on this date is restricted');
                            // }
                            setIsDemoClass(
                              Boolean(
                                slot.tutors.find((s) => s.tutorId === tutorId && s.isDemoClass)
                              )
                            );
                          }}
                          className={
                            dayjs(slot.startTime).isSame(selectedDate)
                              ? 'available-timings active'
                              : 'available-timings'
                          }
                          key={i.toString()}
                          disabled={Boolean(
                            slot.tutors.find((s) => s.tutorId === tutorId && s.isReserved)
                          )}
                        >
                          {Boolean(
                            slot.tutors.find((s) => s.tutorId === tutorId && s?.isDemoClass)
                          ) && <span className="demo-flag">DEMO SESSION</span>}
                          <p>{dayjs(slot.startTime).format('hh:mm a')}</p>
                          {Boolean(
                            slot.tutors.find((s) => s.tutorId === tutorId && s.isReserved)
                          ) ? (
                            <span>Reserved</span>
                          ) : null}
                        </button>
                      ))}
                    </StyledTimingsWrapper>
                  )
                ) : (
                  <StyledNoDiv>
                    <p>No Slots Available</p>
                  </StyledNoDiv>
                )}
              </div>
              <Button
                disabled={confirmTutorBtnDisabled}
                onClick={() => setOpenSelectedTutorModal(true)}
              >
                Confirm Tutor
              </Button>
            </StyledGridChildTwo>
          </StyledGridContainer>
        </div>
      </StyledTutorProfileContainer>
      {openSelectedTutorModal && (
        <ConfirmTutorModal
          isOpen={openSelectedTutorModal}
          handleClose={(showSubscribeModal) => {
            if (Boolean(showSubscribeModal)) {
              setOpenSelectedTutorModal(false);
              setOpenSubscribeToModal(true);
              return;
            }

            setOpenSelectedTutorModal(false);
          }}
          selectedDate={selectedDate}
          tutorId={tutorId}
          isDemoClass={isDemoClass}
        />
      )}
      {selectDateModal && (
        <BookTutorModal isOpen={selectDateModal} handleClose={() => setSelectDateModal(false)} />
      )}
      {openSubscribeToModal && <SubscriptionEndedModal isOpen />}
    </StyledTutorProfile>
  );
};

const StyledTutorProfile = styled.div`
  background: #fff;
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  z-index: 100;
  overflow-y: auto;
`;

const StyledTutorProfileContainer = styled.div`
  .banner-image {
    background: #fceede;
    height: 150px;
    position: relative;

    .back-btn {
      position: absolute;
      top: 20px;
      left: 20px;
      display: flex;
      align-items: center;
      gap: 5px;
      background: transparent;
      border: none;
      outline: none;

      svg {
        width: 18px;
        height: 18px;
      }
    }
  }
`;

const StyledGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 80px;
  padding: 70px 0;

  @media (max-width: 800px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 30px;
  }
`;

const StyledGridChildTwo = styled.div`
  display: flex;
  flex-direction: column;

  .flex-column {
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;

    h6 {
      color: #000100;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    p {
      color: #646464;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }
`;

const StyledAvailableSessionWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;

  .available-session {
    border-radius: 9px;
    border: 1.5px solid rgba(204, 204, 204, 0.8);
    background: var(--white, #fff);
    padding: 14px 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: background 200ms linear;
    cursor: pointer;

    &:hover {
      background: var(--primary-2, #fff1e0);
    }

    &.active {
      background: var(--primary-2, #fff1e0);
      border: 1.5px solid var(--primary);
    }

    p {
      color: var(--gray-2, #62635e);
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      white-space: nowrap;
    }
  }

  > button {
    all: unset;
    color: var(--primary-1, #f7941f);
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    cursor: pointer;
    text-align: center;
  }
`;

const StyledTimingsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  .available-timings {
    all: unset;
    border-radius: 10px;
    border: 1.5px solid rgba(204, 204, 204, 0.8);
    background: var(--white, #fff);
    padding: 14px 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: background 200ms linear;
    cursor: pointer;
    position: relative;

    &:hover {
      background: var(--primary-2, #fff1e0);
    }

    &:disabled {
      opacity: 0.7;
      cursor: no-drop;

      &:hover {
        background: var(--white, #fff);
      }
    }

    &.active {
      background: var(--primary-2, #fff1e0);
      border: 1.5px solid var(--primary);
    }

    .demo-flag {
      position: absolute;
      top: -10px;
      right: -10px;
      background: var(--primary-2, #fff1e0);
      padding: 2px 10px;
      border-radius: 5px;
      box-shadow: 0.1px 0.1px 5px rgba(0, 0, 0, 0.1);
      border: 0.5px solid rgba(204, 204, 204, 0.8);
    }

    p {
      color: var(--gray-2, #62635e);
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      text-align: center;
      white-space: nowrap;
    }

    span {
      color: var(--gray-2, #62635e);
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      text-align: center;
    }
  }
`;

const StyledNoDiv = styled.div`
  text-align: center;
  padding: 20px;
`;

export default TutorProfile;
