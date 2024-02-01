import React, { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { Decrypt_Id_Name } from '../../../../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../../../../../../../Pages/Utility/Personnel/Validation';

const VictimOffense = (props) => {  
     
    const { victimID } = props
    const SelectedValue = useRef();
    const [offenseDrp, setOffenseDrp] = useState();
    const [offenseNameData, setOffenseNameData] = useState();
    const [VictimOffenseID, setVictimOffenseID] = useState();
    const [deleteStatus, setDeleteStatus] = useState(false)
    const [modalStatus, setModalstatus] = useState(false)

    const [value, setValue] = useState({
        'OffenseID': '',
        'NameID': '',
        'VictimID': victimID,
        'CreatedByUserFK':'',
    })
    const [errors, setErrors] = useState({
        'DropError': '',
    })

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.OffenseID)) {
            setErrors(prevValues => { return { ...prevValues, ['DropError']: RequiredFieldIncident(value.OffenseID) } })
        }
    }
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
        get_Offense_DropDown(); get_OffenseName_Data();
    }, [])
    const get_Offense_DropDown = () => {
        const val = {
            'IncidentID':'',
            'VictimID': victimID,
        }
        fetchPostData('VictimOffense_FRW/GetData_InsertVictimOffense_FRW', val).then((data) => {
            if (data) { setOffenseDrp(Comman_changeArrayFormat(data, 'CrimeID', 'Offense_Description')) }
            else { setOffenseDrp([]) }
        })
    }

    const get_OffenseName_Data = () => {
        const val = { 'VictimID': victimID, }
        fetchPostData('VictimOffense_FRW/GetData_VictimOffense_FRW', val).then((res) => {
            if (res) { setOffenseNameData(res) }
            else { setOffenseNameData([]); }
        })
    }

    const Add_Victim_Offense = () => {
        AddDeleteUpadate('VictimOffense_FRW/Insert_VictimOffense_FRW', value).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Offense_DropDown();
                get_OffenseName_Data();
                onClear(); setErrors({ ...value['DropError'] })
            }
        })
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

    const columns = [
        {
            name: 'Description',
            selector: (row) => row.Offense_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Action</p>,
            cell: row => <>
                <Link to={`#`} onClick={() => { setVictimOffenseID(row.VictimOffenseID); setModalstatus(true); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" data-toggle="modal" data-target="#myModal2">
                    <i className="fa fa-trash"></i>
                </Link>
            </>
        }
    ]
    const DeleteVictimOffense = () => {
        const val = {
            'VictimOffenseID': VictimOffenseID,
            'DeletedByUserFK':('PINID'),
        }
        AddDeleteUpadate('VictimOffense_FRW/Delete_VictimOffense_FRW', val).then((res) => {
            console.log(res)
            toastifySuccess(res.Message); setDeleteStatus(false)
            get_Offense_DropDown();
            get_OffenseName_Data();
            setModalstatus(false)
        })
    }
    const onClear = () => {
        SelectedValue?.current?.clearValue();
    };
    const CloseModal = () => {
        setModalstatus(false)
    }
    return (
        <>
            <div className="col-12 " id='display-not-form '>
                <div className="col-12 col-md-12 mt-2 pt-1 p-0 px-2" >
                    <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0" style={{ fontSize: '18px' }}>Offense</p>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 px-3">
                        <div className='text__dropdwon'>
                            <Select
                                name='OffenseID'
                                styles={colourStyles}
                                isClearable
                                options={offenseDrp}
                                onChange={(e) => { ChangeDropDown(e, 'OffenseID'); }}
                                placeholder="Select.."
                                ref={SelectedValue}
                            />
                            <label htmlFor="" className='pt-1'>Offense</label>
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
                        data={offenseNameData}
                        dense
                        pagination
                        selectableRowsHighlight
                        highlightOnHover
                    />
                </div>
            </div>
            {
                modalStatus ?
                    <div class="modal" id="myModal2" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s' }} data-backdrop="false">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div className="box text-center py-5">
                                    <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                                    <div className="btn-box mt-3">
                                        <button type="button" onClick={DeleteVictimOffense} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
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

export default VictimOffense