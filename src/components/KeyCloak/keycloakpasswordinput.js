function keycloakpasswordinput({
  handleValidation,
  handlePasswordChange,
  passwordValue,
  passwordError,
  updatePasswordvalue,
}) {
  // console.log("anything",passwordValue,passwordError)
  return (
    <>
      <div className="form-group ">
        <input
          type="password"
          value={passwordValue}
          onChange={(e) => {
            //handlePasswordChange
            updatePasswordvalue(e);
          }}
          onKeyUp={handleValidation}
          name="password"
          placeholder="  Enter New Password Here"
          className="currentpasswordkeycloak"
        />
        <p className="text-danger secondaryColor">{passwordError}</p>
      </div>
    </>
  );
}

export default keycloakpasswordinput;
