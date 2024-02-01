import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility';
import { Link } from 'react-router-dom';
import { fetchPostData } from '../../../../hooks/Api';
import { toastifyError } from '../../../../Common/AlertMsg';
import DataTable from 'react-data-table-component';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const DailyEvent = () => {
    const {localStoreArray, setLocalStoreArray, get_LocalStorage } = useContext(AgencyContext)

    const [verifyIncident, setverifyIncident] = useState(false);
    const [incidentData, setIncidentData] = useState([]);
    const [reportData, setReportData] = useState([]);


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
        'ReportedDate': getShowingDateText(new Date()),
        'ReportedDateTo': getShowingDateText(new Date()),
        'AgencyID':LoginAgencyID
    });

    useEffect(() => {
        getIncidentSearchData()
    }, []);

    useEffect(() => {
        if (incidentData?.length > 0) {
            setverifyIncident(true)
        }
    }, [incidentData]);

    const getIncidentSearchData = async () => {
        fetchPostData('Report/DailyEventLog', value).then((res) => {
            if (res.length > 0) {
                console.log(res)
                setIncidentData(res[0].Incident); setReportData(res[0])
            } else {
                toastifyError("Data Not Available");
            }
        });
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

    const resetFields = () => {
        setValue({
            ...value,
            'ReportedDate': "",
            'ReportedDateTo': "",
        });
        setverifyIncident(false); setIncidentData([]); setReportData([]);
    }

    const componentRef = useRef();
    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onAfterPrint: () => { '' }
    })

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
                                            <p className="p-0 m-0 d-flex align-items-center">Incident Daily Event Log Report</p>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                name='ReportedDate'
                                                id='ReportedDate'
                                                onChange={(date) => {
                                                    setValue({
                                                        ...value,
                                                        ['ReportedDate']: date ? getShowingDateText(date) : null
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
                                                isClearable={value?.ReportedDateTo ? true : false}
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                disabled={value?.ReportedDate ? false : true}
                                                minDate={new Date(value?.ReportedDate)}
                                                maxDate={new Date()}
                                                placeholderText='Select...'
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Reported To Date</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-12 col-lg-12 text-right">
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { getIncidentSearchData(); }}>Show Report</button>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { resetFields(); }}>Clear</button>
                                        <Link to={'/Reports'}>
                                            <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                        </Link>
                                    </div>
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
            {
                verifyIncident &&
                <>
                    <div className="col-12 col-md-12 col-lg-12 pt-2  px-2" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">Daily Event Log</p>
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
                    <div className="container mt-1" ref={componentRef}>
                        <div className="row" style={{ border: '1px solid #80808085' }}>
                            <>
                                <div className="col-4 col-md-3 col-lg-2">
                                    <div className="main">
                                        <img src={reportData?.Agency_Photo} className="img-fluid" alt='Agency_Photo' style={{ border: '1px solid aliceblue', marginTop: '4px', width: '150px' }} />
                                    </div>
                                </div>
                                <div className="col-7  col-md-7 col-lg-9 mt-4 pt-1 ml-5">
                                    <div className="main">
                                        <h5 className='text-dark text-bold'>{reportData?.Agency_Name}</h5>
                                        <p className='text-p'>Address: <span className=''>{reportData?.Agency_Address1}</span></p>
                                        <div className='d-flex '>
                                            <p className='text-p'>State: <span className='new-span '>{reportData?.StateName}</span>
                                            </p>
                                            <p className='text-p ml-5 pl-1'>City: <span className='new-span  '>{reportData?.CityName}</span>
                                            </p>
                                            <p className='text-p ml-2'>Zip: <span className='new-span  '>{reportData?.Agency_ZipId}</span>
                                            </p>
                                        </div>
                                        <div className='d-flex'>
                                            <p className='text-p'>Phone: <span className='new-span  '>{reportData?.Agency_Phone}</span></p>
                                            <p className='text-p ml-3 '>Fax: <span className='new-span  '> {reportData?.Agency_Fax}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </>
                            <div className="col-12">
                                <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                            </div>
                            {
                                reportData?.Incident?.map((obj) =>
                                    <>
                                        <div className="container">
                                            <h5 className=" text-white text-bold bg-green py-1 px-3"> Incident Number:- {obj.IncidentNumber}</h5>
                                            <div className="row">
                                                <div className="table-responsive">
                                                    <table className="table ">
                                                        <thead className='text-dark master-table'>
                                                            <div className="col-12 col-md-12 col-lg-12">
                                                                <div className="row">
                                                                    <div className="col-12 col-md-12 col-lg-12">
                                                                        <tr>
                                                                            {/* <th className=''>Case ID:<span className='main-span'>{obj.IncidentNumber}</span></th> */}
                                                                            <th className='text-p' >RMS CFS Code/Desc:<span className='text-gray ml-1'>{obj.CADCFSCode_Description}</span></th>
                                                                        </tr>
                                                                    </div>
                                                                    <div className="col-12 col-md-12 col-lg-12">
                                                                        <tr>
                                                                            <th className='text-p'>Crime Location: <span className='text-location '>{obj.CrimeLocation}</span> </th>
                                                                        </tr>
                                                                    </div>
                                                                    <div className="col-12 col-md-12 col-lg-12">
                                                                        <tr>
                                                                            <th className='text-p'>Reported Date/Time: <span className='  text-gray'>{obj?.ReportedDate && getShowingDateText(obj?.ReportedDate)}</span> </th>
                                                                            <th className='text-p '>RMS Disposition:<span className='text-gray'>{obj.RMS_Disposition}</span></th>
                                                                            <th className='text-p '>Disposition Date/Time: <span className='  text-gray'>{obj?.DispositionDate && getShowingDateText(obj?.DispositionDate)}</span> </th>
                                                                        </tr>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </thead>
                                                    </table>
                                                    <hr />
                                                </div>
                                            </div>
                                        </div >
                                    </>
                                )
                            }
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default DailyEvent