import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchPostData, ScreenPermision } from "../hooks/Api";
import { AgencyContext } from '../../Context/Agency/Index';
import { One_Search_Filter, One_Search_Filter_OneValue } from "../Filter/Filter";
import { Decrypt_Id_Name } from "../Common/Utility";
import IncSidebar from "./SidebarCom/IncSidebar";
import DashboardSidebar from "./SidebarCom/DashboardSidebar";
import ListMangSidebar from "./SidebarCom/ListMangSidebar";
import AgencySidebar from "./SidebarCom/AgencySidebar";
import PersonnelSidebar from "./SidebarCom/PersonnelSidebar";
import { NameSearchSidebar } from "./SidebarCom/NameSearchSidebar";
import ArrestSearch from "./SidebarCom/ArrestSearch";
import IncidentReportSidebar from "./SidebarCom/IncidentReportSidebar";
import NameReportSidebar from "./SidebarCom/NameReportSidebar";
import ArrestReportSidebar from "./SidebarCom/ArrestReportSidebar";
import PropertyReportSidebar from "./SidebarCom/PropertyReportSidebar";
import ReportSidebar from "./SidebarCom/ReportSidebar";
import SearchSidebar from "./SidebarCom/SearchSidebar";
import arrest from '../../img/arrest.png'
import warrant from '../../img/warrant.png'
var CryptoJS = require("crypto-js");

const Sidebar = (props) => {

  const navigate = useNavigate()

  const { getAgency, get_Personnel_Lists, get_CountList, inActiveStatus, changesStatus, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext)

  const { listManagementSideBar, agencySideBar, personnelSideBar, path, incidentSideBar, dashboardSidebar, nameSearchSideBar, arrestSearchSideBar, reportSidebar, searchSidebar } = props

  const [moduleList, setModuleList] = useState([])
  const [tableManagementList, setTableManagementList] = useState([])
  const [tableManagementFillterList, setTableManagementFillterList] = useState([])
  const [listManagerSP, setListManagerSP] = useState([])
  const [securityManagerSP, setSecurityManagerSP] = useState([])
  const [subModules, setSubModules] = useState([])

  const [agencyId, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID] = useState('');

  const useQuery = () => new URLSearchParams(useLocation().search);
  let aId = useQuery().get('id');
  let openPage = useQuery().get('page');

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", })
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
      get_LocalStorage(localStore);
    }
  }, []);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray.AgencyID && localStoreArray.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(localStoreArray?.PINID);
      }
    }
  }, [localStoreArray])

  // const agencyId = Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID');

  useEffect(async () => {
    if (path === '/agencyTab') {
      if (!inActiveStatus) {
        await getAgency();
        if (aId.split(" ", 3)[0].split("/", 1)[0].substring(10,) != '000') {
          get_CountList(aId.split(" ", 3)[0].split("/", 1)[0].substring(10,))
        }
      }
    } else if (path === '/personnelTab') {
      if (aId && !inActiveStatus) get_Personnel_Lists(aId.split(" ", 3)[0].split("/", 1)[0].substring(10,));
    }
    // else if (path === '/agency') getListManager()
    else if (path === '/ListManagement') { get_Modules('1'); get_Table_Management_List() }
    else if (path === '/incidenttab') get_SubModules(agencyId)
  }, [aId, path])

  // Get Module and Table_Management_List
  const get_Modules = (id) => {
    const val = {
      ApplicationId: id
    }
    fetchPostData('ScreenPermission/GetData_Module', val)
      .then(res => {
        if (res) { setModuleList(res) }
        else { setModuleList() }
      })
  }

  const get_Table_Management_List = () => {
    const value = {
      ModuleID: 0
    }
    fetchPostData('TableManagement/GetData_TableManagement', value)
      .then(res => {
        if (res) { setTableManagementList(res); setTableManagementFillterList(res) }
        else { setTableManagementList(); setTableManagementFillterList() }
      })
  }

  const get_SubModules = (agencyId) => {
    const val = {
      AgencyID: agencyId
    }
    fetchPostData('SubModules/GetData_SubModule', val)
      .then(res => {
        if (res) setSubModules(res)
        else setSubModules()
      })
  }

  // Get Effective Screeen Permission
  const getSecurityPermission = () => {
    ScreenPermision("U025", agencyId).then(res => {
      if (res) setSecurityManagerSP(res)
      else setSecurityManagerSP()
    });
  }

  const getListManager = () => {
    ScreenPermision("U024", agencyId).then(res => {
      if (res) setListManagerSP(res)
      else setListManagerSP()
    });
  }

  return (
    <>
      <div id="header_top" className="header_top dark">
        <div className="container">
          <div className="hleft">
            <Link to="/dashboard-page" className="header-brand">
              <i className="fa fa-soccer-ball-o brand-logo"></i>
            </Link>
            <div className="dropdown">
              <Link to={changesStatus ? '#' : "/incident"} className="nav-link icon xs-hide" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                <p className="p-0 m-0 ">
                  <i className="fa fa-stack-exchange " aria-hidden="true"></i>
                </p>
                <p className="side-p">
                  Incident
                </p>
              </Link>

              <Link to={changesStatus ? '#' : "/namesearch"} className="nav-link icon app_inbox xs-hide" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                {/* <i className="fa fa-calendar"></i> */}
                {/* <strong>Name</strong> */}
                <p className="p-0 m-0 ">
                  <i className="fa fa-user side-icon"></i>
                </p>
                <p className="side-p">
                  Name
                </p>
              </Link>

              <Link to={changesStatus ? '#' : "/property-search"} className="nav-link icon app_inbox xs-hide" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                {/* <i className="fa fa-calendar"></i> */}
                {/* <strong>PROP</strong> */}
                <p className="p-0 m-0 ">
                  <i className="fa fa-building side-icon"></i>
                </p>
                <p className="side-p">
                  Property
                </p>
              </Link>
              <Link to={changesStatus ? '#' : "/vehicle-search"} className="nav-link icon app_inbox xs-hide" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                {/* <i className="fa fa-calendar"></i> */}
                {/* <strong>VEH</strong> */}
                <p className="p-0 m-0 ">
                  <i className="fa fa-car side-icon"></i>
                </p>
                <p className="side-p">
                  Vehicle
                </p>
              </Link>

              {/* <Link to={changesStatus ? '#' : "/progress-testing"} className="nav-link icon app_inbox xs-hide" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                <strong>CIT</strong>
              </Link> */}
                 <Link to={changesStatus ? '#' : "/warrant-search"} className="nav-link icon app_inbox xs-hide" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                {/* <i className="fa fa-calendar"></i> */}
                {/* <strong>WAR</strong> */}
                <p className="p-0 m-0 ">
                  {/* <i className="fa fa-search side-icon"></i> */}
                  <img src={warrant} alt="" className="img-icon " style={{ width: '22px' }} />
                </p>
                <p className="side-p">
                  Warrant
                </p>
              </Link>
              <Link to={changesStatus ? '#' : "/arrest-search"} className="nav-link icon app_inbox xs-hide" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}  >
                {/* <i className="fa fa-calendar"></i> */}
                {/* <strong>ARR</strong> */}
                <p className="p-0 m-0 ">
                  {/* <i className="fa fa-search side-icon"></i> */}
                  <img src={arrest} alt="" className="img-icon " style={{ width: '22px' }} />
                </p>
                <p className="side-p">
                  Arrest
                </p>
              </Link>
           
              <Link to={changesStatus ? '#' : "/field-interview-search"} className="nav-link icon app_inbox xs-hide" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                {/* <i className="fa fa-calendar"></i> */}
                {/* <strong>FI</strong> */}
                <p className="side-p">
                  Field Interview
                </p>
              </Link>

              <Link to={changesStatus ? '#' : "/ReportsMain"} className="nav-link icon app_inbox xs-hide" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                {/* <i className="fa fa-calendar"></i> */}
                {/* <strong>Rep</strong> */}
                <p className="p-0 m-0 ">
                  <i className="fa fa-file side-icon"></i>
                </p>
                <p className="side-p">
                  Report
                </p>
              </Link>
              <Link to={changesStatus ? '#' : "/Search"} className="nav-link icon app_inbox xs-hide" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                <p className="p-0 m-0 ">
                  <i className="fa fa-search side-icon"></i>
                </p>
                <p className="side-p">
                  Search
                </p>
                {/* <strong>Ser</strong> */}
              </Link>

              {/* <Link to="" className="nav-link icon theme_btn xs-hide">
                <i
                  className="fa fa-paint-brush"
                  data-toggle="tooltip"
                  data-placement="right"
                  title="Themes"
                ></i>
              </Link> */}
            </div>
          </div>
          {/* <div className="hright">
            <div className="dropdown">
              <Link to="" className="nav-link icon settingbar d-block">
                <i
                  className="fa fa-gear fa-spin"
                  data-toggle="tooltip"
                  data-placement="right"
                  title="Settings"
                ></i>
              </Link>
              <i className="fa fa-align-left icon menu_toggle"></i>
            </div>
          </div> */}
        </div>
      </div>
      <div id="left-sidebar" className="sidebar ">
        <h5 className="brand-name" style={{ borderBottom: '1px solid gray', paddingBottom: '10px' }}>
          GoldLine{" "}
        </h5>
        <nav id="left-sidebar-nav" className="sidebar-nav">
          <ul className="metismenu ">
            {
              dashboardSidebar && <DashboardSidebar />
            }
            {
              incidentSideBar ? openPage === 'clear' || !openPage ? <IncSidebar /> : <></> : <></>
            }
            {
              agencySideBar && <AgencySidebar />
            }
            {
              personnelSideBar && <PersonnelSidebar />
            }
            {
              listManagementSideBar && <ListMangSidebar />
            }
            {
              nameSearchSideBar && openPage === 'mastername' && <NameSearchSidebar />
            }
            {
              arrestSearchSideBar && openPage === 'ArrestSearch' && <ArrestSearch />
            }
            {
              path === "/namesearch" && <NameSearchSidebar />
            }
            {
              reportSidebar && <ReportSidebar />
            }
            {
              searchSidebar && <SearchSidebar />
            }
          </ul>
        </nav>
      </div>
    </>
  );
};


export default Sidebar;
