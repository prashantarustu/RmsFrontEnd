import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import img from '../../../../../src/img/images1.jpg'
import Select from "react-select";
import { Decrypt_Id_Name, customStylesWithOutColor, getShowingDateText, getShowingMonthDateYear } from '../../../Common/Utility';
import DatePicker from "react-datepicker";
import { fetchPostData } from '../../../hooks/Api';
import { useReactToPrint } from 'react-to-print';
import { threeColArray } from '../../../Common/ChangeArrayFormat';
import { useContext } from 'react';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { toastifyError } from '../../../Common/AlertMsg';

const MasterPropertyReport = () => {

    const { propertyLossCodeData, get_PropertyLossCode, localStoreArray, setLocalStoreArray, get_LocalStorage} = useContext(AgencyContext)
    const [propertyTypeData, setPropertyTypeData] = useState([]);
    const [verifyReport, setverifyReport] = useState(false);
    const [reportedData, setReportedData] = useState([]);

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
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    const [value, setValue] = useState({
        PropertyTypeID: null,
        LossCodeID: null,
        ReportedDtTm: "",
        ReportedDtTmTo: "",
        PropertyNumber: '',
        PropertyNumberTo: '',
        ValueTo: '',
        ValueFrom: '',
        LastName: '',
        FirstName: '',
        MiddleName: '',
        FirstName: '',
        AgencyID: LoginAgencyID,
    });

    useEffect(() => {
        // get_Property_Report_Data();
        get_PropertyType(LoginAgencyID);
    }, [LoginAgencyID])

    // const get_Property_Report_Data = () => {
    //     const val = {
    //         'MasterPropertyID': sessionStorage.getItem('MasterPropertyID') ? Decrypt_Id_Name(sessionStorage.getItem('MasterPropertyID'), 'MForMasterPropertyID') : '',
    //         'AgencyID': localStorage.getItem('AgencyID') ? Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID') : '',
    //     }
    //     fetchPostData('ReportProperty/GetData_ReportProperty', val).then((res) => {
    //         if (res) { setReportedData(res) }
    //         else setReportedData([]);
    //     })
    // }

    // useEffect(() => {
    //     if (reportedData) {
    //         setverifyReport(true);
    //     } else {
    //         setverifyReport(false);
    //     }
    // }, []);

    const get_PropertyType = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('PropertyCategory/GetDataDropDown_PropertyCategory', val).then((data) => {
            if (data) {
                const res = data?.filter((val) => {
                    if (val.PropertyCategoryCode !== "V") return val
                })
                // const id = data?.filter((val) => { if (val.PropertyCategoryCode === "A") return val })
                // if (id.length > 0) {
                //   // setValue({ ...value,['PropertyTypeID']: id[0].PropertyCategoryID, ['PropertyCategoryCode']: id[0].PropertyCategoryCode,});
                //   setValue(prevValues => { return { ...prevValues, ['PropertyTypeID']: id[0].PropertyCategoryID, ['PropertyCategoryCode']: id[0].PropertyCategoryCode, } })
                //   PropertyCategory(id[0].PropertyCategoryID)
                // }
                setPropertyTypeData(threeColArray(res, 'PropertyCategoryID', 'Description', 'PropertyCategoryCode'))
            } else {
                setPropertyTypeData([]);
            }
        })
    }

    const componentRef = useRef();
    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onAfterPrint: () => { '' }
    })

    const get_PropertyReport = () => {
        fetchPostData('ReportProperty/GetData_ReportProperty', value).then((res) => {
            if (res.length > 0) {
                console.log(res[0]);
                setReportedData(res[0]); setverifyReport(true);
            }
            else {
                toastifyError("Data Not Available"); setverifyReport(false); setReportedData([]);
            }
        })
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'PropertyTypeID') {
                setValue({
                    ...value,
                    [name]: e.value
                });
                switch (e.id) {
                    case 'A': get_PropertyLossCode('1', '', '', '', '', ''); break;
                    case 'B': get_PropertyLossCode('', '1', '', '', '', ''); break;
                    case 'S': get_PropertyLossCode('', '', '1', '', '', ''); break;
                    case 'O': get_PropertyLossCode('', '', '', '1', '', ''); break;
                    case 'D': get_PropertyLossCode('', '', '', '', '1', ''); break;
                    case 'G': get_PropertyLossCode('', '', '', '', '', '1'); break;
                    default: get_PropertyLossCode('1', '', '', '', '', '');
                }
            } else {
                setValue({
                    ...value,
                    [name]: e.value
                })
            }
        } else {
            if (name === 'PropertyTypeID') {
                setValue({
                    ...value,
                    [name]: null,
                    ['LossCodeID']: null
                })
            } else {
                setValue({
                    ...value,
                    [name]: null
                })
            }
        }
    }

    const handlChange = (e,) => {
        if (e.target.name === 'PropertyNumber') {
            var ele = e.target.value.replace(/[^a-zA-Z\s^0-9\s]/g, '');
            if (ele.length === 10) {
                var cleaned = ('' + ele).replace(/[^a-zA-Z\s^0-9\s]/g, '');
                var match = cleaned.match(/^(\w{3})(\d{7})$/);
                if (match) {
                    setValue({
                        ...value,
                        [e.target.name]: match[1].toUpperCase() + '-' + match[2]
                    })
                }
            } else {
                ele = e.target.value.split("'").join('').replace(/[^a-zA-Z\s^0-9\s]/g, '');
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
            PropertyTypeID: null,
            LossCodeID: null,
            ReportedDtTm: "",
            ReportedDtTmTo: "",
            PropertyNumber: '',
            PropertyNumberTo: '',
            ValueTo: '',
            ValueFrom: '',
            LastName: '',
            FirstName: '',
            MiddleName: '',
            FirstName: '',
        });
        setverifyReport(false); setReportedData([]);
    }

    return (
        <>
            <div class="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="col-12 col-md-12 col-lg-12 mb-2 " >
                                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                        <p className="p-0 m-0 d-flex align-items-center">Property Master Report</p>
                                    </div>
                                    <fieldset className='fieldset'>
                                        <legend>Property Information</legend>
                                        <div className="row">

                                            <div className="col-6 col-md-6 col-lg-3 mb-1">
                                                <div className="dropdown__box">
                                                    <DatePicker
                                                        name='ReportedDtTm'
                                                        id='ReportedDtTm'
                                                        onChange={(date) => { setValue({ ...value, ['ReportedDtTm']: date ? getShowingDateText(date) : null }) }}
                                                        selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                                        dateFormat="MM/dd/yyyy"
                                                        timeInputLabel
                                                        isClearable={value?.ReportedDtTm ? true : false}
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
                                                        name='ReportedDtTmTo'
                                                        id='ReportedDtTmTo'
                                                        onChange={(date) => { setValue({ ...value, ['ReportedDtTmTo']: date ? getShowingDateText(date) : null }) }}
                                                        selected={value?.ReportedDtTmTo && new Date(value?.ReportedDtTmTo)}
                                                        dateFormat="MM/dd/yyyy"
                                                        timeInputLabel
                                                        isClearable={value?.ReportedDtTmTo ? true : false}
                                                        peekNextMonth
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        autoComplete='Off'
                                                        maxDate={new Date()}
                                                        placeholderText='Select...'
                                                    />
                                                    <label htmlFor="" className='pl-0 pt-1' >Reported To Date</label>
                                                </div>
                                            </div>
                                            <div className="col-2  col-md-3 col-lg-2 " style={{ marginTop: '5px' }}>
                                                <div className="text-field">
                                                    <input type="text" name='ValueFrom' id='ValueFrom' value={value?.ValueFrom} onChange={handlChange} className='' />
                                                    <label htmlFor="" className='pt-1'>Value From</label>
                                                </div>
                                            </div>
                                            <div className="col-2  col-md-3 col-lg-1 " style={{ marginTop: '5px' }}>
                                                <div className="text-field">
                                                    <input type="text" name='ValueTo' id='ValueTo' value={value?.ValueTo} onChange={handlChange} className='' />
                                                    <label htmlFor="" className='pt-1'>Value To</label>
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-6 col-lg-3 mt-1" >
                                                <div className=" dropdown__box">
                                                    <Select
                                                        styles={customStylesWithOutColor}
                                                        name='PropertyTypeID'
                                                        value={propertyTypeData?.filter((obj) => obj.value === value?.PropertyTypeID)}
                                                        options={propertyTypeData}
                                                        onChange={(e) => ChangeDropDown(e, 'PropertyTypeID')}
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                    <label htmlFor="">Property Type</label>
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-6 col-lg-3 ">
                                                <div className=" dropdown__box">
                                                    <Select
                                                        name='LossCodeID'
                                                        styles={customStylesWithOutColor}
                                                        value={propertyLossCodeData?.filter((obj) => obj.value === value?.LossCodeID)}
                                                        options={propertyLossCodeData}
                                                        onChange={(e) => ChangeDropDown(e, 'LossCodeID')}
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                    <label htmlFor="">Property Reason</label>
                                                </div>
                                            </div>
                                            <div className="col-3  col-md-6 col-lg-2" style={{ marginTop: '2px' }}>
                                                <div className="text-field">
                                                    <input type="text" name='PropertyNumber' id='PropertyNumber' value={value?.PropertyNumber} onChange={handlChange} className='' />
                                                    <label htmlFor="" className='pt-1'>Property Id</label>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <fieldset className='fieldset'>
                                        <legend>Property Owner</legend>
                                        <div className="row">
                                            <div className="col-4  col-md-4 col-lg-4 " >
                                                <div className="text-field">
                                                    <input type="text" name='LastName' id='LastName' value={value?.LastName} onChange={handlChange} />
                                                    <label htmlFor="">Last Name</label>
                                                </div>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-4 " >
                                                <div className="text-field">
                                                    <input type="text" name='FirstName' id='FirstName' value={value?.FirstName} onChange={handlChange} />
                                                    <label htmlFor="">First Name</label>
                                                </div>
                                            </div>
                                            <div className="col-4  col-md-4 col-lg-4 " >
                                                <div className="text-field">
                                                    <input type="text" name='MiddleName' id='MiddleName' value={value?.MiddleName} onChange={handlChange} className='' />
                                                    <label htmlFor="">Middle Name</label>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                    <div className="col-12 col-md-12 col-lg-12 text-right mt-3">
                                        <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { get_PropertyReport(); }}>Show Report</button>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { resetFields(); }}>Clear</button>
                                        <Link to={'/Reports'}>
                                            <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* for 1 table */}
                {
                    verifyReport ?
                        <>
                            <div className="col-12 col-md-12 col-lg-12 pt-2  px-2">
                                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                    <p className="p-0 m-0 d-flex align-items-center">Property Master Report</p>
                                    <div style={{ marginLeft: 'auto' }}>
                                        <Link to={''} onClick={() => { printForm(); }} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                            <i className="fa fa-print"></i>
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
                                        reportedData?.Property?.length > 0 ?
                                            <>
                                                <div className="col-4 col-md-3 col-lg-2 ">
                                                    <div className="main">
                                                        <img src={reportedData?.Agency_Photo} className="img-fluid" alt style={{ border: '1px solid aliceblue', marginTop: '4px', width: '150px' }} />
                                                    </div>
                                                </div>
                                                <div className="col-7  col-md-7 col-lg-9 mt-4">
                                                    <div className="main">
                                                        <h5 className='text-dark text-bold'>{reportedData?.Agency_Name}</h5>
                                                        <p className='text-p'>Address: <span className='new-span'>{reportedData?.Agency_Address1}</span></p>
                                                        <div className='d-flex '>
                                                            <p className='text-p'>State: <span className='new-span'>{reportedData?.StateName}</span>
                                                            </p>
                                                            <p className='text-p ml-5 pl-1'>City: <span className='new-span'>{reportedData?.CityName}</span>
                                                            </p>
                                                            <p className='text-p ml-2'>Zip: <span className='new-span'>{reportedData?.ZipId}</span>
                                                            </p>
                                                        </div>
                                                        <div className='d-flex'>
                                                            <p className='text-p'>Phone: <span className='new-span'>{reportedData?.Agency_Phone}</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <>
                                            </>
                                    }
                                    {
                                        reportedData?.Property?.length > 0 ?
                                            <>
                                                {
                                                    reportedData?.Property?.map((obj) => (
                                                        <>
                                                            <div className="col-12">
                                                                <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                                            </div>
                                                            <div className="container" >
                                                                <h5 className=" text-white text-bold bg-green text-center py-1 px-3">Property Information:{obj?.PropertyNumber}</h5>
                                                                <div className="table-responsive" >
                                                                    <table className="table table-bordered" >
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>
                                                                                    <h6 className='text-dark text-bold'>Property Number:</h6>
                                                                                    <p className='text-list'>{obj?.PropertyNumber}</p>
                                                                                </td>
                                                                                <td>
                                                                                    <h6 className='text-dark text-bold'>Property Loss</h6>
                                                                                    <p className='text-list'>{obj?.PropertyLossCode_Description}</p>
                                                                                </td>
                                                                                <td >
                                                                                    <h6 className='text-dark text-bold'>Reported Date/Time:</h6>
                                                                                    <p className='text-list'>{obj?.ReportedDtTm ? getShowingDateText(obj?.ReportedDtTm) : null}</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td >
                                                                                    <h6 className='text-dark text-bold'>Property Type:</h6>
                                                                                    <p className='text-list'>{obj?.PropertyType_Description}</p>
                                                                                </td>
                                                                                <td>
                                                                                    <h6 className='text-dark text-bold'>Property Value:</h6>
                                                                                    <p className='text-list'>{obj?.Value}</p>
                                                                                </td>
                                                                                <td>
                                                                                    <h6 className='text-dark text-bold'>Property Reason:</h6>
                                                                                    <p className='text-list'>{obj?.Description}</p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>

                                                                {
                                                                    JSON.parse(obj?.Document)?.length > 0 ?
                                                                        <>
                                                                            <div className="table-responsive" >
                                                                                <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                    <p className="p-0 m-0 d-flex align-items-center">Property Document</p>
                                                                                </div>
                                                                                <table className="table table-bordered" >
                                                                                    <thead className='text-dark master-table'>
                                                                                        <tr>
                                                                                            <th className='' style={{ width: '100px' }}>Document Name</th>
                                                                                            <th className='' style={{ width: '100px' }}>Notes</th>
                                                                                            <th className='' style={{ width: '100px' }}>Document Type</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody >
                                                                                        {
                                                                                            JSON.parse(obj?.Document)?.map((item, key) => (
                                                                                                <>
                                                                                                    <tr key={key}>
                                                                                                        <td style={{ width: '100px' }} className='text-list'>{item.DocName}</td>
                                                                                                        <td style={{ width: '100px' }} className='text-list'>{item.Notes}</td>
                                                                                                        <td style={{ width: '100px' }} className='text-list'>{item.Description_Document}</td>
                                                                                                    </tr>
                                                                                                </>
                                                                                            ))
                                                                                        }
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <></>
                                                                }
                                                                {/* vehicle-recoverd */}
                                                                {/* {
                                                                    JSON.parse(obj?.RecoveredProperty)?.length > 0 ?
                                                                        <>
                                                                            <div className="table-responsive mt-2" >
                                                                                <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                    <p className="p-0 m-0 d-flex align-items-center">Recovered Property:</p>
                                                                                </div>
                                                                                <table className="table " >
                                                                                    <thead className='text-dark master-table'>
                                                                                        <tr>
                                                                                            <th className='' style={{ width: '100px' }}>Recovered Id Number</th>
                                                                                            <th className='' style={{ width: '100px' }}>Recovered Date/Time</th>
                                                                                            <th className='' style={{ width: '100px' }}>Recovery Type</th>
                                                                                            <th className='' style={{ width: '100px' }}>Recovered Value</th>
                                                                                            <th className='' style={{ width: '100px' }}>Comment</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {
                                                                                            JSON.parse(obj?.RecoveredProperty)?.map((item, key) => (
                                                                                                <>
                                                                                                    <tr key={key}>
                                                                                                        <td style={{ width: '100px' }} className='text-list'>{item.RecoveredIDNumber}</td>
                                                                                                        <td style={{ width: '100px' }} className='text-list'>{getShowingMonthDateYear(item.RecoveredDateTime)}</td>
                                                                                                        <td style={{ width: '100px' }} className='text-list'>{item.RecoveryType_Description}</td>
                                                                                                        <td style={{ width: '100px' }} className='text-list'>{item.RecoveredValue}</td>
                                                                                                        <td style={{ width: '100px' }} className='text-list'>{item.Comments}</td>
                                                                                                    </tr>
                                                                                                </>
                                                                                            ))
                                                                                        }
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <></>
                                                                } */}


                                                                {
                                                                    JSON.parse(obj?.Owner)?.length > 0 ?
                                                                        <>
                                                                            <div className="table-responsive" >
                                                                                <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                    <p className="p-0 m-0 d-flex align-items-center">Property Owner:</p>
                                                                                </div>
                                                                                <table className="table " >
                                                                                    <thead className='text-dark master-table'>
                                                                                        <tr>
                                                                                            <th className=''>Owner Name</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody >
                                                                                        {
                                                                                            JSON.parse(obj?.Owner)?.map((item, key) => (
                                                                                                <>
                                                                                                    <tr key={key} >
                                                                                                        <td className='text-list'>{item.Owner_Name}</td>
                                                                                                    </tr>
                                                                                                </>
                                                                                            ))
                                                                                        }
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <></>
                                                                }
                                                                {
                                                                    JSON.parse(obj?.Article)?.length > 0 ?
                                                                        <>
                                                                            <div className="table-responsive" >
                                                                                <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                    <p className="p-0 m-0 d-flex align-items-center">Property Article</p>
                                                                                </div>

                                                                                <table className="table table-bordered" >
                                                                                    <tbody className='master-tbody'>
                                                                                        {
                                                                                            JSON.parse(obj?.Article)?.map((item, key) => (
                                                                                                <>
                                                                                                    <tr>
                                                                                                        <td>
                                                                                                            <h6 className='text-dark text-bold'>Article ID Number:</h6>
                                                                                                            <p className='text-list'>{item.ArticleIDNumber}</p>
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <h6 className='text-dark text-bold'>Model ID</h6>
                                                                                                            <p className='text-list'>{item.ModelID}</p>
                                                                                                        </td>
                                                                                                        <td >
                                                                                                            <h6 className='text-dark text-bold'>OAN:</h6>
                                                                                                            <p className='text-list'>{item.OAN}</p>
                                                                                                        </td>
                                                                                                        <td>
                                                                                                            <h6 className='text-dark text-bold'>Quantity:</h6>
                                                                                                            <p className='text-list'>{item.Quantity}</p>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    <tr>
                                                                                                        <td>
                                                                                                            <h6 className='text-dark text-bold'>Serial ID</h6>
                                                                                                            <p className='text-list'>{item.SerialID}</p>
                                                                                                        </td>
                                                                                                        <td colSpan={2}>
                                                                                                            <h6 className='text-dark text-bold'>Top Color Description:</h6>
                                                                                                            <p className='text-list'>{item.TopColor_Description}</p>
                                                                                                        </td>
                                                                                                        <td colSpan={2}>
                                                                                                            <h6 className='text-dark text-bold'>Bottom Color Description:</h6>
                                                                                                            <p className='text-list'>{item.BottomColor_Description}</p>
                                                                                                        </td>
                                                                                                    </tr>

                                                                                                </>
                                                                                            ))
                                                                                        }
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <>
                                                                        </>
                                                                }
                                                                {
                                                                    JSON.parse(obj?.Drug)?.length > 0 ?
                                                                        <>
                                                                            <div className="table-responsive" >
                                                                                <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                    <p className="p-0 m-0 d-flex align-items-center">Property Drug:</p>
                                                                                </div>

                                                                                <table className="table " >
                                                                                    <thead className='text-dark master-table'>
                                                                                        <tr>
                                                                                            <th className='' style={{ width: '100px' }}>Estimated Drug Qty</th>
                                                                                            <th className='' style={{ width: '100px' }}>Fraction Drug Qty</th>
                                                                                            <th className='' style={{ width: '100px' }}>Measurement Type</th>
                                                                                            <th className='' style={{ width: '100px' }}>Suspected Drug Type</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody >
                                                                                        {
                                                                                            JSON.parse(obj?.Drug)?.map((item, key) => (
                                                                                                <>
                                                                                                    <tr key={key} >
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.EstimatedDrugQty}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.FractionDrugQty}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.MeasurementType_Description}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.SuspectedDrugType_Description}</td>
                                                                                                    </tr>
                                                                                                </>
                                                                                            ))
                                                                                        }
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <>
                                                                        </>
                                                                }
                                                                {
                                                                    JSON.parse(obj?.Boat)?.length > 0 ?
                                                                        <>
                                                                            <div className="table-responsive" >
                                                                                <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                    <p className="p-0 m-0 d-flex align-items-center">Property Boat:</p>
                                                                                </div>

                                                                                <table className="table " >
                                                                                    <thead className='text-dark master-table'>
                                                                                        <tr>
                                                                                            <th className='' style={{ width: '100px' }}>Boat ID Number</th>
                                                                                            <th className='' style={{ width: '100px' }}>Registration Number</th>
                                                                                            <th className='' style={{ width: '100px' }}>Registration State</th>
                                                                                            <th className='' style={{ width: '100px' }}>Model</th>
                                                                                            <th className='' style={{ width: '100px' }}>Material </th>
                                                                                            <th className='' style={{ width: '100px' }}>Manufacture Year </th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody className=''>
                                                                                        {
                                                                                            JSON.parse(obj?.Boat)?.map((item, key) => (
                                                                                                <>
                                                                                                    <tr key={key} >
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.BoatIDNumber}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.RegistrationNumber}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.Registration_StateName}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.Model_Description}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.Material_Description}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.ManufactureYear}</td>
                                                                                                    </tr>
                                                                                                </>
                                                                                            ))
                                                                                        }
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <>
                                                                        </>
                                                                }
                                                                {
                                                                    JSON.parse(obj?.Other)?.length > 0 ?
                                                                        <>
                                                                            <div className="table-responsive" >
                                                                                <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                    <p className="p-0 m-0 d-flex align-items-center">Property Other:</p>
                                                                                </div>
                                                                                <table className="table ">
                                                                                    <thead className='text-dark master-table'>
                                                                                        <tr>
                                                                                            <th className='' style={{ width: '100px' }}>Model ID</th>
                                                                                            <th className='' style={{ width: '100px' }}>Brand</th>
                                                                                            <th className='' style={{ width: '100px' }}>Quantity</th>
                                                                                            <th className='' style={{ width: '100px' }}>Top Color</th>
                                                                                            <th className='' style={{ width: '100px' }}>Bottom Color</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody className=''>
                                                                                        {
                                                                                            JSON.parse(obj?.Other)?.map((item, key) => (
                                                                                                <>
                                                                                                    <tr key={key} >
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.ModelID}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.Brand}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.Quantity}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.TopColor_Description}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.BottomColor_Description}</td>
                                                                                                    </tr>
                                                                                                </>
                                                                                            ))
                                                                                        }
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <></>
                                                                }
                                                                {
                                                                    JSON.parse(obj?.Security)?.length > 0 ?
                                                                        <>
                                                                            <div className="table-responsive" >
                                                                                <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                    <p className="p-0 m-0 d-flex align-items-center">Property Security:</p>
                                                                                </div>

                                                                                <table className="table " >
                                                                                    <thead className='text-dark master-table'>
                                                                                        <tr>
                                                                                            <th className='' style={{ width: '100px' }}>Security ID Number</th>
                                                                                            <th className='' style={{ width: '100px' }}>Denomination</th>
                                                                                            <th className='' style={{ width: '100px' }}>IssuingAgency</th>
                                                                                            <th className='' style={{ width: '100px' }}>MeasureTypeID</th>
                                                                                            <th className='' style={{ width: '100px' }}>SerialID</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody >
                                                                                        {
                                                                                            JSON.parse(obj?.Security)?.map((item, key) => (
                                                                                                <>
                                                                                                    <tr key={key} >
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.SecurityIDNumber}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.Denomination}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.IssuingAgency}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.MeasureTypeID}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.SerialID}</td>
                                                                                                    </tr>
                                                                                                </>
                                                                                            ))
                                                                                        }
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <></>
                                                                }
                                                                {
                                                                    JSON.parse(obj?.weapon)?.length > 0 ?
                                                                        <>
                                                                            <div className="table-responsive" >
                                                                                <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                    <p className="p-0 m-0 d-flex align-items-center">Property Weapon:</p>
                                                                                </div>

                                                                                <table className="table table-bordered">
                                                                                    <thead className='text-dark master-table'>
                                                                                        <tr>
                                                                                            <th className='' style={{ width: '100px' }}>Weapon ID Number</th>
                                                                                            <th className='' style={{ width: '100px' }}>Style</th>
                                                                                            <th className='' style={{ width: '100px' }}>Manufacture Year</th>
                                                                                            <th className='' style={{ width: '100px' }}>Barrel Length</th>
                                                                                            <th className='' style={{ width: '100px' }}>Caliber</th>
                                                                                            <th className='' style={{ width: '100px' }}>Finish</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody className='master-tbody'>
                                                                                        {
                                                                                            JSON.parse(obj?.weapon)?.map((item, key) => (
                                                                                                <>
                                                                                                    <tr key={key} >
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.WeaponIDNumber}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.Style}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.ManufactureYear}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.BarrelLength}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.Caliber}</td>
                                                                                                        <td className='text-list' style={{ width: '100px' }}>{item.Finish}</td>
                                                                                                    </tr>
                                                                                                </>
                                                                                            ))
                                                                                        }
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </>
                                                                        :
                                                                        <></>
                                                                }
                                                                {/* {
                                                                    JSON.parse(obj?.PropertyArticle)?.length > 0 ?
                                                                        <>
                                                                            <h5 className=" text-white text-bold bg-green py-1 px-3">Property Vehicle:</h5>
                                                                            <table className="table table-bordered" >
                                                                                <thead className='text-dark master-table'>
                                                                                    <tr>
                                                                                        <th className=''>ArticleIDNumber</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className='master-tbody'>
                                                                                    {
                                                                                        JSON.parse(obj?.PropertyArticle)?.map((item, key) => (
                                                                                            <>
                                                                                                <tr key={key} >
                                                                                                    <td>{item.ArticleIDNumber}</td>
                                                                                                </tr>
                                                                                            </>
                                                                                        ))
                                                                                    }
                                                                                </tbody>
                                                                            </table>
                                                                        </>
                                                                        :
                                                                        <></>
                                                                } */}
                                                                <div className="table-responsive" >
                                                                    <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                        <p className="p-0 m-0 d-flex align-items-center">Property Image:</p>
                                                                    </div>
                                                                    <table className="table table-bordered" >
                                                                        <tbody className=''>


                                                                            <div className="col-12">
                                                                                <div className="row">
                                                                                    {
                                                                                        JSON.parse(obj?.Photo)?.length > 0 ?
                                                                                            JSON.parse(obj?.Photo)?.map((item, index) => {
                                                                                                return (
                                                                                                    <div className="col-3">
                                                                                                        <div className="main" key={index}>
                                                                                                            <img src={item.Photo} style={{ height: '200px' }} />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )
                                                                                            })
                                                                                            :
                                                                                            <>
                                                                                            </>
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ))
                                                }
                                            </>
                                            :
                                            <>
                                            </>
                                    }
                                </div>
                            </div>
                        </>
                        :
                        <>
                        </>
                }
            </div >
        </>
    )
}

export default MasterPropertyReport