import { useChartStore } from "@/store/useChartStore";

import { useModal } from "./shared/Modal";

interface SelectedNote {
  id: string;
}

export default function DeleteNote() {
  const { close } = useModal();
  const { selectedNote, resetSelectedNote, deleteNote } = useChartStore();

  const { id } = selectedNote as SelectedNote;

  function handleDeleteNote() {
    if (id) {
      deleteNote(id);
      resetSelectedNote();
      close();
    }
  }

  return (
    <div
      className="mx-auto w-[70%] rounded-xl bg-[#2D3036] p-6 sm:mx-0 sm:w-[520px]"
      style={{ boxShadow: "0px 0px 72px 0px #00000024" }}
    >
      <div className="text-center font-recoletaAlt text-xl text-white">
        Are you sure?
      </div>
      <div className="mt-[10px] text-center font-mulish text-white">
        Do you want to delete this note, this process is irreversible. All
        direct reports and subordinates, if any, will be moved one level up.
      </div>

      <div className="mb-3 mt-6 flex items-center justify-center gap-5">
        <button
          className="h-[40px] w-[200px] rounded-full border border-[#FFFFFF66] bg-[#FFFFFF] font-mulish font-bold tracking-[0.036em] text-[#383838] sm:h-[50px]"
          type="button"
          onClick={() => {
            close();
            resetSelectedNote();
          }}
        >
          CANCEL
        </button>
        <button
          className="h-[40px] w-[200px] rounded-full bg-[#EE7360] font-mulish font-bold tracking-[0.036em] text-[#000000] sm:h-[50px]"
          type="button"
          onClick={handleDeleteNote}
        >
          DELETE
        </button>
      </div>
    </div>
  );
}
