import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AgencyContext } from '../../../../Context/Agency/Index'
import { Link, useNavigate } from 'react-router-dom'
import MobileSubTab from '../../MobileUtility/MobileSubTab'
import { MobileOffenseTabs } from '../../../Utility/Tab/TabsArray'
import MobileBasicInfromation from './OffenseDesignTab/MobileBasicInformation/MobileBasicInfromation'
import MobileOtherCode from './OffenseDesignTab/MobileOtherCode/MobileOtherCode'
import MobileMethodOfOperation from './OffenseDesignTab/MobileMethodOfOperation/MobileMethodOfOperation'
import MobileMethodOfEntry from './OffenseDesignTab/MobileMethodOfEntry/MobileMethodOfEntry'
import MobileCourtDisposition from './OffenseDesignTab/MobileCourtDisposition/MobileCourtDisposition'
import MobileWeapon from './OffenseDesignTab/MobileWeapon/MobileWeapon'
import MobileVictims from './OffenseDesignTab/MobileVictims/MobileVictims'
import MobileOffenders from './OffenseDesignTab/MobileOffenders/MobileOffenders'
import MobileProperty from './OffenseDesignTab/MobileProperty/MobileProperty'
import { Decrypt_Id_Name } from '../../../Common/Utility'

const OffenseMobileTab = () => {

    // const { setShowPage, showPage } = useContext(AgencyContext)
    const navigate = useNavigate()


    const { offenceStatus, setOffenceStatus, updateCount, offenceShowPage, setOffenceShowPage, localStoreArray, setLocalStoreArray, get_LocalStorage, setIncidentStatus, setShowPage, showPage } = useContext(AgencyContext);
    // const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState()

    // const [MainIncidentID, setMainIncidentID] = useState('');
    // const [offenceID, setOffenseID] = useState('');
    // const [LoginAgencyID, setLoginAgencyID] = useState('');
    // const [LoginPinID, setLoginPinID,] = useState('');

    // const localStore = {
    //     Value: "",
    //     UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    //     Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', OffenceID: '', CrimeID:'', OffenceStatus: '', IncidentNumber: '', IncidentStatus: '' }),
    // }

    // useEffect(() => {
    //     console.log(!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray.IncidentStatus)
    //     if (!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray.IncidentStatus) {
    //         get_LocalStorage(localStore);
    //     }
    // }, []);

    // // Onload Function
    // useEffect(() => {
    //     console.log("offense tabs")
    //     if (localStoreArray) {
    //         if (localStoreArray.AgencyID && localStoreArray.PINID) {
    //             setLoginAgencyID(localStoreArray?.AgencyID);
    //             setLoginPinID(localStoreArray?.PINID);
    //             setMainIncidentID(localStoreArray?.IncidentID);
    //             setOffenseID(localStoreArray?.OffenceID);
    //             setOffenceStatus(localStoreArray?.OffenceStatus === true || localStoreArray?.OffenceStatus === "True" ? true : false)
    //         }
    //     }
    //     setShowPage('home');
    // }, [localStoreArray])

    // useEffect(() => {
    //     if (offenceStatus) {
    //         setStatus(true);
    //     } else {
    //         setStatus(localStoreArray?.OffenceStatus === true || localStoreArray?.OffenceStatus === "True" ? true : false);
    //     }
    // }, [updateCount, offenceStatus])

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
                                        <Link to={'/mobile-offense'}>
                                            <div class="" style={{ padding: '0px' }}>
                                                <button type="button" class="close mr-1 mb-2" style={{ color: 'red', fontSize: '22px', fontWeight: '900' }}>&times;</button>
                                            </div>
                                        </Link>
                                        <MobileSubTab tabs={MobileOffenseTabs} setShowPage={setShowPage} showPage={showPage} status={false} />
                                        {/* <p>sdfsdfshd</p> */}
                                    </div>

                                </div>
                                <div className={`col-12 col-md-12`}>
                                    <div className=''>
                                        {showPage === 'home' && navigate('/mobile-offense')}
                                        {showPage === 'MobileBasicInformation' && <MobileBasicInfromation />}
                                        {showPage === 'MobileMethodOperation' && <MobileMethodOfOperation />}
                                        {showPage === 'MobileMethodEntry' && <MobileMethodOfEntry />}
                                        {showPage === 'MobileCourtDisposition' && <MobileCourtDisposition />}
                                        {showPage === 'MobileWeapon' && <MobileWeapon />}
                                        {showPage === 'MobileVictims' && <MobileVictims />}
                                        {showPage === 'MobileOffenders' && <MobileOffenders />}
                                        {showPage === 'MobileProperty' && <MobileProperty />}
                                        {showPage === 'MobileOtherCode' && <MobileOtherCode />}
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


export default OffenseMobileTab