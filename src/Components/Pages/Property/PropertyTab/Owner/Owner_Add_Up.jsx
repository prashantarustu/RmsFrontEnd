// import React, { memo, useCallback, useEffect, useState } from 'react'
// import Select from "react-select";
// import { Decrypt_Id_Name } from '../../../../Common/Utility';
// import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
// import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
// import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
// import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
// import { useContext } from 'react';
// import { AgencyContext } from '../../../../../Context/Agency/Index';
// import { Link } from 'react-router-dom';

// const Owner_Add_Up = (props) => {

//     const { get_Property_Count,changesStatus ,deleteStoreData,storeData} = useContext(AgencyContext);

//     const { masterPropertyID, propertyID, LoginPinID, LoginAgencyID, MainIncidentID, modal, setModal, status, setStatus, updateStatus, setUpdateStatus, propertyOwnerID, get_Data_Owner, ownerData } = props

//     const [Editval, setEditval] = useState();
//     const [ownerIdDrp, setOwnerIdDrp] = useState([]);

//     const [value, setValue] = useState({
//         'MasterPropertyID': '',
//         'PropertyID': '',
//         'OwnerID': '',
//         'IsDefaultOwner': '',
//         'PropertyOwnerID': '',
//         'CreatedByUserFK': '',
//     })

//     useEffect(() => {
//         setValue({ ...value, 'PropertyID': propertyID, 'CreatedByUserFK': LoginPinID, })
//     }, [propertyID, updateStatus]);


//     const [errors, setErrors] = useState({
//         'OwnerIDError': '',
//     })

//     const check_Validation_Error = (e) => {
//         if (RequiredFieldIncident(value.OwnerID)) {
//             setErrors(prevValues => { return { ...prevValues, ['OwnerIDError']: RequiredFieldIncident(value.OwnerID) } })
//         }
//     }

//     // Check All Field Format is True Then Submit 
//     const { OwnerIDError } = errors

//     useEffect(() => {
//         if (OwnerIDError === 'true') {
//             if (status) Update_Owner()
//             else Add_Owner()
//         }
//     }, [OwnerIDError])

//     useEffect(() => {
//         get_OwnerID_Drp(MainIncidentID);
//     }, [MainIncidentID])

//     useEffect(() => {
//         if (propertyOwnerID) {
//             GetSingleData(propertyOwnerID)
//         }
//     }, [updateStatus])

//     const GetSingleData = () => {
//         const val = { 'PropertyOwnerID': propertyOwnerID }
//         fetchPostData('PropertyOwner/GetSingleData_PropertyOwner', val)
//             .then((res) => {
//                 if (res) setEditval(res)
//                 else setEditval()
//             })
//     }

//     useEffect(() => {
//         if (propertyOwnerID) {
//             setValue({
//                 ...value,
//                 'PropertyOwnerID': propertyOwnerID,
//                 // 'PropertyOwnerID': Editval[0]?.PropertyOwnerID,
//                 'OwnerID': Editval[0]?.OwnerID,
//                 'IsDefaultOwner': Editval[0]?.IsDefaultOwner,
//                 'ModifiedByUserFK': LoginPinID,
//             })
//         } else {
//             setValue({
//                 ...value,
//                 'OwnerID': '',
//                 'IsDefaultOwner': '',
//             })
//         }
//     }, [Editval])

//     const get_OwnerID_Drp = (MainIncidentID) => {
//         const val = {
//             'IncidentID': MainIncidentID,
//             'MasterNameID': 0,
//         }
//         fetchPostData('Arrest/GetDataDropDown_Arrestee', val).then((res) => {
//             if (res) {
//                 setOwnerIdDrp(Comman_changeArrayFormat(res, 'NameID', 'Arrestee_Name'))
//             } else {
//                 setOwnerIdDrp([]);
//             }
//         })
//     }

//     const ChangeDropDown = (e, name) => {
//         if (e) {
//             setValue({
//                 ...value,
//                 [name]: e.value
//             })
//         } else setValue({
//             ...value,
//             [name]: null
//         })
//     }
//     const escFunction = useCallback((event) => {
//         if (event.key === "Escape") {
//             Reset()
//         }
//     }, []);

//     useEffect(() => {
//         document.addEventListener("keydown", escFunction, false);
//         return () => {
//             document.removeEventListener("keydown", escFunction, false);
//         };
//     }, [escFunction]);
//     const HandleChanges = (e) => {
//         if (e.target.name === 'IsDefaultOwner') {
//             setValue({
//                 ...value,
//                 [e.target.name]: e.target.checked
//             })
//         } else {
//             setValue({
//                 ...value,
//                 [e.target.name]: e.target.value
//             })
//         }
//     }

//     const Add_Owner = () => {
//         var result = ownerData?.find(item => {
//             if (item.OwnerID === value.OwnerID) {
//                 return true
//             } else return false
//         });
//         if (result) {
//             toastifyError('Owner Already Exists')
//             setErrors({ ...errors, ['OwnerIDError']: '', })
//         } else {
//             AddDeleteUpadate('PropertyOwner/Insert_PropertyOwner', value).then((res) => {
//                 toastifySuccess(res.Message);
//                 get_Property_Count(propertyID);
//                 get_Data_Owner(propertyID);
//                 setValue({ ...value, 'OwnerID': '', 'IsDefaultOwner': '', })
//                 setErrors({ ...errors, ['OwnerIDError']: '', })
//                 setModal(false);
//                 setStatus(false);
//             })
//         }
//     }

//     const Update_Owner = () => {
//         var result = ownerData?.find(item => {
//             if (item.PropertyOwnerID != value.PropertyOwnerID) {
//                 if (item.OwnerID === value.OwnerID) {
//                     return true
//                 } else return false
//             }
//         });
//         if (result) {
//             toastifyError('Owner Already Exists');
//             setErrors({ ...errors, ['OwnerIDError']: '', });
//         } else {
//             AddDeleteUpadate('PropertyOwner/Update_PropertyOwner', value).then((res) => {
//                 toastifySuccess(res.Message);
//                 get_Data_Owner(propertyID);
//                 setValue({ ...value, 'OwnerID': '', 'IsDefaultOwner': '', })
//                 setErrors({ ...errors, ['OwnerIDError']: '', })
//                 setModal(false);
//                 setStatus(false);
//             })
//         }
//     }

//     const Reset = () => {
//         setValue({ ...value, 'OwnerID': '', 'IsDefaultOwner': '', });
//         setErrors({ ...errors, ['OwnerIDError']: '', });
//     }

//     const closeModal = () => {
//         Reset();
//         setModal(false);
//     }

//     const colourStyles = {
//         control: (styles) => ({
//             ...styles, backgroundColor: "#fce9bf",
//             height: 20,
//             minHeight: 30,
//             fontSize: 14,
//             margintop: 2,
//             boxShadow: 0,
//         }),
//     }

//     const customStylesWithOutColor = {
//         control: base => ({
//             ...base,
//             height: 20,
//             minHeight: 30,
//             fontSize: 14,
//             margintop: 2,
//             boxShadow: 0,
//         }),
//     };

//     return (
//         <>
//             {
//                 modal ?
//                     <>
//                         <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="OwnerModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
//                             <div class="modal-dialog modal-dialog-centered modal-md" role="document" >
//                                 <div class="modal-content">
//                                     <div class="modal-body">
//                                         <div className="m-1 mt-1">
//                                             <fieldset style={{ border: '1px solid gray' }}>
//                                                 <legend style={{ fontWeight: 'bold' }}>Owner</legend>
//                                                 <div className="row">
//                                                     <div className="col-12">
//                                                         <div className="row">
//                                                             <div class="col-11 col-md-11 col-lg-11  ">
//                                                                 <div className="dropdown__box">
//                                                                     <Select
//                                                                         name='OwnerID'
//                                                                         styles={colourStyles}
//                                                                         value={ownerIdDrp?.filter((obj) => obj.value === value?.OwnerID)}
//                                                                         isClearable
//                                                                         options={ownerIdDrp}
//                                                                         onChange={(e) => ChangeDropDown(e, 'OwnerID')}
//                                                                         placeholder="Select..."
//                                                                     />
//                                                                     <label htmlFor='' >Owner</label>
//                                                                     {errors.OwnerIDError !== 'true' ? (
//                                                                         <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OwnerIDError}</span>
//                                                                     ) : null}
//                                                                 </div>
//                                                             </div>
//                                                             <div className="col-1   px-0" style={{ marginTop: '13px' }}>
//                                                                 {/* <Link to="/nametab" className="btn btn-sm bg-green text-white "
//                                                                 >
//                                                                     <i className="fa fa-plus"></i>
//                                                                 </Link> */}
//                                                                 <Link to={changesStatus ? '#' : "/nametab?page=clear"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
//                                                                     <span className='inc-plus ' 
//                                                                         onClick={() => {
//                                                                             if (!changesStatus) {
//                                                                                 // OnClose();
//                                                                                 storeData({ 'NameStatus': false });
//                                                                                 deleteStoreData({ 'NameID': '', 'MasterNameID': '' });
//                                                                             }
//                                                                         }}
//                                                                     >
//                                                                         <i className="fa fa-plus btn btn-sm bg-green text-white" style={{ fontSize: '18px' }}></i>
//                                                                     </span>
//                                                                 </Link>
//                                                             </div>
//                                                             {/* <div className="col-12 col-md-12 col-lg-12 mt-2">
//                                                                 <div class="form-check ">
//                                                                     <input class="form-check-input" type="checkbox" onChange={HandleChanges} name='IsDefaultOwner' id="IsDefaultOwner" checked={value?.IsDefaultOwner} value={value?.IsDefaultOwner} />
//                                                                     <label class="form-check-label" for="flexCheckDefault">
//                                                                         Default Owner
//                                                                     </label>
//                                                                 </div>
//                                                             </div> */}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </fieldset>
//                                         </div>
//                                     </div>
//                                     <div className="btn-box text-right  mr-1 mb-2">
//                                         {
//                                             status ?
//                                                 <>
//                                                     <button type="button" class="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error(); }}>Update</button>
//                                                 </>
//                                                 :
//                                                 <>
//                                                     <button type="button" class="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error(); }}>Save</button>
//                                                 </>
//                                         }
//                                         <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" onClick={() => { closeModal(); }}>Close</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </>
//                     :
//                     <></>
//             }
//         </>
//     )
// }

// export default memo(Owner_Add_Up)