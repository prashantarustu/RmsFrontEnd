// Import Component
import React, { useState, useEffect, memo } from 'react'
import { useContext } from 'react'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fieldPermision } from '../../../../hooks/Api'
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter';

const Group_Add_Up = (props) => {
    
    // Props value
    const { aId, pinId, groupEditData, status, get_Group_List, applicationId, groupList, getAgency_List, setModal, modal, updateCount } = props
    const { get_CountList } = useContext(AgencyContext);
    // Hooks Initialization
    const [value, setValue] = useState({
        'GroupName': '', 'AgencyID': aId, 'ApplicationID': applicationId, 'ModifiedByUserFK': '', 'GroupID': '', 'IsAllowMultipleAgency': '',
        'CreatedByUserFK': pinId,
        //  'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
    })
    const [fieldPermisionAgency, setFieldPermissionAgency] = useState({
        // Group Form
        'GroupName': '', 'IsAdmin': '', 'IsAllowMultipleAgency': '',
    })

    const reset_value = () => {
        setValue({
            ...value, 'GroupName': "", 'GroupID': "", 'IsAllowMultipleAgency': "",
        });
    }

    useEffect(() => {
        if (aId && pinId) get_Field_Permision_Group(aId, pinId)
    }, [aId])

    useEffect(() => {
        if (groupEditData?.GroupID) {
            setValue({
                ...value,
                'GroupName': groupEditData?.GroupName,
                // 'IsAdmin': groupEditData?.IsAdmin,
                'ModifiedByUserFK': pinId,
                // 'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'GroupID': groupEditData?.GroupID,
                'IsAllowMultipleAgency': groupEditData?.IsAllowMultipleAgency,
                'CreatedByUserFK': '',
            });
        } else {
            setValue({
                ...value,
                'AgencyID': aId,
                'GroupName': '',
                // 'IsAdmin': '',
                'ModifiedByUserFK': '',
                'GroupID': '',
                'IsAllowMultipleAgency': '',
                // 'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'CreatedByUserFK': pinId,
               
            });
        }
    }, [groupEditData, updateCount])

    // onChange Hooks Function
    const handlChange = (e) => {
        if (e.target.name === 'IsAllowMultipleAgency') {
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
    }

    // Get Effective Field Permission
    const get_Field_Permision_Group = (aId, pinId ) => {
        fieldPermision(aId, 'A002', pinId).then(res => {
            if (res) {
                // Group Field 
                if (Agency_Field_Permistion_Filter(res, "Agency-GroupName")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['GroupName']: Agency_Field_Permistion_Filter(res, "Agency-GroupName") } })
                } 
                if (Agency_Field_Permistion_Filter(res, "Agency-IsAdmin")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['IsAdmin']: Agency_Field_Permistion_Filter(res, "Agency-IsAdmin") } })
                } 
                if (Agency_Field_Permistion_Filter(res, "Agency-IsAllowMultipleAgency")) {
                    setFieldPermissionAgency(prevValues => { return { ...prevValues, ['IsAllowMultipleAgency']: Agency_Field_Permistion_Filter(res, "Agency-IsAllowMultipleAgency") } })
                }
            }

        });
    }

    // Submit Group list
    const handleSubmit = (e) => {
        e.preventDefault()
        var result = groupList?.find(item => {
            if (item.GroupName === value.GroupName) {
                return true
            } else return false
        }
        );
        if (result) {
            toastifyError('Group Name Already Exists')
        } else if (value.GroupName.trim() !== '') {
            AddDeleteUpadate('Group/GroupInsert', value)
                .then(res => {
                    if (res.success) {
                        toastifySuccess(res.Message); get_Group_List(aId); get_CountList(aId); setModal(false); reset_value()
                    } else {
                        toastifyError(res.data.Message)
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } else toastifyError('Group Name Can`t be empty')
    }

    // Update group list 
    const group_Update = (e) => {
        e.preventDefault()
        var result = groupList?.find(item => {
            if (item.GroupID !== value.GroupID) {
                if (item.GroupName === value.GroupName) {
                    return true
                } else return false
            }
        }
        );
        if (result) {
            toastifyError('Group Name Already Exists')
        } else if (value.GroupName.trim() !== '') {
            AddDeleteUpadate('Group/GroupUpdate', value)
                .then(res => {
                    if (res.success) {
                        toastifySuccess(res.Message); get_Group_List(aId); setModal(false); getAgency_List(); reset_value()
                    } else {
                        toastifyError(res.data.Message)
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } else {
            toastifyError('Group Name Can`t be empty')
        }
    }

    return (
        <>
            {
                modal ?
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="GroupModal" tabindex="-1" data-backdrop="false" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Group</legend>
                                            <div className="row pt-2">
                                                <div className="col-12">
                                                    <div class="text-field">
                                                        <input type="text"
                                                            className={fieldPermisionAgency?.GroupName[0] ?
                                                                fieldPermisionAgency?.GroupName[0]?.Changeok === 0 && fieldPermisionAgency?.GroupName[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermisionAgency?.GroupName[0]?.Changeok === 0 && fieldPermisionAgency?.GroupName[0]?.AddOK === 1 && groupEditData?.GroupName === '' && status ? 'requiredColor' : fieldPermisionAgency?.GroupName[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermisionAgency?.GroupName[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : ''
                                                            }
                                                            onChange={fieldPermisionAgency?.GroupName[0] ?
                                                                fieldPermisionAgency?.GroupName[0]?.Changeok === 0 && fieldPermisionAgency?.GroupName[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.GroupName[0]?.Changeok === 0 && fieldPermisionAgency?.GroupName[0]?.AddOK === 1 && groupEditData?.GroupName === '' && status ? handlChange : fieldPermisionAgency?.GroupName[0]?.AddOK === 1 && !status ? handlChange : fieldPermisionAgency?.GroupName[0]?.Changeok === 1 && status ? handlChange : '' : handlChange
                                                            }
                                                            value={value.GroupName}
                                                            name='GroupName' required />
                                                        <label>Group Name</label>
                                                    </div>
                                                </div>
                                                <div className="col-6 mt-2">
                                                    <input type="checkbox" name="IsAllowMultipleAgency" checked={value.IsAllowMultipleAgency} value={value.IsAllowMultipleAgency}
                                                        onChange={fieldPermisionAgency?.IsAllowMultipleAgency[0] ?
                                                            fieldPermisionAgency?.IsAllowMultipleAgency[0]?.Changeok === 0 && fieldPermisionAgency?.IsAllowMultipleAgency[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.IsAllowMultipleAgency[0]?.Changeok === 0 && fieldPermisionAgency?.IsAllowMultipleAgency[0]?.AddOK === 1 && groupEditData?.IsAllowMultipleAgency === '' && status ? handlChange : fieldPermisionAgency?.IsAllowMultipleAgency[0]?.AddOK === 1 && !status ? handlChange : fieldPermisionAgency?.IsAllowMultipleAgency[0]?.Changeok === 1 && status ? handlChange : ''
                                                            : handlChange
                                                        }
                                                        disabled={fieldPermisionAgency?.IsAllowMultipleAgency[0] ?
                                                            fieldPermisionAgency?.IsAllowMultipleAgency[0]?.Changeok === 0 && fieldPermisionAgency?.IsAllowMultipleAgency[0]?.AddOK === 0 && status ? true : fieldPermisionAgency?.IsAllowMultipleAgency[0]?.Changeok === 0 && fieldPermisionAgency?.IsAllowMultipleAgency[0]?.AddOK === 1 && groupEditData?.IsAllowMultipleAgency === '' && status ? false : fieldPermisionAgency?.IsAllowMultipleAgency[0]?.AddOK === 1 && !status ? false : fieldPermisionAgency?.IsAllowMultipleAgency[0]?.Changeok === 1 && status ? false : true : false
                                                        }
                                                        id="IsAllowMultipleAgency" />
                                                    <label className='ml-2' htmlFor="IsAllowMultipleAgency">Is Allow Multiple Agency</label>
                                                </div>
                                                <div className="col-6 mt-2">
                                                    <input type="checkbox" name="IsAllowListTableEdit" checked={value.IsAllowListTableEdit} value={value.IsAllowListTableEdit}
                                                      
                                                        id="IsAllowListTableEdit" />
                                                    <label className='ml-2' htmlFor="IsAllowMultipleAgency">Is Allow List Table Edit</label>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="btn-box text-right mt-3 mr-1">
                                        {status ?
                                            <button type="button" class="btn btn-sm btn-success mr-1" onClick={group_Update}>Update</button>
                                            :
                                            <button type="button" class="btn btn-sm btn-success mr-1" onClick={handleSubmit}>Save</button>

                                        }
                                        <button type="button" class="btn btn-sm btn-success" data-dismiss="modal" onClick={() => reset_value()}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <> </>
            }
        </>
    )
}

export default memo(Group_Add_Up)