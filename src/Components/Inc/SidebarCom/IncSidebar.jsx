import React, { useContext, useState, useEffect } from 'react'
import { AgencyContext } from '../../../Context/Agency/Index'
import { Link } from "react-router-dom";
import { Decrypt_Id_Name, Encrypted_Id_Name } from '../../Common/Utility';
import { AddDeleteUpadate } from '../../hooks/Api';

const IncSidebar = () => {

    const { changesStatus, get_Incident_Count, get_Data_Name, incidentCount, get_Offence_Data, offenceData, arrestData, warentData, updateCount, setUpdateCount, nameData, setIncStatus, VehicleData, propertyData, setNameStatus, localStoreArray, setLocalStoreArray, get_LocalStorage, incidentNumber, setIncidentNumber, deleteStoreData, storeData } = useContext(AgencyContext);

    const [plusMinus, setPlusMinus] = useState(false)
    const [expandList, setExpandList] = useState()
    const [plusMinus1, setPlusMinus1] = useState(false)
    const [plusMinus2, setPlusMinus2] = useState(false)
    const [plusMinus3, setPlusMinus3] = useState(false)
    const [plusMinus4, setPlusMinus4] = useState(false)
    const [plusMinus5, setPlusMinus5] = useState(false)

    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const [incidentID, setIncidentID] = useState('');
    const [MasterNameID, setMasterNameID,] = useState('');
    const [nameID, setNameID] = useState();
    // const [IncidentNumber, setIncidentNumber] = useState('')

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', IncidentNumber: '', MasterNameID: '', NameID: '', Agency_Name: "", }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray.IncidentNumber) {
            get_LocalStorage();
        }
    }, []);

    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray.AgencyID && localStoreArray.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                setIncidentNumber(localStoreArray?.IncidentNumber);
            }
            if (localStoreArray?.IncidentID) {
                setIncidentID(localStoreArray?.IncidentID);
                //----ds----
                get_Data_Name(localStoreArray?.IncidentID);
                get_Offence_Data(localStoreArray.IncidentID);
                get_Incident_Count(localStoreArray?.IncidentID)
            }
        }
    }, [localStoreArray])

    const callUtilityModules = (type, val) => {
        if (type === 'List') {
            setPlusMinus1(!plusMinus1)
            //   setPlusMinus(!plusMinus)
            setExpandList(expandList === val ? '' : val)
        }
        if (type === 'Arrest') {
            setPlusMinus2(!plusMinus2)
            //   setPlusMinus(!plusMinus)
            setExpandList(expandList === val ? '' : val)
        }
        if (type === 'Warrant') {
            setPlusMinus5(!plusMinus5)
            //   setPlusMinus(!plusMinus)
            setExpandList(expandList === val ? '' : val)
        }
        if (type === 'Vehicle') {
            setPlusMinus3(!plusMinus3)
            //   setPlusMinus(!plusMinus)
            setExpandList(expandList === val ? '' : val)
        }
        if (type === 'Property') {
            setPlusMinus4(!plusMinus4)
            //   setPlusMinus(!plusMinus)
            setExpandList(expandList === val ? '' : val)
        }
        if (type === 'Table') {
            setPlusMinus(!plusMinus); setExpandList(expandList === val ? '' : val);
        }
    }

    const OnClose = () => {
        setNameStatus(false)
        setIncStatus(false)
        setUpdateCount(updateCount + 1)
    }

    return (
        <>
            <div className="row px-1">
                <div className="col-12 mt-4">
                </div>
            </div>
            <Link to={changesStatus ? '#' : "/incidenttab"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                <i class="fa fa-chevron-right " style={{ fontSize: '14px' }}></i>
                <span className="ml-3" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                    INC-{incidentNumber ? incidentNumber : ""}
                </span>
            </Link>
            {/* Offense */}
            <li>
                <div className="col-12 " style={{ pointerEvents: incidentID ? '' : 'none', opacity: incidentID ? '' : '0.5' }}>
                    <div className="row">
                        {/* className="has-arrow arrow-c disabled mr-3" */}
                        <div className="col-10">
                            <Link to={changesStatus ? '#' : "/offensetab"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} className="" aria-expanded={plusMinus} onClick={() =>
                                incidentID ?
                                    callUtilityModules('Table', 'Master Table') : ''
                            }>{expandList === 'Master Table' ? <i className="fa fa-caret-down arrow-change"></i> : <i className="fa fa-caret-right arrow-change"></i>}
                                <span>Offense {`${incidentCount[0]?.OffenseCount > 0 ? '(' + incidentCount[0]?.OffenseCount + ')' : ''}`}</span>
                            </Link>
                        </div>
                        <div className="col-2">
                            <Link to={changesStatus ? '#' : "/OffenseHome"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                                <span className='inc-plus ' style={{ marginLeft: '-10px', cursor: 'pointer' }}
                                    onClick={() => {
                                        if (!changesStatus) {
                                            storeData({ 'OffenceStatus': false })
                                            deleteStoreData({ 'OffenceID': '' });
                                            setUpdateCount(updateCount + 1)
                                        }
                                    }}
                                >
                                    <i className="fa fa-plus btn btn-sm bg-line text-white" style={{ fontSize: '10px' }}></i>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                <ul aria-expanded={`${expandList === 'Master Table' ? true : false}`} className={`${expandList === 'Master Table' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-23px' }}>
                    <>
                        {
                            offenceData?.map((val, key) => (
                                <li className="ml-3 p-0" key={key}>
                                    <Link to={`/OffenseHome`}
                                        onClick={() => {
                                            storeData({ 'OffenceID': val.CrimeID, 'OffenceStatus': true })
                                            setUpdateCount(updateCount + 1)
                                        }}
                                    >
                                        <i className=" fa fa-arrow-right" ></i>
                                        <span href="#" className='offense-tooltip' data-hover={val?.OffenseName_Description}><>{val?.OffenseName_Description ? val?.OffenseName_Description.substring(0, 10) : ''}{val?.OffenseName_Description?.length > 20 ? ' . . .' : null}</>
                                        </span>
                                    </Link>
                                </li>
                            ))
                        }
                    </>
                </ul>
            </li>
            {/* Name */}
            <li>
                <div className="col-12 " style={{ pointerEvents: incidentID ? '' : 'none', opacity: incidentID ? '' : '0.5' }}>
                    <div className="row">
                        <div className="col-10">
                            <Link to={changesStatus ? '#' : "/name"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} className="" aria-expanded={plusMinus1} onClick={() =>
                                incidentID ?
                                    callUtilityModules('List', 'Master Table1') : ''
                            }>{expandList === 'Master Table1' ? <i className="fa fa-caret-down arrow-change"></i> : <i className="fa fa-caret-right arrow-change"></i>}
                                <span>Name {`${incidentCount[0]?.NameCount > 0 ? '(' + incidentCount[0]?.NameCount + ')' : ''}`}</span>
                            </Link>
                        </div>
                        <div className="col-2">
                            <Link to={changesStatus ? '#' : "/nametab?page=clear"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                                <span className='inc-plus ' style={{ marginLeft: '-10px', cursor: 'pointer' }}
                                    onClick={() => {
                                        if (!changesStatus) {
                                            OnClose();
                                            storeData({ 'NameStatus': false });
                                            deleteStoreData({ 'NameID': '', 'MasterNameID': '' });
                                        }
                                    }}
                                >
                                    <i className="fa fa-plus btn btn-sm bg-line text-white" style={{ fontSize: '10px' }}></i>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                <ul aria-expanded={`${expandList === 'Master Table1' ? true : false}`} className={`${expandList === 'Master Table1' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-23px' }}>
                    <>
                        {
                            nameData?.map((val, key) => (
                                // console.log(val),
                                <li className="ml-3 p-0" key={key}>
                                    <Link to={`/nametab`}
                                        onClick={() => {
                                            storeData({ 'NameID': val?.NameID, 'MasterNameID': val?.MasterNameID, 'NameStatus': true })
                                            setIncStatus(true);
                                            setUpdateCount(updateCount + 1);
                                        }}
                                    >
                                        <i className=" fa fa-arrow-right"></i>
                                        <span className="m-0 p-0">{(val.FullName).substring(0, 10) + '...'}</span>
                                    </Link>
                                </li>
                            ))
                        }
                    </>
                </ul>
            </li>
            {/* Property */}
            <li>
                <div className="col-12 " style={{ pointerEvents: incidentID ? '' : 'none', opacity: incidentID ? '' : '0.5' }}>
                    <div className="row">
                        <div className="col-10">
                            <Link to={changesStatus ? '#' : "/property"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} className="" aria-expanded={plusMinus4} onClick={() =>
                                incidentID ?
                                    callUtilityModules('Property', 'Master Table4') : ''
                            }>{expandList === 'Master Table4' ? <i className="fa fa-caret-down arrow-change"></i> : <i className="fa fa-caret-right arrow-change"></i>}
                                <span>Property {`${incidentCount[0]?.PropertyCount > 0 ? '(' + incidentCount[0]?.PropertyCount + ')' : ''}`}</span>
                            </Link>
                        </div>
                        <div className="col-2">
                            <Link to={changesStatus ? '#' : "/propertytab"}>
                                <span className='inc-plus ' to={changesStatus ? '#' : "/propertytab"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} style={{ marginLeft: '-10px', cursor: 'pointer' }}
                                    onClick={() => {
                                        if (!changesStatus) {
                                            storeData({ 'propertyStatus': false });
                                            deleteStoreData({ 'PropertyID': '', 'MasterPropertyID': '', });
                                            setUpdateCount(updateCount + 1)
                                        }
                                    }}
                                >
                                    <i className="fa fa-plus btn btn-sm bg-line text-white" style={{ fontSize: '10px' }}></i>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                <ul aria-expanded={`${expandList === 'Master Table4' ? true : false}`} className={`${expandList === 'Master Table4' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-23px' }}>
                    <>
                        {
                            propertyData?.map((val, key) => (
                                <li className="ml-3 p-0" key={key}>
                                    <Link to={`/propertytab`}
                                        onClick={() => {
                                            storeData({ 'PropertyID': val?.PropertyID, 'MasterPropertyID': val?.MasterPropertyID, 'propertyStatus': true })
                                            setUpdateCount(updateCount + 1)
                                        }}
                                    >
                                        <i className=" fa fa-arrow-right" ></i>
                                        <span className="m-0 p-0">{val.PropertyNumber}</span>
                                    </Link>
                                </li>
                            ))
                        }
                    </>
                </ul>
            </li>
            {/* Vehicle */}
            <li>
                <div className="col-12 " style={{ pointerEvents: incidentID ? '' : 'none', opacity: incidentID ? '' : '0.5' }}>
                    <div className="row">
                        <div className="col-10">
                            <Link to={changesStatus ? '#' : "/vehicle"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} className="" aria-expanded={plusMinus3} onClick={() =>
                                incidentID ?
                                    callUtilityModules('Vehicle', 'Master Table3') : ''
                            }>{expandList === 'Master Table3' ? <i className="fa fa-caret-down arrow-change"></i> : <i className="fa fa-caret-right arrow-change"></i>}
                                <span>Vehicle {`${incidentCount[0]?.VehicleCount > 0 ? '(' + incidentCount[0]?.VehicleCount + ')' : ''}`}</span>
                            </Link>
                        </div>
                        <div className="col-2">
                            <Link to={changesStatus ? '#' : "/vehicletab"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                                <span className='inc-plus ' style={{ marginLeft: '-10px', cursor: 'pointer' }}
                                    onClick={() => {
                                        if (!changesStatus) {
                                            //----------> Dev 0001 <------------
                                            deleteStoreData({ 'VehicleID': '', 'MasterPropertyID': '', 'VehicleStatus': '' });
                                            storeData({ 'VehicleStatus': false });
                                            setUpdateCount(updateCount + 1)
                                        }
                                    }}
                                >
                                    <i className="fa fa-plus btn btn-sm bg-line text-white" style={{ fontSize: '10px' }}></i>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                <ul aria-expanded={`${expandList === 'Master Table3' ? true : false}`} className={`${expandList === 'Master Table3' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-23px' }}>
                    <>
                        {
                            VehicleData?.map((val, key) => (
                                <li className="ml-3 p-0" key={key}>
                                    <Link to={`/vehicletab`}
                                        onClick={() => {
                                            storeData({ 'VehicleID': val.VehicleID, 'MasterPropertyID': val.MasterPropertyID, 'VehicleStatus': true })
                                            setUpdateCount(updateCount + 1)
                                        }}
                                    >
                                        <i className=" fa fa-arrow-right" ></i>
                                        <span className="m-0 p-0">{val.VehicleNumber}</span>
                                    </Link>
                                </li>
                            ))
                        }
                    </>
                </ul>
            </li>

            {/* Warrant */}
            <li>
                <div className="col-12 " style={{ pointerEvents: incidentID ? '' : 'none', opacity: incidentID ? '' : '0.5' }}>
                    <div className="row">
                        <div className="col-10">
                            <Link to={changesStatus ? '#' : "/warrant"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} className="" aria-expanded={plusMinus5} onClick={() =>
                                incidentID ?
                                    callUtilityModules('Warrant', 'Master Table5') : ''
                            }>{expandList === 'Master Table5' ? <i className="fa fa-caret-down arrow-change"></i> : <i className="fa fa-caret-right arrow-change"></i>}
                                <span>Warrant {`${incidentCount[0]?.WarrantCount > 0 ? '(' + incidentCount[0]?.WarrantCount + ')' : ''}`}</span>
                            </Link>
                        </div>
                        <div className="col-2">
                            <Link to={changesStatus ? '#' : "/warrant-tab"}>
                                <span className='inc-plus ' to={changesStatus ? '#' : "/warrant-tab"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} style={{ marginLeft: '-10px', cursor: 'pointer' }}
                                    onClick={() => {
                                        if (!changesStatus) {
                                            deleteStoreData({ 'WarrantID': '' });
                                            storeData({ 'WarrantStatus': false })
                                            setUpdateCount(updateCount + 1)
                                        }
                                    }}
                                >
                                    <i className="fa fa-plus btn btn-sm bg-line text-white" style={{ fontSize: '10px' }}></i>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                <ul aria-expanded={`${expandList === 'Master Table5' ? true : false}`} className={`${expandList === 'Master Table5' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-23px' }}>
                    <>
                        {
                            warentData?.map((val, key) => (
                                <li className="ml-3 p-0" key={key}>
                                    <Link to={`/warrant-tab`}
                                        onClick={() => {
                                            storeData({ 'WarrantID': val?.WarrantID, 'WarrantStatus': true })
                                            setUpdateCount(updateCount + 1)
                                        }}
                                    >
                                        <i className=" fa fa-arrow-right" ></i>
                                        <span className="m-0 p-0">{val.WarrantNumber}</span>
                                    </Link>
                                </li>
                            ))
                        }
                    </>
                </ul>
            </li>
            {/* Arrest */}
            <li>
                <div className="col-12 " style={{ pointerEvents: incidentID ? '' : 'none', opacity: incidentID ? '' : '0.5' }}>
                    <div className="row">
                        <div className="col-10">
                            <Link to={changesStatus ? '#' : "/arrest"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} className="" aria-expanded={plusMinus2} onClick={() =>
                                incidentID ?
                                    callUtilityModules('Arrest', 'Master Table2') : ''
                            }>{expandList === 'Master Table2' ? <i className="fa fa-caret-down arrow-change"></i> : <i className="fa fa-caret-right arrow-change"></i>}
                                <span>Arrest {`${incidentCount[0]?.ArrestCount > 0 ? '(' + incidentCount[0]?.ArrestCount + ')' : ''}`}</span>
                            </Link>
                        </div>
                        <div className="col-2">
                            <Link to={changesStatus ? '#' : "/arresttab"}>
                                <span className='inc-plus ' to={changesStatus ? '#' : "/arresttab"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} style={{ marginLeft: '-10px', cursor: 'pointer' }}
                                    onClick={() => {
                                        if (!changesStatus) {
                                            deleteStoreData({ 'ArrestID': '', 'ArrestStatus': '' });
                                            storeData({ 'ArrestStatus': false })
                                            setUpdateCount(updateCount + 1)
                                        }
                                    }}
                                >
                                    <i className="fa fa-plus btn btn-sm bg-line text-white" style={{ fontSize: '10px' }}></i>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                <ul aria-expanded={`${expandList === 'Master Table2' ? true : false}`} className={`${expandList === 'Master Table2' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-23px' }}>
                    <>
                        {
                            arrestData?.map((val, key) => (
                                <li className="ml-3 p-0" key={key}>
                                    <Link to={`/arresttab`}
                                        onClick={() => {
                                            storeData({ 'ArrestID': val.ArrestID, 'ArrestStatus': true })
                                            setUpdateCount(updateCount + 1)
                                        }}
                                    >
                                        <i className=" fa fa-arrow-right" ></i>
                                        <span className="m-0 p-0">{val.ArrestNumber}</span>
                                    </Link>
                                </li>
                            ))
                        }
                    </>
                </ul>
            </li>

        </>
    )
}

export default IncSidebar