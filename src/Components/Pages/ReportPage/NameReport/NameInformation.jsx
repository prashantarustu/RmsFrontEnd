import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import img from '../../../../../src/img/images1.jpg'
import Select from "react-select";
import { Decrypt_Id_Name, customStylesWithOutColor, getShowingDateText, getShowingWithOutTime } from '../../../Common/Utility';
import DatePicker from "react-datepicker";
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { useEffect } from 'react';
import { fetchPostData } from '../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../Common/ChangeArrayFormat';
import { toastifyError } from '../../../Common/AlertMsg';
import { AgencyContext } from '../../../../Context/Agency/Index';

const NameInformation = () => {


    const { localStoreArray, setLocalStoreArray, get_LocalStorage } = useContext(AgencyContext)
    const [verifyName, setverifyName] = useState(false);
    const [sexIdDrp, setSexIdDrp] = useState([]);
    const [raceIdDrp, setRaceIdDrp] = useState([]);
    const [ethinicityDrpData, setEthinicityDrpData] = useState([])
    const [nameReportData, setNameReportData] = useState([]);
    const [reportData, setReportData] = useState([])
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
        NameIDNumber: '',
        SSN: '',
        LastName: '',
        FirstName: '',
        MiddleName: '',
        DateOfBirth: '',
        SexID: null,
        RaceID: null,
        EthnicityID: null,
        IsUSCitizen: '',
        Address: '',
        IsVerify: '',
        AgencyID: LoginAgencyID,
    });

    useEffect(() => {
        // get_MasterName_Report();
        GetSexIDDrp(LoginAgencyID); GetRaceIdDrp(LoginAgencyID); getEthinicityDrp(LoginAgencyID);
    }, [LoginAgencyID]);

    const getEthinicityDrp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('/DropDown/GetDataDropDown_Ethnicity', val).then((data) => {
            if (data) {
                setEthinicityDrpData(Comman_changeArrayFormat(data, 'EthnicityID', 'Description'));
            }
            else {
                setEthinicityDrpData([])
            }
        })
    };

    const GetRaceIdDrp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('DropDown/GetData_RaceType', val).then((data) => {
            if (data) {
                setRaceIdDrp(Comman_changeArrayFormat(data, 'RaceTypeID', 'Description'))
            } else {
                setRaceIdDrp([]);
            }
        })
    }

    const GetSexIDDrp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('DropDown/GetData_SexType', val).then((data) => {
            if (data) {
                setSexIdDrp(Comman_changeArrayFormat(data, 'SexCodeID', 'Description'))
            } else {
                setSexIdDrp([]);
            }
        })
    }

    // const get_MasterName_Report = () => {
    //     const val = {
    //         'MasterNameID': sessionStorage.getItem('MasterNameID') ? Decrypt_Id_Name(sessionStorage.getItem('MasterNameID'), 'MForMasterNameID') : '',
    //         'AgencyID': localStorage.getItem('AgencyID') ? Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID') : '',
    //     }
    //     fetchPostData('ReportName/GetData_ReportName', val).then((res) => {
    //         if (res) { console.log(res); setNameReportData(res) }
    //         else setNameReportData([]);
    //     })
    // }

    // useEffect(() => {
    //     if (nameReportData) {
    //         setverifyName(true);
    //     } else {
    //         setverifyName(false);
    //     }
    // }, []);

    const get_MasterName_Report = () => {
        console.log(value)
        if (value?.NameIDNumber?.trim()?.length > 0 || value?.SSN?.trim()?.length > 0 || value?.LastName?.trim()?.length > 0 || value?.FirstName?.trim()?.length > 0 || value?.MiddleName?.trim()?.length > 0 || value?.DateOfBirth?.trim()?.length > 0 || value?.Address?.trim()?.length > 0 || value?.SexID !== null || value?.RaceID !== null || value?.EthnicityID !== null) {
            fetchPostData('ReportName/GetData_ReportName', value).then((res) => {
                if (res.length > 0) {
                    console.log(res);
                    console.log(res[0]?.Name);
                    setReportData(res); setNameReportData(res[0]); setverifyName(true);
                }
                else {
                    toastifyError("Data Not Available"); setverifyName(false); setNameReportData([]);
                }
            })
        } else {
            toastifyError("Please Enter Details");
        }
    }

    const handlChange = (e) => {
        if (e.target.name === 'SSN') {
            var ele = e.target.value.replace(/\D/g, '');
            if (ele.length === 9) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
                if (match) {
                    // console.log(match)
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                    })
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/\D/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            } if (e.target.name === 'SSN') {
                return 'true';
            } if (e.target.name.length === 11) {
                return 'true'
            }
        }
        else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({
                ...value,
                [name]: e.value,
            })
        } else {
            setValue({
                ...value,
                [name]: null,
            })
        }
    }

    const resetFields = () => {
        setValue({
            ...value,
            NameIDNumber: '', SSN: '', LastName: '', FirstName: '', MiddleName: '', DateOfBirth: '', SexID: null, RaceID: null, EthnicityID: null, IsUSCitizen: '', Address: '', IsVerify: '',
        });
        setverifyName(false); setNameReportData([]);
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
                                    <div className="col-12 col-md-12 col-lg-12 mb-2 " >
                                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Name Master Report</p>
                                        </div>
                                    </div>
                                    <div className="col-2  col-md-2 col-lg-2" >
                                        <div className="text-field">
                                            <input type="text" name='NameIDNumber' value={value?.NameIDNumber} onChange={handlChange} id='NameIDNumber' className='' />
                                            <label htmlFor="">Name ID</label>
                                        </div>
                                    </div>
                                    <div className="col-2  col-md-2 col-lg-2" >
                                        <div className="text-field">
                                            <input type="text" name='SSN' value={value?.SSN} onChange={handlChange} id='SSN' maxLength={9} className='' />
                                            <label htmlFor="">SSN</label>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="col-6 col-md-6 col-lg-6 mt-2 pt-2">
                                        <div class="form-check ">
                                            <input class="form-check-input" type="checkbox" name='USCITIZEN' id="flexCheckDefault" />
                                            <label class="form-check-label" for="flexCheckDefault">
                                                US Citizen
                                            </label>
                                        </div>
                                    </div> */}
                                <div className="row">

                                    <div className="col-4  col-md-4 col-lg-4 mt-2" >
                                        <div className="text-field">
                                            <input type="text" name='LastName' value={value?.LastName} onChange={handlChange} id='LastName' className='' />
                                            <label htmlFor="">Last Name</label>
                                        </div>
                                    </div>
                                    <div className="col-4  col-md-4 col-lg-4 mt-2" >
                                        <div className="text-field">
                                            <input type="text" name='FirstName' value={value?.FirstName} onChange={handlChange} id='FirstName' className='' />
                                            <label htmlFor="">First Name</label>
                                        </div>
                                    </div>
                                    <div className="col-4  col-md-4 col-lg-4 mt-2" >
                                        <div className="text-field">
                                            <input type="text" name='MiddleName' value={value?.MiddleName} onChange={handlChange} id='MiddleName' className='' />
                                            <label htmlFor="">Middle Name</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">

                                    <div className="col-3 col-md-3 col-lg-3 " style={{ marginTop: '6px' }}>
                                        <div className=" dropdown__box">
                                            <Select
                                                name='SexID'
                                                value={sexIdDrp?.filter((obj) => obj.value === value?.SexID)}
                                                options={sexIdDrp}
                                                onChange={(e) => ChangeDropDown(e, 'SexID')}
                                                isClearable
                                                placeholder="Select..."
                                                styles={customStylesWithOutColor}
                                            />
                                            <label htmlFor="">Gender</label>
                                        </div>
                                    </div>
                                    <div className="col-3 col-md-3 col-lg-3 " style={{ marginTop: '6px' }}>
                                        <div className=" dropdown__box">
                                            <Select
                                                name='RaceID'
                                                value={raceIdDrp?.filter((obj) => obj.value === value?.RaceID)}
                                                options={raceIdDrp}
                                                onChange={(e) => ChangeDropDown(e, 'RaceID')}
                                                isClearable
                                                placeholder="Select..."
                                                styles={customStylesWithOutColor}
                                            />
                                            <label htmlFor="">Race</label>
                                        </div>
                                    </div>
                                    <div className="col-3 col-md-3 col-lg-3 " style={{ marginTop: '6px' }}>
                                        <div className=" dropdown__box">
                                            <Select
                                                name='EthnicityID'
                                                value={ethinicityDrpData?.filter((obj) => obj.value === value?.EthnicityID)}
                                                options={ethinicityDrpData}
                                                onChange={(e) => ChangeDropDown(e, 'EthnicityID')}
                                                isClearable
                                                placeholder="Select..."
                                                styles={customStylesWithOutColor}
                                            />
                                            <label htmlFor="">Ethnicity</label>
                                        </div>
                                    </div>
                                    <div className="col-3 col-md-4 col-lg-3 ">
                                        <div className="date__box ">
                                            <DatePicker
                                                id='DateOfBirth'
                                                name='DateOfBirth'
                                                dateFormat="MM/dd/yyyy"
                                                onChange={(date) => setValue({ ...value, ['DateOfBirth']: date ? getShowingWithOutTime(date) : "" })}
                                                isClearable={value.DateOfBirth ? true : false}
                                                selected={value?.DateOfBirth && new Date(value.DateOfBirth)}
                                                placeholderText={'Select...'}
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                maxDate={new Date()}
                                            />
                                            <label htmlFor="">DOB</label>
                                        </div>
                                    </div>
                                    <div className="col-12  col-md-12 col-lg-7 pt-1 mt-1 ">
                                        <div className="dropdown__box">
                                            <textarea name='Address' value={value?.Address} onChange={handlChange} id='Address' rows='1' className="form-control pt-2 pb-2 " ></textarea>
                                            <label htmlFor="" className='pl-0'>Address</label>
                                        </div>
                                    </div>
                                    {/* <div className="col-3 col-md-2 col-lg-2 mt-4 pt-1 pl-4">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" name='IsVerify' id="flexCheckDefault3" />
                                            <label class="form-check-label" for="flexCheckDefault3">
                                                Verify
                                            </label>
                                        </div>
                                    </div> */}

                                    <div className="col-12 col-md-12 col-lg-12 text-right mt-3">
                                        <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { get_MasterName_Report(); }}>Show Report</button>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { resetFields(); }}>Clear</button>
                                        <Link to={'/Reports'}>
                                            <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                        </Link>
                                        {/* <Link to={`${nameReportData.length > 0 ? '/nametab' : '/name-reports'}`}>
                                            <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                        </Link> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* for 1 table */}
            {
                verifyName ?
                    <>
                        <div className="col-12 col-md-12 col-lg-12 pt-2  px-2">
                            <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                <p className="p-0 m-0 d-flex align-items-center">Name Master Report</p>
                                <div style={{ marginLeft: 'auto' }}>
                                    <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                        <i className="fa fa-print" onClick={() => { printForm() }}></i>
                                    </Link>
                                    {/* <Link to={''} className="btn btn-sm bg-green  text-white px-2 py-0"  >
                                        <i className="fa fa-file"></i>
                                    </Link> */}
                                </div>
                            </div>
                        </div>
                        <div className="container mt-1" ref={componentRef}>
                            <div className="row" style={{ border: '1px solid #80808085' }}>
                                {
                                    reportData?.length > 0 ?
                                        <>
                                            <div className="col-4 col-md-3 col-lg-2 ">
                                                <div className="main">
                                                    <img src={nameReportData?.Agency_Photo} className="img-fluid" alt style={{ border: '1px solid aliceblue', marginTop: '4px', width: '150px' }} />
                                                </div>
                                            </div>
                                            <div className="col-7  col-md-7 col-lg-9 mt-4">
                                                <div className="main">
                                                    <h5 className='text-dark text-bold'>{nameReportData?.Agency_Name}</h5>
                                                    <p className='text-p'>Address: <span className='new-span'>{nameReportData?.Agency_Address1}</span></p>
                                                    <div className='d-flex '>
                                                        <p className='text-p'>State: <span className='new-span'>{nameReportData?.StateName}</span>
                                                        </p>
                                                        <p className='text-p ml-5 pl-1'>City: <span className='new-span'>{nameReportData?.CityName}</span>
                                                        </p>
                                                        <p className='text-p ml-2'>Zip: <span className='new-span'>{nameReportData?.ZipId}</span>
                                                        </p>
                                                    </div>
                                                    <div className='d-flex'>
                                                        <p className='text-p'>Phone: <span className='new-span'>{nameReportData?.Agency_Phone}</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="col-3 ">
                                                <div className="main">
                                                    <img src={img} className="img-fluid" alt />
                                                </div>
                                            </div>
                                            <div className="col-8 mt-4">
                                                <div className="main">
                                                    <h5 className='text-dark text-bold'>{"Agency_Name"}</h5>
                                                    <p>{"Agency_Address"}</p>
                                                    <p>{"Agency_Phone"}</p>
                                                </div>
                                            </div>
                                        </>
                                }
                                <div className="col-12">
                                    <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                </div>
                                {
                                    nameReportData?.Name?.length > 0 ?
                                        <>
                                            {
                                                nameReportData?.Name?.map((obj) => (
                                                    <>
                                                        <div className="container">
                                                            <div className="col-12">
                                                                <div className="table-responsive" >
                                                                    <h5 className=" text-white text-bold bg-green py-1 px-3">Name Information:</h5>
                                                                    <table className="table table-bordered">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>
                                                                                    <h6 className='text-dark text-bold'>Name ID:</h6>
                                                                                    <p>{obj?.NameIDNumber}</p>
                                                                                </td>
                                                                                <td colSpan={2}>
                                                                                    <h6 className='text-dark text-bold'>Name:</h6>
                                                                                    <p>{obj?.LastName}</p>
                                                                                </td>
                                                                                <td >
                                                                                    <h6 className='text-dark text-bold'>Birth Date</h6>
                                                                                    <p>{obj?.DateOfBirth}</p>
                                                                                </td>
                                                                                <td >
                                                                                    <h6 className='text-dark text-bold'>Age</h6>
                                                                                    <p>{obj?.AgeFrom}</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colSpan={2}>
                                                                                    <h6 className='text-dark text-bold'>Address:</h6>
                                                                                    <p>{obj?.Address}</p>
                                                                                </td>
                                                                                <td>
                                                                                    <h6 className='text-dark text-bold'>Race:</h6>
                                                                                    <p>{obj?.Race_Description}</p>
                                                                                </td>
                                                                                <td>
                                                                                    <h6 className='text-dark text-bold'>Gender:</h6>
                                                                                    <p>{obj?.Gender}</p>
                                                                                </td>
                                                                                <td >
                                                                                    <h6 className='text-dark text-bold'>Height</h6>
                                                                                    <p>{obj?.HeightTo}</p>
                                                                                </td>
                                                                                <td colSpan={2}>
                                                                                    <h6 className='text-dark text-bold'>Weight</h6>
                                                                                    <p>{obj?.WeightTo}</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colSpan={2}>
                                                                                    <h6 className='text-dark text-bold'>SSN</h6>
                                                                                    <p>{obj?.SSN}</p>
                                                                                </td>
                                                                                <td>
                                                                                    <h6 className='text-dark text-bold'>Eye Color</h6>
                                                                                    <p>{obj?.EyeColor_Description}</p>

                                                                                </td>
                                                                                <td >
                                                                                    <h6 className='text-dark text-bold'>Hair Color</h6>
                                                                                    <p>{obj?.HairColor_Description}</p>

                                                                                </td>

                                                                                <td colSpan={2}>
                                                                                    <h6 className='text-dark text-bold'>Ethnicity</h6>
                                                                                    <p>{obj?.Ethnicity_Description}</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colSpan={2}>
                                                                                    <h6 className='text-dark text-bold'>DL Number</h6>
                                                                                    <p>{obj?.DLNumber}</p>

                                                                                </td>
                                                                                <td >
                                                                                    <h6 className='text-dark text-bold'>Marital Status</h6>
                                                                                    <p>{obj?.MaritalStatus_Description}</p>

                                                                                </td>
                                                                                <td >
                                                                                    <h6 className='text-dark text-bold'>Birth Place</h6>
                                                                                    <p>{obj?.BirthPlace}</p>

                                                                                </td>
                                                                                <td >
                                                                                    <h6 className='text-dark text-bold'> Nationality</h6>
                                                                                    <p>{obj?.BINationality}</p>
                                                                                </td>
                                                                                {/* <td >
                                                            <h6 className='text-dark text-bold'>SMT</h6>
                                                            <p>{obj?.SMT}</p>

                                                        </td> */}
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                                {/* smt */}
                                                                <div className="table-responsive" >
                                                                    {
                                                                        JSON.parse(obj?.SMT).length > 0 ?
                                                                            <>
                                                                                <h5 className="text-white text-bold bg-green py-1 px-3" >SMT Information:</h5>
                                                                                <table className="table table-bordered">
                                                                                    <thead className='text-dark master-table'>
                                                                                        <tr>
                                                                                            <th className=''>SMT Location</th>
                                                                                            <th className=''>SMT Type</th>
                                                                                            <th className=''>SMT Description</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody className='master-tbody'>
                                                                                        {
                                                                                            JSON.parse(obj?.SMT)?.map((item, key) => (
                                                                                                <>
                                                                                                    <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                        <td>{item.SMTLocation_Description}</td>
                                                                                                        <td>{item.SMTType_Decription}</td>
                                                                                                        <td>{item.SMT_Description}</td>
                                                                                                    </tr>
                                                                                                </>
                                                                                            ))
                                                                                        }
                                                                                    </tbody>
                                                                                </table>
                                                                            </>
                                                                            :
                                                                            <></>
                                                                    }
                                                                </div>
                                                                <div className="table-responsive" >
                                                                    {
                                                                        JSON.parse(obj?.Aliases)?.length > 0 ?
                                                                            <>
                                                                                <h5 className="text-white text-bold bg-green py-1 px-3">Alias Name Information:</h5>
                                                                                <table className="table table-bordered" >
                                                                                    <thead className='text-dark master-table'>
                                                                                        <tr>
                                                                                            <th className=''>Alias Name:</th>
                                                                                            <th className=''>Alias DOB:</th>
                                                                                            <th className=''>Alias SSN</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody className='master-tbody'>
                                                                                        {
                                                                                            JSON.parse(obj?.Aliases)?.map((item, key) => (
                                                                                                <>
                                                                                                    <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                        <td>{item.FirstName}</td>
                                                                                                        <td>{getShowingWithOutTime(item.DOB)}</td>
                                                                                                        <td>{item.AliasSSN}</td>
                                                                                                    </tr>
                                                                                                </>
                                                                                            ))
                                                                                        }
                                                                                    </tbody>
                                                                                </table>
                                                                            </>
                                                                            :
                                                                            <></>
                                                                    }
                                                                </div>
                                                                <div className="table-responsive" >
                                                                    {
                                                                        JSON.parse(obj?.Warrant)?
                                                                            <>
                                                                                <h5 className="text-white text-bold bg-green py-1 px-3">Warrant Information:</h5>
                                                                                <table className="table table-bordered" >
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
                                                                                                <>
                                                                                                    <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                        <td>{item?.WarrantNumber}</td>
                                                                                                        <td>{item?.WarrantType_Description}</td>
                                                                                                        <td>{item?.WarrantClassification_Description}</td>
                                                                                                        <td>{item?.WarrantName}</td>
                                                                                                        <td>{item?.WarrantStatus_Description}</td>
                                                                                                        <td>{item?.DateOfComplain && getShowingDateText(item?.DateOfComplain)}</td>
                                                                                                        <td>{item?.DateTimeIssued && getShowingDateText(item?.DateTimeIssued)}</td>

                                                                                                    </tr>
                                                                                                </>
                                                                                            ))
                                                                                        }
                                                                                    </tbody>
                                                                                </table>
                                                                            </>
                                                                            :
                                                                            <></>
                                                                    }
                                                                </div>
                                                                <div className="table-responsive" >
                                                                    <h5 className="text-white text-bold bg-green py-1 px-3" >Name Image:
                                                                    </h5>
                                                                    <table className="table ">
                                                                        <tbody className=''>
                                                                            <div className="row">
                                                                                {
                                                                                    JSON.parse(obj?.Photo)?.length > 0 ?
                                                                                        JSON.parse(obj?.Photo)?.map((item, index) => {
                                                                                            // console.log(item.Photo)
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
        </>
    )
}

export default NameInformation