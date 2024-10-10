import Image from "next/image";
import { useState } from "react";

import { useChartStore } from "@/store/useChartStore";

import ExtendedSelect from "./shared/ExtendedSelect";
import { Menu } from "./shared/Menu";
import Modal from "./shared/Modal";

interface SelectedPeople {
  id: string;
  name: string;
  role?: string;
  type: string;
}

interface SelectedData {
  id: string;
}

export default function PublicNote() {
  const { notes, findAndSetNoteById, selectedData } = useChartStore();
  const [selectedPeople, setSelectedPeople] = useState<null | SelectedPeople>(
    null
  );
  const { id: peopleId } = selectedData as SelectedData;
  const [searchTerm, setSearchTerm] = useState("");

  const convertedData = localStorage.getItem("convertedData");
  const people = convertedData ? JSON.parse(convertedData).people : [];

  // Filter notes based on type, search term, and selected people
  const filteredNotes = notes.filter((data) => {
    const matchesType = data.type === "Public";
    const matchesSearch = data.note
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPeople = selectedPeople
      ? data.addedBy === selectedPeople.name
      : true;

    return matchesType && matchesSearch && matchesPeople;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {});
  };

  return (
    <div>
      <input
        name="noteReason"
        type="text"
        placeholder="What's this note about?"
        className="mt-6 w-full rounded-lg border-[0.5px] border-[#D1D5DC] bg-transparent px-3 py-[14px] font-mulish text-sm text-[#FFFFFF99] outline-none placeholder:text-[#898989]"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="mt-6">
        <div className="font-mulish text-sm font-bold text-white">
          This Month
        </div>

        {filteredNotes.length === 0 ? (
          <div className="mt-4 text-center font-mulish text-sm text-gray-400">
            No matching notes found
          </div>
        ) : (
          filteredNotes.map((data) => (
            <div
              className="mt-[10px] rounded-[10px] bg-[#FFD64E]"
              key={data.id}
            >
              <div className="flex items-center justify-between border-b border-[#0000001A] p-3">
                <div className="flex items-center gap-2">
                  <div className="w-fit rounded-full border-[0.4px] border-[#00000033] bg-[#00000033]">
                    <Image
                      src="/assets/svg/my-brands/profile.svg"
                      alt="profile"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex flex-col font-mulish">
                    <span className="text-sm font-medium">{data.addedBy}</span>
                    <span className="text-xs font-semibold">
                      {data.dateAdded}
                    </span>
                  </div>
                </div>

                <Menu>
                  <Menu.Trigger>
                    <button type="button">
                      <Image
                        src="/assets/svg/my-brands/brand-info/more.svg"
                        alt="more"
                        width={16}
                        height={16}
                      />
                    </button>
                  </Menu.Trigger>
                  <div className="relative right-16">
                    <Menu.Items position="bottom" width="156px">
                      {data.nodeId === peopleId ? (
                        <Modal.Open opens="edit-note">
                          <Menu.Item
                            imgSrc="/assets/svg/my-brands/pencil.svg"
                            btnName="Edit"
                            onClick={() => findAndSetNoteById(data.id)}
                          />
                        </Modal.Open>
                      ) : null}

                      <Menu.Item
                        imgSrc="/assets/svg/my-brands/copy.svg"
                        btnName="Copy"
                        onClick={() => copyToClipboard(data.note)}
                      />

                      {data.nodeId === peopleId ? (
                        <Modal.Open opens="delete-note">
                          <Menu.Item
                            isDanger
                            imgSrc="/assets/svg/my-brands/trash.svg"
                            btnName="Delete"
                            onClick={() => findAndSetNoteById(data.id)}
                          />
                        </Modal.Open>
                      ) : null}
                    </Menu.Items>
                  </div>
                </Menu>
              </div>
              <div className="flex flex-col gap-1 p-3">
                <span className="font-mulish font-extrabold">{data.title}</span>
                <span className="font-mulish text-sm font-medium">
                  {data.note}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8">
        <ExtendedSelect
          label="Notes added by"
          name="addedBy"
          placeholder="Select"
          options={people}
          onChange={(option) => setSelectedPeople(option)}
        />
      </div>
    </div>
  );
}
