import Image from "next/image";
import { useState } from "react";

import type { PersonNode } from "@/store/useChartStore";
import { useChartStore } from "@/store/useChartStore";

import ExtendedSelect from "./shared/ExtendedSelect";
import Input from "./shared/Input";
import Select from "./shared/Select";
import { useSidebar } from "./shared/Sidebar";
import Switch from "./shared/Switch";

interface MutateDataType {
  id: string;
  memberName: string;
  role: string;
  location: string;
  notes: number;
  color: string;
  imgSrc: string;
  type: string;
  isStarred: boolean;
  children: PersonNode[];
  email: string;
  phoneNumber: string;
  isWhatsapp: boolean;
  linkedIn: string;
  manager: string;
  department: string;
}

export interface SelectedManager {
  id: string;
  name: string;
  type: string;
}

export default function AddPerson() {
  const { close, openName } = useSidebar();
  const { addNode, selectedData, resetSelectedNode } = useChartStore();
  const { id, memberName, type } = selectedData as PersonNode;
  const [selectedManager, setSelectedManager] =
    useState<null | SelectedManager>(null);

  const convertedData = localStorage.getItem("convertedData");
  const managers = convertedData ? JSON.parse(convertedData).managers : [];

  function addPerson(formData: FormData) {
    const formDataObject: { [key: string]: string | boolean } = {};

    formData.forEach((value, key) => {
      if (key === "workNumberVisible" || key === "mobileNumberVisible") {
        formDataObject[key] = value === "on";
      } else {
        formDataObject[key] = value.toString();
      }
    });

    // Check if all required fields are filled
    if (
      !formDataObject.name ||
      !formDataObject.designation ||
      (!id && !selectedManager)
    ) {
      return;
    }

    const data: MutateDataType = {
      id: Math.floor(100 + Math.random() * 900).toString(),
      memberName: formDataObject.name as string,
      role: formDataObject.designation as string,
      location: formDataObject.location as string,
      notes: 0,
      color: "#ffffff",
      imgSrc: "/assets/svg/my-brands/profile.svg",
      type: "person",
      isStarred: false,
      children: [],
      email: formDataObject.email as string,
      phoneNumber: formDataObject.mobileNumber as string,
      isWhatsapp: true,
      linkedIn: formDataObject.linkedin as string,
      manager:
        type === "department" || type === "location"
          ? ""
          : memberName || (selectedManager?.name as string),
      department:
        type === "department" || type === "location"
          ? memberName || (selectedManager?.name as string)
          : "NA",
    };

    // Add the person and show success toast
    if (id) {
      addNode(id, data);
    } else if (selectedManager?.id) {
      addNode(selectedManager.id, data);
    }
    resetSelectedNode();
    close(openName);
  }

  return (
    <form className="flex h-full flex-col" action={addPerson}>
      <div className="rightSidebar-content flex-1 overflow-y-auto px-6">
        {/* Profile image */}
        <div className="relative mx-auto my-6 flex size-[78px] items-center justify-center rounded-full border-[1.5px] border-dashed border-[#FFFFFF66] bg-[#20222E]">
          <Image
            src="/assets/svg/my-brands/profile.svg"
            alt="profile-img"
            width={78}
            height={78}
            className="rounded-full"
          />

          <button
            className="absolute bottom-[-2px] right-[-2px] flex size-[30px] items-center justify-center rounded-full border-2 border-[#292D38] bg-white"
            type="button"
          >
            <Image
              src="/assets/svg/my-brands/pencil-alt.svg"
              alt="pencil-alt"
              width={16}
              height={16}
            />
          </button>
        </div>

        {/* Basic Details */}
        <div>
          <h2 className="mb-4 font-recoletaAlt text-xl text-white">
            Basic Details
          </h2>
          <Input.Root name="name">
            <Input.Icon iconSrc="/assets/svg/my-brands/profile.svg" />
            <Input.Content
              label="Name"
              placeholder="Enter Name"
              isRequired
              prefixOptions={[
                {
                  value: "mr",
                  label: "Mr.",
                  iconSrc: "/assets/svg/my-brands/poc/mr.svg",
                },
                {
                  value: "ms",
                  label: "Ms.",
                  iconSrc: "/assets/svg/my-brands/poc/ms.svg",
                },
              ]}
            />
          </Input.Root>

          <Select
            label="Designation"
            name="designation"
            placeholder="Select or add designation"
            options={[
              { value: "Marketing Manager", label: "Marketing Manager" },
              { value: "Business Developer", label: "Business Developer" },
              { value: "Software Developer", label: "Software Developer" },
            ]}
            iconSrc="/assets/svg/my-brands/poc/card.svg"
            isRequired
            isInput
          />

          <Input.Root name="email">
            <Input.Icon iconSrc="/assets/svg/my-brands/poc/mail.svg" />
            <Input.Content
              label="Official Email ID"
              placeholder="Enter official email ID"
            />
          </Input.Root>

          <Select
            label="Location"
            name="location"
            placeholder="Search and select location"
            options={[
              { value: "Bengaluru", label: "Bengaluru" },
              { value: "Hyderabad", label: "Hyderabad" },
              { value: "Gurugram", label: "Gurugram" },
            ]}
            iconSrc="/assets/svg/my-brands/poc/location.svg"
            isInput
          />

          {!id ? (
            <>
              <h2 className="mb-4 font-recoletaAlt text-xl text-white">
                Connections
              </h2>
              <ExtendedSelect
                label="Manager"
                name="manager"
                placeholder="Search person or department or location"
                options={managers}
                iconSrc="/assets/svg/my-brands/poc/manager.svg"
                isRequired
                onChange={(option) => setSelectedManager(option)}
              />
            </>
          ) : null}

          <h2 className="mb-4 font-recoletaAlt text-xl text-white">
            Contact Details
          </h2>

          {/* Work number */}
          <div className="flex flex-col  gap-2 sm:flex-row">
            <Input.Root name="workNumber">
              <Input.Icon iconSrc="/assets/svg/my-brands/poc/phone-ring.svg" />
              <Input.Content
                label="Work Number"
                placeholder="Enter Phone Number"
                prefixOptions={[
                  {
                    value: "IN",
                    label: "IN",
                    iconSrc: "/assets/svg/my-brands/poc/india-flag.svg",
                  },
                ]}
              />
            </Input.Root>

            <Switch />
          </div>

          {/* Mobile number */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input.Root name="mobileNumber">
              <Input.Icon iconSrc="/assets/svg/my-brands/poc/phone-ring.svg" />
              <Input.Content
                label="Mobile Number"
                placeholder="Enter Phone Number"
                prefixOptions={[
                  {
                    value: "IN",
                    label: "IN",
                    iconSrc: "/assets/svg/my-brands/poc/india-flag.svg",
                  },
                ]}
              />
            </Input.Root>

            <Switch />
          </div>

          <h2 className="mb-4 font-recoletaAlt text-xl text-white">
            Other Links
          </h2>

          <Input.Root name="linkedin">
            <Input.Icon iconSrc="/assets/svg/my-brands/poc/linkedin.svg" />
            <Input.Content
              label="Linkedin Profile"
              placeholder="Enter linkedin profile URL"
            />
          </Input.Root>
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
