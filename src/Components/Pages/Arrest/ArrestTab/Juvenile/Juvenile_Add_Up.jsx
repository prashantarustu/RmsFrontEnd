import React, { useCallback, useContext, useState } from 'react'
import { useEffect } from 'react';
import Select from "react-select";
import { Decrypt_Id_Name, getShowingWithOutTime } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { RequiredField, RequiredFieldIncident, Space_Allow_with_Trim } from '../../../Utility/Personnel/Validation';
import { PhoneField, PhoneFieldNotReq } from '../../../Agency/AgencyValidation/validators';
import DatePicker from "react-datepicker";
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Juvenile_Add_Up = (props) => {

    const { get_Arrest_Count } = useContext(AgencyContext)
    const { ArrestJuvenileID, status, setStatus, modal, setModal, get_Data_Juvenile, updateStatus, LoginPinID, ArrestID, LoginAgencyID, } = props

    const [Editval, setEditval] = useState();
    const [headOfAgency, setHeadOfAgency] = useState([]);
    const [ParentContactDtTm, setParentContactDtTm] = useState();

    const [value, setValue] = useState({
        'ParentContactDtTm': '', 'ContactByID': '', 'ParentAddress': '', 'ParentName': '', 'ParentPhone': "", 'ArrestID': ArrestID,
        'CreatedByUserFK': LoginPinID,
    })

    const [errors, setErrors] = useState({
        'ParentContactDtTmErrors': '', 'ContactByIDErrors': '', 'ParentPhoneErrors': '',
        'ParentAddressErrors': '',
    })

    useEffect(() => {
        if (ArrestID) setValue(pre => { return { ...pre, 'ArrestID': ArrestID, 'CreatedByUserFK': LoginPinID, } })
    }, [ArrestID, updateStatus]);

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.ParentContactDtTm)) {
            setErrors(prevValues => { return { ...prevValues, ['ParentContactDtTmErrors']: RequiredFieldIncident(value.ParentContactDtTm) } })
        }
        if (RequiredFieldIncident(value.ContactByID)) {
            setErrors(prevValues => { return { ...prevValues, ['ContactByIDErrors']: RequiredFieldIncident(value.ContactByID) } })
        }
        if (PhoneField(value.ParentPhone)) {
            setErrors(prevValues => { return { ...prevValues, ['ParentPhoneErrors']: PhoneField(value.ParentPhone) } })
        }
    }
    // Check All Field Format is True Then Submit 
    const { ParentContactDtTmErrors, ContactByIDErrors, ParentPhoneErrors } = errors

    useEffect(() => {
        if (ParentContactDtTmErrors === 'true' && ContactByIDErrors === 'true' && ParentPhoneErrors === 'true') {
            if (status) update_Juvenile()
            else Add_Type()
        }
    }, [ParentContactDtTmErrors, ContactByIDErrors, ParentPhoneErrors])

    useEffect(() => {
        if (ArrestJuvenileID) {
            GetSingleData()
        }
    }, [ArrestJuvenileID, updateStatus])

    const GetSingleData = () => {
        const val = { 'ArrestJuvenileID': ArrestJuvenileID, }
        fetchPostData('ArrestJuvenile/GetSingleData_ArrestJuvenile', val)
            .then((res) => {
                // console.log(res)
                if (res) {
                    setEditval(res);
                } else { setEditval([]) }
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'ArrestJuvenileID': Editval[0]?.ArrestJuvenileID,
                'ParentContactDtTm': Editval[0].ParentContactDtTm ? getShowingWithOutTime(Editval[0].ParentContactDtTm) : '',
                'ParentAddress': Editval[0]?.ParentAddress ? Editval[0]?.ParentAddress.trim() : '',
                'ContactByID': Editval[0]?.ContactByID,
                'ParentName': Editval[0]?.ParentName,
                'ParentPhone': Editval[0]?.ParentPhone,
                'ModifiedByUserFK': LoginPinID,
            })
            setParentContactDtTm(Editval[0]?.ParentContactDtTm ? new Date(Editval[0]?.ParentContactDtTm) : '');
        } else {
            setValue({
                ...value,
                'ParentContactDtTm': '', ' ContactByID': '', 'ParentAddress': '', 'ParentName': '',
            })
        }
    }, [Editval])

    useEffect(() => {
        if (LoginAgencyID) {
            Get_ContactByID(LoginAgencyID);
        }
    }, [LoginAgencyID])

    const Get_ContactByID = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setHeadOfAgency(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            }
            else {
                setHeadOfAgency([])
            }
        })
    };

    const handleChange = (e) => {
        if (e.target.name === 'ParentPhone') {
            var ele = e.target.value.replace(/[^0-9\s]/g, "")
            if (ele.length === 10) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                    });
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/[^0-9\s]/g, "");
                setValue({
                    ...value,
                    [e.target.name]: ele
                });
            }
        }
        else {
            setValue({
                ...value,
                [e.target.name]: e.target.value,
            });
        }
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

    const Add_Type = () => {
        // toastifySuccess("SAvE")
        AddDeleteUpadate('ArrestJuvenile/Insert_ArrestJuvenile', value).then((res) => {
            get_Data_Juvenile(ArrestID);
            get_Arrest_Count(ArrestID)
            setModal(false);
            setStatus(false)
            reset()
            toastifySuccess(res.Message)
        })
        // setErrors({ ...errors, 'ParentContactDtTmErrors': '', });
    }

    const update_Juvenile = () => {
        AddDeleteUpadate('ArrestJuvenile/Update_ArrestJuvenile', value).then((res) => {
            get_Data_Juvenile(ArrestID);
            setModal(false);
            setStatus(false)
            toastifySuccess(res.Message)
            reset();
        })
    }

    const closeModal = () => {
        reset();
        setModal(false);
    }

    const reset = (e) => {
        setValue({
            ...value,
            'ParentContactDtTm': '', 'ContactByID': '', 'ParentAddress': '', 'ParentName': '', 'ParentPhone': "",
        }); setParentContactDtTm('');
        setErrors({
            ...errors, 'ParentContactDtTmErrors': '', 'ContactByIDErrors': '', 'ParentPhoneErrors': '',
            // 'ParentAddressErrors': '',
        });
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

    const startRef = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };

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
                                                <legend style={{ fontWeight: 'bold' }}>Juvenile</legend>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div className="col-6  col-md-6 col-lg-6 " >
                                                                <div className="text-field">
                                                                    <input type="text" className='ParentName' name='ParentName' value={value?.ParentName} onChange={handleChange} />
                                                                    <label htmlFor="">Parent Name</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-6  col-md-6 col-lg-6 " >
                                                                <div className="text-field">
                                                                    <input type="text" className='ParentPhone requiredColor' name='ParentPhone' maxLength={12} value={value?.ParentPhone} onChange={handleChange} />
                                                                    <label htmlFor="">Parent Phone</label>
                                                                    {errors.ParentPhoneErrors !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ParentPhoneErrors}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 col-lg-6 dropdown__box">
                                                                <DatePicker
                                                                    ref={startRef}
                                                                    onKeyDown={onKeyDown}
                                                                    id='ParentContactDtTm'
                                                                    name='ParentContactDtTm'
                                                                    className='requiredColor' dateFormat="MM/dd/yyyy"
                                                                    onChange={(date) => { setParentContactDtTm(date); setValue({ ...value, ['ParentContactDtTm']: date ? getShowingWithOutTime(date) : null }) }}
                                                                    selected={ParentContactDtTm}
                                                                    isClearable={value?.ParentContactDtTm ? true : false}
                                                                    placeholderText={value?.ParentContactDtTm ? value?.ParentContactDtTm : 'Select...'}
                                                                    timeIntervals={1}
                                                                    maxDate={new Date()}
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                    autoComplete='Off'
                                                                />
                                                                <label htmlFor="" className='pt-1'>Parent Contact Date</label>
                                                                {errors.ParentContactDtTmErrors !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ParentContactDtTmErrors}</span>
                                                                ) : null}
                                                            </div>
                                                            <div class="col-6 col-md-6 pt-1 mb-1 col-lg-6  dropdown__box">
                                                                <Select
                                                                    // name='ContactByID'
                                                                    name='ContactByID'
                                                                    value={headOfAgency?.filter((obj) => obj.value === value?.ContactByID)}
                                                                    options={headOfAgency}
                                                                    styles={colourStyles}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                    onChange={(e) => { ChangeDropDown(e, 'ContactByID') }}
                                                                />
                                                                <label htmlFor='' className='mt-1'>Contacted By</label>
                                                                {errors.ContactByIDErrors !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ContactByIDErrors}</span>
                                                                ) : null}
                                                            </div>
                                                            <div className="col-12  col-md-12 col-lg-12 mt-5 pt-1 dropdown__box" style={{ marginTop: '20px' }}>
                                                                <textarea name='ParentAddress' id="ParentAddress" value={value?.ParentAddress} onChange={handleChange} cols="30" rows='3' className="form-control pt-2 pb-2 " ></textarea>
                                                                <label htmlFor="address" className='pt-1'>Parent Address</label>
                                                                {/* {errors.ParentAddressError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ParentAddressError}</span>
                                                                ) : null} */}
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
                                                <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-1">Update</button>
                                                :
                                                <button type="button" onClick={() => check_Validation_Error()} class="btn btn-sm btn-success mr-1">Save</button>
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

export default Juvenile_Add_Up