import React, { useContext, useState } from 'react'
import { AgencyContext } from '../../../Context/Agency/Index'
import { Link, useLocation } from "react-router-dom";
import { Decrypt_Id_Name, Encrypted_Id_Name } from '../../Common/Utility';

const ReportSidebar = () => {

    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');
    // console.log(openPage);

    const page = new URLSearchParams(window.location.search).get("page")

    const [expand, setExpand] = useState()
    const [expandList, setExpandList] = useState()
    const [plusMinus, setPlusMinus] = useState(false)
    const [plusMinus1, setPlusMinus1] = useState(false)
    const [plusMinus2, setPlusMinus2] = useState(false)
    const [plusMinus3, setPlusMinus3] = useState(false)
    const [plusMinus4, setPlusMinus4] = useState(false)

    const callReportModules = (type, val) => {
        if (type === 'List') {
            setPlusMinus1(!plusMinus1)
            setPlusMinus2(!plusMinus2)
            setPlusMinus3(!plusMinus2)
            setPlusMinus4(!plusMinus2)
            setExpand(expand ?
                expand[0].id === val ? { id: val } : '' : { id: val })
        }
        else {
            setExpandList(expandList === val ? '' : val)
        }
    }

    return (
        <>
            <div className="row px-1">
                <div className="col-12 mt-4">
                    <input type="text" className='form-control input-fixed mt-1'
                        placeholder='Search By List ...' />
                </div>
            </div>
            {/* incident */}
            <li className='mt-2 pt-1'>
                <Link to="#" class="has-arrow arrow-c" aria-expanded={plusMinus} onClick={() => callReportModules('Table', 'Master Table')}><i class="fa fa-lock"></i><span>Incident</span></Link>
                <ul aria-expanded={`${expandList === 'Master Table' ? true : false}`} className={`${expandList === 'Master Table' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-22px' }}>
                    <>
                        <li className="ml-2 p-0">
                            <Link to={`/incident-Master?page=incidentReport`} style={{ cursor: 'pointer', background: openPage === 'incidentReport' ? '#EEE' : '' }} >
                                <span >Incident Master Report</span>
                            </Link>

                        </li>
                        <li className="ml-2 p-0">
                            <Link to={`/incident-Monthly?page=incidentMonthlyReport`} style={{ cursor: 'pointer', background: openPage === 'incidentMonthlyReport' ? '#EEE' : '' }} >
                                <span >Incidents Monthly</span>
                            </Link>
                        </li>
                        <li className="ml-2 p-0" >
                            <Link to={`/incident-DailyEvent?page=incidentDailyEventReport`} style={{ cursor: 'pointer', background: openPage === 'incidentDailyEventReport' ? '#EEE' : '' }}>
                                <span className="">Daily Event Log</span>
                            </Link>
                        </li>
                        <li className="ml-2 p-0">
                            <Link to={`/incident-Officer?page=incidentOfficerReport`} style={{ cursor: 'pointer', background: openPage === 'incidentOfficerReport' ? '#EEE' : '' }}>
                                <span >Incident By Officer</span>
                            </Link>
                        </li>
                        <li className="ml-2 p-0">
                            <Link to={`/incident-media?page=incidentMediaReport`} style={{ cursor: 'pointer', background: openPage === 'incidentMediaReport' ? '#EEE' : '' }}>
                                <span >Media Report</span>
                            </Link>
                        </li>
                        <li className="ml-2 p-0">
                            <Link to={`/incident-public?page=incidentPublicReport`} style={{
                                cursor: 'pointer',
                                background: openPage === 'incidentPublicReport' ? '#EEE' : ''
                            }}>
                                <span >Public Report</span>
                            </Link>
                        </li>
                    </>
                </ul>
            </li>

            <li>
                <Link to="#" class="has-arrow arrow-c" aria-expanded={plusMinus2} onClick={() => callReportModules('Table2', 'Master Table2')}><i class="fa fa-lock"></i><span>Name</span></Link>
                <ul aria-expanded={`${expandList === 'Master Table2' ? true : false}`} className={`${expandList === 'Master Table2' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-22px' }}>
                    <>
                        {/* <li className="ml-2 p-0" >
                            <Link to={`/name-history`}>
                                <span className="">Address History</span>
                            </Link>
                        </li> */}
                        <li className="ml-2 p-0" >
                            <Link to={`/name-information?page=nameMasterReport `} style={{ cursor: 'pointer', background: openPage === 'nameMasterReport' ? '#EEE' : '' }}>
                                <span className="">Name Master Report</span>
                            </Link>
                        </li>
                    </>
                </ul>
            </li>
            {/* property */}
            <li>
                <Link to="#" class="has-arrow arrow-c" aria-expanded={plusMinus3} onClick={() => callReportModules('Table3', 'Master Table3')}><i class="fa fa-lock"></i><span>Property</span></Link>
                <ul aria-expanded={`${expandList === 'Master Table3' ? true : false}`} className={`${expandList === 'Master Table3' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-22px' }}>
                    <>
                        {/* <li className="ml-2 p-0 " >
                            <Link to={``}>
                                <span className="">Pawn Report</span>
                            </Link>
                        </li> */}
                        <li className="ml-2 p-0">
                            <Link to={`/property-vehicle?page=propertyMasterReport`} style={{ cursor: 'pointer', background: openPage === 'propertyMasterReport' ? '#EEE' : '' }}>
                                <span >Property Master Reoprt</span>
                            </Link>
                        </li>
                        {/* <li className="ml-2 p-0">
                            <Link to={``}>
                                <span >Vehicle Towing Report</span>
                            </Link>
                        </li>
                        <li className="ml-2 p-0">
                            <Link to={``}>
                                <span >Gun Registration List</span>
                            </Link>
                        </li>
                        <li className="ml-2 p-0">
                            <Link to={``}>
                                <span >Property Inventory Report</span>
                            </Link>
                        </li> */}
                    </>
                </ul>
            </li>
            {/* arrest */}
            <li>
                <Link to="#" class="has-arrow arrow-c" aria-expanded={plusMinus4} onClick={() => callReportModules('Table5', 'Master Table5')}><i class="fa fa-lock"></i><span>Arrest</span></Link>
                <ul aria-expanded={`${expandList === 'Master Table5' ? true : false}`} className={`${expandList === 'Master Table5' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-22px' }}>
                    <>
                        <li className="ml-2 p-0" >
                            <Link to={`/arrest-charge?page=arrestChargeReport`} style={{ cursor: 'pointer', background: openPage === 'arrestChargeReport' ? '#EEE' : '' }}>
                                <span className="">Arrest By Charge</span>
                            </Link>
                        </li>
                        <li className="ml-2 p-0">
                            <Link to={`/arrest-incident?page=arrestIncidentReport`} style={{ cursor: 'pointer', background: openPage === 'arrestIncidentReport' ? '#EEE' : '' }}>
                                <span >Arrest By Incident</span>
                            </Link>
                        </li>
                        <li className="ml-2 p-0" >
                            <Link to={`/arrest-master?page=arrestMasterReport`} style={{ cursor: 'pointer', background: openPage === 'arrestMasterReport' ? '#EEE' : '' }}>
                                <span className="">Arrest Master Report</span>
                            </Link>
                        </li>
                        <li className="ml-2 p-0">
                            <Link to={`/arrest-monthly?page=arrestMonthlyReport`} style={{ cursor: 'pointer', background: openPage === 'arrestMonthlyReport' ? '#EEE' : '' }}>
                                <span >Arrest Monthly</span>
                            </Link>
                        </li>
                        <li className="ml-2 p-0">
                            <Link to={`/arrest-monthlyCharge?page=arrestMonthlyChargeReport`} style={{ cursor: 'pointer', background: openPage === 'arrestMonthlyChargeReport' ? '#EEE' : '' }}>
                                <span > Arrest Monthly By Charge</span>
                            </Link>
                        </li>

                    </>
                </ul>
            </li>

            {/* Vehicle */}
            <li>
                <Link to="#" class="has-arrow arrow-c" aria-expanded={plusMinus4} onClick={() => callReportModules('Table7', 'Master Table7')}><i class="fa fa-lock"></i><span>Vehicle</span></Link>
                <ul aria-expanded={`${expandList === 'Master Table7' ? true : false}`} className={`${expandList === 'Master Table7' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-22px' }}>
                    <>

                        <li className="ml-2 p-0" >
                            <Link to={`/vehicle-master?page=vehicleMasterReport`} style={{ cursor: 'pointer', background: openPage === 'vehicleMasterReport' ? '#EEE' : '' }}>
                                <span className="">Vehicle Master Report</span>
                            </Link>
                        </li>
                    </>
                </ul>
            </li>
            {/* warrant */}
            <li>
                <Link to="#" class="has-arrow arrow-c" aria-expanded={plusMinus4} onClick={() => callReportModules('Table6', 'Master Table6')}><i class="fa fa-lock"></i><span>Warrant</span></Link>
                <ul aria-expanded={`${expandList === 'Master Table6' ? true : false}`} className={`${expandList === 'Master Table6' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-22px' }}>
                    <>
                        <li className="ml-2 p-0" >
                            <Link to={`/warrant-expired?page=warrantExpiredReport`} style={{ cursor: 'pointer', background: openPage === 'warrantExpiredReport' ? '#EEE' : '' }}>
                                <span className="">Warrant Expired</span>
                            </Link>
                        </li>
                        {/* <li className="ml-2 p-0">
                            <Link to={'#'}>
                                <span >Warrant By Charge</span>
                            </Link>
                        </li>
                        <li className="ml-2 p-0" >
                            <Link to={'#'}>
                                <span className="">Warrant Master Report</span>
                            </Link>
                        </li> */}
                        <li className="ml-2 p-0">
                            <Link to={`/warrant-monthly?page=warrantMonthlyReport`} style={{ cursor: 'pointer', background: openPage === 'warrantMonthlyReport' ? '#EEE' : '' }}>
                                <span >Warrant Monthly </span>
                            </Link>
                        </li>


                    </>
                </ul>
            </li>
        </>
    )
}

export default ReportSidebar