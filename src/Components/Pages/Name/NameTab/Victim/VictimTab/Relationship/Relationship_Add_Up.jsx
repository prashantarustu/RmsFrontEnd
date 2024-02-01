import React, { useEffect, useState } from 'react'
import Select from "react-select";
import { Decrypt_Id_Name } from '../../../../../../Common/Utility';
import { Comman_changeArrayFormat } from '../../../../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../../../../../Utility/Personnel/Validation';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';


const Relationship_Add_Up = ({ victimID, nameID, LoginPinID, incidentID, LoginAgencyID, Get_Relationship_Data, setModalStatus, modalStatus, status, RelationshipID, setStatus, editCount, relationshipData }) => {
    const { get_NameVictim_Count } = useContext(AgencyContext);

    const [relationShipDrp, setRelationShipDrp] = useState([]);
    const [name, setName] = useState([])
    const [singleData, setSingleData] = useState([])

    const [value, setValue] = useState({
        'Code': 'VIC',
        'IncidentID': incidentID,
        'VictimID': victimID,
        'NameID': nameID,
        'RelationshipTypeID': '',
        'VictimNameID': '',
        'OffenderNameID': '',
        'ModifiedByUserFK': '',
        'RelationshipID': '',
        'CreatedByUserFK': LoginPinID,
    });

    const [errors, setErrors] = useState({
        'RelationshipTypeIDErrors': '', ' VictimNameIDErrors': '',
    })

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.RelationshipTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['RelationshipTypeIDErrors']: RequiredFieldIncident(value.RelationshipTypeID) } })
        }
        if (RequiredFieldIncident(value.VictimNameID)) {
            setErrors(prevValues => { return { ...prevValues, ['VictimNameIDErrors']: RequiredFieldIncident(value.VictimNameID) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { RelationshipTypeIDErrors, VictimNameIDErrors } = errors

    useEffect(() => {
        if (RelationshipTypeIDErrors === 'true' && VictimNameIDErrors === 'true') {
            if (status) update_Relationship()
            else save_Relationship()
        }
    }, [RelationshipTypeIDErrors, VictimNameIDErrors,])

    useEffect(() => {
        get_Data_RelationShip_Drp(LoginAgencyID); get_Data_Name_Drp(incidentID, nameID);
    }, [nameID])

    useEffect(() => { if (RelationshipID) get_Single_Data(RelationshipID) }, [RelationshipID, editCount])

    useEffect(() => {
        if (singleData?.RelationshipID && RelationshipID) {
            setValue(pre => {
                return {
                    ...pre,
                    RelationshipTypeID: singleData?.RelationshipTypeID,
                    VictimNameID: singleData?.VictimNameID,
                    OffenderNameID: singleData?.OffenderNameID,
                    ModifiedByUserFK: LoginPinID,
                    RelationshipID: singleData?.RelationshipID,
                }
            })
        } else {
            resetHooks()
        }
    }, [singleData, editCount])

    const get_Data_RelationShip_Drp = (LoginAgencyID) => {
        const val = {
            'AgencyID': LoginAgencyID,
        }
        fetchPostData('VictimRelationshipType/GetDataDropDown_VictimRelationshipType', val).then((data) => {
            if (data) {
                setRelationShipDrp(Comman_changeArrayFormat(data, 'VictimRelationshipTypeID', 'Description'))
            } else {
                setRelationShipDrp([])
            }
        })
    }

    const get_Data_Name_Drp = (incidentID, nameID) => {
        const val = {
            'IncidentID': incidentID,
            'NameID': nameID,
        }
        fetchPostData('NameRelationship/GetDataDropDown_OffenderName', val).then((data) => {
            if (data) {
                setName(Comman_changeArrayFormat(data, 'NameID', 'Name'))
            } else {
                setName([])
            }
        })
    }

    const get_Single_Data = (RelationshipID) => {
        const val = {
            'RelationshipID': RelationshipID,
        }
        fetchPostData('NameRelationship/GetSingleData_NameRelationship', val).then((data) => {
            if (data) {
                setSingleData(data[0])
            } else {
                setSingleData([])
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

    const save_Relationship = () => {
        var result = relationshipData?.find(item => {
            if (item.VictimNameID === value.VictimNameID) {
                return true
            } else return false
        });
        if (result) {
            toastifyError('Already Exists')
            setErrors({
                ...errors,
                ['RelationshipTypeIDErrors']: '',
            })
        } else {
            AddDeleteUpadate('NameRelationship/Insert_NameRelationship', value).then((data) => {
                if (data.success) {
                    toastifySuccess(data.Message); Get_Relationship_Data(nameID); setModalStatus(false); setStatus(false); resetHooks(); get_NameVictim_Count(victimID)
                } else {
                    toastifyError(data.Message)
                }
            })
        }
    }

    const update_Relationship = () => {
        AddDeleteUpadate('NameRelationship/Update_NameRelationship', value).then((data) => {
            if (data.success) {
                toastifySuccess(data.Message); Get_Relationship_Data(nameID); setModalStatus(false); setStatus(false); resetHooks();
            } else {
                toastifyError(data.Message)
            }
        })
    }

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
            ...errors,
            'RelationshipTypeIDErrors': '', ' VictimNameIDErrors': '',
        });
    }

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    return (
        <>
            {
                modalStatus &&
                <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="RelationshipModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                    <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                        <div class="modal-content">
                            <div class="modal-body">
                                <div className="m-1">
                                    <fieldset style={{ border: '1px solid gray' }}>
                                        <legend style={{ fontWeight: 'bold' }}>Relationship</legend>
                                        <div className="col-12 col-md-12  p-0" >
                                            <div className="row ">
                                                <div className="col-6 col-md-6 col-lg-6 ">
                                                    <div className=" dropdown__box">
                                                        <Select
                                                            name='VictimNameID'
                                                            styles={colourStyles}
                                                            isClearable
                                                            value={name?.filter((obj) => obj.value === value.VictimNameID)}
                                                            options={name}
                                                            onChange={(e) => { ChangeDropDown(e, 'VictimNameID'); }}
                                                            placeholder="Select.."
                                                        />
                                                        <label>Name</label>
                                                        {errors.VictimNameIDErrors !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.VictimNameIDErrors}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-6 col-lg-6 ">
                                                    <div className=" dropdown__box">
                                                        <Select
                                                            name='RelationshipTypeID'
                                                            styles={colourStyles}
                                                            isClearable
                                                            value={relationShipDrp?.filter((obj) => obj.value === value.RelationshipTypeID)}
                                                            options={relationShipDrp}
                                                            onChange={(e) => { ChangeDropDown(e, 'RelationshipTypeID'); }}
                                                            placeholder="Select.."
                                                        />
                                                        <label>Relationship</label>
                                                        {errors.RelationshipTypeIDErrors !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RelationshipTypeIDErrors}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                            <div className="btn-box text-right  mr-1 mb-2">
                                {
                                    status ?
                                        <button type="button" class="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                        :
                                        <button type="button" class="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                                }
                                <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" onClick={() => resetHooks()}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default Relationship_Add_Up