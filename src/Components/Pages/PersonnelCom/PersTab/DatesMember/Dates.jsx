// Import Component
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import Select from 'react-select';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { Decrypt_Id_Name, getShowingWithOutTime, getShowingYearMonthDate } from '../../../../Common/Utility';
import { Personal_Field_Permistion_Filter } from '../../../../Filter/PersonnelFilter';
import { AddDeleteUpadate, fetchData, fetchPostData, fieldPermision, ScreenPermision } from '../../../../hooks/Api';
import { Deactivate_Date_Field, Deceased_Date_Field, PhoneField, SSN_Field, WorkPhone_Ext_Field } from '../../Validation/PersonnelValidation';

const Dates = (props) => {
    // Hooks Initialization  
    const { pId, aId, pinId, status, dobHireDate } = props
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [zipList, setZipList] = useState([])
    const [sexList, setSexList] = useState([])
    const [hiredDate, setHiredDate] = useState()
    const [deactivateDate, setDeactivateDate] = useState()
    const [dateOfBirth, setDateOfBirth] = useState()
    const [deceasedDate, setDeceasedDate] = useState()
    const [personnelList, setPersonnelList] = useState([])
    const [raceList, setRaceList] = useState([])
    const [ethincityList, setEthincityList] = useState([])
    const [bloodGroupList, setBloodGroupList] = useState([])
    const [hairList, setHairList] = useState([])
    const [eyeList, setEyeList] = useState([]);
    const [modifiedDeactiveDate, setModifiedDeactiveDate] = useState(null)

    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()

    // const agencyId = Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID');

    const [value, setValue] = useState({
        'Address': '', 'StateID': '', 'CityID': '', 'ZipCodeID': '', 'SSN': '', 'BadgeNumber': '', 'DriverLicenseNo': '', 'WorkPhoneNumber': '', 'WorkPhone_Ext': '', 'HomePhoneNumber': '', 'CellPhoneNumber': '', 'HiredDate': '', 'DeactivateDate': '', 'DateOfBirth': '', 'IsDecease': '', 'DeceasedDate': '', 'SexID': '', 'RaceID': '', 'EthnicityID': '', 'height': '', 'weight': '', 'BloodTypeID': '', 'EyeColorID': '', 'HairColorID': '', 'PINID': pId,
        'StateName': '', "CityName": '', 'ZipName': '', 'RaceName': '', 'EthnicityName': '', 'BloodTypeName': '', 'EyeColorName': '', 'HairColorName': '',
        'ModifiedByUserFK': pinId,
    })

    const [fieldPermisionPersonal, setFieldPermisionPersonal] = useState({
        // Personnel Date Tab Field
        'Address': '', 'StateID': '', 'CityID': '', 'ZipCodeID': '', 'SSN': '', 'BadgeNumber': '', 'DriverLicenseNo': '', 'WorkPhoneNumber': '', 'WorkPhone_Ext': '', 'HomePhoneNumber': '', 'CellPhoneNumber': '', 'HiredDate': '', 'DeactivateDate': '', 'DateOfBirth': '', 'IsDecease': '', 'DeceasedDate': '', 'SexID': '', 'RaceID': '', 'EthnicityID': '', 'height': '', 'weight': '', 'BloodTypeID': '', 'EyeColorID': '', 'HairColorID': '',
    })

    const [errors, setErrors] = useState({
        'WorkPhoneNumber': '',
        'WorkPhone_Ext': '',
        'HomePhoneNumber': '',
        'CellPhoneNumber': '',
        'SSN': '',
        'DeactivateDate': '',
        'DeceasedDate': ''
    })

    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();

    // Onload Function
    useEffect(() => {
        getStateList(aId);
        getRaceList();
        getSexList();
        getScreenPermision(aId, pinId)
        getEthnicityList(aId)
        getBloodGroupList(aId)
        // get Hair Color List
        getColorList('1', '0', aId)
        // get Eye Color List
        getColorList('0', '1', aId)
    }, [aId, pinId])

    // Get Effective Screeen Permission
    const getScreenPermision = (aId, pinId) => {
        ScreenPermision("P013", aId, pinId).then(res => {
            if (res) setEffectiveScreenPermission(res)
            else setEffectiveScreenPermission()
        });
    }

    useEffect(() => {
        if (aId && pinId) get_Field_Permision_Classifiation(aId, pinId);
    }, [aId, pinId])

    // Get Effective Field Permission
    const get_Field_Permision_Classifiation = (aId, pinId) => {
        fieldPermision(aId, 'P013', pinId).then(res => {
            if (res) {
                // ------Personnel Characteristics, Date and Number Feild ------ 
                if (Personal_Field_Permistion_Filter(res, "Personnel-Address")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['Address']: Personal_Field_Permistion_Filter(res, "Personnel-Address") } })
                } if (Personal_Field_Permistion_Filter(res, "Personnel-State")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['StateID']: Personal_Field_Permistion_Filter(res, "Personnel-State") } })
                } if (Personal_Field_Permistion_Filter(res, "Personnel-City")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['CityID']: Personal_Field_Permistion_Filter(res, "Personnel-City") } })
                } if (Personal_Field_Permistion_Filter(res, "Personnel-Zip")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['ZipCodeID']: Personal_Field_Permistion_Filter(res, "Personnel-Zip") } })
                } if (Personal_Field_Permistion_Filter(res, "Personnel-SSN")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['SSN']: Personal_Field_Permistion_Filter(res, "Personnel-SSN") } })
                } if (Personal_Field_Permistion_Filter(res, "Personnel-BadgeID")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['BadgeNumber']: Personal_Field_Permistion_Filter(res, "Personnel-BadgeID") } })
                } if (Personal_Field_Permistion_Filter(res, "Personnel-DriversLic_No")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['DriverLicenseNo']: Personal_Field_Permistion_Filter(res, "Personnel-DriversLic_No") } })
                } if (Personal_Field_Permistion_Filter(res, "Personnel-Work")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['WorkPhoneNumber']: Personal_Field_Permistion_Filter(res, "Personnel-Work") } })
                } if (Personal_Field_Permistion_Filter(res, "Personnel-Ext")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['WorkPhone_Ext']: Personal_Field_Permistion_Filter(res, "Personnel-Ext") } })
                } if (Personal_Field_Permistion_Filter(res, "Personnel-Home")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['HomePhoneNumber']: Personal_Field_Permistion_Filter(res, "Personnel-Home") } })
                } if (Personal_Field_Permistion_Filter(res, "Personnel-Cell")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['CellPhoneNumber']: Personal_Field_Permistion_Filter(res, "Personnel-Cell") } })
                } if (Personal_Field_Permistion_Filter(res, "Personnel-HiredDate")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['HiredDate']: Personal_Field_Permistion_Filter(res, "Personnel-HiredDate") } })
                } if (Personal_Field_Permistion_Filter(res, "Personnel-DeactivateDate")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['DeactivateDate']: Personal_Field_Permistion_Filter(res, "Personnel-DeactivateDate") } })
                } if (Personal_Field_Permistion_Filter(res, "Personnel-DOB")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['DateOfBirth']: Personal_Field_Permistion_Filter(res, "Personnel-DOB") } })
                } if (Personal_Field_Permistion_Filter(res, "Personnel-IsDecease")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['IsDecease']: Personal_Field_Permistion_Filter(res, "Personnel-IsDecease") } })
                } if (Personal_Field_Permistion_Filter(res, "Personnel-DeceasedDate")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['DeceasedDate']: Personal_Field_Permistion_Filter(res, "Personnel-DeceasedDate") } })
                } if (Personal_Field_Permistion_Filter(res, "Personnel-Gender")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['SexID']: Personal_Field_Permistion_Filter(res, "Personnel-Gender") } })
                } if (Personal_Field_Permistion_Filter(res, "Personnel-Race")) {
                    setFieldPermisionPersonal(prevValues => { return { ...prevValues, ['RaceID']: Personal_Field_Permistion_Filter(res, "Personnel-Race") } })
                }
            }
        });
    }

    useEffect(() => {
        if (pId) get_Single_PersonnelList(pId)
    }, [pId])

    useEffect(() => {
        if (personnelList) {
            setValue({
                ...value,
                'Address': personnelList[0]?.Address ? personnelList[0]?.Address : '', 'StateID': personnelList[0]?.StateID ? personnelList[0]?.StateID : '', 'CityID': personnelList[0]?.CityID ? personnelList[0]?.CityID : '', 'ZipCodeID': personnelList[0]?.ZipCodeID ? personnelList[0]?.ZipCodeID : '', 'SSN': personnelList[0]?.SSN ? personnelList[0]?.SSN : '', 'BadgeNumber': personnelList[0]?.BadgeNumber ? personnelList[0]?.BadgeNumber : '', 'DriverLicenseNo': personnelList[0]?.DriverLicenseNo ? personnelList[0]?.DriverLicenseNo : '', 'WorkPhoneNumber': personnelList[0]?.WorkPhoneNumber ? personnelList[0]?.WorkPhoneNumber : '', 'WorkPhone_Ext': personnelList[0]?.WorkPhone_Ext ? personnelList[0]?.WorkPhone_Ext : '', 'HomePhoneNumber': personnelList[0]?.HomePhoneNumber ? personnelList[0]?.HomePhoneNumber : '', 'CellPhoneNumber': personnelList[0]?.CellPhoneNumber ? personnelList[0]?.CellPhoneNumber : '',
                'HiredDate': personnelList[0]?.HiredDate != null ?
                    getShowingWithOutTime(personnelList[0]?.HiredDate) === '01/01/1900' ? null : new Date(personnelList[0]?.HiredDate)
                    :
                    '',
                'DeactivateDate': personnelList[0]?.DeactivateDate != null
                    ?
                    getShowingWithOutTime(personnelList[0]?.DeactivateDate) === '01/01/1900' ? '' : new Date(personnelList[0]?.DeactivateDate)
                    :
                    '',
                'DateOfBirth': personnelList[0]?.DateOfBirth != null ?
                    getShowingWithOutTime(personnelList[0]?.DateOfBirth) === '01/01/1900' ? '' : new Date(personnelList[0]?.DateOfBirth)
                    :
                    '',
                'IsDecease': personnelList[0]?.IsDecease,
                'DeceasedDate': personnelList[0]?.DeceasedDate != null ?
                    getShowingWithOutTime(personnelList[0]?.DeceasedDate) === '01/01/1900' ? '' : new Date(personnelList[0]?.DeceasedDate)
                    :
                    '',
                'SexID': personnelList[0]?.SexID ? personnelList[0]?.SexID : '',
                'RaceID': personnelList[0]?.RaceID ? personnelList[0]?.RaceID : '',
                'EthnicityID': personnelList[0]?.EthnicityID ? personnelList[0]?.EthnicityID : '',
                'BloodTypeID': personnelList[0]?.BloodTypeID ? personnelList[0]?.BloodTypeID : '',
                'HairColorID': personnelList[0]?.HairColorID ? personnelList[0]?.HairColorID : '',
                'EyeColorID': personnelList[0]?.EyeColorID ? personnelList[0]?.EyeColorID : '',
                'weight': personnelList[0]?.Weight ? personnelList[0]?.Weight : '',
                'height': personnelList[0]?.Height ? height_Format(personnelList[0]?.Height) : '',
                'PINID': pId, 'StateName': changeArrayFormat_WithFilter(personnelList, 'state'), 'CityName': changeArrayFormat_WithFilter(personnelList, 'city'), 'ZipName': changeArrayFormat_WithFilter(personnelList, 'zip'), 'RaceName': changeArrayFormat_WithFilter(personnelList, 'race'), 'EthnicityName': changeArrayFormat_WithFilter(personnelList, 'ethnicity'), 'BloodTypeName': changeArrayFormat_WithFilter(personnelList, 'blood'), 'EyeColorName': changeArrayFormat_WithFilter(personnelList, 'eye'), 'HairColorName': changeArrayFormat_WithFilter(personnelList, 'hair')
            })
            if (personnelList[0]?.StateID) getCity(personnelList[0]?.StateID)
            if (personnelList[0]?.CityID) getZipCode(personnelList[0]?.CityID)
        }
    }, [personnelList])

    // Check Validation
    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (PhoneField(value.CellPhoneNumber)) {
            setErrors(prevValues => { return { ...prevValues, ['CellPhoneNumber']: PhoneField(value.CellPhoneNumber) } })
        }
        if (PhoneField(value.HomePhoneNumber)) {
            setErrors(prevValues => { return { ...prevValues, ['HomePhoneNumber']: PhoneField(value.HomePhoneNumber) } })
        }
        if (WorkPhone_Ext_Field(value.WorkPhone_Ext)) {
            setErrors(prevValues => { return { ...prevValues, ['WorkPhone_Ext']: WorkPhone_Ext_Field(value.WorkPhone_Ext) } })
        }
        if (PhoneField(value.WorkPhoneNumber)) {
            setErrors(prevValues => { return { ...prevValues, ['WorkPhoneNumber']: PhoneField(value.WorkPhoneNumber) } })
        }
        if (SSN_Field(value.SSN)) {
            setErrors(prevValues => { return { ...prevValues, ['SSN']: SSN_Field(value.SSN) } })
        }
        if (Deactivate_Date_Field(value.DeactivateDate, value.HiredDate)) {
            setErrors(prevValues => { return { ...prevValues, ['DeactivateDate']: Deactivate_Date_Field(value.DeactivateDate, value.HiredDate) } })
        }
        if (value.IsDecease) {
            if (Deceased_Date_Field(value.DeceasedDate, value.HiredDate)) {
                setErrors(prevValues => { return { ...prevValues, ['DeceasedDate']: Deceased_Date_Field(value.DeceasedDate, value.HiredDate) } })
            }
        } else setErrors(prevValues => { return { ...prevValues, ['DeceasedDate']: 'true' } })
    }

    // Check All Field Format is True Then Submit 
    const { WorkPhone_Ext, CellPhoneNumber, HomePhoneNumber, WorkPhoneNumber, SSN, DeactivateDate, DeceasedDate } = errors

    useEffect(() => {
        if (WorkPhone_Ext === 'true' && CellPhoneNumber === 'true' && HomePhoneNumber === 'true' && WorkPhoneNumber === 'true' && SSN === 'true' && DeactivateDate === 'true' && DeceasedDate === 'true') {
            save_Characteristics_Dates();
        }
    }, [WorkPhone_Ext, CellPhoneNumber, HomePhoneNumber, WorkPhoneNumber, SSN, DeactivateDate, DeceasedDate])

    const get_Single_PersonnelList = (pId) => {
        const val = {
            PINID: pId
        }
        fetchPostData('Personnel/GetData_UpdatePersonnel', val)
            .then((res) => {
                if (res) setPersonnelList(res);
                else setPersonnelList();
            })
    }

    // // onChange Hooks Function
    const dateChange = (date, type) => {
        if (type === 'HiredDate') {
            setHiredDate(date); setValue({ ...value, ['HiredDate']: date });

            // Add 1 day to the current date
            // let currentDate = new Date(date);
            // currentDate.setDate(currentDate.getDate() + 1);
            // setModifiedDeactiveDate(currentDate)
            // console.log(currentDate);

        } else if (type === 'DeactivateDate') {
            setDeactivateDate(date); setValue({ ...value, ['DeactivateDate']: date })
        } else if (type === 'DateOfBirth') {
            if (date <= moment(new Date()).subtract(18, 'years')._d) {
                setDateOfBirth(date); setValue({ ...value, ['DateOfBirth']: date })
            }
        } else if (type === 'DeceasedDate') {
            setDeceasedDate(date); setValue({ ...value, ['DeceasedDate']: date })
        }
    }

    const stateChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['StateID']: e.value, ['CityID']: null, ['ZipCodeID']: null,
            })
            getCity(e.value); setZipList([]);
        } else {
            setValue({
                ...value,
                ['StateID']: null, ['CityID']: null, ['ZipCodeID']: null
            })
            setCityList([])
            setZipList([])
        }
    }

    const cityChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['CityID']: e.value, ['ZipCodeID']: null,
            })
            getZipCode(e.value);
        } else {
            setValue({
                ...value,
                ['CityID']: null, ['ZipCodeID']: null,
            });
            setZipList([]);
        }
    }

    const zipChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['ZipCodeID']: e.value, ['ZipName']: { value: e.value, label: e.label }
            });
        } else {
            setValue({
                ...value,
                ['ZipCodeID']: null
            });
        }
    }

    const raceChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['RaceID']: e.value
            })
        } else {
            setValue({
                ...value,
                ['RaceID']: null
            })
        }

    }

    const sexChanges = (e) => {
        setValue({
            ...value,
            ['SexID']: e.value
        })
    }

    const ethincityChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['EthnicityID']: e.value
            })
        } else {
            setValue({
                ...value,
                ['EthnicityID']: null
            })
        }
    }

    const bloodTypeChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['BloodTypeID']: e.value
            })
        } else {
            setValue({
                ...value,
                ['BloodTypeID']: null
            })
        }
    }

    const hairColorChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['HairColorID']: e.value
            })
        } else {
            setValue({
                ...value,
                ['HairColorID']: null
            })
        }
    }

    const eyeColorChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['EyeColorID']: e.value
            })
        } else {
            setValue({
                ...value,
                ['EyeColorID']: null
            })
        }
    }

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
            startRef3.current.setOpen(false);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'IsDecease') {
            setValue({ ...value, [e.target.name]: e.target.checked, ['DeceasedDate']: "" });
            setDeceasedDate(null)
        } else if (e.target.name === 'WorkPhoneNumber' || e.target.name === 'CellPhoneNumber' || e.target.name === 'HomePhoneNumber') {
            var ele = e.target.value.replace(/\D/g, null);
            if (ele.length === 10) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                    })
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/\D/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else if (e.target.name === 'SSN' || e.target.name === 'WorkPhone_Ext') {
            var ele = e.target.value;
            if (ele.length === 9) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
                if (match) {
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                    })
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/\D/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else if (e.target.name === 'height') {
            var ele = e.target.value
            if (ele.length === 3) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var HeightFromVal = value?.HeightFrom.split("'").join('').replace(/\D/g, '');
                var match = cleaned.match(/^(\d{1})(\d{2})$/);
                if (parseInt(HeightFromVal) < parseInt(cleaned)) {
                    if (parseInt(match[2]) < 12) {
                        setValue({
                            ...value,
                            [e.target.name]: match[1] + "'" + match[2] + "'"
                        })
                    } else {
                        setValue({
                            ...value,
                            [e.target.name]: match[1] + "'" + "11" + "'"
                        })
                    }
                }
            } else {
                ele = e.target.value.split("'").join('').replace(/\D/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else if (e.target.name === 'weight') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setValue({ ...value, [e.target.name]: checkNumber })
        }
        else setValue({ ...value, [e.target.name]: e.target.value })
    }

    const height_Format = (val) => {
        var cleaned = ('' + val).replace(/\D/g, '');
        var match = cleaned.match(/^(\d{1})(\d{2})$/);
        if (match) {
            var result = match[1] + "'" + match[2] + '"'
        }
        return result
    }

    // Get state, city, zip, Race and Sex List 
    const getStateList = async () => {
        fetchData("State_City_ZipCode/GetData_State")
            .then(response => {
                if (response) setStateList(changeArrayFormat(response, 'state'))
                else setStateList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const getCity = async (stateID) => {
        const val = {
            StateID: stateID
        }
        fetchPostData("State_City_ZipCode/GetData_City", val)
            .then(res => {
                if (res) setCityList(changeArrayFormat(res, 'city'))
                else setCityList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const getZipCode = async (cityID) => {
        const val = {
            CityId: cityID
        }
        fetchPostData("State_City_ZipCode/GetData_ZipCode", val)
            .then(res => {
                if (res) setZipList(changeArrayFormat(res, 'zip'))
                else setZipList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const getRaceList = async (aId) => {
        const val = {
            AgencyId: aId
        }
        fetchPostData("DropDown/GetData_RaceType", val)
            .then(response => {
                if (response) setRaceList(changeArrayFormat(response, 'race'))
                else setRaceList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const getEthnicityList = async (aId) => {
        const val = {
            Agencyid: aId
        }
        fetchPostData("DropDown/GetDataDropDown_Ethnicity", val)
            .then(response => {
                if (response) setEthincityList(changeArrayFormat(response, 'ethnicity'))
                else setEthincityList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const getBloodGroupList = async (aId) => {
        const val = {
            Agencyid: aId
        }
        fetchPostData("DropDown/GetData_DropDown_BloodType", val)
            .then(response => {
                if (response) setBloodGroupList(changeArrayFormat(response, 'blood'))
                else setBloodGroupList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const getColorList = async (isHair, isEye, aId) => {
        const val = {
            Agencyid: aId,
            IsHair: isHair,
            IsEye: isEye
        }
        fetchPostData("DropDown/GetData_DropDown_Color", val)
            .then(response => {
                if (response) {
                    if (isHair === '1') {
                        setHairList(changeArrayFormat(response, 'eye'))
                    } else if (isEye === '1') {
                        setEyeList(changeArrayFormat(response, 'eye'))
                    }
                }
                else {
                    if (isHair === '1') {
                        setHairList()
                    } else if (isEye === '1') {
                        setEyeList()
                    }
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const getSexList = async () => {
        fetchData("DropDown/GetData_SexType")
            .then(response => {
                if (response) setSexList(response)
                else setSexList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    // Save data in List
    const save_Characteristics_Dates = () => {
        const { Address, StateID, CityID, ZipCodeID, SSN, BadgeNumber, DriverLicenseNo, WorkPhoneNumber, WorkPhone_Ext, HomePhoneNumber, CellPhoneNumber, IsDecease, SexID, RaceID, ModifiedByUserFK, PINID, DeactivateDate, DateOfBirth, DeceasedDate, HiredDate, EthnicityID, height, weight, BloodTypeID, EyeColorID, HairColorID } = value
        const val = {
            'Address': Address, 'StateID': StateID, 'CityID': CityID, 'ZipCodeID': ZipCodeID, 'SSN': SSN, 'BadgeNumber': BadgeNumber, 'DriverLicenseNo': DriverLicenseNo, 'WorkPhoneNumber': WorkPhoneNumber, 'WorkPhone_Ext': WorkPhone_Ext, 'HomePhoneNumber': HomePhoneNumber, 'CellPhoneNumber': CellPhoneNumber, 'HiredDate': hiredDate ? getShowingYearMonthDate(hiredDate) : HiredDate, 'DeactivateDate': deactivateDate ? getShowingYearMonthDate(deactivateDate) : DeactivateDate, 'DateOfBirth': dateOfBirth ? getShowingYearMonthDate(dateOfBirth) : DateOfBirth, 'IsDecease': IsDecease, 'DeceasedDate': deceasedDate ? getShowingYearMonthDate(deceasedDate) : DeceasedDate, 'SexID': SexID, 'RaceID': RaceID, 'EthnicityID': EthnicityID, 'Height': height, 'Weight': weight, 'BloodTypeID': BloodTypeID, 'HairColorID': HairColorID, 'EyeColorID': EyeColorID, 'ModifiedByUserFK': ModifiedByUserFK, 'PINID': PINID,
        }
        AddDeleteUpadate('Personnel/UpdateCharactersticPersonnel', val)
            .then((res) => {
                if (res.success === true) {
                    toastifySuccess(res.Message)
                    setErrors({
                        ...errors, ['WorkPhoneNumber']: 'false', ['WorkPhone_Ext']: 'false', ['HomePhoneNumber']: 'false', ['CellPhoneNumber']: 'false'
                    })
                    get_Single_PersonnelList(pId);
                }
            })
    }

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
        // option: (styles, { isFocused }) => {
        //     return {
        //         ...styles,
        //         backgroundColor: isFocused ? "#e0ebf3" : null,
        //         color: "#333333"
        //     };
        // }
    };

    const checkHandlChange = (e) => {
        if (e.target.name === 'height') {
            var ele = e.target.value
            // console.log(ele.length)
            if (ele.length === 3) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var HeightFromVal = value?.height.split("'").join('').replace(/\D/g, '');
                var match = cleaned.match(/^(\d{1})(\d{2})$/);
                if (parseInt(HeightFromVal) < parseInt(cleaned)) {
                    if (parseInt(match[2]) < 12) {
                        setValue({
                            ...value,
                            [e.target.name]: match[1] + "'" + match[2] + "'"
                        })
                    } else {
                        setValue({
                            ...value,
                            [e.target.name]: match[1] + "'" + "11" + "'"
                        })
                    }
                }
            } else {
                ele = e.target.value.split("'").join('').replace(/\D/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-12 " id='display-not-form'>
                    {
                        EffectiveScreenPermission ?
                            <>
                                <div className="row">
                                    <div className="col-12 col-md-12 col-lg-12 mt-3">
                                        <div className="bg-line  cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Address</p>
                                        </div>
                                        {/* <fieldset style={{ border: '1px solid #8080808c' }}>
                                            <legend style={{ color: '#274c77' }}>Address</legend> */}
                                        {/* <label>Address</label> */}
                                        <div className="row mt-2">
                                            <div className="col-6">
                                                <div class="text-field">
                                                    <input type="text" name='Address'
                                                        value={value.Address}
                                                        className={fieldPermisionPersonal?.Address[0] ?
                                                            fieldPermisionPersonal?.Address[0]?.Changeok === 0 && fieldPermisionPersonal?.Address[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionPersonal?.Address[0]?.Changeok === 0 && fieldPermisionPersonal?.Address[0]?.AddOK === 1 && personnelList[0]?.Address === '' && status ? '' : fieldPermisionPersonal?.Address[0]?.AddOK === 1 && !status ? '' : fieldPermisionPersonal?.Address[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''
                                                        }
                                                        onChange={fieldPermisionPersonal?.Address[0] ?
                                                            fieldPermisionPersonal?.Address[0]?.Changeok === 0 && fieldPermisionPersonal?.Address[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.Address[0]?.Changeok === 0 && fieldPermisionPersonal?.Address[0]?.AddOK === 1 && personnelList[0]?.Address === '' && status ? handleChange : fieldPermisionPersonal?.Address[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionPersonal?.Address[0]?.Changeok === 1 && status ? handleChange : '' : handleChange
                                                        }
                                                        required />
                                                    <label>Address</label>
                                                </div>
                                            </div>
                                            <div className="col-12 ">
                                                <div className="row mt-2">
                                                    <div className="col-4 col-md-4 col-lg-4 mt-4 dropdown__box">
                                                        <Select
                                                            value={stateList?.filter((obj) => obj.value === value?.StateID)}
                                                            name='StateID'
                                                            styles={customStylesWithOutColor}
                                                            options={stateList}
                                                            isClearable
                                                            onChange={fieldPermisionPersonal?.StateID[0] ?
                                                                fieldPermisionPersonal?.StateID[0]?.Changeok === 0 && fieldPermisionPersonal?.StateID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.StateID[0]?.Changeok === 0 && fieldPermisionPersonal?.StateID[0]?.AddOK === 1 && personnelList[0]?.StateID === '' ? stateChanges : fieldPermisionPersonal?.StateID[0]?.AddOK === 1 && !status ? stateChanges : fieldPermisionPersonal?.StateID[0]?.Changeok === 1 && status ? stateChanges : '' : stateChanges
                                                            }
                                                            isDisabled={fieldPermisionPersonal?.StateID[0] ?
                                                                fieldPermisionPersonal?.StateID[0]?.Changeok === 0 && fieldPermisionPersonal?.StateID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.StateID[0]?.Changeok === 0 && fieldPermisionPersonal?.StateID[0]?.AddOK === 1 && personnelList[0]?.StateID === '' ? false : fieldPermisionPersonal?.StateID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.StateID[0]?.Changeok === 1 ? false : true : false
                                                            }
                                                        />
                                                        {/* {
                                                            value?.StateName ?
                                                                <Select
                                                                    name='StateID'
                                                                    styles={customStylesWithOutColor}
                                                                    options={stateList}
                                                                    isClearable
                                                                    defaultValue={value?.StateName}
                                                                    onChange={fieldPermisionPersonal?.StateID[0] ?
                                                                        fieldPermisionPersonal?.StateID[0]?.Changeok === 0 && fieldPermisionPersonal?.StateID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.StateID[0]?.Changeok === 0 && fieldPermisionPersonal?.StateID[0]?.AddOK === 1 && personnelList[0]?.StateID === '' ? stateChanges : fieldPermisionPersonal?.StateID[0]?.AddOK === 1 && !status ? stateChanges : fieldPermisionPersonal?.StateID[0]?.Changeok === 1 && status ? stateChanges : '' : stateChanges
                                                                    }
                                                                    isDisabled={fieldPermisionPersonal?.StateID[0] ?
                                                                        fieldPermisionPersonal?.StateID[0]?.Changeok === 0 && fieldPermisionPersonal?.StateID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.StateID[0]?.Changeok === 0 && fieldPermisionPersonal?.StateID[0]?.AddOK === 1 && personnelList[0]?.StateID === '' ? false : fieldPermisionPersonal?.StateID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.StateID[0]?.Changeok === 1 ? false : true : false
                                                                    }
                                                                />
                                                                : <>
                                                                    <Select
                                                                        name='StateID'
                                                                        styles={customStylesWithOutColor}
                                                                        options={stateList}
                                                                        isClearable
                                                                        onChange={fieldPermisionPersonal?.StateID[0] ?
                                                                            fieldPermisionPersonal?.StateID[0]?.Changeok === 0 && fieldPermisionPersonal?.StateID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.StateID[0]?.Changeok === 0 && fieldPermisionPersonal?.StateID[0]?.AddOK === 1 && personnelList[0]?.StateID === '' ? stateChanges : fieldPermisionPersonal?.StateID[0]?.AddOK === 1 && !status ? stateChanges : fieldPermisionPersonal?.StateID[0]?.Changeok === 1 && status ? stateChanges : '' : stateChanges
                                                                        }
                                                                        isDisabled={fieldPermisionPersonal?.StateID[0] ?
                                                                            fieldPermisionPersonal?.StateID[0]?.Changeok === 0 && fieldPermisionPersonal?.StateID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.StateID[0]?.Changeok === 0 && fieldPermisionPersonal?.StateID[0]?.AddOK === 1 && personnelList[0]?.StateID === '' ? false : fieldPermisionPersonal?.StateID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.StateID[0]?.Changeok === 1 ? false : true : false
                                                                        }
                                                                    /></>
                                                        } */}
                                                        <label htmlFor="">State</label>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-4 mt-4 dropdown__box">
                                                        <Select
                                                            value={cityList?.filter((obj) => obj.value === value?.CityID)}
                                                            name='CityID'
                                                            styles={customStylesWithOutColor}
                                                            isClearable
                                                            onChange={fieldPermisionPersonal?.CityID[0] ?
                                                                fieldPermisionPersonal?.CityID[0]?.Changeok === 0 && fieldPermisionPersonal?.CityID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.CityID[0]?.Changeok === 0 && fieldPermisionPersonal?.CityID[0]?.AddOK === 1 && personnelList[0]?.CityID === '' ? cityChanges : fieldPermisionPersonal?.CityID[0]?.AddOK === 1 && !status ? cityChanges : fieldPermisionPersonal?.CityID[0]?.Changeok === 1 && status ? cityChanges : '' : cityChanges
                                                            }
                                                            isDisabled={fieldPermisionPersonal?.CityID[0] ?
                                                                fieldPermisionPersonal?.CityID[0]?.Changeok === 0 && fieldPermisionPersonal?.CityID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.CityID[0]?.Changeok === 0 && fieldPermisionPersonal?.CityID[0]?.AddOK === 1 && personnelList[0]?.CityID === '' ? false : fieldPermisionPersonal?.CityID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.CityID[0]?.Changeok === 1 && status ? false : true : false
                                                            }
                                                            options={cityList}
                                                        />
                                                        <label htmlFor="">City</label>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-3 mt-4 dropdown__box">
                                                        <Select
                                                            name='ZipCodeID'
                                                            value={zipList?.filter((obj) => obj.value === value?.ZipCodeID)}
                                                            styles={customStylesWithOutColor}
                                                            options={zipList}
                                                            isClearable
                                                            onChange={fieldPermisionPersonal?.ZipCodeID[0] ?
                                                                fieldPermisionPersonal?.ZipCodeID[0]?.Changeok === 0 && fieldPermisionPersonal?.ZipCodeID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.ZipCodeID[0]?.Changeok === 0 && fieldPermisionPersonal?.ZipCodeID[0]?.AddOK === 1 && personnelList[0]?.ZipCodeID === '' ? zipChanges : fieldPermisionPersonal?.ZipCodeID[0]?.AddOK === 1 && !status ? zipChanges : fieldPermisionPersonal?.ZipCodeID[0]?.Changeok === 1 ? zipChanges : '' : zipChanges
                                                            }
                                                            isDisabled={fieldPermisionPersonal?.ZipCodeID[0] ?
                                                                fieldPermisionPersonal?.ZipCodeID[0]?.Changeok === 0 && fieldPermisionPersonal?.ZipCodeID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.ZipCodeID[0]?.Changeok === 0 && fieldPermisionPersonal?.ZipCodeID[0]?.AddOK === 1 && personnelList[0]?.ZipCodeID === '' ? false : fieldPermisionPersonal?.ZipCodeID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.ZipCodeID[0]?.Changeok === 1 ? false : true : false
                                                            }
                                                        />
                                                        <label htmlFor="">Zip</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* </fieldset> */}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-md-12 col-lg-6 mt-2">
                                        <div className="bg-line  cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Phone Number</p>
                                        </div>
                                        {/* <fieldset style={{ border: '1px solid #8080808c' }}>
                                            <legend style={{ color: '#274c77' }}>Phone Number</legend> */}
                                        <div className="row mt-1">
                                            <div className="col-6 col-md-4 col-lg-3 mt-2">
                                                <div class="text-field">
                                                    <input type="text" maxLength='10' name='WorkPhoneNumber' value={value.WorkPhoneNumber}
                                                        className={fieldPermisionPersonal?.WorkPhoneNumber[0] ?
                                                            fieldPermisionPersonal?.WorkPhoneNumber[0]?.Changeok === 0 && fieldPermisionPersonal?.WorkPhoneNumber[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionPersonal?.WorkPhoneNumber[0]?.Changeok === 0 && fieldPermisionPersonal?.WorkPhoneNumber[0]?.AddOK === 1 && personnelList[0]?.WorkPhoneNumber === '' && status ? '' : fieldPermisionPersonal?.WorkPhoneNumber[0]?.AddOK === 1 && !status ? '' : fieldPermisionPersonal?.WorkPhoneNumber[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''
                                                        }
                                                        onChange={fieldPermisionPersonal?.WorkPhoneNumber[0] ?
                                                            fieldPermisionPersonal?.WorkPhoneNumber[0]?.Changeok === 0 && fieldPermisionPersonal?.WorkPhoneNumber[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.WorkPhoneNumber[0]?.Changeok === 0 && fieldPermisionPersonal?.WorkPhoneNumber[0]?.AddOK === 1 && personnelList[0]?.WorkPhoneNumber === '' && status ? handleChange : fieldPermisionPersonal?.WorkPhoneNumber[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionPersonal?.WorkPhoneNumber[0]?.Changeok === 1 && status ? handleChange : '' : handleChange
                                                        }
                                                        required />
                                                    <label>Work</label>
                                                    {errors.WorkPhoneNumber !== 'true' && errors.WorkPhoneNumber !== 'false' ? (
                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.WorkPhoneNumber}</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-2 col-lg-2 mt-2">
                                                <div class="text-field">
                                                    <input type="text" maxLength='3' name='WorkPhone_Ext' value={value.WorkPhone_Ext}
                                                        className={fieldPermisionPersonal?.WorkPhone_Ext[0] ?
                                                            fieldPermisionPersonal?.WorkPhone_Ext[0]?.Changeok === 0 && fieldPermisionPersonal?.WorkPhone_Ext[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionPersonal?.WorkPhone_Ext[0]?.Changeok === 0 && fieldPermisionPersonal?.WorkPhone_Ext[0]?.AddOK === 1 && personnelList[0]?.WorkPhone_Ext === '' && status ? '' : fieldPermisionPersonal?.WorkPhone_Ext[0]?.AddOK === 1 && !status ? '' : fieldPermisionPersonal?.WorkPhone_Ext[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''
                                                        }
                                                        onChange={fieldPermisionPersonal?.WorkPhone_Ext[0] ?
                                                            fieldPermisionPersonal?.WorkPhone_Ext[0]?.Changeok === 0 && fieldPermisionPersonal?.WorkPhone_Ext[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.WorkPhone_Ext[0]?.Changeok === 0 && fieldPermisionPersonal?.WorkPhone_Ext[0]?.AddOK === 1 && personnelList[0]?.WorkPhone_Ext === '' && status ? handleChange : fieldPermisionPersonal?.WorkPhone_Ext[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionPersonal?.WorkPhone_Ext[0]?.Changeok === 1 && status ? handleChange : '' : handleChange
                                                        }
                                                        required />
                                                    <label>Ext</label>
                                                    {errors.WorkPhone_Ext !== 'true' && errors.WorkPhone_Ext !== 'false' ? (
                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.WorkPhone_Ext}</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-3 col-lg-4 mt-2 ">
                                                <div class="text-field">
                                                    <input type="text" maxLength='10' name='HomePhoneNumber' value={value.HomePhoneNumber}
                                                        className={fieldPermisionPersonal?.HomePhoneNumber[0] ?
                                                            fieldPermisionPersonal?.HomePhoneNumber[0]?.Changeok === 0 && fieldPermisionPersonal?.HomePhoneNumber[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionPersonal?.HomePhoneNumber[0]?.Changeok === 0 && fieldPermisionPersonal?.HomePhoneNumber[0]?.AddOK === 1 && personnelList[0]?.HomePhoneNumber === '' && status ? '' : fieldPermisionPersonal?.HomePhoneNumber[0]?.AddOK === 1 && !status ? '' : fieldPermisionPersonal?.HomePhoneNumber[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''
                                                        }
                                                        onChange={fieldPermisionPersonal?.HomePhoneNumber[0] ?
                                                            fieldPermisionPersonal?.HomePhoneNumber[0]?.Changeok === 0 && fieldPermisionPersonal?.HomePhoneNumber[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.HomePhoneNumber[0]?.Changeok === 0 && fieldPermisionPersonal?.HomePhoneNumber[0]?.AddOK === 1 && personnelList[0]?.HomePhoneNumber === '' && status ? handleChange : fieldPermisionPersonal?.HomePhoneNumber[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionPersonal?.HomePhoneNumber[0]?.Changeok === 1 && status ? handleChange : '' : handleChange
                                                        } required />
                                                    <label>Home</label>
                                                    {errors.HomePhoneNumber !== 'true' && errors.HomePhoneNumber !== 'false' ? (
                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.HomePhoneNumber}</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-3 col-lg-3 mt-2">
                                                <div class="text-field">
                                                    <input type="text" maxLength='10' name='CellPhoneNumber' value={value.CellPhoneNumber}
                                                        className={fieldPermisionPersonal?.CellPhoneNumber[0] ?
                                                            fieldPermisionPersonal?.CellPhoneNumber[0]?.Changeok === 0 && fieldPermisionPersonal?.CellPhoneNumber[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionPersonal?.CellPhoneNumber[0]?.Changeok === 0 && fieldPermisionPersonal?.CellPhoneNumber[0]?.AddOK === 1 && personnelList[0]?.CellPhoneNumber === '' && status ? '' : fieldPermisionPersonal?.CellPhoneNumber[0]?.AddOK === 1 && !status ? '' : fieldPermisionPersonal?.CellPhoneNumber[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''
                                                        }
                                                        onChange={fieldPermisionPersonal?.CellPhoneNumber[0] ?
                                                            fieldPermisionPersonal?.CellPhoneNumber[0]?.Changeok === 0 && fieldPermisionPersonal?.CellPhoneNumber[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.CellPhoneNumber[0]?.Changeok === 0 && fieldPermisionPersonal?.CellPhoneNumber[0]?.AddOK === 1 && personnelList[0]?.CellPhoneNumber === '' && status ? handleChange : fieldPermisionPersonal?.CellPhoneNumber[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionPersonal?.CellPhoneNumber[0]?.Changeok === 1 && status ? handleChange : '' : handleChange
                                                        }
                                                        required />
                                                    <label>Cell</label>
                                                    {errors.CellPhoneNumber !== 'true' && errors.CellPhoneNumber !== 'false' ? (
                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CellPhoneNumber}</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                        {/* </fieldset> */}
                                    </div>
                                    <div className="col-12 col-md-12 col-lg-6 mt-2">
                                        <div className="bg-line cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center ">Identification Number</p>
                                        </div>
                                        {/* <fieldset style={{ border: '1px solid #8080808c' }}>
                                            <legend style={{ color: '#274c77' }}>Identification Number</legend> */}
                                        <div className="row mt-2">
                                            <div className="col-4 col-md-4 col-lg-4 mt-1">
                                                <div class="text-field">
                                                    <input type="text" maxLength='9' name='SSN' value={value.SSN}
                                                        className={fieldPermisionPersonal?.SSN[0] ?
                                                            fieldPermisionPersonal?.SSN[0]?.Changeok === 0 && fieldPermisionPersonal?.SSN[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionPersonal?.SSN[0]?.Changeok === 0 && fieldPermisionPersonal?.SSN[0]?.AddOK === 1 && personnelList[0]?.SSN === '' && status ? '' : fieldPermisionPersonal?.SSN[0]?.AddOK === 1 && !status ? '' : fieldPermisionPersonal?.SSN[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''
                                                        }
                                                        onChange={fieldPermisionPersonal?.SSN[0] ?
                                                            fieldPermisionPersonal?.SSN[0]?.Changeok === 0 && fieldPermisionPersonal?.SSN[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.SSN[0]?.Changeok === 0 && fieldPermisionPersonal?.SSN[0]?.AddOK === 1 && personnelList[0]?.SSN === '' && status ? handleChange : fieldPermisionPersonal?.SSN[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionPersonal?.SSN[0]?.Changeok === 1 && status ? handleChange : '' : handleChange
                                                        }
                                                        required />
                                                    <label>SSN</label>
                                                    {errors.SSN !== 'true' ? (
                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.SSN}</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-4 mt-1">
                                                <div class="text-field">
                                                    <input type="text" name='BadgeNumber' value={value.BadgeNumber}
                                                        className={fieldPermisionPersonal?.BadgeNumber[0] ?
                                                            fieldPermisionPersonal?.BadgeNumber[0]?.Changeok === 0 && fieldPermisionPersonal?.BadgeNumber[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionPersonal?.BadgeNumber[0]?.Changeok === 0 && fieldPermisionPersonal?.BadgeNumber[0]?.AddOK === 1 && personnelList[0]?.BadgeNumber === '' && status ? '' : fieldPermisionPersonal?.BadgeNumber[0]?.AddOK === 1 && !status ? '' : fieldPermisionPersonal?.BadgeNumber[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''
                                                        }
                                                        onChange={fieldPermisionPersonal?.BadgeNumber[0] ?
                                                            fieldPermisionPersonal?.BadgeNumber[0]?.Changeok === 0 && fieldPermisionPersonal?.BadgeNumber[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.BadgeNumber[0]?.Changeok === 0 && fieldPermisionPersonal?.BadgeNumber[0]?.AddOK === 1 && personnelList[0]?.BadgeNumber === '' && status ? handleChange : fieldPermisionPersonal?.BadgeNumber[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionPersonal?.BadgeNumber[0]?.Changeok === 1 && status ? handleChange : '' : handleChange
                                                        } required />
                                                    <label>Badge Id</label>
                                                </div>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-4 mt-1">
                                                <div class="text-field">
                                                    <input type="text" name='DriverLicenseNo' maxLength='14' value={value.DriverLicenseNo}
                                                        className={fieldPermisionPersonal?.DriverLicenseNo[0] ?
                                                            fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 0 && fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 0 && fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 1 && personnelList[0]?.DriverLicenseNo === '' && status ? '' : fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 1 && !status ? '' : fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''
                                                        }
                                                        onChange={fieldPermisionPersonal?.DriverLicenseNo[0] ?
                                                            fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 0 && fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 0 && fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 1 && personnelList[0]?.DriverLicenseNo === '' && status ? handleChange : fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 1 && status ? handleChange : '' : ''
                                                        } required />
                                                    <label>Driver's Lic.No</label>
                                                </div>
                                            </div>
                                        </div>
                                        {/* </fieldset> */}
                                    </div>
                                    <div className="col-12 col-md-12 col-lg-12 mt-1">
                                        <div className="bg-line  cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Dates</p>
                                        </div>
                                        {/* <fieldset style={{ border: '1px solid #8080808c' }}>
                                            <legend style={{ color: '#274c77' }}>Dates</legend> */}
                                        <div className="row mt-2">
                                            <div className="col-6 col-md-3 col-lg-2 date__box">
                                                <DatePicker
                                                    ref={startRef}
                                                    autoComplete='off'
                                                    onKeyDown={onKeyDown}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    name='HiredDate'
                                                    peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    minDate={new Date(dobHireDate)}
                                                    maxDate={new Date()}
                                                    isClearable={true}
                                                    onChange={date => fieldPermisionPersonal?.HiredDate[0] ?
                                                        fieldPermisionPersonal?.HiredDate[0]?.Changeok === 0 && fieldPermisionPersonal?.HiredDate[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.HiredDate[0]?.Changeok === 0 && fieldPermisionPersonal?.HiredDate[0]?.AddOK === 1 && personnelList?.HiredDate === '' && status ? dateChange(date, 'HiredDate') : fieldPermisionPersonal?.HiredDate[0]?.AddOK === 1 && !status ? dateChange(date, 'HiredDate') : fieldPermisionPersonal?.HiredDate[0]?.Changeok === 1 && status ? dateChange(date, 'HiredDate') : '' : dateChange(date, 'HiredDate')
                                                    }
                                                    disabled={fieldPermisionPersonal?.HiredDate[0] ?
                                                        fieldPermisionPersonal?.HiredDate[0]?.Changeok === 0 && fieldPermisionPersonal?.HiredDate[0]?.AddOK === 0 && status ? true : fieldPermisionPersonal?.HiredDate[0]?.Changeok === 0 && fieldPermisionPersonal?.HiredDate[0]?.AddOK === 1 && personnelList?.HiredDate === '' && status ? false : fieldPermisionPersonal?.HiredDate[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.HiredDate[0]?.Changeok === 1 && status ? false : true : false
                                                    }
                                                    selected={value.HiredDate}
                                                    placeholderText={'Select ..'}
                                                // showTimeInput
                                                />
                                                <div>
                                                    <label htmlFor="">Hired Date</label>
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-3 col-lg-2  date__box">
                                                <DatePicker
                                                    ref={startRef1}
                                                    onKeyDown={onKeyDown}
                                                    autoComplete='off'
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    name='DeactivateDate'
                                                    isClearable={true}
                                                    peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    maxDate={new Date()}
                                                    minDate={new Date(value?.HiredDate)}
                                                    // minDate={modifiedDeactiveDate}
                                                    onChange={date => fieldPermisionPersonal?.DeactivateDate[0] ?
                                                        fieldPermisionPersonal?.DeactivateDate[0]?.Changeok === 0 && fieldPermisionPersonal?.DeactivateDate[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.DeactivateDate[0]?.Changeok === 0 && fieldPermisionPersonal?.DeactivateDate[0]?.AddOK === 1 && personnelList?.DeactivateDate === '' && status ? dateChange(date, 'DeactivateDate') : fieldPermisionPersonal?.DeactivateDate[0]?.AddOK === 1 && !status ? dateChange(date, 'DeactivateDate') : fieldPermisionPersonal?.DeactivateDate[0]?.Changeok === 1 && status ? dateChange(date, 'DeactivateDate') : '' : dateChange(date, 'DeactivateDate')
                                                    }
                                                    disabled={fieldPermisionPersonal?.DeactivateDate[0] ?
                                                        fieldPermisionPersonal?.DeactivateDate[0]?.Changeok === 0 && fieldPermisionPersonal?.DeactivateDate[0]?.AddOK === 0 && status ? true : fieldPermisionPersonal?.DeactivateDate[0]?.Changeok === 0 && fieldPermisionPersonal?.DeactivateDate[0]?.AddOK === 1 && personnelList?.DeactivateDate === '' && status ? false : fieldPermisionPersonal?.DeactivateDate[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.DeactivateDate[0]?.Changeok === 1 && status ? false : true : false
                                                    }
                                                    // onChange={(date) => {  }}
                                                    selected={value?.DeactivateDate}
                                                    placeholderText={'Select ..'}
                                                // showTimeInput
                                                />
                                                <div>
                                                    <label htmlFor="">Deactivate Date</label>
                                                </div>
                                                {errors.DeactivateDate !== 'true' && errors.DeactivateDate !== 'false' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DeactivateDate}</span>
                                                ) : null}
                                            </div>
                                            {/* <div className="col-4 col-md-4 col-lg-4  dropdown__box">
                                                    <DatePicker
                                                        ref={startRef2}
                                                        onKeyDown={onKeyDown}
                                                        dateFormat="MM/dd/yyyy"
                                                        timeInputLabel
                                                        name='DateOfBirth'
                                                        isClearable={true}
                                                        onChange={date => fieldPermisionPersonal?.DateOfBirth[0] ?
                                                            fieldPermisionPersonal?.DateOfBirth[0]?.Changeok === 0 && fieldPermisionPersonal?.DateOfBirth[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.DateOfBirth[0]?.Changeok === 0 && fieldPermisionPersonal?.DateOfBirth[0]?.AddOK === 1 && personnelList?.DateOfBirth === '' && status ? dateChange(date, 'DateOfBirth') : fieldPermisionPersonal?.DateOfBirth[0]?.AddOK === 1 && !status ? dateChange(date, 'DateOfBirth') : fieldPermisionPersonal?.DateOfBirth[0]?.Changeok === 1 && status ? dateChange(date, 'DateOfBirth') : '' : dateChange(date, 'DateOfBirth')
                                                        }
                                                        disabled={fieldPermisionPersonal?.DateOfBirth[0] ?
                                                            fieldPermisionPersonal?.DateOfBirth[0]?.Changeok === 0 && fieldPermisionPersonal?.DateOfBirth[0]?.AddOK === 0 && status ? true : fieldPermisionPersonal?.DateOfBirth[0]?.Changeok === 0 && fieldPermisionPersonal?.DateOfBirth[0]?.AddOK === 1 && personnelList?.DateOfBirth === '' && status ? false : fieldPermisionPersonal?.DateOfBirth[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.DateOfBirth[0]?.Changeok === 1 && status ? false : true : false
                                                        }
                                                        selected={dateOfBirth}
                                                        // maxDate={new Date()}
                                                        // maxDate={moment().subtract(18, 'years')._d}
                                                        // showDisabledMonthNavigation
                                                        placeholderText={value.DateOfBirth ? value.DateOfBirth : 'Select ..'}
                                                    // showTimeInput
                                                    />
                                                    <div>
                                                        <label htmlFor="">Date Of Birth</label>
                                                    </div>
                                                </div> */}
                                            <div className="col-6 col-md-3 col-lg-2 mt-3 text-center">
                                                <input type="checkbox" name='IsDecease'
                                                    checked={value.IsDecease}
                                                    value={value.IsDecease}
                                                    onChange={fieldPermisionPersonal?.IsDecease[0] ?
                                                        fieldPermisionPersonal?.IsDecease[0]?.Changeok === 0 && fieldPermisionPersonal?.IsDecease[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.IsDecease[0]?.Changeok === 0 && fieldPermisionPersonal?.IsDecease[0]?.AddOK === 1 && personnelList[0]?.IsDecease === '' ? handleChange : fieldPermisionPersonal?.IsDecease[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionPersonal?.IsDecease[0]?.Changeok === 1 ? handleChange : '' : handleChange
                                                    }
                                                    disabled={fieldPermisionPersonal?.IsDecease[0] ?
                                                        fieldPermisionPersonal?.IsDecease[0]?.Changeok === 0 && fieldPermisionPersonal?.IsDecease[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.IsDecease[0]?.Changeok === 0 && fieldPermisionPersonal?.IsDecease[0]?.AddOK === 1 && personnelList[0]?.IsDecease === '' ? false : fieldPermisionPersonal?.IsDecease[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.IsDecease[0]?.Changeok === 1 ? false : true : false
                                                    }
                                                />
                                                <label className='ml-2'>Is Decease</label>
                                            </div>
                                            <div className="col-6 col-md-3 col-lg-2 date__box">
                                                <DatePicker
                                                    ref={startRef2}
                                                    onKeyDown={onKeyDown}
                                                    autoComplete='off'
                                                    readOnly={!value.IsDecease}
                                                    dateFormat="MM/dd/yyyy "
                                                    isClearable={true}
                                                    timeInputLabel
                                                    peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    name='DeceasedDate'
                                                    maxDate={new Date()}
                                                    minDate={new Date(value?.HiredDate)}
                                                    onChange={date => fieldPermisionPersonal?.DeceasedDate[0] ?
                                                        fieldPermisionPersonal?.DeceasedDate[0]?.Changeok === 0 && fieldPermisionPersonal?.DeceasedDate[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.DeceasedDate[0]?.Changeok === 0 && fieldPermisionPersonal?.DeceasedDate[0]?.AddOK === 1 && personnelList?.DeceasedDate === '' && status ? dateChange(date, 'DeceasedDate') : fieldPermisionPersonal?.DeceasedDate[0]?.AddOK === 1 && !status ? dateChange(date, 'DeceasedDate') : fieldPermisionPersonal?.DeceasedDate[0]?.Changeok === 1 && status ? dateChange(date, 'DeceasedDate') : '' : dateChange(date, 'DeceasedDate')
                                                    }
                                                    disabled={fieldPermisionPersonal?.DeceasedDate[0] ?
                                                        fieldPermisionPersonal?.DeceasedDate[0]?.Changeok === 0 && fieldPermisionPersonal?.DeceasedDate[0]?.AddOK === 0 && status ? true : fieldPermisionPersonal?.DeceasedDate[0]?.Changeok === 0 && fieldPermisionPersonal?.DeceasedDate[0]?.AddOK === 1 && personnelList?.DeceasedDate === '' && status ? false : fieldPermisionPersonal?.DeceasedDate[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.DeceasedDate[0]?.Changeok === 1 && status ? false : true : false
                                                    }
                                                    selected={value.DeceasedDate}
                                                    placeholderText={'Select ...'}
                                                // showTimeInput
                                                />
                                                <div>
                                                    <label htmlFor="">Deceased Date</label>
                                                </div>
                                                {errors.DeceasedDate !== 'true' && errors.DeceasedDate !== 'false' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DeceasedDate}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        {/* </fieldset> */}
                                    </div>
                                </div>
                                <div className="row mt-1">
                                    <div className="col-12 col-md-12 col-lg-12 ">
                                        <div className="bg-line cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Characteristics</p>
                                        </div>
                                        {/* <fieldset style={{ border: '1px solid #8080808c' }}>
                                            <legend style={{ color: '#274c77' }}>Characteristics</legend> */}
                                        <div className="row ">
                                            {/* <div className="col-6 dropdown__box">
                                                    <Select name='SexID' menuPlacement="top" options={sexList?.map((sponsor) =>
                                                    (
                                                        { label: sponsor.Description, value: sponsor.SexCodeID })
                                                    )}
                                                        value={
                                                            sexList?.filter(function (option) { return option.SexCodeID === value.SexID }).map(({ Description: label, SexCodeID: value, ...rest }) => ({
                                                                label, value,
                                                                ...rest
                                                            }))
                                                        }
                                                        onChange={fieldPermisionPersonal?.SexID[0] ?
                                                            fieldPermisionPersonal?.SexID[0]?.Changeok === 0 && fieldPermisionPersonal?.SexID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.SexID[0]?.Changeok === 0 && fieldPermisionPersonal?.SexID[0]?.AddOK === 1 && personnelList[0]?.SexID === '' ? sexChanges : fieldPermisionPersonal?.SexID[0]?.AddOK === 1 && !status ? sexChanges : fieldPermisionPersonal?.SexID[0]?.Changeok === 1 && status ? sexChanges : '' : sexChanges
                                                        }
                                                        isDisabled={fieldPermisionPersonal?.SexID[0] ?
                                                            fieldPermisionPersonal?.SexID[0]?.Changeok === 0 && fieldPermisionPersonal?.SexID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.SexID[0]?.Changeok === 0 && fieldPermisionPersonal?.SexID[0]?.AddOK === 1 && personnelList[0]?.SexID === '' ? false : fieldPermisionPersonal?.SexID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.SexID[0]?.Changeok === 1 ? false : true : false
                                                        }
                                                    />
                                                    <label htmlFor="">Gender</label>
                                                </div> */}
                                            <div className="col-6 col-md-4 col-lg-3 pt-2 dropdown__box">
                                                {
                                                    value?.RaceName ?
                                                        <Select name='RaceID' styles={customStylesWithOutColor} menuPlacement="top" options={raceList}
                                                            isClearable
                                                            defaultValue={value?.RaceName}
                                                            onChange={fieldPermisionPersonal?.RaceID[0] ?
                                                                fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 && status ? raceChanges : '' : raceChanges
                                                            }
                                                            isDisabled={fieldPermisionPersonal?.RaceID[0] ?
                                                                fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? false : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 ? false : true : false
                                                            }
                                                        />
                                                        : <><Select name='RaceID' styles={customStylesWithOutColor} menuPlacement="top" options={raceList}
                                                            isClearable
                                                            onChange={fieldPermisionPersonal?.RaceID[0] ?
                                                                fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 && status ? raceChanges : '' : raceChanges
                                                            }
                                                            isDisabled={fieldPermisionPersonal?.RaceID[0] ?
                                                                fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? false : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 ? false : true : false
                                                            }
                                                        /></>
                                                }
                                                <label htmlFor="" className='pt-2'>Race</label>
                                            </div>
                                            <div className="col-6 col-md-4 col-lg-3  pt-2 dropdown__box">
                                                {
                                                    value?.EthnicityName ?
                                                        <Select name='EthnicityID' styles={customStylesWithOutColor} menuPlacement="top" options={ethincityList}
                                                            onChange={ethincityChanges}
                                                            isClearable
                                                            defaultValue={value.EthnicityName}

                                                        // onChange={fieldPermisionPersonal?.EthnicityID[0] ?
                                                        //     fieldPermisionPersonal?.EthnicityID[0]?.Changeok === 0 && fieldPermisionPersonal?.EthnicityID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.EthnicityID[0]?.Changeok === 0 && fieldPermisionPersonal?.EthnicityID[0]?.AddOK === 1 && personnelList[0]?.EthnicityID === '' ? raceChanges : fieldPermisionPersonal?.EthnicityID[0]?.AddOK === 1 && !status ? raceChanges : fieldPermisionPersonal?.EthnicityID[0]?.Changeok === 1 && status ? raceChanges : '' : raceChanges
                                                        // }

                                                        // isDisabled={fieldPermisionPersonal?.EthnicityID[0] ?
                                                        //     fieldPermisionPersonal?.EthnicityID[0]?.Changeok === 0 && fieldPermisionPersonal?.EthnicityID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.EthnicityID[0]?.Changeok === 0 && fieldPermisionPersonal?.EthnicityID[0]?.AddOK === 1 && personnelList[0]?.EthnicityID === '' ? false : fieldPermisionPersonal?.EthnicityID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.EthnicityID[0]?.Changeok === 1 ? false : true : false
                                                        // }
                                                        />
                                                        :
                                                        <><Select name='EthnicityID' styles={customStylesWithOutColor} menuPlacement="top" options={ethincityList}
                                                            onChange={ethincityChanges}
                                                            isClearable
                                                        // onChange={fieldPermisionPersonal?.EthnicityID[0] ?
                                                        //     fieldPermisionPersonal?.EthnicityID[0]?.Changeok === 0 && fieldPermisionPersonal?.EthnicityID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.EthnicityID[0]?.Changeok === 0 && fieldPermisionPersonal?.EthnicityID[0]?.AddOK === 1 && personnelList[0]?.EthnicityID === '' ? raceChanges : fieldPermisionPersonal?.EthnicityID[0]?.AddOK === 1 && !status ? raceChanges : fieldPermisionPersonal?.EthnicityID[0]?.Changeok === 1 && status ? raceChanges : '' : raceChanges
                                                        // }

                                                        // isDisabled={fieldPermisionPersonal?.EthnicityID[0] ?
                                                        //     fieldPermisionPersonal?.EthnicityID[0]?.Changeok === 0 && fieldPermisionPersonal?.EthnicityID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.EthnicityID[0]?.Changeok === 0 && fieldPermisionPersonal?.EthnicityID[0]?.AddOK === 1 && personnelList[0]?.EthnicityID === '' ? false : fieldPermisionPersonal?.EthnicityID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.EthnicityID[0]?.Changeok === 1 ? false : true : false
                                                        // }
                                                        /></>
                                                }

                                                <label htmlFor="" className='pt-2'>Ethnicity</label>
                                            </div>
                                            <div className="col-6 col-md-4 col-lg-3  pt-2  d-flex">
                                                <div class="text-field">
                                                    <input type="text" name='height' maxLength={5} value={value?.height}
                                                        onChange={checkHandlChange}
                                                        required />
                                                    <label>Height</label>
                                                </div>
                                                <span className='mt-3 mx-2 py-2' style={{ fontWeight: 'bold', fontSize: '12px' }}>FT.</span>

                                                <div class="text-field">
                                                    <input type="text" name='weight' maxLength='3' value={value.weight}
                                                        onChange={handleChange}
                                                        required />
                                                    <label>Weight</label>
                                                </div>
                                                <span className='mt-3 mx-2 py-2' style={{ fontWeight: 'bold', fontSize: '12px' }}>LBS.</span>
                                            </div>
                                            {/* <div className="col-12 col-md-1 mt-1 mb-2">
                                                <div class="input-group mb-3">
                                                    <input type="text" class="form-control" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                                    <span class="input-group-text" id="basic-addon2">LBS.</span>
                                                </div>
                                            </div> */}
                                        </div>
                                        <div className="col-12 px-0">
                                            <div className="row mt-1 ">
                                                <div className="col-6 col-md-4 col-lg-3 dropdown__box">
                                                    {value?.BloodTypeName ?
                                                        <Select name='BloodTypeID' styles={customStylesWithOutColor} menuPlacement="top" options={bloodGroupList}
                                                            onChange={bloodTypeChanges}
                                                            isClearable
                                                            defaultValue={value.BloodTypeName}
                                                        // onChange={fieldPermisionPersonal?.RaceID[0] ?
                                                        //     fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 && status ? raceChanges : '' : raceChanges
                                                        // }

                                                        // isDisabled={fieldPermisionPersonal?.RaceID[0] ?
                                                        //     fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? false : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 ? false : true : false
                                                        // }
                                                        />
                                                        : <><Select name='BloodTypeID' styles={customStylesWithOutColor} menuPlacement="top" options={bloodGroupList}
                                                            isClearable
                                                            onChange={bloodTypeChanges}
                                                        // onChange={fieldPermisionPersonal?.RaceID[0] ?
                                                        //     fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 && status ? raceChanges : '' : raceChanges
                                                        // }

                                                        // isDisabled={fieldPermisionPersonal?.RaceID[0] ?
                                                        //     fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? false : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 ? false : true : false
                                                        // }
                                                        /></>
                                                    }
                                                    <label htmlFor="">Blood Type</label>
                                                </div>
                                                <div className="col-6 col-md-4 col-lg-3 dropdown__box">
                                                    {
                                                        value?.EyeColorName ?
                                                            <Select
                                                                name='EyeColorID'
                                                                styles={customStylesWithOutColor}
                                                                menuPlacement="top"
                                                                options={eyeList}
                                                                onChange={eyeColorChanges}
                                                                isClearable
                                                                defaultValue={value.EyeColorName}
                                                            // onChange={fieldPermisionPersonal?.RaceID[0] ?
                                                            //     fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 && status ? raceChanges : '' : raceChanges
                                                            // }
                                                            // isDisabled={fieldPermisionPersonal?.RaceID[0] ?
                                                            //     fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? false : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 ? false : true : false
                                                            // }
                                                            />
                                                            : <><Select
                                                                name='EyeColorID'
                                                                styles={customStylesWithOutColor}
                                                                menuPlacement="top"
                                                                options={eyeList}
                                                                onChange={eyeColorChanges}
                                                                isClearable
                                                            // onChange={fieldPermisionPersonal?.RaceID[0] ?
                                                            //     fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 && status ? raceChanges : '' : raceChanges
                                                            // }
                                                            // isDisabled={fieldPermisionPersonal?.RaceID[0] ?
                                                            //     fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? false : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 ? false : true : false
                                                            // }
                                                            /></>
                                                    }
                                                    <label htmlFor="">Eye Color</label>
                                                </div>
                                                <div className="col-6 col-md-4 col-lg-3 dropdown__box">
                                                    {
                                                        value?.HairColorName ?
                                                            <Select
                                                                name='HairColorID'
                                                                styles={customStylesWithOutColor}
                                                                menuPlacement="top"
                                                                options={hairList}
                                                                onChange={hairColorChanges}
                                                                isClearable
                                                                defaultValue={value.HairColorName}
                                                            // onChange={fieldPermisionPersonal?.RaceID[0] ?
                                                            //     fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 && status ? raceChanges : '' : raceChanges
                                                            // }
                                                            // isDisabled={fieldPermisionPersonal?.RaceID[0] ?
                                                            //     fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? false : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 ? false : true : false
                                                            // }
                                                            />
                                                            : <><Select
                                                                name='HairColorID'
                                                                styles={customStylesWithOutColor}
                                                                menuPlacement="top"
                                                                options={hairList}
                                                                onChange={hairColorChanges}
                                                                isClearable
                                                            // onChange={fieldPermisionPersonal?.RaceID[0] ?
                                                            //     fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 && status ? raceChanges : '' : raceChanges
                                                            // }
                                                            // isDisabled={fieldPermisionPersonal?.RaceID[0] ?
                                                            //     fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? false : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 ? false : true : false
                                                            // }
                                                            /></>
                                                    }
                                                    <label htmlFor="">Hair Color</label>
                                                </div>
                                                <div className="col-12 col-md-12 col-lg-3 mt-3  text-right">
                                                    {
                                                        EffectiveScreenPermission ?
                                                            EffectiveScreenPermission[0]?.Changeok ?
                                                                <button type="button" class="btn btn-sm btn-success" onClick={check_Validation_Error}>Update</button>
                                                                : <></>
                                                            : <button type="button" class="btn btn-sm btn-success" onClick={check_Validation_Error}>Update</button>}
                                                    {/* <button type="button" class="btn btn-sm btn-success ml-1">Cancel</button> */}
                                                </div>
                                            </div>
                                        </div>
                                        {/* </fieldset> */}
                                    </div>
                                </div>
                            </>
                            : <p className='text-center mt-3'>Loading</p>
                    }
                    {
                        EffectiveScreenPermission ? !EffectiveScreenPermission[0]?.DisplayOK ?
                            <div className="overlay-form">
                                <p>You don't have permision to view this data</p>
                            </div>
                            : <></>
                            : <></>}

                </div>

            </div>
        </>
    )
}

export default Dates

export const changeArrayFormat = (data, type) => {
    if (type === 'state') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.StateID, label: sponsor.StateName })
        )
        return result
    }
    if (type === 'city') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.CityID, label: sponsor.CityName })
        )
        return result
    }
    if (type === 'zip') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.zipId, label: sponsor.Zipcode })
        )
        return result
    }

    if (type === 'race') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.RaceTypeID, label: sponsor.Description })
        )
        return result
    } if (type === 'ethnicity') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.EthnicityID, label: sponsor.Description })
        )
        return result
    } if (type === 'blood') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.BloodTypeID, label: sponsor.BloodtypeDescription })
        )
        return result
    } if (type === 'eye') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ColorID, label: sponsor.ColorDescription })
        )
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type) => {
    if (type === 'state') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.StateID, label: sponsor.StateName })
        )
        return result[0]
    }
    if (type === 'city') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.CityID, label: sponsor.CityName })
        )
        return result[0]
    }
    if (type === 'zip') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ZipCodeID, label: sponsor.Zipcode })
        )
        return result[0]
    }
    if (type === 'race') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.RaceID, label: sponsor.RaceDescription })
        )
        return result[0]
    } if (type === 'ethnicity') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.EthnicityID, label: sponsor.Ethnicity_Description })
        )
        return result[0]
    } if (type === 'blood') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.BloodTypeID, label: sponsor.BloodType_Description })
        )
        return result[0]
    } if (type === 'eye') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.EyeColorID, label: sponsor.EyeColorDescription })
        )
        return result[0]
    }
    if (type === 'hair') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.HairColorID, label: sponsor.HairColorDescription })
        )
        return result[0]
    }
}