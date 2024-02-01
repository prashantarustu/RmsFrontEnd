import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter'
import { AddDeleteUpadate, fieldPermision } from '../../../../hooks/Api'
import { RequiredField } from '../../AgencyValidation/validators'

const Rank_Add_Up = ({ aId, pinId, get_Rank, status, rankEditData, modal, setModal, rankList, updateStatus }) => {

    const { get_CountList } = useContext(AgencyContext);
    
    const [value, setValue] = useState({
        'AgencyId': aId,
        'RankCode': '',
        'RankDescription': '',
        // 'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'CreatedByUserFK': pinId,
    })

    const [fieldPermisionAgency, setFieldPermissionAgency] = useState({
        // Rank Field 
        'RankCode': '', 'RankDescription': '',
    })

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'RankCode': '', 'RankDescription': '',
    })

    const reset_value = () => {
        setValue({
            ...value,
            'RankCode': '',
            'RankDescription': '',
            'ModifiedByUserFK': ''
        });
    }

    const handleInput = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (rankEditData?.RankID) {
            setValue({
                ...value,
                'RankID': rankEditData?.RankID,
                'AgencyId': aId,
                'RankCode': rankEditData?.RankCode,
                'RankDescription': rankEditData?.RankDescription,
                // 'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'ModifiedByUserFK': pinId,
            });
        } else {
            setValue({
                ...value,
                'AgencyId': aId,
                'RankCode': '',
                'RankDescription': '',
                'ModifiedByUserFK': ''
            });
        }
    }, [rankEditData, updateStatus])

    useEffect(() => {
        if (aId && pinId) get_Field_Permision_Rank(aId, pinId)
    }, [aId])

    // Get Effective Field Permission
    const get_Field_Permision_Rank = (aId, pinId) => {
        fieldPermision(aId, 'A021', pinId).then(res => {
            if (res) {
                //    Rank Field 
                if (Agency_Field_Permistion_Filter(res, "Agency-RankCode")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['RankCode']: Agency_Field_Permistion_Filter(res, "Agency-RankCode") } })
                } if (Agency_Field_Permistion_Filter(res, "Agency-RankDescription")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['RankDescription']: Agency_Field_Permistion_Filter(res, "Agency-RankDescription") } })
                }
            }

        });
    }

    // Check validation on Field
    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.RankCode)) {
            setErrors(prevValues => { return { ...prevValues, ['RankCode']: RequiredField(value.RankCode) } })
        }
        if (RequiredField(value.RankDescription)) {
            setErrors(prevValues => { return { ...prevValues, ['RankDescription']: RequiredField(value.RankDescription) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { RankDescription, RankCode } = errors

    useEffect(() => {
        if (RankCode === 'true' && RankDescription === 'true') {
            if (status) rank_Update()
            else rank_add()
        }
    }, [RankDescription, RankCode])

    // New Rank Create

    const rank_add = async (e) => {
        var result = rankList?.find(item => {
            if (item.RankCode.toLowerCase() === value.RankCode.toLowerCase()) {
                return true
            } else return false
        }
        );
        var result1 = rankList?.find(item => {
            if (item.RankDescription.toLowerCase() === value.RankDescription.toLowerCase()) {
                return true
            } else return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Rank Code Already Exists')
                setErrors({ ...errors, ['RankCode']: '' })
            }
            if (result1) {
                toastifyError('Rank Description Already Exists')
                setErrors({ ...errors, ['RankCode']: '' })
            }
        } else {
            AddDeleteUpadate('MasterPersonnel/InsertRank', value)
                .then((res) => {
                    if (res.success === true) {
                        toastifySuccess(res.Message)
                        get_Rank(aId); get_CountList(aId); reset_value(); setModal(false); setErrors({ ...errors, ['RankCode']: '' })
                    } else { toastifyError("Rank can not be saved !!") }
                })
        }
    }

    // Rank Update Method
    const rank_Update = (e) => {
        // e.preventDefault()
        var result = rankList?.find(item => {
            if (item.RankID != value.RankID) {
                if (item.RankCode.toLowerCase() === value.RankCode.toLowerCase()) {
                    return true
                } else return false
            }
        }
        );
        var result1 = rankList?.find(item => {
            if (item.RankID != value.RankID) {
                if (item.RankDescription.toLowerCase() === value.RankDescription.toLowerCase()) {
                    return true
                } else return false
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Rank Code Already Exists')
                setErrors({ ...errors, ['RankCode']: '' })
            }
            if (result1) {
                toastifyError('Rank Description Already Exists')
                setErrors({ ...errors, ['RankCode']: '' })
            }
        } else {
            AddDeleteUpadate('MasterPersonnel/UpdateRank', value)
                .then(res => {
                    if (res.success) {
                        toastifySuccess(res.Message); get_Rank(aId); setModal(false); setModal(false); setErrors({ ...errors, ['RankCode']: '' })
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
        setErrors({ ...errors, 'RankCode': '', 'RankDescription': '' })
        reset_value()
    }

    return (
        <>
            {
                modal ?
                    <div class="modal fade borderModal" style={{ background: "rgba(0,0,0, 0.5)" }} id="RankModal" data-backdrop="false" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class=" modal-dialog modal-lg modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body ">
                                    <div className="m-1">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Ranks</legend>
                                            <div className="row " rounded>
                                                <div className="col-6 input-group-lg">
                                                    <div className="text-field">
                                                        <input type="text" name='RankCode' value={value.RankCode}
                                                            className={fieldPermisionAgency?.RankCode[0] ?
                                                                fieldPermisionAgency?.RankCode[0]?.Changeok === 0 && fieldPermisionAgency?.RankCode[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.RankCode[0]?.Changeok === 0 && fieldPermisionAgency?.RankCode[0]?.AddOK === 1 && rankEditData?.RankCode === '' && status ? 'requiredColor' : fieldPermisionAgency?.RankCode[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermisionAgency?.RankCode[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : ''
                                                            }
                                                            onChange={fieldPermisionAgency?.RankCode[0] ?
                                                                fieldPermisionAgency?.RankCode[0]?.Changeok === 0 && fieldPermisionAgency?.RankCode[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.RankCode[0]?.Changeok === 0 && fieldPermisionAgency?.RankCode[0]?.AddOK === 1 && rankEditData?.RankCode === '' && status ? handleInput : fieldPermisionAgency?.RankCode[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.RankCode[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                                            }
                                                            required />
                                                        <label>Rank Code </label>
                                                        {errors.RankCode !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RankCode}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div class="text-field ">
                                                        <textarea type="text" name='RankDescription' value={value.RankDescription}
                                                            className={fieldPermisionAgency?.RankDescription[0] ?
                                                                fieldPermisionAgency?.RankDescription[0]?.Changeok === 0 && fieldPermisionAgency?.RankDescription[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.RankDescription[0]?.Changeok === 0 && fieldPermisionAgency?.RankDescription[0]?.AddOK === 1 && rankEditData?.RankDescription === '' && status ? 'requiredColor' : fieldPermisionAgency?.RankDescription[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermisionAgency?.RankDescription[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : ''
                                                            }
                                                            onChange={fieldPermisionAgency?.RankDescription[0] ?
                                                                fieldPermisionAgency?.RankDescription[0]?.Changeok === 0 && fieldPermisionAgency?.RankDescription[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.RankDescription[0]?.Changeok === 0 && fieldPermisionAgency?.RankDescription[0]?.AddOK === 1 && rankEditData?.RankDescription === '' && status ? handleInput : fieldPermisionAgency?.RankDescription[0]?.AddOK === 1 && !status ? handleInput : fieldPermisionAgency?.RankDescription[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                                            }
                                                            required cols="30" rows="1" />
                                                        {errors.RankDescription !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RankDescription}</span>
                                                        ) : null}
                                                        <label>Rank Description</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="col-12">
                                        <div className="btn-box text-right mt-3 mr-1">
                                            {status ?
                                                <button type="button" class="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Update</button>
                                                :
                                                <button type="button" class="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Save</button>
                                            }
                                            <button type="button" class="btn btn-sm btn-success" data-dismiss="modal" onClick={(e) => closeModalReset()}>Close</button>
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

export default Rank_Add_Up