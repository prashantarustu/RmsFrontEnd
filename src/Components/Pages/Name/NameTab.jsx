import React, { useContext, useEffect } from 'react'
import SubTab from '../../Utility/Tab/SubTab';
import { NameTabs } from '../../Utility/Tab/TabsArray';
import Home from './NameTab/Home/Home';
import Tab from '../../Utility/Tab/Tab';
import { useState } from 'react';
import General from './NameTab/General/General';
import ContactDetails from './NameTab/ContactDetails/ContactDetails';
import Aliases from './NameTab/Aliases/Aliases';
import Documents from './NameTab/Documents/Documents';
import Smt from './NameTab/SMT/Smt';
import Victim from './NameTab/Victim/Victim';
import IdentificationNumber from './NameTab/IdentificationNumber/IdentificationNumber';
import Offender from './NameTab/Offender/Offender';
import Gang from './NameTab/Gang/Gang';
import { AgencyContext } from '../../../Context/Agency/Index';
import Connection from './NameTab/Connection/Connection';
import Address from './NameTab/Address/Address';
import TransactionLog from './NameTab/TransactionLog/TransactionLog';
import { Decrypt_Id_Name } from '../../Common/Utility';

const NameTab = () => {

    const { nameStatus, setNameStatus, updateCount, nameShowPage, setNameShowPage, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);
    const [status, setStatus] = useState();

    const [showOffender, setShowOffender] = useState(false);
    const [showVictim, setShowVictim] = useState(false);
    const [nameModifiTab, setNameModifiTab] = useState();
    const [IsBusinessName, setIsBusinessName] = useState(false);
    // Not in use--------------
    const [MainIncidentID, setMainIncidentID] = useState('');
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const [MasterNameID, setMasterNameID,] = useState('');

    useEffect(() => {
        // const NameTabsArray = NameTabs?.filter((item) => item.tab !== "Offender" && item.tab !== "Victim")
        if (!IsBusinessName) {
            if (showOffender && showVictim) {
                setNameModifiTab(NameTabs)
            } else if (showOffender) {
                const NameTabsArray = NameTabs?.filter((item) => item.tab !== "Victim")
                setNameModifiTab(NameTabsArray)
            } else if (showVictim) {
                const NameTabsArray = NameTabs?.filter((item) => item.tab !== "Offender")
                setNameModifiTab(NameTabsArray)
            } else {
                // console.log(NameTabs)
                setNameModifiTab(NameTabs)
            }
        } else {
            const NameTabsArray = NameTabs?.filter((item) => item.tab !== "Offender" && item.tab !== "Victim" && item.tab !== "General" && item.tab !== "Aliases" && item.tab !== "Documents" && item.tab !== "SMT" && item.tab !== "Identification Number" && item.tab !== "Transaction Log");
            // console.log(NameTabsArray)
            setNameModifiTab(NameTabsArray)
        }
    }, [showOffender, showVictim, IsBusinessName]);

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', MasterNameID: '', NameID: '', Agency_Name: "", NameStatus: '', IncidentNumber: '', IncidentStatus: '' }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray.IncidentStatus) {
            get_LocalStorage(localStore);
        }
    }, []);

    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
            }
            if (nameStatus) {
                setStatus(nameStatus);
            } else {
                setStatus(localStoreArray.NameStatus === true || localStoreArray.NameStatus === "True" ? true : false);
            }
        }
        setNameShowPage('home')
    }, [localStoreArray])

    return (
        <>
            <div className="section-body view_page_design pt-2">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row ">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row" style={{ marginTop: '-10px' }}>
                                            {/* <div className="col-12 pl-3 mb-1 inc__tabs">
                                                <Tab />
                                            </div> */}
                                            <div className="col-12 pl-3 ">
                                                <SubTab tabs={nameModifiTab} showPage={nameShowPage} setShowPage={setNameShowPage} status={status} showOffender={showOffender} showVictim={showVictim} />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        nameShowPage === 'home' ?
                                            <Home {...{ setStatus, setShowVictim, setShowOffender, setIsBusinessName }} />
                                            :
                                            nameShowPage === 'general' ?
                                                <General />
                                                :
                                                nameShowPage === 'Contact_Details' ?
                                                    <ContactDetails />
                                                    :
                                                    nameShowPage === 'aliases' ?
                                                        <Aliases />
                                                        :
                                                        nameShowPage === 'documents' ?
                                                            <Documents />
                                                            :
                                                            nameShowPage === 'SMT' ?
                                                                <Smt />
                                                                :
                                                                nameShowPage === 'Offender' ?
                                                                    <Offender />
                                                                    :
                                                                    nameShowPage === 'Identification_Number' ?
                                                                        <IdentificationNumber />
                                                                        :
                                                                        nameShowPage === 'Victim' ?
                                                                            <Victim showTabs={setNameShowPage} />
                                                                            :
                                                                            nameShowPage === 'Gang' ?
                                                                                <Gang />
                                                                                :
                                                                                nameShowPage === 'connections' ?
                                                                                    <Connection />
                                                                                    :
                                                                                    nameShowPage === 'Address' ?
                                                                                        <Address />
                                                                                        :
                                                                                        nameShowPage === 'TransactionLog' ?
                                                                                            <TransactionLog />
                                                                                            :
                                                                                            // showPage === 'certifiedBy' ?
                                                                                            //     <CertifiedBy />
                                                                                            //     :
                                                                                            <></>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NameTab