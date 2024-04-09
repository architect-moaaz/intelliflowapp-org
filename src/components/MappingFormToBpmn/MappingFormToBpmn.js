import React, { useState } from "react";

// import { Button, Modal } from "bootstrap";
import "./MappingFormToBpmn.css";

const MappingFormToBpmn = ({show, handleClose}) => {
  // const [show, setShow] = useState(false);
  const [mapData, setMapData] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const showMapData = () => {
    setMapData(!mapData);
  };
  return (
    <div>data</div>
  //   <>
  //     {/* <Button variant="primary" onClick={handleShow}>
  //       Launch demo modal
  //     </Button> */}

  //     {/* login.bpmn */}
  //     <Modal
  //       show={show}
  //       onHide={handleClose}
  //       className={`loginBpmn-modal ${mapData && "showmap"}`}
  //       centered
  //     >
  //       <Modal.Header closeButton>
  //         <Modal.Title>login.bpmn</Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <Row className="loginbpmnRow">
  //           <Col lg={6}>
  //             <Row>
  //               <Col lg={6}>
  //                 <div className="loginbpmn-select">
  //                   <h6>Human Task</h6>
  //                   <CustomSelect transferFrom={LHumanTasks} />
  //                 </div>
  //               </Col>
  //               <Col lg={6}>
  //                 <div className="loginbpmn-select">
  //                   <h6>.frm</h6>
  //                   <CustomSelect transferFrom={LFormField} />
  //                 </div>
  //               </Col>
  //             </Row>
  //           </Col>
  //           <Col lg={6} className="border-left-1">
  //             <Row>
  //               <Col lg={6}>
  //                 <div className="loginbpmn-select">
  //                   <h6>Variable</h6>
  //                   <ul className="variable-boxs">
  //                     <li className="orange-text">
  //                       <span className="orange-text">
  //                         <Icon icon="codicon:symbol-variable" />
  //                       </span>
  //                       variable 1
  //                     </li>
  //                     <li className="orange-text">
  //                       <span className="orange-text">
  //                         <Icon icon="codicon:symbol-variable" />
  //                       </span>
  //                       variable 2
  //                     </li>
  //                   </ul>
  //                 </div>
  //               </Col>
  //               <Col lg={6}>
  //                 <div className="loginbpmn-select">
  //                   <h6>
  //                     Login Form.frm
  //                     <Link to="#">
  //                       <Icon icon="bx:message-square-edit" />
  //                     </Link>
  //                   </h6>
  //                   <CustomSelect transferFrom={LFormField} />
  //                   <CustomSelect transferFrom={LFormField} />
  //                 </div>
  //               </Col>
  //             </Row>
  //           </Col>
  //         </Row>
  //         <Row className="loginbpmnRow2 mt-4">
  //           <Col lg={6}>
  //             <Row>
  //               <Col lg={6}>
  //                 <h5>Human Task</h5>
  //                 <CustomSelect transferFrom={HumanTasks} />
  //               </Col>
  //               <Col lg={6}>
  //                 <h5>Human Task</h5>
  //                 <CustomSelect transferFrom={Selectfrm} />
  //               </Col>
  //             </Row>
  //             <Link to="#" className="human-Link mt-5"><Icon icon="fluent:add-circle-16-filled" /> Add Human task</Link>
  //           </Col>
  //           <Col lg={6} className="border-left-1">
  //             <Row>
  //               <Col lg={6}>
  //                 <div className="loginbpmn-select">
  //                   <h5>Variable</h5>
  //                   <ul className="variable-boxs">
  //                     <li className="gray-text">
  //                       <span className="gray-text">
  //                         <Icon icon="codicon:symbol-variable" />
  //                       </span>
  //                       variable 1
  //                     </li>
  //                   </ul>
  //                 </div>
  //               </Col>
  //               <Col lg={6}>
  //                 <div className="loginbpmn-select">
  //                   <h5>
  //                     Login Form.frm
  //                   </h5>
  //                   <CustomSelect transferFrom={FormField} />
  //                 </div>
  //               </Col>
  //             </Row>
  //             <div className="mapping-btn-action mt-5">
  //               <Link to="#" className="btn btn-white">
  //                 Clear All
  //               </Link>
  //               <Link
  //                 to="/LeaveApplication"
  //                 className="btn btn-orange"
  //                 onClick={showMapData}
  //               >
  //                 Map
  //               </Link>
  //             </div>
  //           </Col>
  //         </Row>
  //       </Modal.Body>
  //     </Modal>

  //     {/* Form 1.frm */}
  //     <Modal
  //       show={show}
  //       onHide={handleClose}
  //       className={mapData && "showmap"}
  //       centered
  //     >
  //       <Modal.Header closeButton>
  //         <Modal.Title>Form 1.frm</Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <Row className="mapdataRow">
  //           <Col lg={12} className="mapdatainfo">
  //             <Row>
  //               <Col md={6}>
  //                 <div className="mapping-select-box">
  //                   <p>.Bpmn</p>
  //                   <CustomSelect transferFrom={Bpmn} />
  //                 </div>
  //               </Col>
  //               <Col md={6}>
  //                 <div className="mapping-select-box">
  //                   <p>Human Task</p>
  //                   <CustomSelect transferFrom={HumanTasks} />
  //                 </div>
  //               </Col>
  //             </Row>
  //             <div className="mapping-btn-action mt-5">
  //               <Link to="#" className="btn btn-white">
  //                 Clear All
  //               </Link>
  //               <Link
  //                 to="/leaveApplication"
  //                 className="btn btn-orange"
  //                 onClick={showMapData}
  //               >
  //                 Map
  //               </Link>
  //             </div>
  //           </Col>
  //           <Col lg={12} className="mapdataresult">
  //             <Row>
  //               <Col md={6}>
  //                 <div className="variable-info">
  //                   <h6>Variable</h6>
  //                   <ul className="variable-boxs">
  //                     <li>
  //                       <span>
  //                         <Icon icon="codicon:symbol-variable" />
  //                       </span>
  //                       variable 1
  //                     </li>
  //                     <li>
  //                       <span>
  //                         <Icon icon="codicon:symbol-variable" />
  //                       </span>
  //                       variable 2
  //                     </li>
  //                     <li>
  //                       <span>
  //                         <Icon icon="codicon:symbol-variable" />
  //                       </span>
  //                       variable 3
  //                     </li>
  //                     <li>
  //                       <span>
  //                         <Icon icon="codicon:symbol-variable" />
  //                       </span>
  //                       variable 4
  //                     </li>
  //                   </ul>
  //                 </div>
  //               </Col>
  //               <Col md={6}>
  //                 <div className="mapping-select-box">
  //                   <h6>Login Form.frm</h6>
  //                   <CustomSelect transferFrom={FormField} />
  //                   <CustomSelect transferFrom={FormField} />
  //                   <CustomSelect transferFrom={FormField} />
  //                   <CustomSelect transferFrom={FormField} />
  //                 </div>
  //               </Col>
  //             </Row>
  //             <div className="mapping-btn-action mt-5">
  //               <Link to="#" className="btn btn-white">
  //                 Clear All
  //               </Link>
  //               <Link
  //                 to="/LeaveApplication"
  //                 className="btn btn-orange"
  //                 onClick={showMapData}
  //               >
  //                 Map
  //               </Link>
  //             </div>
  //           </Col>
  //         </Row>
  //       </Modal.Body>
  //     </Modal>
  //   </>
  );
};
export default MappingFormToBpmn;
