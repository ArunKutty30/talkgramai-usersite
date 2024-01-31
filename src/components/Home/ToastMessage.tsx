import React from "react";
import { Box } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ClearIcon from "@mui/icons-material/Clear";

const ToastMessage = ({ msg, closePopup }: { msg: string; closePopup: any }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "end",
        alignItems: "end",
        border: "1px solid red",
        borderRadius: "5px",
        background: "#ffefef",
        maxWidth: "25rem",
        padding: "0.5rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
        }}
      >
        <div style={{ padding: "0.2rem 0rem 0.2rem 0.5rem" }}>
          <InfoOutlinedIcon sx={{ color: "red" }} />
        </div>
        <div className="s-14" style={{ padding: "0.2rem 1rem 0.2rem 0.5rem", color: "#FF2525" }}>
          {msg}
        </div>
        <ClearIcon
          onClick={closePopup}
          sx={{ color: "grey", cursor: "pointer" }}
          fontSize="small"
        />
      </Box>
    </Box>
  );
};

export default ToastMessage;
