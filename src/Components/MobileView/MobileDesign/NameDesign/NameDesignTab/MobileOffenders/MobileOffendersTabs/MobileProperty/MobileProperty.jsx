import React, { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component';
import DatePicker from "react-datepicker";
import { Link } from 'react-router-dom';
import Select from "react-select";
import { Decrypt_Id_Name, getShowingMonthDateYear } from '../../../../../../../Common/Utility';
import { RequiredFieldIncident } from '../../../../../../../Pages/Utility/Personnel/Validation';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../../../../Common/DeleteModal';

const MobileProperty = (props) => {
    const SelectedValue = useRef();
    //screen permission 
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [PropertyDrp, setPropertyDrp] = useState();
    const [PropertyData, setPropertyData] = useState();
    const [OffenderPropertyID, setOffenderPropertyID] = useState();
    const [deleteStatus, setDeleteStatus] = useState(false)

    const [value, setValue] = useState({
        'PropertyID': '',
        'NameID': ('NameID'),
        'CreatedByUserFK': ('PINID'), 
    })

    const [errors, setErrors] = useState({
        'DropError': '',
    })

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.PropertyID)) {
            setErrors(prevValues => { return { ...prevValues, ['DropError']: RequiredFieldIncident(value.PropertyID) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DropError } = errors

    useEffect(() => {
        if (DropError === 'true') {
            Add_Property();
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
            'NameID': ('NameID'), 
        }
        fetchPostData('OffenderProperty_FRW/GetData_OffenderProperty_FRW', val).then((res) => {
            if (res) {
                setPropertyData(res)
            } else {
                setPropertyData([]);
            }
        })
    }

    const get_Property_DropDown = () => {
        const val = {
            'NameID': ('NameID'), 
            'IncidentId': ('IncidentId'), 
        }
        fetchPostData('OffenderProperty_FRW/GetData_InsertOffenderProperty_FRW', val).then((data) => {
            if (data) {
                setPropertyDrp(Comman_changeArrayFormat(data, 'PropertyID', 'PropertyNumber', 'PropertyTypeID'))
            } else {
                setPropertyDrp([])


            }
        })
    }

    const Add_Property = () => {
        AddDeleteUpadate('OffenderProperty_FRW/Insert_OffenderProperty_FRW', value).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Property_DropDown();
                get_Property_Data();
                onClear(); setErrors({ ...value['DropError'] })
            }
        })
    }

    const DeleteProperty = () => {
        const val = {
            'OffenderPropertyID': OffenderPropertyID,
            'DeletedByUserFK': ('PINID'), 
        }
        AddDeleteUpadate('OffenderProperty_FRW/Delete_OffenderProperty_FRW', val).then((res) => {
            toastifySuccess(res.Message); setDeleteStatus(false)
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
            name: 'PropertyReason',
            selector: (row) => row.PropertyLossCode_Description
            ,
            sortable: true
        },
        {
            name: 'Reported Date/Time',
            selector: (row) => getShowingMonthDateYear(row.ReportedDtTm),
            sortable: true
        },
        {
            name: 'PropertyType',
            selector: (row) => row.PropertyType_Description,
            sortable: true
        },
        {
            name: 'PropertyValue',
            selector: (row) => row.Value,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
            cell: row => <>
                {/* {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
               <Link to={''} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setEditVal(row) }}>
                <i className="fa fa-edit"></i>
              </Link> 
              : <></>
              : <></>
          } */}
                {
                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                        <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setDeleteStatus(true); setOffenderPropertyID(row.OffenderPropertyID) }} data-toggle="modal" data-target="#DeleteModal">
                            <i className="fa fa-trash"></i>
                        </Link>
                        : <></>
                        : <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setDeleteStatus(true); setOffenderPropertyID(row.OffenderPropertyID) }} data-toggle="modal" data-target="#DeleteModal">
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
            <div className="col-12 " id='display-not-form '>
                <div className="col-12 col-md-12 mt-2 pt-1 p-0 px-2" >
                    <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0" style={{ fontSize: '18px' }}>Property</p>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 px-3">
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
                        noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    />
                </div>
            </div>
            <DeletePopUpModal func={DeleteProperty} />

        </>
    )
}

export default MobileProperty