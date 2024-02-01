import React, { useRef } from 'react'
import { Decrypt_Id_Name, changeArrayFormat, customStylesWithOutColor, getShowingDateText } from '../../../../Common/Utility'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import img from '../../../../../../src/img/images1.jpg'
import { fetchPostData } from '../../../../hooks/Api';
import { toastifyError } from '../../../../Common/AlertMsg';
import { useEffect } from 'react';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const IncidentOfficer = () => {
    const { localStoreArray, setLocalStoreArray, get_LocalStorage } = useContext(AgencyContext)
    const [verifyIncident, setverifyIncident] = useState(false);
    const [headOfAgency, setHeadOfAgency] = useState([]);
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
        'ReportedDate': "",
        'ReportedDateTo': "",
        'OfficerPINID': null,
        'AgencyID': LoginAgencyID,
    });

    useEffect(() => {
        get_Head_Of_Agency();
    }, []);

    const get_Head_Of_Agency = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setHeadOfAgency(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            }
            else {
                setHeadOfAgency([])
            }
        })
    };

    const getIncidentSearchData = async () => {
        if (value?.ReportedDate?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || value?.OfficerPINID !== null) {
            fetchPostData('Report/IncidentOfficer', value).then((res) => {
                if (res.length > 0) {
                    console.log(res)
                    setIncidentData(res[0].Incident); setReportData(res[0]); setverifyIncident(true)
                } else {
                    toastifyError("Data Not Available");
                }
            });
        } else {
            toastifyError("Please Enter Details");
        }
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({
                ...value,
                [name]: e.value
            })
        } else setValue({
            ...value,
            [name]: null
        })
    }

    const resetFields = () => {
        setValue({
            ...value,
            'ReportedDate': "",
            'ReportedDateTo': "",
            'OfficerPINID': null,
        });
        setReportData([]); setverifyIncident(false); setIncidentData([]);
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
                                            <p className="p-0 m-0 d-flex align-items-center">Incident Officer Report</p>
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
                                                        ['ReportedDate']: date ? getShowingDateText(date) : null,
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
                                    <div className="col-3 col-md-3 col-lg-3 mt-1">
                                        <div className=" dropdown__box">
                                            <Select
                                                styles={customStylesWithOutColor}
                                                name='OfficerPINID'
                                                value={headOfAgency?.filter((obj) => obj.value === value?.OfficerPINID)}
                                                isClearable
                                                options={headOfAgency}
                                                onChange={(e) => ChangeDropDown(e, 'OfficerPINID')}
                                                placeholder="Select..."
                                            />
                                            <label>Officer Name</label>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-12 col-lg-12  text-right">
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
                            <p className="p-0 m-0 d-flex align-items-center">Incident By Officer Report</p>
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
                            <div className="container">
                                <h5 className=" text-white text-bold bg-green py-1 px-3">Officer Name:-   {reportData?.Incident[0].Officer_Name}</h5>

                                <div className="table-responsive">
                                    <table className="table ">
                                        <thead className='text-dark master-table'>
                                            <tr>
                                                <th className=''>Incident Number:</th>
                                                <th className=''>Reported Date/Time:</th>
                                                <th className=''>Offense:</th>
                                                <th className=''>RMS Disposition:</th>
                                                <th className=''>CAD Disposition:</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                reportData?.Incident?.map((obj) =>
                                                    <>
                                                        <tr>
                                                            <td className='text-list'>{obj?.IncidentNumber}</td>
                                                            <td className='text-list'>{incidentData[0]?.ReportedDate && getShowingDateText(incidentData[0]?.ReportedDate)}</td>
                                                            <td className='text-list'>{obj?.RMSCFSCode_Description}</td>
                                                            <td className='text-list'>{obj?.RMS_Disposition}</td>
                                                            <td className='text-list'>{obj?.CADDispositions_Description}</td>
                                                        </tr>
                                                    </>
                                                )

                                            }
                                        </tbody>
                                    </table>
                                    <hr />
                                </div>

                                {/* {
                                reportData?.Incident?.map((obj) =>
                                    <>
                                        <div className="table-responsive">
                                            <table className="table ">
                                                <thead className='text-dark master-table'>
                                                    <tr>
                                                        <th className='' style={{width:'150px'}}>Incident Number:</th>
                                                        <th className='' style={{width:'150px'}}>Reported Date/Time:</th>
                                                        <th className='' style={{width:'100px'}}>Offense:</th>
                                                        <th className='' style={{width:'200px'}}>RMS Disposition:</th>
                                                        <th className='' style={{width:'150px'}}>CAD Disposition:</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td style={{width:'150px'}}>{obj?.IncidentNumber}</td>
                                                        <td style={{width:'150px'}}>{incidentData[0]?.ReportedDate && getShowingDateText(incidentData[0]?.ReportedDate)}</td>
                                                        <td style={{width:'100px'}}>Offence</td>
                                                        <td style={{width:'200px'}}> {obj?.RMS_Disposition}</td>
                                                        <td style={{width:'150px'}}>{obj?.CADDispositions_Description}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <hr />
                                        </div>
                                    </>
                                )
                            } */}
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default IncidentOfficer