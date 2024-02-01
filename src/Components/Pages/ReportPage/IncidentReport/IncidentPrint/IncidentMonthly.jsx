import React, { useEffect, useState } from 'react'
import img from '../../../../../../src/img/images1.jpg'
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, getShowingWithOutTime, getShowingDateText } from '../../../../Common/Utility';
import { Link } from 'react-router-dom';
import { fetchPostData } from '../../../../hooks/Api';
import { toastifyError } from '../../../../Common/AlertMsg';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const IncidentMonthly = () => {
    const {localStoreArray, setLocalStoreArray, get_LocalStorage } = useContext(AgencyContext)

    const [verifyIncident, setverifyIncident] = useState(false);
    const [year, setYear] = useState()
    const [month, setMonth] = useState()
    const [startDate, setStartDate] = useState();
    const [incidentData, setIncidentData] = useState([]);
    const [masterReportData, setMasterReportData] = useState([]);
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
        ReportedDate: '', 
        'AgencyID': LoginAgencyID
        // Month: '',
        //  Year: '',
    });
    const Reset = () => {
        setValue({
            ...value,
            'ReportedDate': '',
        });
        setStartDate(''); setverifyIncident(false); setIncidentData([]); setMasterReportData([])
    }

    useEffect(() => {
        if (incidentData?.length > 0) {
            setverifyIncident(true);
        }
    }, [incidentData]);

    const get_MonthlyReport = async () => {
        if (value?.ReportedDate?.trim()?.length > 0) {
            fetchPostData('Report/IncidentReport_Monthly', value).then((res) => {
                if (res.length > 0) {
                    console.log(res)
                    setIncidentData(res[0].Incident); setMasterReportData(res[0])
                } else {
                    toastifyError("Data Not Available");
                }
            });
        } else {
            toastifyError("Please Select Year/Month")
        }
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
                                            <p className="p-0 m-0 d-flex align-items-center">Incident Monthly Report</p>
                                        </div>
                                    </div>
                                    {/* <div className="col-6 col-md-6 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                id='Month'
                                                name='Month'
                                                onChange={(date) => { setMonth(date); setValue({ ...value, ['Month']: date ? getMonthWithOutDateTime(date) : null }) }}
                                                className=''
                                                isClearable={value?.Month ? true : false}
                                                selected={month}
                                                showMonthYearPicker
                                                placeholderText={'Select...'}
                                                dateFormat="MM"
                                                autoComplete="nope"
                                                dropdownMode="select"
                                            // maxDate={new Date()}  
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Month</label>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                id='Year'
                                                name='Year'
                                                onChange={(date) => { setYear(date); setValue({ ...value, ['Year']: date ? getYearWithOutDateTime(date) : null }) }}
                                                isClearable={value?.Year ? true : false}
                                                selected={year}
                                                showYearPicker
                                                dateFormat="yyyy"
                                                yearItemNumber={9}
                                                autoComplete="nope"
                                                showYearDropdown
                                                showMonthDropdown
                                                dropdownMode="select"
                                                maxDate={new Date()}
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Year</label>
                                        </div>
                                    </div> */}
                                    <div className="col-6 col-md-6 col-lg-3 mb-1">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                selected={startDate}
                                                peekNextMonth
                                                onChange={(date) => {
                                                    setStartDate(date); console.log(date);
                                                    setValue({ ...value, ['ReportedDate']: getShowingWithOutTime(date) })
                                                }}
                                                dateFormat="MM/yyyy"
                                                showMonthYearPicker
                                                maxDate={new Date()}
                                                autoComplete="nope"
                                                placeholderText={'Select...'}
                                            />
                                            <label htmlFor="" className='pl-0 pt-1' >Year</label>
                                        </div>
                                    </div>
                                    <div className="col-9 col-md-9 col-lg-9 mt-3 " >
                                        <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { setverifyIncident(false); get_MonthlyReport(); }}>Show Report</button>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { Reset(); }}>Clear</button>
                                        <Link to={'/Reports'}>
                                            <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* for 1 table */}
            {
                verifyIncident ?

                    incidentData?.length > 0 ?
                        <>
                            <div className="col-12 col-md-12 col-lg-12 pt-2  px-2" >
                                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                    <p className="p-0 m-0 d-flex align-items-center">Incident Monthly Report</p>
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
                                        <div className="col-4 col-md-3 col-lg-2 ">
                                            <div className="main">
                                                <img src={masterReportData?.Agency_Photo} className="img-fluid" alt='Agency_Photo' style={{ border: '1px solid aliceblue', marginTop: '4px', width: '150px' }} />
                                            </div>
                                        </div>
                                        <div className="col-7  col-md-7 col-lg-9 mt-4">
                                            <div className="main">
                                                <h5 className='text-dark text-bold'>{masterReportData?.Agency_Name}</h5>
                                                <p className='text-p'>Address: <span className='text-address'>{masterReportData?.Agency_Address1}</span></p>
                                                <div className='d-flex '>
                                                    <p className='text-p'>State: <span className='new-span ml-3'>{masterReportData?.StateName}</span>
                                                    </p>
                                                    <p className='text-p ml-5 pl-1'>City: <span className='new-span  '>{masterReportData?.CityName}</span>
                                                    </p>
                                                    <p className='text-p ml-2'>Zip: <span className='new-span  '>{masterReportData?.Agency_ZipId}</span>
                                                    </p>
                                                </div>
                                                <div className='d-flex'>
                                                    <p className='text-p'>Phone: <span className='new-span  ml-1'>{masterReportData?.Agency_Phone}</span></p>
                                                    <p className='text-p ml-4 pl-1'>Fax: <span className='new-span  '> {masterReportData?.Agency_Fax}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    <div className="col-12">
                                        <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                    </div>
                                    {
                                        incidentData?.length > 0 ?
                                            <>
                                                <div className="container">
                                                    <h5 className="text-white text-bold bg-green py-1 px-3">Incident Details</h5>
                                                    <div className="col-12">
                                                        <div className="table-responsive">
                                                            <table className="table">
                                                                <thead className='text-dark master-table'>
                                                                    <tr className='bb'>
                                                                        <th className='' style={{ width: '100px' }}>Incident Number</th>
                                                                        <th className='' style={{ width: '150px' }}>Reported Date/Time</th>
                                                                        <th className='' style={{ width: '150px' }}>CAD CFS Code</th>
                                                                        <th className='' style={{ width: '150px' }}>RMS CFS Code</th>
                                                                        <th className='' style={{ width: '150px' }}>Crime Location</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className='master-tbody'>
                                                                    {
                                                                        // console.log(JSON.parse(obj?.Arrest))
                                                                        incidentData?.map((item, key) => (
                                                                            <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                <td style={{ width: '100px' }} className='text-list'>{item.IncidentNumber}</td>
                                                                                <td style={{ width: '150px' }} className='text-list'>{item.ReportedDate && getShowingDateText(item.ReportedDate)}</td>
                                                                                <td style={{ width: '150px' }} className='text-list'>{item.CADCFSCode_Description}</td>
                                                                                <td style={{ width: '150px' }} className='text-list'>{item.RMSCFSCode_Description}</td>
                                                                                <td style={{ width: '150px' }} className='text-list'>{item.CrimeLocation}</td>
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
                                </div>
                            </div>
                        </>
                        :
                        <>
                        </>
                    :
                    <>
                    </>
            }
        </>
    )
}

export default IncidentMonthly