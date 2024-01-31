import React, { ReactNode } from "react"
import { createPortal } from "react-dom"

interface IReactModal {
  children: ReactNode
}

const ReactModal: React.FC<IReactModal> = ({ children }) => {
  const element = document.getElementById("react-modal")
  if (!element) return null

  return createPortal(children, element)
}

export default ReactModal
