import React, { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { CommanchangeArrayFormat_WithFilter, Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { RequiredField, RequiredFieldIncident, Space_Allow_with_Trim } from '../../../Utility/Personnel/Validation';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { RequiredFieldSpaceNotAllow } from '../../../Agency/AgencyValidation/validators';
import ChangesModal from '../../../../Common/ChangesModal';

const AddDispatch = (props) => {

    const { LoginPinID, incidentID, LoginAgencyID, userName, status, setStatus, dispatchEditValue, setdispatchEditValue, get_Dispatch_Data, updateStatus, modal, setModal } = props
    const { get_IncidentTab_Count } = useContext(AgencyContext)

    const [headOfAgency, setHeadOfAgency] = useState([]);

    const [value, setValue] = useState({
        'OfficerId': '',
        'DispatchDate': '',
        'Comments': '',
        'DispatchId': '',
        'IncidentId': '',
        'CreatedByUserFK': '',
        'AdminOfficer': '',
    })

    const [errors, setErrors] = useState({
        'DispatchDateError': '', 'CommentsError': '', 'officerIdError': '',
    })

    useEffect(() => {
        if (incidentID) {
            // console.log("LoginPinID", LoginPinID)
            // console.log("headOfAgency", headOfAgency)
            setValue(pre => {
                return {
                    ...pre, 'OfficerId': LoginPinID, 'IncidentId': incidentID, 'CreatedByUserFK': LoginPinID,
                    'DispatchDate': '',
                    'Comments': '',
                    'DispatchId': '',
                    'ModifiedByUserFK': '',
                }
            })
        }
    }, [incidentID, status, updateStatus]);

    useEffect(() => {
        if (dispatchEditValue) {
            // console.log(dispatchEditValue)
            setValue({
                ...value,
                'OfficerId': dispatchEditValue?.OfficerId,
                'DispatchDate': dispatchEditValue?.DispatchDate ? getShowingDateText(dispatchEditValue?.DispatchDate) : null,
                'Comments': dispatchEditValue?.Comments,
                'DispatchId': dispatchEditValue?.DispatchId,
                'ModifiedByUserFK': LoginPinID,
            })
        } else {
            // setValue({
            //     ...value,
            //     'DispatchDate': '',
            //     'Comments': '',
            //     'DispatchId': '',
            //     'ModifiedByUserFK': '',
            // })
        }
    }, [dispatchEditValue, updateStatus])

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.DispatchDate)) {
            setErrors(prevValues => { return { ...prevValues, ['DispatchDateError']: RequiredFieldIncident(value.DispatchDate) } })
        }
        if (RequiredFieldIncident(value.OfficerId)) {
            setErrors(prevValues => { return { ...prevValues, ['officerIdError']: RequiredFieldIncident(value.OfficerId) } })
        }
        if (Space_Allow_with_Trim(value.Comments)) {
            setErrors(prevValues => { return { ...prevValues, ['CommentsError']: Space_Allow_with_Trim(value.Comments) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DispatchDateError, CommentsError, officerIdError } = errors

    useEffect(() => {
        if (DispatchDateError === 'true' && CommentsError === 'true' && officerIdError === 'true') {
            if (status) { UpdateDispatched() }
            else { AddDispatch() }
        }
    }, [DispatchDateError, CommentsError, officerIdError])

    useEffect(() => {
        if (LoginAgencyID) {
            get_Head_Of_Agency(LoginAgencyID);
        }
    }, [LoginAgencyID, LoginPinID])

    const get_Head_Of_Agency = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then(res => {
            if (res) {
                setHeadOfAgency(Comman_changeArrayFormat(res, 'PINID', 'HeadOfAgency'))
            } else setHeadOfAgency([])
        })
    };

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            Reset()
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    const handleChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
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

    const AddDispatch = () => {
        AddDeleteUpadate('IncidentDispatchComments/Insert_IncidentDispatcherComments', value)
            .then((res) => {
                if (res.success) {
                    toastifySuccess(res.Message);
                    get_IncidentTab_Count(incidentID);
                    get_Dispatch_Data(incidentID);
                    closeModal();
                }
            })
    }

    const UpdateDispatched = () => {
        AddDeleteUpadate('IncidentDispatchComments/Update_IncidentDispatcherComments', value)
            .then((res) => {
                if (res.success) {
                    toastifySuccess(res.Message);
                    get_Dispatch_Data(incidentID);
                    closeModal();
                }
            })
    }

    const startRef = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };

    const closeModal = () => {
        Reset();
        setModal(false);
    }

    const Reset = () => {
        setValue({
            ...value,
            'DispatchDate': '',
            'Comments': '',
            'DispatchId': '',
            'ModifiedByUserFK': '',
        });
        setErrors({
            ...errors,
            'DispatchDateError': '', 'CommentsError': '',
        });
    }

    const colourStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    return (
        <>
            {
                modal ?
                    <>
                        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="DispatchModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <div className="m-1 mt-3">
                                            <fieldset style={{ border: '1px solid gray' }}>
                                                <legend style={{ fontWeight: 'bold' }}>Dispatch Activity</legend>
                                                <div className="row">
                                                    <div class="col-12 col-md-12 col-lg-6 " style={{ marginTop: '-4px' }}>
                                                        <div className="dropdown__box">
                                                            <DatePicker
                                                                ref={startRef}
                                                                onKeyDown={onKeyDown}
                                                                name='DispatchDate'
                                                                id='DispatchDate'
                                                                className='requiredColor'
                                                                dateFormat="MM/dd/yyyy HH:mm"
                                                                onChange={(date) => { setValue({ ...value, ['DispatchDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                timeInputLabel
                                                                isClearable={value?.DispatchDate ? true : false}
                                                                placeholderText={'Select..'}
                                                                selected={value?.DispatchDate && new Date(value?.DispatchDate)}
                                                                showTimeSelect
                                                                timeIntervals={1}
                                                                timeCaption="Time"
                                                                // maxDate={new Date()}
                                                                showMonthDropdown
                                                                showYearDropdown
                                                                dropdownMode="select"
                                                            />
                                                            <label htmlFor="" className='pt-1'>Dispatch Date/Time</label>
                                                            {errors.DispatchDateError !== 'true' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DispatchDateError}</span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-6">
                                                        <div className="dropdown__box">
                                                            <Select
                                                                name='OfficerId'
                                                                styles={colourStyles}
                                                                value={headOfAgency?.filter((obj) => obj.value === value?.OfficerId)}
                                                                options={headOfAgency}
                                                                onChange={(e) => ChangeDropDown(e, 'OfficerId')}
                                                                placeholder="Select.."
                                                                menuPlacement="top"
                                                                isClearable
                                                            // isDisabled={true}
                                                            />
                                                            <label htmlFor="">Officer Name</label>
                                                            {errors.officerIdError !== 'true' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.officerIdError}</span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    {/* <div className="col-12 col-md-12 col-lg-6  pt-1">
                                                        <div class="text-field">
                                                            <input type="text" name='AdminOfficer' value={value.AdminOfficer} disabled readOnly />
                                                            <label>Officer Name</label>
                                                        </div>
                                                    </div> */}
                                                    <div className="col-12  col-md-12 col-lg-12  mt-3" >
                                                        <div className="text-field">
                                                            <textarea name='Comments' id="Comments" cols="30" onChange={handleChange} value={value.Comments} rows='3' className="form-control pt-2 pb-2 requiredColor" ></textarea>
                                                            <label htmlFor="" >Dispatch Activity Comments</label>
                                                            {errors.CommentsError !== 'true' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CommentsError}</span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                    <div className="btn-box text-right mt-1 mr-1 mb-2">
                                        {
                                            status ?
                                                <button type="button" onClick={() => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Update</button>
                                                :
                                                <button type="button" onClick={() => { check_Validation_Error(); }} class="btn btn-sm btn-success mr-1">Save</button>
                                        }
                                        <button type="button" class="btn btn-sm btn-success mr-1" data-dismiss="modal" onClick={closeModal}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>
                    :
                    <>
                    </>
                // <ChangesModal func={check_Validation_Error} />
            }
        </>
    )
}

export default AddDispatch


export const changeArrayFormat_WithFilter = (data, DropDownValue, id) => {
    if (DropDownValue) {
        const result = data?.map((sponsor) =>
            (sponsor[id])
        )
        const result2 = DropDownValue?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
}