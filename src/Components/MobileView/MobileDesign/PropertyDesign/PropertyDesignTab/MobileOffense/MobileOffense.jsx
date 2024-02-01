import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { AgencyContext } from '../../../../../../Context/Agency/Index';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../../Common/AlertMsg';
import { Decrypt_Id_Name } from '../../../../../Common/Utility';
import { RequiredFieldIncident } from '../../../../../Pages/Utility/Personnel/Validation';
import { Comman_changeArrayFormat } from '../../../../../Common/ChangeArrayFormat';

const MobileOffense = () => {

    const { get_Property_Count } = useContext(AgencyContext)
    const [offenceData, setOffenceData] = useState();
    const [status, setStatus] = useState(false);
    const [modal, setModal] = useState(false)
    const [propertyOffenseID, setpropertyOffenseID] = useState();
    const [updateStatus, setUpdateStatus] = useState(0)
    const [Editval, setEditval] = useState();
    const [ownerIdDrp, setOwnerIdDrp] = useState([]);
    const [modalStatus, setModalstatus] = useState(false)

    //screen permission 
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [value, setValue] = useState({
        'PropertyID': ('PropertyID'), 
        'OffenseID': '',
        'IncidentID': 0,
        'CreatedByUserFK': ('PINID'), 
    })
    useEffect(() => {
        get_Data_Offence();
    }, [])

    const get_Data_Offence = () => {
        const val = {
            'PropertyID': ('PropertyID'), 
            'OffenseID': 0,
        }
        fetchPostData('PropertyOffense_FRW/GetData_PropertyOffense_FRW', val).then((res) => {
            if (res) {
                setOffenceData(res)
            } else {
                setOffenceData([]);
            }
        })
    }

    const [errors, setErrors] = useState({
        'OwnerIDError': '',
    })

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.OffenseID)) {
            setErrors(prevValues => { return { ...prevValues, ['OwnerIDError']: RequiredFieldIncident(value.OffenseID) } })
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
            'OffenseID': '',
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
        if (propertyOffenseID) {
            GetSingleData(propertyOffenseID)
        }
    }, [propertyOffenseID, updateStatus])

    const GetSingleData = () => {
        const val = { 'propertyOffenseID': propertyOffenseID }
        fetchPostData('PropertyOffense_FRW/GetSingleData_PropertyOffense_FRW', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    useEffect(() => {
        if (propertyOffenseID) {
            setValue({
                ...value,
                'PropertyOffenseID': propertyOffenseID,
                'OffenseID': Editval[0]?.OffenseID,
                'ModifiedByUserFK': ('PINID'),
            })
        } else {
            setValue({
                ...value,
                'OffenseID': '',
            })
        }
    }, [Editval])

    const get_OwnerID_Drp = () => {
        const val = {
            // 'IncidentID': Decrypt_Id_Name(sessionStorage.getItem('IncidentId'), 'IForIncidentId'),
            'IncidentID':('IncidentId'), 
            'OffenseID': 0,
            // 'MasterNameID': 0,
        }
        fetchPostData('PropertyOffense_FRW/GetData_InsertPropertyOffense_FRW', val).then((res) => {
            if (res) {
                setOwnerIdDrp(Comman_changeArrayFormat(res, 'CrimeID', 'Offense_Description'))
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
        var result = offenceData?.find(item => {
            if (item.OffenseID === value.OffenseID) {
                return true
            } else return false
        });
        if (result) {
            toastifyError('Offence Already Exists');
            setErrors({
                ...errors,
                ['OwnerIDError']: '',
            })
        } else if (value.OffenseID !== '') {
            AddDeleteUpadate('PropertyOffense_FRW/Insert_PropertyOffense_FRW', value).then((res) => {
                toastifySuccess(res.Message);
                get_Property_Count(null);
                get_Data_Offence();
                Reset();
                setErrors({ ...errors, ['OwnerIDError']: '', })
                setModal(false);
                setStatus(false);
            })
        } else {
            toastifyError('Offence Can`t be empty')
            setErrors({
                ...errors,
                ['OwnerIDError']: '',
            })
        }
    }

    const Update_Owner = () => {
        var result = offenceData?.find(item => {
            if (item.OffenseID !== value.OffenseID) {
                return false
            } else return true
        }
        );
        if (result) {
            toastifyError('Offence Already Exists');
            setErrors({
                ...errors,
                ['OwnerIDError']: '',
            })
        } else if (value.OffenseID !== '') {
            AddDeleteUpadate('PropertyOffense_FRW/Update_PropertyOffense_FRW', value).then((res) => {
                toastifySuccess(res.Message);
                get_Data_Offence();
                Reset();
                setErrors({
                    ...errors,
                    ['OwnerIDError']: '',
                })
                setModal(false);
                setStatus(false);
            })
        } else {
            toastifyError('Offence Can`t be empty');
            setErrors({
                ...errors,
                ['OwnerIDError']: '',
            })
        }
    }

    const closeModal = () => {
        Reset();
        setModal(false);
    }


    const columns = [
        {
            name: 'Offense Name',
            selector: (row) => row.Offense_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Delete</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 4, right: 65 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} onClick={() => { setpropertyOffenseID(row.PropertyOffenseID); setModalstatus(true); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#myModal2">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={`#`} onClick={() => { setpropertyOffenseID(row.PropertyOffenseID); setModalstatus(true); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#myModal2">
                                <i className="fa fa-trash"></i>
                            </Link>
                    }
                </div>
            </>
        }
    ]

    const set_Edit_Value = (e, row) => {
        setStatus(true);
        setModal(true)
        setUpdateStatus(updateStatus + 1);
        setpropertyOffenseID(row.PropertyOffenseID)
    }


    const setStatusFalse = (e) => {
        setStatus(false)
        setModal(true)
    }

    const DeleteOffence = () => {
        const val = {
            'propertyOffenseID': propertyOffenseID,
            'DeletedByUserFK': ('PINID'),
        }
        AddDeleteUpadate('PropertyOffense_FRW/Delete_PropertyOffense_FRW', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Property_Count(null);
                get_Data_Offence();
                Reset('');
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
                <div className="col-12 col-md-12 mt-2 pt-1 p-0 px-1" >
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
                                value={ownerIdDrp?.filter((obj) => obj.value === value?.OffenseID)}
                                isClearable
                                options={ownerIdDrp}
                                onChange={(e) => ChangeDropDown(e, 'OffenseID')}
                                placeholder="Select..."
                            />
                            <label htmlFor="" className='pt-1'>Offense</label>
                            {errors.OwnerIDError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OwnerIDError}</span>
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
                        dense
                        columns={columns}
                        data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? offenceData : '' : offenceData}
                        pagination
                        highlightOnHover
                        noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
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
                                            <button type="button" onClick={DeleteOffence} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
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

export default MobileOffense