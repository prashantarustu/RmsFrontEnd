import React, { useContext, useEffect, useState } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, Encrypted_Id_Name, customStylesWithOutColor, getShowingDateText, getShowingMonthDateYear } from '../../../Common/Utility';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { Link, useNavigate } from 'react-router-dom';
import { fetchData, fetchPostData } from '../../../hooks/Api';
import { toastifyError } from '../../../Common/AlertMsg';
import { Comman_changeArrayFormat } from '../../../Common/ChangeArrayFormat';

const IncidentSearchPage = () => {

    const navigate = useNavigate()
    const { setIncidentStatus, get_IncidentTab_Count, setShowIncPage, incidentRecentData, setIncidentRecentData, exceptionalClearID,  GetDataExceptionalClearanceID, rmsDisposition, setRmsDisposition, getRmsDispositionID, incidentSearchData, setIncidentSearchData,localStoreArray, setLocalStoreArray, get_LocalStorage } = useContext(AgencyContext);

    //DropDown  
    const [headOfAgency, setHeadOfAgency] = useState([]);
    const [reciveSourceID, setReciveSourceID] = useState([]);
    const [rmsCfsID, setRmsCfsID] = useState([]);
    const [typeOfSecurityID, setTypeOfSecurityID] = useState([]);
    const [pinActivityID, setPinActivityID] = useState([]);


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
        'ReportedDate': '',
        'ReportedDateTo': '',
        'IncidentNumber': '', 'IncidentNumberTo': '', 'MasterIncidentNumber': '', 'MasterIncidentNumberTo': '', 'RMSCFSCodeList': '', 'OccurredFrom': '', 'OccurredFromTo': '', 'RMSDispositionId': '',
        'DispositionDate': '', 'DispositionDateTo': '', 'ReceiveSourceID': '', 'NIBRSClearanceID': '', 'IncidentPINActivityID': '', 'IncidentSecurityID': '', 'PINID': '',
        'AgencyID':LoginAgencyID,
    });

    const HandleChange = (e,) => {
        if (e.target.name === 'IncidentNumber' || e.target.name === 'IncidentNumberTo') {
            var ele = e.target.value.replace(/[^a-zA-Z\s^0-9\s]/g, '');
            if (ele.length === 8) {
                var cleaned = ('' + ele).replace(/[^a-zA-Z\s^0-9\s]/g, '');
                var match = cleaned.match(/^(\d{2})(\d{6})$/);
                if (match) {
                    // console.log(match)
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
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    useEffect(() => {
        getRmsDispositionID(LoginAgencyID); get_Head_Of_Agency(LoginAgencyID); GetDataExceptionalClearanceID(LoginAgencyID); GetDataReciveSourceID(LoginAgencyID); getRmsCfsCodeID(LoginAgencyID); GetDataTypeOfSecurity(LoginAgencyID); GetDataPinActivity();
    }, [LoginAgencyID]);

    const getRmsCfsCodeID = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('Incident/GetData_RMSCFSCODE', val).then((data) => {
            if (data) {
                setRmsCfsID(Comman_changeArrayFormat(data, 'RMSCFSCodeID', 'RMSCFSCode'))
            } else {
                setRmsCfsID([]);
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

    const GetDataReciveSourceID = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID

        }
        fetchPostData('Incident/GetData_ReceiveSource', val).then((data) => {
            if (data) {
                setReciveSourceID(Comman_changeArrayFormat(data, 'ReceiveSourceID', 'ReceiveSourceCode'))
            } else {
                setReciveSourceID([]);
            }
        })
    }

    const GetDataTypeOfSecurity = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID

        }
        fetchPostData('IncidentSecurity/GetDataDropDown_IncidentSecurity', val).then((data) => {
            if (data) {
                setTypeOfSecurityID(Comman_changeArrayFormat(data, 'SecurityId', 'Description'))
            } else {
                setTypeOfSecurityID([]);
            }
        })
    }

    const GetDataPinActivity = () => {
        fetchData('PINActivity/GetData_PINActivityType').then((data) => {
            // console.log(data);
            setPinActivityID(Comman_changeArrayFormat(data, 'ActivityTypeID', 'Description'));
        })
    }

    const changeDropDown = (e, name) => {
        if (e) {
            // console.log(e)
            if (name === 'RMSCFSCodeList') {
                const ids = []
                e.forEach(({ value }) => ids.push(value))
                setValue({
                    ...value,
                    [name]: JSON.stringify(ids)
                })
            } else {
                setValue({
                    ...value,
                    [name]: e.value,
                })
            }
        } else {
            setValue({
                ...value,
                [name]: null,
            })
        }
    }

    const colourStyles = {
        control: (styles) => ({
            ...styles,
            //  backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    const reset_Fields = () => {
        setValue({
            ...value,
            // 'ReportedDate': null,
            // 'ReportedDateTo': null,
            'IncidentNumber': '',
            'IncidentNumberTo': '',
            'MasterIncidentNumber': '',
            'MasterIncidentNumberTo': '',
            'RMSCFSCodeList': '',
            'OccurredFrom': '',
            'OccurredFromTo': '',
            'RMSDispositionId': '',
            'DispositionDate': '',
            'DispositionDateTo': '',
            'ReceiveSourceID': '',
            'NIBRSClearanceID': '',
            'IncidentPINActivityID': '',
            'IncidentSecurityID': '',
            'PINID': '',
        });
        // setOnAdvanceSearch();
    }

    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();
    const startRef4 = React.useRef();
    const startRef5 = React.useRef();
    const startRef6 = React.useRef();
    const startRef7 = React.useRef();
    const startRef8 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
            startRef3.current.setOpen(false);
            startRef4.current.setOpen(false);
            startRef5.current.setOpen(false);
            startRef6.current.setOpen(false);
            startRef7.current.setOpen(false);
            startRef8.current.setOpen(false);
        }
    };

    const getIncidentSearchData = async () => {
        fetchPostData('Incident/Search_Incident', value).then((res) => {
            if (res.length > 0) {
                console.log(res)
                setIncidentSearchData(res);
                reset_Fields();
                navigate('/incident')
            } else {
                toastifyError("Data Not Available"); setIncidentSearchData([]);
            }
        });
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
                                            <p className="p-0 m-0 d-flex align-items-center">Incident  Search</p>
                                        </div>
                                    </div>
                                    <div className="col-12 ">
                                        <fieldset className='fieldset' >
                                            <legend>Incident Report</legend>
                                            <div className="row px-1">
                                                <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                    <div className="text-field">
                                                        <input type="text" id='IncidentNumber' maxLength={9} name='IncidentNumber' value={value?.IncidentNumber} onChange={HandleChange} />
                                                        <label className=''>Incident Number From</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                    <div className="text-field">
                                                        <input type="text" id='IncidentNumberTo' maxLength={9} name='IncidentNumberTo' value={value?.IncidentNumberTo} onChange={HandleChange} />
                                                        <label className=''>Incident Number To</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                    <div className="text-field">
                                                        <input type="text" id='MasterIncidentNumber' name='MasterIncidentNumber' value={value?.MasterIncidentNumber} onChange={HandleChange} />
                                                        <label className=''>Master Incident From</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 mb-1">
                                                    <div className="text-field">
                                                        <input type="text" id='MasterIncidentNumberTo' name='MasterIncidentNumberTo' value={value?.MasterIncidentNumberTo} onChange={HandleChange} />
                                                        <label className=''>Master Incident To</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-6 pt-1 mb-1 mt-1">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='RMSCFSCodeList'
                                                            // styles={colourStyles}
                                                            defaultValue={[]}
                                                            // value={rmsCfsID?.filter((obj) => obj.value === value?.RMSCFSCodeList)}
                                                            options={rmsCfsID}
                                                            isClearable
                                                            isMulti
                                                            onChange={(e) => changeDropDown(e, 'RMSCFSCodeList')}
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor='' className='mt-0'>RMS CFS Range </label>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 pt-1">
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            name='OccurredFrom'
                                                            id='OccurredFrom'
                                                            ref={startRef2}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => { setValue({ ...value, ['OccurredFrom']: date ? getShowingDateText(date) : null }) }}
                                                            selected={value?.OccurredFrom && new Date(value?.OccurredFrom)}
                                                            dateFormat="MM/dd/yyyy"
                                                            timeInputLabel
                                                            isClearable={value?.OccurredFrom ? true : false}
                                                            peekNextMonth
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            autoComplete='Off'
                                                            // disabled
                                                            maxDate={new Date()}
                                                            placeholderText='Select...'
                                                        />
                                                        <label htmlFor="" className='pl-0 pt-1' >Occurred From Date</label>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 pt-1">

                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            id='OccurredFromTo'
                                                            name='OccurredFromTo'
                                                            ref={startRef3}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => { setValue({ ...value, ['OccurredFromTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                            dateFormat="MM/dd/yyyy"
                                                            isClearable={value?.OccurredFromTo ? true : false}
                                                            disabled={value?.OccurredFrom ? false : true}
                                                            selected={value?.OccurredFromTo && new Date(value?.OccurredFromTo)}
                                                            minDate={new Date(value?.OccurredFrom)}
                                                            maxDate={new Date()}
                                                            placeholderText={'Select...'}
                                                            showDisabledMonthNavigation
                                                            autoComplete="off"
                                                            showYearDropdown
                                                            showMonthDropdown
                                                            dropdownMode="select"
                                                        />
                                                        <label htmlFor="" className='pt-1'>Occurred To Date</label>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-3 mb-1">
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            name='ReportedDate'
                                                            id='ReportedDate'
                                                            ref={startRef}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => { setValue({ ...value, ['ReportedDate']: date ? getShowingDateText(date) : null }) }}
                                                            selected={value?.ReportedDate && new Date(value?.ReportedDate)}
                                                            dateFormat="MM/dd/yyyy"
                                                            timeInputLabel
                                                            isClearable={value?.ReportedDate ? true : false}
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
                                                            name='ReportedDateTo'
                                                            id='ReportedDateTo'
                                                            onChange={(date) => { setValue({ ...value, ['ReportedDateTo']: date ? getShowingDateText(date) : null }) }}
                                                            selected={value?.ReportedDateTo && new Date(value?.ReportedDateTo)}
                                                            dateFormat="MM/dd/yyyy"
                                                            timeInputLabel
                                                            ref={startRef1}
                                                            onKeyDown={onKeyDown}
                                                            isClearable={value?.ReportedDateTo ? true : false}
                                                            peekNextMonth
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            autoComplete='Off'
                                                            disabled={value?.ReportedDate ? false : true}
                                                            maxDate={new Date()}
                                                            placeholderText='Select...'
                                                            minDate={new Date(value?.ReportedDate)}
                                                        />
                                                        <label htmlFor="" className='pl-0 pt-1' >Reported To Date</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 pt-1 ">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='IncidentPINActivityID'
                                                            styles={colourStyles}
                                                            value={pinActivityID?.filter((obj) => obj.value === value?.IncidentPINActivityID)}
                                                            options={pinActivityID}
                                                            isClearable
                                                            onChange={(e) => changeDropDown(e, 'IncidentPINActivityID')}
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor='' className='mt-0'>Pin Activity</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 pt-1  ">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='PINID'
                                                            styles={colourStyles}
                                                            menuPlacement='top'
                                                            value={headOfAgency?.filter((obj) => obj.value === value?.PINID)}
                                                            isClearable
                                                            options={headOfAgency}
                                                            onChange={(e) => changeDropDown(e, 'PINID')}
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor='' className='mt-0'>Officer</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 pt-1 ">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='IncidentSecurityID'
                                                            styles={colourStyles}
                                                            value={typeOfSecurityID?.filter((obj) => obj.value === value?.IncidentSecurityID)}
                                                            options={typeOfSecurityID}
                                                            isClearable
                                                            onChange={(e) => changeDropDown(e, 'IncidentSecurityID')}
                                                            placeholder="Select..."
                                                        />
                                                        <label htmlFor='' className='mt-0'>Type Of Security</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 pt-1">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='ReceiveSourceID'
                                                            value={reciveSourceID?.filter((obj) => obj.value === value?.ReceiveSourceID)}
                                                            isClearable
                                                            options={reciveSourceID}
                                                            menuPlacement='top'
                                                            onChange={(e) => changeDropDown(e, 'ReceiveSourceID')}
                                                            placeholder="Select..."
                                                            styles={colourStyles}
                                                        />
                                                        <label htmlFor='' className='mt-0'>How Reported</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="col-12">
                                        <fieldset className='fieldset mt-2'>
                                            <legend>RMS Disposition/Clearance Information</legend>
                                            <div className="row px-1">
                                                <div class="col-6 col-md-6 col-lg-3 pt-1">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='RMSDispositionId'
                                                            value={rmsDisposition?.filter((obj) => obj.value === value?.RMSDispositionId)}
                                                            isClearable
                                                            options={rmsDisposition}
                                                            onChange={(e) => changeDropDown(e, 'RMSDispositionId')}
                                                            placeholder="Select..."
                                                            styles={colourStyles}
                                                        />
                                                        <label htmlFor='' className='mt-0'>RMS Disposition</label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 ">
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            id='DispositionDate'
                                                            name='DispositionDate'
                                                            ref={startRef6}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => {
                                                                setValue({
                                                                    ...value,
                                                                    ['DispositionDate']: date ? getShowingMonthDateYear(date) : null,
                                                                })
                                                            }}
                                                            dateFormat="MM/dd/yyyy"
                                                            isClearable={value?.DispositionDate ? true : false}
                                                            selected={value?.DispositionDate && new Date(value?.DispositionDate)}
                                                            maxDate={new Date()}
                                                            placeholderText={'Select...'}
                                                            showDisabledMonthNavigation
                                                            autoComplete="off"
                                                            showYearDropdown
                                                            showMonthDropdown
                                                            dropdownMode="select"
                                                        />
                                                        <label htmlFor="" className='pt-1'>Disposition From Date </label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 ">
                                                    <div className="dropdown__box">
                                                        <DatePicker
                                                            id='DispositionDateTo'
                                                            name='DispositionDateTo'
                                                            ref={startRef7}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => { setValue({ ...value, ['DispositionDateTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                            dateFormat="MM/dd/yyyy"
                                                            isClearable={value?.DispositionDateTo ? true : false}
                                                            disabled={value?.DispositionDate ? false : true}
                                                            selected={value?.DispositionDateTo && new Date(value?.DispositionDateTo)}
                                                            maxDate={new Date()}
                                                            minDate={new Date(value?.DispositionDate)}
                                                            placeholderText={'Select...'}
                                                            showDisabledMonthNavigation
                                                            autoComplete="off"
                                                            showYearDropdown
                                                            showMonthDropdown
                                                            dropdownMode="select"
                                                        />
                                                        <label htmlFor="" className='pt-1'>Disposition To Date </label>
                                                    </div>
                                                </div>
                                                <div class="col-6 col-md-6 col-lg-3 mt-1">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='NIBRSClearanceID'
                                                            value={exceptionalClearID?.filter((obj) => obj.value === value?.NIBRSClearanceID)}
                                                            isClearable
                                                            options={exceptionalClearID}
                                                            onChange={(e) => changeDropDown(e, 'NIBRSClearanceID')}
                                                            placeholder="Select..."
                                                            styles={colourStyles}
                                                        />
                                                        <label htmlFor='' className='mt-0'>Exceptional Clearance</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="btn-box text-right  mr-1 mb-2">
                            {/* <Link to={'/incident'}> */}
                            <button type="button" class="btn btn-sm btn-success mr-1" onClick={() => { getIncidentSearchData(); }}>Search</button>
                            {/* </Link> */}
                            <Link to={'/Search'}>
                                <button type="button" class="btn btn-sm btn-success mr-1" onClick={() => { reset_Fields(); }}>Close</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>


        </>

    )
}

export default IncidentSearchPage