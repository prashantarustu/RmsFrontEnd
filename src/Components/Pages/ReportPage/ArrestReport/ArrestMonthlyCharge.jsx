import React, { useContext, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print';
import { Decrypt_Id_Name, customStylesWithOutColor, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime } from '../../../Common/Utility';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Link } from 'react-router-dom';
import img from '../../../../../src/img/images1.jpg'
import { fetchPostData } from '../../../hooks/Api';
import { useEffect } from 'react';
import { toastifyError } from '../../../Common/AlertMsg';
import { Comman_changeArrayFormat, threeColArrayWithCode } from '../../../Common/ChangeArrayFormat';
import { AgencyContext } from '../../../../Context/Agency/Index';

const ArrestMonthlyCharge = () => {
    const { localStoreArray, setLocalStoreArray, get_LocalStorage } = useContext(AgencyContext)
    const [verifyArrest, setVerifyArrest] = useState(false);
    const [incidentData, setIncidentData] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [nibrsCodeDrp, setNibrsCodeDrp] = useState([]);
    const [rmsCfsID, setRmsCfsID] = useState([]);
    const [startDate, setStartDate] = useState();

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
        NIBRSID: null,
        ChargeCodeID: null,
        ArrestDtTm: '',
        AgencyID: LoginAgencyID,
    });

    useEffect(() => {
        FBIidDrpVal();
    }, []);

    // const FBIidDrpVal = () => {
    //     const val = {
    //         AgencyID: Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID'),
    //     }
    //     fetchPostData('FBICodes/GetDataDropDown_FBICodes', val).then((data) => {
    //         if (data) {
    //             setNibrsCodeDrp(threeColArrayWithCode(data, 'FBIID', 'Description', 'FederalSpecificFBICode'))
    //         } else {
    //             setNibrsCodeDrp([]);
    //         }
    //     })
    // }

    // const getRmsCfsCodeID = (NIBRSID) => {
    //     const val = {
    //         'NIBRSID': NIBRSID,
    //         'AgencyID': null,
    //     }
    //     fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
    //         if (data) {
    //             setRmsCfsID(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'))
    //         } else {
    //             setRmsCfsID([]);
    //         }
    //     })
    // }
    const FBIidDrpVal = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('FBICodes/GetDataDropDown_FBICodes', val).then((data) => {
            if (data) {
                setNibrsCodeDrp(threeColArrayWithCode(data, 'FBIID', 'Description', 'FederalSpecificFBICode'))
            } else {
                setNibrsCodeDrp([]);
            }
        })
    }

    const getRmsCfsCodeID = (FBIID) => {
        const val = {
            'FBIID': FBIID,
            'AgencyID': null,
        }
        fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
            if (data) {
                setRmsCfsID(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'))
            } else {
                setRmsCfsID([]);
            }
        })
    }

    // useEffect(() => {
    //     if (incidentData?.length > 0) {

    //     }
    // }, [incidentData]);

    const getIncidentSearchData = async () => {
        if (value?.ArrestDtTm.trim()?.length > 0 || value?.NIBRSID !== null || value?.ChargeCodeID !== null) {
            // console.log(value)
            fetchPostData('ArrestReport/ArrestMonthlyByChargeReport', value).then((res) => {
                if (res.length > 0) {
                    console.log(res)
                    console.log(JSON.parse(res[0]?.Charge[1]?.Arrest));
                    console.log(res[0].Charge);
                    setIncidentData(res[0].Charge); setReportData(res[0]); setVerifyArrest(true);
                } else {
                    toastifyError("Data Not Available");
                    setIncidentData([]); setReportData([]); setVerifyArrest(false);
                }
            });
        } else {
            toastifyError("Please Enter Details"); setVerifyArrest(false);
        }
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'NIBRSID') {
                getRmsCfsCodeID(e.value);
                setValue({
                    ...value,
                    [name]: e.value,
                    ['ChargeCodeID']: null,
                });
                setRmsCfsID([])
            }
            //  else if (name === 'ChargeCodeID') {
            //     const ids = []
            //     e.forEach(({ value }) => ids.push(value))
            //     setValue({
            //         ...value,
            //         [name]: JSON.stringify(ids)
            //     })
            // }
            else {
                setValue({
                    ...value,
                    [name]: e.value
                })
            }
        } else {
            if (name === 'NIBRSID') {
                setValue({
                    ...value,
                    [name]: null,
                    ['ChargeCodeID']: null,
                });
                setRmsCfsID([])
            } else {
                setValue({
                    ...value,
                    [name]: null
                })
            }
        }
    }

    const componentRef = useRef();
    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onAfterPrint: () => { '' }
    });

    const resetFields = () => {
        setValue({
            ...value,
            NIBRSID: null,
            ChargeCodeID: null,
            ArrestDtTm: '',
        });
        setVerifyArrest(false); setIncidentData([]); setReportData([]);
    }

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
                                            <p className="p-0 m-0 d-flex align-items-center">Arrest Monthly Charge Report</p>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-4 col-lg-3  ">
                                        <div className="dropdown__box">
                                            <DatePicker
                                                selected={startDate}
                                                peekNextMonth
                                                onChange={(date) => {
                                                    setStartDate(date); console.log(date);
                                                    setValue({ ...value, ['ArrestDtTm']: getShowingWithOutTime(date) })
                                                }}
                                                dateFormat="MM/yyyy"
                                                showMonthYearPicker
                                                maxDate={new Date()}
                                                autoComplete="nope"
                                                placeholderText={'Select...'}
                                            />
                                            <label htmlFor="" className='pt-1'>Arrest From Date</label>
                                        </div>
                                    </div>
                                    <div className="col-3 col-md-3 col-lg-3 mt-1">
                                        <div className=" dropdown__box">
                                            <Select
                                                name='NIBRSID'
                                                styles={customStylesWithOutColor}
                                                value={nibrsCodeDrp?.filter((obj) => obj.value === value?.NIBRSID)}
                                                isClearable
                                                options={nibrsCodeDrp}
                                                onChange={(e) => ChangeDropDown(e, 'NIBRSID')}
                                                placeholder="Select..."
                                            />
                                            <label>FBI Code</label>
                                        </div>
                                    </div>
                                    <div className="col-3 col-md-3 col-lg-3 mt-1">
                                        <div className=" dropdown__box">
                                            <Select
                                                name='ChargeCodeID'
                                                styles={customStylesWithOutColor}
                                                value={rmsCfsID?.filter((obj) => obj.value === value?.ChargeCodeID)}
                                                isClearable
                                                // isMulti
                                                options={rmsCfsID}
                                                onChange={(e) => ChangeDropDown(e, 'ChargeCodeID')}
                                                placeholder="Select..."
                                            />
                                            <label>RMS CFS Code</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 mt-3 text-right">
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { getIncidentSearchData(); }}>Show Report</button>
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { resetFields(); }}>Clear</button>
                                    <Link to={'/Reports'}>
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
            {
                verifyArrest &&
                <>
                    <div className="col-12 col-md-12 col-lg-12 pt-2  px-2" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">Arrest By Charge Report</p>
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
                                        <h5 className='text-dark text-bold'>{reportData?.Agency_Name} Test Test Test</h5>
                                        <p className='text-p'>Address: <span className=''>{reportData?.Agency_Address1}Test</span></p>
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
                                <div className="row">
                                    {
                                        reportData?.Charge?.map((obj) =>

                                            JSON.parse(obj?.Arrest)?.length > 0 ?
                                                <>
                                                    <div className="table-responsive">
                                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                            <p className="p-0 m-0 d-flex align-items-center"> Charge Code: {obj?.ChargeCodeDescription}</p>
                                                        </div>
                                                        <table className="table ">
                                                            <thead className=''>
                                                                <tr>
                                                                    <th style={{ width: '150px' }}>Arrest Number:</th>
                                                                    <th style={{ width: '200px' }}>Arrest Date/Time</th>
                                                                    <th style={{ width: '250px' }}>Arrestee:</th>
                                                                    <th style={{ width: '200px' }}>Officer Name:</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    JSON.parse(obj?.Arrest)?.map((item, key) => (
                                                                        <>
                                                                            <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                <td>{item?.ArrestNumber}</td>
                                                                                <td>{item?.ArrestDtTm && getShowingWithOutTime(item?.ArrestDtTm)}</td>
                                                                                <td>{item?.Arrestee_Name}</td>
                                                                                <td>{item?.Supervisor_Name}</td>
                                                                            </tr>
                                                                        </>
                                                                    ))
                                                                }
                                                            </tbody>
                                                        </table>
                                                        <hr />
                                                    </div>
                                                </>
                                                :
                                                <>
                                                </>
                                        )
                                    }
                                </div>
                            </div >
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default ArrestMonthlyCharge