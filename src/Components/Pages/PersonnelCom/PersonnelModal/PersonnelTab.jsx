import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AgencyContext } from '../../../../Context/Agency/Index';
import SubTab from '../../../Utility/Tab/SubTab';
import { PersTabs } from '../../../Utility/Tab/TabsArray';
import Dates from '../PersTab/DatesMember/Dates';
import EffectiveFieldPermission from '../PersTab/EffectiveFieldPermission/EffectiveFieldPermission';
import Effectivepermission from '../PersTab/Effectivepermission/Effectivepermission';
import Emergency from '../PersTab/Emergency/Emergency';
import PersonnelGroup from '../PersTab/Group/PersonnelGroup';
import Home from '../PersTab/Home/Index';
import { Decrypt_Id_Name } from '../../../Common/Utility';

const PersonnelTab = () => {

    const { showPagePersonnel, setShowPagePersonnel, personnelStatus, get_CountList, count, localStoreArray, setLocalStoreArray, get_LocalStorage } = useContext(AgencyContext)

    const useQuery = () => new URLSearchParams(useLocation().search);
    let aId = useQuery().get('id').split(" ", 3)[0].split("/", 1)[0].substring(10,);
    let pId = useQuery().get('pd').split(" ", 3)[0].split("/", 1)[0].substring(10,);

    const [pinId, setPinID] = useState('');
    const [agencyId, setAgencyId] = useState('');
    const [dobHireDate, setDobHireDate] = useState(null);

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        // console.log(localStoreArray)
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setAgencyId(localStoreArray?.AgencyID);
                setPinID(localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    useEffect(() => {
        get_CountList(aId, pId)
    }, [aId])

    return (
        <>
            <div className="section-body view_page_design">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row">
                                            <div className="col-12 pl-3">
                                                <SubTab tabs={PersTabs} setShowPage={setShowPagePersonnel} count={count} showPage={showPagePersonnel} status={personnelStatus} />
                                            </div>
                                        </div>
                                        {/* Tabs */}
                                        {
                                            showPagePersonnel === 'home' ?
                                                <Home {...{ pId, aId, pinId, setDobHireDate }} />
                                                :
                                                showPagePersonnel === 'characteristics,dates & numbers' ?
                                                    <Dates {...{ pId, aId, pinId, dobHireDate }} />
                                                    :
                                                    showPagePersonnel === 'emergency contact' ?
                                                        <Emergency {...{ pId, aId, pinId }} />
                                                        :
                                                        showPagePersonnel === 'effective screen permission' ?
                                                            <Effectivepermission {...{ pId, aId, pinId }} />
                                                            :
                                                            showPagePersonnel === 'group' ?
                                                                <PersonnelGroup {...{ pId, aId, pinId }} />
                                                                :
                                                                // not in use
                                                                showPagePersonnel === 'effective field permisson' ?
                                                                    <EffectiveFieldPermission />
                                                                    : ''
                                        }
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

export default PersonnelTab