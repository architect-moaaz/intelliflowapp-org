import ModalDialog from "react-bootstrap/ModalDialog";
import Draggable from "react-draggable";

export default function DraggableModalDialog(props) {
  return (
    <Draggable id="drag-modalDialog" handle=".modal-title" bounds="parent">
      <ModalDialog {...props} />
    </Draggable>
  );
}
