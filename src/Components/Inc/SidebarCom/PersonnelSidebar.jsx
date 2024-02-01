import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AgencyContext } from '../../../Context/Agency/Index';
import { One_Search_Filter } from '../../Filter/Filter';

const PersonnelSidebar = () => {

    const { get_Personnel_Lists, personnelList, setPersonnelStatus, setShowPagePersonnel, personnelFilterData, setPersonnelFilterData, get_CountList, getInActive_Personnel, inActiveStatus, setInActiveStatus, PersonnelEffectiveScreenPermission, changesStatus } = useContext(AgencyContext);
    const navigate = useNavigate()

    const useQuery = () => new URLSearchParams(useLocation().search);
    let aId = useQuery().get('id');
    let pId = useQuery().get('pd');

    return (
        <>
            <p>
                <div className="row px-1">
                    <div className="col-12 pb-3" >
                        <div className="box px-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="text-center icon-hover-green" onClick={() => {
                                navigate(`/personnelTab?id=U2FsdGVkX1${aId.split(" ", 3)[0].split("/", 1)[0].substring(10,)}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=&pd=89zw03LXTG0000/2Wga0gJLXEgctxh79FeM/G`)
                                get_Personnel_Lists(aId.split(" ", 3)[0].split("/", 1)[0].substring(10,)); setInActiveStatus(false)
                            }}>
                                <i className="fa fa-user" style={{ cursor: 'pointer', color: inActiveStatus ? '' : '#4f772d' }}></i>
                                <span className="d-block" style={{ fontSize: '10px', cursor: 'pointer', textDecoration: inActiveStatus ? '' : 'underline', textDecorationColor: inActiveStatus ? '' : '#4f772d' }}>Active</span>
                            </span>
                            <span className="text-center ml-3 icon-hover-red" onClick={() => {
                                navigate(`/personnelTab?id=U2FsdGVkX1${aId.split(" ", 3)[0].split("/", 1)[0].substring(10,)}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=&pd=89zw03LXTG0000/2Wga0gJLXEgctxh79FeM/G`)
                                getInActive_Personnel(aId.split(" ", 3)[0].split("/", 1)[0].substring(10,)); setInActiveStatus(true)
                            }}>
                                <i className="fa fa-user-times" style={{ cursor: 'pointer', color: inActiveStatus ? '#ae2012' : '' }}></i>
                                <span className="d-block" style={{ fontSize: '10px', cursor: 'pointer', textDecoration: inActiveStatus ? 'underline' : '', textDecorationColor: inActiveStatus ? '#ae2012' : '' }}>Inactive</span>
                            </span>
                        </div>
                    </div>
                    <div className="col-12">
                        <input type="text" onChange={(e) => {
                            const result = One_Search_Filter(personnelList, e.target.value, 'Contains', 'FirstName', 'PIN')
                            setPersonnelFilterData(result)
                        }} className='form-control' placeholder='Search Personnel ...' />
                    </div>
                </div>
                <Link to={`/personnelTab?id=U2FsdGVkX1${aId.split(" ", 3)[0].split("/", 1)[0].substring(10,)}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=&pd=89zw03LXTG0000/2Wga0gJLXEgctxh79FeM/G`}><i class="fa fa-chevron-right"></i>
                    <span className="ml-3">{inActiveStatus ? 'InActive Personnel' : 'Personnel'}</span>
                    <span style={{ float: 'right' }} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} onClick={() => {
                        if (!changesStatus) {
                            setPersonnelStatus(false); setShowPagePersonnel('home')
                        }
                    }}>{inActiveStatus ? '' : <i class="fa fa-plus mr-4"></i>}</span>
                </Link>
                {
                    PersonnelEffectiveScreenPermission ?
                        PersonnelEffectiveScreenPermission[0]?.DisplayOK ?
                            <ul className="recent">
                                <>
                                    {personnelFilterData ?
                                        personnelFilterData?.map((item, index) => (
                                            <li key={index} className="bb" style={{ background: `${pId.split(" ", 3)[0].split("/", 1)[0].substring(10,) == item.PINID ? '#EEE' : ''}` }} onClick={() => {
                                                if (!changesStatus && !inActiveStatus) {
                                                    get_CountList(aId, item.PINID); setPersonnelStatus(true); setShowPagePersonnel('home')
                                                } else {
                                                    setPersonnelStatus(true); setShowPagePersonnel('home')
                                                }
                                            }}>
                                                <Link style={{ display: 'flex', flexDirection: 'column', }} to={`/personnelTab?id=U2FsdGVkX1${aId.split(" ", 3)[0].split("/", 1)[0].substring(10,)}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=&pd=89zw03LXTG${changesStatus ? pId.split(" ", 3)[0].split("/", 1)[0].substring(10,) : item.PINID}/2Wga0gJLXEgctxh79FeM/G`} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                                                    <span style={{ fontWeight: 'bold' }}>{item.LastName + '-' + item.FirstName}</span>
                                                    <div className="d-flex justify-content-between" >
                                                        <span style={{ fontSize: '11px', }}>{'PIN - ' + item.PIN}</span><div>
                                                            {/* <i className="fa fa-trash "></i> */}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))
                                        : ''
                                    }
                                </>
                            </ul> :
                            "You don’t have permission to view data"
                        :
                        <ul className="recent">
                            <>
                                {personnelFilterData ?
                                    personnelFilterData?.map((item, index) => (
                                        <li key={index} className="bb" style={{ background: `${pId.split(" ", 3)[0].split("/", 1)[0].substring(10,) == item.PINID ? '#EEE' : ''}` }} onClick={() => {
                                            if (!changesStatus && !inActiveStatus) {
                                                get_CountList(aId, item.PINID); setPersonnelStatus(true); setShowPagePersonnel('home')
                                            } else {
                                                setPersonnelStatus(true); setShowPagePersonnel('home')
                                            }
                                        }}>
                                            <Link style={{ display: 'flex', flexDirection: 'column', }} to={`/personnelTab?id=U2FsdGVkX1${aId.split(" ", 3)[0].split("/", 1)[0].substring(10,)}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=&pd=89zw03LXTG${changesStatus ? pId.split(" ", 3)[0].split("/", 1)[0].substring(10,) : item.PINID}/2Wga0gJLXEgctxh79FeM/G`} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                                                <span style={{ fontWeight: 'bold' }}>{item.LastName + '-' + item.FirstName}</span>
                                                <div className="d-flex justify-content-between" >
                                                    <span style={{ fontSize: '11px', }}>{'PIN - ' + item.PIN}</span><div>
                                                        {/* <i className="fa fa-trash "></i> */}
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    ))
                                    : ''
                                }
                            </>
                        </ul>
                }

            </p>
        </>
    )
}

export default PersonnelSidebar