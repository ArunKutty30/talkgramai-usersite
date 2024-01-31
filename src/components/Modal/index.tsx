import React, { CSSProperties, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Backdrop from "./Backdrop";
import styled from "styled-components";
import ReactModal from "./ReactModal";

const StyledModal = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--card-background);
  border-radius: 20px;
  max-width: 480px;
  width: 100%;

  @media (max-width: 576px) {
    max-width: 90%;
  }
`;

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

interface IModal {
  isOpen: boolean;
  handleClose?: () => void;
  children?: ReactNode;
  rootClassName?: string;
  style?: CSSProperties;
}

const Modal: React.FC<IModal> = ({ isOpen, handleClose, children, rootClassName, style }) => {
  return (
    <ReactModal>
      <Backdrop handleClose={handleClose} isOpen={isOpen} className={rootClassName}>
        <AnimatePresence>
          {isOpen && (
            <StyledModal
              className={"modal"}
              onClick={(e) => e.stopPropagation()}
              variants={modalVaraints}
              animate="animate"
              initial="initial"
              exit="exit"
              style={style}
            >
              {children}
            </StyledModal>
          )}
        </AnimatePresence>
      </Backdrop>
    </ReactModal>
  );
};

export default Modal;
