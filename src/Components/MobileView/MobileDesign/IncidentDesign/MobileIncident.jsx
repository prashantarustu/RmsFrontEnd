import React, { useEffect } from 'react'
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { Three_Search_FilterWith_Date } from '../../../Filter/Filter';
import { useContext } from 'react';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { fetchPostData, ScreenPermision } from '../../../hooks/Api';
import { Decrypt_Id_Name, Encrypted_Id_Name, getShowingDateText, getShowingMonthDateYear, tableCustomStyles } from '../../../Common/Utility';



const MobileIncident = () => {

    const { setIncidentStatus, get_IncidentTab_Count, setShowIncPage, incidentRecentData, setIncidentRecentData, exceptionalClearID, get_Incident_Count, GetDataExceptionalClearanceID, rmsDisposition, setRmsDisposition, getRmsDispositionID, incidentSearchData, setIncidentSearchData, localStoreArray, setLocalStoreArray, get_LocalStorage, incidentNumber, setIncidentNumber, deleteStoreData, storeData, setIncidentCount, setTabCount } = useContext(AgencyContext);
    const [filterIncidentIdOption, setFilterIncidentIdOption] = useState('Contains');
    const [filterRmsCfsOption, setfilterRmsCfsOption] = useState('Contains');
    const [filterOccuredToOption, setFilterOccuredToOption] = useState('Contains');
    const [searchValue1, setSearchValue1] = useState('');
    const [searchValue2, setSearchValue2] = useState('');
    const [searchValue3, setSearchValue3] = useState('');
    const [searchValue4, setSearchValue4] = useState('');
    const [incidentList, setIncidentList] = useState();
    const [IncidentFilterData, setIncidentFilterData] = useState();
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
    const [FromDate, setFromDate] = useState();
    const [ToDate, setToDate] = useState();

    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const [value, setValue] = useState({
        'ReportedDate': getShowingDateText(new Date()),
        'ReportedDateTo': getShowingDateText(new Date()),
        'IncidentNumber': '', 'IncidentNumberTo': '', 'MasterIncidentNumber': '', 'MasterIncidentNumberTo': '', 'RMSCFSCodeList': '', 'OccurredFrom': '', 'OccurredFromTo': '', 'RMSDispositionId': '',
        'DispositionDate': '', 'DispositionDateTo': '', 'ReceiveSourceID': '', 'NIBRSClearanceID': '', 'IncidentPINActivityID': '', 'IncidentSecurityID': '', 'PINID': '',
        'AgencyID': '',
    });

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
                setValue({ ...value, 'AgencyID': localStoreArray?.AgencyID });
                setLoginPinID(localStoreArray?.PINID);
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

 

   

  

   
   

    useEffect(() => {
        get_Incident_List(); getRmsDispositionID(); GetDataExceptionalClearanceID();
    }, []);

    const get_Incident_List = () => {
        const val = {
            PINID: '',
        }
        fetchPostData('Incident_FRW/GetData_Incident_FRWOfficerList', val).then((res) => {
            if (res) {
                setIncidentList(res); setIncidentFilterData(res)
            }
            else { setIncidentList([]); setIncidentFilterData([]) }
        })
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
    // Incident_FRW/GetData_IncidentFRWList
    const columns = [
        {
            name: 'Action',
            cell: row => <>
                <div className="div">
                    <Link to={'/mobile-incident'} onClick={(e) => { set_FRW_IncidentId(row) }} className="btn btn-sm bg-green text-white" data-toggle="modal" data-target="" >
                        <i className="fa fa-edit"></i>
                    </Link>
                </div>
            </>,
            grow: 0,
        },
        {
            name: 'Incident Number',
            selector: (row) => row.IncidentNumber,
            sortable: true
        },
        {
            name: 'Crime Location',
            selector: (row) => <>{row?.CrimeLocation ? row?.CrimeLocation.substring(0, 20) : ''}{row?.CrimeLocation?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'Occurred To',
            selector: (row) => row.OccurredTo ? getShowingDateText(row.OccurredTo) : " ",
            sortable: true
        },
        {
            name: 'Reported Date',
            selector: (row) => row.ReportedDate ? getShowingDateText(row.ReportedDate) : '',
            sortable: true
        },
    ]

    const set_FRW_IncidentId = (row) => {
      
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



    return (
        <>
            <div class="section-body view_page_design">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency" style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0', }}>
                            <div className="card-body px-2">
                                <div className="bg-line text-white py-0  px-0 d-flex " style={{ marginTop: '-12px', borderRadius: '5px' }}>
                                    <p className="p-0 m-0 pl-3 d-flex align-items-center col-4" style={{ fontSize: '18px', }}>
                                        My Incident
                                    </p>
                                    <div class="col-6 col-md-6 col-lg-3  " style={{ marginTop: '-5px' }}>
                                        <div className="text-mobile">
                                            <DatePicker
                                                id='FromDate'
                                                name='FromDate'
                                                className=' name-datepicker'
                                                dateFormat="MM/dd/yyyy"
                                                onChange={(date) => { setFromDate(date); setValue({ ...value, ['FromDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                                // timeInputLabel
                                                isClearable={value?.FromDate ? true : false}
                                                placeholderText={value?.FromDate ? value?.FromDate : 'Select From Date...'}
                                                selected={FromDate}
                                                // showTimeSelect
                                                timeIntervals={1}
                                                timeCaption="Time"
                                                dropdownMode="select"
                                                disabled={false}
                                                maxDate={new Date()}
                                            />
                                        </div>
                                    </div>
                                    <div class="col-6 col-md-6 col-lg-3 " style={{ marginTop: '-5px' }}>
                                        <div className="text-mobile">
                                            <DatePicker
                                                name='ToDate'
                                                id='ToDate'
                                                className=' name-datepicker'
                                                onChange={(date) => { setValue({ ...value, ['ToDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                                selected={value?.ToDate && new Date(value?.ToDate)}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                isClearable={value?.ToDate ? true : false}
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                // minDate={new Date(value?.ToDate)}
                                                // disabled={value?.ToDate ? false : true}
                                                disabled={false}
                                                maxDate={new Date()}
                                                placeholderText={value?.ToDate ? value?.ToDate : 'Select To Date...'}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-2 col-md-2 col-lg-2  text-right  pt-2 mt-1 mb-1">
                                        <Link to={''}>
                                            <button className="btn btn-sm bg-green text-white px-2 py-1 mr-2 new-button">
                                                Search
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                                <div className="px-2 mt-1 mobile-datatable">
                                    <DataTable
                                        columns={columns}
                                        dense
                                        data={IncidentFilterData}
                                        pagination
                                        paginationPerPage={'5'}
                                        paginationRowsPerPageOptions={[5]}
                                        highlightOnHover
                                        subHeader
                                        responsive
                                        customStyles={tableCustomStyles}
                                        // className=' mobile-datatable'
                                        showPaginationBottom={5}
                                        subHeaderComponent={
                                            <>
                                                <div className="col-12  mt-1">
                                                    <div className="row ">
                                                        <div className="col-3 col-md-3 text-mobile" style={{ marginTop: '-6px' }}>
                                                            <input type="text" onChange={(e) => {
                                                                setSearchValue1(e.target.value)
                                                                const result = Three_Search_FilterWith_Date(incidentList, e.target.value, searchValue2, searchValue3, filterIncidentIdOption, filterRmsCfsOption, filterOccuredToOption, 'IncidentNumber', 'CrimeLocation', 'ReportedDate')
                                                                setIncidentFilterData(result)
                                                            }} className='form-control ' placeholder='Search By Incident ...' />
                                                        </div>
                                                        <div className='col-1 col-md-1'>
                                                            <Dropdown>
                                                                <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{ fontSize: '18px', marginTop: '-6px' }}>
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
                                                        <div className="col-3 text-mobile" style={{ marginTop: '-6px' }}>

                                                            <input type="text" onChange={(e) => {
                                                                setSearchValue2(e.target.value)
                                                                const result = Three_Search_FilterWith_Date(incidentList, searchValue1, e.target.value, searchValue3, filterIncidentIdOption, filterRmsCfsOption, filterOccuredToOption, 'IncidentNumber', 'CrimeLocation', 'ReportedDate')
                                                                setIncidentFilterData(result)
                                                            }} className='form-control' placeholder='Search By CrimeLocation ...' />
                                                        </div>
                                                        <div className="col-1">
                                                            <Dropdown>
                                                                <Dropdown.Toggle variant='primary' id="dropdown-basic" style={{ fontSize: '18px', marginTop: '-6px' }}>
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
                                                        <div className="col-3 col-md-3   text-mobile" style={{ marginTop: '-6px' }}>
                                                            <DatePicker
                                                                dateFormat="MM/dd/yyyy"
                                                                name='Date1'
                                                                className='form-control pin-datepicker'
                                                                onChange={(date) => {
                                                                    setSearchValue3(date)
                                                                    const result = Three_Search_FilterWith_Date(incidentList, searchValue1, searchValue2, date, filterIncidentIdOption, filterRmsCfsOption, filterOccuredToOption, 'IncidentNumber', 'CrimeLocation', 'ReportedDate')
                                                                    setIncidentFilterData(result)
                                                                }}
                                                                autoComplete="off"
                                                                placeholderText="Search By ReportedDate "
                                                                selected={searchValue3}

                                                            />
                                                        </div>
                                                        <div className='col-1 col-md-1'>
                                                            <Dropdown>
                                                                <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{ fontSize: '18px', marginTop: '-6px' }}>
                                                                    <i className="fa fa-filter"></i>
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
                                </div>
                                <div className="col-12 col-md-12 col-lg-12  text-right" style={{ marginTop: '-10px', marginBottom: '-16px' }}>
                                    <Link to={'/mobile-incident'}>
                                        <button onClick={() => {
                                                                deleteStoreData({ 'IncidentID': '', 'IncidentNumber': '', 'IncidentStatus': '' });
                                                                setIncidentStatus(false); setShowIncPage('home');
                                                                get_Incident_Count(''); get_IncidentTab_Count('');
                                                                setIncidentCount([]); setTabCount([]);
                                                            }} className="btn btn-sm bg-green text-white px-2 py-1 mr-2 new-button">
                                            Add
                                        </button>
                                    </Link>
                                    <Link to={'/incident-dashboard'}>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 mr-2 new-button">
                                            Close
                                        </button>
                                    </Link>
                                    {/* <button className="btn btn-sm bg-green text-white px-2 py-1 new-button">
                                        Edit
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default MobileIncident;

export const customStyles = {
    header: {
        style: {
            minHeight: '56px',
        },
    },
    headRow: {
        style: {
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            marginTop: "8px"
        },
    },
    headCells: {
        style: {
            '&:not(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                fontSize: '18px',
                fontWeight: 'bold',
                paddingLeft: '0 8px',
                justifyContent: 'center',
            },
        },
    },
    cells: {
        style: {
            '&:not(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                fontSize: '18px',
                paddingLeft: '0 8px',
                justifyContent: 'center',
            },
        },
    },
    row: {
        style: {
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            marginTop: "8px"
        },
    },
};
