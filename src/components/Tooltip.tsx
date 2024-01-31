import React, { ReactElement } from "react";
import { styled } from "@mui/material/styles";
import MuiTooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <MuiTooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 13,
    textAlign: "center",
    fontFamily: "Inter",
    fontWeight: 400,
  },
}));

interface ITooltipProps {
  children: ReactElement;
  title: string;
}

const Tooltip: React.FC<ITooltipProps> = ({ children, title }) => {
  return (
    <LightTooltip title={title} placement="top">
      {children}
    </LightTooltip>
  );
};

export default Tooltip;
