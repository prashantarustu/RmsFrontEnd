import React, { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component';
import DatePicker from "react-datepicker";
import { Link } from 'react-router-dom';
import Select from "react-select";
import { RequiredFieldIncident } from '../../../../../../../Pages/Utility/Personnel/Validation';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../../../Common/AlertMsg';
import { Decrypt_Id_Name } from '../../../../../../../Common/Utility';
const VictimAssault = (props) => {

    const { victimID } = props
    const SelectedValue = useRef();
    //screen permission 
    const [assaultDrp, setAssaultDrp] = useState();
    const [assultData, setAssultData] = useState();
    const [nameEventAssaultID, setNameEventAssaultID] = useState();
    const [modalStatus, setModalstatus] = useState(false)

    const [value, setValue] = useState({
        'AssaultID': '',
        'NameID': '',
        'VictimID': victimID,
        'CreatedByUserFK': '',
    })

    const [errors, setErrors] = useState({
        'DropError': '',
    })

    const Reset = () => {
        setValue({
            ...value,
            'AssaultID': '',
        })
        setErrors({
            'DropError': '',
        });
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.AssaultID)) {
            setErrors(prevValues => { return { ...prevValues, ['DropError']: RequiredFieldIncident(value.AssaultID) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DropError } = errors

    useEffect(() => {
        if (DropError === 'true') {
            Add_Victim_Offense();
        }
    }, [DropError])

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
        get_Assults_Drp();
        get_Assults_Data();
    }, [])

    const get_Assults_Data = () => {
        const val = {
            'VictimID': victimID,
        }
        fetchPostData('VictimAssaultType_FRW/GetData_VictimAssaultType_FRW', val).then((res) => {
            if (res) {
                setAssultData(res)
            } else {
                setAssultData([]);
            }
        })
    }

    const get_Assults_Drp = () => {
        const val = {
            'VictimID': victimID,
        }
        fetchPostData('VictimAssaultType_FRW/GetData_InsertVictimAssaultType_FRW', val).then((data) => {
            if (data) {
                setAssaultDrp(Comman_changeArrayFormat(data, 'AssaultTypeID', 'Description'))
            } else {
                setAssaultDrp([])
            }
        })
    }

    const Add_Victim_Offense = () => {
        AddDeleteUpadate('VictimAssaultType_FRW/Insert_VictimAssaultType_FRW', value).then((res) => {
            if (res) {
                toastifySuccess(res.Message)
                get_Assults_Data();
                get_Assults_Drp();
                onClear()
                Reset();
                setErrors({
                    'DropError': '',
                });
            }
        })
    }

    const onClear = () => {
        SelectedValue?.current?.clearValue();
    };

    const columns = [
        {
            name: 'Description',
            selector: (row) => row.Assault_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Action</p>,
            cell: row => <>
                <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => {
                    setNameEventAssaultID(row.NameEventAssaultID); setModalstatus(true)
                }} data-toggle="modal" data-target="#myModal2">
                    <i className="fa fa-trash"></i>
                </Link>
            </>
        }
    ]
    const DeleteAssults = () => {
        const val = {
            'NameEventAssaultID': nameEventAssaultID,
            'DeletedByUserFK': '',
        }
        AddDeleteUpadate('VictimAssaultType_FRW/Delete_VictimAssaultType_FRW', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Assults_Drp();
                get_Assults_Data();
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
                        <p className="p-0 m-0" style={{ fontSize: '18px' }}>Assault Type</p>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 px-3">
                        <div className='text__dropdwon'>
                            <Select
                                name='AssaultID'
                                styles={colourStyles}
                                isClearable
                                options={assaultDrp}
                                onChange={(e) => { ChangeDropDown(e, 'AssaultID'); }}
                                placeholder="Select.."
                                ref={SelectedValue}
                            />
                            <label htmlFor="" className='pt-1'>Assault Type</label>
                            {errors.DropError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DropError}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-2 col-md-6 col-lg-8  mt-4 pt-2  pl-3" >
                        <Link to=''>
                            <button type="button" className="btn btn-md py-1 btn-success new-button pl-2  text-center" onClick={() => { check_Validation_Error(); }} >Save</button>
                        </Link>
                    </div>
                </div>
                <div className="col-12">
                    <DataTable
                        columns={columns}
                        data={assultData}
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
                                            <button type="button" onClick={DeleteAssults} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                                            <button type="button" onClick={() => { CloseModal(); }} className="btn btn-sm btn-secondary ml-2 " > Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <></>
                }
            </div>
        </>
    )
}

export default VictimAssault