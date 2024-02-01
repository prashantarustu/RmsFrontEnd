import React from 'react'
import { useContext } from 'react'
import { AgencyContext } from '../../../Context/Agency/Index'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const SubTab = ({ tabs, setShowPage, showPage, count, status, showVictim, showOffender, showRecovered, showJuvinile, showPoliceForce, showVehicleRecovered }) => {

    const { changesStatus, inActiveStatus, tabCount, get_Offence_Count, get_Name_Count, get_IncidentTab_Count, get_Property_Count, get_vehicle_Count, get_Arrest_Count, get_Warrent_Count, get_Incident_Count, get_ArrestCharge_Count } = useContext(AgencyContext)

    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    // useEffect(() => {
    //     if (tabCount.length === 0 && window.location.pathname === '/incidenttab') { get_IncidentTab_Count(0); }
    //     if (tabCount.length === 0 && window.location.pathname === '/OffenseHome') { get_Offence_Count(0); }
    //     if (tabCount.length === 0 && window.location.pathname === '/nametab') { get_Name_Count(0); }
    //     if (tabCount.length === 0 && window.location.pathname === '/propertytab') { get_Property_Count(0); }
    //     if (tabCount.length === 0 && window.location.pathname === '/vehicletab') { get_vehicle_Count(0); }
    //     if (tabCount.length === 0 && window.location.pathname === '/arresttab') { get_Arrest_Count(0); }
    //     if (tabCount.length === 0 && window.location.pathname === '/chargetab') { get_ArrestCharge_Count(0); }
    //     if (tabCount.length === 0 && window.location.pathname === '/warrant-tab') { get_Warrent_Count(0); }
    //     // if (tabCount.length === 0 && window.location.pathname === '/incidenttab'){ get_Incident_Count(0);}
    // }, [])

    return (
        <>
            <ul class="nav nav-tabs">
                {
                    tabs?.map((tabs, key) => {
                        // console.log(tabCount);
                        // console.log(tabs)
                        // console.log(tabCount[tabs])
                        if (!showVictim && !showVictim && !showRecovered && !showJuvinile && !showPoliceForce && !showVehicleRecovered) {
                            if (tabs.tab !== 'Victim' && tabs.tab !== 'Offender' && tabs.tab !== 'Recovered Property' && tabs.tab !== 'Juvenile' && tabs.tab !== 'Police Force' && tabs.tab !== 'Vehicle Recovered') {
                                return (
                                    <li key={key} className='nav-item'>
                                        <a className={`nav-link ${showPage === tabs.path ? 'active' : ''} ${!status || inActiveStatus ? '' : ''}`}
                                            data-toggle={changesStatus ? "modal" : "pill"} data-target={changesStatus ? "#SaveModal" : ''} style={{ color: tabCount[tabs?.count] > 0 && 'blue' }} aria-current="page" onClick={() => {
                                                if (!changesStatus) setShowPage(tabs.path)
                                            }
                                            }
                                            href={tabs.path}>
                                            {tabs.tab}{`${tabCount[tabs?.count] > 0 ? '(' + tabCount[tabs?.count] + ')' : ''}`}
                                            {
                                                status && !inActiveStatus ?
                                                    <span>
                                                        {tabs?.count === "GroupCount" ? count?.GroupCount : tabs?.count === "UnitCount" ? count?.UnitCount : tabs.count === "PersonnelCount" ? count?.PersonnelCount : tabs.count === "DivisionCount" ? count?.DivisionCount : tabs.count === "LoginCount" ? count?.LoginCount : tabs.count === "ShiftCount" ? count?.ShiftCount : tabs.count === "RankCount" ? count?.RankCount : tabs.count === "EmergencyContact" ? count?.EmergencyCount : tabs.count === "AgencyCount" ? count?.AgencyContactCount : ""}
                                                    </span>
                                                    : ''
                                            }
                                        </a>
                                    </li>
                                )
                            }
                        }
                        if (showOffender && openPage !== 'mastername') {
                            if (tabs.tab !== 'Victim') {
                                return (
                                    <li key={key} className='nav-item'>
                                        <a className={`nav-link ${showPage === tabs.path ? 'active' : ''} ${!status || inActiveStatus ? 'disabled' : ''}`} data-toggle={changesStatus ? "modal" : "pill"} data-target={changesStatus ? "#SaveModal" : ''} style={{ color: tabCount[tabs?.count] > 0 && 'blue' }} aria-current="page" onClick={() => {
                                            if (!changesStatus) setShowPage(tabs.path)
                                        }
                                        }
                                            href={tabs.path}>
                                            {tabs.tab}{`${tabCount[tabs?.count] > 0 ? '(' + tabCount[tabs?.count] + ')' : ''}`}
                                            {
                                                status && !inActiveStatus ?
                                                    <span>
                                                        {tabs.count === "GroupCount" ? count?.GroupCount : tabs.count === "UnitCount" ? count?.UnitCount : tabs.count === "PersonnelCount" ? count?.PersonnelCount : tabs.count === "DivisionCount" ? count?.DivisionCount : tabs.count === "LoginCount" ? count?.LoginCount : tabs.count === "ShiftCount" ? count?.ShiftCount : tabs.count === "RankCount" ? count?.RankCount : tabs.count === "EmergencyContact" ? count?.EmergencyCount : tabs.count === "AgencyCount" ? count?.AgencyContactCount : ""}
                                                    </span>
                                                    : ''
                                            }
                                        </a>
                                    </li>
                                )
                            }
                        }
                        if (showVictim && openPage !== 'mastername') {
                            if (tabs.tab !== 'Offender') {
                                return (
                                    <li key={key} className='nav-item'>
                                        <a className={`nav-link ${showPage === tabs.path ? 'active' : ''} ${!status || inActiveStatus ? 'disabled' : ''}`} data-toggle={changesStatus ? "modal" : "pill"} data-target={changesStatus ? "#SaveModal" : ''} style={{ color: tabCount[tabs?.count] > 0 && 'blue' }} aria-current="page" onClick={() => {
                                            if (!changesStatus) setShowPage(tabs.path)
                                        }
                                        }
                                            href={tabs.path}>
                                            {tabs.tab}{`${tabCount[tabs?.count] > 0 ? '(' + tabCount[tabs?.count] + ')' : ''}`}
                                            {
                                                status && !inActiveStatus ?
                                                    <span>
                                                        {tabs.count === "GroupCount" ? count?.GroupCount : tabs.count === "UnitCount" ? count?.UnitCount : tabs.count === "PersonnelCount" ? count?.PersonnelCount : tabs.count === "DivisionCount" ? count?.DivisionCount : tabs.count === "LoginCount" ? count?.LoginCount : tabs.count === "ShiftCount" ? count?.ShiftCount : tabs.count === "RankCount" ? count?.RankCount : tabs.count === "EmergencyContact" ? count?.EmergencyCount : tabs.count === "AgencyCount" ? count?.AgencyContactCount : ""}
                                                    </span>
                                                    : ''
                                            }
                                        </a>
                                    </li>
                                )
                            }
                        }
                        if (showRecovered) {
                            return (
                                <li key={key} className='nav-item'>
                                    <a className={`nav-link ${showPage === tabs.path ? 'active' : ''} ${!status || inActiveStatus ? 'disabled' : ''}`} data-toggle={changesStatus ? "modal" : "pill"} data-target={changesStatus ? "#SaveModal" : ''} style={{ color: tabCount[tabs?.count] > 0 && 'blue' }} aria-current="page" onClick={() => {
                                        if (!changesStatus) setShowPage(tabs.path)
                                    }
                                    }
                                        href={tabs.path}>
                                        {tabs.tab} {`${tabCount[tabs?.count] > 0 ? '(' + tabCount[tabs?.count] + ')' : ''}`}
                                        {
                                            status && !inActiveStatus ?
                                                <span>
                                                    {tabs.count === "GroupCount" ? count?.GroupCount : tabs.count === "UnitCount" ? count?.UnitCount : tabs.count === "PersonnelCount" ? count?.PersonnelCount : tabs.count === "DivisionCount" ? count?.DivisionCount : tabs.count === "LoginCount" ? count?.LoginCount : tabs.count === "ShiftCount" ? count?.ShiftCount : tabs.count === "RankCount" ? count?.RankCount : tabs.count === "EmergencyContact" ? count?.EmergencyCount : tabs.count === "AgencyCount" ? count?.AgencyContactCount : ""}
                                                </span>
                                                : ''
                                        }
                                    </a>
                                </li>
                            )
                        }
                        if (showJuvinile) {
                            if (tabs.tab !== 'Police Force') {
                                return (
                                    <li key={key} className='nav-item'>
                                        <a className={`nav-link ${showPage === tabs.path ? 'active' : ''} ${!status || inActiveStatus ? 'disabled' : ''}`} data-toggle={changesStatus ? "modal" : "pill"} data-target={changesStatus ? "#SaveModal" : ''} style={{ color: tabCount[tabs?.count] > 0 && 'blue' }} aria-current="page" onClick={() => {
                                            if (!changesStatus) setShowPage(tabs.path)
                                        }
                                        }
                                            href={tabs.path}>
                                            {tabs.tab}{`${tabCount[tabs?.count] > 0 ? '(' + tabCount[tabs?.count] + ')' : ''}`}
                                            {
                                                status && !inActiveStatus ?
                                                    <span>
                                                        {tabs.count === "GroupCount" ? count?.GroupCount : tabs.count === "UnitCount" ? count?.UnitCount : tabs.count === "PersonnelCount" ? count?.PersonnelCount : tabs.count === "DivisionCount" ? count?.DivisionCount : tabs.count === "LoginCount" ? count?.LoginCount : tabs.count === "ShiftCount" ? count?.ShiftCount : tabs.count === "RankCount" ? count?.RankCount : tabs.count === "EmergencyContact" ? count?.EmergencyCount : tabs.count === "AgencyCount" ? count?.AgencyContactCount : ""}
                                                    </span>
                                                    : ''
                                            }
                                        </a>
                                    </li>
                                )
                            }
                        }
                        if (showPoliceForce) {
                            if (tabs.tab !== 'Juvenile') {
                                return (
                                    <li key={key} className='nav-item'>
                                        <a className={`nav-link ${showPage === tabs.path ? 'active' : ''} ${!status || inActiveStatus ? 'disabled' : ''}`} data-toggle={changesStatus ? "modal" : "pill"} data-target={changesStatus ? "#SaveModal" : ''} style={{ color: tabCount[tabs?.count] > 0 && 'blue' }} aria-current="page" onClick={() => {
                                            if (!changesStatus) setShowPage(tabs.path)
                                        }
                                        }
                                            href={tabs.path}>
                                            {tabs.tab}{`${tabCount[tabs?.count] > 0 ? '(' + tabCount[tabs?.count] + ')' : ''}`}
                                            {
                                                status && !inActiveStatus ?
                                                    <span>
                                                        {tabs.count === "GroupCount" ? count?.GroupCount : tabs.count === "UnitCount" ? count?.UnitCount : tabs.count === "PersonnelCount" ? count?.PersonnelCount : tabs.count === "DivisionCount" ? count?.DivisionCount : tabs.count === "LoginCount" ? count?.LoginCount : tabs.count === "ShiftCount" ? count?.ShiftCount : tabs.count === "RankCount" ? count?.RankCount : tabs.count === "EmergencyContact" ? count?.EmergencyCount : tabs.count === "AgencyCount" ? count?.AgencyContactCount : ""}
                                                    </span>
                                                    : ''
                                            }
                                        </a>
                                    </li>
                                )
                            }
                        }
                        if (showVehicleRecovered) {
                            return (
                                <li key={key} className='nav-item'>
                                    <a className={`nav-link ${showPage === tabs.path ? 'active' : ''} ${!status || inActiveStatus ? 'disabled' : ''}`} data-toggle={changesStatus ? "modal" : "pill"} data-target={changesStatus ? "#SaveModal" : ''} style={{ color: tabCount[tabs?.count] > 0 && 'blue' }} aria-current="page" onClick={() => {
                                        if (!changesStatus) setShowPage(tabs.path)
                                    }
                                    }
                                        href={tabs.path}>
                                        {tabs.tab}{`${tabCount[tabs?.count] > 0 ? '(' + tabCount[tabs?.count] + ')' : ''}`}
                                        {
                                            status && !inActiveStatus ?
                                                <span>
                                                    {tabs?.count === "GroupCount" ? count?.GroupCount : tabs?.count === "UnitCount" ? count?.UnitCount : tabs?.count === "PersonnelCount" ? count?.PersonnelCount : tabs?.count === "DivisionCount" ? count?.DivisionCount : tabs?.count === "LoginCount" ? count?.LoginCount : tabs?.count === "ShiftCount" ? count?.ShiftCount : tabs?.count === "RankCount" ? count?.RankCount : tabs?.count === "EmergencyContact" ? count?.EmergencyCount : tabs?.count === "AgencyCount" ? count?.AgencyContactCount : ""}
                                                </span>
                                                : ''
                                        }
                                    </a>
                                </li>
                            )
                        }
                    }
                    )}
            </ul>
        </>
    )
}

export default SubTab