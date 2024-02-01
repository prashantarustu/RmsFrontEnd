// Import Component
import React, { useEffect, useState, memo ,useContext} from "react";
import { useNavigate } from "react-router-dom";
import { toastifyError, toastifyInfo } from "../Common/AlertMsg";
import { Decrypt_Id_Name, Encrypted_Id_Name, decrypt, get_OTP } from "../Common/Utility";
import { AddDeleteUpadate, fetchPostData } from "../hooks/Api";
import { AgencyContext } from "../../Context/Agency/Index";
import uuid from "uuidv4";
var CryptoJS = require("crypto-js");

const Otp = ({ username, otp, loginResData, setOtp, timerOn, type, isMDT }) => {

    const { login_Web_Socket, ws, setLogByOtp, setLocalStoreArray, deleteStoreData, storeData, forgetPasswordArray, setForgetPasswordArray, } = useContext(AgencyContext);

    const [userOtp, setUserOtp] = useState('');
    const [errMSg, setErrMsg] = useState(false)
    const [expireOtp, setExpireOtp] = useState(true)
    const [logLoader, setShowLoader] = useState(false)

    const [webSocketStatus, setWebSocketStatus] = useState(false)
    const [wrongOtpCount, setWrongOtpCount] = useState(0)
    const navigate = useNavigate();
    const [mdoal, setModal] = useState(false);

    var globalIndex = 0;

    //     if (webSocketStatus) {
    //         const client = new WebSocket(`wss://arustumsg.com/wss?username=${Decrypt_Id_Name(localStorage.getItem('UserName'), 'UForUserName') + '$@' + new Date().getTime()}`)
    //         client.onopen = () => {
    //             setWebSocketStatus(false)
    //             console.log('connected')
    //         }
    //         client.onmessage = evt => {
    //             const message = JSON.parse(evt.data)
    //             const loginUserName = message.Content.split(" ", 3);
    //             const socketUserName = loginUserName[1].split("$@", 1);
    //             if (loginUserName[2] === 'left' && socketUserName[0] !== loginResData?.userName) {
    //                 toastifyInfo(socketUserName[0] + ' Logout')
    //                 setWebSocketStatus(true)
    //             } else if (loginUserName[2] === 'joined' && socketUserName[0] !== loginResData?.userName) {
    //                 toastifyInfo(socketUserName[0] + ' Active Now')
    //             }
    //         }
    //         client.onclose = () => {
    //             console.log('disconnected')
    //         }
    //     }
    // }, [webSocketStatus])

    // Call Timer Function 

    useEffect(() => {
        if (timerOn) timer(60);
    }, [timerOn])

    const timer = (remaining) => {
        var m = Math.floor(remaining / 60);
        var s = remaining % 60;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        document.getElementById('timer').innerHTML = m + ':' + s;
        remaining -= 1;

        if (remaining >= 0 && timerOn) {
            setTimeout(function () {
                timer(remaining);
            }, 1000);
            return;
        }
        setExpireOtp(false)
    }

    const [otpCount, setOtpCount] = useState(0)

    useEffect(() => {
        if (otpCount == 3) {
            window.location.reload();
        }
        if (wrongOtpCount == 3) {
            window.location.reload();
        }
    }, [otpCount, wrongOtpCount])

    // Verification Otp 
    const optVerfication = (e) => {
        e.preventDefault()
        if (otp === userOtp && expireOtp && type === 'login') {
            if (loginResData?.Leftdays <= loginResData?.PasswordMessageDays) {
                setModal(true)
            } else {
                login_User()
            }
        
        } else if (otp === userOtp && expireOtp && type === 'forget_password') {
            navigate('/change-Password')
        }
        else if (userOtp != '') {
            setWrongOtpCount(wrongOtpCount + 1)
            toastifyError('Wrong Otp')
            setWebSocketStatus(false)
        } else {
            toastifyError('Please Enter Otp')
            setWebSocketStatus(false)
        }
    }

    // Resend Otp and Verifiy Otp And Again Call timer function
    const Resend_Verification_Code = (e) => {
        e.preventDefault()
        const otp = get_OTP()
        setExpireOtp(true)
        setOtp(otp)
        timer(60);
        setOtpCount(otpCount + 1)
    }

    const store_LocalData = () => {
        const small_uniq_ID = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : ''
        const DataKeys = {
            'AgencyID': loginResData?.AgencyID,
            'Agency_Name': loginResData?.Agency_Name,
            'PINID': loginResData?.PINID,
            'UserName': loginResData?.userName,
            'IsEmail': loginResData?.Email,
            'IsSuperadmin': loginResData?.IsSuperadmin,
            'IsAllowmultipleLogin': loginResData?.IsAllowmultipleLogin,
        }
        setLocalStoreArray(DataKeys);
        storeData(DataKeys);
    }

    const login_User = () => {
        // connect_Websocket();
        var data = loginResData?.AgencyID
        var PINID = CryptoJS.AES.encrypt(JSON.stringify(loginResData?.PINID), 'UForUserID').toString();
        var IsEmail = CryptoJS.AES.encrypt(JSON.stringify(loginResData?.Email), 'EForEmail').toString();
        var AgencyID = CryptoJS.AES.encrypt(JSON.stringify(data), 'AForAgencyID').toString();
        var UserName = CryptoJS.AES.encrypt(JSON.stringify(loginResData?.userName), 'UForUserName').toString();
        var IsSuperadmin = CryptoJS.AES.encrypt(JSON.stringify(loginResData?.IsSuperadmin), 'IsForSuperadmin').toString();
        var IsAllowmultipleLogin = CryptoJS.AES.encrypt(JSON.stringify(loginResData?.IsAllowmultipleLogin), 'IsForAllowmultipleLogin').toString();

        setWebSocketStatus(true)
        setShowLoader(true)
        sessionStorage.setItem('is-login', true)
        setTimeout(() => {
            if (isMDT) {
                navigate('/incident-dashboard');store_LocalData();
            } else {
                navigate('/dashboard-page'); store_LocalData();
            }
        }, 1000);
       
    }

    const verify_User = (e) => {
        e.preventDefault()
        const value = {
            UserName: username
        }
        fetchPostData('Personnel/GetData_ForgotPassword', value)
            .then(res => {
                if (res) {
                    setForgetPasswordArray(res)
                    var AgencyID = CryptoJS.AES.encrypt(JSON.stringify(res[0].AgencyID), 'AForAgencyID').toString();
                    var PINID = CryptoJS.AES.encrypt(JSON.stringify(res[0].PINID), 'UForUserID').toString();
                  
                    navigate('/change-Password');
                }
                else { toastifyError('Username is Wrong') }
            })
    }

    return (
        <>
            <div className="login-container">
                <div className="auth mobile-login mx-4">
                    <div className="card py-3 py-3 col-12 col-sm-6 col-md-5 col-lg-3">
                        <div className="text-center mb-2">
                        </div>
                        <div className="card-body">
                            <form onSubmit={optVerfication}>
                                <div className="text-center pb-2"><span id="otp">{otp}</span>
                                    <h5 className="m-0 pb-3">Login Verification Code</h5>
                                    <spna style={{ fontSize: '14px', color: 'red' }}>{errMSg ? "Invalid UserName" : ''}</spna>
                                    {
                                        logLoader ?
                                            <>
                                                <div className="spinner-border text-success" role="status">
                                                </div> <br />
                                                <span >Please Wait...</span>
                                            </>
                                            : ''
                                    }
                                </div>
                                <div className="">
                                   
                                    <input type="text" className="form-control" autoComplete="off" onChange={(e) => setUserOtp(e.target.value)} id="exampleInputEmail1" value={userOtp} aria-describedby="emailHelp" placeholder="Enter Your 6 digits code" />
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="text-danger col-12" style={{ fontSize: '12px' }}>
                                            <label>Expire in <span id="timer"></span> </label>
                                        </div>
                                    </div>
                                    <div className="col-6  mt-1">
                                        <div className="col-12 text-center bg-green text-white" style={{ fontSize: '10px', borderRadius: '5px' }}>
                                            {
                                                !expireOtp ?
                                                    <label className="pt-1 mb-1" onClick={Resend_Verification_Code}>Resend Verification Code</label>
                                                    :
                                                    <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5">
                                  
                                    <button type="submit" className="btn btn-primary btn-block">Verify</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {
                    mdoal ?
                        <div style={{ background: "rgba(0,0,0, 0.5)", position: 'fixed', top: '0', left: '0', zIndex: '1990', width: '100%' }}>
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="box text-center py-5">
                                        {
                                            logLoader ?
                                                <>
                                                    <div className="spinner-border text-success" role="status">
                                                    </div> <br />
                                                    <span >Please Wait...</span>
                                                </>
                                                : ''
                                        }
                                        <h5 className="modal-title mt-2" id="exampleModalLabel">{loginResData?.Leftdays === '0' ? 'Your password is expired, please change your password.' : `change your password within ${loginResData?.Leftdays} days.`}</h5>
                                        <div className="btn-box mt-3">
                                            <button type="button" className="btn btn-sm text-white" style={{ background: "#ef233c" }} data-dismiss="modal" onClick={verify_User}>Change</button>
                                            {
                                                loginResData?.Leftdays === '0' ? <></>
                                                    :
                                                    <button type="button" className="btn btn-sm btn-secondary ml-2 " data-dismiss="modal" onClick={login_User}> Cancel</button>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <></>
                }
            </div>
        </>
    )
}

export default memo(Otp)