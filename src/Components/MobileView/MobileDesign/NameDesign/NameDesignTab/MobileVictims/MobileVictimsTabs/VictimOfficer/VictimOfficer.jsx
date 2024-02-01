import React from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { AddDeleteUpadate, fetchPostData } from '../../../../../../../hooks/Api';
import { toastifySuccess } from '../../../../../../../Common/AlertMsg';
import { Comman_changeArrayFormat } from '../../../../../../../Common/ChangeArrayFormat';
import { Decrypt_Id_Name } from '../../../../../../../Common/Utility';
import { useEffect } from 'react';
import { RequiredFieldIncident } from '../../../../../../../Pages/Utility/Personnel/Validation';
import { useState } from 'react';
import { useRef } from 'react';

const VictimOfficer = (props) => {

    const { victimID } = props
    const SelectedValue = useRef();
    //screen permission 
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [officerDrpData, setOfficerDrpData] = useState();
    const [VictimOfficerData, setVictimOfficerData] = useState();
    const [VictimOfficerID, setVictimOfficerID] = useState();
    const [modalStatus, setModalstatus] = useState(false)

    const [value, setValue] = useState({
        'OfficerID': '', 'VictimID': victimID,
        'NameID': ('NameID'), 
        'CreatedByUserFK':('PINID'), 
    })

    const [errors, setErrors] = useState({
        'DropError': '',
    })

    const Reset = () => {
        setValue({ ...value, 'OfficerID': '', })
        setErrors({ 'DropError': '', });
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.OfficerID)) {
            setErrors(prevValues => { return { ...prevValues, ['DropError']: RequiredFieldIncident(value.OfficerID) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DropError } = errors

    useEffect(() => {
        if (DropError === 'true') {
            Add_Victim_Officer();
        }
    }, [DropError])

    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({ ...value, [name]: e.value })
        } else setValue({ ...value, [name]: null })
    }

    useEffect(() => {
        get_Victim_Officer_Drp(); get_Victim_Officer_Data();
    }, [])

    const get_Victim_Officer_Data = () => {
        const val = {
            'VictimID': victimID,
        }
        fetchPostData('VictimOfficer_FRW/GetData_VictimOfficer_FRW', val).then((res) => {
            if (res) {
                setVictimOfficerData(res)
            } else { setVictimOfficerData([]); }
        })
    }

    const get_Victim_Officer_Drp = () => {
        const val = {
            'VictimID': victimID,
            'AgencyID': ('AgencyID'), 
        }
        fetchPostData('VictimOfficer_FRW/GetData_InsertVictimOfficer_FRW', val).then((data) => {
            if (data) {
                setOfficerDrpData(Comman_changeArrayFormat(data, 'PINID', 'OfficerName'))
            } else { setOfficerDrpData([]) }
        })
    }

    const Add_Victim_Officer = () => {
        AddDeleteUpadate('VictimOfficer_FRW/Insert_VictimOfficer_FRW', value).then((res) => {
            if (res) {
                toastifySuccess(res.Message)
                get_Victim_Officer_Data(); get_Victim_Officer_Drp();
                onClear(); Reset(); setErrors({ 'DropError': '', });
            }
        })
    }
    const onClear = () => {
        SelectedValue?.current?.clearValue();
    };
    const columns = [
        {
            name: 'Description',
            selector: (row) => row.Officer_Name,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Action</p>,
            cell: row => <>
                <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setVictimOfficerID(row.VictimOfficerID); setModalstatus(true) }} data-toggle="modal" data-target="#myModal2">
                    <i className="fa fa-trash"></i>
                </Link>
            </>
        }
    ]
    const Delete_victim_Officer = () => {
        const val = {
            'VictimOfficerID': VictimOfficerID,
            'DeletedByUserFK': ('PINID'),
        }
        AddDeleteUpadate('VictimOfficer_FRW/Delete_VictimOfficer_FRW', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Victim_Officer_Drp();
                get_Victim_Officer_Data();
                setModalstatus(false)
            } else console.log("Somthing Wrong");
        })
    }

    const CloseModal = () => {
        setModalstatus(false)
    }

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 41,
            fontSize: 18,
            margintop: 2,
            boxShadow: 0,
        }),
    }
    return (
        <>
            <div className="col-12 " id='display-not-form '>
                <div className="col-12 col-md-12 mt-2 pt-1 p-0 px-2" >
                    <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0" style={{ fontSize: '18px' }}>Officer</p>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 px-3">
                        <div className='text__dropdwon'>
                            <Select
                                name='OfficerID'
                                styles={colourStyles}
                                isClearable
                                options={officerDrpData}
                                onChange={(e) => { ChangeDropDown(e, 'OfficerID'); }}
                                placeholder="Select.."
                                ref={SelectedValue}
                            />
                            <label htmlFor="">Officer</label>
                            {errors.DropError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DropError}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-2 col-md-6 col-lg-8  mt-4 pt-2  pl-3" >
                        <Link to=''>
                            <button type="button" className="btn btn-md py-1 btn-success new-button pl-2  text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                        </Link>
                    </div>
                </div>
                <DataTable
                    columns={columns}
                    data={VictimOfficerData}
                    dense
                    pagination
                    paginationPerPage={'5'}
                    paginationRowsPerPageOptions={[5, 15, 20]}
                    highlightOnHover
                    responsive
                    className='mobile-datatable'
                    showPaginationBottom={5}
                    subHeaderComponent
                />
            </div>
            {
                modalStatus ?
                    <div class="modal" id="myModal2" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s' }} data-backdrop="false">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div className="box text-center py-5">
                                    <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                                    <div className="btn-box mt-3">
                                        <button type="button" onClick={Delete_victim_Officer} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                                        <button type="button" onClick={() => { CloseModal(); }} className="btn btn-sm btn-secondary ml-2 " > Cancel</button>
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

export default VictimOfficer