import React, { useState } from 'react'
import { useEffect, useCallback } from 'react';
import Select from "react-select";
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { Decrypt_Id_Name, getShowingWithOutTime } from '../../../../Common/Utility';
import { fetchData, fetchPostData, AddDeleteUpadate } from '../../../../hooks/Api';
import DatePicker from "react-datepicker";
import { Comman_changeArrayFormat_With_Name } from '../../../../Common/ChangeArrayFormat';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { RequiredFieldSpaceNotAllow } from '../../../Agency/AgencyValidation/validators';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Identification_Add_Up = (props) => {

    const { nameID, MasterNameID, LoginPinID, LoginAgencyID, status, Get_IdentificationData, setModal, modal, IdentificationNumberID, updateStatus } = props
    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');
    const { get_Name_Count } = useContext(AgencyContext)

    const [identification, setIdentification] = useState([]);
    const [Editval, setEditval] = useState();
    const [IdentificationDate, setIdentificationDate] = useState();
    const [stateList, setStateList] = useState([]);
    const [CountryList, setCountryList] = useState([]);

    const [value, setValue] = useState({
        'IdentificationTypeID': '', 'StateID': "", 'CountryID': "", 'IdentificationNumber': '', 'IsCurrent': "", 'ExpiryDate': "", 'IdentificationNumberID': '',
        'NameID': '',
        'MasterNameID': '',
        'CreatedByUserFK': '',
    })

    const [errors, setErrors] = useState({
        'IdentificationTypeIDErrors': '', 'IdentificationNumberErrors': '',
    })

    useEffect(() => {
        setValue(pre => { return { ...pre, 'CreatedByUserFK': LoginPinID, 'MasterNameID': MasterNameID, 'NameID': nameID } });
    }, [nameID, MasterNameID,updateStatus]);

    useEffect(() => {
        if (IdentificationNumberID) {
            GetSingleData(IdentificationNumberID)
        }
    }, [IdentificationNumberID])

    const GetSingleData = () => {
        const val = { 'IdentificationNumberID': IdentificationNumberID }
        fetchPostData('NameIdentificationNumber/GetSingleData_NameIdentificationNumber', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            }
            )
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            reset()
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'IdentificationTypeID': Editval[0]?.IdentificationTypeID,
                'IdentificationNumberID': Editval[0]?.IdentificationNumberID,
                'IsCurrent': Editval[0]?.IsCurrent,
                'ExpiryDate': Editval[0]?.ExpiryDate ? getShowingWithOutTime(Editval[0]?.ExpiryDate) : '',
                "IdentificationNumber": Editval[0]?.IdentificationNumber,
                'StateID': Editval[0]?.StateID, 'CountryID': Editval[0]?.CountryID,
                'ModifiedByUserFK': LoginPinID,
            })
        }
        else {
            setValue({
                ...value,
                'IdentificationTypeID': '', 'IdentificationNumber': '', 'IsCurrent': "", 'StateID': "", 'CountryID': "", 'ExpiryDate': "", 'ModifiedByUserFK': '',
            })
        }
    }, [Editval])

    const reset = () => {
        setValue({
            ...value,
            'IdentificationTypeID': '', 'IdentificationNumber': '', 'IsCurrent': "", 'StateID': "", 'CountryID': "", 'ExpiryDate': "",
        });
        setIdentificationDate('')
        setErrors({
            'IdentificationTypeIDErrors': '', 'IdentificationNumberErrors': '',
        })
    }
    const check_Validation_Error = (e) => {
        if (RequiredFieldSpaceNotAllow(value.IdentificationNumber)) {
            setErrors(prevValues => { return { ...prevValues, ['IdentificationNumberErrors']: RequiredFieldSpaceNotAllow(value.IdentificationNumber) } })
        }
        if (RequiredFieldIncident(value.IdentificationTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['IdentificationTypeIDErrors']: RequiredFieldIncident(value.IdentificationTypeID) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { IdentificationNumberErrors, IdentificationTypeIDErrors } = errors

    useEffect(() => {
        if (IdentificationNumberErrors === 'true' && IdentificationTypeIDErrors === 'true') {
            if (status) update_Identification()
            else Add_Type()
        }
    }, [IdentificationNumberErrors, IdentificationTypeIDErrors])

    useEffect(() => {
        get_Identification(LoginAgencyID);
        getCountryID();
        getStateList();
    }, [LoginAgencyID])

    const get_Identification = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('IDTypes/GetDataDropDown_IDTypes', val).then((data) => {
            if (data) {
                setIdentification(Comman_changeArrayFormat(data, 'IDTypeID', 'Description'))
            } else {
                setIdentification([]);
            }
        })
    }

    const getStateList = async () => {
        fetchData("State_City_ZipCode/GetData_State").then((data) => {
            if (data) {
                setStateList(Comman_changeArrayFormat_With_Name(data, "StateID", "StateName", "StateID"));
            } else {
                setStateList([]);
            }
        });
    };

    const getCountryID = async () => {
        fetchData("State_City_ZipCode/GetData_Country").then((data) => {
            if (data) {
                setCountryList(Comman_changeArrayFormat_With_Name(data, "CountryID", "CountryName", "CountryID"));
            } else {
                setCountryList([]);
            }
        });
    };

    const selectHandleChange = (e) => {
        if (e) {
            setValue({
                ...value,
                [e.name]: e.value
            })
            if (e.name === 'StateID') {
            }
        } else {
            setValue({
                ...value,
                [e.name]: null
            })
        }
    }

    const handleChange = (e) => {
        if (e.target.name === "IsCurrent") {
            setValue({
                ...value,
                [e.target.name]: e.target.checked,
            });
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value,
            });
        }
    };

    const startRef = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };

    const Add_Type = () => {
        AddDeleteUpadate(openPage === 'mastername' ? 'MainMasterNameIdentificationNumber/Insert_MainMasterNameIdentificationNumber' : 'NameIdentificationNumber/Insert_NameIdentificationNumber', value)
            .then((res) => {
                Get_IdentificationData(nameID, MasterNameID);
                get_Name_Count(nameID);
                setModal(false)
                toastifySuccess(res.Message);
                reset();

            })
    }

    const update_Identification = () => {
        AddDeleteUpadate('NameIdentificationNumber/Update_NameIdentificationNumber', value).then((res) => {
            toastifySuccess(res.Message);
            setModal(false);
            Get_IdentificationData(nameID, MasterNameID)
            // reset();
        })
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({
                ...value,
                [name]: e.value
            })
        } else setValue({
            ...value,
            [name]: null
        })
    }

    const closeModal = () => {
        reset();
        setModal(false);
    }

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    return (
        <>
            {
                modal ?
                    <>
                        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="PinModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <div className="m-1 mt-3">
                                            <fieldset style={{ border: '1px solid gray' }}>
                                                <legend style={{ fontWeight: 'bold' }}>Identification</legend>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div class="col-12 col-md-12 col-lg-6 mt-1 ">
                                                                <div className="dropdown__box">
                                                                    <Select
                                                                        name='IdentificationTypeID'
                                                                        styles={colourStyles}
                                                                        value={identification?.filter((obj) => obj.value === value?.IdentificationTypeID)}
                                                                        isClearable
                                                                        options={identification}
                                                                        onChange={(e) => ChangeDropDown(e, 'IdentificationTypeID')}
                                                                        placeholder="Select..."
                                                                    />
                                                                    <label htmlFor=''>Identification Type</label>
                                                                    {errors.IdentificationTypeIDErrors !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.IdentificationTypeIDErrors}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-12 col-lg-6 mt-1">
                                                                <div class="text-field">
                                                                    <input type="text" value={value.IdentificationNumber} maxLength={25} onChange={handleChange} className='requiredColor' name='IdentificationNumber' required />
                                                                    <label>Identification Number</label>
                                                                    {errors.IdentificationNumberErrors !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.IdentificationNumberErrors}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            {/* <div className="col-12 col-md-12 col-lg-2 mt-3 pl-2">
                                                                <div class="form-check ">
                                                                    <input class="form-check-input" value={value?.IsCurrent}
                                                                        checked={value?.IsCurrent}
                                                                        onChange={handleChange} type="checkbox" name='IsCurrent' id="flexCheckDefault" />
                                                                    <label class="form-check-label" for="flexCheckDefault">
                                                                        Is Current
                                                                    </label>
                                                                </div>
                                                            </div> */}
                                                            <div className="col-12 col-md-12 col-lg-4 mt-1 ">
                                                                <div className="date__box">
                                                                    <DatePicker
                                                                        ref={startRef}
                                                                        onKeyDown={onKeyDown}
                                                                        id='ExpiryDate'
                                                                        name='ExpiryDate'
                                                                        // className='requiredColor'
                                                                        dateFormat="MM/dd/yyyy"
                                                                        onChange={(date) => { setIdentificationDate(date); setValue({ ...value, ['ExpiryDate']: date ? getShowingWithOutTime(date) : null }) }}
                                                                        showMonthDropdown
                                                                        isClearable={value?.ExpiryDate ? true : false}
                                                                        autoComplete="nope"
                                                                        showDisabledMonthNavigation
                                                                        dropdownMode="select"
                                                                        showYearDropdown
                                                                        placeholderText={value?.ExpiryDate ? value?.ExpiryDate : 'Select...'}
                                                                        selected={IdentificationDate}
                                                                    // minDate={new Date()}

                                                                    />
                                                                    <label htmlFor="">ID Expiry</label>
                                                                </div>

                                                            </div>
                                                            <div className="col-12 col-md-12 col-lg-4 mt-2">
                                                                <div className="dropdown__box">
                                                                    <Select
                                                                        name="CountryID"
                                                                        value={CountryList?.filter((obj) => obj.value === value?.CountryID)}
                                                                        isClearable
                                                                        options={CountryList}
                                                                        onChange={selectHandleChange}
                                                                        placeholder="Select..."
                                                                        styles={customStylesWithOutColor}
                                                                    />
                                                                    <label htmlFor="">Country</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-12 col-md-12 col-lg-4 mt-2">
                                                                <div className="dropdown__box">
                                                                    <Select
                                                                        name="StateID"
                                                                        value={stateList?.filter((obj) => obj.value === value?.StateID)}
                                                                        isClearable
                                                                        options={stateList}
                                                                        onChange={selectHandleChange}
                                                                        placeholder="Select..."
                                                                        styles={customStylesWithOutColor}
                                                                    />
                                                                    <label htmlFor="">State</label>
                                                                </div>
                                                            </div>


                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                    <div className="btn-box text-right mt-3 mr-1 mb-2">
                                        {
                                            status ?
                                                <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Update</button>
                                                :
                                                <button type="button" onClick={(e) => { check_Validation_Error(); }} class="btn btn-sm btn-success mr-1">Save</button>
                                        }
                                        <button type="button" data-dismiss="modal" onClick={closeModal} class="btn btn-sm btn-success mr-1" >Close</button>
                                    </div>
                                </div>
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

export default Identification_Add_Up

