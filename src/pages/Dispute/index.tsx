import React, { useState, useEffect } from 'react';
import checked from '../../assets/icons/checked.png';
import sandclock from '../../assets/icons/sandclock.png';
import rocket from '../..//assets/icons/rocket.png';
import styled from 'styled-components';
//import SectionHeader from "../../components/SectionHeader";
import DisputeTable from '../../components/DataTable/DisputeTable';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { DISPUTE_COLLECTION_NAME } from '../../constants/data';
import { db } from '../../utils/firebase';
import { userStore } from '../../store/userStore';
import { IDispute } from '../../constants/types';

const Dispute = () => {
  const [selectedSession, setSelectedSession] = useState<'pending' | 'resolved' | 'all'>('all');
  const [disputes, setDisputes] = useState<IDispute[]>([]);
  const [disputesBasedOnCategory, setDisputesBasedOnCategory] = useState<IDispute[]>([]);

  const User = userStore((store) => store.user);

  useEffect(() => {
    const colRef = collection(db, DISPUTE_COLLECTION_NAME);
    let unsubscribe: () => void | undefined;

    if (User?.uid) {
      const q = query(colRef, where('userId', '==', User.uid));

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const slots: any[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            slots.push({
              id: doc.id,
              ...data,
            });
          });
          setDisputes([...slots]);
          setDisputesBasedOnCategory([...slots]);
          console.log('i came in');
        },
        (error) => {
          console.error('Error fetching upcoming sessions:', error);
        }
      );
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [User]);

  useEffect(() => {
    const filteredDisputes = disputes.filter((dispute: IDispute) => {
      return dispute?.status === selectedSession;
    });
    setDisputesBasedOnCategory(selectedSession === 'all' ? disputes : filteredDisputes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSession]);

  const pendingDisputesCount = disputes.filter(
    (dispute: IDispute) => dispute.status === 'pending'
  ).length;
  const resolvedDisputesCount = disputes.filter(
    (dispute: IDispute) => dispute.status === 'resolved'
  ).length;

  return (
    <>
      <div className="pad">
        <StyledUserSessionStats>
          <StyledSessionStatsCard>
            <div className="flex-between">
              <div className="flex-column">
                <h6 className="s-16 mb-8">Pending</h6>
                <p className="s-14 mb-12">We are working towards the disputes you have raised</p>
                <h3>{pendingDisputesCount}</h3>
              </div>
              <div className="block-right">
                <img src={sandclock} alt="" />
              </div>
            </div>
          </StyledSessionStatsCard>
          <StyledSessionStatsCard>
            <div className="flex-between">
              <div className="flex-column">
                <h6 className="s-16 mb-8">Resolved</h6>
                <p className="s-14 mb-12">
                  This includes all the tickets whose disputes have been solved
                </p>
                <h3>{resolvedDisputesCount}</h3>
              </div>
              <div className="block-right">
                <img src={checked} alt="" />
              </div>
            </div>
          </StyledSessionStatsCard>
          <StyledSessionStatsCard>
            <div className="flex-between">
              <div className="flex-column">
                <h6 className="s-16 mb-8">Total Tickets</h6>
                <p className="s-14 mb-12">Including the resolved and the pending tickets</p>
                <h3>{disputes.length}</h3>
              </div>
              <div className="block-right">
                <img src={rocket} alt="" />
              </div>
            </div>
          </StyledSessionStatsCard>
        </StyledUserSessionStats>
        <SessionCategoryPart>
          {/* <SectionHeader
            title={`Check the status of the disputes raised`}
            description="Sed ut perspiciatis unde omnis iste natus error sit voluptatem "
          /> */}
          <SessionCategory>
            <div>
              <button
                onClick={() => {
                  setSelectedSession('pending');
                }}
                className={selectedSession === 'pending' ? 'active' : ''}
              >
                Pending
              </button>
              <button
                onClick={() => {
                  setSelectedSession('resolved');
                }}
                className={selectedSession === 'resolved' ? 'active' : ''}
              >
                Resolved
              </button>
              <button
                onClick={() => {
                  setSelectedSession('all');
                }}
                className={selectedSession === 'all' ? 'active' : ''}
              >
                Total Tickets
              </button>
            </div>
          </SessionCategory>
        </SessionCategoryPart>
        <DisputeTable disputes={disputesBasedOnCategory} />
      </div>
    </>
  );
};

export default Dispute;

const StyledUserSessionStats = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 20px;

  @media (max-width: 1080px) {
    gap: 30px;
  }

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 15px;
  }
`;

const StyledSessionStatsCard = styled.div`
  border-radius: 8px;
  border: 1px solid #ede7df;
  background: var(--white, #fff);
  padding: 25px;

  .flex-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .block-right {
    height: 100px;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    background: #fde9d2;
    border-radius: 50%;

    @media (max-width: 600px) {
      height: 50px;
    }

    img {
      width: 50px;
      height: 50px;
      object-fit: contain;

      @media (max-width: 600px) {
        width: 25px;
        height: 25px;
      }
    }
  }

  .flex-column {
    display: flex;
    flex-direction: column;

    p {
      @media (max-width: 600px) {
        display: none;
      }
    }
  }
`;

const SessionCategoryPart = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SessionCategory = styled.div`
  padding: 20px 0;
  overflow-x: auto;
  border-radius: 8px;

  > div {
    display: flex;
    padding: 5.5px 6px;
    align-items: flex-start;
    gap: 8px;
    border-radius: 8px;
    border: 1px solid #e8e8e8;
    background: var(--gray-1, #ecf0ef);
    width: fit-content;
    font-size: 14px;

    button {
      all: unset;
      padding: 10.5px 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 200ms linear;

      @media (max-width: 600px) {
        text-align: center;
      }

      &.active {
        font-weight: 600;
        background: #fff;
        box-shadow: 0px 1px 3px 0px rgba(72, 72, 72, 0.15);
      }
    }
  }
`;
