function ResetConfirmPw({handleValidation, handlePasswordChange, confirmPasswordValue, confirmPasswordError,showConfirmPassword}){
    return (
        <>
     <div className="form-group my-3">
        <input type={showConfirmPassword ? "text" : "password"}  value={confirmPasswordValue}  onChange={handlePasswordChange} onKeyUp={handleValidation} name="confirmPassword" placeholder="Enter Confirm Password Here" className="newPasswordInput" id="resetConfirmPw-confirmPassword-input"/>
        <p className="text-danger secondaryColor">{confirmPasswordError}</p>
    </div>
        </>
    )
}

export default ResetConfirmPw;