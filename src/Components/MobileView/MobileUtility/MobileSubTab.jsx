import React from 'react'
import { useContext } from 'react'
import { AgencyContext } from '../../../Context/Agency/Index'
import { useLocation } from 'react-router-dom'

const MobileSubTab = ({ tabs, setShowPage, showPage, count, status, showVictim, showOffender, showRecovered, showJuvinile, showPoliceForce, showVehicleRecovered }) => {

    const { changesStatus, inActiveStatus } = useContext(AgencyContext)
    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    return (
        <>
            <ul class="nav nav-tabs">
                {
                    tabs?.map((tabs, key) => {
                        if (!showVictim && !showVictim && !showRecovered && !showJuvinile && !showPoliceForce && !showVehicleRecovered) {
                            if (tabs.tab !== 'Victim' && tabs.tab !== 'Offender' && tabs.tab !== 'Recovered Property' && tabs.tab !== 'Juvenile' && tabs.tab !== 'Police Force' && tabs.tab !== 'Vehicle Recovered') {
                                return (
                                    <li key={key} className='nav-item'>
                                        <a className={`nav-link ${showPage === tabs.path ? 'active' : ''} ${!status || inActiveStatus ? '' : ''}`} data-toggle={changesStatus ? "modal" : "pill"} data-target={changesStatus ? "#SaveModal" : ''} aria-current="page" onClick={() => {
                                            if (!changesStatus) setShowPage(tabs.path)
                                        }
                                        }
                                            href={tabs.path}>
                                            {tabs.tab}
                                            {
                                                status && !inActiveStatus ?
                                                    <span>
                                                        {tabs.count === "GroupCount" ? count.GroupCount : tabs.count === "UnitCount" ? count.UnitCount : tabs.count === "PersonnelCount" ? count.PersonnelCount : tabs.count === "DivisionCount" ? count.DivisionCount : tabs.count === "LoginCount" ? count.LoginCount : tabs.count === "ShiftCount" ? count.ShiftCount : tabs.count === "RankCount" ? count.RankCount : tabs.count === "EmergencyContact" ? count?.EmergencyCount : tabs.count === "AgencyCount" ? count?.AgencyContactCount : ""}
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
                                        <a className={`nav-link ${showPage === tabs.path ? 'active' : ''} ${!status || inActiveStatus ? 'disabled' : ''}`} data-toggle={changesStatus ? "modal" : "pill"} data-target={changesStatus ? "#SaveModal" : ''} aria-current="page" onClick={() => {
                                            if (!changesStatus) setShowPage(tabs.path)
                                        }
                                        }
                                            href={tabs.path}>
                                            {tabs.tab}
                                            {
                                                status && !inActiveStatus ?
                                                    <span>
                                                        {tabs.count === "GroupCount" ? count.GroupCount : tabs.count === "UnitCount" ? count.UnitCount : tabs.count === "PersonnelCount" ? count.PersonnelCount : tabs.count === "DivisionCount" ? count.DivisionCount : tabs.count === "LoginCount" ? count.LoginCount : tabs.count === "ShiftCount" ? count.ShiftCount : tabs.count === "RankCount" ? count.RankCount : tabs.count === "EmergencyContact" ? count?.EmergencyCount : tabs.count === "AgencyCount" ? count?.AgencyContactCount : ""}
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
                                        <a className={`nav-link ${showPage === tabs.path ? 'active' : ''} ${!status || inActiveStatus ? 'disabled' : ''}`} data-toggle={changesStatus ? "modal" : "pill"} data-target={changesStatus ? "#SaveModal" : ''} aria-current="page" onClick={() => {
                                            if (!changesStatus) setShowPage(tabs.path)
                                        }
                                        }
                                            href={tabs.path}>
                                            {tabs.tab}
                                            {
                                                status && !inActiveStatus ?
                                                    <span>
                                                        {tabs.count === "GroupCount" ? count.GroupCount : tabs.count === "UnitCount" ? count.UnitCount : tabs.count === "PersonnelCount" ? count.PersonnelCount : tabs.count === "DivisionCount" ? count.DivisionCount : tabs.count === "LoginCount" ? count.LoginCount : tabs.count === "ShiftCount" ? count.ShiftCount : tabs.count === "RankCount" ? count.RankCount : tabs.count === "EmergencyContact" ? count?.EmergencyCount : tabs.count === "AgencyCount" ? count?.AgencyContactCount : ""}
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
                                    <a className={`nav-link ${showPage === tabs.path ? 'active' : ''} ${!status || inActiveStatus ? 'disabled' : ''}`} data-toggle={changesStatus ? "modal" : "pill"} data-target={changesStatus ? "#SaveModal" : ''} aria-current="page" onClick={() => {
                                        if (!changesStatus) setShowPage(tabs.path)
                                    }
                                    }
                                        href={tabs.path}>
                                        {tabs.tab}
                                        {
                                            status && !inActiveStatus ?
                                                <span>
                                                    {tabs.count === "GroupCount" ? count.GroupCount : tabs.count === "UnitCount" ? count.UnitCount : tabs.count === "PersonnelCount" ? count.PersonnelCount : tabs.count === "DivisionCount" ? count.DivisionCount : tabs.count === "LoginCount" ? count.LoginCount : tabs.count === "ShiftCount" ? count.ShiftCount : tabs.count === "RankCount" ? count.RankCount : tabs.count === "EmergencyContact" ? count?.EmergencyCount : tabs.count === "AgencyCount" ? count?.AgencyContactCount : ""}
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
                                        <a className={`nav-link ${showPage === tabs.path ? 'active' : ''} ${!status || inActiveStatus ? 'disabled' : ''}`} data-toggle={changesStatus ? "modal" : "pill"} data-target={changesStatus ? "#SaveModal" : ''} aria-current="page" onClick={() => {
                                            if (!changesStatus) setShowPage(tabs.path)
                                        }
                                        }
                                            href={tabs.path}>
                                            {tabs.tab}
                                            {
                                                status && !inActiveStatus ?
                                                    <span>
                                                        {tabs.count === "GroupCount" ? count.GroupCount : tabs.count === "UnitCount" ? count.UnitCount : tabs.count === "PersonnelCount" ? count.PersonnelCount : tabs.count === "DivisionCount" ? count.DivisionCount : tabs.count === "LoginCount" ? count.LoginCount : tabs.count === "ShiftCount" ? count.ShiftCount : tabs.count === "RankCount" ? count.RankCount : tabs.count === "EmergencyContact" ? count?.EmergencyCount : tabs.count === "AgencyCount" ? count?.AgencyContactCount : ""}
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
                                        <a className={`nav-link ${showPage === tabs.path ? 'active' : ''} ${!status || inActiveStatus ? 'disabled' : ''}`} data-toggle={changesStatus ? "modal" : "pill"} data-target={changesStatus ? "#SaveModal" : ''} aria-current="page" onClick={() => {
                                            if (!changesStatus) setShowPage(tabs.path)
                                        }
                                        }
                                            href={tabs.path}>
                                            {tabs.tab}
                                            {
                                                status && !inActiveStatus ?
                                                    <span>
                                                        {tabs.count === "GroupCount" ? count.GroupCount : tabs.count === "UnitCount" ? count.UnitCount : tabs.count === "PersonnelCount" ? count.PersonnelCount : tabs.count === "DivisionCount" ? count.DivisionCount : tabs.count === "LoginCount" ? count.LoginCount : tabs.count === "ShiftCount" ? count.ShiftCount : tabs.count === "RankCount" ? count.RankCount : tabs.count === "EmergencyContact" ? count?.EmergencyCount : tabs.count === "AgencyCount" ? count?.AgencyContactCount : ""}
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
                                    <a className={`nav-link ${showPage === tabs.path ? 'active' : ''} ${!status || inActiveStatus ? 'disabled' : ''}`} data-toggle={changesStatus ? "modal" : "pill"} data-target={changesStatus ? "#SaveModal" : ''} aria-current="page" onClick={() => {
                                        if (!changesStatus) setShowPage(tabs.path)
                                    }
                                    }
                                        href={tabs.path}>
                                        {tabs.tab}
                                        {
                                            status && !inActiveStatus ?
                                                <span>
                                                    {tabs.count === "GroupCount" ? count.GroupCount : tabs.count === "UnitCount" ? count.UnitCount : tabs.count === "PersonnelCount" ? count.PersonnelCount : tabs.count === "DivisionCount" ? count.DivisionCount : tabs.count === "LoginCount" ? count.LoginCount : tabs.count === "ShiftCount" ? count.ShiftCount : tabs.count === "RankCount" ? count.RankCount : tabs.count === "EmergencyContact" ? count?.EmergencyCount : tabs.count === "AgencyCount" ? count?.AgencyContactCount : ""}
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

export default MobileSubTab