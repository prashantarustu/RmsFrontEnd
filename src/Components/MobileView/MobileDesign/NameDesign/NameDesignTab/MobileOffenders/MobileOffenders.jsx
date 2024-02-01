import React, { useState } from 'react'
import SubTab from '../../../../../Utility/Tab/SubTab';
import { OffenderMobileTabs } from '../../../../../Utility/Tab/TabsArray';
import OffenderTabsCom from '../../../../../Pages/Name/NameTab/Offender/OffenderTab/AllTabCom/OffenderTabsCom';
import MobileOffense from './MobileOffendersTabs/MobileOffense/MobileOffense';
import MobileRelationship from './MobileOffendersTabs/MobileRelationship/MobileRelationship';
import MobileInjuryType from './MobileOffendersTabs/MobileInjury/MobileInjuryType';
import MobileAssault from './MobileOffendersTabs/MobileAssault/MobileAssault';
import MobileProperty from './MobileOffendersTabs/MobileProperty/MobileProperty';

const MobileOffenders = () => {
    const [showPage, setShowPage] = useState('Mobileoffense');
    const [status, setStatus] = useState(true)

    return (
        <>
            <div className="col-md-12 col-lg-12 px-3 mt-2 pt-1">
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0" style={{ fontSize: '18px' }}>Offender</p>
                    {/* <FindListDropDown
                        array={NaOffenderListDropDownArray}
                    /> */}
                </div>
            </div>
            <div className={`col-12 col-md-12`}>
                <div className="row px-3" >
                    <div className="col-12 mt-3 new-designtab " >
                        <SubTab tabs={OffenderMobileTabs} showPage={showPage} setShowPage={setShowPage} status={status} />
                    </div>
                </div>
            </div>

            {
                showPage === 'Mobileoffense' ?
                    <MobileOffense />
                    :
                showPage === 'Mobilerelationship' ?
                    <MobileRelationship />
                    :
                showPage === 'MobileInjuryType' ?
                    <MobileInjuryType />
                    :
                showPage === 'MobileAssaultType' ?
                    <MobileAssault />
                    :
                showPage === 'MobileProperty' ?
                    <MobileProperty />
                    :
                    <></>
            }
            {/* {
                showPage === 'Mobileoffense' && <OffenderTabsCom
                    {...{ showPage }}
                    col1='CrimeID' col2='Offense_Description' col3='OffenseID' col4='OffenderOffenseID' col5='Offense_Description'
                    getUrl='OffenderOffense/GetData_OffenderOffense'
                    addUrl='OffenderOffense/Insert_OffenderOffense'
                    dropDownUrl='OffenderOffense/GetData_InsertOffenderOffense'
                    delUrl='OffenderOffense/Delete_OffenderOffense'
                />
            }  */}
        </>
    )
}

export default MobileOffenders