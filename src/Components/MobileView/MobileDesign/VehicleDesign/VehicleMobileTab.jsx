import React, { useEffect, useState } from 'react'
import MobileSubTab from '../../MobileUtility/MobileSubTab'
import { Link, useNavigate } from 'react-router-dom'
import { MobileVehicleTabs } from '../../../Utility/Tab/TabsArray'
import { useContext } from 'react'
import { AgencyContext } from '../../../../Context/Agency/Index'
import MobileVehicleDocument from './VehicleDesignTab/MobileVehicleDocument/MobileVehicleDocument'
import MobileVehicleNotes from './VehicleDesignTab/MobileVehicleNotes/MobileVehicleNotes'
import MobileVehicleRecovered from './VehicleDesignTab/MobileVehicleRecovered/MobileVehicleRecovered'
import MobileVehicleInformation from './VehicleDesignTab/MobileVehicleInformation/MobileVehicleInformation'
import { Decrypt_Id_Name } from '../../../Common/Utility'

const VehicleMobileTab = () => {
  const { setOffenceShowPage, localStoreArray, get_LocalStorage, vehicleStatus,showPage, setShowPage  } = useContext(AgencyContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState();

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
      <div>
        <div className="row clearfix" >
          <div className="col-12 col-sm-12 px-2">
            <div className="card Agency " style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0' }}>
              <div className="card-body ">
                <div className="card Agency " style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0', borderTop: 'none', marginTop: '-10px' }}>
                  <div className="col-12  mobile__tabs " style={{ marginBottom: '5px' }}>
                    <Link to={'/mobile-vehicle'}>
                      <div class="" style={{ padding: '0px' }}>
                        <button type="button" class="close mr-1 mb-2" style={{ color: 'red', fontSize: '22px', fontWeight: '900' }}>&times;</button>
                      </div>
                    </Link>
                    <MobileSubTab tabs={MobileVehicleTabs} setShowPage={setShowPage} showPage={showPage} status={status} />
                  </div>

                </div>
                <div className={`col-12 col-md-12`}>
                  <div className=''>
                    {showPage === 'home' && navigate('/mobile-vehicle' ,{...{ setStatus }})}
                    {showPage === 'MobileAdditionalInformation' && <MobileVehicleInformation />}
                    {showPage === 'MobileVehicleNotes' && <MobileVehicleNotes />}
                    {showPage === 'VehicleDocument' && <MobileVehicleDocument />}
                    {showPage === 'MobileVehicleRecovered' && <MobileVehicleRecovered />}

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

export default VehicleMobileTab