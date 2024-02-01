import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import img from '../../../../../src/img/images1.jpg'
import Select from "react-select";
import { Decrypt_Id_Name, customStylesWithOutColor, getShowingDateText, getShowingMonthDateYear, getYearWithOutDateTime } from '../../../Common/Utility';
import DatePicker from "react-datepicker";
import { fetchPostData } from '../../../hooks/Api';
import { useReactToPrint } from 'react-to-print';
import { threeColArray } from '../../../Common/ChangeArrayFormat';
import { useContext } from 'react';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { toastifyError } from '../../../Common/AlertMsg';

const VehicleMasterReport = () => {

    const { propertyLossCodeData, get_PropertyLossCode,localStoreArray, setLocalStoreArray, get_LocalStorage } = useContext(AgencyContext)
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
            console.log(localStoreArray)
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
        get_PropertyType();
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
                                        <p className="p-0 m-0 d-flex align-items-center">Vehicle Master Report</p>
                                    </div>
                                    <fieldset className='fieldset'>
                                        <legend>Vehicle Information</legend>
                                        <div className="row">
                                            <div className="col-3  col-md-3 col-lg-2" style={{ marginTop: '5px' }}>
                                                <div className="text-field">
                                                    <input type="text" name='PropertyNumber' id='PropertyNumber' value={value?.PropertyNumber} onChange={handlChange} className='' />
                                                    <label htmlFor="" className='pt-1'>Vehicle Number From</label>
                                                </div>
                                            </div>
                                            <div className="col-3  col-md-3 col-lg-2" style={{ marginTop: '5px' }}>
                                                <div className="text-field">
                                                    <input type="text" name='PropertyNumber' id='PropertyNumber' value={value?.PropertyNumber} onChange={handlChange} className='' />
                                                    <label htmlFor="" className='pt-1'>Vehicle Number To</label>
                                                </div>
                                            </div>
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
                                                    <label htmlFor="" className='pl-0 pt-1' >Reported Date From</label>
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
                                                    <label htmlFor="" className='pl-0 pt-1' >Reported Date To</label>
                                                </div>
                                            </div>
                                            <div className="col-2  col-md-2 col-lg-1 " style={{ marginTop: '5px' }}>
                                                <div className="text-field">
                                                    <input type="text" name='ValueFrom' id='ValueFrom' value={value?.ValueFrom} onChange={handlChange} className='' />
                                                    <label htmlFor="" className='pt-1'>Value From</label>
                                                </div>
                                            </div>
                                            <div className="col-2  col-md-2 col-lg-1 " style={{ marginTop: '5px' }}>
                                                <div className="text-field">
                                                    <input type="text" name='ValueTo' id='ValueTo' value={value?.ValueTo} onChange={handlChange} className='' />
                                                    <label htmlFor="" className='pt-1'>Value To</label>
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-5 col-lg-3 mt-1" >
                                                <div className=" dropdown__box">
                                                    <Select
                                                        styles={customStylesWithOutColor}
                                                        name='PropertyTypeID'
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                    <label htmlFor="">Vehicle Category</label>
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-4 col-lg-3 mt-1">
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
                                                    <label htmlFor="">Loss Code</label>
                                                </div>
                                            </div>

                                        </div>
                                    </fieldset>
                                    <fieldset className='fieldset'>
                                        <legend>Vehicle Owner</legend>
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
                                    <p className="p-0 m-0 d-flex align-items-center">Vehicle Master Report</p>
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
                                                                {/* <h5 className=" text-white text-bold bg-green text-center  py-1 px-3">Vehicle Information:{obj?.PropertyNumber}</h5>
                                                                <div className="table-responsive" style={{ border: '1px solid #ddd' }}>
                                                                    <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                        <p className="p-0 m-0 d-flex align-items-center">Property Information</p>
                                                                    </div>
                                                                    <table className="table table-bordered" >
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>
                                                                                    <h6 className='text-dark text-bold'>Property Number:</h6>
                                                                                    <p>{obj?.PropertyNumber}</p>
                                                                                </td>
                                                                             
                                                                                <td>
                                                                                    <h6 className='text-dark text-bold'>Expiration Date</h6>
                                                                                    <p>{obj?.InspectionExpiresDtTm ? getShowingMonthDateYear(obj?.InspectionExpiresDtTm) : null}</p>
                                                                                </td>
                                                                                <td >
                                                                                    <h6 className='text-dark text-bold'>Reported Date/Time:</h6>
                                                                                    <p>{obj?.ReportedDtTm ? getShowingDateText(obj?.ReportedDtTm) : null}</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td >
                                                                                    <h6 className='text-dark text-bold'>Property Type:</h6>
                                                                                    <p>{obj?.PropertyType_Description}</p>
                                                                                </td>
                                                                                <td>
                                                                                    <h6 className='text-dark text-bold'>Property Value:</h6>
                                                                                    <p>{obj?.Value}</p>
                                                                                </td>
                                                                                <td>
                                                                                    <h6 className='text-dark text-bold'>Property Reason:</h6>
                                                                                    <p>{obj?.Description}</p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>






                                                       
                                                                    <table className="table table-bordered" style={{ marginTop: '-15px' }}>
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
                                                                </div> */}


                                                                <div className="table-responsive mt-2" >
                                                                    <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                        <p className="p-0 m-0 d-flex align-items-center">Vehicle Information:</p>
                                                                    </div>
                                                                    <table className="table table-bordered" >
                                                                        <tbody>
                                                                            <tr>
                                                                                <td colSpan={3}>
                                                                                    <h6 className='text-dark text-bold'>Vehicle Number:</h6>
                                                                                    <p className='text-list'>{obj?.VehicleNumber}</p>
                                                                                </td>
                                                                                {/* <td colSpan={3}>
                                                                                    <h6 className='text-dark text-bold'>Vehicle Id:</h6>
                                                                                    <p>{obj?.VehicleNumber}</p>
                                                                                </td> */}
                                                                                <td colSpan={3}>
                                                                                    <h6 className='text-dark text-bold'>VIN</h6>
                                                                                    <p className='text-list'>{obj?.VIN}</p>
                                                                                </td>
                                                                                <td colSpan={3}>
                                                                                    <h6 className='text-dark text-bold'>State Plate Id</h6>
                                                                                    <p className='text-list'>{obj?.PlateID}</p>
                                                                                </td>
                                                                                <td colSpan={3}>
                                                                                    <h6 className='text-dark text-bold'>Category</h6>
                                                                                    <p className='text-list'>{obj?.Category_Description}</p>
                                                                                </td>
                                                                                {/* <td>
                                                                                    <h6 className='text-dark text-bold'>Expiration Date</h6>
                                                                                    <p>{obj?.InspectionExpiresDtTm ? getShowingMonthDateYear(obj?.InspectionExpiresDtTm) : null}</p>
                                                                                </td>
                                                                                <td >
                                                                                    <h6 className='text-dark text-bold'>Reported Date/Time:</h6>
                                                                                    <p>{obj?.ReportedDtTm ? getShowingDateText(obj?.ReportedDtTm) : null}</p>
                                                                                </td> */}
                                                                            </tr>
                                                                            <tr>
                                                                                <td colSpan={3}>
                                                                                    <h6 className='text-dark text-bold'>Plate Type:</h6>
                                                                                    <p className='text-list'>{obj?.PlateType_Description}</p>
                                                                                </td>
                                                                                <td colSpan={3}>
                                                                                    <h6 className='text-dark text-bold'>Make:</h6>
                                                                                    <p className='text-list'>{obj?.Make_Description}</p>
                                                                                </td>
                                                                                <td colSpan={3}>
                                                                                    <h6 className='text-dark text-bold'>Top Color:</h6>
                                                                                    <p className='text-list'>{obj?.TopColor_Description}</p>
                                                                                </td>
                                                                                <td colSpan={3}>
                                                                                    <h6 className='text-dark text-bold'>Bottom Color:</h6>
                                                                                    <p className='text-list'>{obj?.BottomColor_Description}</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colSpan={3}>
                                                                                    <h6 className='text-dark text-bold'>Model:</h6>
                                                                                    <p className='text-list'>{obj?.Model_Description}</p>
                                                                                </td>
                                                                                <td colSpan={3}>
                                                                                    <h6 className='text-dark text-bold'>Style:</h6>
                                                                                    <p className='text-list'>{obj?.Style_Description}</p>
                                                                                </td>
                                                                                <td colSpan={3}>
                                                                                    <h6 className='text-dark text-bold'>VOD:</h6>
                                                                                    <p className='text-list'>{obj?.VOD_Description}</p>
                                                                                </td>
                                                                                <td colSpan={3}>
                                                                                    <h6 className='text-dark text-bold'>ManufactureYear:</h6>
                                                                                    <p className='text-list'>{obj?.ManufactureYear ? getYearWithOutDateTime(obj?.ManufactureYear) : null}</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colSpan={3}>
                                                                                    <h6 className='text-dark text-bold'>Plate Expire Year:</h6>
                                                                                    <p className='text-list'>{obj?.PlateExpireDtTm ? getShowingMonthDateYear(obj?.PlateExpireDtTm) : null}</p>
                                                                                </td>
                                                                                <td colSpan={3}>
                                                                                    <h6 className='text-dark text-bold'>Owner Name Id:</h6>
                                                                                    <p className='text-list'>{obj?.NameIDNumber}</p>
                                                                                </td>
                                                                                <td colSpan={3}>
                                                                                    <h6 className='text-dark text-bold'>Owner</h6>
                                                                                    <p className='text-list'>{obj?.Owner__Description}</p>
                                                                                </td>
                                                                                <td colSpan={3}>
                                                                                    <h6 className='text-dark text-bold'>SSN</h6>
                                                                                    <p className='text-list'>{obj?.SSN}</p>
                                                                                </td>

                                                                            </tr>
                                                                            <tr>

                                                                                <td colSpan={10}>
                                                                                    <h6 className='text-dark text-bold'>Address</h6>
                                                                                    <p className='text-list'>{obj?.Address}</p>
                                                                                </td>

                                                                                <td colSpan={2}>
                                                                                    <h6 className='text-dark text-bold'>Phone Number</h6>
                                                                                    <p className='text-list'>{obj?.PhoneNo}</p>
                                                                                </td>
                                                                            </tr>

                                                                        </tbody>
                                                                    </table>








                                                                    {/* <table className="table table-bordered" >
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
                                                                    </table> */}
                                                                </div>
                                                                {/* vehicle-document */}
                                                                <div className="table-responsive mt-2" >
                                                                    <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                        <p className="p-0 m-0 d-flex align-items-center">Vehicle Document:</p>
                                                                    </div>
                                                                    <table className="table " >
                                                                        <thead className='text-dark master-table'>
                                                                            <tr>
                                                                                <th className='' style={{ width: '50px' }}>Document Name</th>
                                                                                <th className='' style={{ width: '50px' }}>Notes</th>
                                                                                <th className=''>Document Type</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {
                                                                                JSON.parse(obj?.Document)?.map((item, key) => (
                                                                                    <>
                                                                                        <tr key={key}>
                                                                                            <td style={{ width: '50px' }} className='text-list'>{item.DocumentName}</td>
                                                                                            <td style={{ width: '50px' }} className='text-list'>{item.Notes}</td>
                                                                                            <td style={{ width: '50px' }} className='text-list'>{item.DocumentType_Description}</td>
                                                                                        </tr>
                                                                                    </>
                                                                                ))
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                                {/* vehicle-recoverd */}
                                                                <div className="table-responsive mt-2" >
                                                                    <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                        <p className="p-0 m-0 d-flex align-items-center">Vehicle Recovered:</p>
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
                                                                                JSON.parse(obj?.Document)?.map((item, key) => (
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
                                                                {/* vehicle-img */}
                                                                <div className="table-responsive mt-3">


                                                                    <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                        <p className="p-0 m-0 d-flex align-items-center">Vehicle Image Information</p>
                                                                    </div>
                                                                    <table className="table table-bordered" >
                                                                        <tbody className=''>
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
            </div>
        </>
    )
}

export default VehicleMasterReport