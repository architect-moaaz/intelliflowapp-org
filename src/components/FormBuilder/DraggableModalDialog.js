import ModalDialog from "react-bootstrap/ModalDialog";
import Draggable from "react-draggable";

export default function DraggableModalDialog(props) {
  return (
    <Draggable handle=".modal-title" bounds="parent">
      <ModalDialog {...props} />
    </Draggable>
  );
}
