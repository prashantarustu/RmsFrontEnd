import React, { useState } from 'react'
import { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom'
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Decrypt_Id_Name, getShowingDateText } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import Document_Add_Up from './Document_Add_Up';
import { VeDocumentListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../../Common/FindListDropDown';
import Loader from '../../../../Common/Loader';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';


const Document = () => {

    const { get_vehicle_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    // const { get_vehicle_Count} = useContext(AgencyContext)
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
    const [VehicleDocID, setVehicleDocID] = useState();
    const [status, setStatus] = useState(false);
    const [documentEditValue, setdocumentEditValue] = useState();
    const [updateStatus, setUpdateStatus] = useState(0);
    const [modal, setModal] = useState(false);
    const [documentdata, setDocumentdata] = useState();
    const [loder, setLoder] = useState(false);

    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [vehicleID, setVehicleID] = useState('');
    const [LoginPinID, setLoginPinID] = useState('');
    const [MainIncidentID, setMainIncidentID] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', VehicleID: '', }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(parseInt(localStoreArray?.PINID));
                setMainIncidentID(parseInt(localStoreArray?.IncidentID));
                if (localStoreArray?.VehicleID) {
                    setVehicleID(localStoreArray?.VehicleID);
                    get_Documentdata(localStoreArray?.VehicleID);
                } else {
                    setVehicleID('');
                }
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    const get_Documentdata = (vehicleID) => {
        const val = {
            'VehicleID': vehicleID,
        }
        fetchPostData('VehicleDocument/GetData_VehicleDocument', val).then((res) => {
            if (res) {
                setDocumentdata(res); setLoder(true)
            } else {
                setDocumentdata([]); setLoder(true)
            }
        })
    }

    // const getScreenPermision = () => {
    //     ScreenPermision("I035", Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID')).then(res => {
    //         if (res) {
    //             setEffectiveScreenPermission(res)
    //         } else {
    //             setEffectiveScreenPermission([])
    //         }
    //     });
    // }

    const getScreenPermision = () => {
        ScreenPermision("I035", LoginAgencyID, LoginPinID).then(res => {
            if (res) {
                setEffectiveScreenPermission(res)
            } else {
                setEffectiveScreenPermission([])
            }
        });
    }

    const columns = [
        {
            width: '120px',
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
                    {/* {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} onClick={() => { setVehicleID(row.VehicleID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={`#`} onClick={() => { setVehicleID(row.VehicleID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                    } */}
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <>
                                <Link to={`#`} onClick={() => window.open(row?.FileAttachment)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" >
                                    <i className="fa fa-eye"></i>
                                </Link>
                                {/* <Link to={`#`} onClick={() => { setVehicleDocID(row.VehicleDocID) }} className="btn btn-sm bg-green text-white px-1 py-0 m/-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </Link> */}
                            </>
                            : <></>
                            :
                            <>
                                <Link to={`#`} onClick={() => window.open(row?.FileAttachment)} className="btn btn-sm bg-green text-white px-1 py-0" >
                                    <i className="fa fa-eye"></i>
                                </Link>
                                {/* <Link to={`#`} onClick={() => { setVehicleDocID(row.VehicleDocID);  }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </Link> */}
                            </>
                    }
                </div>
            </>
        },
        {
            name: 'Document Name',
            selector: (row) => row.DocumentName,
            sortable: true
        },
        {
            name: 'Document Type',
            selector: (row) => row.DocumentType_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 5 }}>Delete</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 4, right: 12 }}>
                    {/* {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} onClick={() => { setVehicleID(row.VehicleID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={`#`} onClick={() => { setVehicleID(row.VehicleID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                    } */}
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <>
                                {/* <Link to={`#`} onClick={() => window.open(row?.FileAttachment)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" >
                                    <i className="fa fa-eye"></i>
                                </Link> */}
                                <Link to={`#`} onClick={() => { setVehicleDocID(row.VehicleDocID) }} className="btn btn-sm bg-green text-white px-1 py-0 m/-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </Link>
                            </>
                            : <></>
                            :
                            <>
                                {/* <Link to={`#`} onClick={() => window.open(row?.FileAttachment)} className="btn btn-sm bg-green text-white px-1 py-0" >
                                    <i className="fa fa-eye"></i>
                                </Link> */}
                                <Link to={`#`} onClick={() => { setVehicleDocID(row.VehicleDocID); }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </Link>
                            </>
                    }
                </div>
            </>
        }
    ]

    // const set_Edit_Value = (row) => {
    //     setStatus(true);
    //     setVehicleDocID(row.VehicleDocID)
    //     setUpdateStatus(updateStatus + 1);
    //     setModal(true)
    // }

    const DeleteDocumentManagement = () => {
        const val = {
            'VehicleDocID': VehicleDocID,
            // 'DeletedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate('VehicleDocument/Delete_VehicleDocument', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_vehicle_Count(vehicleID)
                get_Documentdata(vehicleID);
            } else console.log("Somthing Wrong");
        })
    }

    const setStatusFalse = (e, row) => {
        setStatus(false)
        setModal(true)
        setUpdateStatus(updateStatus + 1);
        // setVehicleDocID(row.VehicleDocID);
    }


    return (
        <>
            <div className="col-md-12 mt-1 p-0">
                <div className="row">
                    <div className="col-md-12">
                        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0">Document</p>
                            <p className="p-0 m-0">
                                {
                                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                                        <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                                            data-toggle="modal" data-target="#DocumentModal" onClick={setStatusFalse} style={{ marginTop: '-6px' }}>
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                        : <></>
                                        : <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                                            data-toggle="modal" data-target="#DocumentModal" onClick={setStatusFalse} style={{ marginTop: '-6px' }}>
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                }
                                <FindListDropDown
                                    array={VeDocumentListDropDownArray}
                                />
                            </p>
                        </div>
                    </div>
                    <div className="col-12">
                        {
                            loder ?
                                <DataTable
                                    dense
                                    columns={columns}
                                    data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? documentdata : '' : documentdata}
                                    pagination
                                    highlightOnHover
                                    noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                />
                                :
                                <Loader />
                        }
                    </div>
                </div>
            </div>
            <Document_Add_Up {...{ vehicleID, LoginPinID, LoginAgencyID, get_Documentdata, updateStatus, modal, setModal, status, setStatus, VehicleDocID, setVehicleDocID }} />
            <DeletePopUpModal func={DeleteDocumentManagement} />
        </>
    )
}

export default Document