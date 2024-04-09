const NewPassInput =({
    handleValidation,
    handlePasswordChange,
    passwordValue,
    passwordError,
    updatePasswordvalue,
  }) => {
    // console.log("anything",passwordValue,passwordError)
    return (
      <>
        <div className="form-group ">
          <label className="" htmlFor="">New Password</label>
          <input
            type="password"
            defaultValue={passwordValue}
            onChange={(e) => {
              handlePasswordChange(e);
              // updatePasswordvalue(e);  
            }}
            onKeyUp={handleValidation}
            name="password"
            className="currentpassword"
          />
          {/* <p className="text-danger">{passwordError}</p> */}
        </div>
      </>
    );
  }
  
  export default NewPassInput;
  