import React, { useEffect, useRef, useState } from 'react'
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, colourStyles, customStylesWithOutColor, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, } from '../../../../Common/Utility';
import { Link } from 'react-router-dom';
import { fetchPostData } from '../../../../hooks/Api';
import { useReactToPrint } from 'react-to-print';
import { toastifyError } from '../../../../Common/AlertMsg';
import DataTable from 'react-data-table-component';
import Select from "react-select";
import Location from '../../../../Location/Location';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useContext } from 'react';

const MasterIncident = () => {
    
    const {localStoreArray, setLocalStoreArray, get_LocalStorage } = useContext(AgencyContext)

    const [verifyIncident, setverifyIncident] = useState(false);
    const [reportedData, setReportedData] = useState([]);
    const [incidentData, setIncidentData] = useState([]);
    const [masterReportData, setMasterReportData] = useState([]);
    const [cadCfsCodeID, setCadCfsCodeID] = useState([]);
    const [rmsCfsID, setRmsCfsID] = useState([]);


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
    const [value, setValue] = useState({
        'IncidentNumber': null,
        'IncidentNumberTo': null,
        'ReportedDate': null,
        'ReportedDateTo': null,
        'OccurredFrom': null,
        'OccurredTo': null,
        'AgencyID':LoginAgencyID
    });
    useEffect(() => {
        get_Incident_Report(); getIncidentCurrentData();
    }, [])

    const get_Incident_Report = () => {
        const val = {
            'IncidentID': MainIncidentID,
            'AgencyID':LoginAgencyID
        }
        fetchPostData('Report/GetData_ReportIncident', val).then((res) => {
            if (res.length > 0) {
                console.log(res)
                setReportedData(res); setverifyIncident(false);
            }
            else {
                setverifyIncident(false); setReportedData([]);
            }
        })
    }

    useEffect(() => {
        if (incidentData?.length > 0) {
            setverifyIncident(true);
        }
    }, [incidentData]);

    const getIncidentCurrentData = async () => {
        const val = {
            'IncidentNumber': null,
            'IncidentNumberTo': null,
            'ReportedDate': getShowingWithOutTime(new Date()),
            'ReportedDateTo': getShowingWithOutTime(new Date()),
            'OccurredFrom': null,
            'OccurredTo': null,
            'AgencyID': LoginAgencyID
        }
        fetchPostData('Report/GetData_MasterReport', val).then((res) => {
            if (res.length > 0) {
                console.log(res)
                // console.log(JSON.parse(res[0]?.Incident[0]?.Offence))
                setIncidentData(res[0].Incident); setMasterReportData(res[0])
            } else {
            }
        });
    }

    const getIncidentSearchData = async () => {
        if (value?.IncidentNumber?.trim()?.length > 0 || value?.ReportedDate?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || value?.OccurredFrom?.trim()?.length > 0 || value?.OccurredTo?.trim()?.length > 0 || value?.IncidentNumberTo?.trim()?.length > 0) {
            fetchPostData('Report/GetData_MasterReport', value).then((res) => {
                if (res.length > 0) {
                    // console.log(JSON.parse(res[0]?.Incident[0]?.Offence))
                    setIncidentData(res[0].Incident); setMasterReportData(res[0])
                } else {
                    toastifyError("Data Not Available");
                }
            });
        } else {
            toastifyError("Please Enter Details");
        }
    }

    const handleChange = (e) => {
        if (e.target.name === 'IncidentNumber' || e.target.name === 'IncidentNumberTo') {
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
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const resetFields = () => {
        setValue({
            ...value,
            'IncidentNumber': "",
            'IncidentNumberTo': "",
            'ReportedDate': "",
            'ReportedDateTo': "",
            'OccurredFrom': "",
            'OccurredTo': "",
        })
    }

    const columns = [
        {
            width: '140px',
            name: 'Incident',
            selector: (row) => row.IncidentNumber,
            sortable: true
        },
        {
            width: '180px',
            name: 'Occured To',
            selector: (row) => row.OccurredTo ? getShowingMonthDateYear(row.OccurredTo) : " ",
        },
        {
            width: '180px',
            name: 'Report Date/Time',
            selector: (row) => row.ReportedDate ? getShowingMonthDateYear(row.ReportedDate) : " ",
            sortable: true
        },
        {
            width: '140px',
            name: 'RMS CFS',
            selector: (row) => <>{row?.RMSCFSCode_Description ? row?.RMSCFSCode_Description.substring(0, 20) : ''}{row?.RMSCFSCode_Description?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'Location',
            selector: (row) => <>{row?.CrimeLocation ? row?.CrimeLocation.substring(0, 20) : ''}{row?.CrimeLocation?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
    ]

    const componentRef = useRef();

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onAfterPrint: () => { '' }
    })
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
                                <div className="row">
                                    <div className="col-12 col-md-12 col-lg-12 mb-1 " >
                                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Incident Master Report</p>
                                        </div>
                                    </div>
                                    <div className="col-3  col-md-3 col-lg-2  " style={{ marginTop: '5px' }}>
                                        <div className="text-field">
                                            <input type="text" name='IncidentNumber' maxLength={9} id='IncidentNumber' value={value.IncidentNumber} onChange={handleChange} className='' />
                                            <label htmlFor="">Incident Number From</label>
                                        </div>
                                    </div>
                                    <div className="col-3  col-md-3 col-lg-2  " style={{ marginTop: '5px' }}>
                                        <div className="text-field">
                                            <input type="text" name='IncidentNumberTo' value={value.IncidentNumberTo} maxLength={9} id='IncidentNumberTo' className='' onChange={handleChange} />
                                            <label htmlFor="">Incident Number To</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6 col-md-6 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                name='ReportedDate'
                                                id='ReportedDate'
                                                ref={startRef}
                                                onKeyDown={onKeyDown}
                                                onChange={(date) => { setValue({ ...value, ['ReportedDate']: date ? getShowingDateText(date) : null }) }}
                                                selected={value?.ReportedDate && new Date(value?.ReportedDate)}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                isClearable={value?.ReportedDate ? true : false}
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                // disabled
                                                maxDate={new Date()}
                                                placeholderText='Select...'
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Reported From Date</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                name='ReportedDateTo'
                                                id='ReportedDateTo'
                                                onChange={(date) => { setValue({ ...value, ['ReportedDateTo']: date ? getShowingDateText(date) : null }) }}
                                                selected={value?.ReportedDateTo && new Date(value?.ReportedDateTo)}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                ref={startRef1}
                                                onKeyDown={onKeyDown}
                                                isClearable={value?.ReportedDateTo ? true : false}
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                disabled={value?.ReportedDate ? false : true}
                                                maxDate={new Date()}
                                                placeholderText='Select...'
                                                minDate={new Date(value?.ReportedDate)}
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Reported To Date</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                name='OccurredFrom'
                                                id='OccurredFrom'
                                                ref={startRef2}
                                                onKeyDown={onKeyDown}
                                                onChange={(date) => { setValue({ ...value, ['OccurredFrom']: date ? getShowingDateText(date) : null }) }}
                                                selected={value?.OccurredFrom && new Date(value?.OccurredFrom)}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                isClearable={value?.OccurredFrom ? true : false}
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                // disabled
                                                maxDate={new Date()}
                                                placeholderText='Select...'
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Occurred From Date</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-3 mb-1">

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
                                                selected={value?.OccurredFromTo && new Date(value?.OccurredFromTo)}
                                                minDate={new Date(value?.OccurredFrom)}
                                                maxDate={new Date()}
                                                placeholderText={'Select...'}
                                                showDisabledMonthNavigation
                                                autoComplete="off"
                                                showYearDropdown
                                                showMonthDropdown
                                                dropdownMode="select"
                                            />
                                            <label htmlFor="" className='pt-1 pl-0'>Occurred To Date</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-6 mt-2">
                                        <div className="dropdown__box ">
                                            <Select
                                                name='CADCFSCodeID'
                                                value={cadCfsCodeID?.filter((obj) => obj.value === value?.CADCFSCodeID)}
                                                isClearable
                                                options={cadCfsCodeID}
                                                // onChange={(e) => ChangeDropDown(e, 'CADCFSCodeID')}
                                                placeholder="Select..."
                                                styles={customStylesWithOutColor}
                                            />
                                            <label htmlFor="" className='pl-0'>FBI Code</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-6 mt-2 ">
                                        <div className="dropdown__box ">
                                            <Select
                                                name='RMSCFSCodeID'
                                                styles={colourStyles}
                                                value={rmsCfsID?.filter((obj) => obj.value === value?.RMSCFSCodeID)}
                                                isClearable
                                                options={rmsCfsID}
                                                // onChange={(e) => ChangeDropDown(e, 'RMSCFSCodeID')}
                                                placeholder="Select..."
                                            />
                                            <label htmlFor="">RMS CFS Code/Descirption</label>
                                        </div>
                                    </div>
                                    {/* <div className="col-12  col-md-12 col-lg-12 mt-2">
                                        <div className="text-field">
                                            <Location {...{ value, setValue }} col='CrimeLocation' locationID='crimelocationid' check={true} verify={value.IsVerify}  />
                                            <label htmlFor="" className='pt-1'>Crime Location</label>
                                        </div>
                                    </div> */}
                                </div>

                                <div className="col-12 col-md-12 col-lg-12 mt-1 text-right">
                                    {/* <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { }}>Get Incident</button> */}
                                    {/* <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { setverifyIncident(true); }}>Show Report</button> */}
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { getIncidentSearchData(); }}>Show Report</button>
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { setverifyIncident(false); setIncidentData([]); resetFields(); }}>Clear</button>
                                    <Link to={`${reportedData.length > 0 ? '/incidenttab' : '/Reports'}`}>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                    </Link>
                                </div>
                                {/* <DataTable
                                        columns={columns}
                                        dense
                                        data={incidentData}
                                        pagination
                                        paginationPerPage={'10'}
                                        paginationRowsPerPageOptions={[10, 15, 20]}
                                        highlightOnHover
                                        subHeader
                                        responsive
                                        showPaginationBottom={10}
                                        subHeaderAlign='left'
                                    /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* for 1 table */}
            {
                verifyIncident ?
                    reportedData.length > 0 ?
                        <>
                            <div className="col-12 col-md-12 col-lg-12 pt-2  px-2" >
                                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                    <p className="p-0 m-0 d-flex align-items-center">Incident Master Report</p>
                                    <div style={{ marginLeft: 'auto' }}>
                                        <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                            <i className="fa fa-print" onClick={printForm}></i>
                                        </Link>
                                        {/* <Link to={''} className="btn btn-sm bg-green  text-white px-2 py-0"  >
                                            <i className="fa fa-file"></i>
                                        </Link> */}
                                    </div>
                                </div>
                            </div>
                            <div className="container mt-1" ref={componentRef} >
                                <div className="row" style={{ border: '1px solid #80808085' }}>
                                    {
                                        reportedData[0]?.length > 0 ?
                                            <>
                                                <div className="col-4 col-md-3 col-lg-2 ">
                                                    <div className="main">
                                                        <img src={reportedData[0]?.Agency_Photo} className="img-fluid" style={{ border: '1px solid aliceblue', marginTop: '4px', width: '150px' }} />
                                                    </div>
                                                </div>
                                                <div className="col-7  col-md-7 col-lg-9 mt-4">
                                                    <div className="main">
                                                        <h5 className='text-dark text-bold'>{reportedData[0]?.Agency_Name}</h5>
                                                        <p className='text-p'>Addrdzczess: <span className='text-address'>{reportedData[0]?.Agency_Address1}</span></p>
                                                        <div className='d-flex '>
                                                            <p className='text-p'>State: <span className='new-span '>{reportedData[0]?.StateName}</span>
                                                            </p>
                                                            <p className='text-p ml-5 pl-1'>City: <span className='new-span  '>{reportedData[0]?.CityName}</span>
                                                            </p>
                                                            <p className='text-p ml-2'>Zip: <span className='new-span  '>{reportedData[0]?.Agency_ZipId}</span>
                                                            </p>
                                                        </div>
                                                        <div className='d-flex'>
                                                            <p className='text-p'>Phone: <span className='new-span  '>{reportedData[0]?.Agency[0]?.Agency_Phone}</span></p>
                                                            <p className='text-p ml-3 '>Fax: <span className='new-span  '> {reportedData[0]?.Agency[0]?.Agency_Fax}</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="col-4 col-md-3 col-lg-2 ">
                                                    <div className="main">
                                                        <img src={'Agency_Photo'} className="img-fluid" alt style={{ border: '1px solid aliceblue', marginTop: '4px', width: '150px' }} />
                                                    </div>
                                                </div>
                                                <div className="col-7  col-md-7 col-lg-9 mt-4">
                                                    <div className="main">
                                                        <h5 className='text-dark text-bold'>{'Agency_Name'}</h5>
                                                        <p>{'Agency_Address1'}</p>
                                                        <p>{'Agency_Phone'}</p>
                                                    </div>
                                                </div>
                                            </>
                                    }
                                    <div className="col-12">
                                        <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                    </div>
                                    <div className="container">
                                        {
                                            reportedData[0]?.Incident?.map((obj) => {


                                                {/* Offense */ }
                                                {
                                                    JSON.parse(obj?.Offence)?.length > 0 ?
                                                        <>
                                                            <div className="container">
                                                                <h5 className=" text-white text-bold bg-green py-1 px-3" > Offense:</h5>
                                                                <div className="col-12">
                                                                    <div className="table-responsive">
                                                                        <table className="table ">
                                                                            <thead className='text-dark master-table'>
                                                                                <tr>
                                                                                    <th className=''>NIBRS Code</th>
                                                                                    <th className=''>Offense Code/Name</th>
                                                                                    <th className=''>Damage Property</th>
                                                                                    <th className=''>Primary Location
                                                                                    </th>
                                                                                    <th className=''>Offender Left Scene </th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className='master-tbody'>
                                                                                {
                                                                                    JSON.parse(obj?.Offence)?.map((item, key) => (
                                                                                        <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                            <td>{item.FBIID_Description}</td>
                                                                                            <td>{item.OffenseName_Description}</td>
                                                                                            <td>{item.DamageProperty}</td>
                                                                                            <td>{item.PrimaryLocation}</td>
                                                                                            <td>{item.OffenseLeftScene_Description}</td>
                                                                                        </tr>
                                                                                    ))
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                        <hr />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                        :
                                                        <></>
                                                }
                                                {/* Name-details */ }
                                                {
                                                    JSON.parse(obj?.Name)?.length > 0 ?
                                                        <>
                                                            <div className="container">
                                                                <h5 className="text-white text-bold bg-green py-1 px-3" >Name Details:</h5>
                                                                <div className="col-12">
                                                                    <div className="table-responsive">
                                                                        <table className="table ">
                                                                            <thead className='text-dark master-table'>
                                                                                <div className="col-12 col-md-12 col-lg-12">
                                                                                    <div className="row">
                                                                                        {
                                                                                            JSON.parse(obj?.Name)?.map((item, key) => (
                                                                                                <>
                                                                                                    {/* <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                    <td>{item.NameIDNumber}</td>
                                                                                    <td>{item.LastName + '  ' + item.FirstName + '  ' + item.MiddleName}</td>
                                                                                    <td>{item.DateOfBirth && getShowingWithOutTime(item.DateOfBirth)}</td>
                                                                                    <td>{item.Contact}</td>
                                                                                    <td>{item.SSN}</td>
                                                                                </tr> */}

                                                                                                    <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                        <div className="col-12 col-md-12 col-lg-12">
                                                                                                            <tr>
                                                                                                                <th className='text-p'>Name No.
                                                                                                                    <span className='text-gray '>{item.NameIDNumber}</span>
                                                                                                                </th>
                                                                                                            </tr>
                                                                                                        </div>
                                                                                                        <div className="col-12 col-md-12 col-lg-12">
                                                                                                            <tr>
                                                                                                                <th className='text-p' style={{ width: '400px' }}>Name:
                                                                                                                    <span className='text-gray ml-4'>{item.LastName + '  ' + item.FirstName + '  ' + item.MiddleName}</span>
                                                                                                                </th>
                                                                                                                <th className='text-p' style={{ width: '200px' }}>Gender:
                                                                                                                    <span className='text-gray'>{item.Gender}</span>
                                                                                                                </th>
                                                                                                                <th className='text-p' style={{ width: '200px' }}>DOB:
                                                                                                                    <span className='text-gray'>{item.DateOfBirth && getShowingWithOutTime(item.DateOfBirth)}</span>
                                                                                                                </th>
                                                                                                            </tr>
                                                                                                            <tr>


                                                                                                                <th className='text-p' style={{ width: '200px' }}>Contact:
                                                                                                                    <span className='text-gray ml-2 '>{item.Contact}</span>
                                                                                                                </th>
                                                                                                                <th className='text-p' style={{ width: '300px' }}>SSN No.:
                                                                                                                    <span className='text-gray'>{item.SSN}</span>
                                                                                                                </th>
                                                                                                                <th className='text-p' style={{ width: '400px' }}>Race:
                                                                                                                    <span className='text-gray'>{item.Race}</span>
                                                                                                                </th>

                                                                                                            </tr>
                                                                                                            <tr>

                                                                                                                <th className='text-p' style={{ width: '600px' }}>Address:
                                                                                                                    <span className='text-gray ml-2'>{item.Address}</span>
                                                                                                                </th>

                                                                                                                <th className='text-p' style={{ width: '400px' }}>Reason Code:
                                                                                                                    <span className='text-gray'>{item.ReasonCode}</span>
                                                                                                                </th>
                                                                                                            </tr>

                                                                                                        </div>
                                                                                                    </tr>
                                                                                                    {/* <hr /> */}
                                                                                                </>
                                                                                            ))
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </thead>
                                                                        </table>
                                                                        <hr />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                        : 
                                                        <></>
                                                }
                                                {
                                                    JSON.parse(obj?.Narrative)?.length > 0 ?
                                                        <>
                                                            <div className="container">
                                                                <h5 className="text-white text-bold bg-green py-1 px-3" >Narrative</h5>
                                                                <div className="col-12">
                                                                    <div className="table-responsive">
                                                                        <table className="table ">
                                                                            <thead className='text-dark master-table'>
                                                                                <tr>
                                                                                    <th className=''>Narrative Id</th>
                                                                                    <th className=''>As Of Date</th>
                                                                                    <th className=''>Reported By</th>
                                                                                    <th className=''>Narrative Type</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className='master-tbody'>
                                                                                {
                                                                                    JSON.parse(obj?.Narrative)?.map((item, key) => (
                                                                                        <>
                                                                                            <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                <td>{item.NarrativeId}</td>
                                                                                                <td>{item.NarrativeDtTm && getShowingDateText(item.NarrativeDtTm)}</td>
                                                                                                <td>{item.ReportedBy_Description}</td>
                                                                                                <td>{item.NarrativeDescription}</td>
                                                                                            </tr>
                                                                                        </>
                                                                                    ))
                                                                                }
                                                                            </tbody >
                                                                        </table>
                                                                        <hr />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                        :
                                                        <></>
                                                }
                                                {/* PinActivity */ }
                                                {
                                                    JSON.parse(obj?.PinActivity)?.length > 0 ?

                                                        <>
                                                            <div className="container">
                                                                <h5 className="text-white text-bold bg-green py-1 px-3" >Pin Activity</h5>
                                                                <div className="col-12">
                                                                    <div className="table-responsive">
                                                                        <table className="table ">
                                                                            <thead className='text-dark master-table'>
                                                                                <tr>
                                                                                    <th className=''>Date/Time</th>
                                                                                    <th className=''>Activity Role</th>
                                                                                    <th className=''>Activity Detail</th>
                                                                                    <th className=''>Officer</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className='master-tbody'>
                                                                                {
                                                                                    JSON.parse(obj?.PinActivity)?.map((item, key) => (

                                                                                        // console.log(JSON.parse(obj?.Arrest)),
                                                                                        <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                            <td>{item.ActivityDateTime && getShowingDateText(item.ActivityDateTime)}</td>
                                                                                            <td>{item.ActivityRole}</td>
                                                                                            <td>{item.ActivityStatus}</td>
                                                                                            <td>{item.OfficerName}</td>
                                                                                        </tr>
                                                                                    ))
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                        <hr />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                        :
                                                        <></>
                                                }
                                                {/* Dispatch Activity */ }
                                                {
                                                    JSON.parse(obj?.DispatchActivity)?.length > 0 ?
                                                        <>
                                                            <div className="container">
                                                                <h5 className="text-white text-bold bg-green py-1 px-3" >Dispatch Activity</h5>
                                                                <div className="col-12">
                                                                    <div className="table-responsive">
                                                                        <table className="table ">
                                                                            <thead className='text-dark master-table'>
                                                                                <tr>
                                                                                    <th className=''>Date/Time</th>
                                                                                    <th className=''>Comment</th>

                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className='master-tbody'>
                                                                                {
                                                                                    JSON.parse(obj?.DispatchActivity)?.map((item, key) => (
                                                                                        // console.log(JSON.parse(obj?.Arrest)),
                                                                                        <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                            <td>{item.DispatchDate && getShowingDateText(item.DispatchDate)}</td>
                                                                                            <td>{item.Comments}</td>

                                                                                        </tr>
                                                                                    ))
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                        <hr />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                        :
                                                        <></>
                                                }
                                                {/* Property*/ }
                                                {
                                                    JSON.parse(obj?.Property)?.length > 0 ?
                                                        <>
                                                            <div className="container">
                                                                <h5 className="text-white text-bold bg-green py-1 px-3">Property</h5>
                                                                <div className="col-12">
                                                                    <div className="table-responsive">
                                                                        <table className="table ">
                                                                            <thead className='text-dark master-table'>
                                                                                <tr>
                                                                                    <th className=''>Property Number</th>
                                                                                    <th className=''>Property Type</th>
                                                                                    <th className=''>Property Classification</th>
                                                                                    <th className=''>Reported Date/Time</th>
                                                                                    <th className=''>Value</th>
                                                                                    <th className=''>Officer_Name</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className='master-tbody'>
                                                                                {
                                                                                    JSON.parse(obj?.Property)?.map((item, key) => (
                                                                                        <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                            <td>{item.PropertyNumber}</td>
                                                                                            <td>{item.PropertyType_Description}</td>
                                                                                            <td>{item.PropertyClassification_Description}</td>
                                                                                            <td>{item.ReportedDtTm && getShowingDateText(item.ReportedDtTm)}</td>
                                                                                            <td>{item.Value}</td>
                                                                                            <td>{item.Officer_Name}</td>
                                                                                        </tr>
                                                                                    ))
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                        :
                                                        <></>
                                                }
                                                {/* Arrest */ }
                                                {
                                                    JSON.parse(obj?.Arrest)?.length > 0 ?
                                                        <>
                                                            <div className="container">
                                                                <h5 className="text-white text-bold bg-green py-1 px-3" >Arrest</h5>
                                                                <div className="col-12">
                                                                    <div className="table-responsive">
                                                                        <table className="table ">
                                                                            <thead className='text-dark master-table'>
                                                                                <tr>
                                                                                    <th className=''>Arrest Number</th>
                                                                                    <th className=''>Agency_Name</th>
                                                                                    <th className=''>Arrest Date Time</th>
                                                                                    <th className=''>Arrestee Name</th>
                                                                                    <th className=''>Supervisor Name</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className='master-tbody'>
                                                                                {
                                                                                    JSON.parse(obj?.Arrest)?.map((item, key) => (
                                                                                        <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                            <td>{item.ArrestNumber}</td>
                                                                                            <td>{item.Agency_Name}</td>
                                                                                            <td>{item.ArrestDtTm && getShowingDateText(item.ArrestDtTm)}</td>
                                                                                            <td>{item.Arrestee_Name}</td>
                                                                                            <td>{item.Supervisor_Name}</td>
                                                                                        </tr>
                                                                                    ))
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                        :
                                                        <></>
                                                }
                                                {/* Warrant */ }
                                                {
                                                    JSON.parse(obj?.Warrant)?.length > 0 ?
                                                        <>
                                                            <div className="container">
                                                                <h5 className="text-white text-bold bg-green py-1 px-3" >Warrant</h5>
                                                                <div className="col-12">
                                                                    <div className="table-responsive">
                                                                        <table className="table ">
                                                                            <thead className='text-dark master-table'>
                                                                                <tr>
                                                                                    <th className=''>Warrant Number</th>
                                                                                    <th className=''>Warrant Type</th>
                                                                                    <th className=''>Warrant Classification</th>
                                                                                    <th className=''>Warrant Name</th>
                                                                                    <th className=''>Warrant Status</th>
                                                                                    <th className=''>Date Of Complain</th>
                                                                                    <th className=''>Date/Time Issued</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className='master-tbody'>
                                                                                {
                                                                                    JSON.parse(obj?.Warrant)?.map((item, key) => (
                                                                                        <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                            <td>{item?.WarrantNumber}</td>
                                                                                            <td>{item?.WarrantType}</td>
                                                                                            <td>{item?.WarrantClassification}</td>
                                                                                            <td>{item?.WarrantName}</td>
                                                                                            <td>{item?.WarrantStatus}</td>
                                                                                            <td>{item?.DateOfComplain && getShowingDateText(item?.DateOfComplain)}</td>
                                                                                            <td>{item?.DateTimeIssued && getShowingDateText(item?.DateTimeIssued)}</td>

                                                                                        </tr>
                                                                                    ))
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                        :
                                                        <></>
                                                }

                                            }
                                            )


                                        }
                                    </div>
                                </div>
                            </div>

                        </>
                        :
                        incidentData?.length > 0 ?
                            <>
                                <div className="col-12 col-md-12 col-lg-12 pt-2  px-2" >
                                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                        <p className="p-0 m-0 d-flex align-items-center">Incident Master Report</p>
                                        <div style={{ marginLeft: 'auto' }}>
                                            <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                                <i className="fa fa-print" onClick={printForm}></i>
                                            </Link>

                                        </div>
                                    </div>
                                </div>
                                <div className="container mt-1" ref={componentRef}>
                                    <div className="row" style={{ border: '1px solid #80808085' }}>
                                        <>


                                            <div className="col-4 col-md-3 col-lg-2 ">
                                                <div className="main">
                                                    <img src={masterReportData?.Agency_Photo} alt='Agency_Photo' className="img-fluid" style={{ border: '1px solid aliceblue', marginTop: '4px', width: '150px' }} />
                                                </div>
                                            </div>
                                            <div className="col-7  col-md-7 col-lg-9 mt-4">
                                                <div className="main">
                                                    <h5 className='text-dark text-bold'>{masterReportData?.Agency_Name}</h5>
                                                    <p className='text-p'>Address: <span className='text-address'>{masterReportData?.Agency_Address1}</span></p>
                                                    <div className='d-flex '>
                                                        <p className='text-p'>State: <span className='new-span '>{masterReportData?.StateName}</span>
                                                        </p>
                                                        <p className='text-p ml-5 pl-1'>City: <span className='new-span  '>{masterReportData?.CityName}</span>
                                                        </p>
                                                        <p className='text-p ml-2'>Zip: <span className='new-span  '>{masterReportData?.Agency_ZipId}</span>
                                                        </p>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <p className='text-p'>Phone: <span className='new-span  '>{masterReportData?.Agency_Phone}</span></p>
                                                        <p className='text-p ml-3 '>Fax: <span className='new-span  '> {masterReportData?.Agency_Fax}</span></p>
                                                    </div>

                                                </div>
                                            </div>
                                        </>
                                        <div className="col-12">
                                            <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                        </div>
                                        {
                                            masterReportData?.Incident?.map((obj) =>

                                                <>
                                                    <div className="container">
                                                        <h5 className="text-center text-white text-bold bg-green  py-1" style={{ textDecoration: 'underline', }} > Incident Number:- {obj.IncidentNumber}</h5>

                                                        <div className="table-responsive">
                                                            <table className="table ">
                                                                <thead className='text-dark master-table'>
                                                                    <div className="col-12 col-md-12 col-lg-12">
                                                                        <div className="row">
                                                                            <div className="col-12 col-md-12 col-lg-12">
                                                                                <tr>
                                                                                    <th className='text-p'>Incident number:
                                                                                        <span className='text-gray ml-4'>{obj?.IncidentNumber}</span>
                                                                                    </th>
                                                                                </tr>
                                                                            </div>
                                                                            <div className="col-12 col-md-12 col-lg-12">
                                                                                <tr>
                                                                                    <th className='text-p' style={{ width: '350px' }}>Reported Date/Time:
                                                                                        <span className='text-gray'>{incidentData[0]?.ReportedDate && getShowingDateText(incidentData[0]?.ReportedDate)}</span>
                                                                                    </th>

                                                                                    <th className='text-p ' style={{ width: '360px' }}>Occurred From Date/Time:
                                                                                        <span className='text-gray ml-1'>{incidentData[0]?.OccurredFrom && getShowingDateText(incidentData[0]?.OccurredFrom)}</span>
                                                                                    </th>
                                                                                    <th className='text-p ' style={{ width: '350px' }}>Occurred To Date/Time:
                                                                                        <span className='text-gray '>{incidentData[0]?.OccurredTo && getShowingDateText(incidentData[0]?.OccurredTo)}</span>
                                                                                    </th>
                                                                                </tr>
                                                                            </div>

                                                                            <div className="col-12 col-md-12 col-lg-12" >
                                                                                <tr >
                                                                                    <th className='text-p' style={{ width: '675px' }}>RMS Disposition:
                                                                                        <span className='text-gray ml-4' >{incidentData[0]?.RMS_Disposition}</span>
                                                                                    </th>
                                                                                    <th className='text-p '>Disposition Date/Time: <span className='  text-gray  '>{incidentData[0]?.DispositionDate && getShowingDateText(incidentData[0]?.DispositionDate)}</span> </th>
                                                                                </tr>
                                                                            </div>
                                                                            <div className="col-12 col-md-12 col-lg-12">
                                                                                <tr>
                                                                                    <th className='text-p' style={{ width: '675px' }}>CAD CFS Descirption:
                                                                                        <span className='text-gray '>{incidentData[0]?.CADCFSCode_Description}</span>
                                                                                    </th>
                                                                                    <th className='text-p '>RMS CFS Desc:
                                                                                        <span className='new-span ml-5 pl-4'>{incidentData[0]?.RMSCFSCode_Description}</span>
                                                                                    </th>
                                                                                </tr>
                                                                            </div>
                                                                            <div className="col-12 col-md-12 col-lg-12">
                                                                                <tr>
                                                                                    <th className='text-p' style={{ width: '675px' }}>Crime Location:
                                                                                        <span className='new-span ml-5'>{incidentData[0]?.CrimeLocation}</span>
                                                                                    </th>
                                                                                    <th className='text-p'>FBI Code:
                                                                                        <span className='new-span ' >{incidentData[0]?.FBICode_Description}adsadaf</span>
                                                                                    </th>
                                                                                </tr>
                                                                            </div>
                                                                            <div className="col-12 col-md-12 col-lg-12">
                                                                                <tr>
                                                                                    <th className='text-p' style={{ width: '675px' }}>CAD Disposition:
                                                                                        <span className='text-gray ml-4'>{incidentData[0]?.CADDispositions_Description}</span>
                                                                                    </th>
                                                                                    <th className='text-p'>Report Due:
                                                                                        <span className='new-span ml-5 pl-5'>asderdasd</span>
                                                                                    </th>
                                                                                </tr>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </thead>
                                                            </table>
                                                        </div>
                                                    </div>


                                                    {/* Offence */}
                                                    {
                                                        JSON.parse(obj?.Offence)?.length > 0 ?
                                                            <>
                                                                <div className="container">
                                                                    <h5 className=" text-white text-bold bg-green py-1 px-3" > Offense:</h5>
                                                                    <div className="col-12">
                                                                        <div className="table-responsive">
                                                                            <table className="table ">
                                                                               
                                                                                <thead className='text-dark master-table'>
                                                                                    <tr>
                                                                                        <th className=''>NIBRS Code</th>
                                                                                        <th className=''>Offense Code/Name</th>
                                                                                        <th className=''>Damage Property</th>
                                                                                        <th className=''>Primary Location
                                                                                        </th>
                                                                                        <th className=''>Offender Left Scene </th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className='master-tbody'>
                                                                                    {
                                                                                        JSON.parse(obj?.Offence)?.map((item, key) => (
                                                                                            <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                <td>{item.FBIID_Description}</td>
                                                                                                <td>{item.OffenseName_Description}</td>
                                                                                                <td>{item.DamageProperty}</td>
                                                                                                <td>{item.PrimaryLocation}</td>
                                                                                                <td>{item.OffenseLeftScene_Description}</td>
                                                                                            </tr>

                                                                                        ))
                                                                                    }
                                                                                </tbody>
                                                                            </table>
                                                                            <hr />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                            :
                                                            <></>
                                                    }
                                                    {/* Name */}
                                                    {
                                                        JSON.parse(obj?.Name)?.length > 0 ?
                                                            <>
                                                                <div className="container">
                                                                    <h5 className="text-white text-bold bg-green  py-1 px-3"  > Name Details:</h5>

                                                                    <div className="table-responsive">
                                                                        <table className="table ">
                                                                            <thead className='text-dark master-table'>
                                                                                <div className="col-12 col-md-12 col-lg-12">
                                                                                    <div className="row">
                                                                                        {
                                                                                            JSON.parse(obj?.Name)?.map((item, key) => (
                                                                                                <>
                                                                                                    <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                        <div className="col-12 col-md-12 col-lg-12">
                                                                                                            <tr>
                                                                                                                <th className='text-p'>Name No.
                                                                                                                    <span className='text-gray '>{item?.NameIDNumber}</span>
                                                                                                                </th>
                                                                                                            </tr>
                                                                                                        </div>
                                                                                                        <div className="col-12 col-md-12 col-lg-12">
                                                                                                            <tr>
                                                                                                                <th className='text-p' style={{ width: '400px' }}>Name:
                                                                                                                    <span className='text-gray ml-4'>{item?.LastName + '  ' + item?.FirstName + '  ' + item?.MiddleName}</span>
                                                                                                                </th>
                                                                                                                <th className='text-p' style={{ width: '200px' }}>Gender:
                                                                                                                    <span className='text-gray'>{item?.Gender}</span>
                                                                                                                </th>
                                                                                                                <th className='text-p' style={{ width: '200px' }}>DOB:
                                                                                                                    <span className='text-gray'>{item?.DateOfBirth && getShowingWithOutTime(item?.DateOfBirth)}</span>
                                                                                                                </th>
                                                                                                            </tr>
                                                                                                            <tr>


                                                                                                                <th className='text-p' style={{ width: '200px' }}>Contact:
                                                                                                                    <span className='text-gray ml-2 '>{item?.Contact}</span>
                                                                                                                </th>
                                                                                                                <th className='text-p' style={{ width: '300px' }}>SSN No.:
                                                                                                                    <span className='text-gray'>{item?.SSN}</span>
                                                                                                                </th>
                                                                                                                <th className='text-p' style={{ width: '400px' }}>Race:
                                                                                                                    <span className='text-gray'>{item?.Race}</span>
                                                                                                                </th>

                                                                                                            </tr>
                                                                                                            <tr>

                                                                                                                <th className='text-p' style={{ width: '600px' }}>Address:
                                                                                                                    <span className='text-gray ml-2'>{item?.Address}</span>
                                                                                                                </th>

                                                                                                                <th className='text-p' style={{ width: '400px' }}>Reason Code:
                                                                                                                    <span className='text-gray'>{item?.ReasonCode}</span>
                                                                                                                </th>
                                                                                                            </tr>

                                                                                                        </div>
                                                                                                    </tr>

                                                                                                </>
                                                                                            ))

                                                                                        }
                                                                                    </div >
                                                                                </div>
                                                                            </thead>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </>
                                                            :
                                                            <>
                                                            </>
                                                    }
                                                    {/* Narrative */}
                                                    {/* {
                                                        JSON.parse(obj?.Narrative)?.length > 0 ?
                                                            <>
                                                                <div className="container">
                                                                    <h5 className="text-white text-bold bg-green py-1 px-3" >Narrative</h5>
                                                                    <div className="col-12">
                                                                        <div className="table-responsive">
                                                                            <table className="table ">
                                                                                <thead className='text-dark master-table'>
                                                                                    <tr>
                                                                                        <th className=''>Narrative Id</th>
                                                                                        <th className=''>As Of Date</th>
                                                                                        <th className=''>Reported By</th>
                                                                                        <th className=''>Narrative Type</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className='master-tbody'>
                                                                                    {
                                                                                        JSON.parse(obj?.Narrative)?.map((item, key) => (
                                                                                            <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                <td>{item.NarrativeId}</td>
                                                                                                <td>{item.NarrativeDtTm && getShowingDateText(item.NarrativeDtTm)}</td>
                                                                                                <td>{item.ReportedBy_Description}</td>
                                                                                                <td>{item.NarrativeDescription}</td>
                                                                                            </tr>
                                                                                        ))
                                                                                    }
                                                                                </tbody>
                                                                            </table>
                                                                            <hr />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                            :
                                                            <></>
                                                    } */}
                                                    {/* PinActivity */}
                                                    {/* {
                                                        JSON.parse(obj?.PinActivity)?.length > 0 ?
                                                            <>
                                                                <div className="container">
                                                                    <h5 className="text-white text-bold bg-green py-1 px-3" >Pin Activity</h5>
                                                                    <div className="col-12">
                                                                        <div className="table-responsive">
                                                                            <table className="table ">
                                                                                <thead className='text-dark master-table'>
                                                                                    <tr>
                                                                                        <th className=''>Date/Time</th>
                                                                                        <th className=''>Activity Role</th>
                                                                                        <th className=''>Activity Detail</th>
                                                                                        <th className=''>Officer</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className='master-tbody'>
                                                                                    {
                                                                                        JSON.parse(obj?.PinActivity)?.map((item, key) => (
                                                                                            <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                <td>{item.ActivityDateTime && getShowingDateText(item.ActivityDateTime)}</td>
                                                                                                <td>{item.ActivityRole}</td>
                                                                                                <td>{item.ActivityStatus}</td>
                                                                                                <td>{item.OfficerName}</td>
                                                                                            </tr>
                                                                                        ))
                                                                                    }
                                                                                </tbody>
                                                                            </table>
                                                                            <hr />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                            :
                                                            <></>
                                                    } */}
                                                    {/* Dispatch Activity */}
                                                    {/* {
                                                        JSON.parse(obj?.DispatchActivity)?.length > 0 ?
                                                            <>
                                                                <div className="container">
                                                                    <h5 className="text-white text-bold bg-green py-1 px-3" >Dispatch Activity</h5>
                                                                    <div className="col-12">
                                                                        <div className="table-responsive">
                                                                            <table className="table ">
                                                                                <thead className='text-dark master-table'>
                                                                                    <tr>
                                                                                        <th className=''>Date/Time</th>
                                                                                        <th className=''>Comment</th>

                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className='master-tbody'>
                                                                                    {
                                                                                        JSON.parse(obj?.PinActivity)?.map((item, key) => (
                                                                                            <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                <td>{item.DispatchDate && getShowingDateText(item.DispatchDate)}</td>
                                                                                                <td>{item.Comments}</td>

                                                                                            </tr>
                                                                                        ))
                                                                                    }
                                                                                </tbody>
                                                                            </table>
                                                                            <hr />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                            :
                                                            <></>
                                                    } */}
                                                    {/* Property */}
                                                    {
                                                        JSON.parse(obj?.Property)?.length > 0 ?
                                                            <>
                                                                <div className="container">
                                                                    <h5 className="text-white text-bold bg-green py-1 px-3" >Property</h5>
                                                                    <div className="col-12">
                                                                        <div className="table-responsive">
                                                                            <table className="table ">
                                                                                <thead className='text-dark master-table'>
                                                                                    <tr>
                                                                                        <th className=''>Property Number</th>
                                                                                        <th className=''>Property Type</th>
                                                                                        <th className=''>Property Classification</th>
                                                                                        <th className=''>Reported Date</th>
                                                                                        <th className=''>Value</th>
                                                                                        <th className=''>Officer Name</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className='master-tbody'>
                                                                                    {
                                                                                        JSON.parse(obj?.Property)?.map((item, key) => (
                                                                                            <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                <td>{item.PropertyNumber}</td>
                                                                                                <td>{item.PropertyType_Description}</td>
                                                                                                <td>{item.PropertyClassification_Description}</td>
                                                                                                <td>{item.ReportedDtTm && getShowingDateText(item.ReportedDtTm)}</td>
                                                                                                <td>{item.Value}</td>
                                                                                                <td>{item.Officer_Name}</td>
                                                                                            </tr>
                                                                                        ))
                                                                                    }
                                                                                </tbody>
                                                                            </table>
                                                                            <hr />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                            :
                                                            <>
                                                            </>
                                                    }
                                                    {/* Arrest */}
                                                    {
                                                        JSON.parse(obj?.Arrest)?.length > 0 ?
                                                            <>
                                                                <div className="container">
                                                                    <h5 className="text-white text-bold bg-green py-1 px-3" >Arrest</h5>
                                                                    <div className="col-12">
                                                                        <div className="table-responsive">
                                                                            <table className="table ">
                                                                                <thead className='text-dark master-table'>
                                                                                    <tr>
                                                                                        <th className=''>Agency Name</th>
                                                                                        <th className=''>Arrest Number</th>
                                                                                        <th className=''>Arrest Date Time</th>
                                                                                        <th className=''>Arrestee Name</th>
                                                                                        <th className=''>Supervisor Name</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className='master-tbody'>
                                                                                    {
                                                                                        JSON.parse(obj?.Arrest)?.map((item, key) => (
                                                                                            <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                <td>{item.Agency_Name}</td>
                                                                                                <td>{item.ArrestNumber}</td>
                                                                                                <td>{item.ArrestDtTm && getShowingDateText(item.ArrestDtTm)}</td>
                                                                                                <td>{item.Arrestee_Name}</td>
                                                                                                <td>{item.Supervisor_Name}</td>
                                                                                            </tr>
                                                                                        ))
                                                                                    }
                                                                                </tbody>
                                                                            </table>
                                                                            <hr />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                            :
                                                            <></>
                                                    }
                                                    {/* Warrant */}
                                                    {
                                                        JSON.parse(obj?.Warrant)?.length > 0 ?
                                                            <>
                                                                <div className="container">
                                                                    <h5 className="text-white text-bold bg-green py-1 px-3" >Warrant</h5>
                                                                    <div className="col-12">
                                                                        <div className="table-responsive">
                                                                            <table className="table ">
                                                                                <thead className='text-dark master-table'>
                                                                                    <tr>
                                                                                        <th className=''>Warrant Number</th>
                                                                                        <th className=''>Warrant Type</th>
                                                                                        <th className=''>Warrant Classification</th>
                                                                                        <th className=''>Warrant Name</th>
                                                                                        <th className=''>Warrant Status</th>
                                                                                        <th className=''>Date Of Complain</th>
                                                                                        <th className=''>Date/Time Issued</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className='master-tbody'>
                                                                                    {
                                                                                        JSON.parse(obj?.Warrant)?.map((item, key) => (
                                                                                            <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                <td>{item?.WarrantNumber}</td>
                                                                                                <td>{item?.WarrantType_Description}</td>
                                                                                                <td>{item?.WarrantClassification_Description}</td>
                                                                                                <td>{item?.WarrantName}</td>
                                                                                                <td>{item?.WarrantStatus_Description}</td>
                                                                                                <td>{item?.DateOfComplain && getShowingDateText(item?.DateOfComplain)}</td>
                                                                                                <td>{item?.DateTimeIssued && getShowingDateText(item?.DateTimeIssued)}</td>

                                                                                            </tr>

                                                                                        ))
                                                                                    }
                                                                                </tbody>
                                                                            </table>
                                                                            <hr />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                            :
                                                            <>
                                                            </>
                                                    }
                                                </>
                                            )
                                        }
                                    </div >
                                </div>
                            </>
                            :
                            <>
                            </>
                    :
                    <>
                    </>
            }
            {

            }
        </>
    )
}

export default MasterIncident