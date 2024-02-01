import React, { useRef } from 'react'
import { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../../Common/ChangeArrayFormat';
import { useState } from 'react';
import { Decrypt_Id_Name } from '../../../../../Common/Utility';
import { toastifyError, toastifySuccess } from '../../../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../../../../../Pages/Utility/Personnel/Validation';

const MobileMethodOfEntry = () => {
    const SelectedValue = useRef();
    const [modalStatus, setModalstatus] = useState(false)
    const [methodOfEntryData, setMethodOfEntryData] = useState([]);
    const [methodEntryDrp, setMethodEntryDrp] = useState();
    const [methodOfEntryId, setMethodOfEntryId] = useState();

    const [value, setValue] = useState({
        'CrimeMethodOfEntryID': '',
        'MethodOfEntryID': '',
        'CreatedByUserFK': '',
        'CrimeID': '',
    })
    const [errors, setErrors] = useState({
        'MethodOfOperationError': '',
    })
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

    const Reset = () => {
        setValue({
            ...value,
            'MethodOfEntryID': '',
        })
        setErrors({
            'MethodOfOperationError': '',
        });
    }
    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.CrimeMethodOfEntryID)) {
            setErrors(prevValues => { return { ...prevValues, ['MethodOfOperationError']: RequiredFieldIncident(value.CrimeMethodOfEntryID) } })
        }
    }
    const { MethodOfOperationError } = errors

    useEffect(() => {
        if (MethodOfOperationError === 'true') {
            if (methodOfEntryData.length < 1) {
                AddMethodEntry();
            } else {
                onClear();
                setErrors({ 'MethodOfOperationError': '', }); toastifyError("Data is already present")
            }
        }
    }, [MethodOfOperationError])

    useEffect(() => {
        get_MethodOfEntry_DropDown();
        get_MethodOfEntry_Data();
    }, [])

    const get_MethodOfEntry_Data = () => {
        const val = {
            'CrimeID': '',
        }
        fetchPostData('OffenseMethodOfEntry_FRW/GetData_OffenseMethodOfEntry_FRW', val).then((res) => {
            if (res) {
                setMethodOfEntryData(res);
            } else {
                setMethodOfEntryData([]);
            }
        })
    }

    const get_MethodOfEntry_DropDown = () => {
        const val = {
            'CrimeID': '',
        }
        fetchPostData('OffenseMethodOfEntry_FRW/GetData_InsertOffenseMethodOfEntry_FRW', val).then((data) => {
            if (data) {
                setMethodEntryDrp(Comman_changeArrayFormat(data, 'EntryMethodID', 'Description'));
            }
            else {
                setMethodEntryDrp([])
            }
        })
    }

    const AddMethodEntry = () => {
        AddDeleteUpadate('OffenseMethodOfEntry_FRW/Insert_OffenseMethodOfEntry_FRW', value).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_MethodOfEntry_Data();
                get_MethodOfEntry_DropDown();
                Reset();
                onClear();
                setErrors({ 'MethodOfOperationError': '', });
            } else {
                console.log("Somthing Wrong");
            }

        })
    }

    const columns = [
        {
            name: 'Description',
            selector: (row) => row.MethodOfEntry_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
            cell: row => <>
                <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" onClick={() => { setMethodOfEntryId(row.MethodOfEntryID); setModalstatus(true); }} data-toggle="modal" data-target="#myModal2">
                    <i className="fa fa-trash"></i>
                </Link>
            </>
        }
    ]
    const DeleteMethodOfEntry = () => {
        const val = {
            'MethodOfEntryID': methodOfEntryId,
            'DeletedByUserFK': '',
        }
        AddDeleteUpadate('OffenseMethodOfEntry_FRW/Delete_OffenseMethodOfEntry_FRW', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_MethodOfEntry_Data();
                get_MethodOfEntry_DropDown();
                setModalstatus(false)
            } else console.log("Somthing Wrong");
        })
    }
    const CloseModal = () => {
        setModalstatus(false)
    }
    const onClear = () => {
        SelectedValue?.current?.clearValue();
    };

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
            <div className="col-12 col-md-12 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0" style={{ fontSize: '18px' }}>Method Of Entry</p>
                </div>
            </div>
            <div className="row ">
                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                    <div className='text__dropdwon'>
                        <Select
                            name='CrimeMethodOfEntryID'
                            styles={colourStyles}
                            isClearable
                            options={methodEntryDrp}
                            onChange={(e) => { ChangeDropDown(e, 'CrimeMethodOfEntryID'); }}
                            placeholder="Select.."
                            ref={SelectedValue}
                        />
                        <label htmlFor="" className='pt-1'>Method Of Entry</label>
                        {errors.MethodOfOperationError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MethodOfOperationError}</span>
                        ) : null}
                    </div>
                </div>
                <div className="col-2 col-md-6 col-lg-8  mt-4 pt-2  pl-3" >
                    <button type="button" className="btn btn-md py-1 btn-success new-button pl-2  text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                </div>
            </div>
            <div className="col-12">
                <DataTable
                    columns={columns}
                    data={methodOfEntryData}
                    dense
                    pagination
                    paginationPerPage={'5'}
                    paginationRowsPerPageOptions={[5]}
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
                                        <button type="button" onClick={DeleteMethodOfEntry} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
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

export default MobileMethodOfEntry