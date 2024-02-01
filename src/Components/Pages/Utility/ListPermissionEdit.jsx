import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { toastifyError, toastifySuccess } from '../../Common/AlertMsg';
import { Decrypt_Id_Name } from '../../Common/Utility';
import { AddDeleteUpadate } from '../../hooks/Api';

const ListPermissionEdit = (props) => {

    const { LoginPinID, modal, setModal, EditList, status, get_List_Table, ModuleFK } = props

    const [value, setValue] = useState({
        'Name': '',
        'TableID': '',
        'ModifiedByUserFK': '',
    })

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "Name": EditList?.Name,
                "TableID": EditList?.TableID,
                'ModifiedByUserFK': LoginPinID,
            })
        }
        else {
            setValue({
                ...value,
                "Name": '',
            })
        }
    }, [EditList])


    const handlChanges = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value.replace(/[^a-zA-Z\s]/g, "")
        })
        // console.log("this is value",value)
    }


    const update_List_Name = () => {
        // console.log(value);
        if (value.Name.trim()) {
            AddDeleteUpadate('TablePermission/Update_ListPermission', value).then((res) => {
                setModal(false)
                toastifySuccess(res.Message)
                get_List_Table(ModuleFK);
            })
        } else {
            toastifyError('Empty field')
        }
    }


    const closeModal = () => {
        setModal(false);
    }


    return (
        <>
            {
                modal ?
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="EditTypeModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog modal-md modal-dialog-centered rounded" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>List-Module Manager</legend>
                                            <div className="row ">
                                                <div className="col-12 col-md-6 col-lg-12 mt-2">
                                                    <div class="text-field">
                                                        <input type="text" name='Name' onChange={handlChanges} value={value.Name} className='requiredColor' />
                                                        <label>Name</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="btn-box text-right mt-3 mr-1">
                                        <button type="button" class="btn btn-sm btn-success mr-2" onClick={update_List_Name} >update</button>
                                        {/* <button type="button" class="btn btn-sm btn-success mr-2" onClick={check_Validation_Error} >update</button> */}
                                        <button type="button" class="btn btn-sm btn-success" data-dismiss="modal" onClick={() => closeModal()}>Close</button>
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

export default ListPermissionEdit

export const changeArrayFormat = (data) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
    )
    return result
}

export const changeArrayFormat_WithFilter = (data) => {
    const result = data.map((sponsor) =>
        ({ value: sponsor.AgencyId, label: sponsor.Agency_Name })
    )
    return result
}