import type { ReactElement, ReactNode } from "react";

export type SidebarDataType = {
  name: string;
  img: string;
  imgAlt: string;
  link: string;
  alt: string;
};

export type SidebarContextType = {
  openName: string;
  close: (name: string) => void;
  open: (name: string) => void;
};

export type SidebarProps = {
  children: ReactNode;
};

export type OpenProps = {
  children: ReactElement;
  opens: string;
};

export type WindowProps = {
  children: ReactElement;
  name: string;
  title: string;
  subText?: string;
  isBorderedIcon: boolean;
  icon1?: string;
  icon2?: string;
  className?: string;
};
