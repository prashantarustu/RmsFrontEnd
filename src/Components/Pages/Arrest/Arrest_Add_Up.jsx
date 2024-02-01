import React from 'react'
import { ArrestTabs } from '../../Utility/Tab/TabsArray'
import SubTab from '../../Utility/Tab/SubTab'
import { useContext } from 'react'
import { AgencyContext } from '../../../Context/Agency/Index'
import { useState } from 'react'
import Home from './ArrestTab/Home/Home'
import Charges from './ArrestTab/Charges/Charges'
import Comments from './ArrestTab/Comments/Comments'
import Property from './ArrestTab/Property/Property'
import CriminalActivity from './ArrestTab/CriminalActivity/CriminalActivity'
import CourtInformation from './ArrestTab/CourtInformation/CourtInformation'
import Narratives from './ArrestTab/Narratives/Narratives'
import PoliceForce from './ArrestTab/PoliceForce/PoliceForce'
import { useEffect } from 'react'
import Juvenile from './ArrestTab/Juvenile/Juvenile'
import ArrestMainTab from '../../Utility/Tab/ArrestMainTab'
import { Decrypt_Id_Name } from '../../Common/Utility'

const Arrest_Add_Up = () => {

    const { updateCount, localStoreArray, setLocalStoreArray, get_LocalStorage, arrestStatus, setArrestStatus, } = useContext(AgencyContext)
    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState()
    const [showJuvinile, setJuvinile] = useState(false)
    const [showPoliceForce, setPoliceForce] = useState(false)

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', IncidentStatus: '', IncidentNumber: '', ArrestStatus: '', }),
    }

    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID || !localStoreArray.IncidentStatus) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (arrestStatus) {
                setStatus(arrestStatus);
            } else {
                setStatus(localStoreArray?.ArrestStatus === true || localStoreArray?.ArrestStatus === "True" ? true : false);
            }
        }
    }, [localStoreArray, arrestStatus, updateCount])

    // useEffect(() => {
    //     if (ArrestID) { setStatus(true); } else { setStatus(false); }
    // }, [updateCount, ArrestID])

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
                                            <div className="col-12 pl-3 mb-1 inc__tabs">
                                                <ArrestMainTab />
                                            </div>
                                            <div className="col-12 pl-3">
                                                <SubTab tabs={ArrestTabs} setShowPage={setShowPage} showPage={showPage} status={status} showJuvinile={showJuvinile} showPoliceForce={showPoliceForce} />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        showPage === 'home' ?
                                            <Home {...{ setJuvinile, setPoliceForce }} />
                                            :
                                            showPage === 'Charges' ?
                                                <Charges {...{}} />
                                                :
                                                showPage === 'Comments' ?
                                                    <Comments {...{}} />
                                                    :
                                                    showPage === 'Property' ?
                                                        <Property {...{}} />
                                                        :
                                                        showPage === 'CriminalActivity' ?
                                                            <CriminalActivity {...{}} />
                                                            :
                                                            showPage === 'CourtInformation' ?
                                                                <CourtInformation {...{}} />
                                                                :
                                                                showPage === 'Narratives' ?
                                                                    <Narratives {...{}} />
                                                                    :
                                                                    showPage === 'PoliceForce' ?
                                                                        <PoliceForce {...{}} />
                                                                        :
                                                                        showPage === 'Juvenile' ?
                                                                            <Juvenile {...{}} />
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

export default Arrest_Add_Up