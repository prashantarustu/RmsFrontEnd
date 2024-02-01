import React, { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component';
import DatePicker from "react-datepicker";
import { Link } from 'react-router-dom';
import Select from "react-select";
import { Decrypt_Id_Name } from '../../../../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../../hooks/Api';
import { RequiredFieldIncident } from '../../../../../../../Pages/Utility/Personnel/Validation';
import { Comman_changeArrayFormat } from '../../../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../../../Common/AlertMsg';
const MobileAssault = () => {

    const SelectedValue = useRef();
    const [dropDownData, setDropDownData] = useState();
    const [listDataId, setListDataId] = useState();
    const [listData, setListData] = useState();
    const [modalStatus, setModalstatus] = useState(false)

    const [value, setValue] = useState({
        'AssaultTypeID': '',
        'AssaultID': '',
        'Description': '',
        'NameID': ('NameID'),
        'CreatedByUserFK': ('PINID'), 
    })
    const [errors, setErrors] = useState({
        'DropError': '',
    })

    useEffect(() => {
        get_DropDown(); get_List_Data();
    }, [])

    const get_List_Data = () => {
        const val = {
            'NameID': ('NameID'), 
        }
        fetchPostData('OffenderAssault_FRW/GetData_OffenderAssault_FRW', val).then((res) => {
            if (res) {
                setListData(res)
            } else {
                setListData([]);
            }
        })
    }
    const get_DropDown = () => {
        const val = {
            'NameID':('NameID'),
            'IncidentId': ('IncidentId'), 
        }
        fetchPostData('OffenderAssault_FRW/GetData_InsertOffenderAssault_FRW', val).then((res) => {
            if (res) {
                setDropDownData(Comman_changeArrayFormat(res, 'AssaultTypeID', 'Description'))
            } else {
                setDropDownData([]);
            }
        })
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
            Insert_Data();
        }
    }, [DropError])



    const onClear = () => {
        SelectedValue?.current?.clearValue();
    };
    const Insert_Data = () => {
        AddDeleteUpadate('OffenderAssault_FRW/Insert_OffenderAssault_FRW', value).then((res) => {
            toastifySuccess(res.Message); get_DropDown(); get_List_Data(); onClear();
            setErrors({
                ...errors,
                ['DropError']: '',
            })
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
    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 41,
            fontSize: 18,
            margintop: 2,
            boxShadow: 0,
        }),
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
    const columns = [
        {
            name: 'Description',
            selector: (row) => row.Assault_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
            cell: row =>

                <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setListDataId(row.OffenderAssaultID); setModalstatus(true); }} data-toggle="modal" data-target="#myModal2">
                    <i className="fa fa-trash"></i>
                </Link>
        }
    ]
    const Delete_Data = () => {
        const val = {
            OffenderAssaultID: listDataId,
            'DeletedByUserFK': ('PINID'), 
        }
        AddDeleteUpadate('OffenderAssault_FRW/Delete_OffenderAssault_FRW', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message)
                get_DropDown();
                get_List_Data();
                setModalstatus(false);
                setErrors({
                    ...errors,
                    ['DropError']: '',
                })
            } else console.log("Somthing Wrong");
        })
    }
    const CloseModal = () => {
        setModalstatus(false)
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
                                name='AssaultType'
                                styles={colourStyles}
                                isClearable
                                options={dropDownData}
                                onChange={(e) => { ChangeDropDown(e, 'AssaultID') }}
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
                            <button type="button" className="btn btn-md py-1 btn-success new-button pl-2  text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                        </Link>
                    </div>
                </div>
                <div className="col-12">
                    <DataTable
                        columns={columns}
                        data={listData}
                        dense
                        pagination
                        selectableRowsHighlight
                        highlightOnHover
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
                                            <button type="button" onClick={Delete_Data} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
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

export default MobileAssault