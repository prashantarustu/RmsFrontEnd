import React, { useContext, useEffect, useState } from 'react'
import { AgencyContext } from '../../../../Context/Agency/Index';
import { Decrypt_Id_Name, Encrypted_Id_Name, getShowingMonthDateYear } from '../../../Common/Utility';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import { RequiredFieldSpaceNotAllow } from '../../Agency/AgencyValidation/validators';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Comman_changeArrayFormat, Comman_changeArrayFormat_With_Name, threeColArray } from '../../../Common/ChangeArrayFormat';
import { toastifyError } from '../../../Common/AlertMsg';
import { Comparision } from '../../PersonnelCom/Validation/PersonnelValidation';

const NameSearch = () => {

    const { nameStatus, setNameStatus, localStoreArray, setLocalStoreArray, get_LocalStorage, setIncStatus, updateCount, setUpdateCount, nameSearchData, setNameSearchData, nameSearch, setnameSearch, deleteStoreData, get_Name_Count } = useContext(AgencyContext);

    const [nameadvancedSearch, setNameAdvancedSearch] = useState(false);

    const [nameSearchValue, setNameSearchValue] = useState([]);

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
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray.AgencyID && localStoreArray.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    const [value, setValue] = useState({
        AgencyID: "",
        NameIDNumber: "",
        NameTypeID: "",
        NameReasonCodeID: "",
        LastName: "",
        MiddleName: "",
        FirstName: "",
        SuffixID: "",
        DateOfBirthFrom: "",
        DateOfBirthTo: "",
        SexID: "",
        RaceID: "",
        EthnicityID: "",
        HairColorID: "",
        EyeColorID: "",
        WeightFrom: "",
        WeightTo: "",
        SMTTypeID: "",
        SMTLocationID: "",
        SSN: "",
        SMT_Description: "",
        IncidentNumber: "",
        IncidentNumberTo: "",
        ReportedDate: "",
        ReportedDateTo: "",
        DateOfBirth: "",
        HeightFrom: "",
        HeightTo: "",
    });

    useEffect(() => {
        setValue({ ...value, 'AgencyID': LoginAgencyID })
    }, [LoginAgencyID]);

    const check_Validation_Error = () => {
        if (Comparision(value.WeightFrom, value.WeightTo, 'Weight') === 'true') {
            get_Name_Advance_Search();
        }
    }

    useEffect(() => {
        GetNameTypeIdDrp(LoginAgencyID); GetSuffixIDDrp(LoginAgencyID); GetSexIDDrp(LoginAgencyID); GetRaceIdDrp(LoginAgencyID); getEthinicityDrp(LoginAgencyID); GetColoIDDrp(LoginAgencyID); get_SMTTypeID(LoginAgencyID);
    }, [LoginAgencyID]);

    useEffect(() => {
        GetReasonIdDrp(value.NameTypeID);
    }, [value.NameTypeID])

    const GetNameTypeIdDrp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
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
            AgencyID: LoginAgencyID,
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
            AgencyID: LoginAgencyID,
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
            AgencyID: LoginAgencyID,
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
            AgencyID: LoginAgencyID,
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

    const get_SMTLocationID = (id) => {
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

    const get_SMTTypeID = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('SMTTypes/GetDataDropDown_SMTTypes', val).then((data) => {
            if (data) {
                setSMTType(Comman_changeArrayFormat(data, 'SMTTypeID', 'Description'))
            } else {
                setSMTType([]);
            }
        })
    }

    const GetReasonIdDrp = (id) => {
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

    const get_NameSearch = async () => {
        fetchPostData("MasterName/Search_Name", value).then((data) => {
            if (data.length > 0) {
                setNameSearchValue(data);
            } else {
                setNameSearchValue([]); toastifyError("Data Not Available");
            }
        })
    }

    const get_Name_Advance_Search = async () => {
        fetchPostData("MasterName/Search_Name", value).then((res) => {
            if (res.length > 0) {
                console.log(res);
                setNameSearchValue(res); setNameAdvancedSearch(false); Reset();
            }
            else {
                setNameSearchValue([]); toastifyError("Data Not Available");
            }
        })
    }

    const columns = [
        // {
        //     name: 'NameID',
        //     selector: (row) => row.NameID,
        //     sortable: true
        // },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, }}>
                    {
                        <Link to={'/nametab?page=mastername'} onClick={(e) => set_Edit_Value(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                            <i className="fa fa-edit"></i>
                        </Link>
                    }
                </div>
            </>
        },
        {
            name: 'LastName',
            // selector: (row) => row.LastName,
            selector: (row) => <>{row?.LastName ? row?.LastName.substring(0, 10) : ''}{row?.LastName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'FirstName',
            // selector: (row) => row.FirstName,
            selector: (row) => <>{row?.FirstName ? row?.FirstName.substring(0, 10) : ''}{row?.FirstName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'MiddleName',
            // selector: (row) => row.MiddleName,
            selector: (row) => <>{row?.MiddleName ? row?.MiddleName.substring(0, 10) : ''}{row?.MiddleName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'SSN',
            selector: (row) => row.SSN,
            sortable: true
        },
        {
            name: 'Address',
            // selector: (row) => row.Address,
            selector: (row) => <>{row?.Address ? row?.Address.substring(0, 50) : ''}{row?.Address?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'IsAlias',
            // selector: (row) => row.Address,
            selector: (row) => row.IsAlias,
            sortable: true
        },

    ]

    const set_Edit_Value = (e, row) => {
        let newData = [...nameSearchData];
        let currentItem = newData.find((item) => row.MasterNameID === item.MasterNameID);

        if (!currentItem) {
            newData.push(row);
        }
        setNameSearchData(newData);
        if (row.MasterNameID) {
            setNameStatus(true)
            store_NameID(row.MasterNameID, true);
        }
        setIncStatus(true);
        setUpdateCount(updateCount + 1);
    }

    const store_NameID = (MasterNameID, NameStatus) => {
        const val = {
            Value: "",
            UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
            Key: JSON.stringify({ 'MasterNameID': MasterNameID, 'NameStatus': NameStatus }),
        }
        AddDeleteUpadate('LocalStorage/ObjectInsert_LocalStorage', val).then((res) => {
            if (res?.success) {
                setLocalStoreArray(pre => { return { ...pre, ['MasterNameID']: MasterNameID, ['NameStatus']: NameStatus } });
            }
        })
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

    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row  ">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row">
                                            <div className="col-12  text-right">
                                                {/* <Link to={''}>
                                                    <button className="btn btn-sm bg-green text-white px-2 py-1" data-toggle="modal" data-target="#AddNameAdvance">Advanced Search</button>
                                                </Link> */}
                                                {/* <div className="col-12 col-md-12 col-lg-12 mt-3 text-right">
                                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { setNameAdvancedSearch(true); Reset() }} data-toggle="modal" data-target="#AddMasterModal">Advanced Search</button>
                                                </div> */}
                                                <div className="bg-line text-white py-1 p-0 px-2 d-flex justify-content-between align-items-center mb-3">
                                                    <p className="p-0 m-0">Name Search</p>
                                                </div>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-4 ">
                                                <div class="text-field">
                                                    <input type="text" name='LastName' value={value.LastName} onChange={handlChange} />
                                                    <label>Last Name</label>
                                                </div>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-4 ">
                                                <div class="text-field">
                                                    <input type="text" name='FirstName' value={value.FirstName} onChange={handlChange} />
                                                    <label>First Name</label>
                                                </div>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-4 ">
                                                <div class="text-field">
                                                    <input type="text" name='MiddleName' value={value.MiddleName} onChange={handlChange} />
                                                    <label>Middle Name</label>
                                                </div>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-4 pt-1 ">
                                                <div className="dropdown__box ">
                                                    <DatePicker
                                                        id='DateOfBirth'
                                                        name='DateOfBirth'
                                                        className=''
                                                        dateFormat="MM/dd/yyyy"
                                                        isClearable
                                                        onChange={(date) => { setValue({ ...value, ['DateOfBirth']: date ? getShowingMonthDateYear(date) : null }) }}
                                                        selected={value?.DateOfBirth && new Date(value?.DateOfBirth)}
                                                        placeholderText={value?.DateOfBirth ? value.DateOfBirth : 'Select...'}
                                                        peekNextMonth
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        maxDate={new Date()}
                                                    />
                                                    <label htmlFor="" className='pt-1'>DOB</label>
                                                </div>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                <div class="text-field">
                                                    <input type="text" name='SSN' value={value.SSN} onChange={handlChange} maxLength={9} />
                                                    <label>SSN</label>
                                                </div>
                                            </div>
                                            <div className="  col-12 col-md-12  col-lg-4 text-right" style={{ marginTop: '22px' }}>
                                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={get_NameSearch} >Search</button>
                                                <Link to={'/dashboard-page'}>
                                                    <button type="button" className="btn btn-sm btn-success mr-1"   >Close</button>
                                                </Link>
                                                <button className="btn btn-sm bg-green text-white" onClick={() => { setNameAdvancedSearch(true); Reset() }} data-toggle="modal" data-target="#AddMasterModal">Advance Search</button>
                                            </div>
                                            <div className="col-12  mt-2">
                                                <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                                    <p className="p-0 m-0">Name</p>
                                                    <p className="p-0 m-0">
                                                        <Link to={'/nametab?page=mastername'} onClick={() => {
                                                            deleteStoreData({ 'NameID': '', 'MasterNameID': '', 'NameStatus': '', });
                                                            setNameStatus(false);
                                                            setIncStatus(false);
                                                            get_Name_Count('0');
                                                        }} className="btn btn-sm bg-green text-white px-2 py-0" >
                                                            <i className="fa fa-plus"></i>
                                                        </Link>
                                                    </p>
                                                </div>
                                                <div className="row">
                                                    <div className="col-12 ">
                                                        <DataTable
                                                            dense
                                                            columns={columns}
                                                            data={nameSearch?.length > 0 ? nameSearch : nameSearchValue}
                                                            pagination
                                                            selectableRowsHighlight
                                                            highlightOnHover
                                                            paginationPerPage={'5'}
                                                            paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    nameadvancedSearch &&
                    <>
                        <div class="modal top fade " style={{ background: "rgba(0,0,0, 0.5)" }} id="AddMasterModal" tabindex="-1" data-backdrop="false" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog  modal-xl" role="document">
                                <div className="modal-content" style={{ borderRadius: '10px', boxShadow: '0px 0px 3px floralwhite' }}>
                                    <div class="modal-header px-3 p-2" style={{ backgroundColor: 'aliceblue', boxShadow: '0px 0px 2px dimgray' }}>
                                        <h5 class="modal-title">Name Advance Search</h5>
                                        <button type="button" class="close btn-modal" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true" style={{ color: 'red', fontSize: '20px', }}>&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <div className="m-1 ">
                                            <div className="row">
                                                <div className="col-12">
                                                    <fieldset className='fieldset' style={{ marginTop: '-12px' }}>
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
                                    <div className="btn-box text-right mb-1 " >
                                        <button type="button" class="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error(); }}>Search</button>
                                        {/* <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" onClick={() => { OnClose(); }}>Close</button> */}
                                        <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" >Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default NameSearch


