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

    const { upDateCount, WarrantClearanceID, status, modal, setModal, get_CommentsData, CommentData, LoginPinID, LoginAgencyID, WarrantID, MainIncidentID, get_DispositionData } = props
    const { get_Warrent_Count } = useContext(AgencyContext)
    const [ClearanceDate, setClearanceDate] = useState();
    const [headOfAgency, setHeadOfAgency] = useState([])
    const [disposition, setDisposition] = useState([])
    const [Editval, setEditval] = useState();

    const [value, setValue] = useState({
        'WarrantID': '',
        'DispositionID': '',
        'ClearanceDateTime': '',
        'OfficerID': '',
        'Remarks': '',
        'CreatedByUserFK': '',
    });

    const [errors, setErrors] = useState({
        'DispositionIDError': '', 'OfficerIDError': '', 'ClearanceDateTimeError': '', 'RemarksError': '',
    })

    useEffect(() => {
        if (WarrantID) {
            setValue(pre => { return { ...pre, 'WarrantID': WarrantID, 'CreatedByUserFK': LoginPinID, } })
        }
    }, [WarrantID, upDateCount]);


    useEffect(() => {
        if (WarrantClearanceID && status) {
            GetSingleData(WarrantClearanceID)
        }
    }, [WarrantClearanceID, upDateCount])

    const GetSingleData = (WarrantClearanceID) => {
        const val = { 'WarrantClearanceID': WarrantClearanceID }
        fetchPostData('WarrantClearance/GetSingleData_WarrantClearance', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.DispositionID)) {
            setErrors(prevValues => { return { ...prevValues, ['DispositionIDError']: RequiredFieldIncident(value.DispositionID) } })
        }
        if (RequiredFieldIncident(value.ClearanceDateTime)) {
            setErrors(prevValues => { return { ...prevValues, ['ClearanceDateTimeError']: RequiredFieldIncident(value.ClearanceDateTime) } })
        }
        if (RequiredFieldIncident(value.OfficerID)) {
            setErrors(prevValues => { return { ...prevValues, ['OfficerIDError']: RequiredFieldIncident(value.OfficerID) } })
        }
        if (SpaceCheck(value.Remarks)) {
            setErrors(prevValues => { return { ...prevValues, ['RemarksError']: SpaceCheck(value.Remarks) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DispositionIDError, ClearanceDateTimeError, OfficerIDError, RemarksError } = errors

    useEffect(() => {
        if (DispositionIDError === 'true' && ClearanceDateTimeError === 'true' && OfficerIDError === 'true' && RemarksError === 'true') {
            if (status) updateClearance();
            else submit()
        }
    }, [DispositionIDError, ClearanceDateTimeError, OfficerIDError, RemarksError])

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
                'WarrantClearanceID': WarrantClearanceID,
                'ClearanceDateTime': Editval[0].ClearanceDateTime ? getShowingDateText(Editval[0].ClearanceDateTime) : '',
                'OfficerID': Editval[0].OfficerID,
                'Remarks': Editval[0].Remarks,
                'DispositionID': Editval[0].DispositionID,
                'ModifiedByUserFK': LoginPinID,
            })
        } else {
            setValue({
                ...value,
                'WarrantID': '', 'DispositionID': '', 'ClearanceDateTime': '', 'OfficerID': '', 'Remarks': '',
            });
        }
    }, [Editval])

    const reset = (e) => {
        setValue({
            ...value, 'WarrantID': '', 'DispositionID': '', 'ClearanceDateTime': '', 'OfficerID': '', 'Remarks': '',
        }); setClearanceDate('')
        setErrors({
            ...errors,
            'DispositionIDError': '', 'OfficerIDError': '', 'ClearanceDateTimeError': '', 'RemarksError': '',
        });

    }

    useEffect(() => {
        get_WarrentDisposition(LoginAgencyID)
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

    const get_WarrentDisposition = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID
        }
        fetchPostData('WarrantDispositions/GetDataDropDown_WarrantDispositions', val).then(res => {
            if (res) {
                setDisposition(threeColArray(res, 'WarrantDispositionsID', 'Description', 'WarrantDispositionsCode'))

            } else setDisposition([])
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
        AddDeleteUpadate('WarrantClearance/Insert_WarrantClearance', value)
            .then((res) => {
                toastifySuccess(res.Message);
                setModal(false)
                get_Warrent_Count(WarrantID)
                get_DispositionData(WarrantID);
                reset()
                setErrors({
                    ['DispositionIDError']: '',
                })
            })

    }

    const updateClearance = (e) => {
        AddDeleteUpadate('WarrantClearance/Update_WarrantClearance', value)
            .then((res) => {
                toastifySuccess(res.Message)
                get_DispositionData(WarrantID);
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
                        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="ClearanceModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <div className="m-1 mt-1">
                                            <fieldset style={{ border: '1px solid gray' }}>
                                                <legend style={{ fontWeight: 'bold' }}>Clearance</legend>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div class="col-6 col-md-3 col-lg-3  pt-1">
                                                                <div className="dropdown__box">
                                                                    <Select
                                                                        name='DispositionID'
                                                                        isClearable
                                                                        styles={colourStyles}
                                                                        value={disposition?.filter((obj) => obj.value === value?.DispositionID)}
                                                                        options={disposition}
                                                                        onChange={(e) => ChangeDropDown(e, 'DispositionID')}
                                                                        placeholder="Select.."
                                                                        menuPlacement="top"
                                                                    />
                                                                    <label htmlFor='' >Disposition</label>
                                                                    {errors.DispositionIDError !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DispositionIDError}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="col-6 col-md-4 col-lg-3  ">
                                                                <div className="dropdown__box">
                                                                    <DatePicker
                                                                        id='ClearanceDateTime'
                                                                        name='ClearanceDateTime'
                                                                        ref={startRef}
                                                                        onKeyDown={onKeyDown}
                                                                        onChange={(date) => { setClearanceDate(date); setValue({ ...value, ['ClearanceDateTime']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                        className='requiredColor'
                                                                        dateFormat="MM/dd/yyyy HH:mm"
                                                                        timeInputLabel
                                                                        showYearDropdown
                                                                        showMonthDropdown
                                                                        dropdownMode="select"
                                                                        isClearable={value?.ClearanceDateTime ? true : false}
                                                                        selected={ClearanceDate}
                                                                        placeholderText={value?.ClearanceDateTime ? value.ClearanceDateTime : 'Select...'}
                                                                        showTimeSelect
                                                                        timeIntervals={1}
                                                                        timeCaption="Time"
                                                                        autoComplete="Off"
                                                                        maxDate={new Date()}
                                                                    />
                                                                    <label htmlFor="" className='pt-1'>Clearance Date/Time</label>
                                                                    {errors.ClearanceDateTimeError !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ClearanceDateTimeError}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-3 col-lg-3  pt-1">
                                                                <div className="dropdown__box">
                                                                    <Select
                                                                        name='OfficerID'
                                                                        isClearable
                                                                        styles={colourStyles}
                                                                        value={headOfAgency?.filter((obj) => obj.value === value?.OfficerID)}
                                                                        options={headOfAgency}
                                                                        onChange={(e) => ChangeDropDown(e, 'OfficerID')}
                                                                        placeholder="Select.."
                                                                        menuPlacement="top"
                                                                    />
                                                                    <label htmlFor='' >By PIN</label>
                                                                    {errors.OfficerIDError !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerIDError}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="col-3  col-md-3 col-lg-3 " style={{ marginTop: '5px' }}>
                                                                <div className="text-field">
                                                                    <input type="text" className='readonlyColor' name='ORI'
                                                                        required readOnly />
                                                                    <label htmlFor="">By ORI</label>
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
                                        <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" onClick={() => { closeModal(); }}>Close</button>
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