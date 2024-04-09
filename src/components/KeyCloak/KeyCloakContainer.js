import KeyCloak from "./KeyCloak";

const KeyCloakContainer = ({setheaderTitle}) => {
  setheaderTitle("User Management")
  return (
    <KeyCloak />
  );
};
export default KeyCloakContainer;
