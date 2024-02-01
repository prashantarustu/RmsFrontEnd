import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Decrypt_Id_Name, getShowingMonthDateYear } from '../../../Common/Utility';
import { useState } from 'react';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { fetchPostData } from '../../../hooks/Api';
import { Comman_changeArrayFormat, Comman_changeArrayFormat_With_Name, threeColArray } from '../../../Common/ChangeArrayFormat';
import { toastifyError } from '../../../Common/AlertMsg';
import { Comparision } from '../../PersonnelCom/Validation/PersonnelValidation';
import { AgencyContext } from '../../../../Context/Agency/Index';

const NameSearchPage = () => {

    const { nameSearch, setnameSearch ,localStoreArray, setLocalStoreArray, get_LocalStorage} = useContext(AgencyContext);
    const navigate = useNavigate()
    const [businessTypeDrp, setBusinessTypeDrp] = useState([]);
    const [nameTypeIdDrp, setNameTypeIdDrp] = useState([]);
    const [suffixIdDrp, setsuffixIdDrp] = useState([])
    const [sexIdDrp, setSexIdDrp] = useState([]);
    const [raceIdDrp, setRaceIdDrp] = useState([]);
    const [ethinicityDrpData, setEthinicityDrpData] = useState([])
    const [eyeColoIDDrp, setEyeColoIDDrp] = useState([]);
    const [hairColorIDDrp, setHairColorIDDrp] = useState([]);
    const [SMTLocation, setSMTLocation] = useState([]);
    const [SMTType, setSMTType] = useState([]);
    const [reasonIdDrp, setReasonIdDrp] = useState([]);
    const [nameSearchValue, setNameSearchValue] = useState([]);

    const [MainIncidentID, setMainIncidentID] = useState('');
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", }),
    }

    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);
     // Onload Function
     useEffect(() => {
        if (localStoreArray) {
            console.log(localStoreArray)
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])


    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
            startRef3.current.setOpen(false);
        }
    };

    const colourStyles = {
        control: (styles) => ({
            ...styles,
            // backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
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
    };

    const [value, setValue] = useState({
        NameIDNumber: null,
        NameTypeID: null,
        NameReasonCodeID: null,
        LastName: null,
        MiddleName: null,
        FirstName: null,
        SuffixID: null,
        DateOfBirthFrom: null,
        DateOfBirthTo: null,
        SexID: null,
        RaceID: null,
        EthnicityID: null,
        HairColorID: null,
        EyeColorID: null,
        WeightFrom: null,
        WeightTo: null,
        SMTTypeID: null,
        SMTLocationID: null,
        SSN: null,
        SMT_Description: null,
        IncidentNumber: null,
        IncidentNumberTo: null,
        ReportedDate: null,
        ReportedDateTo: null,
        DateOfBirth: null,
        HeightFrom: null,
        HeightTo: null,
        AgencyID: LoginAgencyID,
    });

    const check_Validation_Error = () => {
        if (Comparision(value.WeightFrom, value.WeightTo, 'Weight') === 'true') {
            get_Name_Advance_Search();
        }
    }

    const get_Name_Advance_Search = async () => {
        fetchPostData("MasterName/Search_Name", value).then((res) => {
            if (res.length > 0) {
                console.log(res);
                setnameSearch(res); Reset();
                navigate('/namesearch');
            }
            else {
                setnameSearch([]); toastifyError("Data Not Available");
            }
        })
    }

    const Reset = () => {
        setValue({
            ...value,
            NameIDNumber: '',
            NameTypeID: '',
            NameReasonCodeID: '',
            LastName: '',
            MiddleName: '',
            FirstName: '',
            SuffixID: '',
            DateOfBirthFrom: '',
            DateOfBirthTo: '',
            SexID: '',
            RaceID: '',
            EthnicityID: '',
            HairColorID: '',
            EyeColorID: '',
            WeightFrom: '',
            WeightTo: '',
            SMTTypeID: '',
            SMTLocationID: '',
            SSN: '',
            SMT_Description: '',
            IncidentNumber: '',
            IncidentNumberTo: '',
            ReportedDate: '',
            ReportedDateTo: '',
            HeightFrom: '',
            DateOfBirth: '',
            HeightTo: '',
        });
        Reset_Null();
    }

    const Reset_Null = () => {
        setValue({
            ...value,
            NameIDNumber: null,
            NameTypeID: null,
            NameReasonCodeID: null,
            LastName: null,
            MiddleName: null,
            FirstName: null,
            SuffixID: null,
            DateOfBirthFrom: null,
            DateOfBirthTo: null,
            SexID: null,
            RaceID: null,
            EthnicityID: null,
            HairColorID: null,
            EyeColorID: null,
            WeightFrom: null,
            WeightTo: null,
            SMTTypeID: null,
            SMTLocationID: null,
            SSN: null,
            SMT_Description: null,
            IncidentNumber: null,
            IncidentNumberTo: null,
            ReportedDate: null,
            ReportedDateTo: null,
            HeightFrom: null,
            DateOfBirth: null,
            HeightTo: null,
        })
    }

    const OnClose = () => {
        Reset();
    }

    const handlChange = (e) => {
        if (e.target.name === 'SSN') {
            var ele = e.target.value.replace(/\D/g, '');
            if (ele.length === 9) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
                if (match) {
                    // console.log(match)
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
            } if (e.target.name === 'SSN') {
                return 'true';
            } if (e.target.name.length === 11) {
                return 'true'
            }
        } else if (e.target.name === 'IncidentNumber' || e.target.name === 'IncidentNumberTo') {
            var ele = e.target.value.replace(/[^a-zA-Z\s^0-9\s]/g, '');
            if (ele.length === 8) {
                var cleaned = ('' + ele).replace(/[^a-zA-Z\s^0-9\s]/g, '');
                var match = cleaned.match(/^(\d{2})(\d{6})$/);
                if (match) {
                    // console.log(match)
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2]
                    })
                }
            } else {
                ele = e.target.value.split("'").join('').replace(/[^0-9\s]/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else if (e.target.name === 'HeightFrom') {
            var ele = e.target.value
            if (ele.length === 3) {
                var cleaned = ('' + ele)?.replace(/\D/g, '');
                var match = cleaned?.match(/^(\d{1})(\d{2})$/);
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
            } else {
                ele = e.target.value.split("'").join('').replace(/\D/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else if (e.target.name === 'HeightTo') {
            var ele = e.target.value
            if (ele.length === 3) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var HeightFromVal = value?.HeightFrom?.split("'")?.join('')?.replace(/\D/g, '');
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
                // console.log(e.target.value.split("'").join('').replace(/\D/g, ''))
                ele = e.target.value?.split("'").join('').replace(/\D/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        }
        else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const get_SMTLocationID = (LoginAgencyID,id) => {
        const val = {
            AgencyID: LoginAgencyID,
            SMTTypeID: id
        }
        fetchPostData('SMTLocations/GetDataDropDown_SMTLocations', val).then((data) => {
            if (data) {
                setSMTLocation(Comman_changeArrayFormat(data, 'SMTLocationID', 'Description'))
            } else {
                setSMTLocation([]);
            }
        })
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'SMTTypeID') {
                get_SMTLocationID(e.value)
                setValue({
                    ...value,
                    [name]: e.value,
                    ['SMTLocationID']: null,
                })
            } else {
                setValue({
                    ...value,
                    [name]: e.value,
                })
            }
        } else {
            if (name === 'SMTTypeID') {
                setValue({
                    ...value,
                    [name]: null,
                    ['SMTLocationID']: null,
                });
                setSMTLocation([]);
            } else {
                setValue({
                    ...value,
                    [name]: null,
                })
            }
        }
    }

    const GetNameTypeIdDrp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('NameType/GetDataDropDown_NameType', val).then((data) => {
            if (data) {
                const id = data?.filter((val) => { if (val.NameTypeCode === "I") return val })
                if (id.length > 0) {
                    setValue(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].NameTypeID } })
                }
                setNameTypeIdDrp(threeColArray(data, 'NameTypeID', 'Description', 'NameTypeCode'))
            } else {
                setNameTypeIdDrp([]);
            }
        })
    };

    const GetSuffixIDDrp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('Suffix/GetDataDropDown_Suffix', val).then((data) => {
            if (data) {
                setsuffixIdDrp(Comman_changeArrayFormat(data, 'SuffixID', 'Description'))
            } else {
                setsuffixIdDrp([]);
            }
        })
    };

    const GetSexIDDrp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('DropDown/GetData_SexType', val).then((data) => {
            if (data) {
                setSexIdDrp(Comman_changeArrayFormat(data, 'SexCodeID', 'Description'))
            } else {
                setSexIdDrp([]);
            }
        })
    }

    const GetRaceIdDrp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('DropDown/GetData_RaceType', val).then((data) => {
            if (data) {
                setRaceIdDrp(Comman_changeArrayFormat(data, 'RaceTypeID', 'Description'))
            } else {
                setRaceIdDrp([]);
            }
        })
    }

    const getEthinicityDrp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('/DropDown/GetDataDropDown_Ethnicity', val).then((data) => {
            if (data) {
                setEthinicityDrpData(Comman_changeArrayFormat(data, 'EthnicityID', 'Description'));
            }
            else {
                setEthinicityDrpData([])
            }
        })
    };

    const GetColoIDDrp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        };
        fetchPostData("DropDown/GetData_DropDown_Color", val).then((data) => {
            if (data) {
                setEyeColoIDDrp(Comman_changeArrayFormat_With_Name(data, "ColorID", "ColorDescription", "EyeColorID"));
                setHairColorIDDrp(Comman_changeArrayFormat_With_Name(data, "ColorID", "ColorDescription", "HairColorID"));
            } else {
                setEyeColoIDDrp([]); setHairColorIDDrp([]);
            }
        });
    };

    const get_SMTTypeID = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('SMTTypes/GetDataDropDown_SMTTypes', val).then((data) => {
            if (data) {
                setSMTType(Comman_changeArrayFormat(data, 'SMTTypeID', 'Description'))
            } else {
                setSMTType([]);
            }
        })
    }

    useEffect(() => {
        GetNameTypeIdDrp(LoginAgencyID); GetSuffixIDDrp(LoginAgencyID); GetSexIDDrp(LoginAgencyID); GetRaceIdDrp(LoginAgencyID); getEthinicityDrp(LoginAgencyID); GetColoIDDrp(LoginAgencyID); get_SMTTypeID(LoginAgencyID);
    }, [LoginAgencyID]);

    useEffect(() => {
        GetReasonIdDrp(value.NameTypeID);
    }, [value.NameTypeID])

    const GetReasonIdDrp = (LoginAgencyID,id) => {
        const val = {
            AgencyID: LoginAgencyID,
            CategoryID: id,
        }
        fetchPostData('NameReasonCode/GetDataDropDown_NameReasonCode', val).then((data) => {
            if (data) {
                setReasonIdDrp(Comman_changeArrayFormat(data, 'NameReasonCodeID', 'Description'))
            } else {
                setReasonIdDrp([]);
            }
        })
    }

    // const get_NameSearch = async () => {
    //     fetchPostData("MasterName/Search_Name", value).then((data) => {
    //         if (data.length > 0) {
    //             setNameSearchValue(data);
    //         } else {
    //             setNameSearchValue([]); toastifyError("Data Not Available");
    //         }
    //     })
    // }

    return (
        <>

            <div class="section-body view_page_design pt-2">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 col-md-12 col-lg-12 " style={{ marginTop: '-20px' }}>
                                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Name  Search</p>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <fieldset className='fieldset' >
                                            <legend>Name Info </legend>
                                            <div className="row">
                                                <div class="col-6 col-md-3 col-lg-3">
                                                    <div className="text-field">
                                                        <input type="text" id='NameIDNumber' maxLength={11} name='NameIDNumber' value={value?.NameIDNumber} onChange={handlChange} />
                                                        <label className=''>Name ID</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-4 col-lg-3 " style={{ marginTop: '-2px' }}>
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='NameTypeID'
                                                            value={nameTypeIdDrp?.filter((obj) => obj.value === value?.NameTypeID)}
                                                            options={nameTypeIdDrp}
                                                            onChange={(e) => ChangeDropDown(e, 'NameTypeID')}
                                                            isClearable
                                                            placeholder="Select..."
                                                            styles={customStylesWithOutColor}
                                                        />
                                                        <label htmlFor=''>Name Type</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-5 col-lg-6 " style={{ marginTop: '-2px' }}>
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='NameReasonCodeID'
                                                            value={reasonIdDrp?.filter((obj) => obj.value === value?.NameReasonCodeID)}
                                                            options={reasonIdDrp}
                                                            onChange={(e) => ChangeDropDown(e, 'NameReasonCodeID')}
                                                            isClearable
                                                            placeholder="Select..."
                                                            isDisabled={value.NameTypeID ? false : true}
                                                            styles={customStylesWithOutColor}
                                                        />
                                                        <label htmlFor=''>Reason</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-4 col-lg-3 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" id='LastName' name='LastName' value={value?.LastName} onChange={handlChange} />
                                                        <label className=''>Last Name</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-4 col-lg-3 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" id='FirstName' name='FirstName' value={value?.FirstName} onChange={handlChange} />
                                                        <label className=''>First Name</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-4 col-lg-3 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" id='MiddleName' name='MiddleName' value={value?.MiddleName} onChange={handlChange} />
                                                        <label className=''>Middle Name</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-4 col-lg-3 " style={{ marginTop: '6px' }}>
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='SuffixID'
                                                            value={suffixIdDrp?.filter((obj) => obj.value === value?.SuffixID)}
                                                            options={suffixIdDrp}
                                                            onChange={(e) => ChangeDropDown(e, 'SuffixID')}
                                                            isClearable
                                                            placeholder="Select..."
                                                            styles={customStylesWithOutColor}
                                                        />
                                                        <label htmlFor=''>Suffix</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-4 col-lg-3 mb-1">
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            id='DateOfBirthFrom'
                                                            name='DateOfBirthFrom'
                                                            ref={startRef}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => {
                                                                setValue({
                                                                    ...value,
                                                                    ['DateOfBirthFrom']: date ? getShowingMonthDateYear(date) : null,
                                                                    // ['DateOfBirthTo']: getShowingMonthDateYear(new Date()),
                                                                })
                                                            }}
                                                            className=''
                                                            dateFormat="MM/dd/yyyy"
                                                            peekNextMonth
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            isClearable={value?.DateOfBirthFrom ? true : false}
                                                            selected={value?.DateOfBirthFrom && new Date(value?.DateOfBirthFrom)}
                                                            placeholderText={value?.DateOfBirthFrom ? value.DateOfBirthFrom : 'Select...'}
                                                            autoComplete='Off'
                                                            maxDate={new Date()}
                                                        />
                                                        <label htmlFor="" className='pt-1'>DOB From</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-4 col-lg-3 mb-1">
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            id='DateOfBirthTo'
                                                            name='DateOfBirthTo'
                                                            ref={startRef1}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => { setValue({ ...value, ['DateOfBirthTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                            className=''
                                                            dateFormat="MM/dd/yyyy"
                                                            peekNextMonth
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            isClearable={value?.DateOfBirthTo ? true : false}
                                                            selected={value?.DateOfBirthTo && new Date(value?.DateOfBirthTo)}
                                                            placeholderText={value?.DateOfBirthTo ? value.DateOfBirthTo : 'Select...'}
                                                            autoComplete='Off'
                                                            maxDate={new Date()}
                                                            minDate={value?.DateOfBirthFrom && new Date(value?.DateOfBirthFrom)}
                                                            disabled={value.DateOfBirthFrom ? false : true}
                                                        />
                                                        <label htmlFor="" className='pt-1'>DOB To</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-3 col-lg-3 mt-1">
                                                    <div className="text-field">
                                                        <input type="text" id='SSN' name='SSN' maxLength={9} value={value?.SSN} onChange={handlChange} />
                                                        <label className='pt-1'>SSN</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset className='fieldset '>
                                            <legend>Incident Information</legend>
                                            <div className="row">
                                                <div class="col-6 col-md-2 col-lg-3 mt-1">
                                                    <div className="text-field">
                                                        <input type="text" maxLength={9} id='IncidentNumber' name='IncidentNumber' value={value?.IncidentNumber} onChange={handlChange} />
                                                        <label className=''>Case ID From</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-2 col-lg-3 mt-1">
                                                    <div className="text-field">
                                                        <input type="text" maxLength={9} disabled={value.IncidentNumber ? false : true} id='IncidentNumberTo' name='IncidentNumberTo' value={value?.IncidentNumberTo} onChange={handlChange} />
                                                        <label className=''>Case ID To</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-4 col-lg-3 " style={{ marginTop: '-2px' }}>
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            id='ReportedDate'
                                                            name='ReportedDate'
                                                            ref={startRef2}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => {
                                                                setValue({
                                                                    ...value,
                                                                    ['ReportedDate']: date ? getShowingMonthDateYear(date) : null,
                                                                    ['ReportedDateTo']: getShowingMonthDateYear(new Date()),
                                                                })
                                                            }}
                                                            className=''
                                                            dateFormat="MM/dd/yyyy"
                                                            peekNextMonth
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            isClearable={value?.ReportedDate ? true : false}
                                                            selected={value?.ReportedDate && new Date(value?.ReportedDate)}
                                                            autoComplete='Off'
                                                            placeholderText={value?.ReportedDate ? value.ReportedDate : 'Select...'}
                                                            maxDate={new Date()}
                                                        />
                                                        <label htmlFor="" className='pt-1'>Reported From Date</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-4 col-lg-3 " style={{ marginTop: '-2px' }}>
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            id='ReportedDateTo'
                                                            name='ReportedDateTo'
                                                            ref={startRef3}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => { setValue({ ...value, ['ReportedDateTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                            selected={value?.ReportedDateTo && new Date(value?.ReportedDateTo)}
                                                            className=''
                                                            isClearable={value?.ReportedDateTo ? true : false}
                                                            dateFormat="MM/dd/yyyy"
                                                            peekNextMonth
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            autoComplete='Off'
                                                            minDate={value?.ReportedDate && new Date(value?.ReportedDate)}
                                                            maxDate={new Date()}
                                                            placeholderText={value?.ReportedDateTo ? value.ReportedDateTo : 'Select...'}
                                                            disabled={value?.ReportedDate ? false : true}
                                                        />
                                                        <label htmlFor="" className='pt-1'>Reported To Date</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset className='fieldset '>
                                            <legend>Physical Descriptor</legend>
                                            <div className="row">
                                                <div class="col-6 col-md-6 col-lg-3 ">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='SexID'
                                                            value={sexIdDrp?.filter((obj) => obj.value === value?.SexID)}
                                                            options={sexIdDrp}
                                                            onChange={(e) => ChangeDropDown(e, 'SexID')}
                                                            isClearable
                                                            placeholder="Select..."
                                                            styles={customStylesWithOutColor}
                                                        />
                                                        <label htmlFor=''>Gender</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 ">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='RaceID'
                                                            value={raceIdDrp?.filter((obj) => obj.value === value?.RaceID)}
                                                            options={raceIdDrp}
                                                            onChange={(e) => ChangeDropDown(e, 'RaceID')}
                                                            isClearable
                                                            placeholder="Select..."
                                                            styles={customStylesWithOutColor}
                                                        />
                                                        <label htmlFor=''>Race</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 ">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='EthnicityID'
                                                            value={ethinicityDrpData?.filter((obj) => obj.value === value?.EthnicityID)}
                                                            options={ethinicityDrpData}
                                                            onChange={(e) => ChangeDropDown(e, 'EthnicityID')}
                                                            isClearable
                                                            placeholder="Select..."
                                                            styles={customStylesWithOutColor}
                                                        />
                                                        <label htmlFor=''>Ethnicity</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 ">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            onChange={(e) => ChangeDropDown(e, 'HairColorID')}
                                                            name="HairColorID"
                                                            value={hairColorIDDrp?.filter((obj) => obj.value === value?.HairColorID)}
                                                            options={hairColorIDDrp}
                                                            isClearable
                                                            placeholder="Select..."
                                                            styles={customStylesWithOutColor}
                                                        />
                                                        <label htmlFor=''>Hair Color</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 mt-1 pt-1">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name="EyeColorID"
                                                            styles={customStylesWithOutColor}
                                                            value={eyeColoIDDrp?.filter((obj) => obj.value === value?.EyeColorID)}
                                                            options={eyeColoIDDrp}
                                                            onChange={(e) => ChangeDropDown(e, 'EyeColorID')}
                                                            isClearable
                                                            placeholder="Select..."
                                                            menuPlacement="top"
                                                        />
                                                        <label htmlFor=''>Eye Color</label>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3  d-flex" style={{ marginTop: '10px' }}>
                                                    <div class="text-field">
                                                        <input type="text" id='HeightFrom' name='HeightFrom' value={value?.HeightFrom} onChange={handlChange} maxLength={3} />
                                                        <label>Height From</label>
                                                    </div>
                                                    <div class="text-field ml-3">
                                                        <input type="text" id='HeightTo' name='HeightTo' value={value?.HeightTo} onChange={handlChange} maxLength={3} />
                                                        <label>Height To</label>
                                                    </div>
                                                    <div class="mt-3">
                                                        <label className='text-dark'>FT.</label>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 d-flex" style={{ marginTop: '10px' }}>
                                                    <div class="text-field ">
                                                        <input type="text" id='WeightFrom' name='WeightFrom' value={value?.WeightFrom} onChange={handlChange} maxLength={3} />
                                                        <label>Weight From</label>
                                                    </div>
                                                    <div class="text-field ml-3">
                                                        <input type="text" id='WeightTo' name='WeightTo' min={value?.WeightFrom} value={value?.WeightTo} onChange={handlChange} maxLength={3} />
                                                        <label>Weight To</label>
                                                    </div>
                                                    <div class="mt-3">
                                                        <label className='text-dark'>LBS.</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset className='fieldset '>
                                            <legend>SMT</legend>
                                            <div className="row">
                                                <div class="col-6 col-md-4 col-lg-3 ">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='SMTTypeID'
                                                            value={SMTType?.filter((obj) => obj.value === value?.SMTTypeID)}
                                                            isClearable
                                                            options={SMTType}
                                                            onChange={(e) => ChangeDropDown(e, 'SMTTypeID')}
                                                            placeholder="Select..."
                                                            styles={customStylesWithOutColor}
                                                            menuPlacement='top'
                                                        />
                                                        <label htmlFor=''>SMT Type</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-4 col-lg-3 ">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='SMTLocationID'
                                                            value={SMTLocation?.filter((obj) => obj.value === value?.SMTLocationID)}
                                                            isClearable
                                                            options={SMTLocation}
                                                            onChange={(e) => ChangeDropDown(e, 'SMTLocationID')}
                                                            placeholder="Select..."
                                                            isDisabled={value.SMTTypeID ? false : true}
                                                            styles={customStylesWithOutColor}
                                                        />
                                                        <label htmlFor=''>SMT Location</label>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-4 col-lg-6">
                                                    <div className="text-field">
                                                        <textarea id='SMT_Description' name='SMT_Description' value={value?.SMT_Description} onChange={handlChange} cols="30" rows="1" required></textarea>
                                                        <label>Description</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="btn-box text-right  mr-1 mb-2">
                            {/* <Link to={'/namesearch'}> */}
                            <button type="button" class="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error(); }}>Search</button>
                            {/* </Link> */}
                            <Link to={'/Search'}>
                                <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" onClick={() => { OnClose(); }}>Close</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NameSearchPage