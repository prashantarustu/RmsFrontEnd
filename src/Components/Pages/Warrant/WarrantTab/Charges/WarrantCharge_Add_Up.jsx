import React from 'react';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useState } from 'react';
import { ChargeTabs } from '../../../../Utility/Tab/TabsArray';
import SubTab from '../../../../Utility/Tab/SubTab';
import Penalties from './ChargeTab/Penalties/Penalties';
import Home from './ChargeTab/Home/Home';
import CourtDisposition from './ChargeTab/CourtDisposition/CourtDisposition';
import Comments from './ChargeTab/Comments/Comments';
import Weapon from './ChargeTab/Weapon/Weapon';
import Offense from './ChargeTab/Offense/Offense';
import { useEffect } from 'react';
import { Decrypt_Id_Name } from '../../../../Common/Utility';

const WarrantCharge_Add_Up = () => {

    const { updateCount, warentStatus,  get_LocalStorage, localStoreArray } = useContext(AgencyContext);
    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState()

    const [MainIncidentID, setMainIncidentID] = useState('');
    const [ChargeID, setChargeID] = useState('');
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', ChargeID: '', warentStatus: '', }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                setMainIncidentID(localStoreArray?.IncidentID);
                // if (warentStatus) {
                //     setStatus(warentStatus);
                // } else {
                //     setStatus(localStoreArray?.warentStatus);
                // }
                if (localStoreArray.ChargeID) setChargeID(localStoreArray?.ChargeID); else setChargeID()
            }
        }
    }, [localStoreArray, updateCount])

    useEffect(() => {
        if (ChargeID) {
            setStatus(true)
        } else {
            setStatus(false)
        }
    }, [updateCount, ChargeID])

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
                                                <SubTab tabs={ChargeTabs} setShowPage={setShowPage} showPage={showPage} status={status} />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        showPage === 'home' ?
                                            <Home  {...{ setChargeID, ChargeID }} />
                                            :
                                            showPage === 'Penalties' ?
                                                <Penalties {...{ LoginPinID, LoginAgencyID, ChargeID, MainIncidentID }} />
                                                :
                                                showPage === 'CourtDisposition' ?
                                                    <CourtDisposition {...{ LoginPinID, LoginAgencyID, ChargeID, MainIncidentID }} />
                                                    :
                                                    showPage === 'Comments' ?
                                                        <Comments {...{ LoginPinID, LoginAgencyID, ChargeID, MainIncidentID }} />
                                                        :
                                                        showPage === 'Weapon' ?
                                                            <Weapon {...{ LoginPinID, LoginAgencyID, ChargeID, MainIncidentID }} />
                                                            :
                                                            showPage === 'Offense' ?
                                                                <Offense {...{ LoginPinID, LoginAgencyID, ChargeID, MainIncidentID }} />
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

export default WarrantCharge_Add_Up