import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { Decrypt_Id_Name } from '../../../../../../../Common/Utility';
import { ORIValidator } from '../../../../../../../Pages/Agency/AgencyValidation/validators';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../../../../Common/AlertMsg';

const VictimORI = (props) => {
    const { victimID } = props
    const [oriData, setOriData] = useState();
    const [oriId, setOriId] = useState();
    const [status, setStatus] = useState(false);
    const [editval, setEditval] = useState();
    const [modalStatus, setModalstatus] = useState(false)

    const [value, setValue] = useState({
        'ORI': '',
        'NameID': Decrypt_Id_Name(sessionStorage.getItem('NameID'), 'NForNameId'),
        'VictimID': victimID,
        'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        'ModifiedByUserFK': '',
        'ORIID': '',
    })

    const [errors, setErrors] = useState({
        'DescriptionError': '',
    })

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'ORI': editval?.ORI,
                'ORIID': editval?.ORIID,
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
            })
        } else {
            setValue({
                ...value,
                'ORI': '',
                'ORIID': '',
            })
        }
    }, [status])

    const Reset = () => {
        setValue({
            ...value,
            'ORI': '',
        })
        setErrors({
            ...errors,
            'DescriptionError': '',
        })
    }

    const check_Validation_Error = (e) => {
        if (ORIValidator(value.ORI)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: ORIValidator(value.ORI) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError } = errors

    useEffect(() => {
        if (DescriptionError === 'true') {
            if (status) UpdateORI();
            else InsertORI();
        }
    }, [DescriptionError])

    useEffect(() => {
        get_Data_ORI();
    }, []);

    const get_Data_ORI = () => {
        const val = {
            'VictimID': victimID,
        }
        fetchPostData('VictimORI_FRW/GetData_VictimORI_FRW', val).then((res) => {
            if (res) {
                setOriData(res)
            } else {
                setOriData([]);
            }
        })
    }

    const handlChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
    }

    const InsertORI = () => {
        var result = oriData?.find(item => {
            if (item.ORI) {
                if (item.ORI.toLowerCase() === value.ORI.toLowerCase()) {
                    return true
                } else return false
            }
        })
        if (result) {
            if (result) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('VictimORI_FRW/Insert_VictimORI_FRW', value).then((res) => {
                if (res) {
                    toastifySuccess(res.Message);
                    get_Data_ORI();
                    Reset();
                    setErrors({
                        ...errors,
                        'DescriptionError': '',
                    })
                } else {
                    console.log("Somthing Wrong");
                }
            })
        }
    }

    const UpdateORI = () => {
        var result = oriData?.find(item => {
            if (item.ORI) {
                if (item.ORI.toLowerCase() === value.ORI.toLowerCase()) {
                    return true
                } else return false
            }
        })
        if (result) {
            toastifyError('Description Already Exists')
            setErrors({ ...errors, ['DescriptionError']: '' })
        } else {
            AddDeleteUpadate('VictimORI_FRW/Update_VictimORI_FRW', value).then((res) => {
                if (res) {
                    toastifySuccess(res.Message);
                    get_Data_ORI();
                    Reset();
                    setStatus(false);
                    setModalstatus(false);
                    setErrors({
                        ...errors,
                        'DescriptionError': '',
                    })
                } else {
                    console.log("Somthing Wrong");
                }
            })
        }
    }

    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, }}>
                    <Link to={''} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setEditvalue(row) }}>
                        <i className="fa fa-edit"></i>
                    </Link>

                </div>

            </>
        },
        {
            name: 'Description',
            selector: (row) => row.ORI.toUpperCase(),
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, left: 25 }}>

                    <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setOriId(row.ORIID); setModalstatus(true); }} data-toggle="modal" data-target="#myModal2">
                        <i className="fa fa-trash"></i>
                    </Link>

                </div>
            </>
        }
    ]

    const setEditvalue = (row) => {
        setEditval(row);
        setStatus(true)
        setOriId(row.ORIID)
    }

    const CancelButton = () => {
        Reset();
        setStatus(false);
    }

    const DeleteotherCode = () => {
        const val = {
            'ORIID': oriId,
            'DeletedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        }
        AddDeleteUpadate('VictimORI_FRW/Delete_VictimORI_FRW', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Data_ORI();
                setModalstatus(false);
            } else console.log("Somthing Wrong");
        })
    }
    const CloseModal = () => {
        setModalstatus(false);
    }

    return (
        <>
            <div className="col-12 " id='display-not-form '>
                <div className="col-12 col-md-12 mt-2 pt-1 p-0 px-2" >
                    <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0" style={{ fontSize: '18px' }}>ORI</p>
                    </div>
                </div>
                <div className="row px-2">
                    <div className="col-6 col-md-6 col-lg-4 mt-3 ">
                        <div class="text-mobile">
                            <input type="text" name='ORI' maxLength={9} style={{ textTransform: "uppercase" }} className='requiredColor' onChange={handlChange} value={value?.ORI} required />
                            <label>ORI</label>
                            {errors.DescriptionError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-2 col-md-6 col-lg-8  mt-4 pt-2  pl-3" >
                        {/* <Link to=''>
                            <button type="button" className="btn btn-md py-1 btn-success new-button pl-2  text-center" >Save</button>
                        </Link> */}
                        {
                            status ?
                                <>
                                    <button type="button" className="btn btn-md py-1 btn-success new-button pl-2 mr-2 text-center" onClick={() => { check_Validation_Error(); }}>Update</button>
                                </>
                                :
                                <>
                                    <button type="button" className="btn btn-md py-1 btn-success new-button pl-2 mr-2 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                                </>
                        }
                        <Link to=''>
                            <button type="button" className="btn btn-md py-1 btn-success new-button pl-2  text-center" onClick={() => { CancelButton(); }} >Cancel</button>
                        </Link>
                    </div>
                </div>
                <div className="col-12">
                    <DataTable
                        columns={columns}
                        data={oriData}
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
                                            <button type="button" onClick={DeleteotherCode} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
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

export default VictimORI