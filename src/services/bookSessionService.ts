import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  runTransaction,
  Timestamp,
  where,
} from 'firebase/firestore';
import { v4 } from 'uuid';

import {
  BOOKINGS_COLLECTION_NAME,
  SUBSCRIPTION_COLLECTION_NAME,
  TIME_SLOTS_COLLECTION_NAME,
  TUTOR_COLLECTION_NAME,
  USER_COLLECTION_NAME,
} from '../constants/data';
import { EBookingStatus, IBookingSessionDB } from '../constants/types';
import { db } from '../utils/firebase';
import { config } from '../constants/config';

export const createBookSessionDoc = async (
  tutorId: string,
  isDemoClass: boolean,
  useBacklogSession: boolean,
  data: DocumentData
) => {
  await runTransaction(db, async (transaction) => {
    const bookDocRef = doc(db, BOOKINGS_COLLECTION_NAME, v4());

    const docRef = doc(db, TIME_SLOTS_COLLECTION_NAME, data.slotId);
    const userDocRef = doc(db, USER_COLLECTION_NAME, data.user);

    const timeSlotData = await transaction.get(docRef);
    const userData = await transaction.get(userDocRef);

    if (!userData.exists()) {
      throw new Error('User does not exist.');
    }

    if (!timeSlotData.exists()) {
      throw new Error('Time slot does not exist.');
    }

    const sessionData = { ...data };

    const slotData = timeSlotData.data();
    const updatedArray = slotData.tutors.map((tutor: any) => {
      if (tutor.tutorId === tutorId) {
        return { ...tutor, isReserved: true };
      }
      return tutor;
    });

    transaction.update(docRef, {
      tutors: updatedArray,
    });

    if (data.topicInfo.title) {
      const finishedTopicsColRef = doc(
        db,
        USER_COLLECTION_NAME,
        data.user,
        'FinishedTopics',
        data.topicInfo.category
      );

      transaction.set(
        finishedTopicsColRef,
        {
          category: data.topicInfo.category,
          title: arrayUnion(data.topicInfo.title),
        },
        { merge: true }
      );
    }

    const subscriptionRef = doc(db, SUBSCRIPTION_COLLECTION_NAME, data.subscriptionId);

    if (useBacklogSession) {
      transaction.update(subscriptionRef, {
        backlogSession: increment(-1),
      });
      sessionData.sessionType = 'backlog';
    } else {
      transaction.update(subscriptionRef, {
        bookedSession: increment(1),
      });
    }

    transaction.update(userDocRef, {
      totalClassBooked: increment(1),
    });

    if (!isDemoClass) {
      transaction.set(bookDocRef, {
        ...sessionData,
        currentSession: userData.data()?.totalClassBooked + 1 ?? 0,
      });
    } else {
      transaction.set(bookDocRef, {
        ...sessionData,
      });
    }
  });
};

interface ITopicInfo {
  title: string;
  category: string;
}

export const updateBookSessionDoc = async (
  id: string,
  data: DocumentData,
  oldTopicInfo: ITopicInfo,
  userId: string
) => {
  await runTransaction(db, async (transaction) => {
    const docRef = doc(db, BOOKINGS_COLLECTION_NAME, id);
    transaction.update(docRef, data);

    const finishedTopicsColRef = doc(
      db,
      USER_COLLECTION_NAME,
      userId,
      'FinishedTopics',
      data.topicInfo.category
    );

    const deleteTopicsColRef = doc(
      db,
      USER_COLLECTION_NAME,
      userId,
      'FinishedTopics',
      oldTopicInfo.category
    );

    transaction.set(
      finishedTopicsColRef,
      {
        category: data.topicInfo.category,
        title: arrayUnion(data.topicInfo.title),
      },
      { merge: true }
    );

    transaction.set(
      deleteTopicsColRef,
      {
        title: arrayRemove(oldTopicInfo.title),
      },
      { merge: true }
    );
  });
};

export const deleteBookSessionDoc = async (id: string, topicInfo: ITopicInfo) => {
  await runTransaction(db, async (transaction) => {
    const docRef = doc(db, BOOKINGS_COLLECTION_NAME, id);
    const bookSessionDoc = await transaction.get(docRef);
    if (!bookSessionDoc.exists()) throw new Error('No session found');
    const bookSessionData = bookSessionDoc.data() as IBookingSessionDB;

    const timeSlotDocRef = doc(db, TIME_SLOTS_COLLECTION_NAME, bookSessionData.slotId);
    const timeSlotDoc = await transaction.get(timeSlotDocRef);
    if (!timeSlotDoc.exists()) throw new Error('No slots found');
    const timeSlotData = timeSlotDoc.data();

    const subscriptionDocRef = doc(
      db,
      SUBSCRIPTION_COLLECTION_NAME,
      bookSessionData.subscriptionId
    );
    const subscriptionDoc = await transaction.get(subscriptionDocRef);
    if (!subscriptionDoc.exists()) throw new Error('No subscription found');

    if (subscriptionDoc.data()?.demoClass === true) {
      if (subscriptionDoc.data().cancelledSession >= config.CANCEL_DEMO_SESSION_COUNT) {
        throw new Error('your cancel quota over');
      }
    } else {
      if (subscriptionDoc.data().cancelledSession >= config.CANCEL_SESSION_COUNT) {
        throw new Error('your cancel quota over');
      }
    }

    const updatedArray = timeSlotData.tutors.map((tutor: any) => {
      if (tutor.tutorId === bookSessionData.tutor) {
        return { ...tutor, isReserved: false };
      }
      return tutor;
    });

    transaction.update(timeSlotDocRef, {
      tutors: updatedArray,
    });
    transaction.update(docRef, {
      status: 'USER_CANCELLED',
      updateAt: Timestamp.now(),
    });
    transaction.update(subscriptionDocRef, {
      bookedSession: increment(-1),
      cancelledSession: increment(1),
    });

    const deleteTopicsColRef = doc(
      db,
      USER_COLLECTION_NAME,
      bookSessionData.user,
      'FinishedTopics',
      topicInfo.category
    );
    transaction.set(
      deleteTopicsColRef,
      {
        title: arrayRemove(topicInfo.title),
      },
      { merge: true }
    );
  });
};

export const deleteDemoBookSessionDoc = async (id: string, topicInfo: ITopicInfo) => {
  await runTransaction(db, async (transaction) => {
    const docRef = doc(db, BOOKINGS_COLLECTION_NAME, id);
    const bookSessionDoc = await transaction.get(docRef);
    if (!bookSessionDoc.exists()) throw new Error('No session found');
    const bookSessionData = bookSessionDoc.data() as IBookingSessionDB;

    const timeSlotDocRef = doc(db, TIME_SLOTS_COLLECTION_NAME, bookSessionData.slotId);
    const timeSlotDoc = await transaction.get(timeSlotDocRef);
    if (!timeSlotDoc.exists()) throw new Error('No slots found');
    const timeSlotData = timeSlotDoc.data();

    const userDocRef = doc(db, USER_COLLECTION_NAME, bookSessionData.user);
    const userDoc = await transaction.get(userDocRef);
    if (!userDoc.exists()) throw new Error('No user found');

    const subscriptionDocRef = doc(
      db,
      SUBSCRIPTION_COLLECTION_NAME,
      bookSessionData.subscriptionId
    );
    const subscriptionDoc = await transaction.get(subscriptionDocRef);
    if (!subscriptionDoc.exists()) throw new Error('No subscription found');

    if (subscriptionDoc.data()?.demoClass === true) {
      if (subscriptionDoc.data().cancelledSession >= config.CANCEL_DEMO_SESSION_COUNT) {
        throw new Error('your cancel quota over');
      }
    } else {
      if (subscriptionDoc.data().cancelledSession >= config.CANCEL_SESSION_COUNT) {
        throw new Error('your cancel quota over');
      }
    }

    const updatedArray = timeSlotData.tutors.map((tutor: any) => {
      if (tutor.tutorId === bookSessionData.tutor) {
        return { ...tutor, isReserved: false };
      }
      return tutor;
    });

    transaction.update(timeSlotDocRef, {
      tutors: updatedArray,
    });
    transaction.update(docRef, {
      status: 'USER_CANCELLED',
      updatedAt: Timestamp.now(),
    });
    transaction.update(subscriptionDocRef, {
      cancelledSession: increment(1),
      bookedSession: 0,
    });
    transaction.update(userDocRef, { demoClassBooked: false });

    const deleteTopicsColRef = doc(
      db,
      USER_COLLECTION_NAME,
      bookSessionData.user,
      'FinishedTopics',
      topicInfo.category
    );
    transaction.set(
      deleteTopicsColRef,
      {
        title: arrayRemove(topicInfo.title),
      },
      { merge: true }
    );
  });
};

export const getBookingSessionDoc = async (docId: string) => {
  const docRef = doc(db, BOOKINGS_COLLECTION_NAME, docId);
  const docResult = await getDoc(docRef);
  const docData = docResult.data() as Omit<IBookingSessionDB, 'id'>;

  if (!docData) return null;

  return { id: docResult.id, ...docData };
};

export const getUserBookedSessionOnThisWeekDoc = async (
  userId: string,
  subscriptionId: string,
  startDate: Date,
  endDate: Date
) => {
  const colRef = collection(db, BOOKINGS_COLLECTION_NAME);
  const q = query(
    colRef,
    where('user', '==', userId),
    where('subscriptionId', '==', subscriptionId),
    where('startTime', '>=', startDate),
    where('startTime', '<=', endDate),
    where('status', 'in', [
      EBookingStatus.COMPLETED,
      EBookingStatus.UPCOMING,
      EBookingStatus.MISSED,
    ])
  );

  const collectionResult = await getDocs(q);

  return collectionResult.docs.map((m) => ({
    ...(m.data() as Omit<IBookingSessionDB, 'id'>),
    id: m.id,
  }));
};

export const getUserCompletedSessionOnSubscriptionDoc = async (
  userId: string,
  subscriptionId: string,
  startDate: Date,
  endDate: Date
) => {
  const colRef = collection(db, BOOKINGS_COLLECTION_NAME);
  const q = query(
    colRef,
    where('user', '==', userId),
    where('subscriptionId', '==', subscriptionId),
    where('startTime', '>=', startDate),
    where('startTime', '<=', endDate),
    where('status', 'in', [EBookingStatus.COMPLETED, EBookingStatus.UPCOMING])
  );

  const collectionResult = await getDocs(q);

  return collectionResult.docs.map((d) => ({ id: d.id, ...d.data() })) as IBookingSessionDB[];
};

export const getUserBookedSessionDoc = async (
  userId: string,
  subscriptionId: string,
  startDate: Date,
  endDate: Date
) => {
  const colRef = collection(db, BOOKINGS_COLLECTION_NAME);
  const q = query(
    colRef,
    where('user', '==', userId),
    where('subscriptionId', '==', subscriptionId),
    where('startTime', '>=', startDate),
    where('startTime', '<=', endDate),
    where('status', 'in', [
      EBookingStatus.UPCOMING,
      EBookingStatus.COMPLETED,
      EBookingStatus.MISSED,
    ]),
    orderBy('startTime', 'asc')
  );

  const collectionResult = await getDocs(q);

  return collectionResult.docs.map((d) => ({ id: d.id, ...d.data() })) as IBookingSessionDB[];
};

export const updateFeedback = async (docId: string, data: DocumentData, rating: number) => {
  await runTransaction(db, async (transaction) => {
    const docRef = doc(db, BOOKINGS_COLLECTION_NAME, docId);
    const docData = (await transaction.get(docRef)).data() as IBookingSessionDB;
    if (!docData) return;

    // USER FEEDBACK OF SESSION
    transaction.update(docRef, data);

    // TUTOR COLLECTION RATING UPDATE
    const tutorDocRef = doc(db, TUTOR_COLLECTION_NAME, docData.tutor);
    transaction.update(tutorDocRef, {
      totalRatings: increment(rating),
      totalRatingsCount: increment(1),
    });
  });
};

export const getUserCompletedSessionDoc = async (userId: string, endDate: Date) => {
  const colRef = collection(db, BOOKINGS_COLLECTION_NAME);
  const q = query(
    colRef,
    where('user', '==', userId),
    where('startTime', '<', endDate),
    where('status', 'in', [EBookingStatus.COMPLETED]),
    orderBy('startTime', 'asc')
  );

  const collectionResult = await getDocs(q);

  return collectionResult.docs.map((d) => ({ id: d.id, ...d.data() })) as IBookingSessionDB[];
};
