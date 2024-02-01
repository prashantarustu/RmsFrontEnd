import React, { useRef } from 'react'
import img from '../../../../../src/img/images1.jpg'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, colourStyles, customStylesWithOutColor, getShowingDateText, getShowingWithOutTime } from '../../../Common/Utility';
import Select from "react-select";
import { useEffect } from 'react';
import { fetchPostData } from '../../../hooks/Api';
import { useReactToPrint } from 'react-to-print';


const ArrestMaster = () => {

    const [reportData, setReportData] = useState([]);
    const [verifyArrestMaster, setverifyArrestMaster] = useState(false);
    const [Arrestfromdate, setArrestfromdate] = useState('')
    const [ArrestTodate, setArrestTodate] = useState('')
    const [arestReportData, setArestReportData] = useState([]);
    const [value, setValue] = useState({
        NameIDNumber: '',
        SSN: '',
        LastName: '',
        FirstName: '',
        MiddleName: '',
        DateOfBirth: '',
        DateOfBirthTo: '',
        SexID: null,
        RaceID: null,
        EthnicityID: null,
        IsUSCitizen: '',
        Address: '',
        IsVerify: '',
        AgencyID: localStorage.getItem('AgencyID') ? Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID') : '',
    });
    useEffect(() => {
        get_MasterArest_Report();
    }, [])

    const get_MasterArest_Report = () => {
        const val = {
            'ArrestID': sessionStorage.getItem('ArrestID') ? Decrypt_Id_Name(sessionStorage.getItem('ArrestID'), 'AForArrestID') : '',
            'AgencyID': localStorage.getItem('AgencyID') ? Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID') : '',
        }
        fetchPostData('ArrestReport/GetData_ArrestReport', val).then((res) => {
            console.log(res)
            if (res) {
                console.log(res);
                setArestReportData(res)
            }
            else setArestReportData([]);
        })
    }
    useEffect(() => {
        if (arestReportData) {
            setverifyArrestMaster(true);
        } else {
            setverifyArrestMaster(false);
        }
    }, []);

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
                                <div className="col-12 col-md-12 col-lg-12 mb-2 " >
                                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                        <p className="p-0 m-0 d-flex align-items-center">Arrest Master Report</p>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <fieldset className='fieldset'>
                                        <legend>Arrest Information</legend>
                                        <div className="row">
                                            <div className="col-2  col-md-2 col-lg-2  " >
                                                <div className="text-field">
                                                    <input type="text" name='ArrestNumber' id='ArrestNumber' className='' />
                                                    <label htmlFor="">Arrest Number</label>
                                                </div>
                                            </div>

                                            <div className="col-3 col-md-3 col-lg-3 " style={{ marginTop: '-5px' }}>
                                                <div className="dropdown__box">
                                                    <DatePicker
                                                        id='Arrestfromdate'
                                                        name='Arrestfromdate'
                                                        dateFormat="MM/dd/yyyy"
                                                        isClearable={value.Arrestfromdate ? true : false}
                                                        selected={Arrestfromdate}
                                                        placeholderText={value.Arrestfromdate ? value.Reporteddate : 'Select...'}
                                                        peekNextMonth
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        autoComplete='Off'
                                                        maxDate={new Date()}
                                                    />
                                                    <label htmlFor="" className='pt-1'>Arrest Date From</label>
                                                </div>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-3 " style={{ marginTop: '-5px' }}>
                                                <div className="dropdown__box">
                                                    <DatePicker
                                                        id='ArrestTodate'
                                                        name='ArrestTodate'
                                                        dateFormat="MM/dd/yyyy"
                                                        isClearable={value.ArrestTodate ? true : false}
                                                        selected={ArrestTodate}
                                                        placeholderText={value.ArrestTodate ? value.ArrestTodate : 'Select...'}
                                                        peekNextMonth
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        autoComplete='Off'
                                                        maxDate={new Date()}
                                                    />
                                                    <label htmlFor="" className='pt-1'>Arrest Date To</label>
                                                </div>
                                            </div>
                                            <div className="col-2  col-md-2 col-lg-2 " >
                                                <div className="text-field">
                                                    <input type="text" name='NameNumber' id='NameNumber' className='' />
                                                    <label htmlFor="">Name Number</label>
                                                </div>
                                            </div>
                                            <div className="col-2  col-md-2 col-lg-2  " >
                                                <div className="text-field">
                                                    <input type="text" name='IncidentNumber' id='IncidentNumber' className='' />
                                                    <label htmlFor="">Incident Number</label>
                                                </div>
                                            </div>
                                            <div className="col-4  col-md-4 col-lg-4 pt-1 mt-1 ">
                                                <div className="dropdown__box">
                                                    <textarea name='Address' id='Address' rows='1' className="form-control pt-2 pb-2 " ></textarea>
                                                    <label htmlFor="" className='pl-0'>Address</label>
                                                </div>
                                            </div>
                                            <div class="col-3 col-md-3  col-lg-3   pt-2">
                                                <div className="dropdown__box">
                                                    <Select
                                                        name="State"
                                                        styles={colourStyles}
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                    <label htmlFor="" className=''>State</label>

                                                </div>
                                            </div>
                                            <div class="col-3 col-md-3  col-lg-3 mt-2">
                                                <div className="dropdown__box">
                                                    <Select
                                                        name="CityID"
                                                        styles={colourStyles}
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                    <label htmlFor="" className=''>City</label>

                                                </div>
                                            </div>
                                            <div className="col-2  col-md-2 col-lg-2 mt-2" >
                                                <div className="text-field">
                                                    <input type="text" name='zip' id='IncidentNumberFrom' className='' />
                                                    <label htmlFor="" className=''>Zip</label>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div >

                                <div className="col-12 ">
                                    <fieldset className='fieldset'>
                                        <legend>Name Information</legend>
                                        <div className="row">
                                            <div class="col-6 col-md-3">
                                                <div className="text-field">
                                                    <input type="text" name='LastName' id='LastName' />
                                                    <label className=''>Last Name</label>
                                                </div>
                                            </div>
                                            <div class="col-6 col-md-3">
                                                <div className="text-field">
                                                    <input type="text" name='FirstName' id='FirstName' />
                                                    <label className=''>First Name</label>
                                                </div>
                                            </div>
                                            <div class="col-6 col-md-3">
                                                <div className="text-field">
                                                    <input type="text" name='MiddleName' id='MiddleName' />
                                                    <label className=''>Middle Name</label>
                                                </div>
                                            </div>
                                            <div class="col-6 col-md-3">
                                                <div className="text-field">
                                                    <input type="text" name='SSN' id='SSN' />
                                                    <label className=''>SSN</label>
                                                </div>
                                            </div>
                                            <div className="col-3 col-md-4 col-lg-3 mt-2 ">
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
                                                    <label htmlFor="">DOB From</label>
                                                </div>
                                            </div>
                                            <div className="col-3 col-md-4 col-lg-3 mt-2 ">
                                                <div className="date__box ">
                                                    <DatePicker
                                                        id='DateOfBirthTo'
                                                        name='DateOfBirthTo'
                                                        dateFormat="MM/dd/yyyy"
                                                        onChange={(date) => setValue({ ...value, ['DateOfBirthTo']: date ? getShowingWithOutTime(date) : "" })}
                                                        isClearable={value.DateOfBirthTo ? true : false}
                                                        selected={value?.DateOfBirthTo && new Date(value.DateOfBirthTo)}
                                                        placeholderText={'Select...'}
                                                        peekNextMonth
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        autoComplete='Off'
                                                        maxDate={new Date()}
                                                    />
                                                    <label htmlFor="">DOB To</label>
                                                </div>
                                            </div>
                                        </div>

                                    </fieldset>
                                    {/* <div className="form-check mt-2  ">
                                        <input className="form-check-input " type="checkbox" value="Display" name="Display" id="flexRadioDefault2" />
                                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                                            Display Height & Weight
                                        </label>
                                    </div> */}
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 text-right">
                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { setverifyArrestMaster(true); }}>Show Report</button>
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { setverifyArrestMaster(false); }}>Clear</button>
                                    <Link to={'/arresttab'}>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                verifyArrestMaster &&
                <>
                    <div className="container mt-1" ref={componentRef}>
                        <div className="row" style={{ border: '1px solid #80808085' }}>
                            <>
                                <div className="col-4 col-md-3 col-lg-2">
                                    <div className="main">
                                        <img src={img} className="img-fluid" alt='Agency_Photo' style={{ border: '1px solid aliceblue', marginTop: '4px', width: '150px' }} />
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
                            {/* <div className="container mt-1" ref={componentRef} >
                                <div className="row" style={{ border: '1px solid #80808085' }}>
                                    {
                                        arestReportData[0]?.Agency.length > 0 ?
                                            <>
                                                <div className="col-3 ">
                                                    <div className="main">
                                                        <img src={arestReportData[0]?.Agency[0]?.Agency_Photo} className="img-fluid" alt />
                                                    </div>
                                                </div>
                                                <div className="col-8 mt-4">
                                                    <div className="main">
                                                        <h5 className='text-dark text-bold'>{arestReportData[0]?.Agency[0]?.Agency_Name}</h5>
                                                        <p>{arestReportData[0]?.Agency[0]?.Agency_Address1}</p>
                                                        <p>{arestReportData[0]?.Agency[0]?.Agency_Phone}</p>
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
                                    <div className="container">
                            

                                        <div className="col-12">

                                            <div className="table-responsive" style={{ border: '1px solid #ddd' }}>

                                                <div className="table-responsive" >
                                                    <div className="text-white text-bold bg-green py-1 px-3  d-flex justify-content-between align-items-center">
                                                        <p className="p-0 m-0 d-flex align-items-center">Arrest Information:</p>
                                                        <p className="p-0 m-0 d-flex align-items-center" >
                                                            {getShowingDateText(arestReportData[0]?.ArrestDtTm)}
                                                        </p>
                                                    </div>
                                                    <table className="table table-bordered">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <h6 className='text-dark text-bold'>Arrest Number</h6>
                                                                    <p>{arestReportData[0]?.ArrestNumber}</p>
                                                                </td>
                                                                <td colSpan={2}>
                                                                    <h6 className='text-dark text-bold'>Arrestee Name</h6>
                                                                    <p>{arestReportData[0]?.Arrestee_Name}</p>
                                                                </td>
                                                                <td >
                                                                    <h6 className='text-dark text-bold'>Arrest Date</h6>
                                                                    <p>{getShowingDateText(arestReportData[0]?.ArrestDtTm)}</p>
                                                                </td>
                                                                <td >
                                                                    <h6 className='text-dark text-bold'>ArrestType Description</h6>
                                                                    <p>{arestReportData[0]?.ArrestType_Description}</p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="table-responsive" style={{ border: '1px solid #ddd' }}>
                                                    {
                                                        arestReportData[0]?.Charge.length > 0 ?
                                                            <>
                                                                <h5 className="text-white text-bold bg-green py-1 px-3" >Charge:</h5>

                                                                <table className="table table-bordered" >
                                                                    <thead className='text-dark master-table'>
                                                                        <tr>
                                                                            <th className=''>ArrestNumber</th>
                                                                            <th className=''>ChargeCode Description</th>
                                                                            <th className=''>IncidentNumber</th>
                                                                            <th className=''>NIBRS_Description</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className='master-tbody'>
                                                                        {
                                                                            arestReportData[0]?.Charge?.map((item, key) => (
                                                                                <>
                                                                                    <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                        <td>{item.ArrestNumber}</td>
                                                                                        <td>{item.ChargeCode_Description}</td>
                                                                                        <td>{item.IncidentNumber}</td>
                                                                                        <td>{item.NIBRS_Description}</td>
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
                                                <div className="table-responsive" style={{ border: '1px solid #ddd' }}>
                                                
                                                    {
                                                        arestReportData[0]?.ArrestNarrative.length > 0 ?
                                                            <>
                                                                <h5 className="text-white text-bold bg-green py-1 px-3" >Narrative:</h5>
                                                       
                                                                <table className="table table-bordered" >
                                                                    <thead className='text-dark master-table'>
                                                                        <tr>
                                                                            <th className=''>Narrative Description</th>
                                                                            <th className=''>ReportedBy_Description</th>
                                                                            <th className=''>Narrative Date</th>
                                                                            <th className=''>Narrative Comments</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className='master-tbody'>
                                                                        {
                                                                            arestReportData[0]?.ArrestNarrative?.map((item, key) => (
                                                                                <>
                                                                                    <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                        <td>{item.NarrativeDescription}</td>
                                                                                        <td>{item.ReportedBy_Description}</td>
                                                                                        <td>{getShowingDateText(item.NarrativeDtTm)}</td>
                                                                                        <td>{item.NarrativeComments}</td>

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
                                                <div className="table-responsive" style={{ border: '1px solid #ddd' }}>
                                                   
                                                    {
                                                        arestReportData[0]?.ArrestComments.length > 0 ?
                                                            <>
                                                                <h5 className="text-white text-bold bg-green py-1 px-3" >Comments:</h5>
                                                              
                                                                <table className="table table-bordered" style={{ marginTop: '-15px' }}>
                                                                    <thead className='text-dark master-table'>
                                                                        <tr>
                                                                            <th className=''>Comments</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className='master-tbody'>
                                                                        {
                                                                            arestReportData[0]?.ArrestComments?.map((item, key) => (
                                                                                <>
                                                                                    <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                        <td>{item.Comments}</td>

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
                                                <div className="table-responsive" style={{ border: '1px solid #ddd' }}>
                                              
                                                    {
                                                        arestReportData[0]?.ArrestProperty.length > 0 ?
                                                            <>
                                                                <h5 className="text-white text-bold bg-green py-1 px-3" >Property:</h5>
                                                             
                                                                <table className="table table-bordered" >
                                                                    <thead className='text-dark master-table'>
                                                                        <tr>
                                                                            <th className=''>Property Number</th>
                                                                            <th className=''>PropertyType_Description</th>
                                                                            <th className=''>Reported Date</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className='master-tbody'>
                                                                        {
                                                                            arestReportData[0]?.ArrestProperty?.map((item, key) => (
                                                                                <>
                                                                                    <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                        <td>{item.PropertyNumber}</td>
                                                                                        <td>{item.PropertyType_Description}</td>
                                                                                        <td>{getShowingDateText(item.ReportedDtTm)}</td>

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
                                                <div className="table-responsive" style={{ border: '1px solid #ddd' }}>
                                           
                                                    {
                                                        arestReportData[0]?.ArrestCourtInformation.length > 0 ?
                                                            <>
                                                                <h5 className="text-white text-bold bg-green py-1 px-3" >Court Information:</h5>
                                                                <table className="table table-bordered" >
                                                                    <thead className='text-dark master-table'>
                                                                        <tr>
                                                                            <th className=''>Name</th>
                                                                            <th className=''>Attorney</th>
                                                                            <th className=''>Prosecutor</th>
                                                                            <th className=''>Appear DateTime</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className='master-tbody'>
                                                                        {
                                                                            arestReportData[0]?.ArrestCourtInformation?.map((item, key) => (
                                                                                <>
                                                                                    <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                        <td>{item.Name}</td>
                                                                                        <td>{item.Attorney}</td>
                                                                                        <td>{item.Prosecutor}</td>
                                                                                        <td>{getShowingDateText(item.AppearDateTime)}</td>
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




                                                <div className="table-responsive" style={{ border: '1px solid #ddd' }}>
                                                
                                                    {
                                                        arestReportData[0]?.ArrestCriminalActivity.length > 0 ?
                                                            <>
                                                                <h5 className="text-white text-bold bg-green py-1 px-3" >Criminal Activity:</h5>

                                                                <table className="table table-bordered" >
                                                                    <thead className='text-dark master-table'>
                                                                        <tr>
                                                                            <th className=''>CriminalActivity_Description</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className='master-tbody'>
                                                                        {
                                                                            arestReportData[0]?.ArrestCriminalActivity?.map((item, key) => (
                                                                                <>
                                                                                    <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                        <td>{item.CriminalActivity_Description}</td>

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
                                                <div className="table-responsive" style={{ border: '1px solid #ddd' }}>
                                           
                                                    {
                                                        arestReportData[0]?.ArrestPoliceForce.length > 0 ?
                                                            <>
                                                                <h5 className="text-white text-bold bg-green py-1 px-3" >Police Force:</h5>

                                                                <table className="table table-bordered">
                                                                    <thead className='text-dark master-table'>
                                                                        <tr>
                                                                            <th className=''>Officer Name</th>
                                                                            <th className=''>PoliceForce_Description</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className='master-tbody'>
                                                                        {
                                                                            arestReportData[0]?.ArrestPoliceForce?.map((item, key) => (
                                                                                <>
                                                                                    <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                        <td>{item.Officer_Name}</td>
                                                                                        <td>{item.ArrPoliceForce_Description}</td>

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
                                                <div className="table-responsive" style={{ border: '1px solid #ddd' }}>
                                              
                                                    <h5 className="text-white text-bold bg-green py-1 px-3" >Arrest Image:
                                                    </h5>

                                                    <table className="table table-bordered" >
                                                        <tbody className=''>
                                                            <div className="row">
                                                                {
                                                                    arestReportData[0]?.ArrestPhoto
                                                                        .length > 0 ?
                                                                        arestReportData[0]?.ArrestPhoto
                                                                            ?.map((item, index) => {
                                                                        
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

                                    </div>
                                </div>
                            </div>  */}

                            <div className="container mt-1">
                                <div className="col-12">
                                    <div className="table-responsive" >
                                        <h5 className="text-center">Arrest Master Report</h5>
                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Name Information</p>
                                        </div>
                                        <table className="table table-bordered">
                                            <tbody>
                                                <tr>
                                                    <td >
                                                        <h6 className='text-dark text-bold'>Name ID:</h6>
                                                        <p className='text-list'>12345</p>
                                                    </td>
                                                    <td colSpan={4}>
                                                        <h6 className='text-dark text-bold'>Name:</h6>
                                                        <p className='text-list'>asdad</p>
                                                    </td>
                                                    <td >
                                                        <h6 className='text-dark text-bold'>Gender:</h6>
                                                        <p className='text-list'>sdfsd</p>
                                                    </td>
                                                    <td>
                                                        <h6 className='text-dark text-bold'>DOB:</h6>
                                                        <p className='text-list'>02-11-25</p>
                                                    </td>
                                                    <td >
                                                        <h6 className='text-dark text-bold'>Age:</h6>
                                                        <p className='text-list'>56</p>
                                                    </td>
                                                </tr>


                                                <tr>
                                                    <td colSpan={4}>
                                                        <h6 className='text-dark text-bold'>Address:</h6>
                                                        <p className='text-list'>sdfdfgdgdfg</p>

                                                    </td>
                                                    <td colSpan={2}>
                                                        <h6 className='text-dark text-bold'>SSN:</h6>
                                                        <p className='text-list'>54664465</p>

                                                    </td>
                                                    <td colSpan={1}>
                                                        <h6 className='text-dark text-bold'>Hair Color:</h6>
                                                        <p className='text-list'>dfgdfg</p>


                                                    </td>
                                                    <td colSpan={2}>
                                                        <h6 className='text-dark text-bold'>Eye Color:</h6>
                                                        <p className='text-list'>dsfdgf</p>

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2}>
                                                        <h6 className='text-dark text-bold'>Race:</h6>
                                                        <p className='text-list'>jsfhdggu</p>
                                                    </td>

                                                    {/* <td colSpan={3}>
                                                        <h6 className='text-dark text-bold'>Alias Name:</h6>
                                                        <p className='text-list'>fsdfsf</p>

                                                    </td> */}

                                                    <td  colSpan={2}>
                                                        <h6 className='text-dark text-bold'>Identification Type:</h6>
                                                        <p className='text-list'>sdfsdfs</p>

                                                    </td>
                                                    <td colSpan={2}>
                                                        <h6 className='text-dark text-bold'>Identification Number:</h6>
                                                        <p className='text-list'>16546540</p>

                                                    </td>
                                                    <td colSpan={2}>
                                                        <h6 className='text-dark text-bold'>DL Number:</h6>
                                                        <p className='text-list'>105466</p>

                                                    </td>

                                                </tr>
                                                <tr>
                                                   
                                                    {/* <td colSpan={2}>
                                                        <h6 className='text-dark text-bold'>Weapon:</h6>
                                                        <p className='text-list'>sfdd</p>
                                                    </td> */}
                                                    <td colSpan={2}>
                                                        <h6 className='text-dark text-bold'>Ethnicity:</h6>
                                                        <p className='text-list'>fghg</p>
                                                    </td>

                                                    <td colSpan={2}>
                                                        <h6 className='text-dark text-bold'>Birth Place:</h6>
                                                        <p className='text-list'>sdfsdfsdf</p>

                                                    </td>


                                                    <td colSpan={2}>
                                                        <h6 className='text-dark text-bold'>Marital Status:</h6>
                                                        <p className='text-list'>sdfd</p>

                                                    </td>
                                                    <td colSpan={2}>
                                                        <h6 className='text-dark text-bold'>Phone Number:</h6>
                                                        <p className='text-list'>14564540</p>

                                                    </td>
                                                </tr>
                                                <tr>

                                                    <td colSpan={2}>
                                                        <h6 className='text-dark text-bold'>Height:</h6>
                                                        <p className='text-list'>10</p>
                                                    </td>

                                                    <td colSpan={2}>
                                                        <h6 className='text-dark text-bold'>Weight:</h6>
                                                        <p className='text-list'>54</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>


                                    <div className="table-responsive">
                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Name Alias Information</p>
                                        </div>
                                        <table className="table ">
                                            <thead className='text-dark master-table'>
                                                <tr>
                                                    <th className=''>Alias Name</th>
                                                    <th className=''>DOB</th>
                                                    <th className=''>SSN</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className='text-list'>1246855</td>
                                                    <td className='text-list'>{getShowingDateText()}</td>
                                                    <td className='text-list'>dsfsdf</td>
                                                </tr>
                                            </tbody>

                                        </table>
                                        <hr />
                                    </div>
                                    {/* Name Image */}
                                    <div className="table-responsive mt-2" style={{ border: '1px solid #ddd' }}>


                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Name Image Information</p>
                                        </div>
                                        <table className="table table-bordered" >
                                            <tbody className=''>
                                                <div className="row">
                                                    {
                                                        arestReportData[0]?.ArrestPhoto
                                                            .length > 0 ?
                                                            arestReportData[0]?.ArrestPhoto
                                                                ?.map((item, index) => {

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
                                    {/* SMT */}
                                    <div className="table-responsive mt-1" >

                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">SMT Information</p>
                                        </div>
                                        <table className="table table-bordered" >
                                            <thead className='text-dark master-table'>
                                                <tr>
                                                    <th className=''>SMT Location</th>
                                                </tr>
                                            </thead>
                                            <tbody className='master-tbody'>
                                                {
                                                    arestReportData[0]?.ArrestNarrative?.map((item, key) => (
                                                        <>
                                                            <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                <td className='text-list'>{item.SMTLocation}</td>
                                                            </tr>
                                                        </>
                                                    ))
                                                }
                                            </tbody>
                                        </table>

                                    </div>
                                    {/* Arrest */}
                                    <div className="table-responsive mt-1" >

                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Arrest Information</p>
                                        </div>
                                        <table className="table table-bordered" >
                                            <thead className='text-dark master-table'>
                                                <tr>
                                                    <th className='' style={{width:'100px'}}>Arresting Agency Name</th>
                                                    <th className='' style={{width:'100px'}}>Arrest Date/Time</th>
                                                    <th className='' style={{width:'100px'}}>Arrest Number</th>
                                                    <th className='' style={{width:'100px'}}>Arrest Type</th>
                                                    <th className='' style={{width:'100px'}}>Supervisor Name</th>
                                                </tr>
                                            </thead>
                                            <tbody className='master-tbody'>
                                                {
                                                    arestReportData[0]?.ArrestNarrative?.map((item, key) => (
                                                        <>
                                                            <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                <td className='text-list'  style={{width:'100px'}}>{item.Agency}</td>
                                                                <td className='text-list'  style={{width:'100px'}}>{item.NarrativeDescription}</td>
                                                                <td className='text-list'  style={{width:'100px'}}>{item.ReportedBy_Description}</td>
                                                                <td className='text-list'  style={{width:'100px'}}>{getShowingDateText(item.NarrativeDtTm)}</td>
                                                                <td className='text-list'  style={{width:'100px'}}>{item.NarrativeComments}</td>

                                                            </tr>
                                                        </>
                                                    ))
                                                }
                                            </tbody>
                                        </table>


                                    </div>
                                    {/* charge */}
                                    <div className="table-responsive mt-1" >

                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Charge Information</p>
                                        </div>
                                        <table className="table table-bordered" >
                                            <thead className='text-dark master-table'>
                                                <tr>
                                                    <th className='' style={{width:'100px'}}>Incident Number</th>
                                                    <th className=''  style={{width:'100px'}}>NIBRS Code</th>
                                                    <th className=''  style={{width:'100px'}}>Charge Code</th>
                                                    <th className=''  style={{width:'100px'}}>Total Penalty</th>
                                                    <th className=''  style={{width:'100px'}}>Sentence</th>
                                                </tr>
                                            </thead>
                                            <tbody className='master-tbody'>
                                                {
                                                    arestReportData[0]?.ArrestNarrative?.map((item, key) => (
                                                        <>
                                                            <tr key={key} >
                                                                <td  style={{width:'100px'}}>{item.NarrativeDescription}</td>
                                                                <td  style={{width:'100px'}}>{item.ReportedBy_Description}</td>
                                                                <td  style={{width:'100px'}}>{getShowingDateText(item.NarrativeDtTm)}</td>
                                                                <td  style={{width:'100px'}}>{item.NarrativeComments}</td>

                                                            </tr>
                                                        </>
                                                    ))
                                                }
                                            </tbody>
                                        </table>


                                    </div>
                                    {/* court */}
                                    <div className="table-responsive mt-2" >

                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Court Information</p>
                                        </div>
                                        <table className="table table-bordered" >
                                            <thead className='text-dark master-table'>

                                                <tr>
                                                    {/* <td colSpan={3}>
                                                        <h6 className='text-dark text-bold'>Name:</h6>
                                                        <p className='text-list'>asdf</p>
                                                    </td> */}
                                                    <td colSpan={3}>
                                                        <h6 className='text-dark text-bold'>Court Name:</h6>
                                                        <p className='text-list'>asdf</p>
                                                    </td>
                                                    <td colSpan={3}>
                                                        <h6 className='text-dark text-bold'> Judge Name:</h6>
                                                        <p className='text-list'>asdf</p>
                                                    </td>
                                                    <td colSpan={3}>
                                                        <h6 className='text-dark text-bold'>Attorney:</h6>
                                                        <p className='text-list'>asdf</p>

                                                    </td>
                                                    <td colSpan={3}>
                                                        <h6 className='text-dark text-bold'>Prosecutor:</h6>
                                                        <p className='text-list'>asdf</p>

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={3}>
                                                        <h6 className='text-dark text-bold'>Appear Date/Time:</h6>
                                                        <p className='text-list'>asdf</p>

                                                    </td>
                                                    <td colSpan={3}>
                                                        <h6 className='text-dark text-bold'>Plea:</h6>
                                                        <p className='text-list'>asdf</p>

                                                    </td>
                                                    <td colSpan={3}>
                                                        <h6 className='text-dark text-bold'>Plea Date/Time:</h6>
                                                        <p className='text-list'>asdf</p>

                                                    </td>
                                                    <td colSpan={3}>
                                                        <h6 className='text-dark text-bold'>Appear Date/Time:</h6>
                                                        <p className='text-list'>asdf</p>

                                                    </td>
                                                </tr>
                                                <tr>

                                                    <td colSpan={12}>
                                                        <h6 className='text-dark text-bold'>Court Appear Reason:</h6>
                                                        <p className='text-list'>asdf</p>

                                                    </td>
                                                </tr>
                                            </thead>
                                            {/* <tbody className='master-tbody'>
                                        {
                                            arestReportData[0]?.ArrestCourtInformation?.map((item, key) => (
                                                <>
                                                    <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                        <td>{item.Name}</td>
                                                        <td>{item.CourtName}</td>
                                                        <td>{item.JudgeName}</td>
                                                        <td>{item.Attorney}</td>
                                                        <td>{item.Prosecutor}</td>
                                                        <td>{item.CourtAppearReason}</td>
                                                        <td>{getShowingDateText(item.AppearDateTime)}</td>
                                                    </tr>
                                                </>
                                            ))
                                        }
                                    </tbody> */}
                                        </table>


                                    </div>
                                    {/* Narrative */}
                                    <div className="table-responsive" >

                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Narrative Information</p>
                                        </div>
                                        <table className="table table-bordered" >
                                            <thead className='text-dark master-table'>
                                                <tr>
                                                    <th className=''>Arrest Date/Time</th>
                                                    <th className=''>Reported By</th>
                                                    <th className=''>Narrative Type</th>
                                                    <th className=''>Comments</th>
                                                </tr>
                                            </thead>
                                            <tbody className='master-tbody'>
                                                {
                                                    arestReportData[0]?.ArrestNarrative?.map((item, key) => (
                                                        <>
                                                            <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                <td>{item.NarrativeDescription}</td>
                                                                <td>{item.ReportedBy_Description}</td>
                                                                <td>{getShowingDateText(item.NarrativeDtTm)}</td>
                                                                <td>{item.NarrativeComments}</td>

                                                            </tr>
                                                        </>
                                                    ))
                                                }
                                            </tbody>
                                        </table>


                                    </div>



                                </div>
                            </div>

                        </div>
                    </div>

                </>
              
            }


        </>
    )
}

export default ArrestMaster