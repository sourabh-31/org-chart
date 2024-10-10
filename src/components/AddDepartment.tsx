import { useState } from "react";

import type {
  ChartNode,
  DepartmentNode,
  PersonNode,
} from "@/store/useChartStore";
import { useChartStore } from "@/store/useChartStore";

import ExtendedSelect from "./shared/ExtendedSelect";
import Input from "./shared/Input";
import { useSidebar } from "./shared/Sidebar";
import ColorPicker from "./ColorPicker";
import { SelectedManager } from "./AddPerson";

interface MutateDataType {
  id: string;
  departmentName: string;
  color: string;
  type: string;
  manager: string;
  department: string;
  notes: number;
  children: DepartmentNode[];
}

export default function AddDepartment() {
  const { close, openName } = useSidebar();
  const { selectedData, resetSelectedNode, addNode } = useChartStore();
  const [pickedColor, setPickedColor] = useState("#ffffff");
  const { id, memberName, type } = selectedData as PersonNode;
  const [selectedManager, setSelectedManager] =
    useState<null | SelectedManager>(null);

  const convertedData = localStorage.getItem("convertedData");
  const managers = convertedData ? JSON.parse(convertedData).managers : [];

  function handleColor(color: string) {
    setPickedColor(color);
  }

  function addDepartment(formData: FormData) {
    const formDataObject: { [key: string]: string | boolean } = {};

    formData.forEach((value, key) => {
      formDataObject[key] = value.toString();
    });

    if (!formDataObject.departmentName || (!id && !selectedManager)) {
      return;
    }

    const data: MutateDataType = {
      id: Math.floor(100 + Math.random() * 900).toString(),
      departmentName: formDataObject.departmentName as string,
      color: pickedColor,
      type: "department",
      manager:
        type === "department" || type === "location"
          ? ""
          : memberName || (selectedManager?.name as string),
      department:
        type === "department" || type === "location"
          ? memberName || (selectedManager?.name as string)
          : "NA",
      notes: 0,
      children: [],
    };

    if (id) {
      addNode(id, data as ChartNode);
    } else if (selectedManager?.id) {
      addNode(selectedManager.id, data as ChartNode);
    }
    close(openName);
    resetSelectedNode();
  }

  return (
    <form className="flex h-full flex-col" action={addDepartment}>
      <div className="flex-1 overflow-y-auto px-6">
        <div className="mt-6">
          <Input.Root name="departmentName">
            <Input.Icon iconSrc="/assets/svg/my-brands/poc/company.svg" />
            <Input.Content
              label="Department Name"
              placeholder="Enter department name"
              isRequired
            />
          </Input.Root>
          {!id ? (
            <ExtendedSelect
              label="Manager"
              name="manager"
              placeholder="Search person or department or location"
              options={managers}
              iconSrc="/assets/svg/my-brands/poc/manager.svg"
              isRequired
              onChange={(option) => setSelectedManager(option)}
            />
          ) : null}
          {/* eslint-disable-next-line react/jsx-no-bind */}
          <ColorPicker handleColor={handleColor} />
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex shrink-0 items-center gap-5 border-t border-gray-dark p-4 font-mulish text-sm font-bold">
        <button
          type="button"
          onClick={() => {
            close(openName);
            resetSelectedNode();
          }}
          className="w-1/2 rounded-full bg-white py-[10px]"
        >
          CANCEL
        </button>
        <button
          type="submit"
          className="w-1/2 rounded-full bg-[#0094FF] py-[10px] text-white"
        >
          SAVE
        </button>
      </div>
    </form>
  );
}
