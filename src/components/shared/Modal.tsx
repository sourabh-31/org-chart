"use client";

import type { ReactElement, ReactNode } from "react";
import { cloneElement, createContext, useContext, useState } from "react";

import { useOutsideClick } from "@/hooks/useOutsideClick";

// Define types for the context and components
interface ModalContextType {
  openName: string;
  close: () => void;
  open: (name: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProps {
  children: ReactNode;
}

function Modal({ children }: ModalProps): ReactElement {
  const [openName, setOpenName] = useState<string>("");

  const close = () => setOpenName("");
  const open = (name: string) => setOpenName(name);

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

// Custom hook to access modal context
export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
}

interface OpenProps {
  children: ReactElement;
  opens: string;
}

function Open({ children, opens: opensWindowName }: OpenProps): ReactElement {
  const { open } = useModal();

  const handleClick = (event: React.MouseEvent) => {
    if (children.props.onClick) {
      children.props.onClick(event);
    }
    open(opensWindowName);
  };

  return cloneElement(children, {
    onClick: handleClick,
  });
}

interface WindowProps {
  children: ReactElement;
  name: string;
}

function Window({ children, name }: WindowProps): ReactElement | null {
  const { openName, close } = useModal();
  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-800/50">
      <div ref={ref} className="mx-auto">
        <div>
          {cloneElement(children, {
            onCloseModal: close,
          })}
        </div>
      </div>
    </div>
  );
}

// Assign the subcomponents
Modal.Open = Open;
Modal.Window = Window;

export default Modal;
