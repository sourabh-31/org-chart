import type { Node, NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { Add } from "iconsax-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { IoIosMove, IoMdMore } from "react-icons/io";

import { useChartStore } from "@/store/useChartStore";

import { Menu } from "./shared/Menu";
import Modal from "./shared/Modal";
import { Sidebar } from "./shared/Sidebar";

export type CustomChildNodeType = Node<{
  memberName: string;
  role: string;
  location: string;
  imgSrc: string;
  isStarred: boolean;
  color: string;
  directPerson: number;
  directDeptAndLocation: number;
  parentId: string;
}>;

export type CustomChildNodeProps = NodeProps<CustomChildNodeType> & {
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
};

export default function CustomChildNode(props: CustomChildNodeProps) {
  const {
    memberName,
    role,
    location,
    imgSrc,
    isStarred,
    color,
    directDeptAndLocation,
    directPerson,
  } = props.data;

  const { id, onNodeClick } = props;

  const router = useRouter();

  const glowColor = color || "#ffffff99";
  const [isExpanded, setIsExpanded] = useState(true);
  const [showIcons, setShowIcons] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [boxShadow, setBoxShadow] = useState("0px 0px 4px 2px #00000033");
  const transitionDuration = 150;

  const { findAndSetNodeById } = useChartStore();

  // Function to show icons and update box shadow on hover
  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setShowIcons(true);
    setBoxShadow(`0px 0px 30px 5px ${glowColor}`);
  };

  // Function to hide icons with a delay and reset box shadow
  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setShowIcons(false);
      setBoxShadow("0px 0px 4px 2px #00000033");
    }, transitionDuration);
    setTimeoutId(id);
  };

  const handleMenuClick = () => {
    setShowIcons(false);
    setBoxShadow("0px 0px 4px 2px #00000033");
  };

  // Clear the timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <div
      className="relative mx-auto h-[110px] w-[220px] rounded-[10px] border-t-[3px]"
      style={{
        boxShadow,
        borderColor: color,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        transition: `box-shadow 0.1s ease-in-out`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Member icon image */}
      <div
        className="absolute left-1/2 flex items-center justify-center rounded-full border-[3px] border-[#292D38] bg-[#292D38]"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <Image
          src={imgSrc}
          alt="org-icon"
          width={56}
          height={56}
          className="rounded-full"
          quality={100}
        />
      </div>

      {isStarred && (
        <div
          className="absolute left-1/2 flex h-[14px] w-[22px] items-center justify-center rounded bg-[#007BFF]"
          style={{ transform: "translate(-50%, 130%)" }}
        >
          <Image
            src="/assets/svg/star.svg"
            alt="star-icon"
            width={10}
            height={10}
            quality={100}
          />
        </div>
      )}

      {/* Member note */}
      <Sidebar.Open opens="people-details">
        <button
          type="button"
          onClick={() => {
            findAndSetNodeById(id);
            router.push("?details=notes");
          }}
          className="relative left-[10px] top-[10px] flex size-[18px] items-center justify-center rounded bg-[#1b1e25]"
        >
          <Image
            src="/assets/svg/my-brands/member-notes.svg"
            alt="org-note"
            width={12}
            height={12}
          />
        </button>
      </Sidebar.Open>

      {/* Org details */}
      <div className="relative top-4 flex flex-col items-center justify-center">
        <p className="font-recoletaAlt text-[14px] text-white">{memberName}</p>
        <p className="mt-px font-mulish text-[12px] text-[#ffffff99]">{role}</p>
        <p className="font-mulish text-[12px] text-[#ffffff99]">{location}</p>
      </div>

      {/* Show icons when hovered or for the duration of the transition */}
      {showIcons && (
        <>
          {/* Move icon */}
          <Modal.Open opens="move-person">
            <button
              type="button"
              onClick={() => {
                findAndSetNodeById(id);
                handleMenuClick();
              }}
              className="absolute -left-10 top-0 flex size-[30px] items-center justify-center rounded-full border border-[#50515B] bg-[#242632]"
            >
              <IoIosMove color={color} size={16} />
            </button>
          </Modal.Open>

          {/* More icon */}
          <div className="absolute -right-10 top-0">
            <Menu>
              <Menu.Trigger>
                <button
                  type="button"
                  className="flex size-[30px] items-center justify-center rounded-full border border-[#50515B] bg-[#242632]"
                >
                  <IoMdMore color={color} size={16} />
                </button>
              </Menu.Trigger>
              <Menu.Items position="auto" width="230px">
                <Sidebar.Open opens="people-details">
                  <Menu.Item
                    imgSrc="/assets/svg/my-brands/eye.svg"
                    btnName="View Info"
                    onClick={() => {
                      findAndSetNodeById(id);
                      handleMenuClick();
                      router.push("?details=about");
                    }}
                  />
                </Sidebar.Open>
                <Sidebar.Open opens="people-details">
                  <Menu.Item
                    imgSrc="/assets/svg/my-brands/pencil.svg"
                    btnName="Edit role"
                    onClick={() => {
                      findAndSetNodeById(id);
                      handleMenuClick();
                      router.push("?details=about");
                    }}
                  />
                </Sidebar.Open>
                <Modal.Open opens="add-notes">
                  <Menu.Item
                    imgSrc="/assets/svg/my-brands/note.svg"
                    btnName="Add notes"
                    onClick={() => {
                      handleMenuClick();
                      findAndSetNodeById(id);
                    }}
                  />
                </Modal.Open>
                <div className="mx-[10px] mb-2 mt-[13px] border-b border-dashed border-[#00000033]" />
                <Modal.Open opens="move-person">
                  <Menu.Item
                    imgSrc="/assets/svg/my-brands/move.svg"
                    btnName="Move person"
                    onClick={() => findAndSetNodeById(id)}
                  />
                </Modal.Open>
                <Modal.Open opens="delete-node">
                  <Menu.Item
                    isDanger
                    imgSrc="/assets/svg/my-brands/trash.svg"
                    btnName="Delete person"
                    onClick={() => {
                      findAndSetNodeById(id);
                      handleMenuClick();
                    }}
                  />
                </Modal.Open>
              </Menu.Items>
            </Menu>
          </div>

          {/* Add icon */}
          <div
            className="absolute bottom-0 left-1/2"
            style={{ transform: "translate(-50%, 130%)" }}
          >
            <Menu>
              <Menu.Trigger>
                <button
                  type="button"
                  className="flex size-[30px] items-center justify-center rounded-full border border-[#50515B] bg-[#242632]"
                >
                  <Add size="16" color={color} />
                </button>
              </Menu.Trigger>
              <Menu.Items position="bottom" width="230px">
                <Sidebar.Open opens="add-person">
                  <Menu.Item
                    imgSrc="/assets/svg/my-brands/user.svg"
                    btnName="Person"
                    onClick={() => {
                      findAndSetNodeById(id);
                      handleMenuClick();
                    }}
                  />
                </Sidebar.Open>
                <Sidebar.Open opens="add-department">
                  <Menu.Item
                    imgSrc="/assets/svg/my-brands/department.svg"
                    btnName="Department"
                    onClick={() => {
                      findAndSetNodeById(id);
                      handleMenuClick();
                    }}
                  />
                </Sidebar.Open>
                <Sidebar.Open opens="add-location">
                  <Menu.Item
                    imgSrc="/assets/svg/my-brands/location.svg"
                    btnName="Location"
                    onClick={() => {
                      findAndSetNodeById(id);
                      handleMenuClick();
                    }}
                  />
                </Sidebar.Open>
              </Menu.Items>
            </Menu>
          </div>
        </>
      )}

      {/* Child utility options */}

      {directDeptAndLocation !== 0 || directPerson !== 0 ? (
        <div
          role="button"
          tabIndex={0}
          onClick={(event) => {
            setIsExpanded(!isExpanded);
            onNodeClick(event, props as unknown as Node);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setIsExpanded(!isExpanded);
            }
          }}
          className="absolute left-1/2 flex h-[18px] w-[84px] justify-evenly rounded-full border border-[#292d38] bg-white"
          style={{ transform: "translate(-50%, 120%)" }}
        >
          <div className="flex items-center gap-[2px]">
            <Image
              src="/assets/svg/my-brands/org-member.svg"
              alt="member-icon"
              width={12}
              height={12}
            />
            <p className="font-mulish text-[10px]">{directPerson}</p>
          </div>

          <div className="flex items-center gap-[2px]">
            <Image
              src="/assets/svg/my-brands/org-npm.svg"
              alt="npm-icon"
              width={12}
              height={12}
            />
            <p className="font-mulish text-[10px]">{directDeptAndLocation}</p>
          </div>

          <div className="mr-[-5px] flex items-center">
            {isExpanded ? (
              <BiChevronUp size={12} />
            ) : (
              <BiChevronDown size={12} />
            )}
          </div>
        </div>
      ) : null}

      {/* Add handles for edges */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "transparent",
          border: "none",
          top: "0px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "transparent",
          border: "none",
          bottom: "0",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
}
