import React, { useState } from 'react';
import styled from 'styled-components';
import { Modal, Button } from '@mui/material';
import ViewDisputeModal from '../Modal/ViewDisputeModal';
import { IDispute } from '../../constants/types';
import { Timestamp } from 'firebase/firestore';

const DisputeTable = ({ disputes }: { disputes: IDispute[] }) => {
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [selectedSessionDtls, setSelectedSessionDtls] = useState({});

  const tableHeader = (
    <thead>
      <tr>
        <th>Ticket Number</th>
        <th>Date of Issue</th>
        <th>Session-ID</th>
        <th>Dispute Status</th>
        <th>Actions</th>
      </tr>
    </thead>
  );

  function formatDate(dateOfIssue: Timestamp) {
    if (!dateOfIssue) return ''; // Handle the case where dateOfIssue is not available.

    // Convert nanoseconds and seconds to milliseconds
    const milliseconds =
      dateOfIssue?.seconds * 1000 + Math.floor(dateOfIssue?.nanoseconds / 1000000);

    // Create a Date object from milliseconds
    const date = new Date(milliseconds);

    // Use toLocaleDateString to format only the date part
    return date.toLocaleDateString();
  }

  return (
    <>
      <StyledContainer>
        <StyledTableWrapper>
          {!disputes.length ? (
            <>
              <table>
                {tableHeader}
                <tbody>
                  <tr>
                    <td colSpan={5}>No Disputes</td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <table>
              {tableHeader}
              <tbody>
                {disputes.map((dispute: IDispute) => (
                  <tr
                    key={dispute.sessionId}
                    style={{ background: dispute?.status === 'pending' ? '#FFD8DC' : '#E4FCE3' }}
                  >
                    <td>{dispute?.id}</td>
                    <td>{formatDate(dispute?.dateOfIssue)}</td>
                    <td>{dispute?.sessionId}</td>
                    <td
                      style={{ color: dispute?.status === 'pending' ? 'var(--error)' : '#4E7E00' }}
                    >
                      {dispute?.status}
                    </td>
                    <td>
                      <Button
                        variant="outlined"
                        sx={{ color: 'black', border: '1px solid black' }}
                        onClick={() => {
                          setSelectedSessionDtls({
                            ...dispute,
                          });
                          setDisputeModalOpen(true);
                        }}
                      >
                        View Dispute
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {disputeModalOpen && (
            <Modal
              sx={{
                margin: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              open={disputeModalOpen}
              onClose={() => {
                setDisputeModalOpen(!disputeModalOpen);
              }}
            >
              <ViewDisputeModal
                dispute={selectedSessionDtls}
                closeDisputeModal={() => {
                  setDisputeModalOpen(!disputeModalOpen);
                }}
              />
            </Modal>
          )}
        </StyledTableWrapper>
      </StyledContainer>
    </>
  );
};

const StyledContainer = styled.div`
  margin-bottom: 2rem;
`;

const StyledTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;

  table {
    width: 100%;
    border: 1px solid #ccc;
    height: 200px;
    overflowy: auto;
    border-collapse: collapse;

    th {
      color: #000;
      font-size: 16px;
      font-weight: 700;
      padding: 15px;
      text-align: center;
      border: 1px solid #ccc;
    }

    td {
      font-size: 16px;
      padding: 15px;
      text-align: center;
      border: 1px solid #ccc;
    }

    td:first-child {
      padding: 0;
    }

    td:last-child {
      border-bottom: 1px solid #ccc;
    }
  }

  .table-footer {
    text-align: center;
    border-top: 1px solid #ccc;
    padding: 30px;
    font-weight: bold;
  }
`;

export default DisputeTable;
