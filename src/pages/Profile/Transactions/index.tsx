import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import TransactionCard from '../../../components/TransactionCard';
import { ITransactionDB } from '../../../constants/types';
import { userStore } from '../../../store/userStore';
import { SUBSCRIPTION_COLLECTION_NAME } from '../../../constants/data';
import { db } from '../../../utils/firebase';
import SessionCardLoader from '../../../components/Loader/SessionCardLoader';

const MyTransactions = () => {
  const user = userStore((store) => store.user);
  const [transactionData, setTransactionData] = useState<ITransactionDB[]>([]);
  const [loading, setLoading] = useState(true);

  const handleGetData = useCallback(async () => {
    if (!user) return;
    const colRef = collection(db, SUBSCRIPTION_COLLECTION_NAME);
    const q = query(
      colRef,
      where('user', '==', user.uid),
      where('status', 'in', ['SUCCESS', 'FAILED']),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const slots: ITransactionDB[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as Omit<ITransactionDB, 'id'>;
          slots.push({
            id: doc.id,
            ...data,
          });
        });
        setTransactionData(slots);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching upcoming sessions:', error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  return (
    <StyledContainer>
      <StyledTransactions>
        <StyledTransactionsWrappper>
          {loading ? (
            <SessionCardLoader count={3} />
          ) : !transactionData.length ? (
            <>No Transaction Found</>
          ) : (
            transactionData.map((transaction) => (
              <TransactionCard key={transaction.id} {...transaction} />
            ))
          )}
        </StyledTransactionsWrappper>
      </StyledTransactions>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  padding-bottom: 30px;
`;

const StyledTransactions = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;

  > h5 {
    margin-bottom: 24px;
    color: var(--text-primary);
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

const StyledTransactionsWrappper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 530px;
  width: 100%;
`;

export default MyTransactions;
