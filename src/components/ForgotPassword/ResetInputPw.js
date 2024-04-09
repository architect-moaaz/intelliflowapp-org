function ResetInputPw({handleValidation, handlePasswordChange, passwordValue, passwordError,showPassword}){

    return (
        <>
    <div className="form-group my-3">
        <input type={showPassword ? "text" : "password"}  value={passwordValue}  onChange={handlePasswordChange} onKeyUp={handleValidation} name="password" placeholder="  Enter New Password Here" className="newPasswordInput" id="resetInputPw-newPassword-input"/>
        <p className="text-danger secondaryColor">{passwordError}</p>
   </div>
          
        </>
    )
}

export default ResetInputPw;