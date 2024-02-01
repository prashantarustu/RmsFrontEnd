import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Decrypt_Id_Name, colourStyles, getShowingMonthDateYear } from '../../../Common/Utility';
import { useState } from 'react';
import { toastifyError } from '../../../Common/AlertMsg';
import { fetchPostData } from '../../../hooks/Api';
import { useContext } from 'react';
import { AgencyContext } from '../../../../Context/Agency/Index';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { threeColArray } from '../../../Common/ChangeArrayFormat';
import { useEffect } from 'react';

const VehicleSearchPage = () => {

    
    const {  setChangesStatus,localStoreArray, setLocalStoreArray, get_LocalStorage } = useContext(AgencyContext)
    const [propertyLossCodeData, setPropertyLossCodeData] = useState([]);
    const [Reportedfromdate, setreportedfromDate] = useState();
    const [Reportedtodate, setreportedtoDate] = useState();
    const [vehicleSearchData, setVehicleSearchData] = useState([]);
    const [categoryIdDrp, setCategoryIdDrp] = useState([])
    const [plateTypeIdDrp, setPlateTypeIdDrp] = useState([]);
    const [advancedSearch, setAdvancedSearch] = useState(false);
    const navigate = useNavigate()


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
        'IncidentNumber': null,
        'VehicleNumber': null,
        'LossCodeID': null,
        'ReportedDtTm': null,
        'ReportedDtTmTo': null,
        'LastName': null,
        'FirstName': null,
        'MiddleName': null,
        AgencyID: LoginAgencyID,
    });

    const handlChange = (e,) => {
        if (e.target.name === 'VehicleNumber') {
            var ele = e.target.value.replace(/[^a-zA-Z\s^0-9\s]/g, '');
            if (ele.length === 10) {
                var cleaned = ('' + ele).replace(/[^a-zA-Z\s^0-9\s]/g, '');
                var match = cleaned.match(/^(\w{2})(\d{4})(\d{4})$/);
                if (match) {
                    // console.log(match)
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                    })
                }
            } else {
                ele = e.target.value.split("'").join('').replace(/[^a-zA-Z\s^0-9\s]/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else if (e.target.name === 'IncidentNumber') {
            var ele = e.target.value.replace(/[^a-zA-Z\s^0-9\s]/g, '');
            if (ele.length === 8) {
                var cleaned = ('' + ele).replace(/[^a-zA-Z\s^0-9\s]/g, '');
                var match = cleaned.match(/^(\d{2})(\d{6})$/);
                if (match) {
                    console.log(match)
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
                [name]: e.value
            });
        }
        else {
            setValue({
                ...value,
                [name]: null
            });
        }
    }
    const PropertyLossCode = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('PropertyReasonCode/GetDataDropDown_PropertyReasonCode', val).then((data) => {
            if (data) {
                setPropertyLossCodeData(threeColArray(data, 'PropertyReasonCodeID', 'Description', 'PropertyReasonsCode'))
            } else {
                setPropertyLossCodeData([]);
            }
        })
    }
    const getPropertySearch = async () => {
        fetchPostData("PropertyVehicle/Search_PropertyVehicle", value).then((data) => {
            if (data.length > 0) {
                console.log(data);
                setVehicleSearchData(data); navigate('/vehicle-search');
            } else {
                setVehicleSearchData([]); toastifyError("Data Not Available")
            }
        })
    }
    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
        }
    };
    const HandleChanges = (e) => {
        if (e.target.name === 'IsEvidence' || e.target.name === 'IsPropertyRecovered' || e.target.name === 'IsImmobalizationDevice' || e.target.name === 'IsEligibleForImmobalization') {
            setChangesStatus(true)
            setValue({
                ...value,
                [e.target.name]: e.target.checked
            })
        }
        else if (e.target.name === 'Value') {
            var ele = e.target.value.replace(/[^0-9\.]/g, "")
            console.log(ele);
            if (ele.length === 16) {
                setChangesStatus(true)
                setValue({
                    ...value,
                    [e.target.name]: ele
                });
            } else {
                setChangesStatus(true)
                setValue({
                    ...value,
                    [e.target.name]: ele
                });
            }
        } else if (e.target.name === 'Weight') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setChangesStatus(true)
            setValue({ ...value, [e.target.name]: checkNumber })
        }
        else {
            setChangesStatus(true)
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }   
    const Reset = () => {
        setValue({
            ...value,
            'IncidentNumber': '',
            'VehicleNumber': '',
            'LossCodeID': '',
            'ReportedDtTm': '',
            'ReportedDtTmTo': '',
            'LastName': '',
            'FirstName': '',
            'MiddleName': '',
        })
    }
    return (
        <>

            <div class="section-body view_page_design pt-2">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row" >
                                    <div className="col-12 col-md-12 col-lg-12 " style={{ marginTop: '-20px' }}>
                                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Vehicle Search</p>
                                        </div>
                                    </div>
                                    <div className="col-12 ">
                                        <fieldset className='fieldset'>
                                            <legend>Vehicle Information</legend>
                                            <div className="row">
                                                <div class="col-6 col-md-3 mt-1">
                                                    <div className="text-field">
                                                        <input type="text" id='IncidentNumber' name='IncidentNumber' maxLength={8} className={''} value={value.IncidentNumber} onChange={handlChange} />
                                                        <label className=''>Incident Number</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-3 mt-1">
                                                    <div className="text-field">
                                                        <input type="text" id='VehicleNumber' style={{ textTransform: "uppercase" }} maxLength={10} name='VehicleNumber' className={''} value={value.VehicleNumber} onChange={handlChange} />
                                                        {/* <input type="date" id='VehicleNumber'  /> */}
                                                        <label className=''>Vehicle</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-6 " style={{ marginTop: '2px' }}>
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='LossCodeID'
                                                            value={propertyLossCodeData?.filter((obj) => obj.value === value?.LossCodeID)}
                                                            styles={colourStyles}
                                                            options={propertyLossCodeData}
                                                            onChange={(e) => ChangeDropDown(e, 'LossCodeID')}
                                                            isClearable
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor='' className='mt-0'>Vehicle Reason</label>
                                                    </div>
                                                </div>
                                                <div class="col-4 col-md-4 col-lg-3 mb-1">
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            id='ReportedDtTm'
                                                            name='ReportedDtTm'
                                                            ref={startRef}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => { setreportedfromDate(date); setValue({ ...value, ['ReportedDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                                            className=''
                                                            dateFormat="MM/dd/yyyy"
                                                            timeInputLabel
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            autoComplete='Off'
                                                            dropdownMode="select"
                                                            isClearable={value?.ReportedDtTm ? true : false}
                                                            selected={Reportedfromdate}
                                                            placeholderText={value?.ReportedDtTm ? value.ReportedDtTm : 'Select...'}
                                                            maxDate={new Date()}
                                                        />
                                                        <label htmlFor="" className='pt-1'>Reported From Date</label>
                                                    </div>
                                                </div>
                                                <div class="col-4 col-md-4 col-lg-3 mb-1">
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            id='ReportedDtTmTo'
                                                            name='ReportedDtTmTo'
                                                            ref={startRef1}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => { setreportedtoDate(date); setValue({ ...value, ['ReportedDtTmTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                            className=''
                                                            dateFormat="MM/dd/yyyy "
                                                            autoComplete='Off'
                                                            timeInputLabel
                                                            isClearable={value?.ReportedDtTmTo ? true : false}
                                                            selected={Reportedtodate}
                                                            placeholderText={value?.ReportedDtTmTo ? value.ReportedDtTmTo : 'Select...'}
                                                            maxDate={new Date()}
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            minDate={Reportedfromdate}
                                                        />
                                                        <label htmlFor="" className='pt-1'>Reported To Date</label>
                                                    </div>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-4 mt-1">
                                                    <div className=" dropdown__box">
                                                        <Select
                                                            name='CategoryID'
                                                            value={categoryIdDrp?.filter((obj) => obj.value === value?.CategoryID)}
                                                            styles={colourStyles}
                                                            options={categoryIdDrp}
                                                            onChange={(e) => ChangeDropDown(e, 'CategoryID')}
                                                            isClearable
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor="">Category</label>
                                                    </div>

                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2 mt-1  ">
                                                    <div class="text-field">
                                                        <input type="text" name='VIN' id='VIN' maxLength={17} value={value?.VIN} onChange={HandleChanges} className='' required />
                                                        <label className="pt-1">VIN</label>
                                                    </div>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 mt-1">
                                                    <div className=" dropdown__box">
                                                        <Select
                                                            name='LossCodeID'
                                                            value={propertyLossCodeData?.filter((obj) => obj.value === value?.LossCodeID)}
                                                            styles={colourStyles}
                                                            options={propertyLossCodeData}
                                                            onChange={(e) => ChangeDropDown(e, 'LossCodeID')}
                                                            isClearable
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor="">Loss Code</label>
                                                    </div>

                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 mt-1">
                                                    <div className=" dropdown__box">
                                                        <Select
                                                            name='PlateTypeID'
                                                            value={plateTypeIdDrp?.filter((obj) => obj.value === value?.PlateTypeID)}
                                                            styles={colourStyles}
                                                            options={plateTypeIdDrp}
                                                            onChange={(e) => ChangeDropDown(e, 'PlateTypeID')}
                                                            isClearable
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor="">Plate Type</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset className='fieldset mt-2'>
                                            <legend>Vehicle Owner</legend>
                                            <div className="row">
                                                <div class="col-6 col-md-3">
                                                    <div className="text-field">
                                                        <input type="text" id='LastName' name='LastName' className={''} value={value.LastName} onChange={handlChange} />
                                                        <label className=''>Last Name</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-3">
                                                    <div className="text-field">
                                                        <input type="text" id='FirstName' name='FirstName' className={''} value={value.FirstName} onChange={handlChange} />
                                                        <label className=''>First Name</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-3">
                                                    <div className="text-field">
                                                        <input type="text" id='MiddleName' name='MiddleName' className={''} value={value.MiddleName} onChange={handlChange} />
                                                        <label className=''>Middle Name</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="btn-box text-right  mr-1 mb-2">
                            {/* <Link to={'/property-search'}> */}
                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { getPropertySearch(); }}>Search</button>
                            {/* </Link> */}
                            <Link to={'/Search'}>
                                <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-2" onClick={() => { Reset(); setAdvancedSearch(false) }}>Close</button>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default VehicleSearchPage