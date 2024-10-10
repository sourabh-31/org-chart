"use client";

import Modal from "./shared/Modal";
import AddNotes from "./AddNotes";
import DeleteNode from "./DeleteNode";
import DeleteNote from "./DeleteNote";
import EditNote from "./EditNote";
import MoveNode from "./MoveNode";

export default function ModalWindows() {
  return (
    <>
      <Modal.Window name="delete-node">
        <DeleteNode />
      </Modal.Window>

      {/* Move person */}
      <Modal.Window name="move-person">
        <MoveNode title="Move Person" />
      </Modal.Window>

      {/* Move Department */}
      <Modal.Window name="move-department">
        <MoveNode title="Move Department" />
      </Modal.Window>

      {/* Move Department */}
      <Modal.Window name="move-location">
        <MoveNode title="Move Location" />
      </Modal.Window>

      {/* Add notes */}
      <Modal.Window name="add-notes">
        <AddNotes />
      </Modal.Window>

      {/* Edit note */}
      <Modal.Window name="edit-note">
        <EditNote />
      </Modal.Window>

      {/* Delete Note */}
      <Modal.Window name="delete-note">
        <DeleteNote />
      </Modal.Window>
    </>
  );
}
