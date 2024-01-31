import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import _ from "lodash";

import SelectTutor from "../../components/SelectTutor";
import SelectTime from "../../components/SelectTutor/SelectTime";
import { TIME_SLOTS_COLLECTION_NAME } from "../../constants/data";
import { db } from "../../utils/firebase";
import { getEndOfDay, getStartOfDay } from "../../constants/formatter";
import { ITutorSlot, ITutorSlotDB, TDropdownList } from "../../constants/types";
import { useBookingFilterStore } from "../../store/useBookingFilterStore";
import { userStore } from "../../store/userStore";
import dayjs from "dayjs";

const BookSessionWrapper = () => {
  const [availableTutors, setAvailableTutors] = useState<ITutorSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<TDropdownList>();
  const selectedFilter = useBookingFilterStore((store) => store.selectedFilter);
  const profileData = userStore((store) => store.profileData);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const handleGetAvailableTutors = async (date: Date) => {
    setLoading(true);
    const timeSlotsRef = collection(db, TIME_SLOTS_COLLECTION_NAME);

    const startData = dayjs().isSame(date, "day") ? new Date() : getStartOfDay(date);

    const q = query(
      timeSlotsRef,
      where("startTime", ">=", startData),
      where("startTime", "<=", getEndOfDay(date))
    );

    const querySnapshot = await getDocs(q);

    const bookedSlots: ITutorSlotDB[] = [];
    querySnapshot.forEach((doc) => {
      bookedSlots.push({ id: doc.id, ...(doc.data() as Omit<ITutorSlotDB, "id">) });
    });

    setAvailableTutors(
      bookedSlots.map((b) => ({
        ...b,
        startTime: b.startTime.toDate(),
        endTime: b.endTime.toDate(),
      }))
    );

    setLoading(false);
  };

  const handleGetFavouriteTutors = async (date: Date) => {
    const timeSlotsRef = collection(db, TIME_SLOTS_COLLECTION_NAME);
    const q = query(
      timeSlotsRef,
      where("endTime", ">=", date),
      where("endTime", "<=", getEndOfDay(date))
      // where("tutor", "in", profileData?.favouriteTutors)
    );
    const querySnapshot = await getDocs(q);

    const bookedSlots: ITutorSlotDB[] = [];
    querySnapshot.forEach((doc) => {
      const docData = { id: doc.id, ...(doc.data() as Omit<ITutorSlotDB, "id">) };

      for (const tutor of docData.tutors) {
        if (profileData?.favouriteTutors?.some((s) => s === tutor.tutorId)) {
          bookedSlots.push(docData);
        }
      }
    });

    setAvailableTutors(
      bookedSlots.map((b) => ({
        ...b,
        startTime: b.startTime.toDate(),
        endTime: b.endTime.toDate(),
      }))
    );
  };

  const handleGetBookedSlotsByUser = useCallback(async () => {
    try {
      if (!selectedFilter) {
        await handleGetAvailableTutors(selectedDate);
        return;
      }
      if (selectedFilter === "Select Time and Date") {
        await handleGetAvailableTutors(selectedDate);
        return;
      }
      if (selectedFilter === "Based on Interests") {
        await handleGetAvailableTutors(selectedDate);
        return;
      }
      if (selectedFilter === "Favourite Teacher") {
        await handleGetFavouriteTutors(selectedDate);
        return;
      }
    } catch (error) {
      console.error("Error getting booked slots:", error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, selectedDate]);

  useEffect(() => {
    handleGetBookedSlotsByUser();
  }, [handleGetBookedSlotsByUser]);

  const filteredTutors = useMemo(() => {
    if (!availableTutors.length) return [];

    const tutors: { tutorId: string; isReserved: boolean }[] = [];

    availableTutors.forEach((list) => {
      list.tutors.forEach((tutor: any) => tutors.push(tutor));
    });

    return _.uniqBy(tutors, "tutorId");
  }, [availableTutors]);

  return (
    <div>
      <SelectTime
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <SelectTutor loading={loading} tutors={_.uniq(filteredTutors)} />
    </div>
  );
};

export default BookSessionWrapper;
