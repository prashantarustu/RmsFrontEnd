import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Decrypt_Id_Name, colourStyles, customStylesWithOutColor, getShowingMonthDateYear, getShowingWithOutTime, getYearWithOutDateTime } from '../../../Common/Utility';
import { useState } from 'react';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { useContext } from 'react';
import { fetchPostData } from '../../../hooks/Api';
import { toastifyError } from '../../../Common/AlertMsg';
import { useEffect } from 'react';
import { threeColArray } from '../../../Common/ChangeArrayFormat';
import DataTable from 'react-data-table-component';
import Loader from '../../../Common/Loader';


const PropertySearchPage = () => {

    const navigate = useNavigate()
    const { updateCount, setUpdateCount, setChangesStatus, propertyLossCodeData, setPropertyLossCodeData, get_PropertyLossCode, propertySearchData, setPropertySearchData,localStoreArray, setLocalStoreArray, get_LocalStorage } = useContext(AgencyContext);
    const [propertyTypeData, setPropertyTypeData] = useState([]);
    const [propertyTypeCode, setPropertyTypeCode] = useState('');
    const [masterPropertyID, setMasterPropertyID] = useState('');
    const [advancedSearch, setAdvancedSearch] = useState(false);
    const [color, setColor] = useState([]);
    const [measureTypeDrp, setMeasureTypeDrp] = useState([]);
    const [securityDate, setSecurityDate] = useState();
    const [weaponMakeDrpData, setWeaponMakeDrpData] = useState([]);
    const [weaponModalDrp, setWeaponModalDrp] = useState([])
    const [weaponfactureDate, setWeaponfactureDate] = useState();
    const [loder, setLoder] = useState(false);
    const [Drugloder, setDrugLoder] = useState(false);
    const [manufactureDate, setManufactureDate] = useState();
    const [registratonStateDrp, setRegistratonStateDrp] = useState([]);
    const [VODIDData, setVODIDData] = useState([])
    const [materialDrp, setMaterialDrp] = useState([]);
    const [makeIdDrp, setMakeIdDrp] = useState([]);
    const [boatModelDrp, setboatModelDrp] = useState();
    const [registrationExpDate, setRegistrationExpDate] = useState();
    const [propulusionDrp, setPropulusionDrp] = useState([]);
    const [propertyDrugID, setPropertyDrugID] = useState()
    const [drugModal, setdrugModal] = useState()
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [drugEditData, setDrugEditData] = useState([])
    const [drugData, setDrugData] = useState()

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
    useEffect(() => {
        if (propertyTypeData.length === 0) { PropertyType(LoginAgencyID); }
        get_PropertyLossCode();
    }, [])

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

    const [value, setValue] = useState({
        'IncidentNumber': null,
        'PropertyNumber': null,
        'PropertyTypeID': null,
        'LossCodeID': null,
        'ReportedDtTm': null,
        'ReportedDtTmTo': null,
        'PropertyCategoryCode': null,
        'LastName': null,
        'FirstName': null,
        'MiddleName': null,
        'AgencyID': LoginAgencyID,
    });

    const handlChange = (e,) => {
        if (e.target.name === 'PropertyNumber') {
            var ele = e.target.value.replace(/[^a-zA-Z\s^0-9\s]/g, '');
            if (ele.length === 10) {
                var cleaned = ('' + ele).replace(/[^a-zA-Z\s^0-9\s]/g, '');
                var match = cleaned.match(/^(\w{3})(\d{7})$/);
                if (match) {
                    console.log(match)
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2]
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
    const columns = [
        {
            name: 'Suspected Drug Type ID',
            selector: (row) => row.SuspectedDrugType_Description,
            sortable: true
        },
        {
            name: 'Estimated Drug Qty',
            selector: (row) => row.EstimatedDrugQty,
            sortable: true
        },
        {
            name: 'Fraction Drug Qty',
            selector: (row) => row.FractionDrugQty,
            sortable: true
        },

        {
            name: 'Measurement Type ID',
            selector: (row) => row.PropertyDrugMeasure_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Action</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 0, right: 48 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <button onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DrugModal" >
                                <i className="fa fa-edit"></i>
                            </button>
                            : <></>
                            : <button onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DrugModal" >
                                <i className="fa fa-edit"></i></button>
                    }
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <button to={`#`} onClick={() => { setPropertyDrugID(row.PropertyDrugID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </button>
                            : <></>
                            : <button to={`#`} onClick={() => { setPropertyDrugID(row.PropertyDrugID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </button>
                    }
                </div>
            </>
        }
    ]
    const set_Edit_Value = (e, row) => {
        setPropertyDrugID(row.PropertyDrugID);
        setDrugEditData(row)
        setdrugModal(true)
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

    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();
    const startRef4 = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
            startRef3.current.setOpen(false);
            startRef4.current.setOpen(false);
        }
    };

    const getPropertySearch = async () => {
        fetchPostData("Property/Search_Property", value).then((data) => {
            if (data.length > 0) {
                setPropertySearchData(data); navigate('/property-search')
                // sessionStorage.removeItem('PropertyID');
                // sessionStorage.removeItem('MasterPropertyID');
                Reset();
            } else {
                setPropertySearchData([]);
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
    const HandleChanges = (e) => {
        if (e.target.name === 'IsEvidence' || e.target.name === 'IsSendToPropertyRoom' || e.target.name === 'IsPropertyRecovered' || e.target.name === 'IsAuto') {
            setChangesStatus(true)
            setValue({
                ...value,
                [e.target.name]: e.target.checked
            })
        } else if (e.target.name === 'ManufactureYear' || e.target.name === 'EstimatedDrugQty') {
            var ele = e.target.value.replace(/[^0-9.]/g, "")
            if (ele.length === 10) {
                var cleaned = ('' + ele).replace(/[^0-9.]/g, '');
                setChangesStatus(true)
                setValue({
                    ...value,
                    [e.target.name]: cleaned
                });
            } else {
                ele = e.target.value.split('$').join('').replace(/[^0-9.]/g, "");
                setChangesStatus(true)
                setValue({
                    ...value,
                    [e.target.name]: ele
                });
            }
        } else if (e.target.name === 'Quantity' || e.target.name === 'Length' || e.target.name === 'FractionDrugQty' || e.target.name === 'MarijuanaNumber' || e.target.name === 'ClandistineLabsNumber') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            // /[^a-zA-Z\s]/g
            setChangesStatus(true)
            setValue({
                ...value,
                [e.target.name]: checkNumber
            });
        }
        else if (e.target.name === 'Value') {
            var ele = e.target.value.replace(/[^0-9\.]/g, "")
            if (ele.includes('.')) {
                if (ele.length === 16) {
                    setChangesStatus(true)
                    // if(ele.substr( ele.indexOf('.') + 1 ).slice(0, 2) )      
                    setValue({ ...value, [e.target.name]: ele });
                } else {
                    // ele = e.target.value.split('-').join('').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    setChangesStatus(true)
                    if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
                        setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
                    } else { setValue({ ...value, [e.target.name]: ele }) }
                }
            } else {
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
            }
        } else {
            setChangesStatus(true)
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }
    const setStatusFalse = (e) => {
        setPropertyDrugID('');
        setdrugModal(true)
        setValue({
            ...value,
            'SuspectedDrugTypeID': '',
            'EstimatedDrugQty': '',
            'FractionDrugQty': '',
            'MeasurementTypeID': '',
            'PropertyDrugID': '',
            'PropertySourceDrugTypeID': '', 'MarijuanaTypeID': '', 'MarijuanaNumber': '', 'DrugManufacturedID': '', '  ClandistineLabsNumber': '',
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
                                            <p className="p-0 m-0 d-flex align-items-center">Property Search</p>
                                        </div>
                                    </div>
                                    <div className="col-12 ">
                                        <fieldset className='fieldset'>
                                            <legend>Property Information</legend>
                                            <div className="row">
                                                <div class="col-6 col-md-3 " style={{ marginTop: '5px' }}>
                                                    <div className="text-field">
                                                        <input type="text" id='IncidentNumber' maxLength={8} name='IncidentNumber' className={''} value={value.IncidentNumber} onChange={handlChange} />
                                                        <label className=''>Incident Number</label>
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
                                                        {/* {errors.PropertyTypeIDError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PropertyTypeIDError}</span>
                                                        ) : null} */}
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

                                        {/* ARTICLE   */}
                                        {
                                            value.PropertyCategoryCode === 'A' ?
                                                <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                                                    <fieldset className='fieldset'>
                                                        <legend>Article</legend>
                                                        {/* <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                                                            <p className="p-0 m-0">Article</p>
                                                        </div> */}
                                                        <div className="row">
                                                            <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Serial Id</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='ModelID' id='ModelID' value={value?.ModelID} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Model Id</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3 col-md-6 col-lg-3 mt-1">
                                                                <div className=" dropdown__box">
                                                                    <Select
                                                                        name='TopColorID'
                                                                        value={color?.filter((obj) => obj.value === value?.TopColorID)}
                                                                        options={color}
                                                                        styles={customStylesWithOutColor}
                                                                        onChange={(e) => ChangeDropDown(e, 'TopColorID')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label>Top Color</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3 col-md-6 col-lg-3 mt-1">
                                                                <div className=" dropdown__box">
                                                                    <Select
                                                                        name='BottomColorID'
                                                                        value={color?.filter((obj) => obj.value === value?.BottomColorID)}
                                                                        options={color}
                                                                        styles={customStylesWithOutColor}
                                                                        onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label>Bottom Color</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='OAN' id='OAN' value={value?.OAN} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">OAN</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='Quantity' id='Quantity' value={value?.Quantity} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Quantity</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='Brand' id='Brand' value={value?.Brand} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Brand</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </fieldset>

                                                </div>

                                                :
                                                <></>
                                        }
                                        {/* Others */}
                                        {
                                            value.PropertyCategoryCode === 'O' ?
                                                <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                                                    <fieldset className='fieldset'>
                                                        <legend>Other</legend>
                                                        <div className="row">
                                                            {/* <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                  <div className="text-field">
                    <input type="text" id='OtherID' name='OtherID' value={value?.OtherID} onChange={HandleChanges} className='' required />
                    <label htmlFor="">Other Id</label>
                  </div>
                </div> */}
                                                            <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='Brand' id='Brand' value={value?.Brand} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Brand</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Serial Id</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3 col-md-6 col-lg-3 mt-1">
                                                                <div className=" dropdown__box">
                                                                    <Select
                                                                        name='TopColorID'
                                                                        value={color?.filter((obj) => obj.value === value?.TopColorID)}
                                                                        options={color}
                                                                        styles={customStylesWithOutColor}
                                                                        onChange={(e) => ChangeDropDown(e, 'TopColorID')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label>Top Color</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3 col-md-6 col-lg-3 mt-1">
                                                                <div className=" dropdown__box">
                                                                    <Select
                                                                        name='BottomColorID'
                                                                        value={color?.filter((obj) => obj.value === value?.BottomColorID)}
                                                                        options={color}
                                                                        styles={customStylesWithOutColor}
                                                                        onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label>Bottom Color</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='ModelID' id='ModelID' value={value?.ModelID} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Model Id</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='Quantity' id='Quantity' value={value?.Quantity} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Quantity</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3 col-md-6 col-lg-3 mt-1">
                                                                <div className=" dropdown__box">
                                                                    <Select
                                                                        name='quantityunit'
                                                                        // options={color}
                                                                        styles={customStylesWithOutColor}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label>Quantity Unit</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <></>
                                        }
                                        {/* Security */}
                                        {
                                            value.PropertyCategoryCode === 'S' ?
                                                <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                                                    <fieldset className='fieldset'>
                                                        <legend>Security</legend>
                                                        <div className="row">
                                                            {/* <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                  <div className="text-field">
                    <input type="text" name='SecurityIDNumber' value={value?.SecurityIDNumber} id='SecurityIDNumber' onChange={HandleChanges} className='' required />
                    <label htmlFor="">Security Id</label>
                  </div>
                </div> */}
                                                            <div className="col-4  col-md-3 col-lg-3  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='Denomination' id='Denomination' value={value?.Denomination} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Denomination</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-4  col-md-3 col-lg-3  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='IssuingAgency' id='IssuingAgency' value={value?.IssuingAgency} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Issuing Agency</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-4 col-md-6 col-lg-3 mt-1">
                                                                <div className=" dropdown__box">
                                                                    <Select
                                                                        name='MeasureTypeID'
                                                                        value={measureTypeDrp?.filter((obj) => obj.value === value?.MeasureTypeID)}
                                                                        styles={customStylesWithOutColor}
                                                                        options={measureTypeDrp}
                                                                        onChange={(e) => ChangeDropDown(e, 'MeasureTypeID')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                        isDisabled
                                                                    />
                                                                    <label>Measure Type</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-5 col-md-6 col-lg-3 mt-3 date__box">
                                                                <DatePicker
                                                                    id='SecurityDtTm'
                                                                    name='SecurityDtTm'
                                                                    ref={startRef1}
                                                                    onKeyDown={onKeyDown}
                                                                    onChange={(date) => { setSecurityDate(date); setValue({ ...value, ['SecurityDtTm']: date ? getShowingWithOutTime(date) : null }) }}
                                                                    className=''
                                                                    dateFormat="MM/dd/yyyy"
                                                                    // timeInputLabel
                                                                    // showTimeInput
                                                                    isClearable={value?.SecurityDtTm ? true : false}
                                                                    selected={securityDate}
                                                                    placeholderText={value?.SecurityDtTm ? value.SecurityDtTm : 'Select...'}
                                                                    // showTimeSelect
                                                                    timeIntervals={1}
                                                                    // timeCaption="Time"
                                                                    autoComplete="Off"
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                    maxDate={new Date()}
                                                                />
                                                                <label htmlFor="">Security Date</label>
                                                            </div>
                                                            <div className="col-3 col-md-6 col-lg-3 mt-1">
                                                                <div className="text-field">
                                                                    <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="" className='pt-1'>Serial Id</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <></>
                                        }
                                        {/* Weapon */}
                                        {
                                            value.PropertyCategoryCode === 'G' ?
                                                <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                                                    <fieldset className='fieldset'>
                                                        <legend>Weapon</legend>

                                                        <div className="row">
                                                            {/* <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                  <div className="text-field">
                    <input type="text" name='WeaponIDNumber' id='WeaponIDNumber' value={value?.WeaponIDNumber} onChange={HandleChanges} className='' required />
                    <label htmlFor="">Weapon Id</label>
                  </div>
                </div> */}
                                                            <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='Style' id='Style' value={value?.Style} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Style</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='Finish' id='Finish' value={value?.Finish} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Finish</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='Caliber' id='Caliber' value={value?.Caliber} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Caliber</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='Handle' id='Handle' value={value?.Handle} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Handle</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3  col-md-3 col-lg-1  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Serial Id</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                <div className=" dropdown__box">
                                                                    <Select
                                                                        name='MakeID'
                                                                        value={weaponMakeDrpData?.filter((obj) => obj.value === value?.MakeID)}
                                                                        styles={customStylesWithOutColor}
                                                                        options={weaponMakeDrpData}
                                                                        onChange={(e) => ChangeDropDown(e, 'MakeID')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label>Make</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                                                <div className=" dropdown__box">
                                                                    <Select
                                                                        name='WeaponModelID'
                                                                        styles={customStylesWithOutColor}
                                                                        value={weaponModalDrp?.filter((obj) => obj.value === value?.WeaponModelID)}
                                                                        isClearable
                                                                        options={weaponModalDrp}
                                                                        onChange={(e) => ChangeDropDown(e, 'WeaponModelID')}
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label>Model Id</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-1 mt-4">
                                                                <div class="form-check ">
                                                                    <input class="form-check-input" type="checkbox" name='auto' id="flexCheckDefault" />
                                                                    <label class="form-check-label" name='IsAuto' id='IsAuto' value={value?.IsAuto} checked={value?.IsAuto} onChange={HandleChanges} for="flexCheckDefault">
                                                                        Auto
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            {/* <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                      <div className="text-field">
                        <input type="text" maxLength={4} name='ManufactureYear' value={value?.ManufactureYear} id='ManufactureYear' onChange={HandleChanges} className='' required />
                        <label htmlFor="">Manufacture Year</label>
                      </div>
                    </div> */}
                                                            <div className="col-4 col-md-4 col-lg-3 mt-1 ">
                                                                <div className="dropdown__box">
                                                                    <DatePicker
                                                                        name='ManufactureYear'
                                                                        id='ManufactureYear'
                                                                        selected={weaponfactureDate}
                                                                        onChange={(date) => { setWeaponfactureDate(date); setValue({ ...value, ['ManufactureYear']: date ? getYearWithOutDateTime(date) : null }) }}
                                                                        showYearPicker
                                                                        dateFormat="yyyy"
                                                                        yearItemNumber={9}
                                                                        ref={startRef4}
                                                                        onKeyDown={onKeyDown}
                                                                        autoComplete="nope"
                                                                        showYearDropdown
                                                                        showMonthDropdown
                                                                        dropdownMode="select"
                                                                        maxDate={new Date()}
                                                                    />
                                                                    <label htmlFor="" className='pt-1'>Manufacture Year</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='BarrelLength' value={value?.BarrelLength} id='BarrelLength' onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Barrel Length</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <>
                                                </>
                                        }
                                        {/* Boat */}
                                        {
                                            value.PropertyCategoryCode === 'B' ?
                                                <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                                                    <fieldset className='fieldset'>
                                                        <legend>Boat</legend>
                                                  
                                                        <div className="row">
                                                            {/* <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                  <div className="text-field">
                    <input type="text" name='BoatIDNumber' id='BoatIDNumber' value={value?.BoatIDNumber} onChange={HandleChanges} className='' required />
                    <label htmlFor="">Boat Id</label>
                  </div>
                </div> */}

                                                            {/* <input type="text" maxLength={4} name='ManufactureYear' value={value?.ManufactureYear} id='ManufactureYear' onChange={HandleChanges} className='' required /> */}
                                                            <div className="col-4 col-md-4 col-lg-3 ">
                                                                <div className="dropdown__box">
                                                                    <DatePicker
                                                                        name='ManufactureYear'
                                                                        id='ManufactureYear'
                                                                        selected={manufactureDate}
                                                                        onChange={(date) => { setManufactureDate(date); setValue({ ...value, ['ManufactureYear']: date ? getYearWithOutDateTime(date) : null }) }}
                                                                        showYearPicker
                                                                        dateFormat="yyyy"
                                                                        yearItemNumber={9}
                                                                        ref={startRef2}
                                                                        onKeyDown={onKeyDown}
                                                                        autoComplete="nope"
                                                                        showYearDropdown
                                                                        showMonthDropdown
                                                                        dropdownMode="select"
                                                                        maxDate={new Date()}
                                                                    />
                                                                    <label htmlFor="" className='pt-1'>Manufacture Year</label>
                                                                </div>
                                                            </div>


                                                            <div className="col-3  col-md-2 col-lg-3   pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='Length' id='Length' value={value?.Length} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Length</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3 col-md-4 col-lg-3 pt-1">
                                                                <div className=" dropdown__box">
                                                                    <Select
                                                                        name='RegistrationStateID'
                                                                        styles={customStylesWithOutColor}
                                                                        value={registratonStateDrp?.filter((obj) => obj.value === value?.RegistrationStateID)}
                                                                        options={registratonStateDrp}
                                                                        onChange={(e) => ChangeDropDown(e, 'RegistrationStateID')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label>Registration State</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3  col-md-3 col-lg-3 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='RegistrationNumber' id='RegistrationNumber' value={value?.RegistrationNumber} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">Registration No.</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3 col-md-4 col-lg-3 mt-1">
                                                                <div className=" dropdown__box">
                                                                    <Select
                                                                        name='VODID'
                                                                        value={VODIDData?.filter((obj) => obj.value === value?.VODID)}
                                                                        styles={customStylesWithOutColor}
                                                                        options={VODIDData}
                                                                        onChange={(e) => ChangeDropDown(e, 'VODID')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label>VOD</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3 col-md-5 col-lg-3 mt-1">
                                                                <div className=" dropdown__box">
                                                                    <Select
                                                                        name='MaterialID'
                                                                        value={materialDrp?.filter((obj) => obj.value === value?.MaterialID)}
                                                                        options={materialDrp}
                                                                        styles={customStylesWithOutColor}
                                                                        onChange={(e) => ChangeDropDown(e, 'MaterialID')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label>Material</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3 col-md-6 col-lg-3 mt-1">
                                                                <div className=" dropdown__box">
                                                                    <Select
                                                                        name='MakeID'
                                                                        value={makeIdDrp?.filter((obj) => obj.value === value?.MakeID)}
                                                                        styles={customStylesWithOutColor}
                                                                        options={makeIdDrp}
                                                                        onChange={(e) => ChangeDropDown(e, 'MakeID')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label>Make</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3 col-md-6 col-lg-3 mt-1">
                                                                <div className=" dropdown__box">
                                                                    <Select
                                                                        name='ModelID'
                                                                        value={boatModelDrp?.filter((obj) => obj.value === value?.ModelID)}
                                                                        styles={customStylesWithOutColor}
                                                                        options={boatModelDrp}
                                                                        onChange={(e) => ChangeDropDown(e, 'ModelID')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label>Model Id</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-9  col-md-12 col-lg-6 mt-1">
                                                                <div className=" dropdown__box">
                                                                    <textarea name='Comments' id="Comments" value={value?.Comments} onChange={HandleChanges} cols="30" rows='1' className="form-control" >
                                                                    </textarea>
                                                                    <label htmlFor="">Comments</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                                                                <div className="text-field">
                                                                    <input type="text" name='HIN' value={value?.HIN} onChange={HandleChanges} className='' required />
                                                                    <label htmlFor="">HIN</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-5 col-md-6 col-lg-3 mt-3 date__box">
                                                                <DatePicker
                                                                    id='RegistrationExpiryDtTm'
                                                                    name='RegistrationExpiryDtTm'
                                                                    ref={startRef1}
                                                                    onKeyDown={onKeyDown}
                                                                    onChange={(date) => { setRegistrationExpDate(date); setValue({ ...value, ['RegistrationExpiryDtTm']: date ? getShowingWithOutTime(date) : null }) }}
                                                                    className=''
                                                                    dateFormat="MM/yyyy"
                                                                    timeInputLabel
                                                                    // showTimeInput
                                                                    isClearable={value?.RegistrationExpiryDtTm ? true : false}
                                                                    selected={registrationExpDate}
                                                                    placeholderText={value?.RegistrationExpiryDtTm ? value.RegistrationExpiryDtTm : 'Select...'}
                                                                    // showTimeSelec
                                                                    timeIntervals={1}
                                                                    timeCaption="Time"
                                                                    autoComplete="Off"
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    showMonthYearPicker
                                                                    dropdownMode="select"
                                                                />
                                                                <label htmlFor="">Reg. Expiry</label>
                                                            </div>
                                                            <div className="col-4 col-md-6 col-lg-3 mt-1">
                                                                <div className=" dropdown__box">
                                                                    <Select
                                                                        name='BottomColorID'
                                                                        value={color?.filter((obj) => obj.value === value?.BottomColorID)}
                                                                        options={color}
                                                                        styles={customStylesWithOutColor}
                                                                        onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                        menuPlacement='top'
                                                                    />
                                                                    <label>Bottom Color</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-3 col-md-6 col-lg-3 mt-1">
                                                                <div className=" dropdown__box">
                                                                    <Select
                                                                        name='TopColorID'
                                                                        value={color?.filter((obj) => obj.value === value?.TopColorID)}
                                                                        options={color}
                                                                        styles={customStylesWithOutColor}
                                                                        onChange={(e) => ChangeDropDown(e, 'TopColorID')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                        menuPlacement='top'
                                                                    />
                                                                    <label>Top Color</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-5 col-md-6 col-lg-3 mt-1">
                                                                <div className=" dropdown__box">
                                                                    <Select
                                                                        name='PropulusionID'
                                                                        value={propulusionDrp?.filter((obj) => obj.value === value?.PropulusionID)}
                                                                        styles={customStylesWithOutColor}
                                                                        options={propulusionDrp}
                                                                        onChange={(e) => ChangeDropDown(e, 'PropulusionID')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                        menuPlacement='top'
                                                                    />
                                                                    <label>Propulusion</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <>
                                                </>
                                        }
                                        {/* drug */}
                                        {
                                            value.PropertyCategoryCode === 'D' ?
                                                <div className="col-12 col-md-12 pt-2 p-0" >
                                                    <fieldset className='fieldset'>
                                                        <legend>Drug</legend>
                                                        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                                                            <p className="p-0 m-0">Drug</p>
                                                            <div style={{ marginLeft: 'auto' }}>
                                                                {
                                                                    sessionStorage.getItem('PropertyID') || sessionStorage.getItem('MasterPropertyID') ?
                                                                        <button to="" className="btn btn-sm bg-green text-white px-2 py-0" onClick={setStatusFalse} data-toggle="modal" data-target="#DrugModal">
                                                                            <i className="fa fa-plus"></i>
                                                                        </button>
                                                                        :
                                                                        <>
                                                                        </>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="row ">
                                                            <div className="col-12">
                                                                {
                                                                    Drugloder ?
                                                                        <DataTable
                                                                            dense
                                                                            columns={columns}
                                                                            data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? drugData : '' : drugData}
                                                                            pagination
                                                                            paginationPerPage={'5'}
                                                                            paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                                                            highlightOnHover
                                                                            noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                                                        />
                                                                        :
                                                                        <Loader />
                                                                }
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <>
                                                </>
                                        }
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
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="btn-box text-right  mr-1 mb-2">
                            {/* <Link to={'/property-search'}> */}
                            <button type="button" class="btn btn-sm btn-success mr-1" onClick={() => { getPropertySearch(); }}>Search</button>
                            {/* </Link> */}
                            <Link to={'/Search'}>
                                <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" onClick={() => { Reset(); setAdvancedSearch(false) }}>Close</button>
                            </Link>
                        </div>
                    </div>



                </div>
            </div>
        </>
    )
}

export default PropertySearchPage