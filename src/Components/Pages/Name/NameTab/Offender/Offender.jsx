import React from 'react'
import SubTab from '../../../../Utility/Tab/SubTab';
import { OffenderTabs } from '../../../../Utility/Tab/TabsArray';
import { useState } from 'react';
import OffenderTabsCom from './OffenderTab/AllTabCom/OffenderTabsCom';
import FindListDropDown from '../../../../Common/FindListDropDown';
import { NaContactListDropDownArray, NaOffenderListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import Relationship from './OffenderTab/Relationship/Relationship';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useEffect } from 'react';
import { Decrypt_Id_Name } from '../../../../Common/Utility';

const Offender = () => {

    const { nameSingleData, localStoreArray, setLocalStoreArray, get_LocalStorage,get_NameOffender_Count } = useContext(AgencyContext);

    const [showPage, setShowPage] = useState('offense');
    const [status, setStatus] = useState(true);

    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const [MasterNameID, setMasterNameID,] = useState('');
    const [nameID, setNameID] = useState();
    const [incidentID, setIncidentID] = useState('')

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
        console.log(localStoreArray)
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                if (localStoreArray.IncidentID) { setIncidentID(localStoreArray?.IncidentID); }
                if (localStoreArray.NameID) { setNameID(localStoreArray?.NameID); setMasterNameID(localStoreArray?.MasterNameID);get_NameOffender_Count(localStoreArray?.NameID) }
            }
        }
    }, [localStoreArray])

    return (
        <>
            <div className="col-md-12 col-lg-12 mt-2 pt-1">
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0">Offender</p>
                    <FindListDropDown
                        array={NaOffenderListDropDownArray}
                    />
                </div>
            </div>
            <div className={`col-12 col-md-12`}>
                <div className="row px-1">
                    <div className="col-12 mt-3">
                        <SubTab tabs={OffenderTabs} showPage={showPage} setShowPage={setShowPage} status={status} />
                    </div>
                </div>
            </div>
            {
                showPage === 'offense' && <OffenderTabsCom
                    {...{ showPage, nameID, incidentID, LoginPinID, LoginAgencyID }}
                    col1='CrimeID' col2='Offense_Description' col3='OffenseID' col4='OffenderOffenseID' col5='Offense_Description'
                    getUrl='OffenderOffense/GetData_OffenderOffense'
                    addUrl='OffenderOffense/Insert_OffenderOffense'
                    dropDownUrl='OffenderOffense/GetData_InsertOffenderOffense'
                    delUrl='OffenderOffense/Delete_OffenderOffense'
                />
            }
            {
                showPage === 'relationship' && <Relationship
                    {...{ showPage, nameID, incidentID, LoginPinID, LoginAgencyID }}
                // col1='VictimRelationshipTypeID' col2='Description' col3='RelationshipID' col4='OffenderRelationshipID' col5='VictimRelationship_Description'
                // getUrl='OffenderRelationship/GetData_OffenderRelationship'
                // addUrl='OffenderRelationship/Insert_OffenderRelationship'
                // dropDownUrl='OffenderRelationship/GetData_InsertOffenderRelationship'
                // delUrl='OffenderRelationship/Delete_OffenderRelationship'
                />
            }
            {
                showPage === 'InjuryType' && <OffenderTabsCom
                    {...{ showPage, nameID, incidentID, LoginPinID, LoginAgencyID }}
                    col1='VictimInjuryID' col2='Description' col3='InjuryID' col4='OffenderInjuryID' col5='Injury_Description'
                    getUrl='OffenderInjury/GetData_OffenderInjury'
                    addUrl='OffenderInjury/InsertOffenderInjury'
                    dropDownUrl='OffenderInjury/GetData_InsertOffenderInjury'
                    delUrl='OffenderInjury/DeleteOffenderInjury'
                />
            }
            {
                showPage === 'AssaultType' && <OffenderTabsCom
                    {...{ showPage, nameID, incidentID, LoginPinID, LoginAgencyID }}
                    col1='AssaultTypeID' // Dropdown Id
                    col2='Description' // Dropdown Description
                    col3='AssaultID' // Name of DropDown
                    col4='OffenderAssaultID' // Id to Del Dropdown
                    col5='Assault_Description' // Value to show in listData
                    getUrl='OffenderAssault/GetData_OffenderAssault'
                    addUrl='OffenderAssault/InsertOffenderAssault'
                    dropDownUrl='OffenderAssault/GetData_InsertOffenderAssault'
                    delUrl='OffenderAssault/DeleteOffenderAssault'
                />
            }
            {
                showPage === 'Property' && <OffenderTabsCom
                    {...{ showPage, nameID, incidentID, LoginPinID, LoginAgencyID }}
                    col1='PropertyID' // Dropdown Id
                    col2='PropertyNumber' // Dropdown Description
                    col3='PropertyID' // Name of DropDown
                    col4='OffenderPropertyID' // Id to Del Dropdown
                    col5='PropertyNumber' // Value to show in listData
                    col7="ReportedDtTm"
                    col8="PropertyNumber"
                    col9="PropertyLossCode_Description"
                    col10="PropertyType_Description"
                    col11="Value"
                    getUrl='OffenderProperty/GetData_OffenderProperty'
                    addUrl='OffenderProperty/Insert_OffenderProperty'
                    dropDownUrl='OffenderProperty/GetData_InsertOffenderProperty'
                    delUrl='OffenderProperty/Delete_OffenderProperty'
                />
            }
        </>
    )
}

export default Offender