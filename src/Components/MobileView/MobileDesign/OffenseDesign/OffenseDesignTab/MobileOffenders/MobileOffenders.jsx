import React from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select";
import DeletePopUpModal from '../../../../../Common/DeleteModal';
import { useState } from 'react';
import { Decrypt_Id_Name, getShowingWithOutTime } from '../../../../../Common/Utility';
import { RequiredFieldIncident } from '../../../../../Pages/Utility/Personnel/Validation';
import { useEffect } from 'react';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../Common/AlertMsg';
import { useRef } from 'react';

const MobileOffenders = () => {
    const SelectedValue = useRef();
    //screen permission 
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [offenseDrp, setOffenseDrp] = useState();
    const [offenseNameData, setOffenseNameData] = useState();
    const [OffenderOffenseID, setOffenderOffenseID] = useState();
    const [deleteStatus, setDeleteStatus] = useState(false)
    const [loder, setLoder] = useState(false)

    const [value, setValue] = useState({
        'OffenseID': '',
        'NameID': "",
        'OffenderOffenseID': '',
        'CreatedByUserFK': '',
    })

    const [errors, setErrors] = useState({
        'DropError': '',
    })

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.NameID)) {
            setErrors(prevValues => { return { ...prevValues, ['DropError']: RequiredFieldIncident(value.NameID) } })
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
        get_Offender_DropDown();
        get_Offender_Data();
    }, [])

    const get_Offender_Data = () => {
        const val = {
            'OffenseID': '',
        }
        fetchPostData('OffenderOffense_FRW/GetData_OffenderOffenseName_FRW', val).then((res) => {
            if (res) {
                console.log(res);
                setOffenseNameData(res);
            } else {
                setOffenseNameData([]);
            }
        })
    }

    const get_Offender_DropDown = () => {
        const val = {
            'IncidentID':'',
            'OffenseID': ('OffenseCrimeId') ? '' : '',
        }
        console.log(val)
        fetchPostData('OffenderOffense_FRW/GetData_InsertOffenderName_FRW', val).then((data) => {
            if (data) {
                console.log(data)
                setOffenseDrp(Comman_changeArrayFormat(data, 'NameID', 'Name'))
            } else {
                setOffenseDrp([])
            }
        })
    }

    const Add_Offender = () => {
        AddDeleteUpadate('OffenderOffense_FRW/Insert_OffenderOffense_FRW', value).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Offender_DropDown();
                get_Offender_Data();
                onClear(); setErrors({ ...value['DropError'] })
            }
        })
    }

    const DeleteOffender = () => {
        const val = {
            'OffenderOffenseID': OffenderOffenseID,
            'DeletedByUserFK': ''
        }
        AddDeleteUpadate('OffenderOffense_FRW/Delete_OffenderOffense_FRW', val).then((res) => {
            toastifySuccess(res.Message);
            setDeleteStatus(false)
            get_Offender_DropDown();
            get_Offender_Data();
        })
    }

    const onClear = () => {
        SelectedValue?.current?.clearValue();
    };

    const columns = [
        {
            name: 'Name',
            selector: (row) => row.Name,
            sortable: true
        },
        {
            name: 'DateOfBirth',
            selector: (row) => row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : " ",
            sortable: true
        },
        {
            name: 'Gender',
            selector: (row) => row.Gender,
            sortable: true
        },
        {
            name: 'SSN',
            selector: (row) => row.SSN,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Delete</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, right: 65 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setDeleteStatus(true); setOffenderOffenseID(row.OffenderOffenseID) }} data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setDeleteStatus(true); setOffenderOffenseID(row.OffenderOffenseID) }} data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                    }
                </div>
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
                    <p className="p-0 m-0" style={{ fontSize: '18px' }}>Offender</p>
                </div>
            </div>
            <div className="row ">
                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                    <div className='text__dropdwon'>
                        <Select
                            name='NameID'
                            styles={colourStyles}
                            isClearable
                            options={offenseDrp}
                            onChange={(e) => { ChangeDropDown(e, 'NameID'); }}
                            placeholder="Select.."
                            ref={SelectedValue}
                        />
                        <label htmlFor="" className='pt-1'>Offender</label>
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
            <div className="col-12">
                <DataTable
                    columns={columns}
                    data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? offenseNameData : '' : offenseNameData}
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

export default MobileOffenders