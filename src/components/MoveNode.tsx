import { useState } from "react";

import { useChartStore } from "@/store/useChartStore";

import ExtendedSelect from "./shared/ExtendedSelect";
import { useModal } from "./shared/Modal";
import type { SelectedManager } from "./AddPerson";

interface MoveNodeProps {
  title: string;
}

interface SelectedNode {
  id: string;
  parentId: string;
}

export default function MoveNode({ title }: MoveNodeProps) {
  const [moveSubordinates, setMoveSubordinates] = useState(false);
  const { selectedData, resetSelectedNode, moveNode } = useChartStore();
  const { id, parentId } = selectedData as SelectedNode;
  const [selectedManager, setSelectedManager] =
    useState<null | SelectedManager>(null);

  const convertedData = localStorage.getItem("convertedData");
  const managers = convertedData ? JSON.parse(convertedData).managers : [];

  const { close } = useModal();

  function handleMove() {
    if (id && selectedManager) {
      moveNode(id, selectedManager?.id, moveSubordinates, parentId);

      setTimeout(() => {
        moveNode(id, selectedManager?.id, moveSubordinates, parentId);
      }, 0);

      close();
    }
  }

  return (
    <div
      className="mx-auto w-[70%] rounded-xl bg-[#2D3036] p-6 sm:mx-0 sm:w-[520px]"
      style={{ boxShadow: "0px 0px 72px 0px #00000024" }}
    >
      <div className="text-center font-recoletaAlt text-xl text-white">
        {title}
      </div>
      <div className="mt-[10px] text-center font-mulish text-white">
        Changing the reporting manager will move this role to report under the
        selected manager.
      </div>

      <div className="mt-2">
        <ExtendedSelect
          label="Manager"
          name="manager"
          placeholder="Search manager"
          options={managers}
          isRequired
          onChange={(option) => setSelectedManager(option)}
          className="bg-transparent"
        />
      </div>

      <div className="-mt-3">
        <label
          htmlFor="moveSubordinates"
          className="flex cursor-pointer items-center"
        >
          <input
            type="checkbox"
            id="moveSubordinates"
            className="relative w-[15px] h-[13px] appearance-none rounded-sm border border-white bg-transparent checked:border-white 
             checked:bg-transparent checked:before:absolute checked:before:bottom-[2px]
             checked:before:left-[3.5px]
             checked:before:h-[8px] checked:before:w-[4px] checked:before:rotate-45 
             checked:before:border-b-2 checked:before:border-r-2 checked:before:border-white 
             focus:outline-none"
            checked={moveSubordinates}
            onChange={() => setMoveSubordinates(!moveSubordinates)}
          />
          <span className="ml-2 font-mulish text-xs font-medium text-white">
            Move all direct reports and subordinates with this change
          </span>
        </label>
      </div>

      <div className="mb-3 mt-6 flex items-center justify-center gap-5">
        <button
          className="h-[40px] w-[200px] rounded-full border border-[#FFFFFF66] bg-[#FFFFFF] font-mulish font-bold tracking-[0.036em] text-[#383838] sm:h-[50px]"
          type="button"
          onClick={() => {
            close();
            resetSelectedNode();
          }}
        >
          CANCEL
        </button>
        <button
          className="h-[40px] w-[200px] rounded-full bg-[#0094FF] font-mulish font-bold tracking-[0.036em] text-[#ffffff] sm:h-[50px]"
          type="button"
          onClick={handleMove}
        >
          MOVE
        </button>
      </div>
    </div>
  );
}
