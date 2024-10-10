"use client";

import { useState } from "react";

import { useChartStore } from "@/store/useChartStore";

import PrivateNote from "./PrivateNote";
import PublicNote from "./PublicNote";

interface SelectedData {
  id: string;
}

export default function Notes() {
  const [activeTab, setActiveTab] = useState("Private");
  const { notes, selectedData } = useChartStore();

  const { id } = selectedData as SelectedData;

  const privateNoteLength = notes.filter(
    (data) => data.nodeId === id && data.type === "Private"
  ).length;

  const publicNoteLength = notes.filter(
    (data) => data.type === "Public"
  ).length;

  return (
    <div className="mt-5 px-6">
      <div className="mx-auto flex h-[33px] w-fit items-center gap-[10px] rounded-full font-mulish">
        <button
          type="button"
          className={`flex h-[33px] w-[101px] items-center justify-center rounded-full text-xs font-medium transition-colors ${
            activeTab === "Private"
              ? "bg-[#FFE58E] font-bold text-black"
              : "bg-[#191B28] font-normal text-white"
          }`}
          onClick={() => setActiveTab("Private")}
        >
          <span>Private</span>
          <span className="ml-1 flex size-4 items-center justify-center rounded-full bg-[#FF6161] text-[10px] text-white">
            {privateNoteLength ?? "0"}
          </span>
        </button>
        <button
          type="button"
          className={`flex h-[33px] w-[101px] items-center justify-center rounded-full text-xs font-medium transition-colors ${
            activeTab === "Public"
              ? "bg-[#FFE58E] font-bold text-black"
              : "bg-[#191B28] font-normal text-white"
          }`}
          onClick={() => setActiveTab("Public")}
        >
          <span>Public</span>
          <span className="ml-1 flex size-4 items-center justify-center rounded-full bg-[#FF6161] text-[10px] text-white">
            {publicNoteLength ?? "0"}
          </span>
        </button>
      </div>

      {activeTab === "Private" ? <PrivateNote /> : <PublicNote />}
    </div>
  );
}
