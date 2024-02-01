import React from 'react'
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { AddDeleteUpadate, fetchData, fetchPostData, ScreenPermision } from '../../hooks/Api';
import { One_Value_Search_Filter, Three_Search_FilterWith_Date } from '../../Filter/Filter';
import { useContext } from 'react';
import { AgencyContext } from '../../../Context/Agency/Index';
import { Decrypt_Id_Name, Encrypted_Id_Name, getShowingDateText, getShowingMonthDateYear, } from '../../Common/Utility';
import Select from "react-select";
import '../../../style/incident.css';
import { Comman_changeArrayFormat, } from '../../Common/ChangeArrayFormat';
import Loader from '../../Common/Loader';
import { toastifyError, toastifySuccess } from '../../Common/AlertMsg';

const Incident = () => {

    const { setIncidentStatus, get_IncidentTab_Count, setShowIncPage, incidentRecentData, setIncidentRecentData, exceptionalClearID, get_Incident_Count, GetDataExceptionalClearanceID, rmsDisposition, setRmsDisposition, getRmsDispositionID, incidentSearchData, setIncidentSearchData, localStoreArray, setLocalStoreArray, get_LocalStorage, incidentNumber, setIncidentNumber, deleteStoreData, storeData, setIncidentCount, setTabCount } = useContext(AgencyContext);

    // Filter Option
    const [filterIncidentIdOption, setFilterIncidentIdOption] = useState('Contains');
    const [filterRmsCfsOption, setfilterRmsCfsOption] = useState('Contains');
    const [filterOccuredToOption, setFilterOccuredToOption] = useState('Contains');
    const [searchValue1, setSearchValue1] = useState('');
    const [searchValue2, setSearchValue2] = useState('');
    const [searchValue3, setSearchValue3] = useState('');
    const [incidentData, setIncidentData] = useState();
    const [IncidentFilterData, setIncidentFilterData] = useState();
    const [advancedSearch, setAdvancedSearch] = useState(false);
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
    const [loder, setLoder] = useState(false);

    //Assign Incident 
    const [assignIncidentID, setAssignIncidentID] = useState('');
    const [officerPinData, setOfficerPinData] = useState();
    const [selectedRows, setSelectedRows] = useState([]);
    const [assignModalStatus, setAssignModalStatus] = useState(false);
    const [assignFilterData, setAssignFilterData] = useState([]);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');

    //DropDown
    const [headOfAgency, setHeadOfAgency] = useState([]);
    const [reciveSourceID, setReciveSourceID] = useState([]);
    const [rmsCfsID, setRmsCfsID] = useState([]);
    const [typeOfSecurityID, setTypeOfSecurityID] = useState([]);
    const [pinActivityID, setPinActivityID] = useState([]);

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage();
            // get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray.AgencyID && localStoreArray.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                setValue({ ...value, 'AgencyID': localStoreArray?.AgencyID });
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    const [value, setValue] = useState({
        'ReportedDate': getShowingDateText(new Date()),
        'ReportedDateTo': getShowingDateText(new Date()),
        'IncidentNumber': '', 'IncidentNumberTo': '', 'MasterIncidentNumber': '', 'MasterIncidentNumberTo': '', 'RMSCFSCodeList': '', 'OccurredFrom': '', 'OccurredFromTo': '', 'RMSDispositionId': '',
        'DispositionDate': '', 'DispositionDateTo': '', 'ReceiveSourceID': '', 'NIBRSClearanceID': '', 'IncidentPINActivityID': '', 'IncidentSecurityID': '', 'PINID': '',
        'AgencyID': '',
    });

    useEffect(() => {
        if (value.AgencyID) { getIncidentData(); }
        setShowIncPage('home');
    }, [value.AgencyID])

    const getIncidentData = async () => {
        fetchPostData('Incident/Search_Incident', value).then((res) => {
            if (res) {
                setIncidentData(res); setIncidentFilterData(res); setAdvancedSearch(false); setLoder(true);
                reset_Fields();
            } else {
                setLoder(true); setIncidentData([]); setIncidentFilterData([]);
            }
        })
    }

    const getIncidentSearchData = async () => {
        fetchPostData('Incident/Search_Incident', value).then((res) => {
            if (res.length > 0) {
                setIncidentData(res); setIncidentFilterData(res); setAdvancedSearch(false); setLoder(true);
                reset_Fields();
            } else {
                toastifyError("No Data Available"); setLoder(true); setIncidentData([]); setIncidentFilterData([]);
            }
        });
    }

    const onClick_Reset = () => {
        setValue({ ...value, 'ReportedDate': getShowingDateText(new Date()), 'ReportedDateTo': getShowingDateText(new Date()), });
    }

    const getScreenPermision = (LoginAgencyID, PinID) => {
        ScreenPermision("I034", LoginAgencyID, PinID).then(res => {
            if (res) {
                setEffectiveScreenPermission(res)
            } else {
                setEffectiveScreenPermission([])
            }
        });
    }

    const columns = [
        {
            width: "80px",
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, }}>
                    {
                        EffectiveScreenPermission ?
                            EffectiveScreenPermission[0]?.Changeok ?
                                <Link to='/incidenttab'
                                    onClick={(e) => set_IncidentId(row)}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1"><i className="fa fa-edit"></i>
                                </Link>
                                : <></>
                            : <Link to='/incidenttab'
                                onClick={(e) => set_IncidentId(row)}
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1"><i className="fa fa-edit"></i>
                            </Link>
                    }
                </div>
            </>
        },
        {
            width: '140px',
            name: 'Incident',
            selector: (row) => row.IncidentNumber,
            sortable: true
        },
        {
            width: '180px',
            name: 'Occurred  To',
            selector: (row) => row.OccurredTo ? getShowingDateText(row.OccurredTo) : " ",
        },
        {
            width: '180px',
            name: 'Reported Date/Time',
            selector: (row) => row.ReportedDate ? getShowingDateText(row.ReportedDate) : " ",
            sortable: true
        },
        {
            width: '150px',
            name: 'RMS CFS',
            selector: (row) => <>{row?.RMSCFSCode_Description ? row?.RMSCFSCode_Description.substring(0, 20) : ''}{row?.RMSCFSCode_Description?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'Location',
            selector: (row) => <>{row?.CrimeLocation ? row?.CrimeLocation.substring(0, 30) : ''}{row?.CrimeLocation?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
    ]

    const set_IncidentId = (row) => {
        // console.log(row)
        let newData = [...incidentRecentData];
        let currentItem = newData.find((item) => row.IncidentID === item.IncidentID);
        if (!currentItem) {
            newData.push(row);
        }
        setIncidentRecentData(newData);
        get_IncidentTab_Count(row.IncidentID)
        get_Incident_Count(row.IncidentID)
        setIncidentStatus(true);
        if (row.IncidentID) {
            storeData({ 'IncidentID': row.IncidentID, 'IncidentNumber': row.IncidentNumber, 'IncidentStatus': true, 'ReportedDate': row.ReportedDate })
            setIncidentNumber(row.IncidentNumber);
        }
    }

    const columns1 = [
        {
            name: 'Officer Name',
            selector: (row) => row.HeadOfAgency,
            sortable: true
        },
        // { 
        //     name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Assign</p>,
        //     cell: row => <>
        //         <div style={{ position: 'absolute', top: '5px' }}>
        //             <Link to=''
        //                 className="btn btn-sm bg-green text-white  px-1 py-0" onClick={() => { console.log(row) }} data-toggle="modal" data-target="#AddAssignModal" >Assign
        //             </Link>
        //         </div>
        //     </>,
        // },
    ]

    const handleRowSelected = (e) => {
        const oldArr = e.selectedRows
        const newArr = oldArr.map(obj => ({ 'PINID': obj.PINID, 'Officer_Name': obj.HeadOfAgency, 'RMSIncidentID': assignIncidentID, 'IncidentID': assignIncidentID }))
        // setSelectedRows(newArr[0])
        setSelectedRows(newArr);
        //-----------------------------testing---------------
        // const newArr = oldArr.map(obj => ({ ...obj, 'RMSIncidentID': assignIncidentID, 'IncidentID': assignIncidentID }))
    }

    const assign_Incident = () => {
        AddDeleteUpadate('Incident_FRW/Incident_FRWInsert', selectedRows).then((res) => {
            if (res.code != "ERR_BAD_REQUEST") {
                toastifySuccess('Incident Assign Successfully')
                setAssignModalStatus(false);
            } else {
                toastifyError('Error')
            }
        })
    }

    const reset_Fields = () => {
        setValue({
            ...value,
            // 'ReportedDate': null,
            // 'ReportedDateTo': null,
            'IncidentNumber': '',
            'IncidentNumberTo': '',
            'MasterIncidentNumber': '',
            'MasterIncidentNumberTo': '',
            'RMSCFSCodeList': '',
            'OccurredFrom': '',
            'OccurredFromTo': '',
            'RMSDispositionId': '',
            'DispositionDate': '',
            'DispositionDateTo': '',
            'ReceiveSourceID': '',
            'NIBRSClearanceID': '',
            'IncidentPINActivityID': '',
            'IncidentSecurityID': '',
            'PINID': '',
        });
        // setOnAdvanceSearch();
    }

    const HandleChange = (e,) => {
        if (e.target.name === 'IncidentNumber' || e.target.name === 'IncidentNumberTo') {
            var ele = e.target.value.replace(/[^a-zA-Z\s^0-9\s]/g, '');
            if (ele.length === 8) {
                var cleaned = ('' + ele).replace(/[^a-zA-Z\s^0-9\s]/g, '');
                var match = cleaned.match(/^(\d{2})(\d{6})$/);
                if (match) {
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
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const changeDropDown = (e, name) => {
        if (e) {
            if (name === 'RMSCFSCodeList') {
                const ids = []
                e.forEach(({ value }) => ids.push(value))
                setValue({
                    ...value,
                    [name]: JSON.stringify(ids)
                })
            } else {
                setValue({
                    ...value,
                    [name]: e.value,
                })
            }
        } else {
            setValue({
                ...value,
                [name]: null,
            })
        }
    }

    useEffect(() => {
        if (advancedSearch) {
            if (LoginAgencyID) {
                get_Head_Of_Agency(LoginAgencyID);
                GetDataReciveSourceID(LoginAgencyID); getRmsCfsCodeID(LoginAgencyID); GetDataTypeOfSecurity(LoginAgencyID); GetDataPinActivity(); getRmsDispositionID(LoginAgencyID); GetDataExceptionalClearanceID(LoginAgencyID);
            }
        }
    }, [LoginAgencyID, advancedSearch]);

    const getRmsCfsCodeID = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('Incident/GetData_RMSCFSCODE', val).then((data) => {
            if (data) {
                setRmsCfsID(Comman_changeArrayFormat(data, 'RMSCFSCodeID', 'RMSCFSCode'))
            } else {
                setRmsCfsID([]);
            }
        })
    }

    const get_Head_Of_Agency = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setOfficerPinData(data);
                setHeadOfAgency(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            }
            else {
                setHeadOfAgency([]);
            }
        });
    };

    const GetDataReciveSourceID = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('Incident/GetData_ReceiveSource', val).then((data) => {
            if (data) {
                setReciveSourceID(Comman_changeArrayFormat(data, 'ReceiveSourceID', 'ReceiveSourceCode'))
            } else {
                setReciveSourceID([]);
            }
        })
    }

    const GetDataTypeOfSecurity = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('IncidentSecurity/GetDataDropDown_IncidentSecurity', val).then((data) => {
            if (data) {
                setTypeOfSecurityID(Comman_changeArrayFormat(data, 'SecurityId', 'Description'))
            } else {
                setTypeOfSecurityID([]);
            }
        })
    }

    const GetDataPinActivity = () => {
        fetchData('PINActivity/GetData_PINActivityType').then((data) => {
            setPinActivityID(Comman_changeArrayFormat(data, 'ActivityTypeID', 'Description'));
        })
    }

    const click_AdvanceSearch = () => {
        setValue({ ...value, 'ReportedDate': '', 'ReportedDateTo': '', });
        setAdvancedSearch(true);
    }

    const colourStyles = {
        control: (styles) => ({
            ...styles,
            //  backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();
    const startRef4 = React.useRef();
    const startRef5 = React.useRef();
    const startRef6 = React.useRef();
    const startRef7 = React.useRef();
    const startRef8 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
            startRef3.current.setOpen(false);
            startRef4.current.setOpen(false);
            startRef5.current.setOpen(false);
            startRef6.current.setOpen(false);
            startRef7.current.setOpen(false);
            startRef8.current.setOpen(false);
        }
    };

    return (
        <>
            <div class="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row" style={{ marginTop: '-10px' }}>
                                    <div className="col-3 col-md-3 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                name='ReportedDate'
                                                id='ReportedDate'
                                                onChange={(date) => {
                                                    setValue({
                                                        ...value,
                                                        ['ReportedDate']: date ? getShowingDateText(date) : null,
                                                        ['ReportedDateTo']: getShowingDateText(new Date())
                                                    })
                                                }}
                                                selected={value.ReportedDate && new Date(value.ReportedDate)}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                isClearable={value?.ReportedDate ? true : false}
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                disabled={false}
                                                maxDate={new Date()}
                                                placeholderText='Select...'
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Reported From Date</label>
                                        </div>
                                    </div>
                                    <div className="col-3 col-md-3 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                name='ReportedDateTo'
                                                id='ReportedDateTo'
                                                onChange={(date) => { setValue({ ...value, ['ReportedDateTo']: date ? getShowingDateText(date) : null }) }}
                                                selected={value?.ReportedDateTo && new Date(value?.ReportedDateTo)}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                isClearable={value?.ReportedDateTo ? true : false}
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                minDate={new Date(value?.ReportedDate)}
                                                disabled={value?.ReportedDate ? false : true}
                                                maxDate={new Date()}
                                                placeholderText='Select...'
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Reported To Date</label>
                                        </div>
                                    </div>
                                    <div className="col-3 col-md-3 col-lg-3 mt-3">
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 mr-2" onClick={() => { getIncidentSearchData(); }}>
                                            Search
                                        </button>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 " onClick={() => { onClick_Reset(); }}>
                                            Reset
                                        </button>
                                    </div>
                                    <div className="col-3 col-md-3 col-lg-3 mt-3 text-right">
                                        <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { click_AdvanceSearch(); }} data-toggle="modal" data-target="#AddMasterModal">Advance Search</button>
                                    </div>
                                    <div className="col-12 px-2">
                                        <div className="bg-line mt-2  py-1 px-2 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0">Incident</p>
                                            <p className="p-0 m-0">
                                                {
                                                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                                                        <Link
                                                            to="/incidenttab"
                                                            onClick={() => {
                                                                deleteStoreData({ 'IncidentID': '', 'IncidentNumber': '', 'IncidentStatus': '' });
                                                                setIncidentStatus(false); setShowIncPage('home');
                                                                get_Incident_Count(''); get_IncidentTab_Count('');
                                                                setIncidentCount([]); setTabCount([]);
                                                            }}
                                                            className="btn btn-sm bg-green text-white px-2 py-0"
                                                        >
                                                            <i className="fa fa-plus"></i>
                                                        </Link>
                                                        : <></>
                                                        : <Link
                                                            to="/incidenttab"
                                                            onClick={() => {
                                                                deleteStoreData({ 'IncidentID': '', 'IncidentNumber': '', 'IncidentStatus': '' });
                                                                setIncidentStatus(false); setShowIncPage('home');
                                                                get_Incident_Count(''); get_IncidentTab_Count('');
                                                                setIncidentCount([]); setTabCount([]);
                                                            }}
                                                            className="btn btn-sm bg-green text-white px-2 py-0"
                                                        >
                                                            <i className="fa fa-plus"></i>
                                                        </Link>
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {
                                    loder ?
                                        <DataTable
                                            columns={columns}
                                            dense
                                            data={EffectiveScreenPermission ?
                                                EffectiveScreenPermission[0]?.DisplayOK ?
                                                    incidentSearchData.length > 0 ? incidentSearchData : IncidentFilterData ? IncidentFilterData : []
                                                    : ""
                                                : ""
                                            }
                                            // pagination
                                            // data={incidentSearchData.length > 0 ? incidentSearchData : IncidentFilterData ? IncidentFilterData : []}
                                            pagination
                                            paginationPerPage={'10'}
                                            paginationRowsPerPageOptions={[10, 15, 20]}
                                            highlightOnHover
                                            subHeader
                                            responsive
                                            showPaginationBottom={10}
                                            subHeaderComponent={
                                                <>
                                                    <div className="col-12 pl-0 ml-0">
                                                        <div className="row ">
                                                            <div className="col-3 col-md-3">
                                                                <input type="text" onChange={(e) => {
                                                                    setSearchValue1(e.target.value)
                                                                    const result = Three_Search_FilterWith_Date(incidentData, e.target.value, searchValue2, searchValue3, filterIncidentIdOption, filterRmsCfsOption, filterOccuredToOption, 'IncidentNumber', 'RMSCFSCode_Description', 'OccurredTo')
                                                                    setIncidentFilterData(result)
                                                                }} className='form-control' placeholder='Search By Incident ...' />
                                                            </div>
                                                            <div className='col-1 col-md-1'>
                                                                <Dropdown>
                                                                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                                        <i className="fa fa-filter"></i>
                                                                    </Dropdown.Toggle>
                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item onClick={() => setFilterIncidentIdOption('Contains')}> Contains
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => setFilterIncidentIdOption('is equal to')}>is equal to</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => setFilterIncidentIdOption('is not equal to ')}>is not equal to </Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => setFilterIncidentIdOption('Starts With')}>Starts With</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => setFilterIncidentIdOption('End with')}>End with</Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </div>
                                                            <div className="col-3">
                                                                <DatePicker
                                                                    dateFormat="MM/dd/yyyy"
                                                                    name='Date1'
                                                                    className='form-control datepicker-custom '
                                                                    onChange={(date) => {
                                                                        setSearchValue3(date)
                                                                        const result = Three_Search_FilterWith_Date(incidentData, searchValue1, searchValue2, date, filterIncidentIdOption, filterRmsCfsOption, filterOccuredToOption, 'IncidentNumber', 'RMSCFSCode_Description', 'OccurredTo')
                                                                        setIncidentFilterData(result)
                                                                    }}
                                                                    isClearable={searchValue3 ? true : false}
                                                                    autoComplete="off"
                                                                    placeholderText="Search By Occurred To Date "
                                                                    selected={searchValue3}
                                                                    peekNextMonth
                                                                    dropdownMode="select"
                                                                    maxDate={new Date()}
                                                                    showMonthDropdown
                                                                    showYearDropdown
                                                                />
                                                            </div>
                                                            <div className="col-1">
                                                                <Dropdown>
                                                                    <Dropdown.Toggle variant='primary' id="dropdown-basic">
                                                                        <i class="fa fa-filter"></i>
                                                                    </Dropdown.Toggle>
                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item onClick={() => setFilterOccuredToOption('Contains')}>Contain</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => setFilterOccuredToOption('is equal to')}>Is Equal to</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => setFilterOccuredToOption('is Not equal to')}>Is not Equal to</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => setFilterOccuredToOption('Start With')}>Start with</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => setFilterOccuredToOption('End With')}>End with</Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </div>
                                                            <div className="col-3 col-md-3">
                                                                <input type="text" onChange={(e) => {
                                                                    setSearchValue2(e.target.value)
                                                                    const result = Three_Search_FilterWith_Date(incidentData, searchValue1, e.target.value, searchValue3, filterIncidentIdOption, filterRmsCfsOption, filterOccuredToOption, 'IncidentNumber', 'RMSCFSCode_Description', 'OccurredTo')
                                                                    setIncidentFilterData(result)
                                                                }} className='form-control' placeholder='Search By RMS CFS Code ...' />
                                                            </div>
                                                            <div className='col-1 col-md-1'>
                                                                <Dropdown>
                                                                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                                        <i class="fa fa-filter"></i>
                                                                    </Dropdown.Toggle>
                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item onClick={() => setfilterRmsCfsOption('Contains')}>Contains</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => setfilterRmsCfsOption('is equal to')}>is equal to</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => setfilterRmsCfsOption('is not equal to ')}>is not equal to </Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => setfilterRmsCfsOption('Starts With')}>Starts With</Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => setfilterRmsCfsOption('End with')}>End with</Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            subHeaderAlign='left'
                                            noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                        />
                                        :
                                        <Loader />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {
                    advancedSearch &&
                    <>
                        <div class="modal top fade " style={{ background: "rgba(0,0,0, 0.5)" }} id="AddMasterModal" tabindex="-1" data-backdrop="false" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog  modal-xl" role="document">
                                <div className="modal-content" style={{ borderRadius: '10px', boxShadow: '0px 0px 3px floralwhite' }}>
                                    <div class="modal-header px-3 p-2" style={{ backgroundColor: 'aliceblue', boxShadow: '0px 0px 2px dimgray' }}>
                                        <h5 class="modal-title">Incident Advance Search</h5>
                                        <button type="button" class="close btn-modal" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true" style={{ color: 'red', fontSize: '20px', }}>&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <div className="m-1 ">
                                            <div className="row">
                                                <div className="col-12">
                                                    <fieldset className='fieldset' style={{ marginTop: '-10px' }}>
                                                        <legend>Incident Report</legend>
                                                        <div className="row">
                                                            <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                                <div className="text-field">
                                                                    <input type="text" id='IncidentNumber' maxLength={9} name='IncidentNumber' value={value?.IncidentNumber} onChange={HandleChange} />
                                                                    <label className=''>Case From</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                                <div className="text-field">
                                                                    <input type="text" id='IncidentNumberTo' maxLength={9} name='IncidentNumberTo' value={value?.IncidentNumberTo} onChange={HandleChange} />
                                                                    <label className=''>Case To</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                                <div className="text-field">
                                                                    <input type="text" id='MasterIncidentNumber' name='MasterIncidentNumber' value={value?.MasterIncidentNumber} onChange={HandleChange} />
                                                                    <label className=''>Master Incident From</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                                <div className="text-field">
                                                                    <input type="text" id='MasterIncidentNumberTo' name='MasterIncidentNumberTo' value={value?.MasterIncidentNumberTo} onChange={HandleChange} />
                                                                    <label className=''>Master Incident To</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-6 pt-1 mb-1 mt-1">
                                                                <div className="dropdown__box">
                                                                    <Select
                                                                        name='RMSCFSCodeList'
                                                                        // styles={colourStyles}
                                                                        defaultValue={[]}
                                                                        // value={rmsCfsID?.filter((obj) => obj.value === value?.RMSCFSCodeList)}
                                                                        options={rmsCfsID}
                                                                        isClearable
                                                                        isMulti
                                                                        onChange={(e) => changeDropDown(e, 'RMSCFSCodeList')}
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' className='mt-0'>RMS CFS Range </label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                                                <div className="dropdown__box">
                                                                    <DatePicker
                                                                        id='OccurredFrom'
                                                                        name='OccurredFrom'
                                                                        ref={startRef2}
                                                                        onKeyDown={onKeyDown}
                                                                        onChange={(date) => { setValue({ ...value, ['OccurredFrom']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                        dateFormat="MM/dd/yyyy"
                                                                        isClearable={value?.OccurredFrom ? true : false}
                                                                        selected={value?.OccurredFrom && new Date(value?.OccurredFrom)}
                                                                        maxDate={new Date()}
                                                                        placeholderText={'Select...'}
                                                                        showDisabledMonthNavigation
                                                                        autoComplete="off"
                                                                        showYearDropdown
                                                                        showMonthDropdown
                                                                        dropdownMode="select"
                                                                    />
                                                                    <label htmlFor="" className='pt-1'>Occurred From Date</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                                                <div className="dropdown__box">
                                                                    <DatePicker
                                                                        id='OccurredFromTo'
                                                                        name='OccurredFromTo'
                                                                        ref={startRef3}
                                                                        onKeyDown={onKeyDown}
                                                                        onChange={(date) => { setValue({ ...value, ['OccurredFromTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                        dateFormat="MM/dd/yyyy"
                                                                        isClearable={value?.OccurredFromTo ? true : false}
                                                                        disabled={value?.OccurredFrom ? false : true}
                                                                        selected={value?.OccurredFrom && new Date(value?.OccurredFrom)}
                                                                        minDate={new Date(value?.OccurredFrom)}
                                                                        maxDate={new Date()}
                                                                        placeholderText={'Select...'}
                                                                        showDisabledMonthNavigation
                                                                        autoComplete="off"
                                                                        showYearDropdown
                                                                        showMonthDropdown
                                                                        dropdownMode="select"
                                                                    />
                                                                    <label htmlFor="" className='pt-1'>Occurred To Date</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                                                <div className="dropdown__box">
                                                                    <DatePicker
                                                                        name='ReportedDate'
                                                                        id='ReportedDate'
                                                                        onChange={(date) => {
                                                                            setValue({
                                                                                ...value,
                                                                                ['ReportedDate']: date ? getShowingDateText(date) : null,
                                                                                ['ReportedDateTo']: getShowingDateText(new Date())
                                                                            })
                                                                        }}
                                                                        selected={value?.ReportedDate && new Date(value?.ReportedDate)}
                                                                        dateFormat="MM/dd/yyyy"
                                                                        timeInputLabel
                                                                        isClearable={value?.ReportedDate ? true : false}
                                                                        peekNextMonth
                                                                        showMonthDropdown
                                                                        showYearDropdown
                                                                        dropdownMode="select"
                                                                        autoComplete='Off'
                                                                        disabled={false}
                                                                        maxDate={new Date()}
                                                                        placeholderText='Select...'
                                                                    />
                                                                    <label htmlFor="" className='pt-1'>Reported From Date</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                                                <div className="dropdown__box">
                                                                    <DatePicker
                                                                        name='ReportedDateTo'
                                                                        id='ReportedDateTo'
                                                                        onChange={(date) => { setValue({ ...value, ['ReportedDateTo']: date ? getShowingDateText(date) : null }) }}
                                                                        selected={value?.ReportedDateTo && new Date(value?.ReportedDateTo)}
                                                                        dateFormat="MM/dd/yyyy"
                                                                        timeInputLabel
                                                                        isClearable={value?.ReportedDateTo ? true : false}
                                                                        peekNextMonth
                                                                        showMonthDropdown
                                                                        showYearDropdown
                                                                        dropdownMode="select"
                                                                        autoComplete='Off'
                                                                        minDate={new Date(value?.ReportedDate)}
                                                                        disabled={value?.ReportedDate ? false : true}
                                                                        maxDate={new Date()}
                                                                        placeholderText='Select...'
                                                                    />
                                                                    <label htmlFor="" className='pt-1'>Reported To Date</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-2 mb-1 ">
                                                                <div className="dropdown__box">
                                                                    <Select
                                                                        name='IncidentPINActivityID'
                                                                        styles={colourStyles}
                                                                        value={pinActivityID?.filter((obj) => obj.value === value?.IncidentPINActivityID)}
                                                                        options={pinActivityID}
                                                                        isClearable
                                                                        onChange={(e) => changeDropDown(e, 'IncidentPINActivityID')}
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' className='mt-0'>Pin Activity</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-2  ">
                                                                <div className="dropdown__box">
                                                                    <Select
                                                                        name='PINID'
                                                                        styles={colourStyles}
                                                                        menuPlacement='top'
                                                                        value={headOfAgency?.filter((obj) => obj.value === value?.PINID)}
                                                                        isClearable
                                                                        options={headOfAgency}
                                                                        onChange={(e) => changeDropDown(e, 'PINID')}
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' className='mt-0'>Officer</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-1 ">
                                                                <div className="dropdown__box">
                                                                    <Select
                                                                        name='IncidentSecurityID'
                                                                        styles={colourStyles}
                                                                        value={typeOfSecurityID?.filter((obj) => obj.value === value?.IncidentSecurityID)}
                                                                        options={typeOfSecurityID}
                                                                        isClearable
                                                                        onChange={(e) => changeDropDown(e, 'IncidentSecurityID')}
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' className='mt-0'>Type Of Security</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-1">
                                                                <div className="dropdown__box">
                                                                    <Select
                                                                        name='ReceiveSourceID'
                                                                        value={reciveSourceID?.filter((obj) => obj.value === value?.ReceiveSourceID)}
                                                                        isClearable
                                                                        options={reciveSourceID}
                                                                        menuPlacement='top'
                                                                        onChange={(e) => changeDropDown(e, 'ReceiveSourceID')}
                                                                        placeholder="Select..."
                                                                        styles={colourStyles}
                                                                    />
                                                                    <label htmlFor='' className='mt-0'>How Reported</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                            </div>
                                            <fieldset className='fieldset mt-2'>
                                                <legend>RMS Disposition/Clearance Information</legend>
                                                <div className="row">
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-2">
                                                        <div className="dropdown__box">
                                                            <Select
                                                                name='RMSDispositionId'
                                                                value={rmsDisposition?.filter((obj) => obj.value === value?.RMSDispositionId)}
                                                                isClearable
                                                                options={rmsDisposition}
                                                                onChange={(e) => changeDropDown(e, 'RMSDispositionId')}
                                                                placeholder="Select..."
                                                                styles={colourStyles}
                                                            />
                                                            <label htmlFor='' className='mt-0'>RMS Disposition</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                                        <div className="dropdown__box">
                                                            <DatePicker
                                                                id='DispositionDate'
                                                                name='DispositionDate'
                                                                ref={startRef6}
                                                                onKeyDown={onKeyDown}
                                                                onChange={(date) => { setValue({ ...value, ['DispositionDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                dateFormat="MM/dd/yyyy"
                                                                isClearable={value?.DispositionDate ? true : false}
                                                                selected={value?.DispositionDate && new Date(value?.DispositionDate)}
                                                                maxDate={new Date()}
                                                                placeholderText={'Select...'}
                                                                showDisabledMonthNavigation
                                                                autoComplete="off"
                                                                showYearDropdown
                                                                showMonthDropdown
                                                                dropdownMode="select"
                                                            />
                                                            <label htmlFor="" className='pt-1'>Disposition From Date </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                                        <div className="dropdown__box">
                                                            <DatePicker
                                                                id='DispositionDateTo'
                                                                name='DispositionDateTo'
                                                                ref={startRef7}
                                                                onKeyDown={onKeyDown}
                                                                onChange={(date) => { setValue({ ...value, ['DispositionDateTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                dateFormat="MM/dd/yyyy"
                                                                isClearable={value?.DispositionDateTo ? true : false}
                                                                disabled={value?.DispositionDate ? false : true}
                                                                selected={value?.DispositionDateTo && new Date(value?.DispositionDateTo)}
                                                                maxDate={new Date()}
                                                                minDate={new Date(value?.DispositionDate)}
                                                                placeholderText={'Select...'}
                                                                showDisabledMonthNavigation
                                                                autoComplete="off"
                                                                showYearDropdown
                                                                showMonthDropdown
                                                                dropdownMode="select"
                                                            />
                                                            <label htmlFor="" className='pt-1'>Disposition To Date </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-2">
                                                        <div className="dropdown__box">
                                                            <Select
                                                                name='NIBRSClearanceID'
                                                                value={exceptionalClearID?.filter((obj) => obj.value === value?.NIBRSClearanceID)}
                                                                isClearable
                                                                options={exceptionalClearID}
                                                                onChange={(e) => changeDropDown(e, 'NIBRSClearanceID')}
                                                                placeholder="Select..."
                                                                styles={colourStyles}
                                                            />
                                                            <label htmlFor='' className='mt-0'>Exceptional Clearance</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                    <div className="btn-box text-right  mr-1 mb-2">
                                        <button type="button" class="btn btn-sm btn-success mr-1" onClick={() => { getIncidentSearchData(); }}>Search</button>
                                        <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" onClick={() => { reset_Fields(); }} >Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
                {
                    assignModalStatus &&
                    <>
                        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="AddAssignModal" tabindex="-1" data-backdrop="false" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                                <div className="modal-content">
                                    <div class="modal-header px-3 p-2" style={{ backgroundColor: 'aliceblue', boxShadow: '0px 0px 2px dimgray' }}>
                                        <h5 class="modal-title text-dark text-bold">Officer List</h5>
                                        <button type="button" class="close btn-modal" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true" style={{ color: 'red', fontSize: '20px', }}>&times;</span>
                                        </button>
                                    </div>
                                    <div className="box text-center px-2">
                                        <div className="col-12 ">
                                            <DataTable
                                                dense
                                                columns={columns1}
                                                data={assignFilterData.length > 0 ? assignFilterData : officerPinData}
                                                selectableRows
                                                onSelectedRowsChange={handleRowSelected}
                                                pagination
                                                selectableRowsHighlight
                                                highlightOnHover
                                                subHeader
                                                subHeaderComponent={
                                                    <>
                                                        <div className="col-12 pl-0 ml-0">
                                                            <div className="row ">
                                                                <div className="col-4 col-md-6">
                                                                    <input type="text" onChange={(e) => {
                                                                        const result = One_Value_Search_Filter(officerPinData, e.target.value, filterIncidentIdOption, 'HeadOfAgency')
                                                                        setAssignFilterData(result)
                                                                    }} className='form-control' placeholder='Search By Name...' />
                                                                </div>
                                                                <div className='col-1 col-md-1'>
                                                                    <Dropdown>
                                                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                                            <i className="fa fa-filter"></i>
                                                                        </Dropdown.Toggle>
                                                                        <Dropdown.Menu>
                                                                            <Dropdown.Item onClick={() => setFilterIncidentIdOption('Contains')}>Contains</Dropdown.Item>
                                                                            <Dropdown.Item onClick={() => setFilterIncidentIdOption('is equal to')}>is equal to</Dropdown.Item>
                                                                            <Dropdown.Item onClick={() => setFilterIncidentIdOption('is not equal to ')}>is not equal to </Dropdown.Item>
                                                                            <Dropdown.Item onClick={() => setFilterIncidentIdOption('Starts With')}>Starts With</Dropdown.Item>
                                                                            <Dropdown.Item onClick={() => setFilterIncidentIdOption('End with')}>End with</Dropdown.Item>
                                                                        </Dropdown.Menu>
                                                                    </Dropdown>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                }
                                            />
                                        </div>
                                        {
                                            selectedRows.length > 0 &&
                                            <>
                                                <div className="btn-box text-right  mr-1 mb-2">
                                                    <button type="button" class="btn  btn-lg btn-success mr-1 text-white" onClick={() => { assign_Incident(); }}>
                                                        Assign
                                                    </button>
                                                </div>
                                            </>
                                        }
                                        {/* <div className="btn-box text-right  mr-1 mb-2">
                                            <button type="button" class="btn  btn-lg btn-success mr-1 text-white" onClick={() => { assign_Incident(); }}>
                                                Assign
                                            </button>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div >
        </>
    )
}

export default Incident;