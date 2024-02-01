import React, { useContext } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AgencyContext } from '../../../Context/Agency/Index'

const MobileTab = () => {

    const [active] = useState(window.location.pathname)
    const {  changesStatus } = useContext(AgencyContext)

    return (
        <>
            <div className="col-12 mobile__tabs" >
                <ul className="nav nav-tabs">
                    <li className="nav-item ">
                        <Link className={`nav-link    ${active === `/mobile-incident` ? 'active' : ''}`} data-toggle="pill" to={`/mobile-incident`}>Incident</Link>
                    </li>
                    {/* <li className="nav-item ">
                        <Link className={`nav-link  ${sessionStorage.getItem('IncidentId') ? '' : 'disabled'}`} data-toggle="pill" to={`/offense-main`}>Offense</Link>
                    </li> */}
                    <li className="nav-item ">
                        <Link className={`nav-link  ${('IncidentId') ? '' : 'disabled'}   ${active === `/offense-main` ? 'active' : '' || active === `/mobile-offense`? 'active' : ''}`} data-toggle="pill" to={`/offense-main`}>Offense</Link>
                    </li>
                    <li className="nav-item  ">
                        <Link className={`nav-link  ${('IncidentId') ? '' : 'disabled'}  ${active === `/name-main` ? 'active' : ''|| active === `/mobile-name`?   'active' : ''}`} data-toggle="pill" to={`/name-main`} >Name</Link>
                    </li>
                    <li className="nav-item ">
                        <Link className={`nav-link  ${('IncidentId') ? '' : 'disabled'}  ${active === `/property-main` ? 'active' : ''|| active === `/mobile-property`?   'active' : ''}`} data-toggle="pill" to={`/property-main`} >Property</Link>
                    </li>
                    <li className="nav-item ">
                        <Link className={`nav-link  ${('IncidentId') ? '' : 'disabled'} ${active === '/vehicle-main' ? 'active' :'' || active === '/mobile-vehicle'? 'active': ''} `} data-toggle="pill" to={`/vehicle-main`} >Vehicle</Link>
                    </li>

                    {/* <li className="nav-item">
                        <Link className={`nav-link  ${active === `/offensetab` ? 'active' : ''}  ${('incidentStatus') === 'true' ? '' : 'disabled'}`}  to={changesStatus ? '#' : "/offensetab"}
                        data-toggle={changesStatus ? "modal" : "pill"} data-target={changesStatus ? "#SaveModal" : ''}
                        
                        >Offense</Link>
                    </li> */}
                    {/* <li className="nav-item ">
                        <Link className={`nav-link `} data-toggle="pill" to={`#`}>Narrative</Link>
                    </li> */}
                    {/* <li className="nav-item ">
                        <Link className={`nav-link `} data-toggle="pill" to={`#`}>Forms</Link>
                    </li>
                    <li className="nav-item ">
                        <Link className={`nav-link `} data-toggle="pill" to={`#`}>Case Solvability</Link>
                    </li> */}
                </ul>
            </div>
        </>
    )
}

export default MobileTab