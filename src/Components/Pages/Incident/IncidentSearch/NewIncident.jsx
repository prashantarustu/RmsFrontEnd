import React from 'react'
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { fetchData, ScreenPermision } from '../../../hooks/Api';
import { Three_Search_FilterWith_Date } from '../../../Filter/Filter';
import { useContext } from 'react';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { Decrypt_Id_Name, Encrypted_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../Common/Utility';
import Select from "react-select";
import '../../../../style/incident.css';
import IncidentModal from './IncidentModal';

const NewIncident = () => {
    // Filter Option
    const { setIncidentStatus, setShowIncPage, incidentRecentData, setIncidentRecentData, incidentRmsCfs, setIncidentRmsCfs } = useContext(AgencyContext)
    const [filterIncidentIdOption, setFilterIncidentIdOption] = useState('Contains')
    const [filterRmsCfsOption, setfilterRmsCfsOption] = useState('Contains')
    const [filterOccuredToOption, setFilterOccuredToOption] = useState('Contains')

    const [searchValue1, setSearchValue1] = useState('')
    const [searchValue2, setSearchValue2] = useState('')
    const [searchValue3, setSearchValue3] = useState('')
    const [incidentData, setIncidentData] = useState()
    const [IncidentFilterData, setIncidentFilterData] = useState();
    const [advancedSearch, setAdvancedSearch] = useState(false)


    useEffect(() => {
        getIncidentData(); setShowIncPage('home');
        sessionStorage.removeItem('IncidentId'); sessionStorage.removeItem('incidentStatus');
        sessionStorage.removeItem('OffenseCrimeId'); sessionStorage.removeItem('MasterNameID');
        sessionStorage.removeItem('NameID'); sessionStorage.removeItem('VictimNameID');
    }, [])


    const getIncidentData = async () => {
        fetchData('Incident/GetData_Incident').then((res) => {
            if (res) {
                setIncidentData(res); setIncidentFilterData(res)
            } else {
                setIncidentData(); setIncidentFilterData()
            }
        })
    }

    const columns = [
        {
            name: 'Incident',
            selector: (row) => row.IncidentNumber,
            sortable: true
        },
        {
            name: 'Occured To',
            selector: (row) => row.OccurredTo ? getShowingMonthDateYear(row.OccurredTo) : " ",
        },
        {
            name: 'Report Date/Time',
            selector: (row) => row.ReportedDate ? getShowingMonthDateYear(row.ReportedDate) : " ",
            sortable: true
        },
        {
            name: 'RMS CFS',
            selector: (row) => row.RMSCFSCode_Description,
            sortable: true
        },
        {
            name: 'Location',
            // selector: (row) => row.CrimeLocation,
            selector: (row) => <>{row?.CrimeLocation ? row?.CrimeLocation.substring(0, 40) : ''}{row?.CrimeLocation?.length > 40 ? '  . . .' : null} </>,

            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 35 }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, right: 40 }}>
                    <Link to='/incidenttab'
                        onClick={(e) => set_IncidentId(row)}
                        className="btn btn-sm bg-green text-white px-1 py-0 mr-1"><i className="fa fa-edit"></i>
                    </Link>
                    {/* <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#">
                        <i className="fa fa-trash"></i>
                    </Link> */}
                </div>
            </>
        }
    ]

    const set_IncidentId = (row) => {
        let newData = [...incidentRecentData];

        let currentItem = newData.find((item) => row.IncidentID === item.IncidentID);

        if (!currentItem) {
            newData.push(row);
        }
        setIncidentRecentData(newData)
        setIncidentStatus(true);
        sessionStorage.setItem('IncidentId', Encrypted_Id_Name(row.IncidentID, 'IForIncidentId'))
        sessionStorage.setItem('IncidentNumber', Encrypted_Id_Name(row.IncidentNumber, 'IForIncidentNumber'))
        sessionStorage.setItem('incidentStatus', true)
    }

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

    return (
        <>
            <div class="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 mb-2 text-right">
                                        <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => setAdvancedSearch(true)} data-toggle="modal" data-target="#AddMasterModal" >Advanced Search</button>
                                    </div>
                                    <div className="col-12 px-2">
                                        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0">Incident</p>
                                            <p className="p-0 m-0">
                                                <Link
                                                    to="/incidenttab"
                                                    onClick={() => {
                                                        sessionStorage.setItem('incidentStatus', false)
                                                        setIncidentStatus(false);
                                                        setShowIncPage('home'); sessionStorage.removeItem("InForIncidentNumber",)
                                                    }}
                                                    className="btn btn-sm bg-green text-white px-2 py-0"
                                                >
                                                    <i className="fa fa-plus"></i>
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <DataTable
                                    columns={columns}
                                    dense
                                    data={IncidentFilterData}
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
                                                    <div className="col-3">
                                                        <input type="text" onChange={(e) => {
                                                            setSearchValue1(e.target.value)
                                                            const result = Three_Search_FilterWith_Date(incidentData, e.target.value, searchValue2, searchValue3, filterIncidentIdOption, filterRmsCfsOption, filterOccuredToOption, 'IncidentNumber', 'RMSCFSCode_Description', 'OccurredTo')
                                                            setIncidentFilterData(result)
                                                        }} className='form-control' placeholder='Search By Incident ...' />
                                                    </div>
                                                    <div className='col-1'>
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
                                                    <div className="col-3">
                                                        <input type="text" onChange={(e) => {
                                                            setSearchValue2(e.target.value)
                                                            const result = Three_Search_FilterWith_Date(incidentData, searchValue1, e.target.value, searchValue3, filterIncidentIdOption, filterRmsCfsOption, filterOccuredToOption, 'IncidentNumber', 'RMSCFSCode_Description', 'OccurredTo')
                                                            setIncidentFilterData(result)
                                                        }} className='form-control' placeholder='Search By RMS CFS Code ...' />
                                                    </div>
                                                    <div className='col-1'>
                                                        <Dropdown>
                                                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
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
                                                            autoComplete="off"
                                                            placeholderText="Search By Occurred To Date "
                                                            selected={searchValue3}

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
                                                </div>
                                            </div>
                                        </>
                                    }
                                    subHeaderAlign='left'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {
                    advancedSearch &&
                    <>
                        {/* <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="incident-advanced-search" tabindex="-1" data-backdrop="false" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog  modal-xl" role="document">
                                <div className="modal-content" style={{ borderRadius: '10px' }}>
                                    <div class="modal-header px-3 p-2" style={{ backgroundColor: 'aliceblue' }}>
                                        <h5 class="modal-title">Incident Advance Search</h5>
                                        <button type="button" class="close btn-modal" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true" style={{ color: 'red', fontSize: '20px', }}>&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body" >
                                        <div className="m-1 ">
                                            <div className="row">
                                                <div className="col-12">
                                                    <fieldset className='fieldset' style={{marginTop:'-10px'}}>
                                                        <legend>Incident Report</legend>
                                                        <div className="row">
                                                            <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                                <div className="text-field">
                                                                    <input type="text" />
                                                                    <label className=''>Case From</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                                <div className="text-field">
                                                                    <input type="text" />
                                                                    <label className=''>Case To</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                                <div className="text-field">
                                                                    <input type="text" />
                                                                    <label className=''>Master Incident From</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                                <div className="text-field">
                                                                    <input type="text" />
                                                                    <label className=''>Master Incident To</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                                                <div className="dropdown__box">
                                                                    <Select
                                                                        styles={colourStyles}
                                                                        menuPlacement='top'
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' className='mt-0'>RMS CFS Range From</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                                                <div className="dropdown__box">
                                                                    <Select
                                                                        styles={colourStyles}
                                                                        menuPlacement='top'
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' className='mt-0'>RMS CFS Range To</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                                                <div className="dropdown__box">
                                                                    <DatePicker
                                                                        id='ActivityDateTime'
                                                                        name='ActivityDateTime'
                                                                        dateFormat="MM/dd/yyyy HH:mm"
                                                                        isClearable
                                                                        placeholderText={'Select...'}
                                                                        timeIntervals={1}
                                                                        timeCaption="Time"
                                                                        dropdownMode="select"
                                                                    />
                                                                    <label htmlFor="" className='pt-1'>Occurred From Date</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                                                <div className="dropdown__box">
                                                                    <DatePicker
                                                                        id='ActivityDateTime'
                                                                        name='ActivityDateTime'
                                                                        dateFormat="MM/dd/yyyy HH:mm"
                                                                        isClearable
                                                                        placeholderText={'Select...'}
                                                                        timeIntervals={1}
                                                                        timeCaption="Time"
                                                                        dropdownMode="select"
                                                                    />
                                                                    <label htmlFor="" className='pt-1'>Occurred To Date</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                                                <div className="dropdown__box">
                                                                    <DatePicker
                                                                        id='ActivityDateTime'
                                                                        name='ActivityDateTime'
                                                                        dateFormat="MM/dd/yyyy HH:mm"
                                                                        isClearable
                                                                        placeholderText={'Select...'}
                                                                        timeIntervals={1}
                                                                        timeCaption="Time"
                                                                        dropdownMode="select"
                                                                    />
                                                                    <label htmlFor="" className='pt-1'>Reported From Date</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                                                <div className="dropdown__box">
                                                                    <DatePicker
                                                                        id='ActivityDateTime'
                                                                        name='ActivityDateTime'
                                                                        dateFormat="MM/dd/yyyy HH:mm"
                                                                        isClearable
                                                                        placeholderText={'Select...'}
                                                                        timeIntervals={1}
                                                                        timeCaption="Time"
                                                                        dropdownMode="select"
                                                                    />
                                                                    <label htmlFor="" className='pt-1'>Reported To Date</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-2 mb-1 ">
                                                                <div className="dropdown__box">
                                                                    <Select
                                                                        styles={colourStyles}
                                                                        menuPlacement='top'
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' className='mt-0'>Pin Activity</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-2  ">
                                                                <div className="dropdown__box">
                                                                    <Select
                                                                        styles={colourStyles}
                                                                        menuPlacement='top'
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' className='mt-0'>Officer</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-1 ">
                                                                <div className="dropdown__box">
                                                                    <Select
                                                                        styles={colourStyles}
                                                                        menuPlacement='top'
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' className='mt-0'>Type Of Security</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-3 pt-1">
                                                                <div className="dropdown__box">
                                                                    <Select
                                                                        styles={colourStyles}
                                                                        menuPlacement='top'
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor='' className='mt-0'>Recieve Source</label>
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
                                                                styles={colourStyles}
                                                                menuPlacement='top'
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label htmlFor='' className='mt-0'>RMS Disposition</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                                        <div className="dropdown__box">
                                                            <DatePicker
                                                                id='ActivityDateTime'
                                                                name='ActivityDateTime'
                                                                dateFormat="MM/dd/yyyy HH:mm"
                                                                isClearable
                                                                placeholderText={'Select...'}
                                                                timeIntervals={1}
                                                                timeCaption="Time"
                                                                dropdownMode="select"
                                                            />
                                                            <label htmlFor="" className='pt-1'>Disposition From Date </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                                        <div className="dropdown__box">
                                                            <DatePicker
                                                                id='ActivityDateTime'
                                                                name='ActivityDateTime'
                                                                dateFormat="MM/dd/yyyy HH:mm"
                                                                isClearable
                                                                placeholderText={'Select...'}
                                                                timeIntervals={1}
                                                                timeCaption="Time"
                                                                dropdownMode="select"
                                                            />
                                                            <label htmlFor="" className='pt-1'>Disposition To Date </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-2">
                                                        <div className="dropdown__box">
                                                            <Select
                                                                styles={colourStyles}
                                                                menuPlacement='top'
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label htmlFor='' className='mt-0'>Exceptional Clearance</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                    <div className="btn-box text-right  mr-1 mb-2">
                                        <button type="button" class="btn btn-sm btn-success mr-1">Save</button>
                                        <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" >Close</button>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* <div id="incident-advanced-search">
                            <div className="card Agency">
                                <div className="card-body">
                                    <div className="row mb-1">
                                        <div className="col-12">
                                            <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                                                <p className="p-0 m-0">Incident Advanced Search</p>
                                                <p className="p-0 m-0">
                                                    <i className="fa fa-times close-icon" onClick={() => setAdvancedSearch(false)} />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <fieldset className='fieldset'>
                                                <legend>Incident Report</legend>
                                                <div className="row">
                                                    <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                        <div className="text-field">
                                                            <input type="text" />
                                                            <label className=''>Case From</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                        <div className="text-field">
                                                            <input type="text" />
                                                            <label className=''>Case To</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                        <div className="text-field">
                                                            <input type="text" />
                                                            <label className=''>Master Incident From</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                        <div className="text-field">
                                                            <input type="text" />
                                                            <label className=''>Master Incident To</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                                        <div className="dropdown__box">
                                                            <Select
                                                                styles={colourStyles}
                                                                menuPlacement='top'
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label htmlFor='' className='mt-0'>RMS CFS Range From</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                                        <div className="dropdown__box">
                                                            <Select
                                                                styles={colourStyles}
                                                                menuPlacement='top'
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label htmlFor='' className='mt-0'>RMS CFS Range To</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                                        <div className="dropdown__box">
                                                            <DatePicker
                                                                id='ActivityDateTime'
                                                                name='ActivityDateTime'
                                                                dateFormat="MM/dd/yyyy HH:mm"
                                                                isClearable
                                                                placeholderText={'Select...'}
                                                                timeIntervals={1}
                                                                timeCaption="Time"
                                                                dropdownMode="select"
                                                            />
                                                            <label htmlFor="" className='pt-1'>Occurred From Date</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                                        <div className="dropdown__box">
                                                            <DatePicker
                                                                id='ActivityDateTime'
                                                                name='ActivityDateTime'
                                                                dateFormat="MM/dd/yyyy HH:mm"
                                                                isClearable
                                                                placeholderText={'Select...'}
                                                                timeIntervals={1}
                                                                timeCaption="Time"
                                                                dropdownMode="select"
                                                            />
                                                            <label htmlFor="" className='pt-1'>Occurred To Date</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                                        <div className="dropdown__box">
                                                            <DatePicker
                                                                id='ActivityDateTime'
                                                                name='ActivityDateTime'
                                                                dateFormat="MM/dd/yyyy HH:mm"
                                                                isClearable
                                                                placeholderText={'Select...'}
                                                                timeIntervals={1}
                                                                timeCaption="Time"
                                                                dropdownMode="select"
                                                            />
                                                            <label htmlFor="" className='pt-1'>Reported From Date</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 ">
                                                        <div className="dropdown__box">
                                                            <DatePicker
                                                                id='ActivityDateTime'
                                                                name='ActivityDateTime'
                                                                dateFormat="MM/dd/yyyy HH:mm"
                                                                isClearable
                                                                placeholderText={'Select...'}
                                                                timeIntervals={1}
                                                                timeCaption="Time"
                                                                dropdownMode="select"
                                                            />
                                                            <label htmlFor="" className='pt-1'>Reported To Date</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-2 mb-1 ">
                                                        <div className="dropdown__box">
                                                            <Select
                                                                styles={colourStyles}
                                                                menuPlacement='top'
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label htmlFor='' className='mt-0'>Pin Activity</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-2  ">
                                                        <div className="dropdown__box">
                                                            <Select
                                                                styles={colourStyles}
                                                                menuPlacement='top'
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label htmlFor='' className='mt-0'>Officer</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 ">
                                                        <div className="dropdown__box">
                                                            <Select
                                                                styles={colourStyles}
                                                                menuPlacement='top'
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label htmlFor='' className='mt-0'>Type Of Security</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1">
                                                        <div className="dropdown__box">
                                                            <Select
                                                                styles={colourStyles}
                                                                menuPlacement='top'
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label htmlFor='' className='mt-0'>Recieve Source</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset className='fieldset mt-2'>
                                                <legend>RMS Disposition/Clearance Information</legend>
                                                <div className="row">
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-2">
                                                        <div className="dropdown__box">
                                                            <Select
                                                                styles={colourStyles}
                                                                menuPlacement='top'
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label htmlFor='' className='mt-0'>RMS Disposition</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                                        <div className="dropdown__box">
                                                            <DatePicker
                                                                id='ActivityDateTime'
                                                                name='ActivityDateTime'
                                                                dateFormat="MM/dd/yyyy HH:mm"
                                                                isClearable
                                                                placeholderText={'Select...'}
                                                                timeIntervals={1}
                                                                timeCaption="Time"
                                                                dropdownMode="select"
                                                            />
                                                            <label htmlFor="" className='pt-1'>Disposition From Date </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-1">
                                                        <div className="dropdown__box">
                                                            <DatePicker
                                                                id='ActivityDateTime'
                                                                name='ActivityDateTime'
                                                                dateFormat="MM/dd/yyyy HH:mm"
                                                                isClearable
                                                                placeholderText={'Select...'}
                                                                timeIntervals={1}
                                                                timeCaption="Time"
                                                                dropdownMode="select"
                                                            />
                                                            <label htmlFor="" className='pt-1'>Disposition To Date </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-6 col-lg-3 pt-1 mb-1 mt-2">
                                                        <div className="dropdown__box">
                                                            <Select
                                                                styles={colourStyles}
                                                                menuPlacement='top'
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label htmlFor='' className='mt-0'>Exceptional Clearance</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>

                                        </div>
                                    </div>
                                    <div className="row mt-3 text-right">
                                        <div className="col-12">
                                            <button type="button" className="btn btn-sm btn-success mx-2">Search</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </>
                }
            </div>
            <IncidentModal />
        </>
    )
}

export default NewIncident;