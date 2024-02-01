import React, { useCallback, useState } from 'react'
import { Decrypt_Id_Name, getShowingMonthDateYear } from '../../../../Common/Utility';
import DatePicker from "react-datepicker";
import { Link, useLocation } from 'react-router-dom';
import Location from '../../../../Location/Location';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { useEffect } from 'react';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import AddressVerify from './AddressVerify';

const Address_Add_Up = (props) => {

    const { get_Name_Count } = useContext(AgencyContext);

    const { nameID, MasterNameID, LoginPinID, LoginAgencyID, modal, status, setModal, NameAddressID, setAddID, updateStatus, setUpdateStatus, Get_ContactDetailsData } = props

    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');
    const [Editval, setEditval] = useState([]);
    const [modalStatus, setModalStatus] = useState(false);
    const [locationStatus, setlocationStatus] = useState(false);
    const [addVerifySingleData, setVerifySingleData] = useState([]);
    const [AgencyName, setAgencyName] = useState('');

    const [value, setValue] = useState({
        DateFrom: '',
        DateTo: '',
        Address: '',
        IsVerify: true,
        IsCurrent: '',
        AddressFlags: '',
        NameAddressID: '',
        NameID: '',
        MasterNameID: '',
        LocationID: '',
        CreatedByUserFK: '',
        ModifiedByUserFK: '',
        // Incident Location Field/
        DirectionPrefix: '',
        Street: '',
        DirectionSufix: '',
        TypeSufix: '',
        City: '',
        State: '',
        ZipCode: '',
        PremiseNo: '',
        ApartmentNo: '',
        CommonPlace: '',
        ApartmentType: '',
        Street_Parse: '',
        PremiseNo_Parse: '',
        DirectionPrefix_Parse: '',
        TypeSuffix_Parse: '',
        DirectionSuffix_Parse: '',
        ZipCodeID: '',
        CityID: '',
        IsUsLocation: '',
        CountryID: '',
        Country: '',
        point_of_interest: '',
        neighborhood: '',
        subpremise: '',
        premise: '',
        CreatedByUserFK: '',
        ModifiedByUserFK: '',
    })

    const [errors, setErrors] = useState({
        'AddressError': '', 'DateFromError': '',
    })

    useEffect(() => {
        setValue(pre => { return { ...pre, 'CreatedByUserFK': LoginPinID, 'MasterNameID': MasterNameID, 'NameID': nameID, 'IsVerify': true, AddressFlags: 'Permanent', } });
    }, [nameID, MasterNameID, updateStatus]);

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.Address)) {
            setErrors(prevValues => { return { ...prevValues, ['AddressError']: RequiredFieldIncident(value.Address) } })
        }
        if (RequiredFieldIncident(value.DateFrom)) {
            setErrors(prevValues => { return { ...prevValues, ['DateFromError']: RequiredFieldIncident(value.DateFrom) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { AddressError, DateFromError } = errors

    useEffect(() => {
        if (AddressError === 'true' && DateFromError === 'true') {
            if (NameAddressID) { update_Addresss() }
            else { Add_Address() }
        }
    }, [AddressError, DateFromError])

    useEffect(() => {
        if (NameAddressID) { GetSingleData(NameAddressID) }
    }, [updateStatus]);

    const GetSingleData = (NameAddressID) => {
        const val = { 'NameAddressID': NameAddressID }
        fetchPostData('NameAddress/GetSingleData_NameAddress', val)
            .then((res) => {
                if (res) {
                    // console.log(res);
                    setEditval(res);
                }
                else { setEditval([]) }
            })
    }

    useEffect(() => {
        if (Editval) {
            console.log(Editval[0])
            setValue({
                ...value,
                DateFrom: Editval[0]?.DateFrom,
                Address: Editval[0]?.Address,
                IsVerify: Editval[0]?.IsVerify,
                LocationID: Editval[0]?.LocationID,
                IsCurrent: Editval[0]?.IsCurrent,
                AddressFlags: Editval[0]?.AddressFlags,
                NameAddressID: Editval[0]?.NameAddressID,
                ModifiedByUserFK: LoginPinID,
            });
            if (!Editval[0]?.IsVerify && parseInt(Editval[0]?.LocationID)) {
                get_Add_Single_Data(Editval[0]?.LocationID);
                // console.log(!editval[0]?.IsVerify)
            } else {
                // get_Add_Single_Data(0);
            }
        } else {
            // alert('Calll')
            setValue({
                ...value,
                DateFrom: '',
                Address: '',
                IsCurrent: '',
                LocationID: '',
                AddressFlags: 'Permanent',
                NameAddressID: '',
            })
        }
    }, [Editval])

    // <<<<<<<<<<<<<<<<<<<<<<<-------OnChanges------------->>>>>>>>>>>>>>>>
    const handleChange = (e) => {
        if (e.target.name === 'IsVerify' || e.target.name === 'IsCurrent') {
            if (e.target.name === 'IsVerify') {
                if (e.target.checked && addVerifySingleData.length > 0) {
                    setModalStatus(false);
                    setlocationStatus(true); setVerifySingleData([]);
                    setValue(pre => { return { ...pre, ['Address']: '', [e.target.name]: e.target.checked, } });
                } else {
                    setValue(pre => { return { ...pre, [e.target.name]: e.target.checked, } });
                    setModalStatus(true);
                    setlocationStatus(false);
                    setVerifySingleData([]);
                }
            } else {
                setValue({
                    ...value,
                    [e.target.name]: e.target.checked,
                })
            }
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const reset = () => {
        setValue({
            ...value,
            Address: '',
            DateFrom: '',
            IsVerify: true,
            IsCurrent: '',
            AddressFlags: 'Permanent',
        });
        setErrors({
            ...errors,
            'AddressError': '', 'DateFromError': "",
        });
    }

    const Cancel = () => {
        reset();
        setModal(false);

    }
    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            reset();
            setModal(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);
    // <<<<<<<<<<<<<<<<<<<<<<<-------Add-Del-Update------------->>>>>>>>>>>>
    const Add_Address = (e) => {
        AddDeleteUpadate('NameAddress/Insert_NameAddress', value).then((res) => {
            if (res.success) {
                get_Name_Count(nameID);
                Get_ContactDetailsData(nameID, MasterNameID);
                setModal(false);
                toastifySuccess(res.Message);
                reset();
                setErrors({ ...errors, ['DateFromError']: '', });

            }
        })
    }

    const update_Addresss = () => {
        AddDeleteUpadate('NameAddress/Update_NameAddress', value).then((res) => {
            Get_ContactDetailsData(nameID, MasterNameID);
            setModal(false);
            reset();
            toastifySuccess(res.Message);
            setErrors({ ...errors, ['DateFromError']: '', });
        })
    }

    const get_Add_Single_Data = (LocationID) => {
        const val = {
            'LocationID': LocationID,
        }
        // console.log(val)
        fetchPostData('MasterLocation/GetSingleData_MasterLocation', val).then((res) => {
            if (res.length > 0) {
                // console.log(res)
                setVerifySingleData(res)
            } else {
                setVerifySingleData([])
            }
        })
    }

    const startRef = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    }
    console.log(value?.Address)
    // todo for enable date to column
    const myFunction = () => {
        var checkBox = document.getElementById("IsCurrent");
        var text = document.getElementById("text");
        if (checkBox.checked !== true) {
            text.style.display = "block";
        } else {
            text.style.display = "none";
        }
    }
    return (
        <>
            {
                modal ?
                    <>
                        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="AddressModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <div className="m-1 ">
                                            <fieldset style={{ border: '1px solid gray' }}>
                                                <legend style={{ fontWeight: 'bold' }}>Address</legend>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div className="col-7 col-md-7 col-lg-7 mt-2">
                                                                <div class="text-field">
                                                                    <Location {...{ value, setValue, locationStatus, setlocationStatus }} col='Address' locationID='LocationID' check={true} verify={value.IsVerify} />
                                                                    <label htmlFor="" className='pl-1'>Address</label>
                                                                    {errors.AddressError !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AddressError}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="col-5 col-md-5 col-lg-3 mt-3 pt-2">
                                                                <div class="form-check ">
                                                                    <input class="form-check-input" data-toggle="modal" data-target="#AddressVerifyModal" type="checkbox" name='IsVerify'
                                                                        // checked={value.IsVerify || value.crimelocationid === 0 && true}
                                                                        checked={value.IsVerify}
                                                                        value={value?.IsVerify} onChange={handleChange} id="flexCheckDefault" style={{ cursor: 'pointer' }} />
                                                                    <label class="form-check-label mr-2" for="flexCheckDefault">
                                                                        Verify
                                                                    </label>
                                                                    {
                                                                        value?.IsVerify === false && addVerifySingleData.length > 0 ?
                                                                            <>
                                                                                <i className="fa fa-edit " onClick={() => { if (value.LocationID) { get_Add_Single_Data(value.LocationID); setModalStatus(true); } }} data-toggle="modal" data-target="#AddressVerifyModal" style={{ cursor: 'pointer', backgroundColor: '' }} > Edit </i>
                                                                            </>
                                                                            :
                                                                            <>
                                                                            </>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 mt-lg-4 mt-md-2">
                                                                <div class="form-check ">
                                                                    <input class="form-check-input" type="checkbox" name='IsCurrent' checked={value.IsCurrent} value={value.IsCurrent} onChange={handleChange} id="IsCurrent" onClick={myFunction} />
                                                                    <label class="form-check-label" for="flexCheckDefault1">
                                                                        Current
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="form-check mt-2 pl-4  col-4   col-md-4 col-lg-2">
                                                                {
                                                                    value?.AddressFlags === "Permanent" ?
                                                                        <>
                                                                            <input className="form-check-input mt-1" type="radio" onChange={handleChange} value="Permanent" checked={value.AddressFlags} name="AddressFlags" id="flexRadioDefault2" />
                                                                        </>
                                                                        :
                                                                        <input className="form-check-input mt-1" type="radio" onChange={handleChange} value="Permanent" name="AddressFlags" id="flexRadioDefault2" />
                                                                }
                                                                {/* <input className="form-check-input" type="radio" name="AddressFlags" id="flexRadioDefault2" /> */}
                                                                <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                                    Permanent
                                                                </label>
                                                            </div>
                                                            <div className="form-check mt-2 pl-4 col-3 col-md-4 col-lg-2">
                                                                {
                                                                    value?.AddressFlags === "Temporary" ?
                                                                        <>
                                                                            <input className="form-check-input mt-1" type="radio" onChange={handleChange} value="Temporary" checked={value.AddressFlags} name="AddressFlags" id="flexRadioDefault3" />
                                                                        </>
                                                                        :
                                                                        <input className="form-check-input mt-1" type="radio" onChange={handleChange} value="Temporary" name="AddressFlags" id="flexRadioDefault3" />
                                                                }
                                                                {/* <input className="form-check-input" type="radio" name="AddressFlags" id="flexRadioDefault3" /> */}
                                                                <label className="form-check-label" htmlFor="flexRadioDefault3">
                                                                    Temporary
                                                                </label>
                                                            </div>
                                                            <div className="form-check mt-2 pl-4  col-3 col-md-4 col-lg-2">
                                                                {
                                                                    value?.AddressFlags === "Frequent" ?
                                                                        <>
                                                                            <input className="form-check-input mt-1" type="radio" onChange={handleChange} value="Frequent" checked={value.AddressFlags} name="AddressFlags" id="flexRadioDefault4" />
                                                                        </>
                                                                        :
                                                                        <input className="form-check-input mt-1" type="radio" onChange={handleChange} value="Frequent" name="AddressFlags" id="flexRadioDefault4" />
                                                                }
                                                                {/* <input className="form-check-input" type="radio" name="AddressFlags" id="flexRadioDefault4" /> */}
                                                                <label className="form-check-label" htmlFor="flexRadioDefault4">
                                                                    Frequent
                                                                </label>
                                                            </div>
                                                            <div className="form-check mt-2 pl-4 col-2 col-md-4 col-lg-2">
                                                                {
                                                                    value?.AddressFlags === "Old" ?
                                                                        <>
                                                                            <input className="form-check-input mt-1" type="radio" onChange={handleChange} value="Old" checked={value.AddressFlags} name="AddressFlags" id="flexRadioDefault5" />
                                                                        </>
                                                                        :
                                                                        <input className="form-check-input mt-1" type="radio" onChange={handleChange} value="Old" name="AddressFlags" id="flexRadioDefault5" />
                                                                }
                                                                {/* <input className="form-check-input" type="radio" name="AddressFlags" id="flexRadioDefault5" /> */}
                                                                <label className="form-check-label" htmlFor="flexRadioDefault5">
                                                                    Old
                                                                </label>
                                                            </div>
                                                            <div className="form-check mt-2 pl-4 col-4 col-md-4 col-lg-2">
                                                                {
                                                                    value?.AddressFlags === "Alternate" ?
                                                                        <>
                                                                            <input className="form-check-input mt-1" type="radio" onChange={handleChange} value="Alternate" checked={value.AddressFlags} name="AddressFlags" id="flexRadioDefault6" />
                                                                        </>
                                                                        :
                                                                        <input className="form-check-input mt-1" type="radio" onChange={handleChange} value="Alternate" name="AddressFlags" id="flexRadioDefault6" />
                                                                }
                                                                {/* <input className="form-check-input" type="radio" name="AddressFlags" id="flexRadioDefault6" /> */}
                                                                <label className="form-check-label" htmlFor="flexRadioDefault6">
                                                                    Alternate
                                                                </label>
                                                            </div>
                                                            <div className="col-8 col-md-4 col-lg-5 mt-1 ">
                                                                <div className="date__box">
                                                                    <DatePicker
                                                                        id='DateFrom'
                                                                        name='DateFrom'
                                                                        ref={startRef}
                                                                        onKeyDown={onKeyDown}
                                                                        onChange={(date) => { setValue({ ...value, ['DateFrom']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                        className='requiredColor'
                                                                        dateFormat="MM/dd/yyyy"
                                                                        isClearable={value?.DateFrom ? true : false}
                                                                        selected={value?.DateFrom && new Date(value?.DateFrom)}
                                                                        placeholderText={'Select...'}
                                                                        showYearDropdown
                                                                        showMonthDropdown
                                                                        dropdownMode="select"
                                                                        autoComplete='Off'
                                                                        maxDate={new Date()}
                                                                    // timeInputLabel
                                                                    // showTimeSelect
                                                                    // timeIntervals={1}
                                                                    // timeCaption="Time"
                                                                    />
                                                                    <label htmlFor="" className='p-0'>Date From</label>
                                                                    {errors.DateFromError !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DateFromError}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="col-8 col-md-4 col-lg-5 mt-1 " id="text" style={{ display: 'none' }}>
                                                                <div className="date__box">
                                                                    <DatePicker
                                                                        id='DateTo'
                                                                        name='DateTo'
                                                                        ref={startRef}
                                                                        onKeyDown={onKeyDown}
                                                                        onChange={(date) => { setValue({ ...value, ['DateTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                        className='requiredColor'
                                                                        dateFormat="MM/dd/yyyy"
                                                                        isClearable={value?.DateTo ? true : false}
                                                                        selected={value?.DateTo && new Date(value?.DateTo)}
                                                                        placeholderText={'Select...'}
                                                                        showYearDropdown
                                                                        showMonthDropdown
                                                                        dropdownMode="select"
                                                                        autoComplete='Off'
                                                                        minDate={new Date(value?.DateFrom)}

                                                                    // maxDate={new Date()}
                                                                    />
                                                                    <label htmlFor="" className='p-0'>Date To</label>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                    <div className="btn-box text-right  mr-1 mb-2">
                                        {
                                            status ?
                                                <button type="button" class="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error(); }}>Update</button>
                                                :
                                                <button type="button" class="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error(); }}>Save</button>
                                        }
                                        <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" onClick={() => { Cancel() }} >Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <>
                    </>
            }
            <AddressVerify {...{ LoginAgencyID, LoginPinID, AgencyName, modalStatus, setModalStatus, value, setValue, addVerifySingleData, setVerifySingleData, get_Add_Single_Data }} />
        </>
    )
}

export default Address_Add_Up