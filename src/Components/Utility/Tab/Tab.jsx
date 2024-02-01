import React, { useState, useEffect } from 'react'
import { useContext } from 'react';
import { Link } from "react-router-dom";
import { AgencyContext } from '../../../Context/Agency/Index';
import { Decrypt_Id_Name } from '../../Common/Utility';

const Tab = () => {

    const { incidentStatus, setIncidentStatus, changesStatus, incidentCount, get_Incident_Count, localStoreArray, setLocalStoreArray, get_LocalStorage } = useContext(AgencyContext)
    // const [incidentStatus, setIncidentStatus] = useState();

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', IncidentStatus: '' }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray?.IncidentStatus) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setIncidentStatus(localStoreArray.IncidentStatus === true || localStoreArray.IncidentStatus === "True" ? true : false)
                // if (incidentCount.length === 0 && localStoreArray?.IncidentStatus) get_Incident_Count(localStoreArray.IncidentID)
            }
        }
    }, [localStoreArray])

    const [active] = useState(window.location.pathname);

    useEffect(() => {
        if (incidentCount.length === 0 && incidentStatus) { get_Incident_Count(parseInt(localStoreArray.IncidentID)) }
    }, [incidentStatus])

    return (
        <>
            <div className="col-12 inc__tabs" >
                <ul className="nav nav-tabs">
                    <li className="nav-item ">
                        <Link className={`nav-link  ${active === `/incidenttab` ? 'active' : ''}`} data-toggle="pill" to={`/incidenttab`}>Incident</Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link  ${active === `/offensetab` ? 'active' : ''}  ${incidentStatus ? '' : 'disabled'}`} to={changesStatus ? '#' : "/offensetab"} style={{ color: incidentCount[0]?.OffenseCount > 0 && 'blue' }}
                            data-toggle={changesStatus ? "modal" : "pill"} data-target={changesStatus ? "#SaveModal" : ''}
                        >Offense{`${incidentCount[0]?.OffenseCount > 0 ? '(' + incidentCount[0]?.OffenseCount + ')' : ''}`}</Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link  ${active === `/name` ? 'active' : ''} ${incidentStatus ? '' : 'disabled'} `} to={changesStatus ? '#' : "/name"}
                            data-toggle={changesStatus ? "modal" : "pill"} style={{ color: incidentCount[0]?.NameCount > 0 && 'blue' }} data-target={changesStatus ? "#SaveModal" : ''} tabindex="-1" aria-disabled="true">Name{`${incidentCount[0]?.NameCount > 0 ? '(' + incidentCount[0]?.NameCount + ')' : ''}`}</Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link  ${active === `/property` ? 'active' : ''} ${incidentStatus ? '' : 'disabled'}`} to={changesStatus ? '#' : "/property"}
                            data-toggle={changesStatus ? "modal" : "pill"} style={{ color: incidentCount[0]?.PropertyCount > 0 && 'blue' }} data-target={changesStatus ? "#SaveModal" : ''} tabindex="-1" aria-disabled="true">Property{`${incidentCount[0]?.PropertyCount > 0 ? '(' + incidentCount[0]?.PropertyCount + ')' : ''}`}</Link>
                    </li>

                    <li className="nav-item">
                        <Link className={`nav-link  ${active === `/vehicle` ? 'active' : ''} ${incidentStatus ? '' : 'disabled'}`} to={changesStatus ? '#' : "/vehicle"}
                            data-toggle={changesStatus ? "modal" : "pill"} style={{ color: incidentCount[0]?.VehicleCount > 0 && 'blue' }} data-target={changesStatus ? "#SaveModal" : ''} tabindex="-1" aria-disabled="true">Vehicle{`${incidentCount[0]?.VehicleCount > 0 ? '(' + incidentCount[0]?.VehicleCount + ')' : ''}`}</Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link  ${active === `/warrant` ? 'active' : ''} ${incidentStatus ? '' : 'disabled'}`} to={changesStatus ? '#' : "/warrant"}
                            data-toggle={changesStatus ? "modal" : "pill"} style={{ color: incidentCount[0]?.WarrantCount > 0 && 'blue' }} data-target={changesStatus ? "#SaveModal" : ''} tabindex="-1" aria-disabled="true">Warrant{`${incidentCount[0]?.WarrantCount > 0 ? '(' + incidentCount[0]?.WarrantCount + ')' : ''}`}</Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link  ${active === `/arrest` ? 'active' : ''} ${incidentStatus ? '' : 'disabled'}`} to={changesStatus ? '#' : "/arrest"}
                            data-toggle={changesStatus ? "modal" : "pill"} style={{ color: incidentCount[0]?.ArrestCount > 0 && 'blue' }} data-target={changesStatus ? "#SaveModal" : ''} tabindex="-1" aria-disabled="true">Arrest{`${incidentCount[0]?.ArrestCount > 0 ? '(' + incidentCount[0]?.ArrestCount + ')' : ''}`}</Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link  ${active === `/field-interview` ? 'active' : ''} ${incidentStatus ? '' : 'disabled'}`} to={changesStatus ? '#' : "/field-interview"}
                            data-toggle={changesStatus ? "modal" : "pill"} style={{ color: incidentCount[0]?.FieldCount > 0 && 'blue' }} data-target={changesStatus ? "#SaveModal" : ''} tabindex="-1" aria-disabled="true">Field Interview{`${incidentCount[0]?.FieldCount > 0 ? '(' + incidentCount[0]?.FieldCount + ')' : ''}`}</Link>
                    </li>
                 
                    <li className="nav-item">
                        <a className="nav-link disabled" data-toggle="pill" href="#" tabindex="-1" aria-disabled="true" >Log</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled" data-toggle="pill" href="#" tabindex="-1" aria-disabled="true">NIBRS</a>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Tab