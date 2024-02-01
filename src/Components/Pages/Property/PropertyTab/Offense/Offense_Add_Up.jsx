// import React, { memo, useCallback, useContext, useEffect, useState } from 'react'
// import Select from "react-select";
// import { Decrypt_Id_Name } from '../../../../Common/Utility';
// import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
// import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
// import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
// import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
// import { AgencyContext } from '../../../../../Context/Agency/Index';

// const Offense_Add_Up = (props) => {

//     const { get_Property_Count } = useContext(AgencyContext)

//     const { masterPropertyID, propertyID, LoginPinID, LoginAgencyID, MainIncidentID, modal, setModal, status, setStatus, updateStatus, setUpdateStatus, propertyOffenseID, get_Data_Owner, ownerData } = props

//     const [Editval, setEditval] = useState();
//     const [ownerIdDrp, setOwnerIdDrp] = useState([]);

//     const [value, setValue] = useState({
//         'MasterPropertyID': '',
//         'PropertyID': '',
//         'OffenseID': '',
//         'IncidentID': '',
//         'CreatedByUserFK': '',
//     })

//     useEffect(() => {
//         setValue({ ...value, 'IncidentID': MainIncidentID, 'PropertyID': propertyID, 'CreatedByUserFK': LoginPinID, 'MasterPropertyID': masterPropertyID, })
//     }, [propertyID, updateStatus]);

//     const [errors, setErrors] = useState({
//         'OwnerIDError': '',
//     })

//     const check_Validation_Error = (e) => {
//         if (RequiredFieldIncident(value.OffenseID)) {
//             setErrors(prevValues => { return { ...prevValues, ['OwnerIDError']: RequiredFieldIncident(value.OffenseID) } })
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
//         if (MainIncidentID) {
//             get_OwnerID_Drp(MainIncidentID);
//         }
//     }, [MainIncidentID])

//     const Reset = () => {
//         setValue({
//             ...value,
//             'OffenseID': '',
//         })
//         setErrors({
//             ...errors,
//             ['OwnerIDError']: '',
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

//     useEffect(() => {
//         if (propertyOffenseID && status) {
//             GetSingleData(propertyOffenseID)
//         }
//     }, [propertyOffenseID])

//     const GetSingleData = (propertyOffenseID) => {
//         const val = { 'propertyOffenseID': propertyOffenseID }
//         fetchPostData('PropertyOffense/GetSingleData_PropertyOffense', val)
//             .then((res) => {
//                 if (res)
//                     setEditval(res)
//                 else setEditval()
//             })
//     }

//     useEffect(() => {
//         if (propertyOffenseID) {
//             setValue({
//                 ...value,
//                 'PropertyOffenseID': propertyOffenseID,
//                 'OffenseID': Editval[0]?.OffenseID,
//                 'ModifiedByUserFK': LoginPinID,
//             })
//         } else {
//             setValue({
//                 ...value,
//                 'OffenseID': '',
//             })
//         }
//     }, [Editval])

//     const get_OwnerID_Drp = (MainIncidentID) => {
//         const val = {
//             'IncidentID': MainIncidentID,
//             'OffenseID': 0,
//         }
//         // console.log(val);
//         fetchPostData('PropertyOffense/GetDataDropDown_PropertyOffense', val).then((res) => {
//             if (res) {
//                 // console.log(res);
//                 setOwnerIdDrp(Comman_changeArrayFormat(res, 'CrimeID', 'Offense_Description'))
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
//             if (item.OffenseID === value.OffenseID) {
//                 return true
//             } else return false
//         });
//         if (result) {
//             toastifyError('Offence Already Exists');
//             setErrors({
//                 ...errors,
//                 ['OwnerIDError']: '',
//             })
//         } else if (value.OffenseID !== '') {
//             AddDeleteUpadate('PropertyOffense/Insert_PropertyOffense', value).then((res) => {
//                 toastifySuccess(res.Message);
//                 get_Property_Count(propertyID);
//                 get_Data_Owner(propertyID);
//                 get_OwnerID_Drp(MainIncidentID);
//                 Reset();
//                 setErrors({ ...errors, ['OwnerIDError']: '', })
//                 setModal(false);
//                 setStatus(false);
//             })
//         } else {
//             toastifyError('Offence Can`t be empty')
//             setErrors({
//                 ...errors,
//                 ['OwnerIDError']: '',
//             })
//         }
//     }

//     const Update_Owner = () => {
//         var result = ownerData?.find(item => {
//             if (item.OffenseID !== value.OffenseID) {
//                 return false
//             } else return true
//         });
//         if (result) {
//             toastifyError('Offence Already Exists');
//             setErrors({
//                 ...errors,
//                 ['OwnerIDError']: '',
//             })
//         } else if (value.OffenseID !== '') {
//             AddDeleteUpadate('PropertyOffense/Update_PropertyOffense', value).then((res) => {
//                 toastifySuccess(res.Message);
//                 get_Data_Owner(propertyID);
//                 get_OwnerID_Drp(MainIncidentID);
//                 Reset();
//                 setErrors({
//                     ...errors,
//                     ['OwnerIDError']: '',
//                 })
//                 setModal(false);
//                 setStatus(false);
//             })
//         } else {
//             toastifyError('Offence Can`t be empty');
//             setErrors({
//                 ...errors,
//                 ['OwnerIDError']: '',
//             })
//         }
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
//                                                 <legend style={{ fontWeight: 'bold' }}>Offense</legend>
//                                                 <div className="row">
//                                                     <div className="col-12">
//                                                         <div className="row">
//                                                             <div class="col-12 col-md-12 col-lg-12  ">
//                                                                 <div className="dropdown__box">
//                                                                     <Select
//                                                                         name='OffenseID'
//                                                                         styles={colourStyles}
//                                                                         value={ownerIdDrp?.filter((obj) => obj.value === value?.OffenseID)}
//                                                                         isClearable
//                                                                         options={ownerIdDrp}
//                                                                         onChange={(e) => ChangeDropDown(e, 'OffenseID')}
//                                                                         placeholder="Select..."
//                                                                     />
//                                                                     <label htmlFor='' >Offense</label>
//                                                                     {errors.OwnerIDError !== 'true' ? (
//                                                                         <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OwnerIDError}</span>
//                                                                     ) : null}
//                                                                 </div>
//                                                             </div>

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

// export default memo(Offense_Add_Up)