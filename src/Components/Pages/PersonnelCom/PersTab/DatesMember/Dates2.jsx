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
    const { pId, aId, status } = props
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [zipList, setZipList] = useState([])
    const [sexList, setSexList] = useState([])
    const [raceList, setRaceList] = useState([])
    const [hiredDate, setHiredDate] = useState()
    const [deactivateDate, setDeactivateDate] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [deceasedDate, setDeceasedDate] = useState('')
    const [personnelList, setPersonnelList] = useState([])

    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [value, setValue] = useState({
        'Address': '', 'StateID': '', 'CityID': '', 'ZipCodeID': '', 'SSN': '', 'BadgeNumber': '', 'DriverLicenseNo': '', 'WorkPhoneNumber': '', 'WorkPhone_Ext': '', 'HomePhoneNumber': '', 'CellPhoneNumber': '', 'HiredDate': '', 'DeactivateDate': '', 'DateOfBirth': '', 'IsDecease': '', 'DeceasedDate': '', 'SexID': '', 'RaceID': '', 'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'), 'PINID': pId,
    })

    const [fieldPermisionPersonal, setFieldPermisionPersonal] = useState({
        // Personnel Date Tab Field
        'Address': '', 'StateID': '', 'CityID': '', 'ZipCodeID': '', 'SSN': '', 'BadgeNumber': '', 'DriverLicenseNo': '', 'WorkPhoneNumber': '', 'WorkPhone_Ext': '', 'HomePhoneNumber': '', 'CellPhoneNumber': '', 'HiredDate': '', 'DeactivateDate': '', 'DateOfBirth': '', 'IsDecease': '', 'DeceasedDate': '', 'SexID': '', 'RaceID': '',
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
        getStateList();
        getRaceList();
        getSexList();
        getScreenPermision()
    }, [])

    // Get Effective Screeen Permission
    const getScreenPermision = () => {
        ScreenPermision("P013", aId).then(res => {
            if (res) setEffectiveScreenPermission(res)
            else setEffectiveScreenPermission()
        });
    }

    useEffect(() => {
        if (aId) get_Field_Permision_Classifiation(aId)
    }, [aId])

    // Get Effective Field Permission
    const get_Field_Permision_Classifiation = (aId) => {
        fieldPermision(aId, 'P013').then(res => {
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
        if (pId) get_Single_PersonnelList()
    }, [pId])

    useEffect(() => {
        if (personnelList) {
            setValue({
                ...value,
                'Address': personnelList[0]?.Address ? personnelList[0]?.Address : '', 'StateID': personnelList[0]?.StateID ? personnelList[0]?.StateID : '', 'CityID': personnelList[0]?.CityID ? personnelList[0]?.CityID : '', 'ZipCodeID': personnelList[0]?.ZipCodeID ? personnelList[0]?.ZipCodeID : '', 'SSN': personnelList[0]?.SSN ? personnelList[0]?.SSN : '', 'BadgeNumber': personnelList[0]?.BadgeNumber ? personnelList[0]?.BadgeNumber : '', 'DriverLicenseNo': personnelList[0]?.DriverLicenseNo ? personnelList[0]?.DriverLicenseNo : '', 'WorkPhoneNumber': personnelList[0]?.WorkPhoneNumber ? personnelList[0]?.WorkPhoneNumber : '', 'WorkPhone_Ext': personnelList[0]?.WorkPhone_Ext ? personnelList[0]?.WorkPhone_Ext : '', 'HomePhoneNumber': personnelList[0]?.HomePhoneNumber ? personnelList[0]?.HomePhoneNumber : '', 'CellPhoneNumber': personnelList[0]?.CellPhoneNumber ? personnelList[0]?.CellPhoneNumber : '',
                'HiredDate': personnelList[0]?.HiredDate != null ?
                    getShowingWithOutTime(personnelList[0]?.HiredDate) === '01/01/1900' ? null : getShowingWithOutTime(personnelList[0]?.HiredDate)
                    :
                    '',
                'DeactivateDate': personnelList[0]?.DeactivateDate != null
                    ?
                    getShowingWithOutTime(personnelList[0]?.DeactivateDate) === '01/01/1900' ? '' : getShowingWithOutTime(personnelList[0]?.DeactivateDate)
                    :
                    '',
                'DateOfBirth': personnelList[0]?.DateOfBirth != null ?
                    getShowingWithOutTime(personnelList[0]?.DateOfBirth) === '01/01/1900' ? '' : getShowingWithOutTime(personnelList[0]?.DateOfBirth)
                    :
                    '',
                'IsDecease': personnelList[0]?.IsDecease,
                'DeceasedDate': personnelList[0]?.DeceasedDate != null ?
                    getShowingWithOutTime(personnelList[0]?.DeceasedDate) === '01/01/1900' ? '' : getShowingWithOutTime(personnelList[0]?.DeceasedDate)
                    :
                    '',
                'SexID': personnelList[0]?.SexID ? personnelList[0]?.SexID : '', 'RaceID': personnelList[0]?.RaceID ? personnelList[0]?.RaceID : '', 'PINID': pId,
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

    const get_Single_PersonnelList = () => {
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
        if (type === 'HiredDate') { setHiredDate(date); setValue({ ...value, ['HiredDate']: date }) }
        else if (type === 'DeactivateDate') { setDeactivateDate(date); setValue({ ...value, ['DeactivateDate']: date }) }
        else if (type === 'DateOfBirth') {
            if (date <= moment(new Date()).subtract(18, 'years')._d) {
                setDateOfBirth(date); setValue({ ...value, ['DateOfBirth']: date })
            }
        } else if (type === 'DeceasedDate') { setDeceasedDate(date); setValue({ ...value, ['DeceasedDate']: date }) }
    }
    const stateChanges = (e) => {
        setValue({
            ...value,
            ['StateID']: e.value
        })
        getCity(e.value)
    }

    const cityChanges = (e) => {
        setValue({
            ...value,
            ['CityID']: e.value
        })

        getZipCode(e.value)
    }

    const zipChanges = (e) => {
        setValue({
            ...value,
            ['ZipCodeID']: e.value
        })

    }

    const raceChanges = (e) => {
        setValue({
            ...value,
            ['RaceID']: e.value
        })

    }

    const sexChanges = (e) => {
        setValue({
            ...value,
            ['SexID']: e.value
        })

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
        if (e.target.name === 'IsDecease') { setValue({ ...value, [e.target.name]: e.target.checked }) }
        else if (e.target.name === 'WorkPhoneNumber' || e.target.name === 'CellPhoneNumber' || e.target.name === 'HomePhoneNumber') {
            var ele = e.target.value;
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
                ele = e.target.value.split('-').join('');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else if (e.target.name === 'SSN') {
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
                ele = e.target.value.split('-').join('');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        }
        else setValue({ ...value, [e.target.name]: e.target.value })
    }

    // Get state, city, zip, Race and Sex List 
    const getStateList = async () => {
        fetchData("State_City_ZipCode/GetData_State")
            .then(response => {
                if (response) setStateList(response)
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
                if (res) setCityList(res)
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
                if (res) setZipList(res)
                else setZipList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const getRaceList = async () => {
        fetchData("DropDown/GetData_RaceType")
            .then(response => {
                if (response) setRaceList(response)
                else setRaceList()
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
        const { Address, StateID, CityID, ZipCodeID, SSN, BadgeNumber, DriverLicenseNo, WorkPhoneNumber, WorkPhone_Ext, HomePhoneNumber, CellPhoneNumber, IsDecease, SexID, RaceID, ModifiedByUserFK, PINID, DeactivateDate, DateOfBirth, DeceasedDate, HiredDate } = value
        const val = {
            'Address': Address, 'StateID': StateID, 'CityID': CityID, 'ZipCodeID': ZipCodeID, 'SSN': SSN, 'BadgeNumber': BadgeNumber, 'DriverLicenseNo': DriverLicenseNo, 'WorkPhoneNumber': WorkPhoneNumber, 'WorkPhone_Ext': WorkPhone_Ext, 'HomePhoneNumber': HomePhoneNumber, 'CellPhoneNumber': CellPhoneNumber, 'HiredDate': hiredDate ? getShowingYearMonthDate(hiredDate) : HiredDate, 'DeactivateDate': deactivateDate ? getShowingYearMonthDate(deactivateDate) : DeactivateDate, 'DateOfBirth': dateOfBirth ? getShowingYearMonthDate(dateOfBirth) : DateOfBirth, 'IsDecease': IsDecease, 'DeceasedDate': deceasedDate ? getShowingYearMonthDate(deceasedDate) : DeceasedDate, 'SexID': SexID, 'RaceID': RaceID, 'ModifiedByUserFK': ModifiedByUserFK, 'PINID': PINID,
        }

        AddDeleteUpadate('Personnel/UpdateCharactersticPersonnel', val)
            .then((res) => {
                if (res.success === true) {
                    toastifySuccess(res.Message)
                    setErrors({
                        ...errors, ['WorkPhoneNumber']: 'false', ['WorkPhone_Ext']: 'false', ['HomePhoneNumber']: 'false', ['CellPhoneNumber']: 'false'
                    })
                    get_Single_PersonnelList();
                }
            })

    }

    return (
        <>
            <div className="row">
                <div className="col-12 " id='display-not-form'>
                    {
                        EffectiveScreenPermission ?
                            <>
                                <div className="row">
                                    <div className="col-12 col-md-12 col-lg-6 mt-3">
                                        <div className="bg-green text-white cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center fs">Address</p>
                                        </div>
                                        {/* <fieldset style={{ border: '1px solid #8080808c' }}>
                                            <legend style={{ color: '#274c77' }}>Address</legend> */}
                                        {/* <label>Address</label> */}
                                        <div className="row mt-2">
                                            <div className="col-12">
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
                                            <div className="col-4 col-md-4 col-lg-4 mt-4 dropdown__box">
                                                <Select name='StateID' options={stateList?.map((sponsor, index) =>
                                                (
                                                    { label: sponsor.StateName, value: sponsor.StateID })
                                                )}
                                                    value={
                                                        stateList?.filter(function (option) { return option.StateID === value.StateID }).map(({ StateName: label, StateID: value, ...rest }) => ({
                                                            label, value,
                                                            ...rest
                                                        }))
                                                    }
                                                    onChange={fieldPermisionPersonal?.StateID[0] ?
                                                        fieldPermisionPersonal?.StateID[0]?.Changeok === 0 && fieldPermisionPersonal?.StateID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.StateID[0]?.Changeok === 0 && fieldPermisionPersonal?.StateID[0]?.AddOK === 1 && personnelList[0]?.StateID === '' ? stateChanges : fieldPermisionPersonal?.StateID[0]?.AddOK === 1 && !status ? stateChanges : fieldPermisionPersonal?.StateID[0]?.Changeok === 1 && status ? stateChanges : '' : stateChanges
                                                    }
                                                    isDisabled={fieldPermisionPersonal?.StateID[0] ?
                                                        fieldPermisionPersonal?.StateID[0]?.Changeok === 0 && fieldPermisionPersonal?.StateID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.StateID[0]?.Changeok === 0 && fieldPermisionPersonal?.StateID[0]?.AddOK === 1 && personnelList[0]?.StateID === '' ? false : fieldPermisionPersonal?.StateID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.StateID[0]?.Changeok === 1 ? false : true : false
                                                    }
                                                />
                                                <label htmlFor="">State</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-4 mt-4 dropdown__box">
                                                <Select name='CityID'
                                                    onChange={fieldPermisionPersonal?.CityID[0] ?
                                                        fieldPermisionPersonal?.CityID[0]?.Changeok === 0 && fieldPermisionPersonal?.CityID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.CityID[0]?.Changeok === 0 && fieldPermisionPersonal?.CityID[0]?.AddOK === 1 && personnelList[0]?.CityID === '' ? cityChanges : fieldPermisionPersonal?.CityID[0]?.AddOK === 1 && !status ? cityChanges : fieldPermisionPersonal?.CityID[0]?.Changeok === 1 && status ? cityChanges : '' : cityChanges
                                                    }
                                                    isDisabled={fieldPermisionPersonal?.CityID[0] ?
                                                        fieldPermisionPersonal?.CityID[0]?.Changeok === 0 && fieldPermisionPersonal?.CityID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.CityID[0]?.Changeok === 0 && fieldPermisionPersonal?.CityID[0]?.AddOK === 1 && personnelList[0]?.CityID === '' ? false : fieldPermisionPersonal?.CityID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.CityID[0]?.Changeok === 1 && status ? false : true : false
                                                    }
                                                    options={cityList?.map((sponsor, index) =>
                                                    (
                                                        { label: sponsor.CityName, value: sponsor.CityID })
                                                    )}
                                                    value={
                                                        cityList?.filter(function (option) { return option.CityID === value.CityID }).map(({ CityName: label, CityID: value, ...rest }) => ({
                                                            label, value,
                                                            ...rest
                                                        }))
                                                    }
                                                />
                                                <label htmlFor="">City</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-4 mt-4 dropdown__box">
                                                <Select name='ZipCodeID' options={zipList?.map((sponsor, index) =>
                                                (
                                                    { label: sponsor.Zipcode, value: sponsor.zipId })
                                                )}
                                                    value={
                                                        zipList?.filter(function (option) { return option.zipId === value.ZipCodeID }).map(({ Zipcode: label, zipId: value, ...rest }) => ({
                                                            label, value,
                                                            ...rest
                                                        }))
                                                    }
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
                                        {/* </fieldset> */}
                                    </div>
                                    <div className="col-12 col-md-12 col-lg-6 mt-3">
                                        <div className="bg-green text-white cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center fs">Dates</p>
                                        </div>
                                        {/* <fieldset style={{ border: '1px solid #8080808c' }}>
                                            <legend style={{ color: '#274c77' }}>Dates</legend> */}
                                            <div className="row mt-2">
                                                <div className="col-12 col-md-4 col-lg-3 dropdown__box">
                                                    <DatePicker
                                                        ref={startRef}
                                                        onKeyDown={onKeyDown}
                                                        dateFormat="MM/dd/yyyy"
                                                        timeInputLabel
                                                        name='HiredDate'
                                                        maxDate={new Date()}
                                                        isClearable={true}
                                                        onChange={date => fieldPermisionPersonal?.HiredDate[0] ?
                                                            fieldPermisionPersonal?.HiredDate[0]?.Changeok === 0 && fieldPermisionPersonal?.HiredDate[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.HiredDate[0]?.Changeok === 0 && fieldPermisionPersonal?.HiredDate[0]?.AddOK === 1 && personnelList?.HiredDate === '' && status ? dateChange(date, 'HiredDate') : fieldPermisionPersonal?.HiredDate[0]?.AddOK === 1 && !status ? dateChange(date, 'HiredDate') : fieldPermisionPersonal?.HiredDate[0]?.Changeok === 1 && status ? dateChange(date, 'HiredDate') : '' : dateChange(date, 'HiredDate')
                                                        }
                                                        disabled={fieldPermisionPersonal?.HiredDate[0] ?
                                                            fieldPermisionPersonal?.HiredDate[0]?.Changeok === 0 && fieldPermisionPersonal?.HiredDate[0]?.AddOK === 0 && status ? true : fieldPermisionPersonal?.HiredDate[0]?.Changeok === 0 && fieldPermisionPersonal?.HiredDate[0]?.AddOK === 1 && personnelList?.HiredDate === '' && status ? false : fieldPermisionPersonal?.HiredDate[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.HiredDate[0]?.Changeok === 1 && status ? false : true : false
                                                        }
                                                        selected={hiredDate}
                                                        placeholderText={value.HiredDate ? value.HiredDate : 'Select ..'}
                                                    // showTimeInput
                                                    />
                                                    <div>
                                                        <label htmlFor="">Hired Date</label>
                                                    </div>

                                                </div>
                                                <div className="col-12 col-md-4 col-lg-3  dropdown__box">
                                                    <DatePicker
                                                        ref={startRef1}
                                                        onKeyDown={onKeyDown}
                                                        dateFormat="MM/dd/yyyy"
                                                        timeInputLabel
                                                        name='DeactivateDate'
                                                        isClearable={true}
                                                        maxDate={new Date()}
                                                        minDate={new Date(value?.HiredDate)}
                                                        onChange={date => fieldPermisionPersonal?.DeactivateDate[0] ?
                                                            fieldPermisionPersonal?.DeactivateDate[0]?.Changeok === 0 && fieldPermisionPersonal?.DeactivateDate[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.DeactivateDate[0]?.Changeok === 0 && fieldPermisionPersonal?.DeactivateDate[0]?.AddOK === 1 && personnelList?.DeactivateDate === '' && status ? dateChange(date, 'DeactivateDate') : fieldPermisionPersonal?.DeactivateDate[0]?.AddOK === 1 && !status ? dateChange(date, 'DeactivateDate') : fieldPermisionPersonal?.DeactivateDate[0]?.Changeok === 1 && status ? dateChange(date, 'DeactivateDate') : '' : dateChange(date, 'DeactivateDate')
                                                        }
                                                        disabled={fieldPermisionPersonal?.DeactivateDate[0] ?
                                                            fieldPermisionPersonal?.DeactivateDate[0]?.Changeok === 0 && fieldPermisionPersonal?.DeactivateDate[0]?.AddOK === 0 && status ? true : fieldPermisionPersonal?.DeactivateDate[0]?.Changeok === 0 && fieldPermisionPersonal?.DeactivateDate[0]?.AddOK === 1 && personnelList?.DeactivateDate === '' && status ? false : fieldPermisionPersonal?.DeactivateDate[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.DeactivateDate[0]?.Changeok === 1 && status ? false : true : false
                                                        }
                                                        // onChange={(date) => {  }}
                                                        selected={deactivateDate}
                                                        placeholderText={value?.DeactivateDate ? value.DeactivateDate : 'Select ..'}
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
                                                <div className="col-12 col-md-3 col-lg-3 mt-3 text-center">
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
                                                    <label className='ml-2'>IsDecease</label>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-3 dropdown__box">
                                                    <DatePicker
                                                        ref={startRef3}
                                                        onKeyDown={onKeyDown}
                                                        readOnly={!value.IsDecease}
                                                        dateFormat="MM/dd/yyyy "
                                                        isClearable={true}
                                                        timeInputLabel
                                                        name='DeceasedDate'
                                                        maxDate={new Date()}
                                                        minDate={new Date(value?.HiredDate)}
                                                        onChange={date => fieldPermisionPersonal?.DeceasedDate[0] ?
                                                            fieldPermisionPersonal?.DeceasedDate[0]?.Changeok === 0 && fieldPermisionPersonal?.DeceasedDate[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.DeceasedDate[0]?.Changeok === 0 && fieldPermisionPersonal?.DeceasedDate[0]?.AddOK === 1 && personnelList?.DeceasedDate === '' && status ? dateChange(date, 'DeceasedDate') : fieldPermisionPersonal?.DeceasedDate[0]?.AddOK === 1 && !status ? dateChange(date, 'DeceasedDate') : fieldPermisionPersonal?.DeceasedDate[0]?.Changeok === 1 && status ? dateChange(date, 'DeceasedDate') : '' : dateChange(date, 'DeceasedDate')
                                                        }
                                                        disabled={fieldPermisionPersonal?.DeceasedDate[0] ?
                                                            fieldPermisionPersonal?.DeceasedDate[0]?.Changeok === 0 && fieldPermisionPersonal?.DeceasedDate[0]?.AddOK === 0 && status ? true : fieldPermisionPersonal?.DeceasedDate[0]?.Changeok === 0 && fieldPermisionPersonal?.DeceasedDate[0]?.AddOK === 1 && personnelList?.DeceasedDate === '' && status ? false : fieldPermisionPersonal?.DeceasedDate[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.DeceasedDate[0]?.Changeok === 1 && status ? false : true : false
                                                        }
                                                        selected={deceasedDate}
                                                        placeholderText={value.DeceasedDate ? value.DeceasedDate : 'Select ...'}
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
                                <div className="row">
                                    <div className="col-12 col-md-12 col-lg-6 mt-2">
                                        <div className="bg-green text-white cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center fs">Phone Number</p>
                                        </div>
                                        {/* <fieldset style={{ border: '1px solid #8080808c' }}>
                                            <legend style={{ color: '#274c77' }}>Phone Number</legend> */}
                                            <div className="row mt-3">
                                                <div className="col-6 col-md-6 col-lg-6">
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
                                                <div className="col-6 col-md-6 col-lg-6">
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
                                                <div className="col-6 col-md-6 col-lg-6 mt-3">
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
                                                <div className="col-6 col-md-6 col-lg-6 mt-3">
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
                                        <div className="bg-green text-white cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center fs">Identification Number</p>
                                        </div>
                                        {/* <fieldset style={{ border: '1px solid #8080808c' }}>
                                            <legend style={{ color: '#274c77' }}>Identification Number</legend> */}
                                            <div className="row mt-2">
                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
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
                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
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
                                                <div className="col-4 col-md-4 col-lg-4 mt-2 mb-2">
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
                                </div>
                                <div className="row">
                                    <div className="col-12 col-md-12 col-lg-12 mt-2">
                                        <div className="bg-green text-white cpy px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center fs">Characteristics</p>
                                        </div>
                                        {/* <fieldset style={{ border: '1px solid #8080808c' }}>
                                            <legend style={{ color: '#274c77' }}>Characteristics</legend> */}
                                            <div className="row mt-2">
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
                                                <div className="col-12 col-md-3 dropdown__box">
                                                    <Select name='RaceID' menuPlacement="top" options={raceList?.map((sponsor) =>
                                                    (
                                                        { label: sponsor.Description, value: sponsor.RaceTypeID })
                                                    )}
                                                        value={
                                                            raceList?.filter(function (option) { return option.RaceTypeID === value.RaceID }).map(({ Description: label, RaceTypeID: value, ...rest }) => ({
                                                                label, value,
                                                                ...rest
                                                            }))
                                                        }
                                                        onChange={fieldPermisionPersonal?.RaceID[0] ?
                                                            fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 && status ? raceChanges : '' : raceChanges
                                                        }
                                                        isDisabled={fieldPermisionPersonal?.RaceID[0] ?
                                                            fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? false : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 ? false : true : false
                                                        }
                                                    />
                                                    <label htmlFor="">Race</label>
                                                </div>
                                                <div className="col-12 col-md-3 dropdown__box">
                                                    <Select name='RaceID' menuPlacement="top" options={raceList?.map((sponsor) =>
                                                    (
                                                        { label: sponsor.Description, value: sponsor.RaceTypeID })
                                                    )}
                                                        value={
                                                            raceList?.filter(function (option) { return option.RaceTypeID === value.RaceID }).map(({ Description: label, RaceTypeID: value, ...rest }) => ({
                                                                label, value,
                                                                ...rest
                                                            }))
                                                        }
                                                        onChange={fieldPermisionPersonal?.RaceID[0] ?
                                                            fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 && status ? raceChanges : '' : raceChanges
                                                        }
                                                        isDisabled={fieldPermisionPersonal?.RaceID[0] ?
                                                            fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? false : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 ? false : true : false
                                                        }
                                                    />
                                                    <label htmlFor="">Ethnicity</label>
                                                </div>
                                                <div className="col-12 col-md-3 mt-1 mb-2">
                                                    <div class="text-field">
                                                        <input type="text" name='DriverLicenseNo' maxLength='14' value={value.DriverLicenseNo}
                                                            className={fieldPermisionPersonal?.DriverLicenseNo[0] ?
                                                                fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 0 && fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 0 && fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 1 && personnelList[0]?.DriverLicenseNo === '' && status ? '' : fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 1 && !status ? '' : fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''
                                                            }
                                                            onChange={fieldPermisionPersonal?.DriverLicenseNo[0] ?
                                                                fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 0 && fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 0 && fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 1 && personnelList[0]?.DriverLicenseNo === '' && status ? handleChange : fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 1 && status ? handleChange : '' : ''
                                                            } required />
                                                        <label>Height</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-3 mt-1 mb-2">
                                                    <div class="text-field">
                                                        <input type="text" name='DriverLicenseNo' maxLength='14' value={value.DriverLicenseNo}
                                                            className={fieldPermisionPersonal?.DriverLicenseNo[0] ?
                                                                fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 0 && fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 0 && fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 1 && personnelList[0]?.DriverLicenseNo === '' && status ? '' : fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 1 && !status ? '' : fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''
                                                            }
                                                            onChange={fieldPermisionPersonal?.DriverLicenseNo[0] ?
                                                                fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 0 && fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 0 && status ? '' : fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 0 && fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 1 && personnelList[0]?.DriverLicenseNo === '' && status ? handleChange : fieldPermisionPersonal?.DriverLicenseNo[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionPersonal?.DriverLicenseNo[0]?.Changeok === 1 && status ? handleChange : '' : ''
                                                            } required />
                                                        <label>Weight</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-3 mt-4 dropdown__box">
                                                    <Select name='RaceID' menuPlacement="top" options={raceList?.map((sponsor) =>
                                                    (
                                                        { label: sponsor.Description, value: sponsor.RaceTypeID })
                                                    )}
                                                        value={
                                                            raceList?.filter(function (option) { return option.RaceTypeID === value.RaceID }).map(({ Description: label, RaceTypeID: value, ...rest }) => ({
                                                                label, value,
                                                                ...rest
                                                            }))
                                                        }
                                                        onChange={fieldPermisionPersonal?.RaceID[0] ?
                                                            fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 && status ? raceChanges : '' : raceChanges
                                                        }
                                                        isDisabled={fieldPermisionPersonal?.RaceID[0] ?
                                                            fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? false : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 ? false : true : false
                                                        }
                                                    />
                                                    <label htmlFor="">Blood Type</label>
                                                </div>
                                                <div className="col-12 col-md-3 mt-4 dropdown__box">
                                                    <Select name='RaceID' menuPlacement="top" options={raceList?.map((sponsor) =>
                                                    (
                                                        { label: sponsor.Description, value: sponsor.RaceTypeID })
                                                    )}
                                                        value={
                                                            raceList?.filter(function (option) { return option.RaceTypeID === value.RaceID }).map(({ Description: label, RaceTypeID: value, ...rest }) => ({
                                                                label, value,
                                                                ...rest
                                                            }))
                                                        }
                                                        onChange={fieldPermisionPersonal?.RaceID[0] ?
                                                            fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 && status ? raceChanges : '' : raceChanges
                                                        }
                                                        isDisabled={fieldPermisionPersonal?.RaceID[0] ?
                                                            fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? false : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 ? false : true : false
                                                        }
                                                    />
                                                    <label htmlFor="">Eye Color</label>
                                                </div>
                                                <div className="col-12 col-md-3 mt-4 dropdown__box">
                                                    <Select name='RaceID' menuPlacement="top" options={raceList?.map((sponsor) =>
                                                    (
                                                        { label: sponsor.Description, value: sponsor.RaceTypeID })
                                                    )}
                                                        value={
                                                            raceList?.filter(function (option) { return option.RaceTypeID === value.RaceID }).map(({ Description: label, RaceTypeID: value, ...rest }) => ({
                                                                label, value,
                                                                ...rest
                                                            }))
                                                        }
                                                        onChange={fieldPermisionPersonal?.RaceID[0] ?
                                                            fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? '' : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? raceChanges : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 && status ? raceChanges : '' : raceChanges
                                                        }
                                                        isDisabled={fieldPermisionPersonal?.RaceID[0] ?
                                                            fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 0 ? true : fieldPermisionPersonal?.RaceID[0]?.Changeok === 0 && fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && personnelList[0]?.RaceID === '' ? false : fieldPermisionPersonal?.RaceID[0]?.AddOK === 1 && !status ? false : fieldPermisionPersonal?.RaceID[0]?.Changeok === 1 ? false : true : false
                                                        }
                                                    />
                                                    <label htmlFor="">Hair Color</label>
                                                </div>
                                            </div>
                                        {/* </fieldset> */}
                                    </div>
                                    <div className="col-12 col-md-12 col-lg-12 mt-3  text-right">
                                        {
                                            EffectiveScreenPermission ?
                                                EffectiveScreenPermission[0]?.Changeok ?
                                                    <button type="button" class="btn btn-sm btn-success" onClick={check_Validation_Error}>Update</button>
                                                    : <></>
                                                : <button type="button" class="btn btn-sm btn-success" onClick={check_Validation_Error}>Update</button>}
                                        {/* <button type="button" class="btn btn-sm btn-success ml-1">Cancel</button> */}
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
    if (type === 'division') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.zipId, label: sponsor.Zipcode })
        )
        return result
    }
    if (type === 'rank') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.zipId, label: sponsor.Zipcode })
        )
        return result
    }
    if (type === 'shift') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ShiftId, label: sponsor.ShiftDescription })
        )
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type) => {
    if (type === 'division') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.Agency_ZipId, label: sponsor.Agency_ZipId })
        )
        return result[0]
    }
    if (type === 'rank') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.Agency_ZipId, label: sponsor.Agency_ZipId })
        )
        return result[0]
    }
    if (type === 'shift') {
        console.log(data);
        const result = data.map((sponsor) =>
            ({ value: sponsor.ShiftID, label: sponsor.ShiftDescription })
        )
        console.log(result[0]);
        return result[0]
    }
}