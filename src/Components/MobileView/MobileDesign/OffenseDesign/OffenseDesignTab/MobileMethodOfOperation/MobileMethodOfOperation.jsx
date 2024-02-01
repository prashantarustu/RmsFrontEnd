import React, { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { Decrypt_Id_Name } from '../../../../../Common/Utility';
import { RequiredFieldIncident } from '../../../../../Pages/Utility/Personnel/Validation';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../Common/AlertMsg';

const MobileMethodOfOperation = () => {
    const SelectedValue = useRef();
    const [status, setStatus] = useState(false);
    const [MethodOfOperationData, setMethodOfOperationData] = useState();
    const [MethodOfOperationDrp, setMethodOfOperationDrp] = useState();
    const [MethodOfOperationID, setMethodOfOperationID] = useState();
    const [modalStatus, setModalstatus] = useState(false)
    const [value, setValue] = useState({
        'CrimeMethodOfOpeationID': '',
        'MethodOfOperationID': '',
        'CreatedByUserFK': '',
        'CrimeID': '',
    })

    const [errors, setErrors] = useState({
        'MethodOfOperationError': '',
    })

    const Reset = () => {
        setValue({
            ...value,
            'MethodOfOperationID': '',
        })
        setErrors({
            'MethodOfOperationError': '',
        });
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.CrimeMethodOfOpeationID)) {
            setErrors(prevValues => { return { ...prevValues, ['MethodOfOperationError']: RequiredFieldIncident(value.CrimeMethodOfOpeationID) } })
        }
    }
    const { MethodOfOperationError } = errors

    useEffect(() => {
        if (MethodOfOperationError === 'true') {
         AddMethodOfOperation();
        }
    }, [MethodOfOperationError])

    useEffect(() => {
        get_MethodOfOperation_DropDown();
        get_MethodOfOperation_Data();
    }, [])

    const get_MethodOfOperation_Data = () => {
        const val = {
            'CrimeID': '',
        }
        fetchPostData('OffenseMethodOfOperation_FRW/GetData_OffenseMethodOfOperation_FRW', val).then((res) => {
            if (res) {
                setMethodOfOperationData(res);
            } else {
                setMethodOfOperationData([]);
            }
        })
    }

    const get_MethodOfOperation_DropDown = () => {
        const val = {
            'CrimeID': '',
        }
        fetchPostData('OffenseMethodOfOperation_FRW/GetData_InsertGetData_OffenseMethodOfOperation_FRW', val).then((data) => {
            if (data) {
                setMethodOfOperationDrp(Comman_changeArrayFormat(data, 'MethodOfOperationID', 'Description'));
            }
            else {
                setMethodOfOperationDrp([])
            }
        })
    }

    const onClear = () => {
        SelectedValue?.current?.clearValue();
    };

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

    const AddMethodOfOperation = () => {
        AddDeleteUpadate('OffenseMethodOfOperation_FRW/Insert_OffenseMethodOfOperation_FRW', value).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_MethodOfOperation_Data();
                get_MethodOfOperation_DropDown();
                Reset();
                onClear();
            } else {
                console.log("Somthing Wrong");
            }
        })
    }

    const updateMethodOfOperation = () => {
    }
    const columns = [
        {
            name: 'Description',
            selector: (row) => row.MethodOfOperation_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
            cell: row => <>

                <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" onClick={() => { setMethodOfOperationID(row.MethodOfOperationID); setModalstatus(true) }} data-toggle="modal" data-target="#myModal2">
                    <i className="fa fa-trash"></i>
                </Link>

            </>
        }
    ]
    const DeleteMethodOfOperation = () => {
        const val = {
            'MethodOfOperationID': MethodOfOperationID,
            'DeletedByUserFK': '',
        }
        AddDeleteUpadate('OffenseMethodOfOperation_FRW/Delete_OffenseMethodOfOperation_FRW', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_MethodOfOperation_Data();
                setModalstatus(false)
                get_MethodOfOperation_DropDown();
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
            <div className="col-12 col-md-12 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0" style={{ fontSize: '18px' }}>Method Of Operation</p>
                </div>
            </div>
            <div className="row ">
                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                    <div className='text__dropdwon'>
                        <Select
                            name='CrimeMethodOfOpeationID'
                            styles={colourStyles}
                            isClearable
                            options={MethodOfOperationDrp}
                            onChange={(e) => { ChangeDropDown(e, 'CrimeMethodOfOpeationID'); }}
                            placeholder="Select.."
                            ref={SelectedValue}
                        />
                        <label htmlFor="" className='pt-1'>Method Of Operation</label>
                        {errors.MethodOfOperationError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MethodOfOperationError}</span>
                        ) : null}
                    </div>
                </div>
                <div className="col-2 col-md-6 col-lg-8  mt-4 pt-2  pl-3" >
                    <Link to=''>
                        <button type="button" className="btn btn-md py-1 btn-success new-button pl-2  text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                    </Link>
                </div>
            </div>
            <div className="col-12">
                <DataTable
                    columns={columns}
                    data={MethodOfOperationData}
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
                                        <button type="button" onClick={DeleteMethodOfOperation} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
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
export default MobileMethodOfOperation