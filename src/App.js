// Import Component
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import DashboardPage from './Pages/DashboardPage';
import Auth, { decrypt } from './Auth';
import Login from './Components/Auth/Login';
import AgencyPage from './Pages/Agency/Agency';
import Otp from './Components/Auth/Otp';
import ForgotPassword from './Components/Auth/ForgotPassword';
import ChangePassword from './Components/Auth/ChangePassword';
import LockedUser from './Components/Pages/LockedUser/LockedUser';
// import ListManagement from './Components/Pages/Utility/ListManagement';
import ListManagement from './Components/Pages/Utility/ListManagement/ListManagement';
import ScreenPermision from './Components/Pages/Utility/SecurityManager/ScreenPermission/ScreenPermision';
import { ToastContainer } from 'react-toastify';
import AgencyTab from './Components/Pages/Agency/ModalTest/AgencyTab';
import PersonnelTab from './Components/Pages/PersonnelCom/PersonnelModal/PersonnelTab';
import ListPermission from './Components/Pages/Utility/ListPermission';
import CounterTable from './Components/Pages/Utility/CounterTable/CounterTable';
import Incident from './Components/Pages/Incident/Incident';
import IncidentTab from './Components/Pages/Incident/IncidentTab';
import Module from './Components/Pages/Incident/DragAndDrop/Module';
import OffenseTab from './Components/Pages/Offense/OffenseTab';
import OffenceHomeTabs from './Components/Pages/Offense/OffenceTab/OffenseUpdateTabs';
import Name from './Components/Pages/Name/Name';
import NameTab from './Components/Pages/Name/NameTab';
import Gang_Add_Up from './Components/Pages/Name/NameTab/Gang/Gang_Add_Up';
import Victim from './Components/Pages/Name/NameTab/Victim/Victim';
import Offender from './Components/Pages/Name/NameTab/Offender/Offender';
import Arrest from './Components/Pages/Arrest/Arrest';
import Arrest_Add_Up from './Components/Pages/Arrest/Arrest_Add_Up';
import Charge_Add_Up from './Components/Pages/Arrest/ArrestTab/Charges/Charge_Add_Up';
import Property from './Components/Pages/Property/Property';
import Property_Tabs from './Components/Pages/Property/Property_Tabs';
import Vehicle from './Components/Pages/Vehicle/Vehicle';
import Vehicle_Add_Up from './Components/Pages/Vehicle/Vehicle_Add_Up';
import PropertySearch from './Components/Pages/AdvancedSearch/PropertySearch/PropertySearch';
import ArrestSearch from './Components/Pages/AdvancedSearch/ArrestSearch/ArrestSearch';
import FieldInterviewSearch from './Components/Pages/AdvancedSearch/FieldInterviewSearch/FieldInterviewSearch';
import WarrantSearch from './Components/Pages/AdvancedSearch/WarrantSearch/WarrantSearch';
import FieldInterviewAdd from './Components/Pages/AdvancedSearch/FieldInterviewSearch/FieldInterviewAdd';
import WarrantAddUpdate from './Components/Pages/AdvancedSearch/WarrantSearch/WarrantAddUpdate';
import ChargeAddUpdate from './Components/Pages/AdvancedSearch/WarrantSearch/WarrantTabs/Charges/ChargeAddUpdate';
import NewIncident from './Components/Pages/Incident/IncidentSearch/NewIncident';
import VehicleSearch from './Components/Pages/VehicleSearch/VehicleSearch';
import WarrantAdvanceSearch from './Components/Pages/AdvancedSearch/WarrantSearch/WarrantAdvanceSearch';
import PropertyAdvanceSearch from './Components/Pages/AdvancedSearch/PropertySearch/PropertyAdvanceSearch';
import Booking from './Components/Pages/Arrest/Booking/Booking';
import ProgressPage from './Components/Pages/ProgressPage/ProgressPage';
import NameReport from './Components/Pages/ReportPage/NameReport/NameReport';
import PropertyReport from './Components/Pages/ReportPage/PropertyReport/PropertyReport';
import DailyEvent from './Components/Pages/ReportPage/IncidentReport/IncidentPrint/DailyEvent';
import IncidentLocation from './Components/Pages/ReportPage/IncidentReport/IncidentPrint/IncidentLocation';
import IncidentMonthly from './Components/Pages/ReportPage/IncidentReport/IncidentPrint/IncidentMonthly';
import MasterIncident from './Components/Pages/ReportPage/IncidentReport/IncidentPrint/MasterIncident';
import NameInformation from './Components/Pages/ReportPage/NameReport/NameInformation';
import SidebarMobile from './Components/MobileView/SidebarMobile';
import Mobilelogin from './Components/MobileView/MobileAuth/Mobilelogin';
import Warrant from './Components/Pages/Warrant/Warrant';
import WarrantTab from './Components/Pages/Warrant/WarrantTab';
import MobileDashboard from './Components/MobileView/MobileDesign/MobileDashboard';
import MobileIncident from './Components/MobileView/MobileDesign/IncidentDesign/MobileIncident';
import MobileName from './Components/MobileView/MobileDesign/NameDesign/MobileName';
import IncidentDesign from './Components/MobileView/MobileDesign/IncidentDesign/IncidentDesignTab/IncidentHome/IncidentDesgin';
import IncidentMobileTab from './Components/MobileView/MobileDesign/IncidentDesign/IncidentDesignTab/IncidentTab';
import ReportMake from './Components/Pages/NewReportMake/ReportMake';
import MobileOffense from './Components/MobileView/MobileDesign/OffenseDesign/MobileOffense';
import OffenseHome from './Components/MobileView/MobileDesign/OffenseDesign/OffenseHome/OffenseHome';
import OffenseMobileTab from './Components/MobileView/MobileDesign/OffenseDesign/OffenseMobileTab';
import ReportsMain from './Components/Pages/ReportPage/IncidentReport/ReportsMain';
import MobileProperty from './Components/MobileView/MobileDesign/PropertyDesign/MobileProperty';
import PropertyHome from './Components/MobileView/MobileDesign/PropertyDesign/PropertyHome/PropertyHome';
import PropertyMobileTab from './Components/MobileView/MobileDesign/PropertyDesign/PropertyMobileTab';
import NameMobileTab from './Components/MobileView/MobileDesign/NameDesign/NameMobileTab';
import NameHome from './Components/MobileView/MobileDesign/NameDesign/NameHome/NameHome';
import MobileVehicle from './Components/MobileView/MobileDesign/VehicleDesign/MobileVehicle';
import VehicleHome from './Components/MobileView/MobileDesign/VehicleDesign/VehicleHome/VehicleHome';
import VehicleMobileTab from './Components/MobileView/MobileDesign/VehicleDesign/VehicleMobileTab';
import { AgencyContext } from './Context/Agency/Index';
import ListNewPage from './Components/Pages/ListNewPage/ListNewPage';
import NameSearch from './Components/Pages/Name/NameAdvance/NameSearch';
import SearchAdvancePage from './Components/Pages/SearchAdvancePage/SearchAdvancePage';
import IncidentSearchPage from './Components/Pages/SearchAdvancePage/IncidentSearchPage/IncidentSearchPage';
import NameSearchPage from './Components/Pages/SearchAdvancePage/NameSearchPage/NameSearchPage';
import PropertySearchPage from './Components/Pages/SearchAdvancePage/PropertySearchPage/PropertySearchPage';
import ArrestSearchPage from './Components/Pages/SearchAdvancePage/ArrestSearchPage/ArrestSearchPage';
import IncidentOfficer from './Components/Pages/ReportPage/IncidentReport/IncidentPrint/IncidentOfficer';
import IncidentMedia from './Components/Pages/ReportPage/IncidentReport/IncidentPrint/IncidentMedia';
import ArrestMaster from './Components/Pages/ReportPage/ArrestReport/ArrestMaster';
import IncidentPublic from './Components/Pages/ReportPage/IncidentReport/IncidentPrint/IncidentPublic';
import ArrestByCharge from './Components/Pages/ReportPage/ArrestReport/ArrestByCharge';
import ArrestIncident from './Components/Pages/ReportPage/ArrestReport/ArrestIncident';
import ArrestMonthly from './Components/Pages/ReportPage/ArrestReport/ArrestMonthly';
import ArrestMonthlyCharge from './Components/Pages/ReportPage/ArrestReport/ArrestMonthlyCharge';
import WarrantExpired from './Components/Pages/ReportPage/WarrantReport/WarrantExpired';
import WarrantMonthly from './Components/Pages/ReportPage/WarrantReport/WarrantMonthly';
import VehicleSearchPage from './Components/Pages/SearchAdvancePage/VehicleSearchPage/VehicleSearchPage';
import VehicleMasterReport from './Components/Pages/ReportPage/VehicleReport/VehicleMasterReport';
import MasterPropertyReport from './Components/Pages/ReportPage/PropertyReport/MasterPropertyReport';
import IncidentVerifyLocation from './Components/MobileView/MobileDesign/IncidentDesign/IncidentLocation/IncidentVerifyLocation';
import ReportsSide from './Components/Pages/ReportPage/IncidentReport/ReportsSide';
import Consolidation from './Components/Pages/Consolidation/Consolidation';
import ConsolidationMerge from './Components/Pages/Consolidation/ConsolidationMerge';
import NewCustom from './Components/Pages/NewCustom/NewCustom';
import WarrantCharge_Add_Up from './Components/Pages/Warrant/WarrantTab/Charges/WarrantCharge_Add_Up';
import IncidentEdittable from './Components/Pages/Utility/SecurityManager/IncidentEdittable';
import PreviousYearCounter from './Components/Pages/Utility/PreviousYearCounter/PreviousYearCounter';
import PawnInformation from './Components/Pages/Utility/Applications/PawnInformation/PawnInformation';
import PawnInformation_Add_Up from './Components/Pages/Utility/Applications/PawnInformation/PawnInformation_Add_Up';
import FieldInterview from './Components/Pages/FieldInterview/FieldInterview';
import FieldInterviewTab from './Components/Pages/FieldInterview/FieldInterviewTab';


function App() {

  // Hooks initialize
  const { ws, setWs, login_Web_Socket } = useContext(AgencyContext)
  const [otp, setOtp] = useState('')
  const [loginResData, setLoginResData] = useState([])
  const [dashboardSidebar] = useState(true)
  const [listManagementSideBar] = useState(true)
  const [agencySideBar] = useState(true)
  const [personnelSideBar] = useState(true)
  const [incidentSideBar] = useState(true)
  const [nameSearchSideBar] = useState(true)
  const [arrestSearchSideBar] = useState(true)
  const [reportSidebar] = useState(true)
  const [searchSidebar] = useState(true)

  // send otp value child component
  const send_Otp = (otp, data) => {
    setOtp(otp)
    setLoginResData(data)
  }
  const [isPaused] = useState(false);
  // const [ws, setWs] = useState(null);

  const [progressStatus, setProgressStatus] = useState(0)

  // useEffect(() => {
  //   connect_Web()
  // }, []);

  const connect_Web = () => {
    const wsClient = new WebSocket('wss://rmswebsocket.com:54183');
    wsClient.onopen = () => {
      setWs(wsClient);
      if (sessionStorage.getItem('token')) login_Web_Socket(wsClient, null, 0)
    };
    wsClient.onclose = () => {
      console.log('ws closed');
      // setTimeout(connect_Web, 3000);
    }
    return () => { wsClient.close(); }
  }

  useEffect(() => {
    if (!ws) return;
    ws.onmessage = e => {
      if (isPaused) return;
      var plain = decrypt(e.data);
      var json = JSON.parse(plain);
      if (json) {
        if (json?.Messages) {
          // if (json?.Messages[0]?.FromUserName != Decrypt_Id_Name(localStorage.getItem('UserName'), 'UForUserName')) {
          //   toastifySuccess('Incident Assgin'); getPersonnelList()
          // }
        }
      }
    };
  }, [isPaused, ws]);

  return (
    <>
      {/* Routes */}
      <BrowserRouter >
        <div id="main_content">
          <Routes>
            <Route exact path="/" element={<Login {...{ send_Otp }} />} />
            <Route exact path="/otp" element={<Otp {...{ otp, loginResData }} />} />
            <Route exact path="/forgot-Password" element={<ForgotPassword />} />
            <Route exact path="/change-Password" element={<ChangePassword />} />
            <Route exact path="/dashboard-page" element={<Auth cmp={DashboardPage} path='/dashboard-page' dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/agency" element={<Auth cmp={AgencyPage} path="/agency" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/agencyTab" element={<Auth cmp={AgencyTab} agencySideBar={agencySideBar} path="/agencyTab" />} />
            <Route exact path="/personnelTab" element={<Auth cmp={PersonnelTab} personnelSideBar={personnelSideBar} path="/personnelTab" />} />
            <Route exact path="/LockedUser" element={<Auth cmp={LockedUser} path="/LockedUser" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/ListManagement" element={<Auth cmp={ListManagement} listManagementSideBar={listManagementSideBar} path="/ListManagement" />} />
            <Route exact path="/Consolidation" element={<Auth cmp={Consolidation} path="/Consolidation" />} />
            <Route exact path="/Consolidation-merge" element={<Auth cmp={ConsolidationMerge} path="/Consolidation-merge" />} />
            <Route exact path="/security-manager" element={<Auth cmp={ScreenPermision} path="/security-manager" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/Editable-Incident" element={<Auth cmp={IncidentEdittable} path="/Editable-Incident" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/ListPermission" element={<Auth cmp={ListPermission} path="/ListPermission" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/CounterTable" element={<Auth cmp={CounterTable} path="/CounterTable" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/PawnInformation" element={<Auth cmp={PawnInformation} path="/PawnInformation" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/PawnInformation-details" element={<Auth cmp={PawnInformation_Add_Up} path="/PawnInformation-details" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/PreviousYearCounter" element={<Auth cmp={PreviousYearCounter} path="/PreviousYearCounter" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/List" element={<Auth cmp={NewCustom} path="/List" />} />

            {/* Incident Tab  */}
            <Route exact path="/incident" element={<Auth cmp={Incident} path="/incident" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/field-interview" element={<Auth cmp={FieldInterview} path="/field-interview" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/field-interviewtab" element={<Auth cmp={FieldInterviewTab} path="/field-interviewtab" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/incidenttab" element={<Auth cmp={IncidentTab} path="/incidenttab" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Module" element={<Auth cmp={Module} path="/Module" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/offensetab" element={<Auth cmp={OffenseTab} path="/offensetab" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/offenseHome" element={<Auth cmp={OffenceHomeTabs} path="/offenseHome" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/name" element={<Auth cmp={Name} path="/name" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/nametab" element={<Auth cmp={NameTab} path="/nametab" incidentSideBar={incidentSideBar} nameSearchSideBar={nameSearchSideBar} />} />
            <Route exact path="/ganghome" element={<Auth cmp={Gang_Add_Up} path="/ganghome" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/victim" element={<Auth cmp={Victim} path="/victim" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/offender" element={<Auth cmp={Offender} path="/offender" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/arrest" element={<Auth cmp={Arrest} path="/arrest" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/booking" element={<Auth cmp={Booking} path="/booking" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/arresttab" element={<Auth cmp={Arrest_Add_Up} path="/arresttab" incidentSideBar={incidentSideBar} />} />
            {/* <Route exact path="/charge" element={<Auth cmp={Charges} path="/charge" incidentSideBar={incidentSideBar} />} /> */}
            <Route exact path="/chargetab" element={<Auth cmp={Charge_Add_Up} path="/chargetab" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/warrant-chargetab" element={<Auth cmp={WarrantCharge_Add_Up} path="/warrant-chargetab" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/property" element={<Auth cmp={Property} path="/property" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/propertytab" element={<Auth cmp={Property_Tabs} path="/propertytab" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/vehicle" element={<Auth cmp={Vehicle} path="/vehicle" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/vehicletab" element={<Auth cmp={Vehicle_Add_Up} path="/vehicletab" incidentSideBar={incidentSideBar} />} />

            {/* Name Search */}
            <Route exact path="/property-search" element={<Auth cmp={PropertySearch} path="/property-search" />} />
            <Route exact path="/arrest-search" element={<Auth cmp={ArrestSearch} path="/arrest-search" arrestSearchSideBar={arrestSearchSideBar} />} />
            <Route exact path="/warrant-search" element={<Auth cmp={WarrantSearch} path="/warrant-search" />} />
            <Route exact path="/warrant-add" element={<Auth cmp={WarrantAddUpdate} path="/warrant-add" />} />
            <Route exact path="/charges" element={<Auth cmp={ChargeAddUpdate} path="/charges" />} />
            <Route exact path="/field-interview-search" element={<Auth cmp={FieldInterviewSearch} path="/field-interview-search" />} />
            <Route exact path="/field-interview-add" element={<Auth cmp={FieldInterviewAdd} path="/field-interview-add" />} />
            <Route exact path="/namesearch" element={<Auth cmp={NameSearch} path="/namesearch" nameSearchSideBar={nameSearchSideBar} />} />
            <Route exact path="/incidentsearch" element={<Auth cmp={NewIncident} path="/incidentsearch" nameSearchSideBar={nameSearchSideBar} />} />
            <Route exact path="/vehicle-search" element={<Auth cmp={VehicleSearch} path="/vehicle-search" nameSearchSideBar={nameSearchSideBar} />} />
            {/* <Route exact path="/arrest-advance-search" element={<Auth cmp={ArrestAdvanceSearch} path="/arrest-advance-search" nameSearchSideBar={nameSearchSideBar} />} /> */}
            <Route exact path="/warrant-advance-search" element={<Auth cmp={WarrantAdvanceSearch} path="/warrant-advance-search" nameSearchSideBar={nameSearchSideBar} />} />
            <Route exact path="/property-advance-search" element={<Auth cmp={PropertyAdvanceSearch} path="/property-advance-search" nameSearchSideBar={nameSearchSideBar} />} />
            <Route exact path="/progress-testing" element={<Auth cmp={ProgressPage} {...{ setProgressStatus, progressStatus }} path="/progress-testing" />} />

            {/* <Route exact path="/incident-reports" element={<Auth cmp={IncidentReport} path="/incident-reports" incidentReportSidebar={incidentReportSidebar} />} /> */}

            {/* Incident-Reports */}
            <Route exact path="/incident-DailyEvent" element={<Auth cmp={DailyEvent} reportSidebar={reportSidebar} path="/incident-DailyEvent" />} />
            <Route exact path="/incident-Location" element={<Auth cmp={IncidentLocation} reportSidebar={reportSidebar} path="/incident-Location" />} />
            <Route exact path="/incident-Monthly" element={<Auth cmp={IncidentMonthly} reportSidebar={reportSidebar} path="/incident-Monthly" />} />
            <Route exact path="/incident-Master" element={<Auth cmp={MasterIncident} reportSidebar={reportSidebar} path="/incident-Master" />} />
            <Route exact path="/incident-Officer" element={<Auth cmp={IncidentOfficer} reportSidebar={reportSidebar} path="/incident-Officer" />} />
            <Route exact path="/incident-media" element={<Auth cmp={IncidentMedia} reportSidebar={reportSidebar} path="/incident-media" />} />
            <Route exact path="/incident-public" element={<Auth cmp={IncidentPublic} reportSidebar={reportSidebar} path="/incident-public" />} />
            {/* Name-Reports */}
            <Route exact path="/name-history" element={<Auth cmp={NameReport} path="/name-history" reportSidebar={reportSidebar} />} />
            <Route exact path="/name-information" element={<Auth cmp={NameInformation} path="/name-information" reportSidebar={reportSidebar} />} />
            {/* Arrest-Reports */}
            <Route exact path="/arrest-master" element={<Auth cmp={ArrestMaster} path="/arrest-master" reportSidebar={reportSidebar} />} />
            <Route exact path="/arrest-charge" element={<Auth cmp={ArrestByCharge} path="/arrest-charge" reportSidebar={reportSidebar} />} />
            <Route exact path="/arrest-incident" element={<Auth cmp={ArrestIncident} path="/arrest-incident" reportSidebar={reportSidebar} />} />
            <Route exact path="/arrest-monthly" element={<Auth cmp={ArrestMonthly} path="/arrest-monthly" reportSidebar={reportSidebar} />} />
            <Route exact path="/arrest-monthlyCharge" element={<Auth cmp={ArrestMonthlyCharge} path="/arrest-monthlyCharge" reportSidebar={reportSidebar} />} />
            {/* Property-Reports */}
            <Route exact path="/property-reports" element={<Auth cmp={PropertyReport} path="/property-reports" reportSidebar={reportSidebar} />} />
            <Route exact path="/property-vehicle" element={<Auth cmp={MasterPropertyReport} path="/property-vehicle" reportSidebar={reportSidebar} />} />

            {/* Warrant-Reports */}
            <Route exact path="/warrant-expired" element={<Auth cmp={WarrantExpired} path="/warrant-expired" reportSidebar={reportSidebar} />} />
            <Route exact path="/warrant-monthly" element={<Auth cmp={WarrantMonthly} path="/warrant-monthly" reportSidebar={reportSidebar} />} />
            {/* <Route exact path="/warrant-charge" element={<Auth cmp={WarrantCharge} path="/warrant-charge" reportSidebar={reportSidebar} />} /> */}
            {/* <Route exact path="/warrant-master" element={<Auth cmp={WarrantMaster} path="/warrant-master" reportSidebar={reportSidebar} />} /> */}

            {/* Vehicle-Reports */}
            <Route exact path="/vehicle-master" element={<Auth cmp={VehicleMasterReport} path="/vehicle-master" reportSidebar={reportSidebar} />} />


            <Route exact path="/warrant" element={<Auth cmp={Warrant} path="/warrant" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/warrant-tab" element={<Auth cmp={WarrantTab} path="/warrant-tab" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Reports" element={<Auth cmp={ReportsMain} path="/Reports" reportSidebar={reportSidebar} />} />
            <Route exact path="/ReportsMain" element={<Auth cmp={ReportsSide} path="/ReportsMain" reportSidebar={reportSidebar} />} />
            <Route exact path="/newreports" element={<ListNewPage />} />
            {/* SearchPage */}
            <Route exact path="/Search" element={<Auth cmp={SearchAdvancePage} path="/Search" searchSidebar={searchSidebar} />} />
            <Route exact path="/incident-advanceSearch" element={<Auth cmp={IncidentSearchPage} path="/incident-advanceSearch" searchSidebar={searchSidebar} />} />
            <Route exact path="/name-advanceSearch" element={<Auth cmp={NameSearchPage} path="/name-advanceSearch" searchSidebar={searchSidebar} />} />
            <Route exact path="/property-advanceSearch" element={<Auth cmp={PropertySearchPage} path="/property-advanceSearch" searchSidebar={searchSidebar} />} />
            <Route exact path="/arrest-advanceSearch" element={<Auth cmp={ArrestSearchPage} path="/arrest-advanceSearch" searchSidebar={searchSidebar} />} />
            <Route exact path="/vehicle-advanceSearch" element={<Auth cmp={VehicleSearchPage} path="/vehicle-advanceSearch" searchSidebar={searchSidebar} />} />

            {/* <Route exact path="/incident-search" element={<Auth cmp={IncidentSearch} path="/incident-search" nameSearchSideBar={nameSearchSideBar}  />} /> */}

            {/* for mobile view */}

            <Route Route exact path="/reports-make" element={<ReportMake />} />
            <Route Route exact path="/sidebar" element={<SidebarMobile />} />
            <Route Route exact path="/mobile-login" element={<Mobilelogin />} />
            <Route Route exact path="/incident-verifylocation" element={<IncidentVerifyLocation />} />
            {/* mobile-name */}
            <Route Route exact path="/name-main" element={<MobileName />} />
            <Route Route exact path="/mobile-name" element={<NameHome />} />
            {/* <Route Route exact path="/mobile-name" element={<NameDesign/>}/> */}
            <Route Route exact path="/name-tabs" element={<NameMobileTab />} />
            {/* mobile-incident */}
            <Route Route exact path="/mobile-incident" element={<IncidentDesign />} />
            <Route Route exact path="/incident-dashboard" element={<MobileDashboard />} />
            <Route Route exact path="/incident-main" element={<MobileIncident />} />
            <Route Route exact path="/incident-tabs" element={<IncidentMobileTab />} />
            {/* mobile-offense */}
            <Route Route exact path="/offense-main" element={<MobileOffense />} />
            <Route Route exact path="/mobile-offense" element={<OffenseHome />} />
            <Route Route exact path="/offense-tabs" element={<OffenseMobileTab />} />
            {/* mobile-property */}
            <Route Route exact path="/property-main" element={<MobileProperty />} />
            <Route Route exact path="/mobile-property" element={<PropertyHome />} />
            <Route Route exact path="/property-tabs" element={<PropertyMobileTab />} />
            {/* vehicle */}
            <Route Route exact path="/vehicle-main" element={<MobileVehicle />} />
            <Route Route exact path="/mobile-vehicle" element={<VehicleHome />} />
            <Route Route exact path="/vehicle-tabs" element={<VehicleMobileTab />} />
            {/* <Route Route exact path="/astro" element={<AstroLogin/>}/> */}
          </Routes>
        </div>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;

