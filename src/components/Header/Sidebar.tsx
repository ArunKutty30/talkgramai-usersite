import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

interface ISidebarProps {
  openSidebar: boolean;
  handleClose: () => void;
}

const Sidebar: React.FC<ISidebarProps> = ({ openSidebar, handleClose }) => {
  return (
    <AnimatePresence>
      {openSidebar && (
        <StyledSidebarBackdrop
          onClick={handleClose}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <StyledSidebar
            onClick={(e) => e.stopPropagation()}
            animate={{ right: 0, transitionDelay: "-200ms" }}
            exit={{ right: -300 }}
            initial={{ right: -300 }}
          >
            <ul>
              <li>
                <NavLink onClick={handleClose} to="/">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink onClick={handleClose} to="/book-session">
                  Book Session
                </NavLink>
              </li>
              <li>
                <NavLink onClick={handleClose} to="/sessions">
                  Sessions
                </NavLink>
              </li>
              <li>
                <NavLink onClick={handleClose} to="/refer-and-earn">
                  Refer
                </NavLink>
              </li>
              <li>
                <NavLink onClick={handleClose} to="/subscribe">
                  Subscribe
                </NavLink>
              </li>
              <li>
                <NavLink onClick={handleClose} to="/dispute">
                  Disputes
                </NavLink>
              </li>
              <li>
                <NavLink to="/feedback-analysis">Feedback analysis</NavLink>
              </li>
              <li>
                <NavLink onClick={handleClose} to="/help">
                  Help & Support
                </NavLink>
              </li>
            </ul>
          </StyledSidebar>
        </StyledSidebarBackdrop>
      )}
    </AnimatePresence>
  );
};

const StyledSidebarBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
  z-index: 100;
`;

const StyledSidebar = styled(motion.div)`
  display: flex;
  flex-direction: column;
  background: #fff;
  max-width: 300px;
  width: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  height: 100%;

  ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    padding: 20px 0;

    li {
      margin-bottom: 15px;
      a {
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        color: #62635e;
        height: inherit;
        display: block;
        text-transform: capitalize;
        padding: 8px 16px;
      }
    }
  }
`;

export default Sidebar;
