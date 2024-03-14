import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import { User } from 'firebase/auth';
import dayjs from 'dayjs';

import SelectTutor from '../../components/SelectTutor';
import SelectTime from '../../components/SelectTutor/SelectTime';
import { TIME_SLOTS_COLLECTION_NAME } from '../../constants/data';
import { db } from '../../utils/firebase';
import { getEndOfDay, getStartOfDay } from '../../constants/formatter';
import { ITutorProfileData, ITutorSlotDB, TDropdownList } from '../../constants/types';
import { useBookingFilterStore } from '../../store/useBookingFilterStore';
import { userStore } from '../../store/userStore';
import { getTutorBlockedUsersDoc, getTutorDoc } from '../../services/tutorService';

const BookSessionWrapper = () => {
  const [selectedTime, setSelectedTime] = useState<TDropdownList>();
  const selectedFilter = useBookingFilterStore((store) => store.selectedFilter);
  const profileData = userStore((store) => store.profileData);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [tutorsData, setTutorsData] = useState<ITutorProfileData[]>([]);
  const user = userStore((store) => store.user);

  const handleGetAvailableTutors = async (date: Date, user: User) => {
    try {
      setLoading(true);
      const timeSlotsRef = collection(db, TIME_SLOTS_COLLECTION_NAME);

      const startData = dayjs().isSame(date, 'day') ? new Date() : getStartOfDay(date);

      const q = query(
        timeSlotsRef,
        where('startTime', '>=', startData),
        where('startTime', '<=', getEndOfDay(date))
      );

      const querySnapshot = await getDocs(q);

      const bookedSlots: ITutorSlotDB[] = [];
      querySnapshot.forEach((doc) => {
        bookedSlots.push({ id: doc.id, ...(doc.data() as Omit<ITutorSlotDB, 'id'>) });
      });

      const availableTutors = bookedSlots.map((b) => ({
        ...b,
        startTime: b.startTime.toDate(),
        endTime: b.endTime.toDate(),
      }));

      const tutors: { tutorId: string; isReserved: boolean }[] = [];

      availableTutors.forEach((list) => {
        list.tutors.forEach((tutor: any) => tutors.push(tutor));
      });

      const filteredTutors = _.uniqBy(tutors, 'tutorId');

      const uniqTutors = _.uniq(filteredTutors);

      const result = await Promise.all(
        uniqTutors.map(async (tutor) => {
          return await getTutorDoc(tutor.tutorId);
        })
      );

      const blockedTutorsList = await getTutorBlockedUsersDoc(user.uid);

      const filteredResult = result.filter((f) => !blockedTutorsList.some((s) => s.id === f.id));

      setTutorsData(filteredResult);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetFavouriteTutors = async (date: Date, user: User) => {
    setLoading(true);

    const timeSlotsRef = collection(db, TIME_SLOTS_COLLECTION_NAME);
    const q = query(
      timeSlotsRef,
      where('endTime', '>=', date),
      where('endTime', '<=', getEndOfDay(date))
      // where("tutor", "in", profileData?.favouriteTutors)
    );
    const querySnapshot = await getDocs(q);

    const bookedSlots: ITutorSlotDB[] = [];
    querySnapshot.forEach((doc) => {
      const docData = { id: doc.id, ...(doc.data() as Omit<ITutorSlotDB, 'id'>) };

      for (const tutor of docData.tutors) {
        if (profileData?.favouriteTutors?.some((s) => s === tutor.tutorId)) {
          bookedSlots.push(docData);
        }
      }
    });

    const availableTutors = bookedSlots.map((b) => ({
      ...b,
      startTime: b.startTime.toDate(),
      endTime: b.endTime.toDate(),
    }));

    const tutors: { tutorId: string; isReserved: boolean }[] = [];

    availableTutors.forEach((list) => {
      list.tutors.forEach((tutor: any) => tutors.push(tutor));
    });

    const filteredTutors = _.uniqBy(tutors, 'tutorId');

    const uniqTutors = _.uniq(filteredTutors);

    const result = await Promise.all(
      uniqTutors.map(async (tutor) => {
        return await getTutorDoc(tutor.tutorId);
      })
    );

    const favouriteTutors = profileData?.favouriteTutors || [];
    const blockedTutorsList = await getTutorBlockedUsersDoc(user.uid);

    const filteredResult = result
      .filter((f) => !blockedTutorsList.some((s) => s.id === f.id))
      .filter((f) => favouriteTutors.some((s) => s === f.id));

    setTutorsData(filteredResult);
    setLoading(false);
  };

  const handleGetBookedSlotsByUser = useCallback(async () => {
    try {
      if (!user) return;

      if (!selectedFilter) {
        await handleGetAvailableTutors(selectedDate, user);
        return;
      }
      if (selectedFilter === 'Select Time and Date') {
        await handleGetAvailableTutors(selectedDate, user);
        return;
      }
      if (selectedFilter === 'Based on Interests') {
        await handleGetAvailableTutors(selectedDate, user);
        return;
      }
      if (selectedFilter === 'Favourite Teacher') {
        await handleGetFavouriteTutors(selectedDate, user);
        return;
      }
    } catch (error) {
      console.error('Error getting booked slots:', error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, selectedDate, user]);

  useEffect(() => {
    handleGetBookedSlotsByUser();
  }, [handleGetBookedSlotsByUser]);

  return (
    <div>
      <SelectTime
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <SelectTutor loading={loading} tutors={tutorsData} />
    </div>
  );
};

export default BookSessionWrapper;
