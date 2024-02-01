import React, { useContext, useState } from 'react'
import Home from './FieldInterviewTab/Home/Home'
import { FieldTabs } from '../../Utility/Tab/TabsArray'
import { AgencyContext } from '../../../Context/Agency/Index';
import SubTab from '../../Utility/Tab/SubTab';
import Tab from '../../Utility/Tab/Tab';
import Name from './FieldInterviewTab/Name/Name';
import Comments from './FieldInterviewTab/Comments/Comments';

const FieldInterviewTab = () => {
    const [Status, setStatus] = useState();
    const [incidentReportedDate, setIncidentReportedDate] = useState(null);
    const [showPage, setShowPage] = useState('home');

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
                                            {/* <div className="col-12 pl-3 mb-1 inc__tabs">
                                                <Tab />
                                            </div> */}
                                            <div className="col-12 pl-3 ">
                                                <SubTab tabs={FieldTabs} status={Status} showPage={showPage} setShowPage={setShowPage} />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        showPage === 'home' ?
                                            <Home />
                                            :
                                            showPage === 'FieldName' ?
                                                <Name />
                                                :
                                            showPage === 'FieldComments' ?
                                                <Comments />
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

export default FieldInterviewTab