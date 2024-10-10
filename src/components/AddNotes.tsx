import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

import { useChartStore } from "@/store/useChartStore";

import { useModal } from "./shared/Modal";

interface SelectedData {
  id: string;
  memberName: string;
}

export default function AddNotes() {
  const [isChecked, setIsChecked] = useState(false);
  const { close } = useModal();
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const { addNote, selectedData, resetSelectedNode } = useChartStore();
  const { memberName, id } = selectedData as SelectedData;

  const toggleSwitch = () => setIsChecked(!isChecked);

  function addNewNote() {
    if (title === "" || note === "") {
      return;
    }

    const newNote = {
      id: Math.floor(100 + Math.random() * 900).toString(),
      title,
      note,
      type: isChecked ? "Public" : "Private",
      addedBy: memberName || "",
      dateAdded: format(new Date(), "dd MMM yyyy"),
      nodeId: id,
    };

    addNote(newNote);
    resetSelectedNode();
    close();
  }

  return (
    <div className="flex h-[340px] w-[300px] flex-col rounded-xl">
      {/* Heading */}
      <div className="flex h-[64px] items-center justify-between rounded-t-xl bg-[#FFD64E] px-4">
        <div className="flex items-center gap-2">
          <div className="flex size-[36px] items-center justify-center rounded-full bg-white">
            <Image
              src="/assets/png/my-brands/google-logo.png"
              alt="logo"
              width={24}
              height={24}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-recoletaAlt text-xl">Add Notes To</span>
            <span className="-mt-1 font-mulish text-sm font-medium text-[#00000099]">
              Google Private Ltd
            </span>
          </div>
        </div>

        <button onClick={close} type="button">
          <IoClose size={24} />
        </button>
      </div>

      {/* Add note description */}
      <div className="flex flex-1 flex-col rounded-b-xl bg-white px-4 text-[#737373]">
        <div className="grow">
          <input
            className="mt-3 font-mulish outline-none placeholder:text-[#737373]"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="mt-2 w-full font-mulish text-xs outline-none placeholder:text-[#737373]"
            placeholder="Write your notes for this brand to review later..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <div className="mt-4 text-xs">
            <span>Examples:</span>
            <div className="flex flex-col">
              <span>1. They are ready to buy IPL inventories.</span>
              <span>2. Their budget is below 25 Lacs only.</span>
            </div>
          </div>
        </div>

        {/* Switch note type and btn */}
        <div className="mb-3 mt-auto">
          <div className="mb-3 flex h-[36px] items-center justify-between rounded-lg bg-[#0000000F] px-2">
            <div className="flex items-center">
              <Image
                src="/assets/svg/my-brands/lock.svg"
                alt="lock"
                width={20}
                height={20}
              />
              <span className="ml-[3px] mr-6 mt-[2px] font-mulish text-xs text-[#000000E5]">
                {isChecked ? "Public Note" : "Private Note (Only you can see)"}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleSwitch}
              aria-label={
                isChecked ? "Turn off private note" : "Turn on private note"
              }
              className={`relative mt-[2px] h-3 w-[30px] rounded-full border-[0.6px] border-[#FFE58E] transition-colors duration-300 focus:outline-none ${
                isChecked ? "bg-[#050818]" : "bg-[#292d38]"
              }`}
            >
              <span
                className={`absolute left-[-3px] top-[-3px] size-[16px] rounded-full bg-[#FFE58E] transition-transform duration-300 ${
                  isChecked ? "translate-x-[18px]" : ""
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            className="h-[40px] w-full rounded-full bg-[#0094FF] font-mulish text-sm font-bold text-white"
            onClick={addNewNote}
          >
            {isChecked ? "SAVE PUBLIC NOTE" : "SAVE PRIVATE NOTE"}
          </button>
        </div>
      </div>
    </div>
  );
}
