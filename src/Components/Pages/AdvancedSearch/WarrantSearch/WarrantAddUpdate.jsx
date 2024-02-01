import React from 'react'
import Home from './WarrantTabs/Home/Home'
import Narrative from './WarrantTabs/Narrative/Narrative'
import Comments from './WarrantTabs/Comments/Comments'
import ChargesList from './WarrantTabs/Charges/ChargesList'

const WarrantAddUpdate = () => {

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
                                                        <a className="nav-link active" data-toggle="tab" href="#home"><i className="fa fa-home" style={{ fontSize: 20 }} />
                                                        </a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a className="nav-link" data-toggle="tab" href="#Comments">Comments</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a className="nav-link" data-toggle="tab" href="#Charges">Charges</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a className="nav-link" data-toggle="tab" href="#Clearance">Clearance</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a className="nav-link" data-toggle="tab" href="#Narrative">Narrative</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a className="nav-link" data-toggle="tab" href="#Documents">Documents</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a className="nav-link" data-toggle="tab" href="#Warrant_Services">Warrant Services</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="tab-content" id="myTabContent">
                                            <Home />
                                            <Comments />
                                            <Narrative />
                                            <ChargesList />
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

export default WarrantAddUpdate