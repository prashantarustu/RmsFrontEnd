import React, { useEffect,useContext } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { AgencyContext } from '../../../Context/Agency/Index'
import { One_Search_Filter } from '../../Filter/Filter'
import { Decrypt_Id_Name } from '../../Common/Utility'

const AgencySidebar = () => {

    const navigate = useNavigate()
    const { agencyData, getAgency, setAgencyFilterData, setAgencyID, setAgencyName, setShowPage, agencyFilterData, setStatus, status, changesStatus, getInActiveAgency, inActiveStatus, setInActiveStatus, LoginAgencyID, setLoginAgencyID, LoginPinID, setLoginPinID, localStoreArray, setLocalStoreArray, get_LocalStorage, storeData, deleteStoreData } = useContext(AgencyContext);

    const useQuery = () => new URLSearchParams(useLocation().search);
    let aId = useQuery().get('id');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray.AgencyID && localStoreArray.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                if (agencyFilterData.length === 0) getAgency(localStoreArray?.AgencyID, localStoreArray?.PINID)
            }
        }
    }, [localStoreArray]);

    return (
        <>
            <p>
                <div className="row px-1">
                    <div className="col-12 pb-3" >
                        <div className="box px-4 " style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="text-center icon-hover-green" onClick={() => {
                                navigate('/agencyTab?id=U2FsdGVkX1000/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=')

                                getAgency(); setInActiveStatus(false); setShowPage('home'); setAgencyName('')
                            }}>
                                <i className="fa fa-user" style={{ cursor: 'pointer', color: inActiveStatus ? '' : '#4f772d' }}></i>
                                <span className="d-block" style={{ fontSize: '10px', cursor: 'pointer', textDecoration: inActiveStatus ? '' : 'underline', textDecorationColor: inActiveStatus ? '' : '#4f772d' }}>Active</span>
                            </span>
                            <span className="text-center ml-3 icon-hover-red" onClick={() => {
                                navigate('/agencyTab?id=U2FsdGVkX1000/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=')
                                getInActiveAgency(); setInActiveStatus(true); setShowPage('home'); setAgencyName('')
                            }}>
                                <i className="fa fa-user-times" style={{ cursor: 'pointer', color: inActiveStatus ? '#ae2012' : '', }}></i>
                                <span className="d-block" style={{ fontSize: '10px', cursor: 'pointer', textDecoration: inActiveStatus ? 'underline' : '', textDecorationColor: inActiveStatus ? '#ae2012' : '' }}>Inactive</span>
                            </span>
                        </div>
                    </div>
                    <div className="col-12">
                        <input type="text" onChange={(e) => {
                            const result = One_Search_Filter(agencyData, e.target.value, 'Contains', 'Agency_Name', 'ORI')
                            setAgencyFilterData(result)
                        }} className='form-control' placeholder='Search By Agency ...' />
                    </div>
                </div>
                <Link to={`/agencyTab?id=U2FsdGVkX1000/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`} ><i class="fa fa-chevron-right"></i>
                    <span className="ml-3">{inActiveStatus ? 'InActive Agency' : 'Agency'}</span>
                    <span style={{ float: 'right' }} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} onClick={() => {
                        if (!changesStatus) {
                            setStatus(false); setShowPage('home'); setAgencyName(''); deleteStoreData({ 'LocalAgencyID': '', 'LocalAgencyName': '' });
                        }
                    }}
                    >{inActiveStatus ? '' : <i class="fa fa-plus mr-4"></i>}</span>
                </Link>
                <ul className="recent">
                    <>
                        {
                            agencyFilterData?.map((item, index) => (
                                <li key={index} className="bb" style={{ background: `${aId.split(" ", 3)[0].split("/", 1)[0].substring(10,) == item.AgencyID && status ? '#EEE' : ''}` }} onClick={() => {
                                    if (!changesStatus && !inActiveStatus) {
                                        // get_CountList(item.AgencyID);
                                        storeData({ 'LocalAgencyID': item.AgencyID, 'LocalAgencyName': item.Agency_Name });
                                        setStatus(true); setAgencyID(item.AgencyID); setAgencyName(item.Agency_Name); setShowPage('home')
                                    } else {
                                        setAgencyName(item.Agency_Name); setStatus(true); setShowPage('home')
                                    }
                                }}>
                                    <Link to={`/agencyTab?id=U2FsdGVkX1${changesStatus ? aId.split(" ", 3)[0].split("/", 1)[0].substring(10,) : item.AgencyID}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} style={{ display: 'flex', flexDirection: 'column', }}>
                                        <span style={{ fontWeight: 'bold' }}>{item.Agency_Name}</span>
                                        <div className="d-flex justify-content-between">
                                            <span className="" style={{ fontSize: '11px', }}>{'ORI - ' + item.ORI.toUpperCase()}</span><div>
                                                {/* <i className="fa fa-trash "></i> */}
                                            </div>
                                        </div>
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

export default AgencySidebar