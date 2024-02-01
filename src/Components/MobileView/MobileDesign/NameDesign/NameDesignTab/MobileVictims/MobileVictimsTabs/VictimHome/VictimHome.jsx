import React from 'react'
import { useEffect } from 'react';
import Select from "react-select";
import { Decrypt_Id_Name, Encrypted_Id_Name } from '../../../../../../../Common/Utility';
import { Comman_changeArrayFormat } from '../../../../../../../Common/ChangeArrayFormat';
import { useState } from 'react';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../../hooks/Api';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toastifySuccess } from '../../../../../../../Common/AlertMsg';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../../../../Context/Agency/Index';
import DeletePopUpModal from '../../../../../../../Common/DeleteModal';
import { RequiredFieldIncident } from '../../../../../../../Pages/Utility/Personnel/Validation';


const VictimHome = (props) => {

    const { victimID, setVictimID, showTabs } = props
    const { updateCount, setUpdateCount } = useContext(AgencyContext)
    const SelectedValue = useRef();
    const navigate = useNavigate();

    const [victimTypeDrp, setvictimTypeDrp] = useState([]);
    const [bodyArmorDrp, setBodyArmorDrp] = useState([]);
    const [callTypeDrp, setCallTypeDrp] = useState([])
    const [additionalJustiDrp, setAdditionalJustiDrp] = useState([])
    const [assignmentTypeDrp, setAssignmentTypeDrp] = useState([])
    const [Editval, setEditval] = useState([]);
    const [modalStatus, setModalstatus] = useState(false);
    const [Status, setstatus] = useState(false);

    const [value, setValue] = useState({
        'VictimTypeID': '',
        'BodyArmorID': '',
        'CallTypeID': '',
        'AdditionalJustificationID': '',
        'AssignmentTypeID': '',
        'VictimID': '',
        'NameID': '',
        'CreatedByUserFK':  '',
    })
    const [errors, setErrors] = useState({
        'VictimTypeIDErrors': '',

    })

    //------------------------------Get-Single-Data-----------------------------
    useEffect(() => {
        if (('NameID')) {
            GetSingleData()
        }
    }, [])


    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.VictimTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['VictimTypeIDErrors']: RequiredFieldIncident(value.VictimTypeID) } })
        }
    }

    const { VictimTypeIDErrors } = errors

    useEffect(() => {
        if (VictimTypeIDErrors === 'true') {
            if (Status) UpdateVictim()
            else AddVictim()
        }
    }, [VictimTypeIDErrors])


    const GetSingleData = () => {
        const val = { 'NameID': '', }
        fetchPostData('Victim_FRW/GetData_Victim_FRW', val)
            .then((res) => {
                if (res.length > 0) {
                    console.log(res);
                    setEditval(res)
                    if (res[0].VictimID) {
                        setVictimID(res[0].VictimID);
                        setstatus(true);
                        console.log(res[0].VictimID)
                        // sessionStorage.setItem("VictimNameID", Encrypted_Id_Name(res[0].VictimID, 'VForVictimNameID'));
                        setUpdateCount(updateCount + 1);
                    }
                } else { setEditval([]); }
            })
    }

    useEffect(() => {
        if (Editval) {
            setValue({
                ...value,
                'VictimTypeID': Editval[0]?.VictimTypeID,
                'BodyArmorID': Editval[0]?.BodyArmorID,
                'CallTypeID': Editval[0]?.CallTypeID,
                'AdditionalJustificationID': Editval[0]?.AdditionalJustificationID,
                'AssignmentTypeID': Editval[0]?.AssignmentTypeID,
                'VictimID': Editval[0]?.VictimID,
                'ModifiedByUserFK': '',
            })
        } else {
            // reset_Value_Data()
        }
    }, [Editval])

    const reset_Value_Data = () => {
        setValue({
            ...value,
            'VictimTypeID': '',
            'BodyArmorID': '',
            'CallTypeID': '',
            'AdditionalJustificationID': '',
            'AssignmentTypeID': '',
            'ModifiedByUserFK': ''
        });
    }

    useEffect(() => {
        get_Victim_Type_Data(); get_Body_Armor_Data(); get_Call_Type_Data(); get_Additional_justificaion_Data(); get_AssignmentType_Data();
    }, [])

    const get_AssignmentType_Data = () => {
        const val = {
            AgencyID: '',
        }
        fetchPostData('VictimAssignmentType/GetDataDropDown_VictimAssignmentType', val).then((data) => {
            if (data) {
                setAssignmentTypeDrp(Comman_changeArrayFormat(data, 'VictimAssignmentTypeID', 'Description'))
            } else {
                setAssignmentTypeDrp([]);
            }
        })
    }

    const get_Additional_justificaion_Data = () => {
        const val = {
            AgencyID: '',
        }
        fetchPostData('AdditionalJustification/GetDataDropDown_AdditionalJustification', val).then((data) => {
            if (data) {
                setAdditionalJustiDrp(Comman_changeArrayFormat(data, 'AdditionalJustificationID', 'Description'))
            } else {
                setAdditionalJustiDrp([]);
            }
        })
    }

    const get_Call_Type_Data = () => {
        const val = {
            AgencyID: '',
        }
        fetchPostData('VictimCallType/GetDataDropDown_VictimCallType', val).then((data) => {
            if (data) {
                setCallTypeDrp(Comman_changeArrayFormat(data, 'VictimCallTypeID', 'Description'))
            } else {
                setCallTypeDrp([]);
            }
        })
    }

    const get_Body_Armor_Data = () => {
        const val = {
            AgencyID: '',
        }
        fetchPostData('BodyArmor/GetDataDropDown_BodyArmor', val).then((data) => {
            if (data) {
                setBodyArmorDrp(Comman_changeArrayFormat(data, 'BodyArmorID', 'Description'))
            } else {
                setBodyArmorDrp([]);
            }
        })
    }

    const get_Victim_Type_Data = () => {
        const val = {
            AgencyID: '',
        }
        fetchPostData('VictimType/GetDataDropDown_VictimType', val).then((data) => {
            if (data) {
                setvictimTypeDrp(Comman_changeArrayFormat(data, 'VictimTypeID', 'Description'))
            } else {
                setvictimTypeDrp([]);
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

    const AddVictim = () => {
        // console.log(value)
        AddDeleteUpadate('Victim_FRW/Insert_Victim_FRW', value).then((res) => {
            console.log(res)
            if (res) {
                if (res.VictimID) {
                    console.log(res?.VictimID)
                    // sessionStorage.setItem("VictimNameID", Encrypted_Id_Name(res?.VictimID, 'VForVictimNameID'));
                    setVictimID(res[0]?.VictimID);
                    setstatus(true);
                    setUpdateCount(updateCount + 1);
                     setErrors({ ...errors, ['VictimTypeIDErrors']: '', });
                }
                GetSingleData();
                toastifySuccess(res.Message);
            }
        })
    }

    const UpdateVictim = () => {
        AddDeleteUpadate('Victim_FRW/Update_Victim_FRW', value).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['VictimTypeIDErrors']: '', });
            }
        })
    }

    const DeleteVictim = () => {
        const val = {
            'VictimID': victimID,
            'DeletedByUserFK': '',
        }
        AddDeleteUpadate('Victim_FRW/Delete_Victim_FRW', val).then((res) => {
            if (res.success) {
                setVictimID('');
                onclose();
                setModalstatus(false);
                setstatus(false);
                setUpdateCount(updateCount + 1);
                toastifySuccess(res.Message);
                reset_Value_Data();
            } else console.log("Somthing Wrong");
        })
    }

    console.log(Status)

    const onclose = () => {
        // sessionStorage.removeItem('VictimNameID');
    }

    const CloseModal = () => {
        setModalstatus(false);
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

    return (
        <>
            <div className="col-md-12 col-lg-12 px-3 mt-2 pt-1">
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0" style={{ fontSize: '18px' }}>Victim</p>
                </div>
            </div>
            <div className="row px-3 mt-2" >
                <div className="col-6 col-md-6 col-lg-4 mt-2">
                    <div className='text__dropdwon'>
                        <Select
                            name='VictimTypeID'
                            value={victimTypeDrp?.filter((obj) => obj.value === value?.VictimTypeID)}
                            styles={colourStyles}
                            isClearable
                            options={victimTypeDrp}
                            onChange={(e) => { ChangeDropDown(e, 'VictimTypeID'); }}
                            placeholder="Select.."
                            ref={SelectedValue}
                        />
                        <label htmlFor="" className='pt-1'>Victim Type</label>
                        {errors.VictimTypeIDErrors !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.VictimTypeIDErrors}</span>
                        ) : null}
                    </div>
                </div>
                <div className="col-6 col-md-6 col-lg-4 mt-2  ">
                    <div className='text__dropdwon'>
                        <Select
                            name='BodyArmorID'
                            value={bodyArmorDrp?.filter((obj) => obj.value === value?.BodyArmorID)}
                            styles={customStylesWithOutColor}
                            isClearable
                            options={bodyArmorDrp}
                            onChange={(e) => { ChangeDropDown(e, 'BodyArmorID'); }}
                            placeholder="Select.."
                        />
                        <label htmlFor="" className='pt-1'>Body Armor</label>
                    </div>
                </div>
                <div className="col-6 col-md-6 col-lg-4 mt-2">
                    <div className='text__dropdwon'>
                        <Select
                            name='CallTypeID'
                            value={callTypeDrp?.filter((obj) => obj.value === value?.CallTypeID)}
                            styles={customStylesWithOutColor}
                            isClearable
                            options={callTypeDrp}
                            onChange={(e) => { ChangeDropDown(e, 'CallTypeID'); }}
                            placeholder="Select.."
                        />
                        <label htmlFor="" className='pt-1'>Call Type</label>
                    </div>
                </div>
                <div className="col-6 col-md-6 col-lg-4 mt-3">
                    <div className='text__dropdwon'>
                        <Select
                            name='AdditionalJustificationID'
                            value={additionalJustiDrp?.filter((obj) => obj.value === value?.AdditionalJustificationID)}
                            styles={customStylesWithOutColor}
                            isClearable
                            options={additionalJustiDrp}
                            onChange={(e) => { ChangeDropDown(e, 'AdditionalJustificationID'); }}
                            placeholder="Select.."
                        />
                        <label htmlFor="" className='pt-1'>Additional Justification</label>
                    </div>
                </div>
                <div className="col-6 col-md-6 col-lg-4 mt-3">
                    <div className='text__dropdwon'>
                        <Select
                            name='AssignmentTypeID'
                            value={assignmentTypeDrp?.filter((obj) => obj.value === value?.AssignmentTypeID)}
                            styles={customStylesWithOutColor}
                            isClearable
                            options={assignmentTypeDrp}
                            onChange={(e) => { ChangeDropDown(e, 'AssignmentTypeID'); }}
                            placeholder="Select.."
                        />
                        <label htmlFor="" className='pt-1'>Assignment Type</label>
                    </div>
                </div>
            </div>
            <div className="col-12  text-right mr-3  pt-1" style={{ marginBottom: '-10px' }}>
                {
                    Status ?
                        // <>
                        //     <button type="button" onClick={() => { setModalstatus(true); }} className="btn btn-sm btn-success mx-1 new-button" data-toggle="modal" data-target="#myModal2">Delete</button>
                        //     <button type="button" onClick={() => { onclose(); UpdateVictim(); }} className="btn btn-sm btn-success mx-1 new-button" data-dismiss="modal" >Update</button>
                        // </>
                        // :
                        // <button type="button" className="btn btn-sm btn-success pl-2 new-button" onClick={AddVictim} >Save</button>
                        <>
                            <button type="button" className="btn btn-sm btn-success mx-1 new-button" data-toggle="modal" data-target="#myModal2" onClick={() => { setModalstatus(true); }} >Delete</button>
                            <button type="button" className="btn btn-sm btn-success mx-1 new-button" data-dismiss="modal" onClick={() => check_Validation_Error()}>Update</button>
                        </>
                        :
                        <button type="button" className="btn btn-sm btn-success pl-2 new-button" onClick={() => check_Validation_Error()} >Save</button>
                }
                <button type="button" onClick={() => { navigate('/name-tabs') }} className="btn btn-sm btn-success mx-1 new-button" data-dismiss="modal" > Close </button>
            </div>
            {
                modalStatus ?
                    <div class="modal" id="myModal2" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s' }} data-backdrop="false">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div className="box text-center py-5">
                                    <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                                    <div className="btn-box mt-3">
                                        <button type="button" onClick={DeleteVictim} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
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

export default VictimHome