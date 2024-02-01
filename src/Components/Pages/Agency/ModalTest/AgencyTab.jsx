import React, { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { AgencyContext } from '../../../../Context/Agency/Index';
import SubTab from '../../../Utility/Tab/SubTab';
import { AgencyTabs } from '../../../Utility/Tab/TabsArray';
import Division from '../AgencyTab/Division/Division';
import FieldSecurity from '../AgencyTab/FieldSecurity/FieldSecurity';
import Group from '../AgencyTab/Group/Group';
import Home from '../AgencyTab/Home/Index';
import LockRestrictLevel from '../AgencyTab/LockRestrictLevel/LockRestrictLevel';
import Login from '../AgencyTab/Login/Login';
import Member from '../AgencyTab/Member/Member';
import PasswordSetting from '../AgencyTab/PasswordSetting/PasswordSetting';
import Personnel from '../AgencyTab/Personnel/Personnel';
import Ranks from '../AgencyTab/Ranks/Ranks';
import Roster from '../AgencyTab/Roster/Roster';
import ScreenPermission from '../AgencyTab/ScreenPermission/ScreenPermission';
import Shift from '../AgencyTab/Shift/Shift';
import Unit from '../AgencyTab/Unit/Unit';
import UnitAssignment from '../AgencyTab/UnitAssignment/UnitAssignment';
import AgencyContact from '../AgencyTab/AgencyContact/AgencyConatct';
import { useEffect } from 'react';
import { Decrypt_Id_Name } from '../../../Common/Utility';
import AgencySetting from '../AgencyTab/AgencySetting/AgencySetting';

const AgencyTab = ({ send_Notification }) => {

    const { showPage, setShowPage, status, get_CountList, count, inActiveStatus, setInActiveStatus, localStoreArray, setLocalStoreArray, getAgency, get_LocalStorage, } = useContext(AgencyContext);

    // const [showPage, setShowPage] = React.useState('home');
    const useQuery = () => new URLSearchParams(useLocation().search);
    let aId = useQuery().get('id').split(" ", 3)[0].split("/", 1)[0].substring(10,);

    const [pinId, setPinID] = useState('');
    const [allowMultipleLogin, setAllowMultipleLogin] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IsSuperadmin: '', LocalAgencyName: '', }),
    }

    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setPinID(localStoreArray?.PINID);
                setAllowMultipleLogin(localStoreArray?.IsSuperadmin);
                getAgency(localStoreArray?.AgencyID, localStoreArray?.PINID)
            }
        }
    }, [localStoreArray])

    useEffect(() => {
        if (status) get_CountList(aId);
    }, [aId]);

    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row  ">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row">
                                            <div className="col-12 pl-3">
                                                <SubTab tabs={AgencyTabs} setShowPage={setShowPage} count={count} showPage={showPage} status={status} />
                                            </div>
                                        </div>
                                        {
                                            showPage === 'home' ?
                                                <Home {...{ aId, pinId, send_Notification, allowMultipleLogin }} />
                                                :
                                                showPage === 'Group' ?
                                                    <Group {...{ aId, pinId }} />
                                                    :
                                                    showPage === 'PasswordSetting' ?
                                                        <PasswordSetting {...{ aId, pinId }} />
                                                        :
                                                        showPage === 'member' ?
                                                            <Member {...{ aId, pinId }} />
                                                            :
                                                            showPage === 'division' ?
                                                                <Division {...{ aId, pinId }} />
                                                                :
                                                                showPage === 'unit' ?
                                                                    <Unit {...{ aId, pinId }} />
                                                                    :
                                                                    showPage === 'personnel' ?
                                                                        <Personnel {...{ aId, pinId }} />
                                                                        :
                                                                        // login page not visible 
                                                                        showPage === 'login' ?
                                                                            <Login />
                                                                            :
                                                                            showPage === 'screenpermission' ?
                                                                                <ScreenPermission {...{ aId, pinId }} />
                                                                                :
                                                                                // lockrestrictlevel page not visible 
                                                                                showPage === 'lockrestrictlevel' ?
                                                                                    <LockRestrictLevel {...{ aId, pinId }} />
                                                                                    :
                                                                                    // roster page not visible 
                                                                                    showPage === 'roster' ?
                                                                                        <Roster  {...{ aId, pinId }} />
                                                                                        :
                                                                                        showPage === 'UnitAssignment' ?
                                                                                            <UnitAssignment {...{ aId, pinId }} />
                                                                                            :
                                                                                            // fieldsecurity page not visible 
                                                                                            showPage === 'fieldsecurity' ?
                                                                                                <FieldSecurity />
                                                                                                :
                                                                                                showPage === 'Ranks' ?
                                                                                                    <Ranks {...{ aId, pinId }} />
                                                                                                    :
                                                                                                    showPage === 'ShiftA' ?
                                                                                                        <Shift {...{ aId, pinId }} />
                                                                                                        :
                                                                                                        showPage === 'AgencyContact' ?
                                                                                                            <AgencyContact {...{ aId, pinId }} />
                                                                                                            :
                                                                                                            showPage === 'AgencySetting' ?
                                                                                                                <AgencySetting {...{ aId, pinId }} />
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

export default AgencyTab