import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AgencyContext } from '../../../../Context/Agency/Index'
import { MobileNameTabs } from '../../../Utility/Tab/TabsArray'
import MobileAdditional from './NameDesignTab/MobileAdditional/MobileAdditional'
import MobileVictim from './NameDesignTab/MobileVictims/MobileVictim'
import MobileOffenders from './NameDesignTab/MobileOffenders/MobileOffenders'
import MobileIdentification from './NameDesignTab/MobileIdentification/MobileIdentification'
import MobileSMT from './NameDesignTab/MobileSmt/MobileSmt'
import MobileDocument from './NameDesignTab/MobileDocument/MobileDocument'
import MobileAlias from './NameDesignTab/MobileAlias/MobileAlias'
import MobileContact from './NameDesignTab/MobileContact/MobileContact'
import MobileSubTab from '../../MobileUtility/MobileSubTab'

const NameMobileTab = () => {
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
                                    <div className="col-12  mobile__tabs " style={{ marginBottom: '5px' }}>
                                        <Link to={'/mobile-name'}>
                                            <div class="" style={{ padding: '0px' }}>
                                                <button type="button" class="close mr-1 mb-2" style={{ color: 'red', fontSize: '22px', fontWeight: '900' }}>&times;</button>
                                            </div>
                                        </Link>
                                        <MobileSubTab tabs={MobileNameTabs} setShowPage={setShowPage} showPage={showPage} status={false} />
                                        {/* <p>sdfsdfshd</p> */}
                                    </div>

                                </div>
                                <div className={`col-12 col-md-12`}>
                                    <div className=''>
                                        {showPage === 'home' && navigate('/mobile-name')}
                                        {showPage === 'MobileAdditionalInfo' && <MobileAdditional />}
                                        {showPage === 'MobileContacts' && <MobileContact />}
                                        {showPage === 'MobileAlias' && <MobileAlias />}
                                        {showPage === 'MobileDocument' && <MobileDocument />}
                                        {showPage === 'MobileSMT' && <MobileSMT />}
                                        {showPage === 'MobileIdentification' && <MobileIdentification />}
                                        {showPage === 'MobileOffender' && <MobileOffenders />}
                                        {showPage === 'MobileVictim' && <MobileVictim />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
   </>
  )
}

export default NameMobileTab