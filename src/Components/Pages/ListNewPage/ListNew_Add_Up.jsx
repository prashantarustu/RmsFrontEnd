import React, { useContext, useState } from 'react'
import Select from "react-select";
import { colourStyles } from '../../Common/Utility'
import { AddDeleteUpadate } from '../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../Common/AlertMsg';
import { AgencyContext } from '../../../Context/Agency/Index';

const ListNew_Add_Up = ({ statusData, value, setValue, modalStatus, setModalStatus, resetHooks, toUserName }) => {
    const { getPersonnelList, ws, sendMessage} = useContext(AgencyContext);

    const handleChange = (e) => {
        if (e) setValue(pre => { return { ...pre, ['StatusCode']: e.label, ['PinActivityID']: e.value } })
        else setValue(pre => { return { ...pre, ['StatusCode']: null, ['PinActivityID']: null } })
    }

    const AssignIncident = (e) => {
        e.preventDefault()
        AddDeleteUpadate('CADIncidentStatus/InsertAssignStatus', value)
            .then((res) => {
                if (res.success) {
                    sendMessage(ws, toUserName, 'assign'); toastifySuccess(res.Message); setModalStatus(false); getPersonnelList(); resetHooks()
                }
            })
    }

    return (
        <>
            {
                modalStatus &&
                <div class="modal fade " style={{ background: "rgba(0,0,0, 0.5)" }} id="AssignModal" tabindex="-1" data-backdrop="false" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div class="modal-header px-3 p-2">
                                <h5 class="modal-title">Status List</h5>
                                <button type="button" class="close btn-modal" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" style={{ color: 'red', fontSize: '20px', }}>&times;</span>
                                </button>
                            </div>
                            <div className="box px-2">
                                <div className="row ">
                                    <div class="col-6 col-md-6 pt-1 mb-3 col-lg-6 ml-5  dropdown__box">
                                        <Select
                                            styles={colourStyles}
                                            value={statusData?.filter((obj) => obj.label === value?.StatusCode)}
                                            isClearable
                                            options={statusData}
                                            onChange={(e) => handleChange(e)}
                                            placeholder="Select..."
                                        />
                                        {/* <label htmlFor='' className='mt-1'>Status Type</label> */}
                                    </div>
                                    <div className=" col-6 col-md-6 pt-1 mb-3 col-lg-3 mt-3 btn-box text-right">
                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={AssignIncident} >Assign</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </>
    )
}

export default ListNew_Add_Up