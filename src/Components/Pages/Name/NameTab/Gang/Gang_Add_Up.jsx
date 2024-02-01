import React from 'react'
import { GangTabs } from '../../../../Utility/Tab/TabsArray'
import { useContext } from 'react';
import { useState } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import SubTab from '../../../../Utility/Tab/SubTab';
import Home from './GangTab/Home/Home';
import Member from './GangTab/Member/Member';
import GangNotes from './GangTab/GangNotes/GangNotes';
import Picture from './GangTab/Picture/Picture';
import AuditLog from './GangTab/AuditLog/AuditLog';
import RivalGang from './GangTab/RivalGang/RivalGang';

const Gang_Add_Up = () => {

    const { updateCount } = useContext(AgencyContext)
    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState()
    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row  ">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row">
                                            <div className="col-12 pl-3">
                                                <SubTab tabs={GangTabs} setShowPage={setShowPage} showPage={showPage} status={status} />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        showPage === 'home' ?
                                            <Home />
                                            :
                                            showPage === 'Member' ?
                                                <Member />
                                                :
                                                showPage === 'RivalGang' ?
                                                    <RivalGang />
                                                    :
                                                    showPage === 'gangnotes' ?
                                                        <GangNotes />
                                                        :
                                                        showPage === 'Picture' ?
                                                            <Picture />
                                                            :
                                                            showPage === 'AuditLog' ?
                                                                <AuditLog />
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

export default Gang_Add_Up