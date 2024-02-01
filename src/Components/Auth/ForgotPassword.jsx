// Import Component
import React, { memo, useContext, useState } from 'react'
import { toastifyError } from '../Common/AlertMsg';
import { get_OTP } from '../Common/Utility';
import { fetchPostData } from '../hooks/Api';
import Otp from './Otp';
import { AgencyContext } from '../../Context/Agency/Index';
var CryptoJS = require("crypto-js");

const ForgotPassword = () => {

    const { forgetPasswordArray, setForgetPasswordArray, } = useContext(AgencyContext);

    const [userName, setUserName] = useState('');
    const [timerOn, setTimerOn] = useState(false);
    const [otp, setOtp] = useState('');
    const [type] = useState('forget_password');

    // Check User 
    const verify_User = (e) => {
        e.preventDefault()
        const value = { UserName: userName }
        fetchPostData('Personnel/GetData_ForgotPassword', value)
            .then(res => {
                if (res) {
                    setForgetPasswordArray(res);
                    console.log(res)
                    var AgencyID = CryptoJS.AES.encrypt(JSON.stringify(res[0].AgencyID), 'AForAgencyID').toString();
                    var PINID = CryptoJS.AES.encrypt(JSON.stringify(res[0].PINID), 'UForUserID').toString();
                    dom_Fuction('otp-page')
                }
                else toastifyError('Username is Wrong')
            })
    }

    // Change Page With Dom 
    const dom_Fuction = (val) => {
        if (val === 'otp-page') {
            setTimerOn(true)
            const otp = get_OTP()
            setOtp(otp)
            document.getElementById('otp-page').style.display = 'block'
            document.getElementById('check_user').style.display = 'none'
            document.getElementById('change_pass').style.display = 'none'
        }
    }

    return (
        <>
            {/* User Verify Page */}
            <div className="login-container" id='check_user' style={{ display: 'block' }}>
                <div className="auth mx-4">
                    <div className="card py-3 py-3 col-12 col-sm-6 col-md-5 col-lg-3">
                        <div className="text-center mb-2">
                        </div>
                        <div className="card-body">
                            <form >
                                <div className="text-center pb-2">
                                    <h5 className="m-0 pb-3">Forgot Password</h5>
                                    <spna style={{ fontSize: '14px', color: 'red' }}></spna>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">UserName </label>
                                    <input type="text" className="form-control" onChange={(e) => setUserName(e.target.value)} placeholder="Enter Username" />
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-primary btn-block" onClick={verify_User}>Verify</button>
                                </div>
                              
                            </form>
                        </div>
                    </div>
                </div>
            </div >
            {/* Otp Page Component */}
            <div id='otp-page' style={{ display: 'none' }}>
                <Otp {...{ timerOn, otp, setOtp, type }} />
            </div>
        </>
    )
}

export default memo(ForgotPassword)