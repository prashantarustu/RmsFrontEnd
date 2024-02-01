import React, { useContext } from "react";
import MobileSubTab from '../../../MobileUtility/MobileSubTab'
import { MobileIncidentTabs } from '../../../../Utility/Tab/TabsArray'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import MobileNarrative from './MobileNarrative/MobileNarrative'
import MobileComments from './MobileComments/MobileComments'
import IncidentDesign from './IncidentHome/IncidentDesgin'
import { Link, useNavigate } from 'react-router-dom'


const IncidentTab = () => {

    const { setShowPage, showPage } = useContext(AgencyContext)

    const navigate = useNavigate()
    
    return (
        <>
            <div>
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12 px-2">
                        <div className="card Agency " style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0' }}>
                            <div className="card-body ">
                                {/* <div className="row "> */}
                                    {/* <div className={`col-12 col-md-12`}> */}
                                    <div className="card Agency " style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0', borderTop: 'none', marginTop: '-10px' }}>
                                        <div className="col-12  mobile__tabs " style={{ marginBottom: '1px' }}>
                                            <Link to={'/mobile-incident'}>
                                                <div class="" style={{ padding: '0px' }}>
                                                    <button type="button" class="close mr-1 mb-2" style={{ color: 'red', fontSize: '22px', fontWeight: '900' }}>&times;</button>
                                                </div>
                                            </Link>
                                            <MobileSubTab tabs={MobileIncidentTabs} setShowPage={setShowPage} showPage={showPage} status={false} />
                                            {/* <p>sdfsdfshd</p> */}
                                        </div>

                                    </div>
                                    <div className={`col-12 col-md-12`}>
                                        <div className=''>
                                            {showPage === 'home' && navigate('/mobile-incident')}
                                            {showPage === 'Mobilenarrative' && <MobileNarrative />}
                                            {showPage === 'Mobilecomments' && <MobileComments />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/* </div> */}
            {/* </div> */}

        </>
    )
}

export default IncidentTab
