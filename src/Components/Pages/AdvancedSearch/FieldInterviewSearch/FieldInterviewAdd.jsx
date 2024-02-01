import React from 'react'
import Home from './FITabs/Home/Home';
import Name from './FITabs/Name/Name';
import Comments from './FITabs/Comments/Comments';
import Property from './FITabs/Property/Property';
import Narrative from './FITabs/Narrative/Narrative';
const FieldInterviewAdd = () => {
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
                                                        <a className="nav-link" data-toggle="tab" href="#Names">Names</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a className="nav-link" data-toggle="tab" href="#Comments">Comments</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a className="nav-link" data-toggle="tab" href="#Property">Property</a>
                                                    </li>
                                                    <li className="nav-item">
                                                        <a className="nav-link" data-toggle="tab" href="#Narrative">Narrative</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="tab-content" id="myTabContent">
                                            <Home />
                                            <Name />
                                            <Comments />
                                            <Property />
                                            <Narrative />
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

export default FieldInterviewAdd