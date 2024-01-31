import React, { useState } from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import Button from "../Button";

const DataTable = () => {
  const [loading, setLoading] = useState(false);
  const sessions = [
    {
      id: 1,
      name: "John Doe",
      planDetails: "Plan 1",
      totalAmount: "$100",
      registeredMail: "Yes",
      viewDetails: "View",
    },
    {
      id: 2,
      name: "Jane Smith",
      planDetails: "Plan 2",
      totalAmount: "$150",
      registeredMail: "No",
      viewDetails: "View",
    },
    {
      id: 3,
      name: "Alice Johnson",
      planDetails: "Plan 3",
      totalAmount: "$200",
      registeredMail: "Yes",
      viewDetails: "View",
    },
  ]; // Replace with your data source

  const tableHeader = (
    <thead>
      <tr>
        <th>Ticket Number</th>
        <th>Date of Issue</th>
        <th>Session-ID</th>
        <th>Dispute Status</th>
        <th></th>
      </tr>
    </thead>
  );

  return (
    <StyledContainer>
      <StyledTableWrapper>
        {loading ? (
          <>
            <table>
              {tableHeader}
              <tbody></tbody>
            </table>
            <div className="table-footer">Loading...</div>
          </>
        ) : !sessions.length ? (
          <>
            <table>
              {tableHeader}
              <tbody></tbody>
            </table>
            <div className="table-footer">No sessions found</div>
          </>
        ) : (
          <table>
            {tableHeader}
            <tbody>
              {sessions.map((sessionDetails) => (
                <tr key={sessionDetails.id}>
                  <td>{sessionDetails.name}</td>
                  <td>{sessionDetails.planDetails}</td>
                  <td>{sessionDetails.totalAmount}</td>
                  <td>{sessionDetails.registeredMail}</td>
                  <td>
                    <Button>View Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </StyledTableWrapper>
    </StyledContainer>
  );
};

const StyledContainer = styled.div``;

const StyledTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;

    th {
      color: #000;
      font-size: 16px;
      font-weight: 700;
      padding: 15px;
      text-align: center;
      background-color: #f44336; /* Red background for column headers */
      color: #fff; /* White text for column headers */
    }

    td {
      font-size: 16px;
      padding: 15px;
      text-align: center;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
    }

    td:first-child {
      padding: 0;
    }
  }

  .table-footer {
    text-align: center;
    border-top: 1px solid #ccc;
    padding: 30px;
    font-weight: bold;
  }
`;

export default DataTable;
