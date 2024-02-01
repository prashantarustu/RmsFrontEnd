import React, { useContext, useState } from 'react'
import { useEffect, useCallback } from 'react';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility';
import { fetchData, fetchPostData, AddDeleteUpadate } from '../../../../hooks/Api';
import { RequiredField, RequiredFieldIncident, SpaceCheck } from '../../../Utility/Personnel/Validation';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Pin_Add_Up = ({incidentReportedDate, get_LocalStorage, LoginPinID, incidentID, LoginAgencyID, status, get_Pin_Data, setModal, modal, PinActivityID, updateStatus,  }) => {

    const { get_IncidentTab_Count } = useContext(AgencyContext);
    const [ActivityDate, setActivityDate] = useState();
    const [headOfAgency, setHeadOfAgency] = useState([]);
    const [shiftList, setShiftList] = useState();
    const [Editval, setEditval] = useState();
    const [pinActivityStatusDrpVal, setPinActivityStatusDrpVal] = useState([]);
    const [PINActivityRoleIDDrpVal, setPINActivityRoleIDDrpVal] = useState([]);

    const [value, setValue] = useState({
        'ActivityDateTime': '', 'PINActivityStatusID': '', 'PINActivityRoleID': '', 'PINActivityRoleName': '', 'OfficerPINID': '',
        'ShiftID': '', 'ShiftName': '', 'ResourceNumber': '',
        'IncidentId': '',
        'CreatedByUserFK': '',
        'ModifiedByUserFK': '',
        'IncidentPINActivityID': '',
    })

    const [errors, setErrors] = useState({
        'ActivityDateTimeError': '', 'ActivityRoleStatusError': '', 'OfficerPinError': '', 'ResourceNumberError': '',
    })

    useEffect(() => {
        if (incidentID) { setValue({ ...value, 'IncidentId': incidentID, 'CreatedByUserFK': LoginPinID }) }
    }, [incidentID, updateStatus]);

    useEffect(() => {
        if (PinActivityID) {
            GetSingleData(PinActivityID)
        }
    }, [PinActivityID, updateStatus])

    const GetSingleData = () => {
        const val = { 'IncidentPINActivityID': PinActivityID }
        fetchPostData('PINActivity/GetSingleData_PINActivity', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            reset();
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
                'IncidentPINActivityID': PinActivityID,
                'ActivityDateTime': Editval[0]?.ActivityDateTime ? getShowingDateText(Editval[0]?.ActivityDateTime) : ' ',
                "ResourceNumber": Editval[0]?.ResourceNumber,
                'PINActivityStatusID': Editval[0]?.PINActivityStatusID, 'PINActivityRoleID': Editval[0]?.PINActivityRoleID,
                'OfficerPINID': Editval[0]?.OfficerPINID, 'ShiftID': Editval[0]?.ShiftID,
                'ModifiedByUserFK': LoginPinID,
            })
            setActivityDate(Editval[0]?.ActivityDateTime ? new Date(Editval[0]?.ActivityDateTime) : '');
        }
        else {
            setValue({
                ...value,
                'PINActivityStatusID': '', 'IncidentId': incidentID, 'CreatedByUserFK': LoginPinID, 'PINActivityRoleID': '', 'ShiftID': '', 'ModifiedByUserFK': '', 'ResourceNumber': '', 'ActivityDateTime': '',
            })
        }
    }, [Editval])

    const reset = () => {
        setValue({
            ...value,
            'PINActivityStatusID': '', 'PINActivityRoleID': '', 'OfficerPINID': '', 'ModifiedByUserFK': '', 'ResourceNumber': '', 'ShiftID': '', 'ActivityDateTime': '',
        }); setActivityDate("")
        setErrors({
            ...errors,
            'ActivityDateTimeError': '', 'ActivityRoleStatusError': '', 'OfficerPinError': '', 'ResourceNumberError': '',
        });
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.PINActivityRoleID)) {
            setErrors(prevValues => { return { ...prevValues, ['ActivityRoleStatusError']: RequiredFieldIncident(value.PINActivityRoleID) } })
        }
        if (RequiredField(value.ActivityDateTime)) {
            setErrors(prevValues => { return { ...prevValues, ['ActivityDateTimeError']: RequiredField(value.ActivityDateTime) } })
        }
        if (RequiredFieldIncident(value.OfficerPINID)) {
            setErrors(prevValues => { return { ...prevValues, ['OfficerPinError']: RequiredFieldIncident(value.OfficerPINID) } })
        }
        if (SpaceCheck(value.ResourceNumber)) {
            setErrors(prevValues => { return { ...prevValues, ['ResourceNumberError']: SpaceCheck(value.ResourceNumber) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { ActivityDateTimeError, ActivityRoleStatusError, OfficerPinError, ResourceNumberError } = errors

    useEffect(() => {
        if (ActivityDateTimeError === 'true' && ActivityRoleStatusError === 'true' && OfficerPinError === 'true' && ResourceNumberError === 'true') {
            if (status) update_Activity()
            else Add_Type()
        }
    }, [ActivityDateTimeError, ActivityRoleStatusError, OfficerPinError, ResourceNumberError])

    useEffect(() => {
        get_pin_Activity_Status(); get_pin_Activity_Role(); get_Head_Of_Agency(LoginAgencyID); get_Shift(LoginAgencyID);
    }, [LoginAgencyID])

    ///-------GET SHIFT-----///
    const get_Shift = (LoginAgencyID) => {
        const val = {
            // AgencyID: Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID')
            AgencyID: LoginAgencyID,
        }
        fetchPostData('MasterPersonnel/GetData_Shift', val).then((data) => {
            if (data) {
                setShiftList(changeArrayFormat(data, 'shiftListVal'));
            }
            else {
                setShiftList([])
            }
        })
    };

    //------------OFFICERPINID-------------//
    const get_Head_Of_Agency = (LoginAgencyID) => {
        const val = {
            // AgencyID: Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID')
            AgencyID: LoginAgencyID,
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setHeadOfAgency(changeArrayFormat(data, 'HeadOfAgencyVal'));
            }
            else {
                setHeadOfAgency([])
            }
        })
    };

    //------------PinActivityStatus----------------//
    const get_pin_Activity_Status = () => {
        fetchData('PINActivity/GetData_PINActivityType').then((data) => {
            setPinActivityStatusDrpVal(Comman_changeArrayFormat(data, 'ActivityTypeID', 'Description'));
        })
    }

    //-----------PinActivityRole------------------// 
    const get_pin_Activity_Role = () => {
        fetchData('PINActivity/GetData_ActivityRole').then((data) => {
            setPINActivityRoleIDDrpVal(changeArrayFormat(data, 'PINActivityRoleVal'));
        })
    }

    const handleChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
    }

    const startRef = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };

    const Add_Type = (e) => {
        AddDeleteUpadate('PINActivity/InsertPINActiivty', value)
            .then((res) => {
                get_Pin_Data(incidentID);
                get_IncidentTab_Count(incidentID);
                setModal(false)
                toastifySuccess(res.Message);
                reset();
                setErrors({
                    ['ActivityDateTimeError']: '',
                });
            })
    }

    const update_Activity = () => {
        AddDeleteUpadate('PINActivity/UpdatePinActivity', value).then((res) => {
            toastifySuccess(res.Message);
            setModal(false);
            get_Pin_Data(incidentID);
            reset();
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

    useEffect(() => {
        if (!status) {
            // setActivityDate(new Date());
            // setValue({
            //     ...value,
            //     ['ActivityDateTime']: getShowingMonthDateYear(new Date()),
            // });
        } else {
            setActivityDate('');
            setValue({
                ...value,
                ['ActivityDateTime']: '',
            });
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
                        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="PinModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                            <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                                <div class="modal-content">
                                    <div class="modal-body">
                                        <div className="m-1 mt-3">
                                            <fieldset style={{ border: '1px solid gray' }}>
                                                <legend style={{ fontWeight: 'bold' }}>Pin Activity</legend>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div class="col-6 col-md-6 col-lg-6 dropdown__box">
                                                                <DatePicker
                                                                    ref={startRef}
                                                                    onKeyDown={onKeyDown}
                                                                    id='ActivityDateTime'
                                                                    name='ActivityDateTime'
                                                                    className='requiredColor'
                                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                                    onChange={(date) => { setActivityDate(date); setValue({ ...value, ['ActivityDateTime']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                    timeInputLabel
                                                                    isClearable={value?.ActivityDateTime ? true : false}
                                                                    placeholderText={value?.ActivityDateTime ? value?.ActivityDateTime : 'Select...'}
                                                                    selected={ActivityDate}
                                                                    showTimeSelect
                                                                    timeIntervals={1}
                                                                    timeCaption="Time"
                                                                    showMonthDropdown
                                                                    showYearDropdown
                                                                    dropdownMode="select"
                                                                    // minDate={''}
                                                                    maxDate={new Date()}
                                                                    minDate={new Date(incidentReportedDate)}
                                                                    showDisabledMonthNavigation
                                                                />
                                                                <label htmlFor="" className='pt-1'>Date/Time</label>
                                                                {errors.ActivityDateTimeError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ActivityDateTimeError}</span>
                                                                ) : null}
                                                            </div>
                                                            <div class="col-6 col-md-6 mt-1  col-lg-6 mb-2">
                                                                <div className="text-field">
                                                                    <input type="text" name='ResourceNumber' value={value.ResourceNumber} onChange={handleChange} required />
                                                                    <label className=''>Module</label>
                                                                    {errors.ResourceNumberError !== 'true' ? (
                                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ResourceNumberError}</span>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div class="col-6 col-md-6 pt-1 mb-1 col-lg-6  dropdown__box">
                                                                <Select
                                                                    name='OfficerPINID'
                                                                    styles={colourStyles}
                                                                    menuPlacement='top'
                                                                    value={headOfAgency?.filter((obj) => obj.value === value?.OfficerPINID)}
                                                                    isClearable
                                                                    options={headOfAgency}
                                                                    onChange={(e) => ChangeDropDown(e, 'OfficerPINID')}
                                                                    placeholder="Select..."
                                                                />
                                                                <label htmlFor='' className='mt-1'>User PIN</label>
                                                                {errors.OfficerPinError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerPinError}</span>
                                                                ) : null}
                                                            </div>
                                                            <div className="col-6 col-md-6 col-lg-6 pt-1  dropdown__box">
                                                                <Select
                                                                    name='PINActivityRoleID'
                                                                    styles={colourStyles}
                                                                    menuPlacement='top'
                                                                    isClearable
                                                                    value={PINActivityRoleIDDrpVal?.filter((obj) => obj.value === value?.PINActivityRoleID)}
                                                                    options={PINActivityRoleIDDrpVal}
                                                                    onChange={(e) => ChangeDropDown(e, 'PINActivityRoleID')}
                                                                    placeholder="Select.."
                                                                />
                                                                <label htmlFor="" className='mt-1'>Role</label>
                                                                {errors.ActivityRoleStatusError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ActivityRoleStatusError}</span>
                                                                ) : null}
                                                            </div>
                                                            <div className="col-6 col-md-6 col-lg-6 pt-1  dropdown__box">
                                                                <Select
                                                                    name='PINActivityStatusID'
                                                                    styles={customStylesWithOutColor}
                                                                    menuPlacement='top'
                                                                    isClearable
                                                                    value={pinActivityStatusDrpVal?.filter((obj) => obj.value === value?.PINActivityStatusID)}
                                                                    options={pinActivityStatusDrpVal}
                                                                    onChange={(e) => ChangeDropDown(e, 'PINActivityStatusID')}
                                                                    placeholder="Select.."
                                                                />

                                                                <label htmlFor="" className='pt-1'>Activity Details</label>
                                                            </div>
                                                            <div className="col-6 col-md-6 col-lg-6 pt-1 dropdown__box">
                                                                <Select
                                                                    name='ShiftName'
                                                                    styles={customStylesWithOutColor}
                                                                    menuPlacement='top'
                                                                    isClearable
                                                                    value={shiftList?.filter((obj) => obj.value === value?.ShiftID)}
                                                                    options={shiftList}
                                                                    onChange={(e) => ChangeDropDown(e, 'ShiftID')}
                                                                    placeholder="Select.."
                                                                />
                                                                <label htmlFor="" className='pt-1'>Select Shift</label>
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

export default Pin_Add_Up

export const changeArrayFormat = (data, type) => {
    // if (type === 'PINActivityStaVal') {
    //     const result = data?.map((sponsor) =>
    //         ({ value: sponsor.ActivityTypeID, label: sponsor.Description })
    //     )
    //     return result
    // }
    if (type === 'PINActivityRoleVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ActivityTypeID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'HeadOfAgencyVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.PINID, label: sponsor.HeadOfAgency })
        )
        return result
    }
    if (type === 'shiftListVal') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ShiftId, label: sponsor.ShiftDescription })
        )
        return result
    }
}


export const changeArrayFormat_WithFilter = (data, type, DropDownValue) => {
    if (DropDownValue) {
        //     if (type === 'PINActivityStaVal') {
        //         const result = data?.map((sponsor) =>
        //             (sponsor.PINActivityStatusID)
        //         )
        //         const result2 = DropDownValue?.map((sponsor) => {
        //             if (sponsor.value === result[0]) {
        //                 return { value: result[0], label: sponsor.label }
        //             }
        //         }
        //         )
        //         const val = result2.filter(function (element) {
        //             return element !== undefined;
        //         });
        //         return val[0]
        //     }
        // }
        if (type === 'PINActivityRoleVal') {
            const result = data?.map((sponsor) =>
                (sponsor.PINActivityRoleID)
            )
            const result2 = DropDownValue?.map((sponsor) => {
                if (sponsor.value === result[0]) {
                    return { value: result[0], label: sponsor.label }
                }
            })
            const val = result2.filter(function (element) {
                return element !== undefined;
            });
            return val[0]
        }
        if (type === 'HeadOfAgencyVal') {
            const result = data?.map((sponsor) =>
                (sponsor.OfficerPINID)
            )
            const result2 = DropDownValue?.map((sponsor) => {
                if (sponsor.value === result[0]) {
                    return { value: result[0], label: sponsor.label }
                }
            })
            const val = result2.filter(function (element) {
                return element !== undefined;
            });
            return val[0]
        }
        if (type === 'shiftListVal') {
            const result = data?.map((sponsor) =>
                (sponsor.ShiftID)
            )
            const result2 = DropDownValue?.map((sponsor) => {
                if (sponsor.value === result[0]) {
                    return { value: result[0], label: sponsor.label }
                }
            })
            const val = result2.filter(function (element) {
                return element !== undefined;
            });
            return val[0]
        }
    }
}