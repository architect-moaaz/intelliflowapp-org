import { Modal } from "react-bootstrap";

const CommonModel = ({
  show,
  handleClose,
  className,
  modalTitle,
  children,
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      className={className}
      scrollable={true}
      id="CommonModel-Modal"
      centered
    >
      {modalTitle && (
        <Modal.Header className="header-main-nav" closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default CommonModel;
