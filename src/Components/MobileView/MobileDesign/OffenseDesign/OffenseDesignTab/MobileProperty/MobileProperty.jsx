import React from 'react'
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { Decrypt_Id_Name } from '../../../../../Common/Utility';
import { RequiredFieldIncident } from '../../../../../Pages/Utility/Personnel/Validation';
import { useEffect } from 'react';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { toastifySuccess } from '../../../../../Common/AlertMsg';
import { useRef } from 'react';
import { Comman_changeArrayFormat } from '../../../../../Common/ChangeArrayFormat';
import DeletePopUpModal from '../../../../../Common/DeleteModal';

const MobileProperty = () => {

    const SelectedValue = useRef();
    //screen permission 
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [PropertyDrp, setPropertyDrp] = useState();
    const [PropertyData, setPropertyData] = useState();
    const [PropertyOffenseID, setPropertyOffenseID] = useState();
    const [deleteStatus, setDeleteStatus] = useState(false)
    const [loder, setLoder] = useState(false)

    const [value, setValue] = useState({
        'OffenseID': '',
        'IncidentId': '',
        'PropertyID': '',
        'CreatedByUserFK':  '',
    })

    const [errors, setErrors] = useState({
        'DropError': '',
    })

    const Reset = () => {
        setValue({
            ...value,
            'PropertyID': '',
        })
        setErrors({
            'DropError': '',
        });
    }
    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.PropertyID)) {
            setErrors(prevValues => { return { ...prevValues, ['DropError']: RequiredFieldIncident(value.PropertyID) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DropError } = errors

    useEffect(() => {
        if (DropError === 'true') {
            Add_Offender();
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
        get_Property_DropDown();
        get_Property_Data();
    }, [])

    const get_Property_Data = () => {
        const val = {
            'IncidentId': '',
            'OffenseID': '',
        }
        fetchPostData('PropertyOffense_FRW/GetData_PropertyOffense_FRW', val).then((res) => {
            if (res) {
                console.log(res);
                setPropertyData(res);
            } else {
                setPropertyData([]);
            }
        })
    }

    const get_Property_DropDown = () => {
        const val = {
            'IncidentId': '',
            'OffenseID': '',
        }
        fetchPostData('PropertyOffense_FRW/GetData_InsertPropertyOffense_FRW', val).then((data) => {
            if (data) {
                console.log(data)
                setPropertyDrp(Comman_changeArrayFormat(data, 'PropertyID', 'PropertyNumber'))
            } else {
                setPropertyDrp([])
            }
        })
    }

    const Add_Offender = () => {
        AddDeleteUpadate('PropertyOffense_FRW/Insert_PropertyOffense_FRW', value).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                // get_Offence_Count(null)
                get_Property_DropDown();
                get_Property_Data();
                Reset();
                onClear(); setErrors({ ...value['DropError'] })
            }
        })
    }

    const DeleteOffender = () => {
        const val = {
            'PropertyOffenseID': PropertyOffenseID,
            'DeletedByUserFK':''
        }
        AddDeleteUpadate('PropertyOffense_FRW/Delete_PropertyOffense_FRW', val).then((res) => {
            console.log(res)
            toastifySuccess(res.Message);
            // get_Offence_Count(null)
            setDeleteStatus(false)
            get_Property_DropDown();
            get_Property_Data();
        })
    }

    const onClear = () => {
        SelectedValue?.current?.clearValue();
    };

    const columns = [
        {
            name: 'Property Number',
            selector: (row) => row.PropertyNumber,
            sortable: true
        },
        {
            name: 'PropertyType',
            selector: (row) => row.PropertyType_Description,
            sortable: true
        },
        {
            name: 'Property Reason',
            selector: (row) => row.PropertyLossCode_Description,
            sortable: true
        },
        {
            name: 'PropertyValue',
            // selector: (row) => row.Value,
            selector: (row) => row.Value,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
            cell: row => <>
                {
                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                        <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setDeleteStatus(true); setPropertyOffenseID(row.PropertyOffenseID) }} data-toggle="modal" data-target="#DeleteModal">
                            <i className="fa fa-trash"></i>
                        </Link>
                        : <></>
                        : <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setDeleteStatus(true); setPropertyOffenseID(row.PropertyOffenseID) }} data-toggle="modal" data-target="#DeleteModal">
                            <i className="fa fa-trash"></i>
                        </Link>
                }
            </>
        }
    ]

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
                    <p className="p-0 m-0" style={{ fontSize: '18px' }}>Property</p>
                </div>
            </div>
            <div className="row ">
                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                    <div className='text__dropdwon'>
                        <Select
                            name='PropertyID'
                            styles={colourStyles}
                            isClearable
                            options={PropertyDrp}
                            onChange={(e) => { ChangeDropDown(e, 'PropertyID'); }}
                            placeholder="Select.."
                            ref={SelectedValue}
                        />
                        <label htmlFor="" className='pt-1'>Property</label>
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
                    data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? PropertyData : '' : PropertyData}
                    dense
                    pagination
                    selectableRowsHighlight
                    highlightOnHover
                />
            </div>
            <DeletePopUpModal func={DeleteOffender} />
        </>
    )
}

export default MobileProperty