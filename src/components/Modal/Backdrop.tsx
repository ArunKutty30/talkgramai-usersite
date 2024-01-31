import React, { ReactNode } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

const ModalBackdrop = styled(motion.div)`
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

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const Backdrop: React.FC<{
  children: ReactNode;
  handleClose?: () => void;
  isOpen: boolean;
  className?: string;
}> = ({ children, handleClose, isOpen, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <ModalBackdrop
          className={className ? `modal_backdrop ${className}` : "modal_backdrop"}
          onClick={() => (handleClose ? handleClose() : null)}
          variants={backdropVariants}
          animate="animate"
          initial="initial"
          exit="initial"
        >
          {children}
        </ModalBackdrop>
      )}
    </AnimatePresence>
  );
};

export default Backdrop;
