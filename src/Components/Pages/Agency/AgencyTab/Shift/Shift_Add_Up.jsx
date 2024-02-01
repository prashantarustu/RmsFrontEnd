import React, { useState, useEffect } from 'react'
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter';
import { AddDeleteUpadate, fieldPermision } from '../../../../hooks/Api';
import { RequiredField } from '../../AgencyValidation/validators';

const Shift_Add_Up = ({ aId, pinId, get_Shift, shiftEditData, status, modal, setModal, countUpd, shiftList }) => {

    const { get_CountList } = useContext(AgencyContext)
    const [value, setValue] = useState({
        'AgencyId': aId,
        'ShiftCode': '',
        'ShiftDescription': '',
        'Starttime': '',
        'EndTime': '',
        'ShiftId': '',
        'CreatedByUserFK': pinId,
        // 'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
    })

    const [fieldPermisionAgency, setFieldPermissionAgency] = useState({
        // Shift Field
        'ShiftCode': '', 'ShiftDescription': '', 'Starttime': '', 'EndTime': '',
    })

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'ShiftCodeErr': '', 'ShiftDescriptionErr': '', 'StarttimeErr': '', 'EndTimeErr': '',
    })

    const handleInput = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value,
        });
    };

    const emptyField = () => {
        setValue({
            ...value,
            'ShiftId': "",
            'ShiftCode': "",
            'ShiftDescription': "",
            'Starttime': "",
            'EndTime': "",
        });
    }

    useEffect(() => {
        if (shiftEditData?.ShiftId) {
            setValue({
                ...value,
                'ShiftId': shiftEditData?.ShiftId,
                'AgencyId': aId,
                'ShiftCode': shiftEditData?.ShiftCode,
                'ShiftDescription': shiftEditData?.ShiftDescription,
                'Starttime': shiftEditData?.Starttime,
                'EndTime': shiftEditData?.EndTime,
                'ModifiedByUserFK': pinId,
                // 'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
            });
        } else {
            setValue({
                ...value,
                'AgencyId': aId,
                'ShiftCode': '',
                'ShiftDescription': '',
                'Starttime': '',
                'EndTime': '',
                'ModifiedByUserFK': '',
            });
        }
    }, [shiftEditData, countUpd])

    useEffect(() => {
        if (aId && pinId) get_Field_Permision_Shift(aId, pinId)
    }, [aId])

    // Get Effective Field Permission
    const get_Field_Permision_Shift = (aId, pinId) => {
        fieldPermision(aId, 'A020', pinId).then(res => {
            if (res) {
                // Shift Field
                if (Agency_Field_Permistion_Filter(res, "Agency-ShiftCode")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['ShiftCode']: Agency_Field_Permistion_Filter(res, "Agency-ShiftCode") } })
                } if (Agency_Field_Permistion_Filter(res, "Agency-Description")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['ShiftDescription']: Agency_Field_Permistion_Filter(res, "Agency-Description") } })
                } if (Agency_Field_Permistion_Filter(res, "Agency-StartTime")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['Starttime']: Agency_Field_Permistion_Filter(res, "Agency-StartTime") } })
                } if (Agency_Field_Permistion_Filter(res, "Agency-EndTime")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['EndTime']: Agency_Field_Permistion_Filter(res, "Agency-EndTime") } })
                }
            }

        });
    }

    // Check validation on Field
    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.ShiftCode)) {
            setErrors(prevValues => { return { ...prevValues, ['ShiftCodeErr']: RequiredField(value.ShiftCode) } })
        }
        if (RequiredField(value.ShiftDescription)) {
            setErrors(prevValues => { return { ...prevValues, ['ShiftDescriptionErr']: RequiredField(value.ShiftDescription) } })
        }
        if (RequiredField(value.Starttime)) {
            setErrors(prevValues => { return { ...prevValues, ['StarttimeErr']: RequiredField(value.Starttime) } })
        } if (RequiredField(value.EndTime)) {
            setErrors(prevValues => { return { ...prevValues, ['EndTimeErr']: RequiredField(value.EndTime) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { ShiftCodeErr, ShiftDescriptionErr, EndTimeErr, StarttimeErr } = errors

    useEffect(() => {
        if (ShiftCodeErr === 'true' && ShiftDescriptionErr === 'true' && EndTimeErr === 'true' && StarttimeErr === 'true') {
            if (status) shift_Update()
            else shift_add()
        }
    }, [ShiftCodeErr, ShiftDescriptionErr, EndTimeErr, StarttimeErr])

    // New Shift Create
    const shift_add = async (e) => {
        var result = shiftList?.find(item => {
            if (item.ShiftCode.toLowerCase() === value.ShiftCode.toLowerCase()) {
                return true
            } else return false
        }
        );
        var result1 = shiftList?.find(item => {
            if (item.ShiftDescription.toLowerCase() === value.ShiftDescription.toLowerCase()) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Shift Code Already Exists')
                setErrors({ ...errors, ['ShiftCodeErr']: '' })
            }
            if (result1) {
                toastifyError('Shift Description Already Exists')
                setErrors({ ...errors, ['ShiftCodeErr']: '' })
            }
        } else {
            AddDeleteUpadate('MasterPersonnel/InsertShift', value)
                .then((res) => {
                    if (res.success === true) {
                        toastifySuccess(res.Message); setErrors({ ...errors, ['ShiftCodeErr']: '' })
                        get_Shift(aId); get_CountList(aId); setModal(false); emptyField()
                    } else { toastifyError("Shift can not be saved !!") }
                })
        }
    }

    // Update Shift Function---------
    const shift_Update = (e) => {
        // e.preventDefault()
        var result = shiftList?.find(item => {
            if (item.ShiftId !== value.ShiftId) {
                if (item.ShiftCode.toLowerCase() === value.ShiftCode.toLowerCase()) {
                    return true
                } else return false
            }
        }
        );
        var result1 = shiftList?.find(item => {
            if (item.ShiftId !== value.ShiftId) {
                if (item.ShiftDescription.toLowerCase() === value.ShiftDescription.toLowerCase()) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Shift Code Already Exists')
                setErrors({ ...errors, ['ShiftCodeErr']: '' })
            }
            if (result1) {
                toastifyError('Shift Description Already Exists')
                setErrors({ ...errors, ['ShiftCodeErr']: '' })
            }
        } else {
            AddDeleteUpadate('MasterPersonnel/UpdateShift', value)
                .then(res => {
                    if (res.success) {
                        toastifySuccess(res.Message); setErrors({ ...errors, ['ShiftCodeErr']: '' })
                        get_Shift(aId); setModal(false); emptyField()
                    } else {
                        toastifyError(res.data.Message)
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }

    const closeModalReset = () => {
        setErrors({ ...errors, 'ShiftCodeErr': '', 'ShiftDescriptionErr': '', 'StarttimeErr': '', 'EndTimeErr': '' })
        emptyField()
    }

    return (
        <>
            {
                modal ?
                    <div class="modal fade borderModal" style={{ background: "rgba(0,0,0, 0.5)" }} id="ShiftModal" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class=" modal-dialog modal-md modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body ">
                                    <div className="m-1">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Shift</legend>
                                            {/* Praveen */}
                                            <div className="row" rounded>
                                                <div className="col-4 input-group-lg">
                                                    <div className="text-field">
                                                        <input type="text" name='ShiftCode' value={value.ShiftCode}
                                                            className={fieldPermisionAgency?.ShiftCode[0] ?
                                                                fieldPermisionAgency?.ShiftCode[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftCode[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.ShiftCode[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftCode[0]?.AddOK === 1 && shiftEditData?.ShiftCode === '' && status ? 'requiredColor' : fieldPermisionAgency?.ShiftCode[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermisionAgency?.ShiftCode[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                                            }
                                                            onChange={fieldPermisionAgency?.ShiftCode[0] ?
                                                                fieldPermisionAgency?.ShiftCode[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftCode[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.ShiftCode[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftCode[0]?.AddOK === 1 && shiftEditData?.ShiftCode === '' && status ? handleInput : fieldPermisionAgency?.ShiftCode[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.ShiftCode[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                                            }
                                                            required />
                                                        <label>Shift Code </label>
                                                        {errors.ShiftCodeErr !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ShiftCodeErr}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-8">
                                                    <div class="text-field ">
                                                        <textarea type="text" name='ShiftDescription' value={value.ShiftDescription}
                                                            className={fieldPermisionAgency?.ShiftDescription[0] ?
                                                                fieldPermisionAgency?.ShiftDescription[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftDescription[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.ShiftDescription[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftDescription[0]?.AddOK === 1 && shiftEditData?.ShiftDescription === 'requiredColor' && status ? 'requiredColor' : fieldPermisionAgency?.ShiftDescription[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermisionAgency?.ShiftDescription[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                                            }
                                                            onChange={fieldPermisionAgency?.ShiftDescription[0] ?
                                                                fieldPermisionAgency?.ShiftDescription[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftDescription[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.ShiftDescription[0]?.Changeok === 0 && fieldPermisionAgency?.ShiftDescription[0]?.AddOK === 1 && shiftEditData?.ShiftDescription === '' && status ? handleInput : fieldPermisionAgency?.ShiftDescription[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.ShiftDescription[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                                            }
                                                            required cols="30" rows="1" />
                                                        <label>Description</label>
                                                        {errors.ShiftDescriptionErr !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ShiftDescriptionErr}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-6 dropdown__box mt-3">
                                                    <div className="text-field">
                                                        <input type="time" name='Starttime' value={value.Starttime}
                                                            className={fieldPermisionAgency?.Starttime[0] ?
                                                                fieldPermisionAgency?.Starttime[0]?.Changeok === 0 && fieldPermisionAgency?.Starttime[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.Starttime[0]?.Changeok === 0 && fieldPermisionAgency?.Starttime[0]?.AddOK === 1 && shiftEditData?.Starttime === '' && status ? 'requiredColor' : fieldPermisionAgency?.Starttime[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermisionAgency?.Starttime[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                                            }
                                                            onChange={fieldPermisionAgency?.Starttime[0] ?
                                                                fieldPermisionAgency?.Starttime[0]?.Changeok === 0 && fieldPermisionAgency?.Starttime[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.Starttime[0]?.Changeok === 0 && fieldPermisionAgency?.Starttime[0]?.AddOK === 1 && shiftEditData?.Starttime === '' && status ? handleInput : fieldPermisionAgency?.Starttime[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.Starttime[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                                            }
                                                            required />
                                                        <label htmlFor="">Start Time</label>
                                                        {errors.StarttimeErr !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StarttimeErr}</span>
                                                        ) : null}

                                                    </div>
                                                </div>
                                                <div className="col-6 dropdown__box mt-3">
                                                    <div className="text-field">
                                                        <input type="time" name='EndTime' value={value.EndTime}
                                                            className={fieldPermisionAgency?.EndTime[0] ?
                                                                fieldPermisionAgency?.EndTime[0]?.Changeok === 0 && fieldPermisionAgency?.EndTime[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.EndTime[0]?.Changeok === 0 && fieldPermisionAgency?.EndTime[0]?.AddOK === 1 && shiftEditData?.EndTime === '' && status ? 'requiredColor' : fieldPermisionAgency?.EndTime[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermisionAgency?.EndTime[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                                            }
                                                            onChange={fieldPermisionAgency?.EndTime[0] ?
                                                                fieldPermisionAgency?.EndTime[0]?.Changeok === 0 && fieldPermisionAgency?.EndTime[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.EndTime[0]?.Changeok === 0 && fieldPermisionAgency?.EndTime[0]?.AddOK === 1 && shiftEditData?.EndTime === '' && status ? handleInput : fieldPermisionAgency?.EndTime[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.EndTime[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                                            }
                                                            required />
                                                        <label htmlFor="">End Time</label>
                                                        {errors.EndTimeErr !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.EndTimeErr}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="col-12">
                                        <div className="btn-box text-right mt-3 mr-1">
                                            {
                                                status ?
                                                    <button type="button" class="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Update</button>
                                                    :
                                                    <button type="button" class="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Save</button>
                                            }
                                            <button type="button" class="btn btn-sm btn-success" data-dismiss="modal" onClick={() => closeModalReset()}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }

        </>
    )
}

export default Shift_Add_Up