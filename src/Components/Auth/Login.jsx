// Import Component
import React, { useEffect, useState, memo, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Otp from "./Otp";
import { Decrypt_Id_Name, Encrypted_Id_Name, getShowingYearMonthDate, get_OTP } from "../Common/Utility";
import { AddDeleteUpadate, fetchPostData } from "../hooks/Api";
import { toastifyError } from "../Common/AlertMsg";
import Select from 'react-select';
import uuid from "uuidv4";
import { AgencyContext } from "../../Context/Agency/Index";

var CryptoJS = require("crypto-js");

const Login = ({ login }) => {

    const { tokenArray, setTokenArray, setLocalStoreArray, authSession, getAuthSession, setAuthSession, isLogout, logByOtp, setLogByOtp, setIsLogout } = useContext(AgencyContext)

    // Hooks initialize   
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [unitName, setUnitName] = useState(0);
    const [grant_type] = useState('password');
    const [errMSg, setErrMsg] = useState('');
    const [loginAttempt, setLoginAttempt] = useState('');
    const [loginAttemptStatus, setLoginAttemptStatus] = useState(false);
    const [loginResData, setLoginResData] = useState([]);
    const [otp, setOtp] = useState('');
    const [type] = useState('login');
    const [logLoader, setShowLoader] = useState(false);
    const [timerOn, setTimerOn] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);
    const [unitCheck, setUnitCheck] = useState(false);
    const [agency, setAgency] = useState([]);
    const [unit, setUnit] = useState([]);
    const agencyPlaceholder = []
    const unitPlaceholder = []
    const [isMDT, setIsMDT] = useState(false);

    const IsLoginSession = sessionStorage.getItem('is-login') ? sessionStorage.getItem('is-login') : false;

  

    useEffect(() => {
        if (IsLoginSession === 'true' || IsLoginSession === true) {
            setIsLogout(false);
            setLogByOtp(false)
            setAuthSession('');
            navigate('/');
            sessionStorage.setItem('is-login', false);
        }
    }, [])



    const handleMDT_Change = (e) => {
        setIsMDT(e.target.checked);
    }

    useEffect(() => {
        if (timerOn) {
            document.getElementById('login').style.display = 'none';
            document.getElementById('otp').style.display = 'block';
        }
    }, [timerOn])

    // Show Password
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    // Check Login Attempt and Lock Id 
    const login_Attempt = (err) => {
        if (err === 'Sorry Please Unlock Your Account') {
            toastifyError(err)
            setLoginAttemptStatus(false)
            setErrMsg("Lock your Id")
        } else if (err === 'Please Select Group') {
            setLoginAttemptStatus(false)
            setErrMsg('Please assigned the Group')
        } else if (err === 'Sorry Please isAllowLogin Your Account') {
            setLoginAttemptStatus(false)
            setErrMsg('Sorry, Please Allow Login to Your Account')
        } else if (err === 'Invalid UserName and password') {
       
            if (loginAttempt > 1) {
                toastifyError(err)
                setLoginAttempt(loginAttempt - 1)
                setLoginAttemptStatus(true)
                setErrMsg("Invalid UserName & Password")
            }
            else {
                setLoginAttemptStatus(false)
                lock_User_Id()
                setErrMsg("Lock your Id")
            }
            // }
        }
   
        else setErrMsg("User Not Found")
    }

    // Lock Id Call Api
    const lock_User_Id = () => {
        const value = {
            FailureLock: 1,
            FailureLockDateTime: getShowingYearMonthDate(new Date),
            UserName: username,
        }
        fetchPostData('Personnel/UpdateFailureLock', value)
            .then(res => {
                if (res) toastifyError('Lock Your Id')
            })
    }

    const [LoginAgencyId, setLoginAgencyId] = useState('')

    const AgencyChanges = (e) => {
        if (e) {
            var Agency_Name = CryptoJS.AES.encrypt(JSON.stringify(e.label), 'ANForAgencyName').toString();
            // sessionStorage.setItem('Agency_Name', Agency_Name)
            setLoginAgencyId(e.value)
        }
    }

    const [agencyErr, setAgencyErr] = useState(false)
    const [unitErr, setUnitErr] = useState(false)

    // Login user 
    const InsertAccessOrRefreshToken = (refresh_token, access_token) => {
        const uniqueID = uuid();
        const small_uniq_ID = uniqueID.slice(0, 8);
        sessionStorage.setItem('UniqueUserID', Encrypted_Id_Name(small_uniq_ID, 'UForUniqueUserID'));
        const param = {
            'refresh_token': refresh_token,
            'access_token': access_token,
        }
        const val = {
            UniqueId: small_uniq_ID,
            Key: JSON.stringify(param)
        }
        AddDeleteUpadate('LocalStorage/ObjectInsert_LocalStorage', val).then((res) => {
            if (res?.success) {
                setTokenArray(param);
              
            }
        })
    }

    const handleLoginSubmit = async e => {
        e.preventDefault()
        if (LoginAgencyId === '') {
            setAgencyErr("Select agency !!")
        } else {
            setAgencyErr(false)
        }
        if (password === '') {
            toastifyError("Please enter password")
        }
        if (unitName === 0) {
            setUnitErr("Select unit !!")
        } else {
            setUnitErr(false)
        }
        if (LoginAgencyId !== '' && password !== '' && unitCheck === false) {
            const { data } = await axios.post('Account/GetToken', { username, password, UnitId: unitName, AgencyId: LoginAgencyId, grant_type });

            console.log(data)
            axios.defaults.headers.common['Authorization'] = `Bearer ${data['access_token']}`;
            if (data.error === '200') {
                
                InsertAccessOrRefreshToken(data['refresh_token'], data['access_token'])
                setErrMsg('')
                setLoginResData(data)
                const otp = get_OTP()
                setOtp(otp)
                setTimerOn(true)
            } else {
                login_Attempt(data.error_description)
            }
        } else if (LoginAgencyId !== '' && password !== '' && unitCheck === true && unitName !== 0) {
            const { data } = await axios.post('Account/GetToken', { username, password, UnitId: unitName, AgencyId: LoginAgencyId, grant_type })
            axios.defaults.headers.common['Authorization'] = `Bearer ${data['access_token']}`;
            if (data.error === '200') {

              

                InsertAccessOrRefreshToken(data['refresh_token'], data['access_token'])
                setErrMsg('')
                setLoginResData(data)
                const otp = get_OTP()
                setOtp(otp)
                setTimerOn(true)
            } else {
                login_Attempt(data.error_description)
            }
        }
    }

    // Verify User
    const verify_User = (e) => {
        e.preventDefault()
        const value = {
            UserName: username
        }
       
        fetchPostData('Personnel/GetData_AgencyLogin', value)
            .then(res => {
                if (res) {
                    // console.log(res)
                    var Agency_Name = CryptoJS.AES.encrypt(JSON.stringify(res[0]?.Agency_Name), 'ANForAgencyName').toString();
                    // sessionStorage.setItem('Agency_Name', Agency_Name)
                    setAgency(res);
                    setLoginAttempt(res[0]?.MaxLoginAttempts);
                    setLoginAgencyId(res[0]?.AgencyID)
                } else { setAgency() }
            })
    }

    const get_unit_list = (id) => {
        const value = {
            AgencyID: id,
            UserName: username,
            Password: password,
        }
        fetchPostData('Personnel/GetData_UnitLogin', value)
            .then(res => {
                if (res) { setUnit(res); setUnitName(res[0]?.UnitId); } else { setUnit() }
            })
    }

    return (
        <>
            {/* Login Page */}
            <div className="login-container" id='login' style={{ display: 'block ' }}>
                <div className="auth mobile-login mx-4">
                    <div className="card py-3 py-3 col-12 col-sm-6 col-md-5 col-lg-3">
                        <div className="card-body">
                            <form onSubmit={handleLoginSubmit} autocomplete="off">
                                <div className="text-center pb-1">
                                    <h5 className="m-0 pb-1"> Login to the GoldLine</h5>
                                    <spna style={{ fontSize: '14px', color: 'red' }}>{errMSg}</spna>
                                    {
                                        logLoader ?
                                            <>
                                                <div className="spinner-border text-success" role="status">
                                                </div> <br />
                                                <span>Please Wait...</span>
                                            </>
                                            : ''
                                    }
                                </div>
                                <div className="form-check text-center">
                                    <input type="checkbox" onChange={handleMDT_Change} className="form-check-input " id="" name="MDT" defaultValue="" />MDT
                                    <label className="form-check-label" htmlFor="radio2" />
                                </div>
                            
                                <div className="form-group">
                                    <label className="form-label form-tab">Username</label>
                                    <input type="text" className="form-control" autocomplete='off' onChange={(e) => setUsername(e.target.value)} id="exampleInputEmail1" value={username} aria-describedby="emailHelp" placeholder="Enter Username" />
                                </div>
                                <div className="form-group" style={{ position: 'relative' }}>
                                    <label className="form-label form-tab">Password</label>
                                    <i className={passwordShown ? "fa fa-eye" : "fa fa-eye-slash"} onClick={togglePassword} style={{ position: 'absolute', top: '60%', right: '3%' }}></i>

                                    <input
                                        type="text"
                                        name="reactPassword"
                                        onChange={(e) => { setPassword(e.target.value) }}
                                        onFocus={verify_User}
                                        style={{ WebkitTextSecurity: passwordShown ? 'none' : 'disc' }}
                                        className="form-control"
                                        placeholder="Password"
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <label htmlFor="" className="m-0 p-0 pb-1" style={{ fontWeight: '600' }}>Agency <span className="text-danger">*</span></label>
                                        <Select name='AgencyID'
                                            options={agency?.map((sponsor, i) =>
                                            (
                                                agencyPlaceholder.push(i === 0 ? sponsor.Agency_Name : ''),
                                                { label: sponsor.Agency_Name, value: sponsor.AgencyID })
                                            )}
                                            placeholder={agencyPlaceholder}
                                            onChange={(e) => AgencyChanges(e)}
                                        />
                                        <span className="text-danger" style={{ fontSize: '13px' }}>{agencyErr}</span>
                                    </div>
                                    <div className="col-12 mt-2">
                                        <input type="checkbox" name="IsSuperadmin"
                                            onChange={() => { setUnitCheck(!unitCheck); get_unit_list(LoginAgencyId) }}
                                            id="IsSuperadmin" />
                                        <label className='ml-2' htmlFor="IsSuperadmin">Unit</label>
                                    </div>
                                    {
                                        unitCheck ?
                                            <div className="col-12 mt-1">
                                                <label htmlFor="" className="m-0 p-0 pb-1" style={{ fontWeight: '600' }}>Unit <span className="text-danger">*</span></label>
                                                <Select name='UnitId'
                                                    options={unit?.map((sponsor) =>
                                                    (
                                                        unitPlaceholder.push(sponsor.UnitName),
                                                        { label: sponsor.UnitName, value: sponsor.UnitId })
                                                    )}
                                                    placeholder={unitPlaceholder}
                                                    onChange={(e) => setUnitName(e.value)}
                                                />
                                                <span className="text-danger" style={{ fontSize: '13px' }}>{unitErr}</span>
                                            </div>
                                            :
                                            <></>
                                    }
                                </div>
                                <Link to="/forgot-Password" className="float-right small my-2" onClick={() => {
                                }}>Forgot Password?</Link>
                                <div>
                                    <button type="submit" className="btn btn-primary btn-block mt-2">Login</button>
                                </div>
                                <div className="text-danger text-right mt-1" style={{ fontSize: '12px' }}>
                                    <label> {loginAttemptStatus ? 'You have ' + loginAttempt + ' attempt left' : ''} </label>
                                </div>
                         
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Otp verfication page */}
            <div id='otp' style={{ display: 'none' }}>
                <Otp {...{ username, loginResData, otp, setOtp, setTimerOn, timerOn, type, login, isMDT }} />
            </div>
        </>
    )
}

export default memo(Login)

