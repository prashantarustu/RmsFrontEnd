import React from 'react'
import SubTab from '../../Utility/Tab/SubTab';
import { PropertyTabs } from '../../Utility/Tab/TabsArray';
import { useContext } from 'react';
import { AgencyContext } from '../../../Context/Agency/Index';
import { useState } from 'react';
import Home from './PropertyTab/Home/Home'
import Document from './PropertyTab/Document/Document'
import Owner from './PropertyTab/Owner/Owner'
import Offense from './PropertyTab/Offense/Offense'
import { useEffect } from 'react';
import RecoveredProperty from './PropertyTab/RecoveredProperty/RecoveredProperty';
import PropertyTransactionlog from './PropertyTab/PropertyTransactionLog/PropertyTransactionlog';
import { Decrypt_Id_Name } from '../../Common/Utility';
import PawnProperty from './PropertyTab/PawnProperty/PawnProperty';

const Property_Tabs = () => {

    const { localStoreArray, setLocalStoreArray, get_LocalStorage, propertyStatus, setPropertyStatus } = useContext(AgencyContext)

    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState(false)
    const [showRecovered, setRecovered] = useState(false)

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', propertyStatus: '', IncidentNumber: '', IncidentStatus: '' }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray.IncidentStatus) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        // console.log(localStoreArray)
        if (propertyStatus) {
            setStatus(propertyStatus);
        } else {
            setStatus(localStoreArray?.propertyStatus === true || localStoreArray?.propertyStatus === "True" ? true : false);
        }
    }, [localStoreArray, propertyStatus])

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
                                                <SubTab tabs={PropertyTabs} setShowPage={setShowPage} showPage={showPage} status={status} showRecovered={showRecovered} />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        showPage === 'home' ?
                                            <Home {...{ setRecovered }} />
                                            :
                                            showPage === 'Document' ?
                                                <Document />
                                                :
                                                showPage === 'Owner' ?
                                                    <Owner />
                                                    :
                                                    showPage === 'Offense' ?
                                                        <Offense />
                                                        :
                                                        showPage === 'Recoveredproperty' ?
                                                            <RecoveredProperty />
                                                            :
                                                        showPage === 'Pawnproperty' ?
                                                            <PawnProperty />
                                                            :
                                                
                                                            showPage === 'PropertyTransactionLog' ?
                                                                <PropertyTransactionlog />
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

export default Property_Tabs