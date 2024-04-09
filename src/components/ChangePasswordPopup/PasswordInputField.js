function PasswordInputField({
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
        {/* <label htmlFor="">New Password</label> */}
        <input
          type="password"
          defaultValue={passwordValue}
          onChange={(e) => {
            // handlePasswordChange(e);
            updatePasswordvalue(e);
          }}
          onKeyUp={handleValidation}
          name="password"
          // placeholder="  Enter New Password Here"
          className="currentpassword"
        />
        <p className="text-danger secondaryColor">{passwordError}</p>
      </div>
    </>
  );
}

export default PasswordInputField;
