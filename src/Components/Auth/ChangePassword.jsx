// Import Component
import React, { useContext, useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toastifyError, toastifySuccess } from '../Common/AlertMsg';
import { AddDeleteUpadate } from '../hooks/Api';
import { AgencyContext } from '../../Context/Agency/Index';

const ChangePassword = () => {

    const { forgetPasswordArray, setForgetPasswordArray, } = useContext(AgencyContext);

    const navigate = useNavigate();
    const [passwordShown, setPasswordShown] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setComfirmPassword] = useState('');
    const [passwordSettingVal, setPasswordSettingVal] = useState([]);
    const [AgencyID, setAgencyID] = useState();
    const [PinID, setPinID] = useState();

    // Password Check Color
    const [colour1, setColour1] = useState('red')
    const [colour2, setColour2] = useState('red')
    const [colour3, setColour3] = useState('red')
    const [colour4, setColour4] = useState('red')
    const [colour5, setColour5] = useState('red')
    const [colour6, setColour6] = useState(false)

    useEffect(() => {
        if (forgetPasswordArray) {
            setPasswordSettingVal(forgetPasswordArray[0]);
            setAgencyID(forgetPasswordArray[0]?.AgencyID);
            setPinID(forgetPasswordArray[0]?.PINID);
        }
    }, [forgetPasswordArray])

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    }

    const change_password = (e) => {
        e.preventDefault()
        const value = {
            "AgencyID": AgencyID,
            "PINID": PinID,
            "Password": password
        }
        if (colour6) {
            if (password === confirmPassword) {
                AddDeleteUpadate('Personnel/UpdatePassword', value)
                    .then(res => {
                        if (res.success) {
                            toastifySuccess(res.Message)
                            navigate('/')
                        } else {
                            toastifyError(res.response.data.Message)
                        }
                    })
                    .catch(err => console.log(err))
            } else {
                toastifyError('confirm password wrong')
            }
        } else {
            toastifyError('Space Not Allow')
        }
    }

    // Password Validation
    const validationPass = (e) => {
        e.preventDefault()
        const val = e.target.value
        setPassword(val)
        if (val?.length >= passwordSettingVal?.MinPasswordLength) {
            setColour1('green')
        } else {
            setColour1('red')
        }
        if (val.match(`(?=(.*[A-Z]){${passwordSettingVal?.MinUpperCaseInPassword}})`)) {
            setColour2('green')
        } else {
            setColour2('red')
        }
        if (val.match(`(?=(.*[a-z]){${passwordSettingVal?.MinLowerCaseInPassword},})`)) {
            setColour3('green')
        } else {
            setColour3('red')
        }
        // eslint-disable-next-line
        if (val.match(`(?=(.*[0-9]){${passwordSettingVal?.MinNumericDigitsInPassword}})`)) {
            // eslint-disable-next-lin
            setColour4('green')
        } else {
            setColour4('red')
        }
        // eslint-disable-next-line
        if (val.match(`(?=(.*[-\#\$\.\%\&\@\*]){${passwordSettingVal?.MinSpecialCharsInPassword}})`)) {
            setColour5('green')
        } else {
            setColour5('red')
        }
        if (val.match(/^\S.*[a-zA-Z\s]*$/)) {
            setColour6(true)
        } else {
            setColour6(false)
        }
     
    }

    // style validation
    const style = {
        boxShadow: "2px 2px 3px 3px #ccc",
        border: "2px #eee",
        padding: "20px",
        marginTop: "25px"
    }

    return (
        <div className="login-container">
            <div className="auth mx-4">
                <div className="card py-3 py-3 col-12 col-sm-6 col-md-5 col-lg-3">
                    <div className="text-center mb-2">
                    </div>
                    <div className="card-body">
                        <form >
                            <div className="text-center pb-2">
                                <h5 className="m-0 pb-3">Change Password</h5>
                                <spna style={{ fontSize: '14px', color: 'red' }}></spna>
                            </div>
                            <div className="form-group">
                                <label className="form-label">New Password
                                </label>
                                <input type="text" className="form-control" placeholder="New Password" onChange={validationPass} />
                            </div>
                            <div className="form-group" style={{ position: 'relative' }}>
                                <label className="form-label">Confirm Password</label>
                                <i className={passwordShown ? "fa fa-eye" : "fa fa-eye-slash"} onClick={togglePassword} style={{ position: 'absolute', top: '60%', right: '3%' }}></i>
                                <input
                                    type="text"
                                    // name="reactPassword"
                                    onChange={(e) => { setComfirmPassword(e.target.value) }}
                                    style={{ WebkitTextSecurity: passwordShown ? 'none' : 'disc' }}
                                    className="form-control"
                                    placeholder="Confirm Password"
                                />
                            </div>
                            <div className="">
                                <button type="submit" className="btn btn-primary btn-block" onClick={change_password}>Change Password</button>
                            </div>
                        </form>
                        <div className="col-md-12">
                            <div style={style}>
                                <form>
                                    <p><i style={{ color: colour1, fontSize: "20px" }} className="fa fa-check-circle" aria-hidden="true"></i> At least {passwordSettingVal?.MinPasswordLength} characters</p>
                                    <p><i style={{ color: colour2, fontSize: "20px" }} className="fa fa-check-circle" aria-hidden="true"></i> At least {passwordSettingVal?.MinUpperCaseInPassword} uppercase letter</p>
                                    <p><i style={{ color: colour3, fontSize: "20px" }} className="fa fa-check-circle" aria-hidden="true"></i> At least {passwordSettingVal?.MinLowerCaseInPassword} lowercase letter</p>
                                    <p><i style={{ color: colour4, fontSize: "20px" }} className="fa fa-check-circle" aria-hidden="true"></i> At least {passwordSettingVal?.MinNumericDigitsInPassword} number </p>
                                    <p><i style={{ color: colour5, fontSize: "20px" }} className="fa fa-check-circle" aria-hidden="true"></i> At least {passwordSettingVal?.MinSpecialCharsInPassword} special character</p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword
