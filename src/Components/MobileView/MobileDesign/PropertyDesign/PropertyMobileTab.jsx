import React from 'react'
import { useContext } from 'react'
import { AgencyContext } from '../../../../Context/Agency/Index'
import { MobilePropertyTabs } from '../../../Utility/Tab/TabsArray'
import MobileSubTab from '../../MobileUtility/MobileSubTab'
import { Link, useNavigate } from 'react-router-dom'
import MobileDocument from './PropertyDesignTab/MobileDocument/MobileDocument'
import MobileOffense from './PropertyDesignTab/MobileOffense/MobileOffense'
import MobileOwner from './PropertyDesignTab/MobileOwner/MobileOwner'
import MobileInformation from './PropertyDesignTab/MobileInformation/MobileInformation'
import MobileRecoveredProperty from './PropertyDesignTab/MobileRecoveredProperty/MobileRecoveredProperty'

const PropertyMobileTab = () => {

  const { setShowPage, showPage } = useContext(AgencyContext)
  const navigate = useNavigate()
  
  return (
    <>
      <div>
        <div className="row clearfix" >
          <div className="col-12 col-sm-12 px-2">
            <div className="card Agency " style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0' }}>
              <div className="card-body ">
                <div className="card Agency " style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0', borderTop: 'none', marginTop: '-10px' }}>
                  <div className="col-12  mobile__tabs " style={{ marginBottom: '5px' }}>
                    <Link to={'/mobile-property'}>
                      <div class="" style={{ padding: '0px' }}>
                        <button type="button" class="close mr-1 mb-2" style={{ color: 'red', fontSize: '22px', fontWeight: '900' }}>&times;</button>
                      </div>
                    </Link>
                    <MobileSubTab tabs={MobilePropertyTabs} setShowPage={setShowPage} showPage={showPage} status={false} />
                  </div>
                </div>
                <div className={`col-12 col-md-12`}>
                  <div className=''>
                    {showPage === 'home' && navigate('/mobile-property')}
                    {showPage === 'MobileMiscellaneousInformation' && <MobileInformation />}
                    {showPage === 'MobileOwner' && <MobileOwner />}
                    {showPage === 'MobileOffenses' && <MobileOffense />}
                    {showPage === 'MobileDocuments' && <MobileDocument />}
                    {showPage === 'MobileRecoveredProperty' && <MobileRecoveredProperty />}
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

export default PropertyMobileTab