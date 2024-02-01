import React, { useContext, useState } from 'react'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Article from './PropertyType/Article';
import Other from './PropertyType/Other';
import Boat from './PropertyType/Boat';
import Drug from './PropertyType/Drug';
import Weopon from './PropertyType/Weopon';
import Security from './PropertyType/Security';
import { Decrypt_Id_Name, Encrypted_Id_Name, colourStyles, getShowingMonthDateYear } from '../../../Common/Utility';
import { useEffect } from 'react';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { threeColArray } from '../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import DeletePopUpModal from '../../../Common/DeleteModal';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';

const PropertySearch = () => {

    const { deleteStoreData, storeData, updateCount, setUpdateCount, propertyLossCodeData, setPropertyLossCodeData, get_PropertyLossCode, propertySearchData, setPropertySearchData, localStoreArray, setLocalStoreArray, get_LocalStorage, propertyStatus, setPropertyStatus } = useContext(AgencyContext);

    const [propertySearchValue, setPropertySearchValue] = useState();
    const [propertyTypeData, setPropertyTypeData] = useState([]);
    const [propertyTypeCode, setPropertyTypeCode] = useState('');
    const [masterPropertyID, setMasterPropertyID] = useState('');
    const [advancedSearch, setAdvancedSearch] = useState(false);
    const [MainIncidentID, setMainIncidentID] = useState('');
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
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
        'IncidentNumber': '',
        'PropertyNumber': '',
        'PropertyTypeID': '',
        'LossCodeID': '',
        'ReportedDtTm': '',
        'ReportedDtTmTo': '',
        'PropertyCategoryCode': '',
        'LastName': '',
        'FirstName': '',
        'MiddleName': '',
        'AgencyID': '',
    });

    const [errors, setErrors] = useState({
        'PropertyNumberError': ''
    })

    useEffect(() => {
        if (propertyTypeData.length === 0) { PropertyType(); }
        get_PropertyLossCode();
    }, [LoginAgencyID])

    const PropertyType = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('PropertyCategory/GetDataDropDown_PropertyCategory', val).then((data) => {
            if (data) {
                const res = data?.filter((val) => {
                    if (val.PropertyCategoryCode !== "V") return val
                })
                setPropertyTypeData(threeColArray(res, 'PropertyCategoryID', 'Description', 'PropertyCategoryCode'))
            } else {
                setPropertyTypeData([]);
            }
        })
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
            if (name === 'PropertyTypeID') {
                console.log(e.id)
                switch (e.id) {
                    case 'A': get_PropertyLossCode('1', '', '', '', '', ''); break;
                    case 'B': get_PropertyLossCode('', '1', '', '', '', ''); break;
                    case 'S': get_PropertyLossCode('', '', '1', '', '', ''); break;
                    case 'O': get_PropertyLossCode('', '', '', '1', '', ''); break;
                    case 'D': get_PropertyLossCode('', '', '', '', '1', ''); break;
                    case 'G': get_PropertyLossCode('', '', '', '', '', '1'); break;
                    default: get_PropertyLossCode('1', '', '', '', '', '');
                }
                setValue({
                    ...value,
                    ['PropertyCategoryCode']: e.id, ['PropertyTypeID']: e.value, ['LossCodeID']: '',
                });
            } else {
                setValue({
                    ...value,
                    [name]: e.value
                });
            }
        } else {
            if (name === 'PropertyTypeID') {
                setValue({
                    ...value,
                    ['PropertyCategoryCode']: '', ['PropertyTypeID']: '', ['LossCodeID']: '',
                });
                setPropertyLossCodeData([])
            } else {
                setValue({
                    ...value,
                    [name]: null
                });
            }
        }
    }

    // const check_Validation_Error = (e) => {
    //     if (RequiredFieldSpaceNotAllow(value.PropertyNumber)) {
    //         setErrors(prevValues => { return { ...prevValues, ['PropertyNumberError']: RequiredFieldSpaceNotAllow(value.PropertyNumber) } })
    //     }
    // }

    // Check All Field Format is True Then Submit 
    // const { PropertyNumberError } = errors

    // useEffect(() => {
    //     if (PropertyNumberError === 'true') {
    //         getPropertySearch();
    //     }
    // }, [PropertyNumberError])

    const getPropertySearch = async () => {
        fetchPostData("Property/Search_Property", value).then((data) => {
            if (data.length > 0) {
                setPropertySearchValue(data);
                setAdvancedSearch(false);
                Reset();
            } else {
                setPropertySearchValue([]);
                toastifyError("Data Not Available")
            }
        })
    }

    const Reset = () => {
        setValue({
            ...value,
            'IncidentNumber': '',
            'PropertyNumber': '',
            'PropertyTypeID': '',
            'LossCodeID': '',
            'ReportedDtTm': '',
            'ReportedDtTmTo': '',
            'PropertyCategoryCode': '',
            'LastName': '',
            'FirstName': '',
            'MiddleName': '',
        })
    }

    const columns = [
        {
            width: '150px',
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                {
                    <Link to={'/propertytab?page=masterProperty'} onClick={(e) => set_Edit_Value(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                        <i className="fa fa-edit"></i>
                    </Link>
                }
                {/* {
                    <Link to={`#`} onClick={(e) => { setMasterPropertyID(row.MasterPropertyID) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                        <i className="fa fa-trash"></i>
                    </Link>
                } */}
            </>
        },
        {
            name: 'Incident Number',
            selector: (row) => row.IncidentNumber,
            // selector: (row) => <>{row?.FirstName ? row?.FirstName.substring(0, 10) : ''}{row?.FirstName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'Property Number',
            selector: (row) => row.PropertyNumber,
            // selector: (row) => <>{row?.MiddleName ? row?.MiddleName.substring(0, 10) : ''}{row?.MiddleName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 5 }}>Delete</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', right: 5 }}>
                    {
                        <Link to={`#`} onClick={(e) => { setMasterPropertyID(row.MasterPropertyID) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                            <i className="fa fa-trash"></i>
                        </Link>
                    }
                </div>
            </>
        },
    ]

    const set_Edit_Value = (e, row) => {
        //     if (row.MasterPropertyID) {
        //         setMasterPropertyID(row.MasterPropertyID);
        //         store_PropertyID(row?.MasterPropertyID, true);
        //     }
        if (row.PropertyID || row.MasterPropertyID) {
            setMasterPropertyID(row.MasterPropertyID);
            storeData({ 'PropertyID': row?.PropertyID, 'MasterPropertyID': row?.MasterPropertyID, 'propertyStatus': true })
        }
        setPropertyStatus(true);
        setUpdateCount(updateCount + 1);
    }

    // const store_PropertyID = (MasterPropertyID, propertyStatus) => {
    //     const val = {
    //         Value: "",
    //         UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    //         Key: JSON.stringify({ 'MasterPropertyID': MasterPropertyID, 'propertyStatus': propertyStatus }),
    //     }
    //     AddDeleteUpadate('LocalStorage/ObjectInsert_LocalStorage', val).then((res) => {
    //         if (res?.success) {
    //             setLocalStoreArray(pre => { return { ...pre, ['MasterPropertyID']: MasterPropertyID, ['propertyStatus']: propertyStatus } });
    //         }
    //     })
    // }

    const Delete_MasterProperty = () => {
        const val = {
            'MasterPropertyID': masterPropertyID,
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate('MainMasterProperty/Delete_MainMasterProperty', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                getPropertySearch();
            } else {
                console.log("Something Wrong")
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

    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center mb-2">
                                    <p className="p-0 m-0">Property Search</p>
                                </div>
                                {/* <fieldset className='fieldset' style={{marginTop:'-5px'}}>
                                    <legend>Property Information</legend>
                                    <div className="row"> */}
                                {/* <div class="col-6 col-md-3 mt-1">
                                        <div className="text-field">
                                            <input type="text" />
                                            <label className=''>Transaction</label>
                                        </div>
                                    </div> */}
                                {/* <div class="col-6 col-md-4 mt-1">
                                            <div className="text-field">
                                                <input type="text" id='IncidentNumber' maxLength={8} name='IncidentNumber' className={''} value={value.IncidentNumber} onChange={handlChange} />
                                                <label className=''>Incident Number</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-4 mt-1">
                                            <div className="text-field">
                                                <input type="text" id='PropertyNumber' style={{ textTransform: "uppercase" }} maxLength={10} name='PropertyNumber' value={value.PropertyNumber} onChange={handlChange} />
                                                <label className=''>Property</label>
                                                {errors.PropertyNumberError !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PropertyNumberError}</span>
                                            ) : null}
                                            </div>
                                        </div> */}
                                {/* <div class="col-6 col-md-3 mb-1">
                                        <div className="dropdown__box">
                                            <Select
                                                styles={colourStyles}
                                                name='PropertyTypeID'
                                                value={propertyTypeData?.filter((obj) => obj.value === value?.PropertyTypeID)}
                                                options={propertyTypeData}
                                                onChange={(e) => ChangeDropDown(e, 'PropertyTypeID')}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                            <label htmlFor='' className='mt-0'>Property Type</label>
                                        </div>  
                                    </div> */}
                                {/* <div class="col-6 col-md-4 col-lg-4 pt-1 mb-1">
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
                                                <label htmlFor='' className='mt-0'>Property Reason</label>
                                            </div>
                                        </div> */}
                                {/* <div class="col-6 col-md-4 col-lg-3 mb-1">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='ReportedDtTm'
                                                    name='ReportedDtTm'
                                                    ref={startRef}
                                                    onKeyDown={onKeyDown}
                                                    onChange={(date) => { setValue({ ...value, ['ReportedDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                                    className=''
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    dropdownMode="select"
                                                    showMonthDropdown
                                                    autoComplete='Off'
                                                    showYearDropdown
                                                    isClearable={value?.ReportedDtTm ? true : false}
                                                    selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                                    maxDate={new Date()}
                                                    placeholderText={value?.ReportedDtTm ? value.ReportedDtTm : 'Select...'}
                                                />
                                                <label htmlFor="" className='pt-1'>Reported From Date</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-4 col-lg-3 mb-1">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='ReportedDtTmTo'
                                                    name='ReportedDtTmTo'
                                                    ref={startRef1}
                                                    onKeyDown={onKeyDown}
                                                    onChange={(date) => { setValue({ ...value, ['ReportedDtTmTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                    className=''
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    dropdownMode="select"
                                                    showMonthDropdown
                                                    autoComplete='Off'
                                                    showYearDropdown
                                                    disabled={value?.ReportedDtTm ? false : true}
                                                    isClearable={value?.ReportedDtTmTo ? true : false}
                                                    selected={value?.ReportedDtTmTo && new Date(value?.ReportedDtTmTo)}
                                                    maxDate={new Date()}
                                                    minDate={new Date(value?.ReportedDtTmTo)}
                                                    placeholderText={value?.ReportedDtTmTo ? value.ReportedDtTmTo : 'Select...'}
                                                />
                                                <label htmlFor="" className='pt-1'>Reported To Date</label>
                                            </div>
                                        </div> */}
                                {/* 
                                        <div class="col-6 col-md-4 col-lg-3 mb-1 mt-1">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='ReportedDtTm'
                                                    name='ReportedDtTm'
                                                    ref={startRef}
                                                    onKeyDown={onKeyDown}
                                                    onChange={(date) => { setValue({ ...value, ['ReportedDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                                    className=''
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    dropdownMode="select"
                                                    showMonthDropdown
                                                    autoComplete='Off'
                                                    showYearDropdown
                                                    isClearable={value?.ReportedDtTm ? true : false}
                                                    selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                                    maxDate={new Date()}
                                                    placeholderText={value?.ReportedDtTm ? value.ReportedDtTm : 'Select...'}
                                                />
                                                <label htmlFor="" className='pt-1'>Reported From Date</label>
                                            </div>
                                        </div>
                                        <div class="col-6 col-md-4 col-lg-3 mb-1 mt-1">
                                            <div className="dropdown__box">
                                                <DatePicker
                                                    id='ReportedDtTmTo'
                                                    name='ReportedDtTmTo'
                                                    ref={startRef1}
                                                    onKeyDown={onKeyDown}
                                                    onChange={(date) => { setValue({ ...value, ['ReportedDtTmTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                    className=''
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    dropdownMode="select"
                                                    showMonthDropdown
                                                    autoComplete='Off'
                                                    showYearDropdown
                                                    disabled={value?.ReportedDtTm ? false : true}
                                                    isClearable={value?.ReportedDtTmTo ? true : false}
                                                    selected={value?.ReportedDtTmTo && new Date(value?.ReportedDtTmTo)}
                                                    maxDate={new Date()}
                                                    minDate={new Date(value?.ReportedDtTm)}
                                                    placeholderText={'Select...'}
                                                />
                                                <label htmlFor="" className='pt-1'>Reported To Date</label>
                                            </div>
                                        </div> */}
                                {/* {
                                            propertyTypeCode === "A" ?
                                                <Article />
                                                :
                                                propertyTypeCode === "O" ?
                                                    <Other />
                                                    :
                                                    propertyTypeCode === "B" ?
                                                        <Boat />
                                                        :
                                                        propertyTypeCode === "D" ?
                                                            <Drug />
                                                            :
                                                            propertyTypeCode === "G" ?
                                                                <Weopon />
                                                                :
                                                                propertyTypeCode === "S" ?
                                                                    <Security />
                                                                    :
                                                                    <></>
                                        } */}
                                {/* </div>
                                </fieldset> */}
                                <fieldset className='fieldset '>
                                    <legend>Property Owner</legend>
                                    <div className="row">
                                        <div class="col-4 col-md-4">
                                            <div className="text-field">
                                                <input type="text" name='LastName' id='LastName' value={value?.LastName} onChange={handlChange} />
                                                <label className=''>Last Name</label>
                                            </div>
                                        </div>
                                        <div class="col-4 col-md-4">
                                            <div className="text-field">
                                                <input type="text" name='FirstName' id='FirstName' value={value?.FirstName} onChange={handlChange} />
                                                <label className=''>First Name</label>
                                            </div>
                                        </div>
                                        <div class="col-4 col-md-4">
                                            <div className="text-field">
                                                <input type="text" name='MiddleName' id='MiddleName' value={value?.MiddleName} onChange={handlChange} />
                                                <label className=''>Middle Name</label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                                <div className="row mt-1 px-2 text-right">
                                    <div className="col-12 col-md-12 col-lg-12" style={{ marginTop: '3px' }}>
                                        {/* <button type="button" className="btn btn-sm btn-success" onClick={() => { check_Validation_Error(); }}>Search</button> */}
                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { getPropertySearch(); }}>Search</button>
                                        <Link to={'/dashboard-page'}>
                                            <button type="button" className="btn btn-sm btn-success mr-1" data-dismiss="modal"  >Close</button>
                                        </Link>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { setAdvancedSearch(true); }} data-toggle="modal" data-target="#PropertySearchModal">Advance Search</button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12  mt-2">
                                        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0">Property</p>
                                            <p className="p-0 m-0">
                                                <Link to={'/propertytab?page=masterProperty'} onClick={() => {
                                                    setPropertyStatus(false);
                                                    storeData({ 'propertyStatus': false });
                                                    deleteStoreData({ 'PropertyID': '', 'MasterPropertyID': '' });
                                                    // setIncStatus(false);
                                                }} className="btn btn-sm bg-green text-white px-2 py-0" >
                                                    <i className="fa fa-plus"></i>
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-12 ">
                                        <DataTable
                                            dense
                                            columns={columns}
                                            // data={propertySearchValue ? propertySearchValue : []}
                                            data={
                                                propertySearchData?.length > 0 ? propertySearchData : propertySearchValue ? propertySearchValue : []
                                            }
                                            pagination
                                            selectableRowsHighlight
                                            highlightOnHover
                                            paginationPerPage={'5'}
                                            paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                advancedSearch &&

                <div class="modal top fade " style={{ background: "rgba(0,0,0, 0.5)" }} id="PropertySearchModal" tabindex="-1" data-backdrop="false" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog  modal-xl" role="document">
                        <div className="modal-content" style={{ borderRadius: '10px', boxShadow: '0px 0px 3px floralwhite' }}>
                            <div class="modal-header px-3 p-2" style={{ backgroundColor: 'aliceblue', boxShadow: '0px 0px 2px dimgray' }}>
                                <h5 class="modal-title">Property Advance Search</h5>
                                <button type="button" class="close btn-modal" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" style={{ color: 'red', fontSize: '20px', }}>&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div className="m-1 ">
                                    <div className="row">
                                        <div className="col-12">
                                            <fieldset className='fieldset'>
                                                <legend>Property Information</legend>
                                                <div className="row">
                                                    <div class="col-6 col-md-3 " style={{ marginTop: '5px' }}>
                                                        <div className="text-field">
                                                            <input type="text" id='IncidentNumber' maxLength={8} name='IncidentNumber' className={''} value={value.IncidentNumber} onChange={handlChange} />
                                                            <label className=''>Master Case</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-3 " style={{ marginTop: '5px' }}>
                                                        <div className="text-field">
                                                            <input type="text" id='PropertyNumber' style={{ textTransform: "uppercase" }} maxLength={10} name='PropertyNumber' value={value.PropertyNumber} onChange={handlChange} />
                                                            <label className=''>Property</label>
                                                        </div>
                                                    </div>
                                                    {/* <div class="col-6 col-md-3 col-lg-3 pt-1">
                                                        <div className="dropdown__box">
                                                            <Select
                                                                styles={colourStyles}
                                                                name='PropertyTypeID'
                                                                value={propertyTypeData?.filter((obj) => obj.value === value?.PropertyTypeID)}
                                                                options={propertyTypeData}
                                                                onChange={(e) => ChangeDropDown(e, 'PropertyTypeID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label htmlFor='' className='mt-0'>Property Type</label>
                                                        </div>
                                                    </div> */}
                                                    <div className="col-6 col-md-3 col-lg-3 mt-1">
                                                        <div className=" dropdown__box">
                                                            <Select
                                                                styles={colourStyles}
                                                                name='PropertyTypeID'
                                                                value={propertyTypeData?.filter((obj) => obj.value === value?.PropertyTypeID)}
                                                                options={propertyTypeData}
                                                                onChange={(e) => ChangeDropDown(e, 'PropertyTypeID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                                isDisabled={sessionStorage.getItem('PropertyID') || sessionStorage.getItem('MasterPropertyID') ? true : false}
                                                            />
                                                            <label>Type</label>
                                                            {errors.PropertyTypeIDError !== 'true' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PropertyTypeIDError}</span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-4 col-lg-3 pt-1 ">
                                                        <div className="dropdown__box">
                                                            <Select
                                                                name='LossCodeID'
                                                                styles={colourStyles}
                                                                value={propertyLossCodeData?.filter((obj) => obj.value === value?.LossCodeID)}
                                                                options={propertyLossCodeData}
                                                                onChange={(e) => ChangeDropDown(e, 'LossCodeID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                            />
                                                            <label htmlFor='' className='mt-0'>Property Reason</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-4 col-lg-3 mb-1 mt-1">
                                                        <div className="dropdown__box">
                                                            <DatePicker
                                                                id='ReportedDtTm'
                                                                name='ReportedDtTm'
                                                                ref={startRef}
                                                                onKeyDown={onKeyDown}
                                                                onChange={(date) => { setValue({ ...value, ['ReportedDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                className=''
                                                                dateFormat="MM/dd/yyyy"
                                                                timeInputLabel
                                                                dropdownMode="select"
                                                                showMonthDropdown
                                                                autoComplete='Off'
                                                                showYearDropdown
                                                                isClearable={value?.ReportedDtTm ? true : false}
                                                                selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                                                maxDate={new Date()}
                                                                placeholderText={value?.ReportedDtTm ? value.ReportedDtTm : 'Select...'}
                                                            />
                                                            <label htmlFor="" className='pt-1'>Reported From Date</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-4 col-lg-3 mb-1 mt-1">
                                                        <div className="dropdown__box">
                                                            <DatePicker
                                                                id='ReportedDtTmTo'
                                                                name='ReportedDtTmTo'
                                                                ref={startRef1}
                                                                onKeyDown={onKeyDown}
                                                                onChange={(date) => { setValue({ ...value, ['ReportedDtTmTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                className=''
                                                                dateFormat="MM/dd/yyyy"
                                                                timeInputLabel
                                                                dropdownMode="select"
                                                                showMonthDropdown
                                                                autoComplete='Off'
                                                                showYearDropdown
                                                                disabled={value?.ReportedDtTm ? false : true}
                                                                isClearable={value?.ReportedDtTmTo ? true : false}
                                                                selected={value?.ReportedDtTmTo && new Date(value?.ReportedDtTmTo)}
                                                                maxDate={new Date()}
                                                                minDate={new Date(value?.ReportedDtTm)}
                                                                placeholderText={'Select...'}
                                                            />
                                                            <label htmlFor="" className='pt-1'>Reported To Date</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <fieldset className='fieldset mt-2'>
                                                <legend>Property Owner</legend>
                                                <div className="row">
                                                    <div class="col-6 col-md-3">
                                                        <div className="text-field">
                                                            <input type="text" name='LastName' id='LastName' value={value?.LastName} onChange={handlChange} />
                                                            <label className=''>Last Name</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-3">
                                                        <div className="text-field">
                                                            <input type="text" name='FirstName' id='FirstName' value={value?.FirstName} onChange={handlChange} />
                                                            <label className=''>First Name</label>
                                                        </div>
                                                    </div>
                                                    <div class="col-6 col-md-3">
                                                        <div className="text-field">
                                                            <input type="text" name='MiddleName' id='MiddleName' value={value?.MiddleName} onChange={handlChange} />
                                                            <label className=''>Middle Name</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                            <div className="row mt-1 px-2 text-right">
                                                <div className="col-12">
                                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { getPropertySearch(); }}>Search</button>
                                                    <button type="button" data-dismiss="modal" className="btn btn-sm btn-success" onClick={() => { Reset(); setAdvancedSearch(false) }}>Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <DeletePopUpModal func={Delete_MasterProperty} />
        </>
    )
}

export default PropertySearch