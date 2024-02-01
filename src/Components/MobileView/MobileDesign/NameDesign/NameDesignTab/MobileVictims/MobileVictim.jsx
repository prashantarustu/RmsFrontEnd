import React, { useContext, useEffect, useState } from 'react'
import SubTab from '../../../../../Utility/Tab/SubTab';
import { VictimMobileTabs } from '../../../../../Utility/Tab/TabsArray';
import VictimOffense from './MobileVictimsTabs/VictimOffense/VictimOffense';
import VictimRelationship from './MobileVictimsTabs/VictimRelationship/VictimRelationship';
import VictimInjuryType from './MobileVictimsTabs/VictimInjuryType/VictimInjuryType';
import VictimJustifiableHomicide from './MobileVictimsTabs/VictimJustifiableHomicide/VictimJustifiableHomicide';
import VictimAssault from './MobileVictimsTabs/VictimAssault/VictimAssault';
import VictimOfficer from './MobileVictimsTabs/VictimOfficer/VictimOfficer';
import VictimProperty from './MobileVictimsTabs/VictimProperty/VictimProperty';
import VictimORI from './MobileVictimsTabs/VictimORI/VictimORI';
import VictimHome from './MobileVictimsTabs/VictimHome/VictimHome';
import { AgencyContext } from '../../../../../../Context/Agency/Index';


const MobileVictim = () => {        

    const { updateCount, setUpdateCount } = useContext(AgencyContext);
    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState(false);
    const [victimID, setVictimID] = useState('');

    useEffect(() => {
        if (('VictimNameID')) {
            console.log("Calll status true")
            setStatus(true);
        } else {
            setStatus(false);
        }
    }, [updateCount]);

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 41,
            fontSize: 18,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 41,
            fontSize: 18,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    return (
        <>
            <div className={`col-12 col-md-12`}>
                <div className="row px-3" >
                    <div className="col-12 mt-3 new-designtab " >
                        <SubTab tabs={VictimMobileTabs} showPage={showPage} setShowPage={setShowPage} status={status} />
                    </div>
                </div>
            </div>
            {
                showPage === 'home' ?
                    <VictimHome {...{ victimID, setVictimID }} />
                    :
                    showPage === 'Victimoffense' ?
                        <VictimOffense {...{ victimID }} />
                        :
                        showPage === 'Victimrelationship' ?
                            <VictimRelationship {...{ victimID }} />
                            :
                            showPage === 'VictimInjuryType' ?
                                <VictimInjuryType  {...{ victimID }} />
                                :
                                showPage === 'VictimJustifiableHomicide' ?
                                    <VictimJustifiableHomicide {...{ victimID }} />
                                    :
                                    showPage === 'VictimAssaultType' ?
                                        <VictimAssault {...{ victimID }} />
                                        :
                                        showPage === 'VictimOfficer' ?
                                            <VictimOfficer {...{ victimID }} />
                                            :
                                            showPage === 'VictimProperty' ?
                                                <VictimProperty {...{ victimID }} />
                                                :
                                                showPage === 'VictimORI' ?
                                                    <VictimORI {...{ victimID }} />
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

export default MobileVictim