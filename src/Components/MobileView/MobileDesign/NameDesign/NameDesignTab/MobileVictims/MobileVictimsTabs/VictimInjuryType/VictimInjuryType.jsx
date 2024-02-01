import React, { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component';
import DatePicker from "react-datepicker";
import { Link } from 'react-router-dom';
import Select from "react-select";
import { Decrypt_Id_Name } from '../../../../../../../Common/Utility';
import { RequiredFieldIncident } from '../../../../../../../Pages/Utility/Personnel/Validation';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../../../Common/AlertMsg';

const VictimInjuryType = (props) => {
    const [modalStatus, setModalstatus] = useState(false)

    const { victimID } = props
    const SelectedValue = useRef();
    //screen permission 
    const [InjuryTypeDrp, setInjuryTypeDrp] = useState();
    const [InjuryTypeData, setInjuryTypeData] = useState();
    const [NameEventInjuryID, setNameEventInjuryID] = useState();

    const [value, setValue] = useState({
        'VictimInjuryID': '',
        'NameID': '',
        'VictimID': victimID,
        'NameEventInjuryID': '',
        'CreatedByUserFK': '',
    })

    const [errors, setErrors] = useState({
        'DropError': '',
    })

    const Reset = () => {
        setValue({
            ...value,
            'VictimInjuryID': '',
        })
        setErrors({
            'DropError': '',
        });
    }

    const check_Validation_Error = (e) => {

        if (RequiredFieldIncident(value.VictimInjuryID)) {
            setErrors(prevValues => { return { ...prevValues, ['DropError']: RequiredFieldIncident(value.VictimInjuryID) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DropError } = errors

    useEffect(() => {
        if (DropError === 'true') {
            Add_InjuryType_Offense();
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
        get_InjuryType_Data();
        get_Data_InjuryType_Drp();
    }, [])

    const get_InjuryType_Data = () => {
        const val = {
            'VictimID': victimID,
        }
        fetchPostData('InjuryVictim_FRW/GetData_InjuryVictim_FRW', val).then((res) => {
            console.log(res)
            if (res) {
                setInjuryTypeData(res)
            } else {
                setInjuryTypeData([]);
            }
        })
    }

    const get_Data_InjuryType_Drp = () => {
        const val = {
            'VictimID': victimID,
        }
        fetchPostData('InjuryVictim_FRW/GetData_InsertVictimInjury', val).then((data) => {
            console.log(data)
            if (data) {
                setInjuryTypeDrp(Comman_changeArrayFormat(data, 'VictimInjuryID', 'Description'))
            } else {
                setInjuryTypeDrp([])
            }
        })
    }

    const Add_InjuryType_Offense = () => {
        AddDeleteUpadate('InjuryVictim_FRW/Insert_VictimInjury', value).then((res) => {
            if (res) {
                toastifySuccess(res.Message)
                get_InjuryType_Data();
                get_Data_InjuryType_Drp();
                onClear()
                Reset();
                setErrors({
                    'DropError': '',
                });
            }
        })
    }


    const onClear = () => {
        SelectedValue?.current?.clearValue();
    };

    const columns = [
        {
            name: 'Description',
            selector: (row) => row.VictimInjury_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Action</p>,
            cell: row => <>
                {
                    <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setNameEventInjuryID(row.NameEventInjuryID); setModalstatus(true); console.log(row) }} data-toggle="modal" data-target="#myModal2">
                        <i className="fa fa-trash"></i>
                    </Link>
                }
            </>
        }
    ]


    const DeleteInjuryType = () => {
        console.log('object')
        const val = {
            'NameEventInjuryID': NameEventInjuryID,
            'DeletedByUserFK': '',
        }
        console.log(val)
        AddDeleteUpadate('InjuryVictim_FRW/Delete_VictimInjury', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Data_InjuryType_Drp();
                get_InjuryType_Data();
                setModalstatus(false)

            } else console.log("Somthing Wrong");
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

    const CloseModal = () => {
        setModalstatus(false)
    }
    return (
        <>
            <div className="col-12 " id='display-not-form '>
                <div className="col-12 col-md-12 mt-2 pt-1 p-0 px-2" >
                    <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0" style={{ fontSize: '18px' }}>Injury Type</p>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 px-3">
                        <div className='text__dropdwon'>
                            <Select
                                name='InjuryType'
                                // name='VictimInjuryID'
                                styles={colourStyles}
                                isClearable
                                options={InjuryTypeDrp}
                                onChange={(e) => { ChangeDropDown(e, 'VictimInjuryID'); }}
                                placeholder="Select.."
                                ref={SelectedValue}
                            />
                            <label htmlFor="" className='pt-1'>Injury Type</label>
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
                        data={InjuryTypeData}
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
                                            <button type="button" onClick={DeleteInjuryType} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
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

export default VictimInjuryType