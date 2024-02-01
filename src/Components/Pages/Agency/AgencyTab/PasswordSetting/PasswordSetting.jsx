// Import Component
import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter'
import { AddDeleteUpadate, fetchData, fetchPostData, fieldPermision, ScreenPermision } from '../../../../hooks/Api'
import { Max_Login_Attempts, Max_Password_Age, Min_LowerCase_InPassword, Min_NumericDigits_InPassword, Min_Password_Length, Min_SpecialChars_InPassword, Min_UpperCase_InPassword, Password_Hist_UniquenessDepth, Password_MessageDays, Password_Setting } from '../../AgencyValidation/validators'
import { AgencyContext } from '../../../../../Context/Agency/Index'

const PasswordSetting = ({ aId }) => {

    const { localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);
    // const useQuery = () => new URLSearchParams(useLocation().search);
    // let aId = useQuery().get('id').split(" ", 3)[0].split("/", 1)[0].substring(10,);

    const [passwordSettingList, setPasswordSettingList] = useState([])
    const [status, setStatus] = useState(false)
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [passwordValidationList, setPasswordValidationList] = useState([])
    const [pinId, setPinID] = useState('');

    const [errors, setErrors] = useState({
        'MaxPasswordAge': '',
        'MinPasswordLength': '',
        'MinLowerCaseInPassword': '',
        'MinUpperCaseInPassword': '',
        'MinNumericDigitsInPassword': '',
        'MinSpecialCharsInPassword': '',
        'PasswordHistUniquenessDepth': '',
        'PasswordMessageDays': '',
        'MaxLoginAttempts': '',
    })

    const [value, setValue] = useState({
        'MaxPasswordAge': '',
        'MinPasswordLength': '',
        'MinLowerCaseInPassword': '',
        'MinUpperCaseInPassword': '',
        'MinNumericDigitsInPassword': '',
        'MinSpecialCharsInPassword': '',
        'PasswordHistUniquenessDepth': '',
        'PasswordMessageDays': '',
        'MaxLoginAttempts': '',
        'AgencyID': aId,
        'CreatedByUserFK': pinId,
        'ModifiedByUserFK': '',
        'PasswordSettingID': '',
    })

    const [fieldPermisionAgency, setFieldPermissionAgency] = useState({
        // Password Setting Field
        'MaxPasswordAge': '', 'MinPasswordLength': '', 'MinLowerCaseInPassword': '', 'MinUpperCaseInPassword': '',
        'MinNumericDigitsInPassword': '', 'MinSpecialCharsInPassword': '', 'PasswordHistUniquenessDepth': '', 'PasswordMessageDays': '', 'MaxLoginAttempts': '',
    })

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", LocalAgencyID: "", }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                password_Validation_List();
                setPinID(localStoreArray?.PINID);
                get_PasswordSetting_List(aId);
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    // // Onload Function
    // useEffect(() => {
    //     get_PasswordSetting_List(aId);
    //     getScreenPermision(aId, pinId);
    //     password_Validation_List()
    // }, [aId])

    // Change Status then call 
    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'MaxPasswordAge': passwordSettingList[0]?.MaxPasswordAge,
                'MinPasswordLength': passwordSettingList[0]?.MinPasswordLength,
                'MinLowerCaseInPassword': passwordSettingList[0]?.MinLowerCaseInPassword,
                'MinUpperCaseInPassword': passwordSettingList[0]?.MinUpperCaseInPassword,
                'MinNumericDigitsInPassword': passwordSettingList[0]?.MinNumericDigitsInPassword,
                'MinSpecialCharsInPassword': passwordSettingList[0]?.MinSpecialCharsInPassword,
                'PasswordHistUniquenessDepth': passwordSettingList[0]?.PasswordHistUniquenessDepth,
                'PasswordMessageDays': passwordSettingList[0]?.PasswordMessageDays,
                'MaxLoginAttempts': passwordSettingList[0]?.MaxLoginAttempts,
                'AgencyID': aId,
                'ModifiedByUserFK': pinId,
                'PasswordSettingID': passwordSettingList[0]?.PasswordSettingID,
            })
        } else {
            setValue({
                ...value,
                'MaxPasswordAge': '',
                'MinPasswordLength': '',
                'MinLowerCaseInPassword': '',
                'MinUpperCaseInPassword': '',
                'MinNumericDigitsInPassword': '',
                'MinSpecialCharsInPassword': '',
                'PasswordHistUniquenessDepth': '',
                'PasswordMessageDays': '',
                'MaxLoginAttempts': '',
                'AgencyID': aId,
                'ModifiedByUserFK': '',
                'PasswordSettingID': '',
            })
        }
    }, [status])

    useEffect(() => {
        if (aId) get_Field_Permision_Password(aId)
    }, [aId])

    // Get Effective Field Permission
    const get_Field_Permision_Password = (aId) => {
        fieldPermision(aId, 'A010').then(res => {
            if (res) {
                // Password Setting Field
                if (Agency_Field_Permistion_Filter(res, "Agency-MaxPasswordAge")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['MaxPasswordAge']: Agency_Field_Permistion_Filter(res, "Agency-MaxPasswordAge") } })
                } if (Agency_Field_Permistion_Filter(res, "Agency-MinPasswordLength")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['MinPasswordLength']: Agency_Field_Permistion_Filter(res, "Agency-MinPasswordLength") } })
                } if (Agency_Field_Permistion_Filter(res, "Agency-MinPasswordLowercaseLetters")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['MinLowerCaseInPassword']: Agency_Field_Permistion_Filter(res, "Agency-MinPasswordLowercaseLetters") } })
                } if (Agency_Field_Permistion_Filter(res, "Agency-MinPasswordUppercaseLetters")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['MinUpperCaseInPassword']: Agency_Field_Permistion_Filter(res, "Agency-MinPasswordUppercaseLetters") } })
                } if (Agency_Field_Permistion_Filter(res, "Agency-MinPasswordNumericDigits")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['MinNumericDigitsInPassword']: Agency_Field_Permistion_Filter(res, "Agency-MinPasswordNumericDigits") } })
                } if (Agency_Field_Permistion_Filter(res, "Agency-MinPasswordSpecialCharacters")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['MinSpecialCharsInPassword']: Agency_Field_Permistion_Filter(res, "Agency-MinPasswordSpecialCharacters") } })
                } if (Agency_Field_Permistion_Filter(res, "Agency-HistoryUniquenessDepth")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['PasswordHistUniquenessDepth']: Agency_Field_Permistion_Filter(res, "Agency-HistoryUniquenessDepth") } })
                } if (Agency_Field_Permistion_Filter(res, "Agency-PasswordMessageDays")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['PasswordMessageDays']: Agency_Field_Permistion_Filter(res, "Agency-PasswordMessageDays") } })
                } if (Agency_Field_Permistion_Filter(res, "Agency-MaxLoginAttempts")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['MaxLoginAttempts']: Agency_Field_Permistion_Filter(res, "Agency-MaxLoginAttempts") } })
                }
            }
        });
    }

    // get password Setting list
    const get_PasswordSetting_List = (aId) => {
        const val = {
            AgencyID: aId
        }
        fetchPostData('PasswordSetting/PasswordSetting_getData', val)
            .then((res) => {
                if (res) {
                    localStorage.setItem('data', JSON.stringify(res[0]))
                    setPasswordSettingList(res);
                    setStatus(true)
                }
                else {
                    setStatus(false)
                }
            })
    }

    // Passowrd Validation List 
    const password_Validation_List = () => {
        fetchData('PasswordSetting/GetData_CJISPasswordSetting')
            .then((res) => {
                if (res) {
                    setPasswordValidationList(res);
                }
            })
    }

    // Get Screeen Permission
    const getScreenPermision = (aId, pinId) => {
        ScreenPermision("A010", aId, pinId).then(res => {
            if (res) setEffectiveScreenPermission(res)
            else setEffectiveScreenPermission()
        });
    }

    // onChange Hooks Function
    const handleInput = (e) => {
        const re = /^((?!(0)))[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setValue({
                ...value,
                [e.target.name]: e.target.value,
            });
        }
    }

    // Password Setting Submit
    const password_Setting_Add = async () => {
        AddDeleteUpadate('PasswordSetting/InsertPasswordSetting', value)
            .then((res) => {
                if (res.success === true) {
                    setErrors({ ...errors, ['MaxPasswordAge']: '' })
                    toastifySuccess(res.data)
                }
            })
    }

    // Password Setting update
    const password_Setting_Update = async () => {
        AddDeleteUpadate('PasswordSetting/UpdatePasswordSetting', value)
            .then((res) => {
                if (res.success === true) {
                    setErrors({ ...errors, ['MaxPasswordAge']: '' })
                    toastifySuccess(res.data)
                }
            })
    }

    // Check Validation
    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (Max_Password_Age(value.MaxPasswordAge, passwordValidationList)) {
            setErrors(prevValues => { return { ...prevValues, ['MaxPasswordAge']: Max_Password_Age(value.MaxPasswordAge, passwordValidationList) } })
        }
        if (Min_Password_Length(value.MinPasswordLength, passwordValidationList)) {
            setErrors(prevValues => { return { ...prevValues, ['MinPasswordLength']: Min_Password_Length(value.MinPasswordLength, passwordValidationList) } })
        }
        if (Min_LowerCase_InPassword(value.MinLowerCaseInPassword, passwordValidationList)) {
            setErrors(prevValues => { return { ...prevValues, ['MinLowerCaseInPassword']: Min_LowerCase_InPassword(value.MinLowerCaseInPassword, passwordValidationList) } })
        }
        if (Min_NumericDigits_InPassword(value.MinNumericDigitsInPassword, passwordValidationList)) {
            setErrors(prevValues => { return { ...prevValues, ['MinNumericDigitsInPassword']: Min_NumericDigits_InPassword(value.MinNumericDigitsInPassword, passwordValidationList) } })
        }
        if (Min_SpecialChars_InPassword(value.MinSpecialCharsInPassword, passwordValidationList)) {
            setErrors(prevValues => { return { ...prevValues, ['MinSpecialCharsInPassword']: Min_SpecialChars_InPassword(value.MinSpecialCharsInPassword, passwordValidationList) } })
        }
        if (Password_Hist_UniquenessDepth(value.PasswordHistUniquenessDepth, passwordValidationList)) {
            setErrors(prevValues => { return { ...prevValues, ['PasswordHistUniquenessDepth']: Password_Hist_UniquenessDepth(value.PasswordHistUniquenessDepth, passwordValidationList) } })
        }
        if (Password_MessageDays(value.PasswordMessageDays, passwordValidationList)) {
            setErrors(prevValues => { return { ...prevValues, ['PasswordMessageDays']: Password_MessageDays(value.PasswordMessageDays, passwordValidationList) } })
        }
        if (Max_Login_Attempts(value.MaxLoginAttempts, passwordValidationList)) {
            setErrors(prevValues => { return { ...prevValues, ['MaxLoginAttempts']: Max_Login_Attempts(value.MaxLoginAttempts, passwordValidationList) } })
        } if (Min_UpperCase_InPassword(value.MinUpperCaseInPassword, passwordValidationList)) {
            setErrors(prevValues => { return { ...prevValues, ['MinUpperCaseInPassword']: Min_UpperCase_InPassword(value.MinUpperCaseInPassword, passwordValidationList) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { MinUpperCaseInPassword, MaxLoginAttempts, PasswordMessageDays, PasswordHistUniquenessDepth, MinSpecialCharsInPassword, MinNumericDigitsInPassword, MinLowerCaseInPassword, MinPasswordLength, MaxPasswordAge } = errors

    useEffect(() => {
        if (MinUpperCaseInPassword === 'true' && MaxLoginAttempts === 'true' && PasswordMessageDays === 'true' && PasswordHistUniquenessDepth === 'true' && MinSpecialCharsInPassword === 'true' && MinNumericDigitsInPassword === 'true' && MinLowerCaseInPassword === 'true' && MinPasswordLength === 'true' && MaxPasswordAge === 'true') {
            if (status) password_Setting_Update()
            else password_Setting_Add()
        }
    }, [MinUpperCaseInPassword, MaxLoginAttempts, PasswordMessageDays, PasswordHistUniquenessDepth, MinSpecialCharsInPassword, MinNumericDigitsInPassword, MinLowerCaseInPassword, MinPasswordLength, MaxPasswordAge])

    return (
        <>
            <div id='' className="row px-3">
                {/* <div className="col-12 d-flex py-1 px-2 bg-green text-white">
                    <span>Password Setting</span>
                </div> */}
                <div className="col-12 col-md-12 pt-2 p-0" >
                    <div className="bg-line py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0 d-flex align-items-center">
                            Password Setting
                        </p>
                    </div>
                </div>
            </div>
            {EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ?
                <div className="row mt-2 p-1 px-3">
                    <div className="col-6 col-md-6 col-lg-4 d-flex">
                        {/* <span className='pass-label'>Max Password Age (days)</span> */}
                        <label className='pass-label mt-3 pr-5 mr-1'>Max Password Age (days)
                        </label>
                        <div className="col-4 col-md-4 col-lg-3 pl-1   text-field">
                            <input type="text"
                                maxLength={2}
                                // className='form-control form-control-sm'
                                name='MaxPasswordAge'
                                value={value.MaxPasswordAge}
                                className={`form-control form-control-sm  
                                ${fieldPermisionAgency?.MaxPasswordAge[0] ?
                                        fieldPermisionAgency?.MaxPasswordAge[0]?.Changeok === 0 && fieldPermisionAgency?.MaxPasswordAge[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.MaxPasswordAge[0]?.Changeok === 0 && fieldPermisionAgency?.MaxPasswordAge[0]?.AddOK === 1 && passwordSettingList?.MaxPasswordAge === '' && status ? '' : fieldPermisionAgency?.MaxPasswordAge[0]?.AddOK === 1 && !status ? '' : fieldPermisionAgency?.MaxPasswordAge[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''} `
                                }
                                onChange={fieldPermisionAgency?.MaxPasswordAge[0] ?
                                    fieldPermisionAgency?.MaxPasswordAge[0]?.Changeok === 0 && fieldPermisionAgency?.MaxPasswordAge[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.MaxPasswordAge[0]?.Changeok === 0 && fieldPermisionAgency?.MaxPasswordAge[0]?.AddOK === 1 && passwordSettingList?.MaxPasswordAge === '' && status ? handleInput : fieldPermisionAgency?.MaxPasswordAge[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.MaxPasswordAge[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                            />
                            <p ><span className='hovertext-small' data-hover="Max valid for 90 days" ><i className='fa fa-exclamation-circle'></i></span></p>
                            {errors.MaxPasswordAge !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MaxPasswordAge}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4  d-flex">
                        <label className='pass-label mt-3 pr-5 mr-1'>Min Password Length</label>
                        <div className="col-4 col-md-4 col-lg-3 text-field">

                            <input type="text"
                                maxLength={2}
                                className={`form-control form-control-sm  
                        ${fieldPermisionAgency?.MinPasswordLength[0] ?
                                        fieldPermisionAgency?.MinPasswordLength[0]?.Changeok === 0 && fieldPermisionAgency?.MinPasswordLength[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.MinPasswordLength[0]?.Changeok === 0 && fieldPermisionAgency?.MinPasswordLength[0]?.AddOK === 1 && passwordSettingList?.MinPasswordLength === '' && status ? '' : fieldPermisionAgency?.MinPasswordLength[0]?.AddOK === 1 && !status ? '' : fieldPermisionAgency?.MinPasswordLength[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''} `
                                }
                                onChange={fieldPermisionAgency?.MinPasswordLength[0] ?
                                    fieldPermisionAgency?.MinPasswordLength[0]?.Changeok === 0 && fieldPermisionAgency?.MinPasswordLength[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.MinPasswordLength[0]?.Changeok === 0 && fieldPermisionAgency?.MinPasswordLength[0]?.AddOK === 1 && passwordSettingList?.MinPasswordLength === '' && status ? handleInput : fieldPermisionAgency?.MinPasswordLength[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.MinPasswordLength[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                                name='MinPasswordLength' value={value.MinPasswordLength} />
                            <p ><span className='hovertext-small-1' data-hover="Min length (8)" ><i className='fa fa-exclamation-circle'></i></span></p>
                            {errors.MinPasswordLength !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MinPasswordLength}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 d-flex ">
                        <label className='pass-label  mt-3 pr-4'>Min Password Uppercase Letters</label>
                        <div className="col-4 col-md-4 col-lg-3 text-field ">
                            <input type="text" maxLength={2}
                                className={`form-control form-control-sm  
                         ${fieldPermisionAgency?.MinUpperCaseInPassword[0] ?
                                        fieldPermisionAgency?.MinUpperCaseInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinUpperCaseInPassword[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.MinUpperCaseInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinUpperCaseInPassword[0]?.AddOK === 1 && passwordSettingList?.MinUpperCaseInPassword === '' && status ? '' : fieldPermisionAgency?.MinUpperCaseInPassword[0]?.AddOK === 1 && !status ? '' : fieldPermisionAgency?.MinUpperCaseInPassword[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''} `
                                }
                                onChange={fieldPermisionAgency?.MinUpperCaseInPassword[0] ?
                                    fieldPermisionAgency?.MinUpperCaseInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinUpperCaseInPassword[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.MinUpperCaseInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinUpperCaseInPassword[0]?.AddOK === 1 && passwordSettingList?.MinUpperCaseInPassword === '' && status ? handleInput : fieldPermisionAgency?.MinUpperCaseInPassword[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.MinUpperCaseInPassword[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                                name='MinUpperCaseInPassword' value={value.MinUpperCaseInPassword} />
                            <p ><span className='hovertext-small' data-hover="Min uppercase char (1)" ><i className='fa fa-exclamation-circle'></i></span></p>
                            {errors.MinUpperCaseInPassword !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MinUpperCaseInPassword}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-2 d-flex">
                        <label className='pass-label mt-3 pr-3'>Min Password Lowercase Letters</label>
                        <div className="col-4 col-md-4 col-lg-3 pl-1  text-field">
                            <input type="text" maxLength={2}
                                className={`form-control form-control-sm  
                        ${fieldPermisionAgency?.MinLowerCaseInPassword[0] ?
                                        fieldPermisionAgency?.MinLowerCaseInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinLowerCaseInPassword[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.MinLowerCaseInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinLowerCaseInPassword[0]?.AddOK === 1 && passwordSettingList?.MinLowerCaseInPassword === '' && status ? '' : fieldPermisionAgency?.MinLowerCaseInPassword[0]?.AddOK === 1 && !status ? '' : fieldPermisionAgency?.MinLowerCaseInPassword[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''} `
                                }
                                onChange={fieldPermisionAgency?.MinLowerCaseInPassword[0] ?
                                    fieldPermisionAgency?.MinLowerCaseInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinLowerCaseInPassword[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.MinLowerCaseInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinLowerCaseInPassword[0]?.AddOK === 1 && passwordSettingList?.MinLowerCaseInPassword === '' && status ? handleInput : fieldPermisionAgency?.MinLowerCaseInPassword[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.MinLowerCaseInPassword[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                                name='MinLowerCaseInPassword' value={value.MinLowerCaseInPassword} />
                            <p ><span className='hovertext-small' data-hover="Min Lowercase Char (1)" ><i className='fa fa-exclamation-circle'></i></span></p>

                            {errors.MinLowerCaseInPassword !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MinLowerCaseInPassword}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-2 d-flex">
                        <label className='pass-label mt-3 pr-2'>Min Password Numeric Digits</label>
                        <div className="col-4 col-md-4 col-lg-3  text-field">
                            <input type="text" maxLength={2}
                                className={`form-control form-control-sm  
                        ${fieldPermisionAgency?.MinLowerCaseInPassword[0] ?
                                        fieldPermisionAgency?.MinNumericDigitsInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinNumericDigitsInPassword[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.MinNumericDigitsInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinNumericDigitsInPassword[0]?.AddOK === 1 && passwordSettingList?.MinNumericDigitsInPassword === '' && status ? '' : fieldPermisionAgency?.MinNumericDigitsInPassword[0]?.AddOK === 1 && !status ? '' : fieldPermisionAgency?.MinNumericDigitsInPassword[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''} `
                                }
                                onChange={fieldPermisionAgency?.MinLowerCaseInPassword[0] ?
                                    fieldPermisionAgency?.MinNumericDigitsInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinNumericDigitsInPassword[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.MinNumericDigitsInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinNumericDigitsInPassword[0]?.AddOK === 1 && passwordSettingList?.MinNumericDigitsInPassword === '' && status ? handleInput : fieldPermisionAgency?.MinNumericDigitsInPassword[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.MinNumericDigitsInPassword[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                                name='MinNumericDigitsInPassword' value={value.MinNumericDigitsInPassword} />
                            <p ><span className='hovertext-small' data-hover="Min Numeric Digit (1)" ><i className='fa fa-exclamation-circle'></i></span></p>
                            {errors.MinNumericDigitsInPassword !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MinNumericDigitsInPassword}</span>
                            ) : null}
                        </div>
                    </div>
                    {/* <div className="col-6 col-md-6 col-lg-4 mt-1 d-flex">
                        <label className='pass-label mt-3 pr-4'>Min Password Special Characters</label>
                        <div className="col-4 col-md-4 col-lg-3 pl-1 text-field mt-3">
                            <input type="text" maxLength={2}
                                className={`form-control form-control-sm  
                        ${fieldPermisionAgency?.MinSpecialCharsInPassword[0] ?
                                        fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 1 && passwordSettingList?.MinSpecialCharsInPassword === '' && status ? '' : fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 1 && !status ? '' : fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''} `
                                }
                                onChange={fieldPermisionAgency?.MinSpecialCharsInPassword[0] ?
                                    fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 1 && passwordSettingList?.MinSpecialCharsInPassword === '' && status ? handleInput : fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 1 && status ? handleInput : '' : ''
                                }
                                name='MinSpecialCharsInPassword' value={value.MinSpecialCharsInPassword} />
                            <p ><span className='hovertext-small' data-hover="Min Special char (1)" ><i className='fa fa-exclamation-circle'></i></span></p>
                            {errors.MinSpecialCharsInPassword !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MinSpecialCharsInPassword}</span>
                            ) : null}
                        </div>
                    </div> */}
                    <div className="col-6 col-md-6 col-lg-4 mt-1 d-flex">
                        <label className='pass-label mt-3 pr-4'>Min Password Special Characters</label>
                        <div className="col-4 col-md-4 col-lg-3 pl-1 text-field mt-3">
                            <input type="text" maxLength={2}
                                className={`form-control form-control-sm 
                        ${fieldPermisionAgency?.MinSpecialCharsInPassword[0] ?
                                        fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 1 && passwordSettingList?.MinSpecialCharsInPassword === '' && status ? '' : fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 1 && !status ? '' : fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''} `
                                }
                                onChange={fieldPermisionAgency?.MinSpecialCharsInPassword[0] ?
                                    fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 0 && fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 1 && passwordSettingList?.MinSpecialCharsInPassword === '' && status ? handleInput : fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                                name='MinSpecialCharsInPassword' value={value.MinSpecialCharsInPassword} />
                            <p ><span className='hovertext-small' data-hover="Min Numeric Digit (1)" ><i className='fa fa-exclamation-circle'></i></span></p>
                            {errors.MinSpecialCharsInPassword !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MinSpecialCharsInPassword}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-2 d-flex">
                        <label className='pass-label mt-3 pr-5'>History Uniqueness Depth</label>
                        <div className="col-4 col-md-4 col-lg-3 text-field ">
                            <input type="text"
                                maxLength={2}
                                className={`form-control form-control-sm  
                        ${fieldPermisionAgency?.PasswordHistUniquenessDepth[0] ?
                                        fieldPermisionAgency?.PasswordHistUniquenessDepth[0]?.Changeok === 0 && fieldPermisionAgency?.PasswordHistUniquenessDepth[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.PasswordHistUniquenessDepth[0]?.Changeok === 0 && fieldPermisionAgency?.PasswordHistUniquenessDepth[0]?.AddOK === 1 && passwordSettingList?.PasswordHistUniquenessDepth === '' && status ? '' : fieldPermisionAgency?.PasswordHistUniquenessDepth[0]?.AddOK === 1 && !status ? '' : fieldPermisionAgency?.PasswordHistUniquenessDepth[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''} `
                                }
                                onChange={fieldPermisionAgency?.PasswordHistUniquenessDepth[0] ?
                                    fieldPermisionAgency?.PasswordHistUniquenessDepth[0]?.Changeok === 0 && fieldPermisionAgency?.PasswordHistUniquenessDepth[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.PasswordHistUniquenessDepth[0]?.Changeok === 0 && fieldPermisionAgency?.PasswordHistUniquenessDepth[0]?.AddOK === 1 && passwordSettingList?.PasswordHistUniquenessDepth === '' && status ? handleInput : fieldPermisionAgency?.PasswordHistUniquenessDepth[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.PasswordHistUniquenessDepth[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                                name='PasswordHistUniquenessDepth' value={value.PasswordHistUniquenessDepth} />
                            <p ><span className='hovertext-small' data-hover="Max Uniqueness Depth (10)" ><i className='fa fa-exclamation-circle'></i></span></p>
                            {errors.PasswordHistUniquenessDepth !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PasswordHistUniquenessDepth}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4  mt-2 d-flex">
                        <label className='pass-label mt-3 pr-4 mr-3'>Password Message Days</label>
                        <div className="col-4 col-md-4 col-lg-3  text-field ">
                            <input type="text"
                                maxLength={2}
                                className={`form-control form-control-sm  
                        ${fieldPermisionAgency?.PasswordMessageDays[0] ?
                                        fieldPermisionAgency?.PasswordMessageDays[0]?.Changeok === 0 && fieldPermisionAgency?.PasswordMessageDays[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.PasswordMessageDays[0]?.Changeok === 0 && fieldPermisionAgency?.PasswordMessageDays[0]?.AddOK === 1 && passwordSettingList?.PasswordMessageDays === '' && status ? '' : fieldPermisionAgency?.PasswordMessageDays[0]?.AddOK === 1 && !status ? '' : fieldPermisionAgency?.PasswordMessageDays[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''} `
                                }
                                onChange={fieldPermisionAgency?.PasswordMessageDays[0] ?
                                    fieldPermisionAgency?.PasswordMessageDays[0]?.Changeok === 0 && fieldPermisionAgency?.PasswordMessageDays[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.PasswordMessageDays[0]?.Changeok === 0 && fieldPermisionAgency?.PasswordMessageDays[0]?.AddOK === 1 && passwordSettingList?.PasswordMessageDays === '' && status ? handleInput : fieldPermisionAgency?.PasswordMessageDays[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.PasswordMessageDays[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                                name='PasswordMessageDays' value={value.PasswordMessageDays} />
                            <p ><span className='hovertext-small' data-hover="Max Message Days (30)" ><i className='fa fa-exclamation-circle'></i></span></p>
                            {errors.PasswordMessageDays !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PasswordMessageDays}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-2 d-flex">
                        <label className='pass-label mt-3  '>Max Login Attempts</label>
                        <div className="col-4 col-md-4 col-lg-3   text-field" style={{ marginLeft: '28%' }}>
                            <input type="text"
                                maxLength={1}
                                className={`form-control form-control-sm  
                        ${fieldPermisionAgency?.MaxLoginAttempts[0] ?
                                        fieldPermisionAgency?.MaxLoginAttempts[0]?.Changeok === 0 && fieldPermisionAgency?.MaxLoginAttempts[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.MaxLoginAttempts[0]?.Changeok === 0 && fieldPermisionAgency?.MaxLoginAttempts[0]?.AddOK === 1 && passwordSettingList?.MaxLoginAttempts === '' && status ? '' : fieldPermisionAgency?.MaxLoginAttempts[0]?.AddOK === 1 && !status ? '' : fieldPermisionAgency?.MaxLoginAttempts[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''} `
                                }
                                onChange={fieldPermisionAgency?.MaxLoginAttempts[0] ?
                                    fieldPermisionAgency?.MaxLoginAttempts[0]?.Changeok === 0 && fieldPermisionAgency?.MaxLoginAttempts[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.MaxLoginAttempts[0]?.Changeok === 0 && fieldPermisionAgency?.MaxLoginAttempts[0]?.AddOK === 1 && passwordSettingList?.MaxLoginAttempts === '' && status ? handleInput : fieldPermisionAgency?.MaxLoginAttempts[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.MaxLoginAttempts[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                                name='MaxLoginAttempts' value={value.MaxLoginAttempts} />
                            <p ><span className='hovertext-small' data-hover="Max Login Attempts (5)" ><i className='fa fa-exclamation-circle'></i></span></p>
                            {errors.MaxLoginAttempts !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MaxLoginAttempts}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-12 mt-2 text-right pr-5 ">
                        {/* <button className='btn btn-success mr-1' type='button'>Cancel</button> */}
                        {
                            status ?
                                EffectiveScreenPermission ?
                                    EffectiveScreenPermission[0]?.Changeok ?
                                        <button className='btn btn-success ' type='button' onClick={check_Validation_Error}>Update</button>
                                        :
                                        <></>
                                    :
                                    <button className='btn btn-success ' type='button' onClick={check_Validation_Error}>Update</button>
                                :
                                EffectiveScreenPermission ?
                                    EffectiveScreenPermission[0]?.AddOK ?
                                        <button className='btn btn-success' type='button' onClick={check_Validation_Error}>Save</button>
                                        : <></>
                                    : <button className='btn btn-success' type='button' onClick={check_Validation_Error}>Save</button>
                        }
                    </div>
                </div>
                : <p className='text-center mt-2'>You don’t have permission to view data</p> : ''}
        </>
    )
}

export default PasswordSetting