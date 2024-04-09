import "./BulkUploadStyles.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { FileUploader } from "react-drag-drop-files";
import React, { useState, useEffect } from "react";
import axios from "axios";
import deleteIcon from "../../../assets/Icons/delete-orange.svg";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import checked from "../../../assets/Icons/checked-green.svg";
// import loading from "../../../assets/animations/deploymentScanner.gif";

const BulkUpload = () => {
  const [openModel, setopenModel] = useState(false);
  const [openModelTwo, setOpenModelTwo] = useState(false);
  const [openModelThree, setOpenModelThree] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);
  const [byteArrayResult, setByteArrayResult] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const fileTypes = ["xlsx"];

  const closeIcon = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.83265 7.00019L13.5244 2.71019C13.7299 2.52188 13.8453 2.26649 13.8453 2.00019C13.8453 1.73388 13.7299 1.47849 13.5244 1.29019C13.319 1.10188 13.0403 0.996094 12.7497 0.996094C12.4592 0.996094 12.1805 1.10188 11.975 1.29019L7.29419 5.59019L2.61333 1.29019C2.40787 1.10188 2.12921 0.996094 1.83865 0.996094C1.54808 0.996094 1.26942 1.10188 1.06396 1.29019C0.858499 1.47849 0.743073 1.73388 0.743073 2.00019C0.743073 2.26649 0.858499 2.52188 1.06396 2.71019L5.75573 7.00019L1.06396 11.2902C0.961691 11.3831 0.880519 11.4937 0.825125 11.6156C0.769731 11.7375 0.741211 11.8682 0.741211 12.0002C0.741211 12.1322 0.769731 12.2629 0.825125 12.3848C0.880519 12.5066 0.961691 12.6172 1.06396 12.7102C1.16539 12.8039 1.28607 12.8783 1.41903 12.9291C1.55199 12.9798 1.69461 13.006 1.83865 13.006C1.98269 13.006 2.1253 12.9798 2.25826 12.9291C2.39122 12.8783 2.5119 12.8039 2.61333 12.7102L7.29419 8.41019L11.975 12.7102C12.0765 12.8039 12.1972 12.8783 12.3301 12.9291C12.4631 12.9798 12.6057 13.006 12.7497 13.006C12.8938 13.006 13.0364 12.9798 13.1693 12.9291C13.3023 12.8783 13.423 12.8039 13.5244 12.7102C13.6267 12.6172 13.7079 12.5066 13.7633 12.3848C13.8186 12.2629 13.8472 12.1322 13.8472 12.0002C13.8472 11.8682 13.8186 11.7375 13.7633 11.6156C13.7079 11.4937 13.6267 11.3831 13.5244 11.2902L8.83265 7.00019Z"
        fill="white"
      />
    </svg>
  );

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setExcelData(d);
    });
  };

  const onOpenModal = () => {
    setopenModel(true);
  };

  const onCloseModal = () => {
    setopenModel(false);
  };

  const onOpenModalTwo = () => {
    setOpenModelTwo(true);
  };

  const onCloseModalTwo = () => {
    setOpenModelTwo(false);
  };
  const onOpenModalThree = () => {
    setOpenModelThree(true);
  };

  const onCloseModalThree = () => {
    setOpenModelThree(false);
  };

  // console.log("excelData", excelData);

  const handleAddFile = () => {
    if (byteArrayResult.length != 0) {
      byteArrayResult.forEach((files) => {
        var file = Object.values(files).flat();
        const postData = {
          file: file,
        };
        const headers = {
          "Content-Type": "application/json",
        };
        axios
          .post(
            "https://upload.intelliflow.in/BULK/userManagement/upload",
            postData,
            { headers }
          )
          .then((response) => {
            // console.log("response BulkUpload", response.data?.Status);
            onCloseModal();
            onOpenModalTwo();
            toast.success("Users added successfully!!!", {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          });
      });
    }
  };

  const handleFileUpload = (files) => {
    setFileUpload(files);
    setByteArrayResult([{ [files.name]: files }]);
    readExcel(files);
  };

  const removeFile = (filess) => () => {
    const newFiles = [...byteArrayResult];
    newFiles.splice(newFiles.indexOf(filess), 1);
    setByteArrayResult(newFiles);
  };
  return (
    <div>
      <div className="rightSideTopBar">
        <div className="bulkUpload">
          <button
            id="bulk-upload-btn"
            className="bulkUploadBtn primaryButtonColor"
            onClick={onOpenModal}
          >
            Bulk Upload
          </button>
        </div>
      </div>
      <Modal
        id="custom-bulk-upload-file-modal"
        open={openModel}
        onClose={onCloseModal}
        classNames={{
          overlay: "customOverlayBulkUpload",
          modal: "customModalBulkUpload",
        }}
        closeIcon={closeIcon}
      >
        <div className="innerContainer">
          <div className="popupTop header-main-nav">
            <p className="secondaryColor">Upload File</p>
          </div>
          <div className="bulkUploadPopupBottom row">
            <div className="col-sm-6 ">
              <div className="popupBottomLeft">
                <p className="secondaryColor">Import File</p>
                <div className="fileUploader">
                  <FileUploader
                    id="bulk-upload-import-file"
                    handleChange={handleFileUpload}
                    name="fileUpload"
                    types={fileTypes}
                    fileOrFiles={fileUpload}
                  >
                    <div className="fileUploaderText">
                      <p className="secondaryColor">Drag & Drop your file here </p>
                      <p className="secondaryColor">or</p>
                      <p className="secondaryColor">Browser</p>
                    </div>
                  </FileUploader>
                  {byteArrayResult.length !== 0 && (
                    <div className="UploadedDataDiv">
                      <p className="secondaryColor">Uploaded</p>
                      <ul
                        className={
                          byteArrayResult.length > 3 ? "imageUploadScroll" : ""
                        }
                      >
                        {byteArrayResult.map((filess) => (
                          <li key={Object.keys(filess)}>
                            <span
                              id="bulk-upload-uploaded-file"
                              className="uploadFileName secondaryColor"
                            >
                              {Object.keys(filess)}
                            </span>
                            <img
                              id="bulk-upload-delete-img"
                              onClick={removeFile(filess)}
                              src={deleteIcon}
                              alt="React Logo"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="UploadFileType">
                  <p className="secondaryColor">File format should be CSV or XML</p>
                </div>
                <div className="AddFileBtn">
                  <button
                    id="bulk-upload-add-file"
                    className="primaryButton primaryButtonColor"
                    onClick={handleAddFile}
                  >
                    Add File
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        id="custom-bulk-upload-loading-modal"
        open={openModelTwo}
        onClose={onCloseModalTwo}
        classNames={{
          overlay: "customOverlayBulkUpload",
          modal: "customModalBulkUpload",
        }}
        closeIcon={closeIcon}
      >
        <div className="innerContainer">
          <div className="BulkUploadLoader">
            <img
              id="bulk-upload-loader-img"
              height={200}
              width={200}
              src={require("../../../assets/animations/deploymentScanner.gif")}
              alt="loading..."
            />

            <div className="bulkUploadPopupBottom HangOn row">
              <p className="secondaryColor">Hang on!</p>
            </div>
            <div className="bulkUploadPopupBottom File row">
              <p className="secondaryColor">Processing the file User.xml</p>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        id="custom-bulk-upload-modal"
        open={openModelThree}
        onClose={onCloseModalThree}
        classNames={{
          overlay: "customOverlayBulkUpload",
          modal: "customModalBulkUpload",
        }}
        closeIcon={closeIcon}
      >
        <div className="innerContainer">
          <div className="popupTop header-main-nav">
            <p className="secondaryColor">Confirmation</p>
          </div>
          <div className="checkedIcon">
            <img id="bulk-upload-checked-img" src={checked} />
          </div>
          <div className="bulkUploadPopupBottom row">
            <p className="secondaryColor">User has been created successfully!!!</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BulkUpload;
