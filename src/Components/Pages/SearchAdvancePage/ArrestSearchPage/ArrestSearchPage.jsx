import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Decrypt_Id_Name, colourStyles, getShowingWithOutTime } from '../../../Common/Utility';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { fetchPostData } from '../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../Common/ChangeArrayFormat';
import { toastifyError } from '../../../Common/AlertMsg';

const ArrestSearchPage = () => {

    const navigate = useNavigate()
    const { updateCount, setUpdateCount, get_Police_Force, arrestSearchData, setArrestSearchData,localStoreArray, setLocalStoreArray, get_LocalStorage } = useContext(AgencyContext)
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [arrestfromdate, setarrestfromDate] = useState();
    const [arresttodate, setarresttoDate] = useState();
    const [arrestSearchID, setArrestSearchID] = useState();
    //Drp
    const [arrestTypeDrpData, setArrestTypeDrpData] = useState([]);
    const [arrestingAgencyDrpData, setAgencyNameDrpData] = useState([]);
    const [headOfAgency, setHeadOfAgency] = useState([]);
    const [JuvenileDispoDrp, setJuvenileDisDrp] = useState([]);
    const [chargeCodeDrp, setChargeCodeDrp] = useState([]);


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
        'ArrestNumber': null,
        'ArrestNumberTo': null,
        'IncidentNumber': null,
        'ArrestDtTm': null,
        'ArrestDtTmTo': null,
        'ArrestTypeID': null,
        'ArrestingAgencyID': null,
        'JuvenileDispositionID': null,
        'LastName': null,
        'FirstName': null,
        'MiddleName': null,
        'SSN': null,
        'PrimaryOfficerID': null,
        'ChargeCodeID': null,
        'AgencyID': LoginAgencyID,
    });

    const HandleChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        });
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

    const startRef = React.useRef();
    const startRef1 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
        }
    };

    // / Arrest Data
    const get_Data_Arrest = () => {
        fetchPostData('Arrest/Search_Arrest', value).then((res) => {
            if (res.length > 0) {
                setArrestSearchData(res); reset(); navigate('/arrest-search');
            } else {
                toastifyError("Data Not Available"); setArrestSearchData([]);
            }
        })
    }

    useEffect(() => {
        get_Police_Force(); Get_ArrestType_Drp(LoginAgencyID); get_Arresting_DropDown(LoginAgencyID,LoginPinID); get_Arrest_juvenile_Drp(LoginAgencyID); get_Head_Of_Agency(); get_ChargeCode_Drp_Data();
    }, [LoginAgencyID])

    const get_ChargeCode_Drp_Data = (LoginAgencyID) => {
        const val = {
            'AgencyID': LoginAgencyID,
            'FBIID': null
        }
        fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
            if (data) {
                setChargeCodeDrp(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'))
            } else {
                setChargeCodeDrp([]);
            }
        })
    }

    const get_Head_Of_Agency = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setHeadOfAgency(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            }
            else {
                setHeadOfAgency([]);
            }
        });
    };

    const get_Arrest_juvenile_Drp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('ArrestJuvenileDisposition/GetDataDropDown_ArrestJuvenileDisposition', val).then((data) => {
            if (data) {
                setJuvenileDisDrp(Comman_changeArrayFormat(data, 'ArrestJuvenileDispositionID', 'Description'));
            }
            else {
                setJuvenileDisDrp([])
            }
        })
    };

    const get_Arresting_DropDown = (LoginAgencyID,LoginPinID) => {
        const val = {
            AgencyID: LoginAgencyID,
            PINID: LoginPinID,
        }
        fetchPostData('Agency/GetData_Agency', val).then((data) => {
            if (data) {
                setAgencyNameDrpData(Comman_changeArrayFormat(data, 'AgencyID', 'Agency_Name'))
            } else {
                setAgencyNameDrpData([]);
            }
        })
    }

    const Get_ArrestType_Drp = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('ArrestType/GetDataDropDown_ArrestType', val).then((data) => {
            if (data) {
                setArrestTypeDrpData(Comman_changeArrayFormat(data, 'ArrestTypeID', 'Description'))
            } else {
                setArrestTypeDrpData([]);
            }
        })
    }

    const reset = () => {
        setValue({
            ...value,
            'ArrestNumber': '',
            'ArrestNumberTo': '',
            'IncidentNumber': '',
            'ArrestDtTm': '',
            'ArrestDtTmTo': '',
            'ArrestTypeID': '',
            'ArrestingAgencyID': '',
            'JuvenileDispositionID': '',
            'LastName': '',
            'FirstName': '',
            'MiddleName': '',
            'SSN': '',
            'PrimaryOfficerID': '',
            'ChargeCodeID': '',
        });
        setarresttoDate(null); setarrestfromDate(null);

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
                                            <p className="p-0 m-0 d-flex align-items-center">Arrest Search</p>
                                        </div>
                                    </div>
                                    <div className="col-12 ">
                                        <fieldset className='fieldset'>
                                            <legend>Arrest Information</legend>
                                            <div className="row">
                                                <div class="col-6 col-md-3 mt-1">
                                                    <div className="text-field">
                                                        <input type="text" id='ArrestNumber' name='ArrestNumber' value={value?.ArrestNumber} onChange={HandleChange} />
                                                        <label className=''>Arrest Number From</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-3 mt-1">
                                                    <div className="text-field">
                                                        <input type="text" id='ArrestNumberTo' name='ArrestNumberTo' value={value?.ArrestNumberTo} onChange={HandleChange} />
                                                        <label className=''>Arrest Number To</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-3 mb-1">
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            id='ArrestDtTm'
                                                            name='ArrestDtTm'
                                                            ref={startRef}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => { setarrestfromDate(date); setValue({ ...value, ['ArrestDtTm']: date ? getShowingWithOutTime(date) : null }) }}
                                                            className=''
                                                            dateFormat="MM/dd/yyyy"
                                                            autoComplete='Off'
                                                            timeInputLabel
                                                            maxDate={new Date()}
                                                            isClearable
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            selected={arrestfromdate}
                                                            placeholderText={value?.ArrestDtTm ? value.ArrestDtTm : 'Select...'}
                                                        />
                                                        <label htmlFor="" className='pt-1'>Arrest From Date</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-3 mb-1">
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            id='ArrestDtTmTo'
                                                            name='ArrestDtTmTo'
                                                            ref={startRef1}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => { setarresttoDate(date); setValue({ ...value, ['ArrestDtTmTo']: date ? getShowingWithOutTime(date) : null }) }}
                                                            className=''
                                                            dateFormat="MM/dd/yyyy"
                                                            autoComplete='Off'
                                                            timeInputLabel
                                                            minDate={arrestfromdate}
                                                            maxDate={new Date()}
                                                            isClearable
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            selected={arresttodate}
                                                            placeholderText={value?.ArrestDtTmTo ? value.ArrestDtTmTo : 'Select...'}
                                                        />
                                                        <label htmlFor="" className='pt-1'>Arrest To Date</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-4 col-lg-3 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" id='IncidentNumber' name='IncidentNumber' value={value?.IncidentNumber} onChange={HandleChange} />
                                                        <label className=''>Incident</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-4 col-lg-3 mb-1 mt-2">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='PrimaryOfficerID'
                                                            styles={colourStyles}
                                                            menuPlacement='bottom'
                                                            value={headOfAgency?.filter((obj) => obj.value === value?.PrimaryOfficerID)}
                                                            isClearable
                                                            options={headOfAgency}
                                                            onChange={(e) => ChangeDropDown(e, 'PrimaryOfficerID')}
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor='' className='mt-0'>Arresting Officer</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-4 col-lg-3 mb-1 mt-2">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='ChargeCodeID'
                                                            styles={colourStyles}
                                                            value={chargeCodeDrp?.filter((obj) => obj.value === value?.ChargeCodeID)}
                                                            isClearable
                                                            options={chargeCodeDrp}
                                                            onChange={(e) => ChangeDropDown(e, 'ChargeCodeID')}
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor='' className='mt-0'>Charge Code/Description</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-4 col-lg-3 mb-1 mt-2">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='ArrestTypeID'
                                                            styles={colourStyles}
                                                            value={arrestTypeDrpData?.filter((obj) => obj.value === value?.ArrestTypeID)}
                                                            isClearable
                                                            options={arrestTypeDrpData}
                                                            onChange={(e) => { ChangeDropDown(e, 'ArrestTypeID') }}
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor='' className='mt-0'>Arrest Type</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-4 col-lg-3 mb-1 mt-2">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name="ArrestingAgencyID"
                                                            styles={colourStyles}
                                                            value={arrestingAgencyDrpData?.filter((obj) => obj.value === value?.ArrestingAgencyID)}
                                                            isClearable
                                                            options={arrestingAgencyDrpData}
                                                            onChange={(e) => { ChangeDropDown(e, 'ArrestingAgencyID') }}
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor='' className='mt-0'>Arresting Agency</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-4 col-lg-3 mb-1 mt-2">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='JuvenileDispositionID'
                                                            menuPlacement='bottom'
                                                            styles={colourStyles}
                                                            value={JuvenileDispoDrp?.filter((obj) => obj.value === value?.JuvenileDispositionID)}
                                                            isClearable
                                                            options={JuvenileDispoDrp}
                                                            onChange={(e) => ChangeDropDown(e, 'JuvenileDispositionID')}
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor='' className='mt-0'>Juvenile Disposition</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset className='fieldset mt-2'>
                                            <legend>Arrestee Information</legend>
                                            <div className="row">
                                                <div class="col-6 col-md-3 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" id='LastName' name='LastName' value={value?.LastName} onChange={HandleChange} />
                                                        <label className=''>Last Name</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-3 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" id='FirstName' name='FirstName' value={value?.FirstName} onChange={HandleChange} />
                                                        <label className=''>First Name</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-3 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" id='MiddleName' name='MiddleName' value={value?.MiddleName} onChange={HandleChange} />
                                                        <label className=''>Middle Name</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-3 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" id='SSN' name='SSN' value={value?.SSN} onChange={HandleChange} />
                                                        <label className=''>SSN</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="btn-box text-right  mr-1 mb-2">
                            {/* <Link to={'/arrest-search'}> */}
                            <button type="button" class="btn btn-sm btn-success mr-1" onClick={() => { get_Data_Arrest(); }}>Search</button>
                            {/* </Link> */}
                            <Link to={'/Search'}>
                                <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" >Close</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ArrestSearchPage