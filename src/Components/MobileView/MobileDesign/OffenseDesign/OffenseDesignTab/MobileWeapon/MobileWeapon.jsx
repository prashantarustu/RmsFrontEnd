import React from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { RequiredFieldIncident } from '../../../../../Pages/Utility/Personnel/Validation';
import { Decrypt_Id_Name } from '../../../../../Common/Utility';
import { useState } from 'react';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../../../Common/AlertMsg';
import { useRef } from 'react';
import { useEffect } from 'react';

const MobileWeapon = () => {
    const SelectedValue = useRef();
    const [status, setStatus] = useState(false);
    //screen permission 
    const [WeaponData, setWeaponData] = useState();
    const [WeaponDrp, setWeaponDrp] = useState();
    const [WeaponID, setWeaponID] = useState();
    const [loder, setLoder] = useState(false)
    const [modalStatus, setModalstatus] = useState(false)

    const [value, setValue] = useState({
        'WeaponTypeID': '',
        'WeaponID': '',
        'CreatedByUserFK': '',
        'CrimeID': '',
    })

    const [errors, setErrors] = useState({
        'MethodOfOperationError': '',
    })

    const Reset = () => {
        setValue({
            ...value,
            'WeaponID': '',
        })
        setErrors({
            'MethodOfOperationError': '',
        });
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.WeaponTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['MethodOfOperationError']: RequiredFieldIncident(value.WeaponTypeID) } })
        }
    }
    const { MethodOfOperationError } = errors

    useEffect(() => {
        if (MethodOfOperationError === 'true') {
            AddWeapon();
        }
    }, [MethodOfOperationError])

   
    useEffect(() => {
        get_Weapon_DropDown();
        get_Weapon_Data();
    }, [])

    const get_Weapon_Data = () => {
        const val = {
            'CrimeID': '',
        }
        fetchPostData('OffenseWeapon_FRW/GetData_OffenseWeapon_FRW', val).then((res) => {
            if (res) {
                setWeaponData(res); setLoder(true)
            } else {
                setWeaponData([]); setLoder(true)
            }
        })
    }

    const get_Weapon_DropDown = () => {
        const val = {
            'CrimeID': '',
        }
        fetchPostData('OffenseWeapon_FRW/GetData_InsertOffenseWeapon_FRW', val).then((data) => {
            if (data) {
                setWeaponDrp(Comman_changeArrayFormat(data, 'WeaponID', 'Description'));
            }
            else {
                setWeaponDrp([])
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

    const AddWeapon = () => {
        AddDeleteUpadate('OffenseWeapon_FRW/Insert_OffenseWeapon_FRW', value).then((res) => {
            if (res) {
                toastifySuccess(res.Message); setErrors({ 'MethodOfOperationError': '' })
                get_Weapon_Data();
                get_Weapon_DropDown();
                Reset();
                onClear();
            } else {
                console.log("Somthing Wrong");
            }
        })
    }

    const columns = [
        {
            name: 'Description',
            selector: (row) => row.Weapon_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
            cell: row => <>
                <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" onClick={() => { setWeaponID(row.WeaponID); setModalstatus(true); }} data-toggle="modal" data-target="#myModal2">
                    <i className="fa fa-trash"></i>
                </Link>
            </>
        }
    ]
    const CloseModal = () => {
        setModalstatus(false)
    }
    const DeleteWeapon = () => {
        const val = {
            'WeaponID': WeaponID,
            'DeletedByUserFK': '',
        }
        AddDeleteUpadate('OffenseWeapon_FRW/Delete_OffenseWeapon_FRW', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Weapon_Data();
                get_Weapon_DropDown();
                setModalstatus(false)
            } else console.log("Somthing Wrong");
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
    return (
        <>
            <div className="col-12 col-md-12 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0" style={{ fontSize: '18px' }}>Weapon</p>
                </div>
            </div>
            <div className="row ">
                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                    <div className='text__dropdwon'>
                        <Select
                            name='WeaponTypeID'
                            styles={colourStyles}
                            isClearable
                            options={WeaponDrp}
                            onChange={(e) => { ChangeDropDown(e, 'WeaponTypeID'); }}
                            placeholder="Select.."
                            ref={SelectedValue}
                        />
                        <label htmlFor="">Weapon</label>
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
                    data={WeaponData}
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
                                        <button type="button" onClick={DeleteWeapon} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
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

export default MobileWeapon