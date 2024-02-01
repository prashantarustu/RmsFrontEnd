import React, { useContext,useEffect,useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AgencyContext } from "../../Context/Agency/Index";
import { toastifySuccess } from "../Common/AlertMsg";
import { Decrypt_Id_Name } from "../Common/Utility";
import ThemeSetting from "./ThemeSetting";
import { AddDeleteUpadate } from "../hooks/Api";

const Header = (props) => {

  const { listManagementSideBar, agencySideBar, personnelSideBar } = props
  const { setAgencyName, agnecyName, setShowPage, setShowPagePersonnel, setInActiveStatus, changesStatus, localStoreArray, setLocalStoreArray, get_LocalStorage, setIsLogout, deleteStoreData } = useContext(AgencyContext)

  const useQuery = () => new URLSearchParams(useLocation().search);
  let aId = useQuery().get('id');
  let goToBack = useQuery().get('call');
  const navigate = useNavigate();

  // Logout User
  const signOut = () => {
    const val = {
      UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    }
    localStorage.clear();
    sessionStorage.clear();
    toastifySuccess('Logout Succesfully !!')
    setIsLogout(true)
    navigate('/')
    // AddDeleteUpadate('LocalStorage/DeleteLocalStorage', val).then((res) => {
    //   console.log(res)
    // })

  }

  const [userName, setUserName] = useState('')

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: '', PINID: '', IncidentStatus: '', UserName: '', IncidentID: '', IncidentNumber: '', MasterNameID: '', NameID: '', IsSuperadmin: '', LocalAgencyID: '', ArrestID: '', ChargeID: '', arrestStatus: '', Agency_Name: '', NameStatus: '', OffenceID: '', propertyStatus: '', VehicleID: '', VehicleStatus: '', MasterPropertyID: '', WarrantID: '', WarrantStatus: '', LocalAgencyName: '', }),
  }

  useEffect(() => {
    if (!localStoreArray.UserName || !localStoreArray.LocalAgencyName) {
      get_LocalStorage();
      // get_LocalStorage();
    }
  }, []);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray.UserName) {
        setUserName(localStoreArray?.UserName);
      }
      if (!agnecyName) {
        setAgencyName(localStoreArray?.LocalAgencyName)
      }
    }
  }, [localStoreArray])

  return (
    <>
      {/* {
        !listManagementSideBar ? */}
      <div id="page_top" className={`${listManagementSideBar ? 'section-body' : personnelSideBar ? 'section-body' : agencySideBar ? 'section-body' : 'section-body top_dark'}`} style={{ padding: `${listManagementSideBar ? '0' : personnelSideBar ? '0' : agencySideBar ? '0' : '20px;'}` }}>
        <div className="container-fluid p-0" style={{ backgroundColor: `${listManagementSideBar ? '#274c77' : personnelSideBar ? '#274c77' : agencySideBar ? '#274c77' : ''}` }} >
          <div className="page-header" >
            <div className="left text-white">
              <i className="mr-2 ml-2"></i>
              <h6 className={`${listManagementSideBar ? '' : personnelSideBar ? '' : agencySideBar ? '' : ''} mt-1 pt-1  `} >{listManagementSideBar ? 'List Management' : personnelSideBar ? 'Personnel' : agencySideBar ? 'Agency' : 'Dashboard'}</h6>
            </div>
            {
              agencySideBar ? <span className="text-white">{agnecyName ? agnecyName : ''}</span> : ''
            }
            <div className="right " >
              <div className="notification d-flex justify-content-between align-items-center px-3" >
                {
                  listManagementSideBar || agencySideBar || personnelSideBar ?
                    <Link to={listManagementSideBar ? goToBack ? goToBack : '/dashboard-page' : agencySideBar ? `/agency` : personnelSideBar ? `/agencyTab?id=U2FsdGVkX1${aId.split(" ", 3)[0].split("/", 1)[0].substring(10,)}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=` : '/dashboard-page'}>
                      <button style={{ background: 'inherit', border: 'none', outline: 'none', color: '#e63946' }}
                        onClick={() => { agencySideBar ? setShowPage('home') : personnelSideBar ? setShowPagePersonnel('home') : setShowPagePersonnel('home'); setShowPage('home'); setInActiveStatus(false) }}
                      >
                        <i className='fa fa-close text-white'></i>
                      </button>
                    </Link>
                    :
                    <></>
                }
                {
                  listManagementSideBar ? '' : agencySideBar ? '' : personnelSideBar ? '' :
                    <div className="dropdown d-flex">
                      <Link to='#'
                        className="nav-link icon  btn btn-default btn-icon ml-2"
                        data-toggle="dropdown"
                      >
                        {/* <i className="fa fa-user"></i> */}
                        <span className="text-uppercase text-white">
                          {userName}&nbsp;
                          {/* {Decrypt_Id_Name(localStorage.getItem('UserName'), 'UForUserName')}&nbsp; */}
                          <i class="fa fa-caret-down" aria-hidden="true"></i>
                        </span>
                      </Link>
                      <div className="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                        {/* <Link className="dropdown-item" to="/profile">
                      <i className="fa fa-user"></i> &nbsp; Profile
                    </Link> */}
                        <Link className="dropdown-item" to={changesStatus ? '#' : "/agency"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                          <span className="float-right">
                            {/* <span className="badge badge-primary">{agencyData?.length}</span> */}
                          </span>
                          <i class="fa fa-building-o" aria-hidden="true"></i>&nbsp; Agency
                        </Link>
                        {/* <Link className="dropdown-item" to="/Personnel">
                      <i className="fa fa-building-o"></i> &nbsp; Personnel
                    </Link> */}
                        <Link className="dropdown-item" to={changesStatus ? '#' : "/LockedUser"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                          <i className="fa fa-lock"></i> &nbsp; Locked User
                        </Link>
                        {/* <Link className="dropdown-item" to="#">
                      <i className="fa fa-building-o"></i> &nbsp; Master Personnel
                    </Link>
                    <Link className="dropdown-item" to="#">
                      <i className="fa fa-building-o"></i> &nbsp; Switch To Agency
                    </Link>
                    <Link className="dropdown-item" to="#">
                      <i className="fa fa-user"></i> &nbsp; License Module
                    </Link>
                    <div className="dropdown-divider"></div> */}
                        <Link className="dropdown-item" to={'/'} onClick={() => signOut()}>
                          <i className="fa fa-sign-out"></i>&nbsp; Sign out
                        </Link>
                      </div>
                    </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* : <></>
      } */}
      <ThemeSetting />
    </>
  )
}

export default Header;
