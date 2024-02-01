import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { Decrypt_Id_Name } from '../../../../../../../Common/Utility';
import { Comman_changeArrayFormat } from '../../../../../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../../../../../../../Pages/Utility/Personnel/Validation';

const MobileRelationship = () => {

    const [Relation, setRelation] = useState(false);
    const [relationShipDrp, setRelationShipDrp] = useState([]);
    const [name, setName] = useState([])
    const [relationshipData, setRelationshipData] = useState([]);
    const [singleData, setSingleData] = useState([])
    const [modalStatus, setModalstatus] = useState(false)
    const [RelationshipID, setRelationshipID] = useState('');
    const [editCount, setEditCount] = useState(0);

    const [value, setValue] = useState({

        Code: 'OFF',
        // IncidentID: Decrypt_Id_Name(sessionStorage.getItem('IncidentId'), 'IForIncidentId'),
        IncidentID: ('IncidentId'), 
        // VictimID: sessionStorage.getItem('VictimNameID') ? Decrypt_Id_Name(sessionStorage.getItem('VictimNameID'), 'VForVictimNameID') : '',
        IncidentID: ('IncidentId'), 
        NameID:('NameID') ,
        RelationshipTypeID: '',
        VictimNameID: null,
        OffenderNameID: '',
        ModifiedByUserFK: '',
        RelationshipID: '',
        CreatedByUserFK: ('PINID') ,
    });

    const [errors, setErrors] = useState({
        ' VictimNameIDErrors': '','RelationshipTypeIDErrors':'',
    })

    //----------------------------------------------Get_RelationshipData-------------------------------------------
    useEffect(() => {
        Get_Relationship_Data();
        get_Single_Data();
    }, [])

    const Get_Relationship_Data = () => {
        const val = {
            'Code': 'OFF',
            'NameID': ('NameID') ,
        }
        fetchPostData('NameRelationship_FRW/GetData_NameRelationship_FRW', val).then((res) => {
            if (res) {
                setRelationshipData(res)
            } else {
                setRelationshipData([]);
            }
        })
    }

    //--------------------------------Single-Data-----------------------
    useEffect(() => { if (RelationshipID) get_Single_Data(RelationshipID) }, [RelationshipID, editCount])

    const get_Single_Data = (RelationshipID) => {
        const val = {
            'RelationshipID': RelationshipID,
        }
        console.log(RelationshipID)
        fetchPostData('NameRelationship_FRW/GetSingleData_NameRelationship_FRW', val).then((data) => {
            console.log(data)
            if (data) {
                setSingleData(data[0])
            } else {
                setSingleData([])
            }
        })
    }

    useEffect(() => {
        get_Data_RelationShip_Drp(); get_Data_Name_Drp();
    }, [])
    const get_Data_RelationShip_Drp = () => {
        const val = {
            'IncidentID': ('IncidentId'), 
            'NameID': ('NameID') ,
        }
        fetchPostData('VictimRelationshipType/GetDataDropDown_VictimRelationshipType', val).then((data) => {
            if (data) {
                console.log(data)
                setRelationShipDrp(Comman_changeArrayFormat(data, 'VictimRelationshipTypeID', 'Description'))
            } else {
                setRelationShipDrp([])
            }
        })
    }

    const get_Data_Name_Drp = () => {
        const val = {
            'IncidentID': ('IncidentId'), 
            'NameID': ('NameID') ,
        }
        fetchPostData('NameRelationship_FRW/GetDataDropDown_OffenderName_FRW', val).then((data) => {
            console.log(data)
            if (data) {
                setName(Comman_changeArrayFormat(data, 'NameID', 'Name'))
            } else {
                setName([])
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

    //--------------------Editvalue------------------------------------------------
    useEffect(() => {
        if (singleData?.RelationshipID && RelationshipID) {
            console.log(singleData)
            setValue(pre => {
                return {
                    ...pre,
                    RelationshipTypeID: singleData?.RelationshipTypeID,
                    VictimNameID: singleData?.VictimNameID,
                    OffenderNameID: singleData?.OffenderNameID,
                    ModifiedByUserFK: localStorage.getItem('PINID') ? Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID') : '',
                    RelationshipID: singleData?.RelationshipID,
                }
            })
        } else {
            resetHooks()
        }
    }, [singleData])

    const resetHooks = () => {
        setValue({
            ...value,
            RelationshipTypeID: '',
            VictimNameID: '',
            OffenderNameID: '',
            ModifiedByUserFK: '',
            RelationshipID: '',
        })
        setErrors({
            ' VictimNameIDErrors': '','RelationshipTypeIDErrors':'',
        });
    }

    const check_Validation_Error = (e) => {
      
        if (RequiredFieldIncident(value.OffenderNameID)) {
            setErrors(prevValues => { return { ...prevValues, ['VictimNameIDErrors']: RequiredFieldIncident(value.OffenderNameID) } })
        }
        if (RequiredFieldIncident(value.RelationshipTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['RelationshipTypeIDErrors']: RequiredFieldIncident(value.RelationshipTypeID) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const {VictimNameIDErrors,RelationshipTypeIDErrors } = errors

    useEffect(() => {
        if ( VictimNameIDErrors === 'true' && RelationshipTypeIDErrors === 'true') {
            if (RelationshipID) update_Relationship();
            else save_Relationship(); setErrors({
                ...errors, ['VictimNameIDErrors']: '',
            })
        }
    }, [VictimNameIDErrors,RelationshipTypeIDErrors])

    //---------------------------------Add_Update--------------------------------
    const save_Relationship = () => {
        var result = relationshipData?.find(item => {
            if (item.VictimNameID === value.VictimNameID) {
                return true
            } else return false
        });
        if (result) {
            toastifyError('Already Exists')

        } else {
            AddDeleteUpadate('NameRelationship_FRW/Insert_NameRelationship_FRW', value).then((data) => {
                console.log(data)
                if (data.success) {
                    toastifySuccess(data.Message);
                    Get_Relationship_Data();
                    setModalstatus(false);
                    setRelationshipID('');
                    setRelation(false);
                    // setStatus(false); 
                    resetHooks()

                } else {
                    toastifyError(data.Message)
                }
            })
        }
    }
    const update_Relationship = () => {
        AddDeleteUpadate('NameRelationship_FRW/Update_NameRelationship_FRW', value).then((data) => {
            console.log(data)
            if (data.success) {
                toastifySuccess(data.Message);
                Get_Relationship_Data();
                setModalstatus(false);
                setRelationshipID('');
                setRelation(false);
                // setStatus(false); 
                resetHooks()

            } else {
                toastifyError(data.Message)
            }
        })
    }

    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                <Link to={'#'} onClick={() => { setEditVal(row); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button">
                    <i className="fa fa-edit"></i>
                </Link>
            </>
        },
        {
            name: 'Name',
            selector: (row) => row.Name,
            sortable: true
        },
        {
            name: 'Realtionship',
            selector: (row) => row.RelationshipType_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                <Link to={`#`} onClick={() => { setRelationshipID(row.RelationshipID); setModalstatus(true); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" data-toggle="modal" data-target="#myModal2">
                    <i className="fa fa-trash"></i>
                </Link>
            </>
        }
    ];

    const setEditVal = (row) => {
        console.log(row)
        setRelationshipID(row.RelationshipID);
        setRelation(true);
    }
    const DeleteRelationship = () => {
        const val = {
            'RelationshipID': RelationshipID,
            'DeletedByUserFK': ('PINID'), 
        }
        AddDeleteUpadate('NameRelationship_FRW/Delete_NameRelationship_FRW', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                setEditCount(editCount + 1)
                Get_Relationship_Data();
                setModalstatus(false)
                setRelationshipID('');
            } else toastifyError("Somthing Wrong");
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

    const CloseModal = () => {
        setModalstatus(false)
        setRelation(false);
        resetHooks(); setRelationshipID('');
    }

    return (
        <>
            <div className="col-12 col-md-12 mt-2" >
                <div className="col-12 col-md-12 mt-2 pt-1 p-0 px-2" >
                    <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0" style={{ fontSize: '18px' }}>Relationship</p>
                        {/* <Link to={''} onClick={() => {
                            setRelation(true);
                            // setModalStatus(true); setStatus(false); setRelationshipID(''); setEditCount(editCount + 1)
                        }
                        } className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal">
                            <i className="fa fa-plus"></i>
                        </Link> */}
                        {
                            !RelationshipID ?
                                <Link to={'#'} onClick={() => { setRelation(true); resetHooks(); }} className="btn btn-sm bg-green text-white px-2 py-0 new-button">
                                    <i className="fa fa-plus"></i>
                                </Link>
                                :
                                <></>
                        }
                    </div>
                </div>
                {
                    Relation ?
                        <>
                            <div className="col-12 col-md-12  p-0 px-2" >
                                <div className="row mt-3">
                                    <div className="col-6 col-md-6 col-lg-6 ">
                                        <div className=" text__dropdwon">
                                            <Select
                                                // name='OffenderNameID'
                                                name='OffenderNameID'
                                                styles={colourStyles}
                                                isClearable
                                                value={name?.filter((obj) => obj.value === value.OffenderNameID)}
                                                options={name}
                                                onChange={(e) => { ChangeDropDown(e, 'OffenderNameID'); }}
                                                placeholder="Select.."
                                            />
                                            <label className='pt-1'>Name</label>
                                            {errors.VictimNameIDErrors !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.VictimNameIDErrors}</span>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-6 col-lg-6 ">
                                        <div className=" text__dropdwon">
                                            <Select
                                                name='RelationshipTypeID'
                                                styles={colourStyles}
                                                isClearable
                                                value={relationShipDrp?.filter((obj) => obj.value === value.RelationshipTypeID)}
                                                options={relationShipDrp}
                                                onChange={(e) => { ChangeDropDown(e, 'RelationshipTypeID'); }}
                                                placeholder="Select.."
                                            />
                                            <label className='pt-1'>Relationship</label>
                                            {errors.RelationshipTypeIDErrors !== 'true' ? (
                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RelationshipTypeIDErrors}</span>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>

                                <div class="col-12 text-right mt-3 " >
                                    {
                                        RelationshipID ?
                                            <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={check_Validation_Error}>Update</button>
                                            :
                                            <button type="button" className="btn btn-lg  btn-success new-button mr-3" onClick={check_Validation_Error} >Save</button>
                                    }

                                    <button type="button" onClick={() => { setRelation(false); setRelationshipID(''); }} className="btn btn-lg  btn-success new-button">Close</button>
                                </div>
                            </div>
                        </>
                        :
                        <>

                            <div className="row mt-1">
                                <div className="col-12  mb-3">
                                    <div className="table-responsive">
                                        <DataTable
                                            dense
                                            columns={columns}
                                            data={relationshipData}
                                            pagination
                                            highlightOnHover
                                        />
                                    </div>
                                </div>
                            </div>
                            {
                                modalStatus ?
                                    <div class="modal" id="myModal2" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s' }} data-backdrop="false">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div className="box text-center py-5">
                                                    <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                                                    <div className="btn-box mt-3">
                                                        <button type="button" onClick={DeleteRelationship} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
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
                }
            </div>
        </>
    )
}

export default MobileRelationship