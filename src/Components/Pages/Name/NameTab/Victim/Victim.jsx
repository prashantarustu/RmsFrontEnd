import React, { useEffect } from 'react'
import Tab from '../../../../Utility/Tab/Tab'
import Select from "react-select";
import SubTab from '../../../../Utility/Tab/SubTab';
import { useState } from 'react';
import { NameTabs, VictimTabs } from '../../../../Utility/Tab/TabsArray';
import Offense from './VictimTab/Offense/Offense';
import Relationship from './VictimTab/Relationship/Relationship';
import InjuryType from './VictimTab/InjuryType/InjuryType';
import JustifiableHomicide from './VictimTab/JustifiableHomicide/JustifiableHomicide';
import AssaultType from './VictimTab/AssaultType/AssaultType';
import ORI from './VictimTab/ORI/ORI';
import Property from './VictimTab/Property/Property';
import Officer from './VictimTab/Officer/Officer';
import { Decrypt_Id_Name, Encrypted_Id_Name } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { useRef } from 'react';
import FindListDropDown from '../../../../Common/FindListDropDown';
import { NaVictimListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useContext } from 'react';
import { VictimError } from '../../../../NIBRSError';
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';


const Victim = ({ showTabs }) => {

    const { nameSingleData, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    const SelectedValue = useRef();
    const [showPage, setShowPage] = useState('offense');
    const [victimTypeDrp, setvictimTypeDrp] = useState([]);
    const [bodyArmorDrp, setBodyArmorDrp] = useState([]);
    const [callTypeDrp, setCallTypeDrp] = useState([]);
    const [additionalJustiDrp, setAdditionalJustiDrp] = useState([]);
    const [assignmentTypeDrp, setAssignmentTypeDrp] = useState([]);
    const [Editval, setEditval] = useState();
    const [victimStatus, setVictimStatus] = useState(false);
    const [updateCount, setUpdateCount] = useState(0);
    const [victimID, setVictimID] = useState();
    const [victimTypeCode, setVictimCode] = useState(null);

    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const [MasterNameID, setMasterNameID,] = useState('');
    const [nameID, setNameID] = useState();
    const [incidentID, setIncidentID] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', MasterNameID: '', NameID: '', }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                if (localStoreArray.IncidentID) { setIncidentID(localStoreArray?.IncidentID); }
                if (localStoreArray.NameID) { GetSingleData(localStoreArray?.NameID); setNameID(localStoreArray?.NameID); setMasterNameID(localStoreArray?.MasterNameID); }
            }
        }
    }, [localStoreArray])

    const [value, setValue] = useState({
        'VictimTypeID': '', 'BodyArmorID': '', 'CallTypeID': '', 'AdditionalJustificationID': '', 'AssignmentTypeID': '',
        'CreatedByUserFK': '', 'NameID': '', 'ModifiedByUserFK': '', 'VictimID': '', 'VictemTypeCode': '',
    });

    const [errors, setErrors] = useState({
        'VictimTypeIDErrors': '',
    })

    useEffect(() => {
        setValue(pre => { return { ...pre, 'CreatedByUserFK': LoginPinID, 'NameID': nameID, 'VictemTypeCode': null, } });
    }, [LoginPinID])

    // useEffect(() => {
    //     if (nameID) {
    //         GetSingleData(nameID)
    //     }
    // }, [nameID])

    const GetSingleData = (NameID) => {
        const val = { 'NameID': NameID }
        fetchPostData('Victim/GetData_Victim', val).then((res) => {
            console.log(res)
            if (res.length != 0) {
                setEditval(res)
                setVictimStatus(true);
                setUpdateCount(updateCount + 1);
            } else { setEditval([]); setVictimStatus(false); }
        })
    }

    useEffect(() => {
        if (Editval) {
            setVictimCode(Editval[0]?.VictimCode)
            setValue({
                ...value,
                'VictimTypeID': Editval[0]?.VictimTypeID,
                'BodyArmorID': Editval[0]?.BodyArmorID,
                'CallTypeID': Editval[0]?.CallTypeID,
                'AdditionalJustificationID': Editval[0]?.AdditionalJustificationID,
                'AssignmentTypeID': Editval[0]?.AssignmentTypeID,
                'VictimID': Editval[0]?.VictimID,
                'ModifiedByUserFK': LoginPinID,
                'VictemTypeCode': Editval[0]?.VictimCode
            })
            setVictimID(Editval[0]?.VictimID)
            // sessionStorage.setItem("VictimNameID", Encrypted_Id_Name(Editval[0]?.VictimID, 'VForVictimNameID'));
        } else {
            reset_Value_Data()
        }
    }, [Editval, updateCount])

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.VictimTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['VictimTypeIDErrors']: RequiredFieldIncident(value.VictimTypeID) } })
        }
    }

    const { VictimTypeIDErrors } = errors

    useEffect(() => {
        if (VictimTypeIDErrors === 'true') { if (victimStatus) { UpdateVictim(); } else { AddVictim(); } }
    }, [VictimTypeIDErrors])

    useEffect(() => {
        if (LoginAgencyID) {
            get_Victim_Type_Data(LoginAgencyID); get_Body_Armor_Data(LoginAgencyID); get_Call_Type_Data(LoginAgencyID); get_Additional_justificaion_Data(LoginAgencyID); get_AssignmentType_Data(LoginAgencyID);
        }
    }, [LoginAgencyID])

    const get_AssignmentType_Data = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('VictimAssignmentType/GetDataDropDown_VictimAssignmentType', val).then((data) => {
            if (data) {
                setAssignmentTypeDrp(Comman_changeArrayFormat(data, 'VictimAssignmentTypeID', 'Description'))
            } else {
                setAssignmentTypeDrp([]);
            }
        })
    }

    const get_Additional_justificaion_Data = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('AdditionalJustification/GetDataDropDown_AdditionalJustification', val).then((data) => {
            if (data) {
                setAdditionalJustiDrp(Comman_changeArrayFormat(data, 'AdditionalJustificationID', 'Description'))
            } else {
                setAdditionalJustiDrp([]);
            }
        })
    }

    const get_Call_Type_Data = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('VictimCallType/GetDataDropDown_VictimCallType', val).then((data) => {
            if (data) {
                setCallTypeDrp(Comman_changeArrayFormat(data, 'VictimCallTypeID', 'Description'))
            } else {
                setCallTypeDrp([]);
            }
        })
    }

    const get_Body_Armor_Data = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('BodyArmor/GetDataDropDown_BodyArmor', val).then((data) => {
            if (data) {
                setBodyArmorDrp(Comman_changeArrayFormat(data, 'BodyArmorID', 'Description'))
            } else {
                setBodyArmorDrp([]);
            }
        })
    }

    const get_Victim_Type_Data = (LoginAgencyID) => {
        const val = {
            AgencyID: LoginAgencyID,
        }
        fetchPostData('VictimType/GetDataDropDown_VictimType', val).then((data) => {
            if (data) {
                setvictimTypeDrp(threeColArray(data, 'VictimTypeID', 'Description', 'VictimCode'))
            } else {
                setvictimTypeDrp([]);
            }
        })
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'VictimTypeID') {
                setValue(pre => { return { ...pre, [name]: e.value, ['VictemTypeCode']: e.id } })
            } else setValue({ ...value, [name]: e.value })

        } else {
            if (name === 'VictimTypeID') { setValue(pre => { return { ...pre, [name]: '', ['VictemTypeCode']: null } }) };
            setValue({ ...value, [name]: null })
        }
    }

    const AddVictim = () => {
        AddDeleteUpadate('Victim/Insert_Victim', value).then((res) => {
            if (res) {
                console.log(res)
                if (res.VictimID) {
                    GetSingleData(nameID)
                }
                toastifySuccess(res.Message);
                setErrors({
                    ...errors,
                    ['VictimTypeIDErrors']: '',
                });
            }
        })
    }

    const UpdateVictim = () => {
        AddDeleteUpadate('Victim/Update_Victim', value).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                setErrors({
                    ...errors,
                    ['VictimTypeIDErrors']: '',
                });
            }
        })
    }

    const DeletePin = () => {
        const val = {
            'VictimID': victimID,
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate('Victim/Delete_Victim', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message); setValue({ ...value, ['NameID']: '' }); reset_Value_Data()
            } else console.log("Somthing Wrong");
        })
    }

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
        setVictimStatus(false)
    }

    // Custom Style
    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    return (
        <>
            <div className="col-12 " id='display-not-form'>
                <div className="col-12 col-md-12 mt-2 pt-1 p-0" >
                    <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0">Victim</p>
                        <FindListDropDown array={NaVictimListDropDownArray} />
                    </div>
                </div>
            </div>
            <div className="col-6 col-md-6 col-lg-4 mt-2">
                <div className='dropdown__box'>
                    <Select
                        name='VictimTypeID'
                        value={victimTypeDrp?.filter((obj) => obj.value === value?.VictimTypeID)}
                        styles={VictimError(value?.VictemTypeCode, nameSingleData[0], 'Color')}
                        isClearable
                        options={victimTypeDrp}
                        onChange={(e) => { ChangeDropDown(e, 'VictimTypeID'); }}
                        placeholder="Select.."
                        ref={SelectedValue}
                    />
                    <label>Victim Type {VictimError(value?.VictemTypeCode, nameSingleData[0], 'tool')}</label>
                    {errors.VictimTypeIDErrors !== 'true' ? (
                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.VictimTypeIDErrors}</span>
                    ) : null}
                </div>
            </div>
            <div className="col-6 col-md-6 col-lg-4 mt-2 ">
                <div className='dropdown__box'>
                    <Select
                        name='BodyArmorID'
                        value={bodyArmorDrp?.filter((obj) => obj.value === value?.BodyArmorID)}
                        styles={customStylesWithOutColor}
                        isClearable
                        options={bodyArmorDrp}
                        onChange={(e) => { ChangeDropDown(e, 'BodyArmorID'); }}
                        placeholder="Select.."
                    />
                    <label htmlFor="">Body Armor</label>
                </div>
            </div>
            <div className="col-6 col-md-6 col-lg-4 mt-2">
                <div className='dropdown__box'>
                    <Select
                        name='CallTypeID'
                        value={callTypeDrp?.filter((obj) => obj.value === value?.CallTypeID)}
                        styles={customStylesWithOutColor}
                        isClearable
                        options={callTypeDrp}
                        onChange={(e) => { ChangeDropDown(e, 'CallTypeID'); }}
                        placeholder="Select.."
                    />
                    <label htmlFor="">Call Type</label>
                </div>
            </div>
            <div className="col-6 col-md-6 col-lg-4 mt-2">
                <div className='dropdown__box'>
                    <Select
                        name='AdditionalJustificationID'
                        value={additionalJustiDrp?.filter((obj) => obj.value === value?.AdditionalJustificationID)}
                        styles={customStylesWithOutColor}
                        isClearable
                        options={additionalJustiDrp}
                        onChange={(e) => { ChangeDropDown(e, 'AdditionalJustificationID'); }}
                        placeholder="Select.."
                    />
                    <label htmlFor="">Additional Justification</label>
                </div>
            </div>
            <div className="col-6 col-md-6 col-lg-4 mt-2">
                <div className='dropdown__box'>
                    <Select
                        name='AssignmentTypeID'
                        value={assignmentTypeDrp?.filter((obj) => obj.value === value?.AssignmentTypeID)}
                        styles={customStylesWithOutColor}
                        isClearable
                        options={assignmentTypeDrp}
                        onChange={(e) => { ChangeDropDown(e, 'AssignmentTypeID'); }}
                        placeholder="Select.."
                    />
                    <label htmlFor="">Assignment Type</label>
                </div>
            </div>
            <div className="col-6 col-md-6 col-lg-4 text-right  mt-3 pt-2">
                {
                    victimStatus ?
                        <>
                            <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => check_Validation_Error()}>Update</button>
                            <button type="button" className="btn btn-sm btn-success  mr-1" data-toggle="modal" data-target="#DeleteModal" >Delete</button>
                        </>
                        :
                        <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => check_Validation_Error()} >Save</button>
                }
                <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { showTabs('home') }} >Close</button>
            </div>
            <div className={`col-12 col-md-12`}>
                <div className="row px-0">
                    <div className="col-12 mt-3">
                        <SubTab tabs={VictimTabs} showPage={showPage} setShowPage={setShowPage} status={victimStatus} />
                    </div>
                </div>
            </div>
            {
                showPage === 'offense' && victimStatus ?
                    <Offense {...{ victimID, nameID, LoginPinID, incidentID, LoginAgencyID }} />
                    :
                    showPage === 'relationship' && victimStatus ?
                        <Relationship {...{ victimID, nameID, LoginPinID, incidentID, LoginAgencyID }} />
                        :
                        showPage === 'InjuryType' && victimStatus ?
                            <InjuryType {...{ victimID, nameID, LoginPinID, incidentID, LoginAgencyID, }} />
                            :
                            showPage === 'JustifiableHomicide' && victimStatus ?
                                <JustifiableHomicide {...{ victimID, nameID, LoginPinID, incidentID, LoginAgencyID, }} />
                                :
                                showPage === 'AssaultType' && victimStatus ?
                                    <AssaultType {...{ victimID, nameID, LoginPinID, incidentID, LoginAgencyID, }} />
                                    :
                                    showPage === 'Officer' && victimStatus ?
                                        <Officer {...{ victimID, nameID, LoginPinID, incidentID, LoginAgencyID, }} />
                                        :
                                        showPage === 'Property' && victimStatus ?
                                            <Property {...{ victimID, nameID, LoginPinID, incidentID, LoginAgencyID, }} />
                                            :
                                            showPage === 'ORI' && victimStatus ?
                                                <ORI {...{ victimID, nameID, LoginPinID, incidentID, LoginAgencyID, }} />
                                                :
                                                <></>
            }
            <IdentifyFieldColor />
            <DeletePopUpModal func={DeletePin} />
        </>
    )
}

export default Victim