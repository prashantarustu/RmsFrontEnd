import React, { useContext, useEffect } from 'react'
import SubTab from '../../Utility/Tab/SubTab'
import { VehicleTabs } from '../../Utility/Tab/TabsArray'
import { useState } from 'react';
import Home from './VehicleTab/Home/Home';
import VehicleNotes from './VehicleTab/VehicleNotes/VehicleNotes';
import Document from './VehicleTab/Document/Document';
import RecoveredProperty from './VehicleTab/RecoveredProperty/RecoveredProperty';
import VehicleTransactionLog from './VehicleTab/VehicleTransactionLog/VehicleTransactionLog';
import { AgencyContext } from '../../../Context/Agency/Index';
import { Decrypt_Id_Name } from '../../Common/Utility';
import VehiclePawnProperty from './VehicleTab/VehiclePawnProperty/VehiclePawnProperty';
import TowingVehicle from './VehicleTab/TowingVehicle/TowingVehicle';

const Vehicle_Add_Up = () => {

    const { setOffenceShowPage, localStoreArray, get_LocalStorage, vehicleStatus } = useContext(AgencyContext);

    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState();
    const [showVehicleRecovered, setVehicleRecovered] = useState(false);

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', VehicleID: '', VehicleStatus: '', IncidentNumber: '', IncidentStatus: '' }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray.IncidentStatus) {
            get_LocalStorage();
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (vehicleStatus) {
                setStatus(vehicleStatus);
            } else {
                setStatus(localStoreArray?.VehicleStatus === true || localStoreArray?.VehicleStatus === "True" ? true : false);
            }
        }
    }, [localStoreArray])

    return (
        <>
            <div className="section-body view_page_design pt-1">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row  ">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row" style={{ marginTop: '-15px' }}>
                                            <div className="col-12 pl-3">
                                                <SubTab tabs={VehicleTabs} setShowPage={setShowPage} showVehicleRecovered={showVehicleRecovered} showPage={showPage} status={status} />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        showPage === 'home' ?
                                            <Home {...{ setStatus, setVehicleRecovered, }} />
                                            :
                                            showPage === 'VehicleNotes' ?
                                                <VehicleNotes  {...{}} />
                                                :
                                                // showPage === 'ViewInvolvements' ?
                                                //     <ViewInvolvement />
                                                //     :
                                                showPage === 'Document' ?
                                                    <Document  {...{}} />
                                                    :
                                                    showPage === 'recoveredproperty' ?
                                                        <RecoveredProperty  {...{}} />
                                                        :
                                                    showPage === 'pawnvehicle' ?
                                                        <VehiclePawnProperty  {...{}} />
                                                        :
                                                    showPage === 'TowingInformation' ?
                                                        <TowingVehicle  {...{}} />
                                                        :
                                                        showPage === 'VehicleTransactionLog' ?
                                                            <VehicleTransactionLog   {...{}} />
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

export default Vehicle_Add_Up