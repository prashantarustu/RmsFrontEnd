import React from 'react'
import { Link } from "react-router-dom";
import DataTable from 'react-data-table-component';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { fetchData, ScreenPermision } from '../../hooks/Api';
import { Three_Search_FilterWith_Date } from '../../Filter/Filter';
import { useContext } from 'react';
import { AgencyContext } from '../../../Context/Agency/Index';
import { Decrypt_Id_Name, Encrypted_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../Common/Utility';
import Select from "react-select";

const IncidentSearch = () => {

    const { setIncidentStatus, setShowIncPage, incidentRecentData, setIncidentRecentData, incidentRmsCfs, setIncidentRmsCfs } = useContext(AgencyContext);
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
            selector: (row) => <>{row?.CrimeLocation ? row?.CrimeLocation.substring(0, 50) : ''}{row?.CrimeLocation?.length > 40 ? '  . . .' : null} </>,

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
        // sessionStorage.setItem('IncidentId', Encrypted_Id_Name(row.IncidentID, 'IForIncidentId'))
        // sessionStorage.setItem('IncidentNumber', Encrypted_Id_Name(row.IncidentNumber, 'IForIncidentNumber'))
        // sessionStorage.setItem('incidentStatus', true)
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
            <div className="section-body view_page_design pt-2">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0">Incident Report</p>

                                        </div>
                                        <div className="row mt-2">
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
                                            <div class="col-6 col-md-6 col-lg-3  mt-1">
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
                                            <div class="col-6 col-md-6 col-lg-3  mt-1">
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
                                            <div class="col-6 col-md-6 col-lg-3  ">
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
                                            <div class="col-6 col-md-6 col-lg-3  ">
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
                                            <div class="col-6 col-md-6 col-lg-3 mt-1 ">
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
                                            <div class="col-6 col-md-6 col-lg-3 mt-1 ">
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
                                        <div className=" mt-2">
                                            <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                                <p className="p-0 m-0">RMS Disposition/Clearance Information</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div class="col-6 col-md-6 col-lg-3  mt-2">
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
                                            <div class="col-6 col-md-6 col-lg-3  mt-1">
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
                                            <div class="col-6 col-md-6 col-lg-3  mt-1">
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
                                            <div class="col-6 col-md-6 col-lg-3  mt-2">
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
                                            <div className=" text-right col-12 col-md-12  col-lg-12  pt-1 ">
                                                <button type="button" className="btn btn-sm btn-success  mr-1" data-dismiss="modal"  >Search</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                        <p className="p-0 m-0">Incident Search</p>
                                        <p className="p-0 m-0">
                                            <Link to={''} className="btn btn-sm bg-green text-white px-2 py-0" >
                                                <i className="fa fa-plus"></i>
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                                <div className="row ">
                                    <div className="col-12 ">
                                        <DataTable
                                            dense
                                            // columns={columns}
                                            // data={nameSearchValue}
                                            pagination
                                            selectableRowsHighlight
                                            highlightOnHover
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default IncidentSearch