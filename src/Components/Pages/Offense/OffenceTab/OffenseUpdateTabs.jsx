import React, { useState, useEffect, useContext } from "react";
import BasicInformation from "./BasicInformation/BasicInformation";
import CourtDisposition from "./CourtDisposition/CourtDisposition";
import Home from "./Home/Home";
import MethodOfEntry from "./MethodOfEntry/MethodOfEntry";
import MethodOfOperation from "./MethodOfOperation/MethodOfOperation";
import Offender from "./Offender/Offender";
import OtherCode from "./OtherCode/OtherCode";
import Property from "./Property/Property";
import Victim from "./Victim/Victim";
import Weapon from "./Weapon/Weapon";
import SubTab from "../../../Utility/Tab/SubTab";
import { OffenseTabs } from "../../../Utility/Tab/TabsArray";
import { AgencyContext } from "../../../../Context/Agency/Index";
import { Decrypt_Id_Name } from "../../../Common/Utility";

const OffenceHomeTabs = () => {

    const { offenceStatus, setOffenceStatus, updateCount, offenceShowPage, setOffenceShowPage, localStoreArray, setLocalStoreArray, get_LocalStorage, setIncidentStatus, } = useContext(AgencyContext);
    // const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState()

    const [MainIncidentID, setMainIncidentID] = useState('');
    const [offenceID, setOffenseID] = useState('');
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', OffenceID: '', OffenceStatus: '', IncidentNumber: '', IncidentStatus: '' }),
    }

    useEffect(() => {
        // console.log(!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray.IncidentStatus)
        if (!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray.IncidentStatus) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        // console.log("offense tabs")
        if (localStoreArray) {
            if (localStoreArray.AgencyID && localStoreArray.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                setMainIncidentID(localStoreArray?.IncidentID);
                setOffenseID(localStoreArray?.OffenceID);
                setOffenceStatus(localStoreArray?.OffenceStatus === true || localStoreArray?.OffenceStatus === "True" ? true : false)
            }
        }
        setOffenceShowPage('home');
    }, [localStoreArray])

    useEffect(() => {
        if (offenceStatus) {
            setStatus(true);
        } else {
            setStatus(localStoreArray?.OffenceStatus === true || localStoreArray?.OffenceStatus === "True" ? true : false);
        }
    }, [updateCount, offenceStatus])

    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row  ">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row">
                                            <div className="col-12 pl-3">
                                                <SubTab tabs={OffenseTabs} setShowPage={setOffenceShowPage} showPage={offenceShowPage} status={status} />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        offenceShowPage === 'home' ?
                                            <Home {...{ setStatus, setOffenseID }} />
                                            :
                                            offenceShowPage === 'BasicInformation' ?
                                                <BasicInformation  {...{ LoginPinID, LoginAgencyID, offenceID, MainIncidentID }} />
                                                :
                                                offenceShowPage === 'other code' ?
                                                    <OtherCode {...{ LoginPinID, LoginAgencyID, offenceID, MainIncidentID }} />
                                                    :
                                                    offenceShowPage === 'court disposition' ?
                                                        <CourtDisposition {...{ LoginPinID, LoginAgencyID, offenceID, MainIncidentID }} />
                                                        :
                                                        offenceShowPage === 'method of enrty' ?
                                                            <MethodOfEntry {...{ LoginPinID, LoginAgencyID, offenceID, MainIncidentID }} />
                                                            :
                                                            offenceShowPage === 'method of operation' ?
                                                                <MethodOfOperation {...{ LoginPinID, LoginAgencyID, offenceID, MainIncidentID }} />
                                                                :
                                                                offenceShowPage === 'Offenders' ?
                                                                    <Offender {...{ LoginPinID, LoginAgencyID, offenceID, MainIncidentID }} />
                                                                    :
                                                                    offenceShowPage === 'property' ?
                                                                        <Property {...{ LoginPinID, LoginAgencyID, offenceID, MainIncidentID }} />
                                                                        :
                                                                        offenceShowPage === 'Victims' ?
                                                                            <Victim {...{ LoginPinID, LoginAgencyID, offenceID, MainIncidentID }} />
                                                                            :
                                                                            offenceShowPage === 'weapon' ?
                                                                                <Weapon {...{ LoginPinID, LoginAgencyID, offenceID, MainIncidentID }} />
                                                                                :
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

export default OffenceHomeTabs