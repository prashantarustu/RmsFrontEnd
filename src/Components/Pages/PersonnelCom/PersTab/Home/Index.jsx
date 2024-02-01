import React, { useState, useEffect } from 'react'
import { useContext } from 'react';
import moment from 'moment';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { DecryptedList, Decrypt_Id_Name, EncryptedList, getShowingWithOutTime, getShowingYearMonthDate } from '../../../../Common/Utility';
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter';
import { AddDeleteUpadate, AddDeleteUpadate_FormData, fetchData, fetchPostData, fieldPermision } from '../../../../hooks/Api';
import { Email_Field, PasswordField, PinValidator, ReEnterPasswordVal, RequiredField } from '../../Validation/PersonnelValidation';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import defualtImage from '../../../../../img/uploadImage.png'
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { useNavigate } from 'react-router-dom';
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';
import ChangesModal from '../../../../Common/ChangesModal';

const Home = (props) => {

    const { editValueList, pId, aId, pinId, setDobHireDate } = props

    // Hooks Initialization
    const navigate = useNavigate()
    const { personnelStatus, setPersonnelStatus, get_CountList, get_Personnel_Lists, personnelList, PersonnelEffectiveScreenPermission, inActiveStatus, setInActiveStatus, getInActive_Personnel, changesStatus, setChangesStatus, } = useContext(AgencyContext);

    const [rankList, setRankList] = useState([]);
    const [associatedShift, setAssociatedShift] = useState([]);
    const [photoType, setPhotoType] = useState([]);
    const [division, setDivision] = useState([]);
    const [pasStatus, setPasStatus] = useState(false);
    const [rePasStatus, setRePasStatus] = useState(false);
    const [personnelEditList, setPersonnelList] = useState([]);
    const [passwordSettingVal, setPasswordSettingList] = useState([]);
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [sexList, setSexList] = useState([]);
    const [employeeTypeList, setEmployeeTypeList] = useState([]);
    const [personnelImage, setPersonnelImage] = useState([]);
    const [imageId, setImageId] = useState('');
    const [isMultiPin, setIsMultiPin] = useState();
    const [validDobDate, setValidDobDate] = useState(null);

    // Fitler 
    const [value, setValue] = useState({
        'PIN': '', 'AgencyID': aId, 'AllowMultipleLogins': true, 'FirstName': '', 'MiddleName': '', 'LastName': '', 'UserName': '', 'Password': '', 'DivisionId': '', 'RankID': '', 'EmployeeTypeID': '', 'Email': '', 'ShiftID': '', 'ReEnterPassword': '', 'ModifiedByUserFK': '', 'PINID': '', 'IsSuperadmin': '', 'IsAllowLogin': '', 'ShiftName': '', "RankName": '', 'DivisionName': '', 'DateOfBirth': '', 'NCICLoginId': '', 'NCICORI': '', 'ScheduleId': '', 'MaxLockLevel': '', 'MaxRestrictLevel': '', 'IsJuvenileCleared': '', 'IsActive': true, 'SexID': '', 'IsSupervisor': '', 'photoId': '', 'GenderName': '', 'EmployeeName': '',
        'CreatedByUserFK': pinId,
    })

    const [fieldPermisionAgency, setFieldPermissionAgency] = useState({
        // Persionnel Fields
        'PIN': '', 'FirstName': '', 'MiddleName': '', 'LastName': '', 'UserName': '', 'Password': '', 'DivisionId': '', 'RankID': '', 'Email': '', 'ShiftID': '', 'ReEnterPassword': '', 'IsSuperadmin': '', 'IsAllowLogin': ''
    })

    // Onload Function
    useEffect(() => {
        get_Rank(pinId); get_AssociatedShift(aId); get_Division(aId);
        get_Password_Setting(aId);
        getSexList(aId);
        get_Photo_Type();
        get_EmployeeType();
        dateChange();
    }, [aId])

    useEffect(() => {
        if (pId != '0000') {
            // console.log(personnelStatus)
            setPersonnelStatus(true);
            if (personnelStatus) {
                get_Single_PersonnelList(pId); get_Personnel_MultiImage(pId)
                setValue({ ...value, ['RankName']: '', ['DivisionName']: '', ['ShiftName']: '', ['EmployeeName']: '', ['GenderName']: '' }); setErrors({
                    ...errors,
                    'PINError': '', 'FirstNameError': '', 'LastNameError': '', 'PasswordError': '', 'UserNameError': '', 'ReEnterPasswordError': ''
                })
            }
        } else {
            // make condition <--Dkashyap--<
            if (!personnelStatus) rest_Value()
        }
    }, [pId, personnelStatus])

    useEffect(() => {
        if (aId && pinId) { get_Field_Permision_Division(aId, pinId) }
    }, [aId, pinId])

    // Get Single Persoonel Data
    const get_Single_PersonnelList = (pId) => {
        const val = {
            PINID: pId
        }
        fetchPostData('Personnel/GetData_UpdatePersonnel', val)
            .then((res) => {
                if (res) { setPersonnelList(res); }
                else { setPersonnelList(); }
            })
    }

    useEffect(() => {
        if (inActiveStatus) {
            rest_Value();
        } else if (!inActiveStatus) {
            // setPersonnelStatus(false);
            rest_Value();
        }
        // else if(status) get_Edit_Agency_Data(aId)
    }, [inActiveStatus])

    useEffect(() => {
        if (personnelEditList[0]?.PINID) {
            setDateOfBirth(''); setIsMultiPin(false)
            setValue({
                ...value,
                'PIN': personnelEditList[0]?.PIN,
                'FirstName': personnelEditList[0]?.FirstName,
                'MiddleName': personnelEditList[0]?.MiddleName === null ? "" : personnelEditList[0]?.MiddleName,
                'LastName': personnelEditList[0]?.LastName,
                'UserName': personnelEditList[0]?.UserName,
                'Password': DecryptedList(personnelEditList[0]?.Password),
                'DivisionId': personnelEditList[0]?.DivisionId,
                'RankID': personnelEditList[0]?.RankID,
                'EmployeeTypeID': personnelEditList[0]?.EmployeeTypeID,
                'Email': personnelEditList[0]?.Email,
                'ShiftID': personnelEditList[0]?.ShiftID,
                'ReEnterPassword': DecryptedList(personnelEditList[0]?.Password),
                'PINID': personnelEditList[0]?.PINID,
                'IsSuperadmin': personnelEditList[0]?.IsSuperadmin, 'IsActive': personnelEditList[0]?.IsActive, 'IsSupervisor': personnelEditList[0]?.IsSupervisor,
                'IsAllowLogin': personnelEditList[0]?.IsAllowLogin, 'DateOfBirth': getShowingWithOutTime(personnelEditList[0]?.DateOfBirth) === 'Invalid date' ? '' : getShowingWithOutTime(personnelEditList[0]?.DateOfBirth), 'NCICLoginId': personnelEditList[0]?.NCICLoginId, 'NCICORI': personnelEditList[0]?.NCICORI, 'IsJuvenileCleared': personnelEditList[0]?.IsJuvenileCleared,
                'DivisionName': changeArrayFormat_WithFilter(personnelEditList, 'division'), 'ShiftName': changeArrayFormat_WithFilter(personnelEditList, 'shift'), 'RankName': changeArrayFormat_WithFilter(personnelEditList, 'rank'), 'EmployeeName': changeArrayFormat_WithFilter(personnelEditList, 'EmployeeName'), 'GenderName': changeArrayFormat_WithFilter(personnelEditList, 'gender'), 'MaxLockLevel': personnelEditList[0]?.MaxLockLevel, 'MaxRestrictLevel': personnelEditList[0]?.MaxRestrictLevel, 'SexID': personnelEditList[0]?.SexID,
                'ModifiedByUserFK': pinId,
                // 'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
            });
            setDateOfBirth(personnelEditList[0]?.DateOfBirth ? new Date(personnelEditList[0]?.DateOfBirth) : null);
            // setDobHireDate(personnelEditList[0]?.DateOfBirth ? new Date(personnelEditList[0]?.DateOfBirth) : null);
            setPersonnelStatus(true)
            setPasStatus(true)
            setRePasStatus(true)
        } else rest_Value()
    }, [personnelEditList])

    // Get Multiple Image Personnel
    const get_Personnel_MultiImage = (pId) => {
        const val = {
            PINID: pId
        }
        fetchPostData('Personnel/GetData_Image', val)
            .then((res) => {
                if (res) { setPersonnelImage(res); }
                else { setPersonnelImage(); }
            })
    }

    // Get Effective Field Permission
    const get_Field_Permision_Division = (aId, pinId) => {
        fieldPermision(aId, 'P018', pinId).then(res => {
            if (res) {
                if (Agency_Field_Permistion_Filter(res, "Personnel-Pin")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['PIN']: Agency_Field_Permistion_Filter(res, "Personnel-Pin") } })
                }
                if (Agency_Field_Permistion_Filter(res, "Personnel-LastName")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['LastName']: Agency_Field_Permistion_Filter(res, "Personnel-LastName") } })
                }
                if (Agency_Field_Permistion_Filter(res, "Personnel-FirstName")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['FirstName']: Agency_Field_Permistion_Filter(res, "Personnel-FirstName") } })
                }
                if (Agency_Field_Permistion_Filter(res, "Personnel-MiddleName")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['MiddleName']: Agency_Field_Permistion_Filter(res, "Personnel-MiddleName") } })
                } if (Agency_Field_Permistion_Filter(res, "Personnel-Division")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['DivisionId']: Agency_Field_Permistion_Filter(res, "Personnel-Division") } })
                } if (Agency_Field_Permistion_Filter(res, "Personnel-Rank")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['RankID']: Agency_Field_Permistion_Filter(res, "Personnel-Rank") } })
                } if (Agency_Field_Permistion_Filter(res, "Personnel-Shift")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['ShiftID']: Agency_Field_Permistion_Filter(res, "Personnel-Shift") } })
                } if (Agency_Field_Permistion_Filter(res, "Personnel-Email_Id")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['Email']: Agency_Field_Permistion_Filter(res, "Personnel-Email_Id") } })
                } if (Agency_Field_Permistion_Filter(res, "Personnel-LoginUserId")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['UserName']: Agency_Field_Permistion_Filter(res, "Personnel-LoginUserId") } })
                } if (Agency_Field_Permistion_Filter(res, "Personnel-Password")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['Password']: Agency_Field_Permistion_Filter(res, "Personnel-Password") } })
                } if (Agency_Field_Permistion_Filter(res, "Personnel-ReEnterPassword")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['ReEnterPassword']: Agency_Field_Permistion_Filter(res, "Personnel-ReEnterPassword") } })
                } if (Agency_Field_Permistion_Filter(res, "Personnel-SuperAdmin")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['IsSuperadmin']: Agency_Field_Permistion_Filter(res, "Personnel-SuperAdmin") } })
                } if (Agency_Field_Permistion_Filter(res, "Personnel-AllowLogin")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['IsAllowLogin']: Agency_Field_Permistion_Filter(res, "Personnel-AllowLogin") } })
                }
            }

        });
    }

    // Get Password setting 
    const get_Password_Setting = (aId) => {
        const value = {
            AgencyID: aId
        }
        fetchPostData('PasswordSetting/PasswordSetting_getData', value)
            .then(res => {
                if (res) {
                    // console.log(res[0]);
                    setPasswordSettingList(res[0])
                    // localStorage.setItem('data', JSON.stringify(res[0]))
                }
            })
    }

    // Rank, AssociatedShift and Division list 
    const get_Rank = (aId) => {
        const value = { AgencyId: aId }
        fetchPostData('MasterPersonnel/GetData_Rank', value)
            .then(res => {
                if (res) setRankList(changeArrayFormat(res, 'rank'))
                else setRankList()
            })
    }

    const getSexList = async (aId) => {
        const val = { AgencyId: aId }
        fetchPostData("DropDown/GetData_SexType", val)
            .then(response => {
                if (response) setSexList(changeArrayFormat(response, 'genderId'))
                else setSexList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const get_AssociatedShift = (aId) => {
        const value = { AgencyId: aId }
        fetchPostData('MasterPersonnel/GetData_Shift', value)
            .then(res => {
                if (res) setAssociatedShift(changeArrayFormat(res, 'shift'))
                else setAssociatedShift()
            })
    }

    const get_EmployeeType = (aId) => {
        const value = { AgencyId: aId }
        fetchPostData('DropDown/GetDataDropDown_EmployeeType', value)
            .then(res => {
                if (res) setEmployeeTypeList(changeArrayFormat(res, 'EmployeeType'))
                else setEmployeeTypeList()
            })
    }

    const get_Photo_Type = () => {
        fetchData('DropDown/GetData_PhotoType')
            .then(res => {
                if (res) setPhotoType(changeArrayFormat(res, 'photoType'))
                else setPhotoType()
            })
    }

    const get_Division = (aId) => {
        const val = { AgencyId: aId }
        fetchPostData('DropDown/GetData_Division', val)
            .then(res => {
                if (res) setDivision(changeArrayFormat(res, 'division'))
                else setDivision()
            })
    }

    // onChange Hooks Function
    const rankChange = (e) => {
        if (e) {
            setValue({ ...value, ['RankID']: e.value });
            setChangesStatus(true)
        } else {
            setValue({ ...value, ['RankID']: null });
            setChangesStatus(true)
        }
    }

    const photoTypeChange = (e) => {
        if (e) {
            setValue({ ...value, ['photoId']: e.value });
            setChangesStatus(true)
        } else {
            setValue({ ...value, ['photoId']: null });
            setChangesStatus(true)
        }
    }

    const EmployeeTypeChange = (e) => {
        if (e) {
            setValue({ ...value, ['EmployeeTypeID']: e.value })
            setChangesStatus(true)
        } else {
            setValue({ ...value, ['EmployeeTypeID']: null });
            setChangesStatus(true)
        }
    }

    const divisionChange = (e) => {
        if (e) {
            setValue({ ...value, ['DivisionId']: e.value });
            setChangesStatus(true)
        } else {
            setValue({ ...value, ['DivisionId']: null });
            setChangesStatus(true)
        }
    }

    const shiftChange = (e) => {
        if (e) {
            setValue({ ...value, ['ShiftID']: e.value });
            setChangesStatus(true)
        } else {
            setValue({ ...value, ['ShiftID']: null });
            setChangesStatus(true)
        }
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({
                ...value,
                [name]: e.value
            })
        } else setValue({
            ...value,
            [name]: null
        })
    }

    const handleChange = (e) => {
        if (e.target.name === 'Password') {
            setPasStatus(false); setValue(pre => { return { ...pre, [e.target.name]: e.target.value } }); setChangesStatus(true)
        }
        else if (e.target.name === 'ReEnterPassword') {
            setRePasStatus(false); setValue(pre => { return { ...pre, [e.target.name]: e.target.value } }); setChangesStatus(true)
        }
        else if (e.target.name === 'MaxLockLevel' || e.target.name === 'MaxRestrictLevel') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            // /[^a-zA-Z\s]/g
            if (checkNumber < 11) {
                setValue({
                    ...value,
                    [e.target.name]: checkNumber
                });
                setChangesStatus(true)
            }
        }
        else if (e.target.name === 'PIN') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            if (checkNumber?.length === 6) {
                checkPinExist(checkNumber, aId, pId);
                setChangesStatus(true)
            }
            setValue({
                ...value,
                [e.target.name]: checkNumber
            });
            setChangesStatus(true)
        }
        else if (e.target.name === 'AllowMultipleLogins') {
        } else {
            setValue(pre => { return { ...pre, [e.target.name]: e.target.value } });
            setChangesStatus(true)
        }
    }

    // http://localhost:26055/api/Personnel/GetData_CheckPIN
    //Data:
    // PINID:
    // PIN:
    // AgencyID:

    // onChange Hooks Function
    const dateChange = (date, type) => {
        //----------old code by praveen sir--------------> don't remove 
        // if (type === 'DateOfBirth') {
        //     if (date != null) {
        //         if (date <= moment(new Date()).subtract(18, 'years')._d) {
        //             setDateOfBirth(date); setValue({ ...value, ['DateOfBirth']: getShowingYearMonthDate(date) });
        //         }
        //     } else {
        //         setDateOfBirth(''); setValue({ ...value, ['DateOfBirth']: '' }); setDobHireDate(null);
        //     }
        // }
        const newDate = new Date()
        const year = new Date().getFullYear();
        setValidDobDate(new Date(newDate.setFullYear(year - 18)));
    }

    const rest_Value = () => {
        setValue({
            ...value,
            'PIN': '', 'AgencyID': aId, 'FirstName': '', 'MiddleName': '', 'LastName': '', 'UserName': '', 'Password': '', 'DivisionId': '', 'RankID': '', 'EmployeeTypeID': '', 'Email': '', 'ShiftID': '', 'ReEnterPassword': '', 'ModifiedByUserFK': '', 'PINID': '', 'IsSuperadmin': '', 'IsAllowLogin': '', 'ShiftName': '', "RankName": '', 'DivisionName': '', 'DateOfBirth': '', 'NCICLoginId': '', 'NCICORI': '', 'ScheduleId': '', 'MaxLockLevel': '', 'MaxRestrictLevel': '', 'IsJuvenileCleared': '', 'IsActive': true, 'SexID': '', 'IsSupervisor': '', 'photoId': '', 'GenderName': '', 'EmployeeName': '',
        }); setPersonnelImage([]); setRePasStatus(false); setPasStatus(false); setDateOfBirth(null); setIsMultiPin(false)
    }

    // Update Personnel List
    const update_Personnel = () => {
        // console.log(isMultiPin)
        if (isMultiPin) {
            toastifyError('PIN Already Exists');
            setErrors({ ...errors, ['PINError']: '' });
        } else {
            AddDeleteUpadate('Personnel/UpdatePersonnel', value)
                .then((res) => {
                    if (res.success === true) {
                        toastifySuccess(res.Message)
                        setErrors({ ...errors, ['PINError']: '' })

                        if (!inActiveStatus && !value.IsActive) {
                            // console.log("Calll  !inActiveStatus && !value.IsActive")
                            getInActive_Personnel(aId); setPersonnelStatus(false); setInActiveStatus(true);
                        } else if (!inActiveStatus && value.IsActive) {
                            // console.log("Calll  !inActiveStatus && value.IsActive")
                            get_Personnel_Lists(aId); setPersonnelStatus(true)
                        } else if (inActiveStatus && value.IsActive) {
                            // console.log("Calll  inActiveStatus && value.IsActive")
                            getInActive_Personnel(aId); get_Personnel_Lists(aId); setInActiveStatus(false); setPersonnelStatus(true)
                        } else {
                            console.log("CALL")
                        }
                        setChangesStatus(false)
                        // if (!inActiveStatus) {
                        //     get_Personnel_Lists(aId); setPersonnelStatus(false)
                        // } else {
                        //     getInActive_Personnel(aId); setPersonnelStatus(false)
                        // }
                    } else {
                        setErrors({ ...errors, ['PINError']: '' })
                        toastifyError(JSON.parse(res.request.response).Message)
                    }
                })
        }

        // <-------------old By praveen sir------------------->
        // var result = personnelList?.find(item => {
        //     if (item?.PINID != pId) {
        //         if (item.PIN === value.PIN) {
        //             return true
        //         } else return false
        //     }
        // });
        // if (result) {
        //     toastifyError('Pin Already Exists')
        //     setErrors({ ...errors, ['PINError']: '' })
        // } else {
        //     AddDeleteUpadate('Personnel/UpdatePersonnel', value)
        //         .then((res) => {
        //             if (res.success === true) {
        //                 toastifySuccess(res.Message)
        //                 setErrors({ ...errors, ['PINError']: '' })

        //                 if (!inActiveStatus && !value.IsActive) {
        //                     // console.log("Calll  !inActiveStatus && !value.IsActive")
        //                     getInActive_Personnel(aId); setPersonnelStatus(false); setInActiveStatus(true);
        //                 } else if (!inActiveStatus && value.IsActive) {
        //                     // console.log("Calll  !inActiveStatus && value.IsActive")
        //                     get_Personnel_Lists(aId); setPersonnelStatus(true)
        //                 } else if (inActiveStatus && value.IsActive) {
        //                     // console.log("Calll  inActiveStatus && value.IsActive")
        //                     getInActive_Personnel(aId); get_Personnel_Lists(aId); setInActiveStatus(false); setPersonnelStatus(true)
        //                 } else {
        //                     console.log("CALL")
        //                 }

        //                 // if (!inActiveStatus) {
        //                 //     get_Personnel_Lists(aId); setPersonnelStatus(false)
        //                 // } else {
        //                 //     getInActive_Personnel(aId); setPersonnelStatus(false)
        //                 // }

        //             } else {
        //                 setErrors({ ...errors, ['PINError']: '' })
        //                 toastifyError(JSON.parse(res.request.response).Message)
        //             }
        //         })
        // }
    }

    const [errors, setErrors] = useState({
        'PINError': '',
        'FirstNameError': '',
        'LastNameError': '',
        'PasswordError': '',
        'UserNameError': '',
        'ReEnterPasswordError': '',
        'emailError': ''
    })

    const { PINError, FirstNameError, LastNameError, PasswordError, UserNameError, ReEnterPasswordError, emailError } = errors

    useEffect(() => {
        if (PINError === 'true' && FirstNameError === 'true' && LastNameError === 'true' && PasswordError === 'true' && UserNameError === 'true' && ReEnterPasswordError === 'true' && emailError === 'true') {
            if (personnelStatus) update_Personnel()
            else save_Personnel()
        }
    }, [PINError, FirstNameError, LastNameError, PasswordError, UserNameError, ReEnterPasswordError, emailError])

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (PinValidator(value.PIN)) {
            setErrors(prevValues => { return { ...prevValues, ['PINError']: PinValidator(value.PIN) } })
        }
        if (RequiredField(value.FirstName)) {
            setErrors(prevValues => { return { ...prevValues, ['FirstNameError']: RequiredField(value.FirstName) } })
        }
        if (RequiredField(value.LastName)) {
            setErrors(prevValues => { return { ...prevValues, ['LastNameError']: RequiredField(value.LastName) } })
        }
        if (PasswordField(passwordSettingVal, value.Password, value.UserName)) {
            setErrors(prevValues => { return { ...prevValues, ['PasswordError']: PasswordField(passwordSettingVal, value.Password, value.UserName) } })
        }
        if (RequiredField(value.UserName)) {
            setErrors(prevValues => { return { ...prevValues, ['UserNameError']: RequiredField(value.UserName) } })
        }
        if (ReEnterPasswordVal(value.Password, value.ReEnterPassword)) {
            setErrors(prevValues => { return { ...prevValues, ['ReEnterPasswordError']: ReEnterPasswordVal(value.Password, value.ReEnterPassword) } })
        } if (Email_Field(value.Email)) {
            setErrors(prevValues => { return { ...prevValues, ['emailError']: Email_Field(value.Email) } })
        }
    }

    const save_Personnel = () => {
        // console.log(isMultiPin)
        if (isMultiPin) {
            toastifyError('PIN Already Exists')
            setErrors({ ...errors, ['PINError']: '' })
        } else {
            AddDeleteUpadate('Personnel/InsertPersonnel', value)
                .then((res) => {
                    console.log(res);
                    if (res?.success === true) {
                        setChangesStatus(false)
                        // setPINID(res?.Id);
                        toastifySuccess(res?.Message); setPersonnelStatus(true)
                        navigate(`/personnelTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=&pd=89zw03LXTG${res?.Id.trim()}/2Wga0gJLXEgctxh79FeM/G`);
                        get_Personnel_Lists(aId)
                        setErrors({ ...errors, ['PINError']: '' })
                        get_CountList(aId);
                    }
                })
        }
        // <-------------old By praveen sir------------------->
        // var result = personnelList?.find(item => {
        //     if (item.PIN === value.PIN) {
        //         return true
        //     } else return false
        // }
        // );
        // if (result) {
        //     toastifyError('PIN Already Exists')
        //     setErrors({ ...errors, ['PINError']: '' })
        // } else {
        //     AddDeleteUpadate('Personnel/InsertPersonnel', value)
        //         .then((res) => {
        //             console.log(res);
        //             if (res?.success === true) {
        //                 // setPINID(res?.Id);
        //                 toastifySuccess(res?.Message); setPersonnelStatus(true)
        //                 navigate(`/personnelTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=&pd=89zw03LXTG${res?.Id.trim()}/2Wga0gJLXEgctxh79FeM/G`);
        //                 get_Personnel_Lists(aId)
        //                 setErrors({ ...errors, ['PINError']: '' })
        //                 get_CountList(aId);
        //             }
        //         })
        // }
    }

    // get Personnel Image
    const get_Image_File = (e) => {
        try {
            let currentFileType = e.target.files[0].type;
            let checkPng = currentFileType.indexOf("png");
            let checkJpeg = currentFileType.indexOf("jpeg");
            let checkJpg = currentFileType.indexOf("jpg");
            if (checkPng !== -1 || checkJpeg !== -1 || checkJpg !== -1) {
                // console.log(e.target.files[0]);
                upload_Image_File(e.target.files[0]);
                setChangesStatus(true)
                // setImage(e.target.files[0]);
            } else {
                toastifyError("Error: Invalid image file!");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Upload Personnel Image 
    const upload_Image_File = (image) => {
        const val = {
            'PINID': pId,
            'PhotoTypeId': value.photoId,
            'CreatedByUserFK': pinId,
            // 'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        }
        const values = EncryptedList(JSON.stringify(val));
        var formdata = new FormData();
        formdata.append("Photo", image);
        formdata.append("Data", values);
        AddDeleteUpadate_FormData('Personnel/Insert_PersonnelPhoto', formdata)
            .then((res) => {
                if (res.success) {
                    get_Personnel_MultiImage(pId)
                }
            })
            .catch(err => console.log(err))
    }

    const delete_Image_File = (e) => {
        e.preventDefault()
        const value = {
            PhotoId: imageId,
            DeletedByUserFK: pinId,
            // DeletedByUserFK: Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        }
        AddDeleteUpadate('Personnel/Delete_PersonnelPhoto', value).then((data) => {
            if (data.success) {
                toastifySuccess(data.Message)
                get_Personnel_MultiImage(pId)
            } else {
                toastifyError(data.Message)
            }
        });
    }

    const startRef2 = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef2.current.setOpen(false);
        }
    };

    // Custom color
    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const checkPinExist = (checkNumber, aId, pId) => {
        const val = { PINID: pId, PIN: checkNumber, AgencyID: aId, }
        fetchPostData('Personnel/GetData_CheckPIN', val).then(res => {
            // console.log(res[0])
            // console.log(res[0].Count > 0)
            if (res[0].Count > 0) {
                setIsMultiPin(true)
            } else {
                setIsMultiPin(false)
            }
        })
    }

    return (
        <>
            <div className="row">
                <div className="col-12 " id='display-not-form'>
                    <div className="row">
                        <div className="col-12 col-md-12 pt-2 p-0 " >
                            <div className="bg-line  cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0 d-flex align-items-center">
                                    Employee  Information :- {personnelStatus ? personnelEditList[0]?.PINID : ''}
                                </p>
                            </div>
                        </div>
                        <div className="col-12 col-md-12 col-lg-10 pt-2 p-0">
                            <div className="row">
                                <div className={`col-12 col-md-12 `} >
                                    <div className="row row-gd " >
                                        <div className="col-6 col-md-2 col-lg-3 mt-1">
                                            <div class="text-field">
                                                <input type="text" maxlength="6"
                                                    name='PIN' value={value.PIN}
                                                    className={fieldPermisionAgency?.PIN[0] ?
                                                        fieldPermisionAgency?.PIN[0]?.Changeok === 0 && fieldPermisionAgency?.PIN[0]?.AddOK === 0 && personnelStatus ? 'readonlyColor' : fieldPermisionAgency?.PIN[0]?.Changeok === 0 && fieldPermisionAgency?.PIN[0]?.AddOK === 1 && editValueList?.PIN === '' && personnelStatus ? 'requiredColor' : fieldPermisionAgency?.PIN[0]?.AddOK === 1 && !personnelStatus ? 'requiredColor' : fieldPermisionAgency?.PIN[0]?.Changeok === 1 && personnelStatus ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                                    }
                                                    onChange={fieldPermisionAgency?.PIN[0] ?
                                                        fieldPermisionAgency?.PIN[0]?.Changeok === 0 && fieldPermisionAgency?.PIN[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.PIN[0]?.Changeok === 0 && fieldPermisionAgency?.PIN[0]?.AddOK === 1 && editValueList?.PIN === '' && personnelStatus ? handleChange : fieldPermisionAgency?.PIN[0]?.AddOK === 1 && !personnelStatus ? handleChange : fieldPermisionAgency?.PIN[0]?.Changeok === 1 && personnelStatus ? handleChange : '' : handleChange
                                                    }
                                                    required />
                                                <label>Pin</label>
                                                <p> <span className='hovertext-1' data-hover="Enter a 6 digit code here with no repeating digits and sequential patterns (i.e., 112233, 123456)" ><i className='fa fa-exclamation-circle'></i></span></p>

                                                {errors.PINError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PINError}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-3 col-lg-3 mt-1">
                                            <div class="text-field">
                                                <input type="text" maxLength={50} name='LastName' value={value.LastName}
                                                    className={fieldPermisionAgency?.LastName[0] ?
                                                        fieldPermisionAgency?.LastName[0]?.Changeok === 0 && fieldPermisionAgency?.LastName[0]?.AddOK === 0 && personnelStatus ? 'readonlyColor' : fieldPermisionAgency?.LastName[0]?.Changeok === 0 && fieldPermisionAgency?.LastName[0]?.AddOK === 1 && editValueList?.LastName === '' && personnelStatus ? 'requiredColor' : fieldPermisionAgency?.LastName[0]?.AddOK === 1 && !personnelStatus ? 'requiredColor' : fieldPermisionAgency?.LastName[0]?.Changeok === 1 && personnelStatus ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                                    }
                                                    onChange={fieldPermisionAgency?.LastName[0] ?
                                                        fieldPermisionAgency?.LastName[0]?.Changeok === 0 && fieldPermisionAgency?.LastName[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.LastName[0]?.Changeok === 0 && fieldPermisionAgency?.LastName[0]?.AddOK === 1 && editValueList?.LastName === '' && personnelStatus ? handleChange : fieldPermisionAgency?.LastName[0]?.AddOK === 1 && !personnelStatus ? handleChange : fieldPermisionAgency?.LastName[0]?.Changeok === 1 && personnelStatus ? handleChange : '' : handleChange
                                                    }
                                                    required />
                                                <label>Last Name</label>
                                                {errors.LastNameError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LastNameError}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-3 col-lg-3 mt-1">
                                            <div class="text-field">
                                                <input type="text" maxLength={50} name='FirstName' value={value.FirstName}
                                                    className={fieldPermisionAgency?.FirstName[0] ?
                                                        fieldPermisionAgency?.FirstName[0]?.Changeok === 0 && fieldPermisionAgency?.FirstName[0]?.AddOK === 0 && personnelStatus ? 'readonlyColor' : fieldPermisionAgency?.FirstName[0]?.Changeok === 0 && fieldPermisionAgency?.FirstName[0]?.AddOK === 1 && editValueList?.FirstName === '' && personnelStatus ? 'requiredColor' : fieldPermisionAgency?.FirstName[0]?.AddOK === 1 && !personnelStatus ? 'requiredColor' : fieldPermisionAgency?.FirstName[0]?.Changeok === 1 && personnelStatus ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                                    }
                                                    onChange={fieldPermisionAgency?.FirstName[0] ?
                                                        fieldPermisionAgency?.FirstName[0]?.Changeok === 0 && fieldPermisionAgency?.FirstName[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.FirstName[0]?.Changeok === 0 && fieldPermisionAgency?.FirstName[0]?.AddOK === 1 && editValueList?.FirstName === '' && personnelStatus ? handleChange : fieldPermisionAgency?.FirstName[0]?.AddOK === 1 && !personnelStatus ? handleChange : fieldPermisionAgency?.FirstName[0]?.Changeok === 1 && personnelStatus ? handleChange : '' : handleChange
                                                    }
                                                    required />
                                                <label>First Name</label>
                                                {errors.FirstNameError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FirstNameError}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 col-lg-3 mt-1">
                                            <div class="text-field">
                                                <input type="text" maxLength={200} name='MiddleName' value={value.MiddleName} onChange={handleChange} required />
                                                <label>Middle Name</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12" >
                                    <div className="row">
                                        <div className="col-6 col-md-5 col-lg-3 mt-4  index-select">
                                            <Select
                                                name='SexID'
                                                onChange={(e) => ChangeDropDown(e, 'SexID')}
                                                value={sexList?.filter((obj) => obj.value === value?.SexID)}
                                                styles={customStylesWithOutColor}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                menuPlacement="top"
                                                options={sexList}
                                                isClearable
                                            />
                                            <label>Gender</label>
                                        </div>
                                        <div className="col-6 col-md-3 col-lg-3 mt-4 date__box">
                                            <DatePicker
                                                ref={startRef2}
                                                onKeyDown={onKeyDown}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                name='DateOfBirth'
                                                isClearable={true}
                                                maxDate={validDobDate}
                                                onChange={date => {
                                                    setDateOfBirth(date); setValue({ ...value, ['DateOfBirth']: getShowingYearMonthDate(date) });
                                                    // dateChange(date, 'DateOfBirth');

                                                    const newDate = new Date(date)
                                                    const year = newDate.getFullYear();
                                                    // const newDate = new Date(date.setFullYear(year + 18));
                                                    setDobHireDate(new Date(newDate.setFullYear(year + 18)));
                                                }}
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                // onChange={date => fieldPermisionPersonal?.DateOfBirth[0] ?
                                                //     fieldPermisionPersonal?.DateOfBirth[0]?.Changeok === 0 && fieldPermisionPersonal?.DateOfBirth[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.DateOfBirth[0]?.Changeok === 0 && fieldPermisionPersonal?.DateOfBirth[0]?.AddOK === 1 && personnelList?.DateOfBirth === '' && status ? dateChange(date, 'DateOfBirth') : fieldPermisionPersonal?.DateOfBirth[0]?.AddOK === 1 && !status ? dateChange(date, 'DateOfBirth') : fieldPermisionPersonal?.DateOfBirth[0]?.Changeok === 1 && status ? dateChange(date, 'DateOfBirth') : '' : dateChange(date, 'DateOfBirth')
                                                // }
                                                // disabled={fieldPermisionPersonal?.DateOfBirth[0] ?
                                                //     fieldPermisionPersonal?.DateOfBirth[0]?.Changeok === 0 && fieldPermisionPersonal?.DateOfBirth[0]?.AddOK === 0 && status ? true : fieldPermisionPersonal?.DateOfBirth[0]?.Changeok === 0 && fieldPermisionPersonal?.DateOfBirth[0]?.AddOK === 1 && personnelList?.DateOfBirth === '' && status ? false : fieldPermisionPersonal?.DateOfBirth[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.DateOfBirth[0]?.Changeok === 1 && status ? false : true : false
                                                // }
                                                selected={dateOfBirth}
                                                // showDisabledMonthNavigation
                                                placeholderText={value.DateOfBirth ? value.DateOfBirth : 'Select ..'}
                                            // showTimeInput
                                            />
                                            <div>
                                                <label htmlFor="">Date Of Birth</label>
                                            </div>
                                            <label>Date Of Birth</label>
                                        </div>
                                        <div className="col-6 col-md-4 col-lg-3 mt-3">
                                            <div class="text-field">
                                                <input type="text" name='Email' value={value.Email}
                                                    className={fieldPermisionAgency?.Email[0] ?
                                                        fieldPermisionAgency?.Email[0]?.Changeok === 0 && fieldPermisionAgency?.Email[0]?.AddOK === 0 && personnelStatus ? 'readonlyColor' : fieldPermisionAgency?.Email[0]?.Changeok === 0 && fieldPermisionAgency?.Email[0]?.AddOK === 1 && editValueList?.Email === '' && personnelStatus ? '' : fieldPermisionAgency?.Email[0]?.AddOK === 1 && !personnelStatus ? '' : fieldPermisionAgency?.Email[0]?.Changeok === 1 && personnelStatus ? '' : 'readonlyColor' : ''
                                                    }
                                                    onChange={fieldPermisionAgency?.Email[0] ?
                                                        fieldPermisionAgency?.Email[0]?.Changeok === 0 && fieldPermisionAgency?.Email[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.Email[0]?.Changeok === 0 && fieldPermisionAgency?.Email[0]?.AddOK === 1 && editValueList?.Email === '' && personnelStatus ? handleChange : fieldPermisionAgency?.Email[0]?.AddOK === 1 && !personnelStatus ? handleChange : fieldPermisionAgency?.Email[0]?.Changeok === 1 && personnelStatus ? handleChange : '' : handleChange
                                                    }
                                                    required />
                                                <label>Email Id</label>
                                                {errors.emailError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.emailError}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-4 col-lg-3 mt-4 index-select">
                                            <Select
                                                name='EmployeeTypeID'
                                                onChange={(e) => ChangeDropDown(e, 'EmployeeTypeID')}
                                                value={employeeTypeList?.filter((obj) => obj.value === value?.EmployeeTypeID)}
                                                styles={customStylesWithOutColor}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                menuPlacement="top"
                                                options={employeeTypeList}
                                                isClearable
                                            />
                                            {/* {
                                                value?.EmployeeName ?
                                                    <Select name='Employee Type'
                                                        styles={customStylesWithOutColor}
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        menuPlacement="top"
                                                        defaultValue={value?.EmployeeName}
                                                        options={employeeTypeList}
                                                        onChange={EmployeeTypeChange}
                                                        isClearable
                                                    />
                                                    : <>
                                                        <Select name='Employee Type'
                                                            styles={customStylesWithOutColor}
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            menuPlacement="top"
                                                            options={employeeTypeList}
                                                            onChange={EmployeeTypeChange}
                                                            isClearable
                                                        />
                                                    </> 
                                            }*/}
                                            <label htmlFor="">Employee Type</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3 mt-4  index-select">
                                            <Select
                                                styles={customStylesWithOutColor}
                                                value={division?.filter((obj) => obj.value === value?.DivisionId)}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                name='DivisionId'
                                                menuPlacement="top"
                                                options={division}
                                                isClearable
                                                onChange={fieldPermisionAgency?.DivisionId[0] ?
                                                    fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && editValueList?.DivisionId === '' && personnelStatus ? divisionChange : fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && !personnelStatus ? divisionChange : fieldPermisionAgency?.DivisionId[0]?.Changeok === 1 && personnelStatus ? divisionChange : '' : divisionChange
                                                }
                                                isDisabled={fieldPermisionAgency?.DivisionId[0] ?
                                                    fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 0 && personnelStatus ? true : fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && editValueList?.DivisionId === '' && personnelStatus ? false : fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && !personnelStatus ? false : fieldPermisionAgency?.DivisionId[0]?.Changeok === 1 && personnelStatus ? false : true : false
                                                }
                                            />
                                            {/* {
                                                value?.DivisionName ?
                                                    <Select
                                                        styles={customStylesWithOutColor}

                                                        // styles={customStyles}
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        name='DivisionId' menuPlacement="top"
                                                        options={division}
                                                        defaultValue={value?.DivisionName}
                                                        isClearable
                                                        onChange={fieldPermisionAgency?.DivisionId[0] ?
                                                            fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && editValueList?.DivisionId === '' && personnelStatus ? divisionChange : fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && !personnelStatus ? divisionChange : fieldPermisionAgency?.DivisionId[0]?.Changeok === 1 && personnelStatus ? divisionChange : '' : divisionChange
                                                        }
                                                        isDisabled={fieldPermisionAgency?.DivisionId[0] ?
                                                            fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 0 && personnelStatus ? true : fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && editValueList?.DivisionId === '' && personnelStatus ? false : fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && !personnelStatus ? false : fieldPermisionAgency?.DivisionId[0]?.Changeok === 1 && personnelStatus ? false : true : false
                                                        }
                                                    /> : <>
                                                        <Select
                                                            styles={customStylesWithOutColor}

                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            name='DivisionId' menuPlacement="top"
                                                            options={division}
                                                            isClearable
                                                            onChange={fieldPermisionAgency?.DivisionId[0] ?
                                                                fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && editValueList?.DivisionId === '' && personnelStatus ? divisionChange : fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && !personnelStatus ? divisionChange : fieldPermisionAgency?.DivisionId[0]?.Changeok === 1 && personnelStatus ? divisionChange : '' : divisionChange
                                                            }
                                                            isDisabled={fieldPermisionAgency?.DivisionId[0] ?
                                                                fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 0 && personnelStatus ? true : fieldPermisionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && editValueList?.DivisionId === '' && personnelStatus ? false : fieldPermisionAgency?.DivisionId[0]?.AddOK === 1 && !personnelStatus ? false : fieldPermisionAgency?.DivisionId[0]?.Changeok === 1 && personnelStatus ? false : true : false
                                                            }
                                                        />
                                                    </>
                                            } */}
                                            <label htmlFor="">Division</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3 mt-4 index-select">
                                            <Select
                                                styles={customStylesWithOutColor}
                                                value={rankList?.filter((obj) => obj.value === value?.RankID)}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                name='RankID' menuPlacement="top"
                                                options={rankList}
                                                isClearable
                                                onChange={fieldPermisionAgency?.RankID[0] ?
                                                    fieldPermisionAgency?.RankID[0]?.Changeok === 0 && fieldPermisionAgency?.RankID[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.RankID[0]?.Changeok === 0 && fieldPermisionAgency?.RankID[0]?.AddOK === 1 && editValueList?.RankID === '' && personnelStatus ? rankChange : fieldPermisionAgency?.RankID[0]?.AddOK === 1 && !personnelStatus ? rankChange : fieldPermisionAgency?.RankID[0]?.Changeok === 1 && personnelStatus ? rankChange : '' : rankChange
                                                }
                                                isDisabled={fieldPermisionAgency?.RankID[0] ?
                                                    fieldPermisionAgency?.RankID[0]?.Changeok === 0 && fieldPermisionAgency?.RankID[0]?.AddOK === 0 && personnelStatus ? true : fieldPermisionAgency?.RankID[0]?.Changeok === 0 && fieldPermisionAgency?.RankID[0]?.AddOK === 1 && editValueList?.RankID === '' && personnelStatus ? false : fieldPermisionAgency?.RankID[0]?.AddOK === 1 && !personnelStatus ? false : fieldPermisionAgency?.RankID[0]?.Changeok === 1 && personnelStatus ? false : true : false
                                                }
                                            />
                                            {/* {
                                            value?.RankName ?
                                                <Select
                                                    styles={customStylesWithOutColor}

                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    name='RankID' menuPlacement="top"
                                                    options={rankList}
                                                    defaultValue={value?.RankName}
                                                    isClearable
                                                    onChange={fieldPermisionAgency?.RankID[0] ?
                                                        fieldPermisionAgency?.RankID[0]?.Changeok === 0 && fieldPermisionAgency?.RankID[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.RankID[0]?.Changeok === 0 && fieldPermisionAgency?.RankID[0]?.AddOK === 1 && editValueList?.RankID === '' && personnelStatus ? rankChange : fieldPermisionAgency?.RankID[0]?.AddOK === 1 && !personnelStatus ? rankChange : fieldPermisionAgency?.RankID[0]?.Changeok === 1 && personnelStatus ? rankChange : '' : rankChange
                                                    }
                                                    isDisabled={fieldPermisionAgency?.RankID[0] ?
                                                        fieldPermisionAgency?.RankID[0]?.Changeok === 0 && fieldPermisionAgency?.RankID[0]?.AddOK === 0 && personnelStatus ? true : fieldPermisionAgency?.RankID[0]?.Changeok === 0 && fieldPermisionAgency?.RankID[0]?.AddOK === 1 && editValueList?.RankID === '' && personnelStatus ? false : fieldPermisionAgency?.RankID[0]?.AddOK === 1 && !personnelStatus ? false : fieldPermisionAgency?.RankID[0]?.Changeok === 1 && personnelStatus ? false : true : false
                                                    }
                                                />
                                                :
                                                <>
                                                    <Select
                                                        styles={customStylesWithOutColor}

                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        name='RankID' menuPlacement="top"
                                                        options={rankList}
                                                        isClearable
                                                        onChange={fieldPermisionAgency?.RankID[0] ?
                                                            fieldPermisionAgency?.RankID[0]?.Changeok === 0 && fieldPermisionAgency?.RankID[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.RankID[0]?.Changeok === 0 && fieldPermisionAgency?.RankID[0]?.AddOK === 1 && editValueList?.RankID === '' && personnelStatus ? rankChange : fieldPermisionAgency?.RankID[0]?.AddOK === 1 && !personnelStatus ? rankChange : fieldPermisionAgency?.RankID[0]?.Changeok === 1 && personnelStatus ? rankChange : '' : rankChange
                                                        }
                                                        isDisabled={fieldPermisionAgency?.RankID[0] ?
                                                            fieldPermisionAgency?.RankID[0]?.Changeok === 0 && fieldPermisionAgency?.RankID[0]?.AddOK === 0 && personnelStatus ? true : fieldPermisionAgency?.RankID[0]?.Changeok === 0 && fieldPermisionAgency?.RankID[0]?.AddOK === 1 && editValueList?.RankID === '' && personnelStatus ? false : fieldPermisionAgency?.RankID[0]?.AddOK === 1 && !personnelStatus ? false : fieldPermisionAgency?.RankID[0]?.Changeok === 1 && personnelStatus ? false : true : false
                                                        }
                                                    /></>
                                            } */}
                                            <label htmlFor="">Rank</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-3 mt-4 index-select">
                                            <Select
                                                styles={customStylesWithOutColor}
                                                value={associatedShift?.filter((obj) => obj.value === value?.ShiftID)}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                name='ShiftID' menuPlacement="top"
                                                options={associatedShift}
                                                isClearable
                                                onChange={fieldPermisionAgency?.ShiftID[0] ?
                                                    fieldPermisionAgency?.ShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftID[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.ShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftID[0]?.AddOK === 1 && editValueList?.ShiftID === '' && personnelStatus ? shiftChange : fieldPermisionAgency?.ShiftID[0]?.AddOK === 1 && !personnelStatus ? shiftChange : fieldPermisionAgency?.ShiftID[0]?.Changeok === 1 && personnelStatus ? shiftChange : '' : shiftChange
                                                }
                                                isDisabled={fieldPermisionAgency?.ShiftID[0] ?
                                                    fieldPermisionAgency?.ShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftID[0]?.AddOK === 0 && personnelStatus ? true : fieldPermisionAgency?.ShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftID[0]?.AddOK === 1 && editValueList?.ShiftID === '' && personnelStatus ? false : fieldPermisionAgency?.ShiftID[0]?.AddOK === 1 && !personnelStatus ? false : fieldPermisionAgency?.ShiftID[0]?.Changeok === 1 && personnelStatus ? false : true : false
                                                }
                                            />
                                            {/* {
                                                value?.ShiftName ?
                                                    <Select
                                                        styles={customStylesWithOutColor}

                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        name='ShiftID' menuPlacement="top"
                                                        options={associatedShift}
                                                        defaultValue={value?.ShiftName}
                                                        isClearable
                                                        onChange={fieldPermisionAgency?.ShiftID[0] ?
                                                            fieldPermisionAgency?.ShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftID[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.ShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftID[0]?.AddOK === 1 && editValueList?.ShiftID === '' && personnelStatus ? shiftChange : fieldPermisionAgency?.ShiftID[0]?.AddOK === 1 && !personnelStatus ? shiftChange : fieldPermisionAgency?.ShiftID[0]?.Changeok === 1 && personnelStatus ? shiftChange : '' : shiftChange
                                                        }
                                                        isDisabled={fieldPermisionAgency?.ShiftID[0] ?
                                                            fieldPermisionAgency?.ShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftID[0]?.AddOK === 0 && personnelStatus ? true : fieldPermisionAgency?.ShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftID[0]?.AddOK === 1 && editValueList?.ShiftID === '' && personnelStatus ? false : fieldPermisionAgency?.ShiftID[0]?.AddOK === 1 && !personnelStatus ? false : fieldPermisionAgency?.ShiftID[0]?.Changeok === 1 && personnelStatus ? false : true : false
                                                        }
                                                    />
                                                     :
                                                      <>
                                                        <Select
                                                            styles={customStylesWithOutColor}

                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            name='ShiftID' menuPlacement="top"
                                                            options={associatedShift}
                                                            isClearable
                                                            onChange={fieldPermisionAgency?.ShiftID[0] ?
                                                                fieldPermisionAgency?.ShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftID[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.ShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftID[0]?.AddOK === 1 && editValueList?.ShiftID === '' && personnelStatus ? shiftChange : fieldPermisionAgency?.ShiftID[0]?.AddOK === 1 && !personnelStatus ? shiftChange : fieldPermisionAgency?.ShiftID[0]?.Changeok === 1 && personnelStatus ? shiftChange : '' : shiftChange
                                                            }
                                                            isDisabled={fieldPermisionAgency?.ShiftID[0] ?
                                                                fieldPermisionAgency?.ShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftID[0]?.AddOK === 0 && personnelStatus ? true : fieldPermisionAgency?.ShiftID[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftID[0]?.AddOK === 1 && editValueList?.ShiftID === '' && personnelStatus ? false : fieldPermisionAgency?.ShiftID[0]?.AddOK === 1 && !personnelStatus ? false : fieldPermisionAgency?.ShiftID[0]?.Changeok === 1 && personnelStatus ? false : true : false
                                                            }
                                                        />
                                                    </>
                                            } */}
                                            <label htmlFor="">Shift</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 px-2 " >
                                    <div className="row">
                                        <div className="col-12 col-md-12 pt-2 p-0" >
                                            <div className="bg-line cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                                <p className="p-0 m-0 d-flex align-items-center ">
                                                    Login Information
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-6 col-md-4 col-lg-4 mt-3">
                                            <div class="text-field">
                                                <input type="text"
                                                    name='UserName' value={value.UserName}
                                                    className={fieldPermisionAgency?.UserName[0] ?
                                                        fieldPermisionAgency?.UserName[0]?.Changeok === 0 && fieldPermisionAgency?.UserName[0]?.AddOK === 0 && personnelStatus ? 'readonlyColor' : fieldPermisionAgency?.UserName[0]?.Changeok === 0 && fieldPermisionAgency?.UserName[0]?.AddOK === 1 && editValueList?.UserName === '' && personnelStatus ? 'requiredColor' : fieldPermisionAgency?.UserName[0]?.AddOK === 1 && !personnelStatus ? 'requiredColor' : fieldPermisionAgency?.UserName[0]?.Changeok === 1 && personnelStatus ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                                    }
                                                    onChange={fieldPermisionAgency?.UserName[0] ?
                                                        fieldPermisionAgency?.UserName[0]?.Changeok === 0 && fieldPermisionAgency?.UserName[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.UserName[0]?.Changeok === 0 && fieldPermisionAgency?.UserName[0]?.AddOK === 1 && editValueList?.UserName === '' && personnelStatus ? handleChange : fieldPermisionAgency?.UserName[0]?.AddOK === 1 && !personnelStatus ? handleChange : fieldPermisionAgency?.UserName[0]?.Changeok === 1 && personnelStatus ? handleChange : '' : handleChange
                                                    }
                                                    required />
                                                <label>Login UserId</label>
                                                {errors.UserNameError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.UserNameError}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="col-5 col-md-4 col-lg-4 mt-3">
                                            <div class="text-field">
                                                <input type="text" name='Password' value={pasStatus ? '*********' : value.Password}
                                                    className={fieldPermisionAgency?.Password[0] ?
                                                        fieldPermisionAgency?.Password[0]?.Changeok === 0 && fieldPermisionAgency?.Password[0]?.AddOK === 0 && personnelStatus ? 'readonlyColor' : fieldPermisionAgency?.Password[0]?.Changeok === 0 && fieldPermisionAgency?.Password[0]?.AddOK === 1 && editValueList?.Password === '' && personnelStatus ? '' : fieldPermisionAgency?.Password[0]?.AddOK === 1 && !personnelStatus ? '' : fieldPermisionAgency?.Password[0]?.Changeok === 1 && personnelStatus ? '' : 'readonlyColor' : ''
                                                    }
                                                    onChange={fieldPermisionAgency?.Password[0] ?
                                                        fieldPermisionAgency?.Password[0]?.Changeok === 0 && fieldPermisionAgency?.Password[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.Password[0]?.Changeok === 0 && fieldPermisionAgency?.Password[0]?.AddOK === 1 && editValueList?.Password === '' && personnelStatus ? handleChange : fieldPermisionAgency?.Password[0]?.AddOK === 1 && !personnelStatus ? handleChange : fieldPermisionAgency?.Password[0]?.Changeok === 1 && personnelStatus ? handleChange : '' : handleChange
                                                    }
                                                    required />
                                                <label>Password</label>
                                                {
                                                    fieldPermisionAgency?.Password[0]?.DisplayOK === 1 ?
                                                        <i className={!pasStatus ? "fa fa-eye" : "fa fa-eye-slash"} onClick={(e) => setPasStatus(!pasStatus)} style={{ position: 'absolute', top: '25%', right: '3%' }}></i>
                                                        : <></>
                                                }
                                                <p><span className='hovertext-pass' data-hover={`Password: Enter password of min.${passwordSettingVal?.MinPasswordLength}  Length with min ${passwordSettingVal?.MinSpecialCharsInPassword} special char, Min ${passwordSettingVal?.MinUpperCaseInPassword} Uppercase, Min ${passwordSettingVal?.MinLowerCaseInPassword} Lowercase and Min ${passwordSettingVal?.MinNumericDigitsInPassword} numeric digit`} ><i className='fa fa-exclamation-circle'></i></span></p>
                                            </div>
                                            {errors.PasswordError !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PasswordError === 'false' ? 'Incorrect format' : errors.PasswordError}</span>
                                            ) : null}
                                        </div>
                                        <div className='mt-4 col-1 col-md-1 col-lg-1'>
                                            <p className='mt-2'><i style={{ color: errors?.PasswordError === 'true' ? 'green' : 'red', fontSize: "20px" }} className="fa fa-check-circle" aria-hidden="true"></i> </p>
                                        </div>
                                        <div className="col-6 col-md-3 col-lg-3 mt-3">
                                            <div class="text-field">
                                                <input type="text" name='ReEnterPassword' value={rePasStatus ? '*********' : value.ReEnterPassword}
                                                    className={fieldPermisionAgency?.ReEnterPassword[0] ?
                                                        fieldPermisionAgency?.ReEnterPassword[0]?.Changeok === 0 && fieldPermisionAgency?.ReEnterPassword[0]?.AddOK === 0 && personnelStatus ? 'readonlyColor' : fieldPermisionAgency?.ReEnterPassword[0]?.Changeok === 0 && fieldPermisionAgency?.ReEnterPassword[0]?.AddOK === 1 && editValueList?.ReEnterPassword === '' && personnelStatus ? '' : fieldPermisionAgency?.ReEnterPassword[0]?.AddOK === 1 && !personnelStatus ? '' : fieldPermisionAgency?.ReEnterPassword[0]?.Changeok === 1 && personnelStatus ? '' : 'readonlyColor' : ''
                                                    }
                                                    onChange={fieldPermisionAgency?.ReEnterPassword[0] ?
                                                        fieldPermisionAgency?.ReEnterPassword[0]?.Changeok === 0 && fieldPermisionAgency?.ReEnterPassword[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.ReEnterPassword[0]?.Changeok === 0 && fieldPermisionAgency?.ReEnterPassword[0]?.AddOK === 1 && editValueList?.ReEnterPassword === '' && personnelStatus ? handleChange : fieldPermisionAgency?.ReEnterPassword[0]?.AddOK === 1 && !personnelStatus ? handleChange : fieldPermisionAgency?.ReEnterPassword[0]?.Changeok === 1 && personnelStatus ? handleChange : '' : handleChange
                                                    }
                                                    required />
                                                <label>Re-Enter Password</label>
                                                {errors.ReEnterPasswordError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReEnterPasswordError}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=" col-4 col-md-4 col-lg-2 pt-4" >
                            <div className="img-box" >
                                <Carousel className="carousel-style" showArrows={true} showThumbs={false} showStatus={false}
                                //  onClickItem={(e) => imageChange(e)}
                                >
                                    {
                                        personnelImage ?
                                            personnelImage?.map((item, index) => (
                                                <div key={index}>
                                                    <img src={item.Photo_Path} style={{ height: '210px' }} />
                                                    {/* <input type='button' className="legend" value={item.id} onClick={(e) => console.log(e.target.value)} /> */}
                                                    <div className='box' style={{ background: 'red' }}>
                                                        <a type='button' data-toggle="modal" data-target="#DeleteModal" className="legend-img " onClick={(e) => { setImageId(item.Id) }} >
                                                            <i className='fa fa-close' ></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            ))
                                            :
                                            <div key='test'>
                                                <img src={defualtImage} style={{ height: '190px' }} />
                                            </div>
                                    }
                                    {/* {
                                        !personnelStatus ?
                                            <div key='test'>
                                                <img src={defualtImage} style={{ height: '190px' }} />
                                            </div>
                                            :
                                            <>
                                                <div key='test'>
                                                    <img src={defualtImage} style={{ height: '190px' }} />
                                                </div>
                                            </>
                                    } */}
                                </Carousel>
                            </div>
                            <div className="row">
                                {
                                    personnelStatus ?
                                        <div className="col-md-12 text-center " style={{ position: 'absolute', bottom: '0px' }}>
                                            <label className='pers-img mt-1'> <i className='fa fa-upload'></i>
                                                <input type="file" size="60" onChange={get_Image_File} />
                                            </label>
                                            {/* <input type="file" className="btn btn-sm btn-success" onChange={get_Image_File} /><i className='fa fa-upload'></i> */}
                                        </div> : <></>
                                }
                            </div>
                        </div>
                        <div className="col-12 col-md-12 " >
                            <div className="row">
                                <div className="col-12 col-md-12  p-0" >
                                    <div className="bg-line  cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                        <p className="p-0 m-0 d-flex align-items-center ">
                                            Other
                                        </p>
                                    </div>
                                </div>
                                {/* 'NCICLoginId': '', 'NCICORI': '', 'ScheduleId': '', 'MaxLockLevel': '', 'MaxRestrictLevel': '', 'IsJuvenileCleared': '', 'IsActive': '' */}
                                <div className="col-6 col-md-4 col-lg-3  mt-3">
                                    <div class="text-field">
                                        <input type="text" name='NCICLoginId' value={value?.NCICLoginId} onChange={handleChange}
                                            required />
                                        <label>NCIC Login Id</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-2  mt-3">
                                    <div class="text-field">
                                        <input type="text" name='NCICORI' value={value?.NCICORI} onChange={handleChange}
                                            required />
                                        <label>NCIC ORI</label>
                                    </div>
                                </div>
                                <div className="col-6 col-md-4 col-lg-3 mt-4 index-select">
                                    <Select
                                        className="basic-single"
                                        classNamePrefix="select"
                                        name='ShiftID' menuPlacement="top"
                                        options=''
                                        defaultValue=''
                                        isClearable
                                        isDisabled
                                        styles={customStylesWithOutColor}
                                    />
                                    <label>Schedule</label>
                                </div>
                                <div className="col-6 col-md-3 col-lg-2 mt-3">
                                    <div class="text-field">
                                        <input type="text" name='MaxLockLevel' value={value.MaxLockLevel} onChange={handleChange}
                                            required />
                                        <label>Max Lock Level</label>
                                    </div>
                                </div>
                                <div className="col-4 col-md-3 col-lg-2  mt-3">
                                    <div class="text-field">
                                        <input type="text" name='MaxRestrictLevel' value={value.MaxRestrictLevel} onChange={handleChange}
                                            required />
                                        <label>Max Restrict Level</label>
                                    </div>
                                </div>
                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                    <input type="checkbox" name="IsSuperadmin"
                                        checked={value?.IsSuperadmin}
                                        value={value?.IsSuperadmin}
                                        onChange={fieldPermisionAgency?.IsSuperadmin[0] ?
                                            fieldPermisionAgency?.IsSuperadmin[0]?.Changeok === 0 && fieldPermisionAgency?.IsSuperadmin[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.IsSuperadmin[0]?.Changeok === 0 && fieldPermisionAgency?.IsSuperadmin[0]?.AddOK === 1 && editValueList?.IsSuperadmin === '' && personnelStatus ? () => setValue({ ...value, ['IsSuperadmin']: !value?.IsSuperadmin }) : fieldPermisionAgency?.IsSuperadmin[0]?.AddOK === 1 && !personnelStatus ? () => setValue({ ...value, ['IsSuperadmin']: !value?.IsSuperadmin }) : fieldPermisionAgency?.IsSuperadmin[0]?.Changeok === 1 && personnelStatus ? () => setValue({ ...value, ['IsSuperadmin']: !value?.IsSuperadmin }) : ''
                                            : () => setValue({ ...value, ['IsSuperadmin']: !value?.IsSuperadmin })
                                        }
                                        disabled={fieldPermisionAgency?.IsSuperadmin[0] ?
                                            fieldPermisionAgency?.IsSuperadmin[0]?.Changeok === 0 && fieldPermisionAgency?.IsSuperadmin[0]?.AddOK === 0 && personnelStatus ? true : fieldPermisionAgency?.IsSuperadmin[0]?.Changeok === 0 && fieldPermisionAgency?.IsSuperadmin[0]?.AddOK === 1 && editValueList?.IsSuperadmin === '' && personnelStatus ? false : fieldPermisionAgency?.IsSuperadmin[0]?.AddOK === 1 && !personnelStatus ? false : fieldPermisionAgency?.IsSuperadmin[0]?.Changeok === 1 && personnelStatus ? false : true : false
                                        }
                                        id="IsSuperadmin" />
                                    <label className='ml-2' htmlFor="IsSuperadmin">Super Admin</label>
                                </div>
                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                    <input type="checkbox" name="IsAllowLogin"
                                        checked={value?.IsAllowLogin}
                                        value={value?.IsAllowLogin}
                                        onChange={fieldPermisionAgency?.IsAllowLogin[0] ?
                                            fieldPermisionAgency?.IsAllowLogin[0]?.Changeok === 0 && fieldPermisionAgency?.IsAllowLogin[0]?.AddOK === 0 && personnelStatus ? '' : fieldPermisionAgency?.IsAllowLogin[0]?.Changeok === 0 && fieldPermisionAgency?.IsAllowLogin[0]?.AddOK === 1 && editValueList?.IsAllowLogin === '' && personnelStatus ? () => setValue({ ...value, ['IsAllowLogin']: !value?.IsAllowLogin }) : fieldPermisionAgency?.IsAllowLogin[0]?.AddOK === 1 && !personnelStatus ? () => setValue({ ...value, ['IsAllowLogin']: !value?.IsAllowLogin }) : fieldPermisionAgency?.IsAllowLogin[0]?.Changeok === 1 && personnelStatus ? () => setValue({ ...value, ['IsAllowLogin']: !value?.IsAllowLogin }) : ''
                                            : () => setValue({ ...value, ['IsAllowLogin']: !value?.IsAllowLogin })
                                        }
                                        disabled={fieldPermisionAgency?.IsAllowLogin[0] ?
                                            fieldPermisionAgency?.IsAllowLogin[0]?.Changeok === 0 && fieldPermisionAgency?.IsAllowLogin[0]?.AddOK === 0 && personnelStatus ? true : fieldPermisionAgency?.IsAllowLogin[0]?.Changeok === 0 && fieldPermisionAgency?.IsAllowLogin[0]?.AddOK === 1 && editValueList?.IsAllowLogin === '' && personnelStatus ? false : fieldPermisionAgency?.IsAllowLogin[0]?.AddOK === 1 && !personnelStatus ? false : fieldPermisionAgency?.IsAllowLogin[0]?.Changeok === 1 && personnelStatus ? false : true : false
                                        }
                                        id="IsAllowLogin" />
                                    <label className='ml-2' htmlFor="IsAllowLogin">Allow Login</label>
                                </div>
                                <div className="col-2 col-md-3 col-lg-1 mt-2">
                                    <input type="checkbox" name="IsActive" checked={value?.IsActive} value={value?.IsActive} onChange={() => {
                                        // console.log(personnelStatus)
                                        if (personnelStatus) {
                                            setValue({ ...value, ['IsActive']: !value?.IsActive });
                                        }
                                    }}
                                    />
                                    <label className='ml-2' >Active</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2 mt-2">
                                    <input type="checkbox" name="IsJuvenileCleared" checked={value.IsJuvenileCleared} value={value.IsJuvenileCleared} onChange={() => setValue({ ...value, ['IsJuvenileCleared']: !value?.IsJuvenileCleared })}
                                    />
                                    <label className='ml-2' >Juvenile Cleared</label>
                                </div>
                                <div className="col-2 mt-2">
                                    <input type="checkbox" name="IsSupervisor" checked={value?.IsSupervisor} value={value?.IsSupervisor} onChange={() => setValue({ ...value, ['IsSupervisor']: !value?.IsSupervisor })}
                                    />
                                    <label className='ml-2' >Report Approver</label>
                                </div>
                                <div className="col-2 mt-2">
                                    <input type="checkbox" name="AllowMultipleLogins" value={value?.AllowMultipleLogins} checked={value?.AllowMultipleLogins} onChange={handleChange} />
                                    <label className='ml-2' >Multiple Login</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-12   text-right">
                            {PersonnelEffectiveScreenPermission ?
                                PersonnelEffectiveScreenPermission[0]?.Changeok && personnelStatus ?
                                    <button type="button" class="btn btn-sm btn-success" onClick={check_Validation_Error}>Update</button>
                                    :
                                    PersonnelEffectiveScreenPermission[0]?.AddOK && !personnelStatus ?
                                        <button type="button" class="btn btn-sm btn-success" onClick={check_Validation_Error}>Save</button>
                                        : <></>
                                : personnelStatus ?
                                    <button type="button" class="btn btn-sm btn-success" onClick={check_Validation_Error}>Update</button>
                                    : <button type="button" class="btn btn-sm btn-success" onClick={check_Validation_Error}>Save</button>
                            }
                            {/* <button type="button" class="btn btn-sm btn-success ml-1" onClick={rest_Value}>New</button> */}
                            {/* <button type="button" class="btn btn-sm btn-success ml-1" onClick={() => {
                            setPersonnelStatus(false); setPasStatus(false); setRePasStatus(false); setModalOpen(false)
                        }}>Close</button> */}
                        </div>
                        <IdentifyFieldColor />
                    </div>
                </div>
            </div>
            <DeletePopUpModal func={delete_Image_File} />
            <ChangesModal func={check_Validation_Error} />
        </>
    )
}

export default Home


export const changeArrayFormat = (data, type) => {
    if (type === 'division') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.DivisionID, label: sponsor.Name })
        )
        return result
    }
    if (type === 'rank') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.RankID, label: sponsor.RankDescription })
        )
        return result
    }
    if (type === 'shift') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ShiftId, label: sponsor.ShiftDescription })
        )
        return result
    } if (type === 'photoType') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.PhotoTypeId, label: sponsor.PhotoType })
        )
        return result
    } if (type === 'genderId') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.SexCodeID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'EmployeeType') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.EmployeeTypeID, label: sponsor.Description })
        )
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type) => {
    if (type === 'division') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.DivisionId, label: sponsor.DivisionName })
        )
        return result[0]
    }
    if (type === 'rank') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.RankID, label: sponsor.RankName })
        )
        return result[0]
    }
    if (type === 'shift') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.ShiftID, label: sponsor.ShiftDescription })
        )
        return result[0]
    } if (type === 'EmployeeName') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.EmployeeTypeID, label: sponsor.EmployeeTypeDescription })
        )
        return result[0]
    } if (type === 'gender') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.SexID, label: sponsor.Gender_Name })
        )
        return result[0]
    }
}

