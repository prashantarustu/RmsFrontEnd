import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AgencyContext } from "../../../Context/Agency/Index";
var CryptoJS = require("crypto-js");

const DashboardSidebar = () => {

    const { incidentRecentData } = useContext(AgencyContext)
    const [expand, setExpand] = useState()
    const [expandList, setExpandList] = useState()
    const [plusMinus, setPlusMinus] = useState(false)
    const [plusMinus1, setPlusMinus1] = useState(false)
    const [plusMinus2, setPlusMinus2] = useState(false)
    const [plusMinus3, setPlusMinus3] = useState(false)

    const callUtilityModules = (type, val) => {
        if (type === 'List') {
            setPlusMinus(!plusMinus);
            setPlusMinus1(!plusMinus1)
            setPlusMinus2(!plusMinus2)
            setPlusMinus3(!plusMinus3)
            setExpand(expand ? expand[0].id === val ? { id: val } : '' : { id: val })
        }
        else {
            setPlusMinus(!plusMinus);
            setExpandList(expandList === val ? '' : val)
        }
    }

    return (
        <>
            <li className="">
                <Link to="/dashboard-page">
                    <i className="fa fa-home"></i>
                    <span>Dashboard</span>
                </Link>
            </li>
            <li>
                <Link to="#" class="has-arrow arrow-c" aria-expanded={plusMinus} onClick={() => callUtilityModules('Table', 'Master Table')}><i class="fa fa-lock"></i><span>Utility</span></Link>
                <ul aria-expanded={`${expandList === 'Master Table' ? true : false}`} className={`${expandList === 'Master Table' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-23px' }}>
                    <>
                        {/* {
                            listManagerSP ? listManagerSP[0]?.DisplayOK ? */}
                        <li className="ml-2 p-0">
                            <Link to={`/ListManagement`}>
                                <i className="fa fa-home"></i>
                                <span className="m-0 p-0">List Manager </span>
                            </Link>
                        </li>
                        {/* : '' : ''
                          } */}
                        {/* {
                            securityManagerSP ? securityManagerSP[0]?.DisplayOK ? */}
                        <li className="ml-2 p-0">
                            <Link to={`/security-manager`}>
                                <i className="fa fa-home"></i>
                                <span className="m-0 p-0">Security Manager </span>
                            </Link>
                        </li>
                        <li className="ml-2 p-0">
                            <Link to={`/Editable-Incident`}>
                                <i className="fa fa-home"></i>
                                <span className="m-0 p-0">Editable  Incident </span>
                            </Link>
                        </li>
                        {/* : '' : ''
                          } */}
                        {/* {
                            securityManagerSP ? securityManagerSP[0]?.DisplayOK ? */}
                        <li className="ml-2 p-0">
                            <Link to={`/ListPermission`}>
                                <i className="fa fa-home"></i>
                                <span className="m-0 p-0">List-Module Manager </span>
                            </Link>
                        </li>
                        <li className="ml-2 p-0">
                            <Link to={`/CounterTable`}>
                                <i className="fa fa-home"></i>
                                <span className="m-0 p-0">Counter Table</span>
                            </Link>
                        </li>
                        <li className="ml-2 p-0">
                            <Link to={`/PreviousYearCounter`}>
                                <i className="fa fa-home"></i>
                                <span className="m-0 p-0">Pervious Year Counter</span>
                            </Link>
                        </li>
                        {/* <li className="ml-3 p-0">
                            <Link to={`/Consolidation`}>
                                <i className="fa fa-home"></i>
                                <span className="m-0 p-0">Consolidation</span>
                            </Link>
                        </li>  */}
                        {/* : '' : ''
                          } */}
                    </>
                </ul>
            </li>
            {/* reports */}
            <li>
                <Link to="/Reports" class="has-arrow arrow-c" aria-expanded={plusMinus1} onClick={() => callUtilityModules('Table1', 'Master Table1')}>
                    <i className="fa fa-file" aria-hidden="true" style={{ fontSize: '13px' }}></i>
                    <span>Report</span>
                </Link>
                <ul aria-expanded={`${expandList === 'Master Table1' ? true : false}`} className={`${expandList === 'Master Table1' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-23px' }}>
                    <>
                        {/* <li className="ml-3 p-0">
                            <Link to={`/incident-reports`}>
                                <i className="fa fa-home"></i>
                                <span className="m-0 p-0">Incident</span>
                            </Link>
                        </li>
                        <li className="ml-3 p-0">
                            <Link to={``}>
                                <i className="fa fa-home"></i>
                                <span className="m-0 p-0">Offense</span>
                            </Link>
                        </li>
                        <li className="ml-3 p-0">
                            <Link to={`/name-history`}>
                                <i className="fa fa-home"></i>
                                <span className="m-0 p-0">Name</span>
                            </Link>
                        </li>
                        <li className="ml-3 p-0">
                            <Link to={`/property-reports`}>
                                <i className="fa fa-home"></i>
                                <span className="m-0 p-0">Property</span>
                            </Link>
                        </li>
                        <li className="ml-3 p-0">
                            <Link to={`/arrest-charge`}>
                                <i className="fa fa-home"></i>
                                <span className="m-0 p-0">Arrest</span>
                            </Link>
                        </li> */}
                    </>
                </ul>
            </li>
            {/* Applications */}
            <li>
                <Link to="#" class="has-arrow arrow-c" aria-expanded={plusMinus2} onClick={() => callUtilityModules('Table2', 'Master Table2')}>
                    <i className="fa fa-file" aria-hidden="true" style={{ fontSize: '13px' }}></i>
                    <span>Application</span>
                </Link>
                <ul aria-expanded={`${expandList === 'Master Table2' ? true : false}`} className={`${expandList === 'Master Table2' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-23px' }}>
                    <>
                        <li className="ml-2 p-0">
                            <Link to={`/PawnInformation`}>
                                <i className="fa fa-home"></i>
                                <span className="m-0 p-0">Pawn Information</span>
                            </Link>
                        </li>
                    </>
                </ul>
            </li>
            <li>
                {/* <Link to="#" class="has-arrow arrow-c">
                    <i className="fa fa-search"></i>
                    <span>Search</span>
                </Link> */}
                <Link to="/Search" class="has-arrow arrow-c" aria-expanded={plusMinus3} onClick={() => callUtilityModules('Table3', 'Master Table3')}>
                    <i className="fa fa-search" aria-hidden="true"></i>
                    <span>Search</span>
                </Link>
            </li>
            <div className="dropdown-divider"></div>
            <p>
                <Link to="#" ><i class="fa fa-chevron-right"></i><span className="ml-3">Recent</span></Link>
                <ul className="recent">
                    <>
                        {
                            incidentRecentData?.map((val) => (
                                <li>
                                    <Link style={{ display: 'flex', flexDirection: 'column' }} to={`#`} onClick={() => {
                                        // localStorage.setItem('IncidentId', CryptoJS.AES.encrypt(JSON.stringify('22-001031'), 'RForIncidentID').toString())
                                    }}>
                                        <span>Incident-{val.IncidentNumber}</span>
                                        {/* <span className="" style={{ fontSize: '11px', }}>Demo PVT LTD</span> */}
                                    </Link>
                                </li>
                            ))
                        }
                    </>
                </ul>
            </p>
        </>
    )
}

export default DashboardSidebar