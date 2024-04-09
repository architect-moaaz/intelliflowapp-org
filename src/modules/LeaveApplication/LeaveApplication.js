import React, { useEffect } from "react";
import FileExploerComContainer from "../../components/FileExploerCom/FileExploerComContainer";
import RightSidebarContainer from "../../components/RightSidebar/RightSidebarContainer";
import { getAllResources } from "../../services/fileExploreCom.action";
import { useRecoilState } from "recoil";
import { sidebarDataState, openFilesState } from "../../state/atom";

const LeaveApplication = () => {
  const [openFiles, setOpenFiles] = useRecoilState(openFilesState);
  const [sidebarData, setSidebarData] = useRecoilState(sidebarDataState);
  const openFileInTab = (file) => {
    const checkFile = openFiles
      .map((e) => e.resourceName)
      .includes(file.resourceName);

    if (!checkFile) {
      setOpenFiles([...openFiles, file]);
    }
  };

  const closeFileInTab = (file) => {
    const tempFiles = openFiles.filter(
      (item) => item.resourceName !== file.resourceName
    );
    setOpenFiles([...tempFiles]);
  };

  useEffect(() => {
    doGetAllResources();
  }, [0]);

  const doGetAllResources = () => {
    getAllResources().then((resp) => {
      let temp = {
        bpmn: [...resp.data.bpmn],
        dmn: [...resp.data.dmn],
        datamodel: [...resp.data.datamodel],
        form: resp.data.form.map((item) => {
          if (item.layoutData) {
            return { ...item };
          } else {
            return { ...item, active: false, layoutData: [] };
          }
        }),
        page: [...resp.data.page],
      };
      setSidebarData({ ...temp });
    });
  };

  const setFormsData = () => {
    setTimeout(() => {
      const temp = sidebarData?.form.map((item) => {
        return {
          ...item,
          active: false,
          layoutData: [],
        };
      });
      setSidebarData({ ...sidebarData, form: [...temp] });
    }, 4000);
  };

  return (
    <>
      <div className="main-content">
        <FileExploerComContainer openFileInTab={openFileInTab} />
        <RightSidebarContainer
          closeFileInTab={closeFileInTab}
          doGetAllResources={doGetAllResources}
        />
      </div>
    </>
  );
};
export default LeaveApplication;
