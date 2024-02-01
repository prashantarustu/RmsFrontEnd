import React, { useCallback, useContext, useState } from 'react'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { colourStyles, customStylesWithOutColor, getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { useEffect } from 'react';
import { Comman_changeArrayFormat, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { RequiredFieldIncident, SpaceCheck, Space_Allow_with_Trim } from '../../../Utility/Personnel/Validation';

const Clearance_Add_Up = (props) => {

    const { upDateCount, WarrantServiceID, status, modal, setModal, LoginPinID, LoginAgencyID, WarrantID, MainIncidentID, get_WarrantService } = props
    const { get_Warrent_Count } = useContext(AgencyContext)
    const [headOfAgency, setHeadOfAgency] = useState([])
    const [Editval, setEditval] = useState();
    const [ServiceAttemptedDate, setServiceAttemptedDate] = useState();
    const [NextAttemptedDate, setNextAttemptedDate] = useState();

    const [value, setValue] = useState({
        'WarrantID': '',
        'NextAttemptDtTm': '',
        'ServiceAttemptDtTm': '',
        'OfficerID': '',
        'Remarks': '',
        'CreatedByUserFK': '',
    });

    const [errors, setErrors] = useState({
        'OfficerIDError': '', 'RemarksError': '',
    })

    useEffect(() => {
        if (WarrantID) {
            setValue(pre => { return { ...pre, 'WarrantID': WarrantID, 'CreatedByUserFK': LoginPinID, } })
        }
    }, [WarrantID, upDateCount]);


    useEffect(() => {
        if (WarrantServiceID && status) {
            GetSingleData(WarrantServiceID)
        }
    }, [WarrantServiceID, upDateCount])

    const GetSingleData = (WarrantServiceID) => {
        const val = { 'WarrantServiceID': WarrantServiceID }
        fetchPostData('WarrantService/GetSingleData_WarrantService', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    const check_Validation_Error = (e) => {
        console.log(value)

        if (RequiredFieldIncident(value.OfficerID)) {
            setErrors(prevValues => { return { ...prevValues, ['OfficerIDError']: RequiredFieldIncident(value.OfficerID) } })
        }
        if (SpaceCheck(value.Remarks)) {
            setErrors(prevValues => { return { ...prevValues, ['RemarksError']: SpaceCheck(value.Remarks) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { OfficerIDError, RemarksError } = errors

    useEffect(() => {
        if (OfficerIDError === 'true' && RemarksError === 'true') {
            if (status) updateWarrantService();
            else submit()
        }
    }, [OfficerIDError, RemarksError])

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
                'WarrantServiceID': WarrantServiceID,
                'ServiceAttemptDtTm': Editval[0].ServiceAttemptDtTm ? getShowingDateText(Editval[0].ServiceAttemptDtTm) : '',
                'NextAttemptDtTm': Editval[0].NextAttemptDtTm ? getShowingDateText(Editval[0].NextAttemptDtTm) : '',
                'OfficerID': Editval[0].OfficerID,
                'Remarks': Editval[0].Remarks,
                'ModifiedByUserFK': LoginPinID,
            })
        } else {
            setValue({
                ...value,
                'WarrantID': '', 'NextAttemptDtTm': '', 'ServiceAttemptDtTm': '', 'OfficerID': '', 'Remarks': '',
            });
        }
    }, [Editval])

    const reset = (e) => {
        setValue({
            ...value, 'WarrantID': '', 'NextAttemptDtTm': '', 'ServiceAttemptDtTm': '', 'OfficerID': '', 'Remarks': '',
        }); setNextAttemptedDate(''); setServiceAttemptedDate('')
        setErrors({
            ...errors,
            'OfficerIDError': '', 'RemarksError': '',
        });

    }

    useEffect(() => {
        Get_Officer_Name(LoginAgencyID)
    }, [LoginAgencyID])

    const Get_Officer_Name = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then(res => {
            if (res) {
                setHeadOfAgency(Comman_changeArrayFormat(res, 'PINID', 'HeadOfAgency'))
            } else setHeadOfAgency([])
        })
    };


    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({
                ...value, [name]: e.value
            })
        } else {
            setValue({
                ...value, [name]: null
            })
        }
    }

    const HandleChange = (e) => {
        if (e) {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.null
            })
        }
    }

    const submit = () => {
        AddDeleteUpadate('WarrantService/Insert_WarrantService', value)
            .then((res) => {
                toastifySuccess(res.Message);
                setModal(false)
                get_Warrent_Count(WarrantID)
                get_WarrantService(WarrantID);
                reset()
                setErrors({
                    ['DispositionIDError']: '',
                })
            })

    }

    const updateWarrantService = (e) => {
        AddDeleteUpadate('WarrantService/Update_WarrantService', value)
            .then((res) => {
                toastifySuccess(res.Message)
                get_WarrantService(WarrantID);
                get_Warrent_Count(WarrantID)
                setModal(false)
                setErrors({
                    ['DispositionIDError']: '',
                })
            })

    }

    const closeModal = () => {
        reset();
        setModal(false);
    }

    const startRef = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
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
    };
    return (
        <>
            {
                modal ?

                    <>
                        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="WarrantServiceModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <div className="m-1 mt-1">
                                            <fieldset style={{ border: '1px solid gray' }}>
                                                <legend style={{ fontWeight: 'bold' }}>Warrant Service</legend>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div className="col-6 col-md-4 col-lg-4  ">
                                                                <div className="dropdown__box">
                                                                    <DatePicker
                                                                        id='ServiceAttemptDtTm'
                                                                        name='ServiceAttemptDtTm'
                                                                        ref={startRef}
                                                                        onKeyDown={onKeyDown}
                                                                        onChange={(date) => { setServiceAttemptedDate(date); setValue({ ...value, ['ServiceAttemptDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                        className=''
                                                                        dateFormat="MM/dd/yyyy HH:mm"
                                                                        timeInputLabel
                                                                        showYearDropdown
                                                                        showMonthDropdown
                                                                        dropdownMode="select"
                                                                        isClearable={value?.ServiceAttemptDtTm ? true : false}
                                                                        selected={ServiceAttemptedDate}
                                                                        placeholderText={value?.ServiceAttemptDtTm ? value.ServiceAttemptDtTm : 'Select...'}
                                                                        showTimeSelect
                                                                        timeIntervals={1}
                                                                        timeCaption="Time"
                                                                        autoComplete="Off"
                                                                        maxDate={new Date()}
                                                                    />
                                                                    <label htmlFor="" className='pt-1'>Service Attempted</label>
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-3 col-lg-4  pt-1">
                                                                <div className="dropdown__box">
                                                                    <Select
                                                                        // name='AttemptedBy'
                                                                        name='OfficerID'
                                                                        isClearable
                                                                        styles={colourStyles}
                                                                        value={headOfAgency?.filter((obj) => obj.value === value?.OfficerID)}
                                                                        options={headOfAgency}
                                                                        onChange={(e) => ChangeDropDown(e, 'OfficerID')}
                                                                        placeholder="Select.."
                                                                        menuPlacement="top"
                                                                    />
                                                                    <label htmlFor='' >Attempted By</label>
                                                                    {errors.OfficerIDError !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerIDError}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="col-6 col-md-4 col-lg-4  ">
                                                                <div className="dropdown__box">
                                                                    <DatePicker
                                                                        id='NextAttemptDtTm'
                                                                        name='NextAttemptDtTm'
                                                                        ref={startRef}
                                                                        onKeyDown={onKeyDown}
                                                                        onChange={(date) => { setNextAttemptedDate(date); setValue({ ...value, ['NextAttemptDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                        className=''
                                                                        dateFormat="MM/dd/yyyy HH:mm"
                                                                        timeInputLabel
                                                                        showYearDropdown
                                                                        showMonthDropdown
                                                                        dropdownMode="select"
                                                                        isClearable={value?.NextAttemptDtTm ? true : false}
                                                                        selected={NextAttemptedDate}
                                                                        placeholderText={value?.NextAttemptDtTm ? value.NextAttemptDtTm : 'Select...'}
                                                                        showTimeSelect
                                                                        timeIntervals={1}
                                                                        timeCaption="Time"
                                                                        autoComplete="Off"
                                                                        maxDate={new Date()}
                                                                    />
                                                                    <label htmlFor="" className='pt-1'>Next Attempt Date</label>
                                                                </div>
                                                            </div>


                                                            <div className="col-12  col-md-12 col-lg-12 mt-2" >
                                                                <div className="text-field">
                                                                    <textarea name='Remarks' id="Remarks" cols="30" rows='1' className="form-control " value={value?.Remarks} onChange={HandleChange}  ></textarea>
                                                                    <label htmlFor="" className='pt-1'>Remark</label>
                                                                    {errors.RemarksError !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RemarksError}</span>
                                                                    ) : null}
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
                                                <button type="button" onClick={() => check_Validation_Error()} class="btn btn-sm btn-success mr-1">Update</button>
                                                :
                                                <button type="button" onClick={() => check_Validation_Error()} class="btn btn-sm btn-success mr-1">Save</button>
                                        }
                                        <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" onClick={() => { closeModal(); }} >Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <></>
            }
        </>
    )
}

export default Clearance_Add_Up