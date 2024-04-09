function ConfirmPasswordInputField({
  handleValidation,
  handlePasswordChange,
  confirmPasswordValue,
  confirmPasswordError,
}) {
  return (
    <>
      <div className="form-group ">
        <label className="secondaryColor" htmlFor="">Confirm Password</label>
        <input
          type="password"
          value={confirmPasswordValue}
          onChange={handlePasswordChange}
          onKeyUp={handleValidation}
          name="confirmPassword"
          // placeholder="  Enter Confirm Password Here"
          className="currentpassword"
        />
        {/* <p className="text-danger">{confirmPasswordError}</p> */}
      </div>
    </>
  );
}

export default ConfirmPasswordInputField;
