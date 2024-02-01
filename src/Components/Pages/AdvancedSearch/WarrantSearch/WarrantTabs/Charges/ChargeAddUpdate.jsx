import React from 'react'
import Home from './ChargeTabs/Home/Home'
import Panalties from './ChargeTabs/Panalties/Panalties'

const ChargeAddUpdate = () => {
    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row ">
                                    <div className={`col-12 col-md-12 mb-2`}>
                                        <div className="row">
                                            <div className="col-12 pl-3 ">
                                                {/* <SubTab tabs={NameTabs} showPage={showPage} setShowPage={setShowPage} status={status} showOffender={showOffender} showVictim={showVictim} /> */}
                                                <ul className="nav nav-tabs">
                                                    <li className="nav-item">
                                                        <a className="nav-link active" data-toggle="tab" href="#chargeHome"><i className="fa fa-home" style={{ fontSize: 20 }} />
                                                        </a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a className="nav-link" data-toggle="tab" href="#Panalties">Panalties</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a className="nav-link" data-toggle="tab" href="#CourtDisposition">Court Disposition</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a className="nav-link" data-toggle="tab" href="#Weapon">Weapon</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a className="nav-link" data-toggle="tab" href="#AgencySpecificInformation">Agency Specific Information</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a className="nav-link" data-toggle="tab" href="#Comments">Comments</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a className="nav-link" data-toggle="tab" href="#Offence">Offence</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="tab-content" id="myTabContent">
                                           <Home />
                                           <Panalties />
                                        </div>
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

export default ChargeAddUpdate