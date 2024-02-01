import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { AgencyContext } from '../../../../../../Context/Agency/Index';
import { Decrypt_Id_Name } from '../../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../../../../../Pages/Utility/Personnel/Validation';
import { Comman_changeArrayFormat } from '../../../../../Common/ChangeArrayFormat';

const MobileOwner = () => {

    const { get_Property_Count } = useContext(AgencyContext)
    const [ownerData, setOwnerData] = useState();
    const [status, setStatus] = useState(false);
    const [modal, setModal] = useState(false)
    const [propertyOwnerID, setPropertyOwnerID] = useState();
    const [updateStatus, setUpdateStatus] = useState(0)
    const [Editval, setEditval] = useState();
    const [ownerIdDrp, setOwnerIdDrp] = useState([]);
    const [modalStatus, setModalstatus] = useState(false)

    const [value, setValue] = useState({
        'PropertyID':('PropertyID'), 
        'OwnerID': '',
        'IsDefaultOwner': '',
        'PropertyOwnerID': '',
        'CreatedByUserFK': ('PINID'),
    })

    useEffect(() => {
        get_Data_Owner();
    }, [])

    const get_Data_Owner = () => {
        const val = {
            'PropertyID': ('PropertyID'), 
        }
        fetchPostData('PropertyOwner_FRW/GetData_PropertyOwner_FRW', val).then((res) => {
            if (res) {
                setOwnerData(res)
            } else {
                setOwnerData([]);
            }
        })
    }


    const columns = [
        {
            name: 'Owner Name',
            selector: (row) => row.Owner_Name,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Action</p>,
            cell: row => <>
                <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" onClick={() => { setPropertyOwnerID(row.PropertyOwnerID); setModalstatus(true); }} data-toggle="modal" data-target="#myModal2">
                    <i className="fa fa-trash"></i>
                </Link>
            </>
        }
    ]
    const set_Edit_Value = (e, row) => {
        setStatus(true);
        setModal(true)
        setUpdateStatus(updateStatus + 1);
        setPropertyOwnerID(row.PropertyOwnerID)
    }

    const setStatusFalse = (e) => {
        setStatus(false)
        setModal(true)
    }

    const DeleteOwner = () => {
        const val = {
            'PropertyOwnerID': propertyOwnerID,
            'DeletedByUserFK':('PINID'),
        }
        AddDeleteUpadate('PropertyOwner_FRW/Delete_PropertyOwner_FRW', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Property_Count(null);
                get_Data_Owner();
                Reset();
                setModalstatus(false)
            } else console.log("Somthing Wrong");
        })
    }


    const [errors, setErrors] = useState({
        'OwnerIDError': '',
    })

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.OwnerID)) {
            setErrors(prevValues => { return { ...prevValues, ['OwnerIDError']: RequiredFieldIncident(value.OwnerID) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { OwnerIDError } = errors

    useEffect(() => {
        if (OwnerIDError === 'true') {
            if (status) Update_Owner()
            else Add_Owner()
        }
    }, [OwnerIDError])

    const Reset = () => {
        setValue({
            ...value,
            'OwnerID': '',
            'IsDefaultOwner': '',
        })
        setErrors({
            ...errors,
            ['OwnerIDError']: '',
        })
    }

    useEffect(() => {
        get_OwnerID_Drp();
    }, [])

    useEffect(() => {
        if (propertyOwnerID) {
            GetSingleData(propertyOwnerID)
        }
    }, [propertyOwnerID, updateStatus])

    const GetSingleData = () => {
        const val = { 'PropertyOwnerID': propertyOwnerID }
        fetchPostData('PropertyOwner_FRW/GetSingleData_PropertyOwner_FRW', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    useEffect(() => {
        if (propertyOwnerID) {
            setValue({
                ...value,
                'PropertyOwnerID': propertyOwnerID,
                // 'PropertyOwnerID': Editval[0]?.PropertyOwnerID,
                'OwnerID': Editval[0]?.OwnerID,
                'IsDefaultOwner': Editval[0]?.IsDefaultOwner,
                'ModifiedByUserFK': ('PINID'),
            })
        } else {
            setValue({
                ...value,
                'OwnerID': '',
                'IsDefaultOwner': '',
            })
        }
    }, [Editval])

    const get_OwnerID_Drp = () => {
        const val = {
            'IncidentID': ('IncidentId'), 

        }
        fetchPostData('Arrest/GetDataDropDown_Arrestee', val).then((res) => {
            if (res) {
                setOwnerIdDrp(Comman_changeArrayFormat(res, 'NameID', 'Arrestee_Name'))
            } else {
                setOwnerIdDrp([]);
            }
        })
    }

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

    const HandleChanges = (e) => {
        if (e.target.name === 'IsDefaultOwner') {
            setValue({
                ...value,
                [e.target.name]: e.target.checked
            })
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const Add_Owner = () => {
        var result = ownerData?.find(item => {
            if (item.OwnerID === value.OwnerID) {
                return true
            } else return false
        });
        if (result) {
            toastifyError('Owner Already Exists')
            setErrors({
                ...errors,
                ['OwnerIDError']: '',
            })
        } else {
            AddDeleteUpadate('PropertyOwner_FRW/Insert_PropertyOwner_FRW', value).then((res) => {
                toastifySuccess(res.Message);
                // get_Property_Count(null);
                get_Data_Owner();
                Reset();
                setErrors({
                    ...errors,
                    ['OwnerIDError']: '',
                })
                setModal(false);
                setStatus(false);
            })
        }
    }

    const Update_Owner = () => {
        var result = ownerData?.find(item => {
            if (item.PropertyOwnerID != value.PropertyOwnerID) {
                if (item.OwnerID === value.OwnerID) {
                    return true
                } else return false
            }
        });
        if (result) {
            toastifyError('Owner Already Exists');
            setErrors({
                ...errors,
                ['OwnerIDError']: '',
            });
        } else {
            AddDeleteUpadate('PropertyOwner_FRW/Update_PropertyOwner_FRW', value).then((res) => {
                toastifySuccess(res.Message);
                get_Data_Owner();
                Reset();
                setErrors({
                    ...errors,
                    ['OwnerIDError']: '',
                })
                setModal(false);
                setStatus(false);
            })
        }
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

                <div className="col-12 col-md-12 mt-2 pt-1 p-0 px-1" >
                    <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0" style={{ fontSize: '18px' }}>Owner</p>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 px-3">
                        <div className='text__dropdwon'>
                            <Select
                                name='OwnerID'
                                styles={colourStyles}
                                value={ownerIdDrp?.filter((obj) => obj.value === value?.OwnerID)}
                                isClearable
                                options={ownerIdDrp}
                                onChange={(e) => ChangeDropDown(e, 'OwnerID')}
                                placeholder="Select..."
                            />
                            <label htmlFor="" className='pt-1'>Owner</label>
                            {errors.OwnerIDError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OwnerIDError}</span>
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
                        data={ownerData}
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
                                            <button type="button" onClick={DeleteOwner} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
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

export default MobileOwner