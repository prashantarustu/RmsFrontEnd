// // Import Component
// import React, { useEffect, useState, memo, useContext } from 'react'
// import { Link } from "react-router-dom";
// import DataTable from 'react-data-table-component';
// import SubTab from '../../../Utility/Tab/SubTab';
// import { AgencyTabs } from '../../../Utility/Tab/TabsArray';
// import Group from '../AgencyTab/Group/Group';
// import PasswordSetting from '../AgencyTab/PasswordSetting/PasswordSetting';
// import Member from '../AgencyTab/Member/Member';
// import Division from '../AgencyTab/Division/Division';
// import Unit from '../AgencyTab/Unit/Unit';
// import Personnel from '../AgencyTab/Personnel/Personnel';
// import Login from '../AgencyTab/Login/Login';
// import ScreenPermission from '../AgencyTab/ScreenPermission/ScreenPermission';
// import LockRestrictLevel from '../AgencyTab/LockRestrictLevel/LockRestrictLevel';
// import Roster from '../AgencyTab/Roster/Roster';
// import Ranks from '../AgencyTab/Ranks/Ranks';
// import Shift from '../AgencyTab/Shift/Shift';
// import FieldSecurity from '../AgencyTab/FieldSecurity/FieldSecurity';
// import Dropdown from 'react-bootstrap/Dropdown';
// import { Agency_Name_Filter } from '../../../Filter/AgencyFilter';
// import Home from '../AgencyTab/Home/Index';
// import { AgencyContext } from '../../../../Context/Agency/Index';
// import UnitAssignment from '../AgencyTab/UnitAssignment/UnitAssignment';
// import Loader from '../../../Common/Loader';
// import EmergencyConatct from '../AgencyTab/EmergencyContact/EmergencyConatct';
// import EmergencyContact from '../AgencyTab/EmergencyContact/EmergencyConatct';

// const CustomModal = (props) => {

// //     http://localhost:26055/api/Agency/GetData_SingleData
// // Data:

// // parameter:
// // AgencyID:19
//     // Hooks Initialization
//     const { agencyData, agencyFilterData, getAgency, get_CountList, count, setAgencyFilterData } = useContext(AgencyContext)

//     const { setModalOpen, setAgencyId, agencyId } = props

//     const [showPage, setShowPage] = React.useState('home');
//     const [status, setStatus] = useState(false)
//     const [agencyName, setAgencyName] = useState()
//     // const [count, setCount] = useState({})
//     const [agencySelectRow, setAgencySelectRow] = useState(agencyFilterData)
//     // const [agencyId, setAgencyId] = useState()
//     const [showCount, setShowCount] = useState(false)

//     // Fitler 
//     const [filterAgencyNameOption, setFilterAgencyNameOption] = useState('Contains')
//     // console.log("count", count)
//     // Table Columns Array
//     const columns = [
//         {
//             name: 'ORI',
//             selector: (row) => row.ORI.toUpperCase(),
//             sortable: true
//         },
//         {
//             name: 'Agency Name',
//             selector: (row) => row.Agency_Name
//         },
//         {
//             name: 'Short Name',
//             selector: (row) => row.Short_Name,
//             sortable: true
//         },
//         {
//             name: 'MunicipalityCode',
//             selector: (row) => row.MunicipalityCode,
//             sortable: true
//         },
//         {
//             name: 'Phone',
//             selector: (row) => row.Agency_Phone,
//             sortable: true
//         },
//         {
//             name: <p className='text-end' style={{ position: 'absolute', top: 0, right: 40 }}>Action</p>,
//             cell: row => <>
//                 <div style={{ position: 'absolute', top: 0, right: 40 }}>
//                     <Link to={`#`} onClick={(e) => editValueSet(e, row)}
//                         className="btn btn-sm bg-green text-white px-1 py-0 mr-1"><i className="fa fa-edit"></i></Link>
//                     {/* <Link to={`#`} onClick={(e) => editValueSet(e, row)}
//                         className="btn btn-sm bg-green text-white px-1 py-0 mr-1"><i className="fa fa-trash"></i></Link> */}
//                 </div>
//             </>

//         }
//     ]

//     useEffect(() => {
//         getAgency();
//         // get_CountList(agencyId);
//     }, [])

//     // useEffect(() => {
//     //     if (agencyId) get_Field_Permision(agencyId);
//     // }, [agencyId])

// //     useEffect(async () => {
// //         if (agencyEditVal?.AgencyID) {
// //             setAgencyId(agencyEditVal?.AgencyID);
// //             setShowCount(true)
// //             // console.log(
              


// //             // //      const fromIndex = arr.indexOf('css'); // 👉️ 0
// //             // // const toIndex = 2;

           


// //             // agencyFilterData.splice(0, 0,  agencyFilterData.splice(agencyFilterData?.map((i, index) => {
// //             //     if (i.AgencyID === agencyEditVal?.AgencyID) {
// //             //         return index
// //             //     }
// //             // }).filter(function (element) {
// //             //     return element !== undefined;
// //             // }), 1)[0])

// //             // );
// // }
// //     }, [agencyEditVal])


// // Set Edit value
// const editValueSet = (e, data) => {
//     e.preventDefault()
//     // get_CountList(data?.AgencyID)
//     // setAgencyEditVal(data)
//     setAgencyName(data?.Agency_Name)
//     setAgencyId(data?.AgencyID)
//     setShowPage('home');
//     setStatus(true);
// }

// // Custom Style
// const conditionalRowStyles = [
//     {
//         when: row => row.AgencyID === agencyId,
//         style: {
//             backgroundColor: 'hwb(199deg 88% 0%)',
//             userSelect: "none",
//         }
//     },
// ];

// return (
//     <>
//         {/* {
//                 loding ? */}
//         <div id='full_screen_modal'>
//             <div className="box">
//                 <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-green">
//                     <span className='text-white' style={{ fontSize: '12px' }}>Agency  </span>
//                     <span className='text-white font-weight-bold ' >{agencyName}</span>
//                     <div className='d-flex' style={{ color: '#fff' }}>
//                         <div className="">
//                             <input type="text" onChange={(e) => {
//                                 const result = Agency_Name_Filter(agencyData, e.target.value, filterAgencyNameOption)
//                                 setAgencyFilterData(result)
//                                 // setAgencySelectRow(result)
//                             }} className='form-control' placeholder='Search By Agency Name ...' />
//                         </div>
//                         <div >
//                             <Dropdown>
//                                 <Dropdown.Toggle variant="success" id="dropdown-basic">
//                                     <i className="fa fa-filter"></i>
//                                 </Dropdown.Toggle>
//                                 <Dropdown.Menu>
//                                     <Dropdown.Item onClick={() => setFilterAgencyNameOption('Contains')}>Contains</Dropdown.Item>
//                                     <Dropdown.Item onClick={() => setFilterAgencyNameOption('is equal to')}>is equal to</Dropdown.Item>
//                                     <Dropdown.Item onClick={() => setFilterAgencyNameOption('is not equal to')}>is not equal to </Dropdown.Item>
//                                     <Dropdown.Item onClick={() => setFilterAgencyNameOption('Starts With')}>Starts With</Dropdown.Item>
//                                     <Dropdown.Item onClick={() => setFilterAgencyNameOption('End with')}>End with</Dropdown.Item>
//                                 </Dropdown.Menu>
//                             </Dropdown>
//                         </div>
//                         <button style={{ background: 'inherit', border: 'none', outline: 'none', color: '#e63946' }} onClick={() => { setModalOpen(false); setStatus(false) }}> <i className='fa fa-close'></i> </button>
//                     </div>
//                 </div>
//                 <div className="row px-2">
//                     <div className="col-12 mb-2">
//                         <div id='dataTable-box'>
//                             <DataTable
//                                 dense
//                                 columns={columns}
//                                 data={agencyFilterData}
//                                 conditionalRowStyles={conditionalRowStyles}
//                                 paginationPerPage={'5'}
//                                 paginationRowsPerPageOptions={[5, 10, 15]}
//                                 fixedHeader
//                                 fixedHeaderScrollHeight="192px"
//                                 pagination
//                                 highlightOnHover
//                                 progressComponent={<h5 color="primary" size="md" className="justify-self-center align-self-center"> Loader </h5>}
//                             />
//                         </div>
//                     </div>
//                     <div className="col-12 text-right pr-1 pb-2" style={{ position: 'absolute', top: '33%', right: '32%' }}></div>
//                 </div>
//                 <div className="row px-3 g-2 ">
//                     <div className={`col-12 col-md-12  pb-2 pl-0`} style={{ border: '1px solid #999', borderRadius: '6px' }}>
//                         <div className="row mb-2">
//                             <div className="col-12 pl-3">
//                                 <SubTab tabs={AgencyTabs} setShowPage={setShowPage} showPage={showPage} count={count} showCount={showCount} />
//                             </div>
//                         </div>
//                         {
//                             showPage === 'home' ?
//                                 <Home {...{
//                                      agencyId, setModalOpen, setStatus, setShowCount, setAgencyId, status, setAgencyName
//                                 }} />
//                                 :
//                                 showPage === 'Group' ?
//                                     <Group {...{ agencyId }} />
//                                     :
//                                     showPage === 'Group' ?
//                                         <Group {...{ agencyId }} />
//                                         :
//                                         showPage === 'PasswordSetting' ?
//                                             <PasswordSetting {...{ agencyId }} />
//                                             :
//                                             showPage === 'member' ?
//                                                 <Member {...{ agencyId }} />
//                                                 :
//                                                 showPage === 'division' ?
//                                                     <Division {...{ agencyId }} />
//                                                     :
//                                                     showPage === 'unit' ?
//                                                         <Unit {...{ agencyId }} />
//                                                         :
//                                                         showPage === 'personnel' ?
//                                                             <Personnel {...{ agencyId }} />
//                                                             :
//                                                             showPage === 'login' ?
//                                                                 <Login {...{ agencyId }} />
//                                                                 :
//                                                                 showPage === 'screenpermission' ?
//                                                                     <ScreenPermission {...{ agencyId }} />
//                                                                     :
//                                                                     showPage === 'lockrestrictlevel' ?
//                                                                         <LockRestrictLevel {...{ agencyId }} />
//                                                                         :
//                                                                         showPage === 'roster' ?
//                                                                             <Roster {...{ agencyId }} />
//                                                                             :
//                                                                             showPage === 'UnitAssignment' ?
//                                                                                 <UnitAssignment {...{ agencyId }} />
//                                                                                 :
//                                                                                 showPage === 'fieldsecurity' ?
//                                                                                     <FieldSecurity {...{ agencyId }} />
//                                                                                     :
//                                                                                     showPage === 'Ranks' ?
//                                                                                         <Ranks {...{ status, agencyId }} />
//                                                                                         :
//                                                                                         showPage === 'ShiftA' ?
//                                                                                             <Shift {...{ status, agencyId }} />
//                                                                                             : 
//                                                                                         showPage === 'EmergencyContact' ?
//                                                                                             <EmergencyContact {...{ agencyId }}  />
//                                                                                             :''
//                         }
//                     </div>
//                 </div>
//             </div>
//         </div>
//         {/* :
//                     <Loader/>
//             } */}
//     </>
// )
// }
// export default memo(CustomModal)