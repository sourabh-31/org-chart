"use client";

import { ArrowLeft } from "iconsax-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { cn } from "@/lib/utils";
import type { PersonNode } from "@/store/useChartStore";
import { useChartStore } from "@/store/useChartStore";
import type {
  OpenProps,
  SidebarContextType,
  SidebarProps,
  WindowProps,
} from "@/types/sidebar.type";

// Context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Main Sidebar Component
function Sidebar({ children }: SidebarProps) {
  const [openName, setOpenName] = useState<string>("");

  const open = setOpenName;
  const close = () => setOpenName("");

  // Lock the body scroll when the sidebar is opened
  useEffect(() => {
    if (openName) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [openName]);

  return (
    <SidebarContext.Provider value={{ openName, open, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Custom Hook to use context
function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

// Sidebar Open Component
function Open({ children, opens: opensWindowName }: OpenProps) {
  const { open } = useSidebar();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (children.props.onClick) {
      children.props.onClick(event);
    }
    open(opensWindowName);
  };

  return cloneElement(children, {
    onClick: handleClick,
  });
}

// Sidebar Window Component
function Window({
  children,
  name,
  title,
  subText,
  icon1 = "/assets/svg/my-brands/trash-white.svg",
  icon2 = "/assets/svg/my-brands/question-mark.svg",
  isBorderedIcon,
  className,
}: WindowProps) {
  const { openName, close } = useSidebar();
  const { selectedData } = useChartStore();
  const { memberName } = selectedData as PersonNode;
  const { resetSelectedNode } = useChartStore();
  const router = useRouter();

  if (name !== openName) return null;

  return (
    <aside className="fixed inset-0 z-50 flex justify-end">
      <div className="grow bg-slate-800/50" />
      <div
        className={cn(
          "flex h-full flex-col bg-[#292D38]",
          className || "w-[22rem] sm:w-[30rem] xl:w-[32rem] 2xl:w-[34rem]"
        )}
      >
        {/* Sidebar header - fixed */}
        <div className="shrink-0 border-b border-gray-dark p-5">
          <div className="flex items-center justify-between">
            {/* Arrow + Org Name */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  close(openName);
                  resetSelectedNode();
                  router.push("/");
                }}
              >
                <ArrowLeft size="24" color="#ffffff" />
              </button>
              <div className="flex flex-col gap-[px] text-white">
                <span className="font-recoletaAlt text-xl">{title}</span>
                <span className="font-mulish text-sm">
                  {subText ?? memberName}
                </span>
              </div>
            </div>

            {/* Util icons */}
            {isBorderedIcon ? (
              <div className="flex items-center gap-5">
                <div className="flex size-11 items-center justify-center rounded-full border border-[#50515B] bg-[#242632] sm:size-12">
                  <Image
                    src={icon1}
                    alt="icon1"
                    width={24}
                    height={24}
                    className="size-[18px] sm:size-[24px]"
                  />
                </div>
                <div className="flex size-11 items-center justify-center rounded-full border border-[#50515B] bg-[#242632] sm:size-12">
                  <Image
                    src={icon2}
                    alt="icon2"
                    width={24}
                    height={24}
                    className="size-[18px] sm:size-[24px]"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Image src={icon1} alt="icon1" width={24} height={24} />
                <Image src={icon2} alt="icon2" width={24} height={24} />
              </div>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="rightSidebar-content flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </aside>
  );
}

// Assigning sub-components as Property
Sidebar.Open = Open;
Sidebar.Window = Window;

export { Sidebar, useSidebar };
