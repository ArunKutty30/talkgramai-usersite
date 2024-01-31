import React, { ReactNode } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

import Backdrop from "./Backdrop";
import ReactModal from "./ReactModal";

import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";

const modalVaraints = {
  initial: {
    opacity: 0,
    scale: 0.5,
    x: "-50%",
    y: "-50%",
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
    scale: 1,
    x: "-50%",
    y: "-50%",
  },
  exit: {
    opacity: 0,
    scale: 0,
    x: "-50%",
    y: "-50%",
  },
};

interface IBaseModal {
  isOpen: boolean;
  handleClose?: () => void;
  children?: ReactNode;
}

const BaseModal: React.FC<IBaseModal> = ({ isOpen, handleClose, children }) => {
  return (
    <ReactModal>
      <Backdrop handleClose={handleClose} isOpen={isOpen}>
        <AnimatePresence>
          {isOpen && (
            <StyledBaseModal
              onClick={(e) => e.stopPropagation()}
              variants={modalVaraints}
              animate="animate"
              initial="initial"
              exit="exit"
            >
              <div className="default-header">
                <div role="button" onClick={() => handleClose && handleClose()}>
                  <CloseIcon />
                </div>
              </div>
              {children}
            </StyledBaseModal>
          )}
        </AnimatePresence>
      </Backdrop>
    </ReactModal>
  );
};

const StyledBaseModal = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--card-background);
  max-width: 550px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ede7df;
  padding: 16px;

  @media (max-width: 576px) {
    max-width: 90%;
  }

  .default-header {
    display: flex;
    justify-content: flex-end;

    > div {
      cursor: pointer;
    }
  }
`;

export default BaseModal;
