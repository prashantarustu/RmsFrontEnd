import React, { useContext } from 'react';
import { AgencyContext } from '../../../Context/Agency/Index';
import SubTab from '../../Utility/Tab/SubTab';
import { IncidentTabs } from '../../Utility/Tab/TabsArray';
import Home from './IncidentTab/Home';
import Pin from './IncidentTab/PIN/Pin';
import ReportDue from './IncidentTab/ReportDue/ReportDue'
import TypeOfSecurity from './IncidentTab/TypeOfSecurity/TypeOfSecurity';
import DispatchActivity from './IncidentTab/DispatchActivity/DispatchActivity';
import Narrative from './IncidentTab/NarrativesCom/Narrative';
import Comments from './IncidentTab/Comments/Comments';
import DocumentManagement from './IncidentTab/DocumentManagement/DocumentManagement';
import Tab from '../../Utility/Tab/Tab';
import { useState } from 'react';
import LocationHistory from './IncidentTab/LocationHistory/LocationHistory';
import { useEffect } from 'react';
import { Decrypt_Id_Name } from '../../Common/Utility';

const IncidentTab = () => {

    const { incidentStatus, setIncidentStatus, showIncPage, setShowIncPage, localStoreArray, get_LocalStorage, } = useContext(AgencyContext);
    const [Status, setStatus] = useState();
    const [incidentReportedDate, setIncidentReportedDate] = useState(null);

    useEffect(() => {
        // Runs one time-------------->
        // console.log("incident tab page", !localStoreArray.AgencyID || !localStoreArray.PINID)
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage();
        }
    }, []);

    useEffect(() => {
        if (incidentStatus) {
            setStatus(incidentStatus)
        } else {
            setStatus(localStoreArray?.IncidentStatus === true || localStoreArray?.IncidentStatus === "True" ? true : false)
        }
        setShowIncPage('home')
    }, [incidentStatus]);

    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row ">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row">
                                            <div className="col-12 pl-3 mb-1 inc__tabs">
                                                <Tab />
                                            </div>
                                            <div className="col-12 pl-3 incident-tab">
                                                <SubTab tabs={IncidentTabs} status={Status} showPage={showIncPage} setShowPage={setShowIncPage} />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        showIncPage === 'home' ?
                                            <Home {...{ incidentReportedDate, setIncidentReportedDate }} />
                                            :
                                            showIncPage === 'Pin' ?
                                                <Pin {...{incidentReportedDate}} />
                                                :
                                                showIncPage === 'report due' ?
                                                    <ReportDue />
                                                    :
                                                    showIncPage === 'type of security' ?
                                                        <TypeOfSecurity />
                                                        :
                                                        showIncPage === 'dispatch activity' ?
                                                            <DispatchActivity />
                                                            :
                                                            showIncPage === 'narrative' ?
                                                                <Narrative {...{ incidentReportedDate }} />
                                                                :
                                                                showIncPage === 'comments' ?
                                                                    <Comments {...{ incidentReportedDate }} />
                                                                    :
                                                                    showIncPage === 'document_management' ?
                                                                        <DocumentManagement />
                                                                        :
                                                                        showIncPage === 'location history' ?
                                                                            <LocationHistory />
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

export default IncidentTab