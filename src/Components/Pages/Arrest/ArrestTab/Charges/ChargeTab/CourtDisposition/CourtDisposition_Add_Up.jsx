import React, { useContext, useState } from 'react'
import { useEffect, useCallback } from 'react';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { toastifySuccess } from './../../../../../../Common/AlertMsg'
import { Comman_changeArrayFormat } from './../../../../../../Common/ChangeArrayFormat';
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear } from './../../../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate } from '../../../../../../hooks/Api';
import { RequiredFieldIncident, Space_Allow_with_Trim } from '../../../../../Utility/Personnel/Validation';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';

const CourtDisposition_Add_Up = (props) => {

    const { get_ArrestCharge_Count ,upDateCount} = useContext(AgencyContext);
    const { status, ChargeCourtDispositionID, modal, setModal, get_CourtDisposition_Data, updateStatus, ChargeID, LoginPinID, LoginAgencyID, ArrestID } = props

    const [courtDispositionDate, setCourtDispositionDate] = useState();
    const [Editval, setEditval] = useState();
    const [ClearanceID, setClearanceID] = useState([]);
    const [CourtDispositionID, setCourtDispositionID] = useState([]);

    const [value, setValue] = useState({
        'DispositionDtTm': '', 'Comments': '', 'ExceptionalClearanceID': '', 'ChargeCourtDispositionID': "", 'CourtDispositionID': '',
        'ChargeID': '',
        'CreatedByUserFK': ''
    })

    const [errors, setErrors] = useState({
        'DispositionDtTmErrors': '', 'CourtDispositionIDErrors': '', 'CommentsErrors': '',
        // 'ExceptionalClearanceIDErrors': '',
    })

    useEffect(() => {
        if (ChargeID) {
            setValue({ ...value, 'ChargeID': ChargeID, 'CreatedByUserFK': LoginPinID })
        }
    }, [ChargeID, LoginPinID,updateStatus]);

    useEffect(() => {
        if (ChargeCourtDispositionID) {
            GetSingleData(ChargeCourtDispositionID);
        }
    }, [ChargeCourtDispositionID])

    const GetSingleData = (ChargeCourtDispositionID) => {
        const val = {
            'ChargeCourtDispositionID': ChargeCourtDispositionID
        }
        fetchPostData('ChargeCourtDisposition/GetSingleData_ChargeCourtDisposition', val)
            .then((res) => {
                if (res) { setEditval(res); }
                else setEditval()
            })
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
                ...value, 'ChargeCourtDispositionID': ChargeCourtDispositionID, 'CourtDispositionID': Editval[0]?.CourtDispositionID, 'Comments': Editval[0]?.Comments,
                'ExceptionalClearanceID': Editval[0]?.ExceptionalClearanceID,
                'ModifiedByUserFK': LoginPinID,
                'DispositionDtTm': Editval[0].DispositionDtTm ? getShowingDateText(Editval[0].DispositionDtTm) : '',
            })
        }
        else { setValue({ ...value, 'DispositionDtTm': '', 'CourtDispositionID': '', 'Comments': '', 'ExceptionalClearanceID': '', }) }
    }, [Editval])

    const reset = () => {
        setValue({
            ...value,
            'DispositionDtTm': '', 'CourtDispositionID': '', 'Comments': '', 'ExceptionalClearanceID': '',
        });
        setErrors({
            ...errors,
            'DispositionDtTm': '', 'CourtDispositionID': '', 'Comments': '', 'ExceptionalClearanceID': '',
        });
        setCourtDispositionDate("");
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.DispositionDtTm)) {
            setErrors(prevValues => { return { ...prevValues, ['DispositionDtTmErrors']: RequiredFieldIncident(value.DispositionDtTm) } })
        }
        if (RequiredFieldIncident(value.CourtDispositionID)) {
            setErrors(prevValues => { return { ...prevValues, ['CourtDispositionIDError']: RequiredFieldIncident(value.CourtDispositionID) } })
        }
        if (Space_Allow_with_Trim(value.Comments)) {
            setErrors(prevValues => { return { ...prevValues, ['CommentsError']: Space_Allow_with_Trim(value.Comments) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DispositionDtTmErrors, CourtDispositionIDError, CommentsError, } = errors

    useEffect(() => {
        if (DispositionDtTmErrors === 'true' && CourtDispositionIDError === 'true' && CommentsError === 'true') {
            if (status) update_CourtDisp()
            else Add_Type()
        }
    }, [DispositionDtTmErrors, CourtDispositionIDError, CommentsError,])

    const handleChange = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value })
    }

    const startRef = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };

    useEffect(() => {
        Get_DataExceptionalClearanceID(LoginAgencyID);
        Get_CourtDispositionID(LoginAgencyID)
    }, [LoginAgencyID])

    const Get_DataExceptionalClearanceID = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('ExceptionalClearance/GetDataDropDown_ExceptionalClearance', val).then((data) => {
            if (data) {
                setClearanceID(Comman_changeArrayFormat(data, 'ClearanceID', 'Description'))
            } else {
                setClearanceID([]);
            }
        })
    }

    const Get_CourtDispositionID = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('CourtDispositions/GetDataDropDown_CourtDispositions', val).then((data) => {
            if (data) {
                setCourtDispositionID(Comman_changeArrayFormat(data, 'CourtDispositionID', 'Description'))
            } else {
                setCourtDispositionID([]);
            }
        })
    }

    const Add_Type = (e) => {
        AddDeleteUpadate('ChargeCourtDisposition/Insert_ChargeCourtDisposition', value)
            .then((res) => {
                get_CourtDisposition_Data(ChargeID);
                setModal(false)
                get_ArrestCharge_Count(ChargeID);
                reset();
                toastifySuccess(res.Message);
                setErrors({
                    'DispositionDtTm': '', 'CourtDispositionID': '', 'Comments': '', 'ExceptionalClearanceID': '',
                });
            })
    }

    const update_CourtDisp = () => {
        AddDeleteUpadate('ChargeCourtDisposition/Update_ChargeCourtDisposition', value).then((res) => {
            toastifySuccess(res.Message);
            setModal(false);
            get_CourtDisposition_Data(ChargeID)
            reset();
            setErrors({
                'DispositionDtTm': '', 'CourtDispositionID': '', 'Comments': '', 'ExceptionalClearanceID': '',
            });
        })
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({ ...value, [name]: e.value })
        } else {
            setValue({ ...value, [name]: null })
        }
    }

    useEffect(() => {
        if (!status) {
        } else {
            setCourtDispositionDate('');
            setValue({ ...value, ['DispositionDtTm']: '', });
        }
    }, [])

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
                        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CourtDispositionModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <div className="m-1 mt-3">
                                            <fieldset style={{ border: '1px solid gray' }}>
                                                <legend style={{ fontWeight: 'bold' }}>Court Disposition</legend>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div class="col-6 col-md-6 col-lg-6 dropdown__box">
                                                                <DatePicker
                                                                    ref={startRef}
                                                                    onKeyDown={onKeyDown}
                                                                    id='DispositionDtTm'
                                                                    name='DispositionDtTm'
                                                                    className='requiredColor'
                                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                                    onChange={(date) => { setCourtDispositionDate(date); setValue({ ...value, ['DispositionDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                    selected={courtDispositionDate}
                                                                    timeInputLabel
                                                                    isClearable={value?.DispositionDtTm ? true : false}
                                                                    placeholderText={value?.DispositionDtTm ? value?.DispositionDtTm : 'Select...'}
                                                                    showTimeSelect
                                                                    timeIntervals={1}
                                                                    timeCaption="Time"
                                                                />
                                                                <label htmlFor="" className='pt-1'>Disposition Date/Time</label>
                                                                {errors.DispositionDtTmErrors !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DispositionDtTmErrors}</span>
                                                                ) : null}
                                                            </div>
                                                            <div class="col-6 col-md-6 pt-1 mb-1 col-lg-6  dropdown__box">

                                                                <Select
                                                                    name='CourtDispositionID'
                                                                    styles={colourStyles}
                                                                    value={CourtDispositionID?.filter((obj) => obj.value === value?.CourtDispositionID)}
                                                                    isClearable
                                                                    options={CourtDispositionID}
                                                                    onChange={(e) => ChangeDropDown(e, 'CourtDispositionID')}
                                                                    placeholder="Select..."
                                                                />
                                                                <label htmlFor='' className='mt-1'> Court Disposition </label>
                                                                {errors.CourtDispositionIDError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CourtDispositionIDError}</span>
                                                                ) : null}

                                                            </div>
                                                            <div className="col-6 col-md-6 col-lg-12 pt-1  dropdown__box">
                                                                <Select
                                                                    name='ExceptionalClearanceID'
                                                                    value={ClearanceID?.filter((obj) => obj.value === value?.ExceptionalClearanceID)}
                                                                    isClearable
                                                                    options={ClearanceID}
                                                                    onChange={(e) => ChangeDropDown(e, 'ExceptionalClearanceID')}
                                                                    placeholder="Select..."
                                                                    styles={customStylesWithOutColor}
                                                                />
                                                                <label htmlFor="" className='mt-1'>Exceptional Clearance</label>
                                                            </div>
                                                            <div className="col-12  col-md-12 col-lg-12 mt-5 pt-1 dropdown__box" style={{ marginTop: '20px' }}>
                                                                <textarea name='Comments' onChange={handleChange} id="Comments" value={value.Comments} cols="30" rows='3' className="form-control pt-2 pb-2 requiredColor" ></textarea>
                                                                <label htmlFor="Comments" className='pt-1'>Comments</label>
                                                                {errors.CommentsError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CommentsError}</span>
                                                                ) : null}
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

export default CourtDisposition_Add_Up
