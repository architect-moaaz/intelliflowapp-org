import "../ApplicationItem/ApplicationItem.css";

const keyCloakHeader = ({ setheaderTitle }) => {
  setheaderTitle("User Management");
  return (
    <>
      <div className="main-content"></div>
    </>
  );
};

export default keyCloakHeader;
