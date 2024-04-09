import RightSidebar from "./RightSidebar";

const RightSidebarContainer = ({ closeFileInTab, doGetAllResources }) => {
  return (
    <RightSidebar
      closeFileInTab={closeFileInTab}
      doGetAllResources={doGetAllResources}
    />
  );
};
export default RightSidebarContainer;
