function CurrentPasswordField({handleValidation, handlePasswordChange, passwordValue, passwordError}){
    return (
        <>
    <div className="form-group my-3">
        <input type="password" value={passwordValue}  onChange={handlePasswordChange} onKeyUp={handleValidation} name="currentpassword" placeholder="Enter currentPassword Here" className="currentpassword" id="confirmPasswordField-input" />
        <p className="text-danger secondaryColor">{passwordError}</p>
   </div>
          
        </>
    )
}

export default CurrentPasswordField;