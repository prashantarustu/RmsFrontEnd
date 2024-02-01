import React, { useState } from 'react'
import { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom'
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Decrypt_Id_Name, getShowingDateText } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import Document_Add_Up from './Document_Add_Up';
import { IncDocumentListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../../Common/FindListDropDown';
import Loader from '../../../../Common/Loader';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';


const DocumentManagement = () => {

    const { get_IncidentTab_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    const [DocumentID, setDocumentID] = useState('');
    const [status, setStatus] = useState(false);
    const [documentEditValue, setdocumentEditValue] = useState();
    const [updateStatus, setUpdateStatus] = useState(0)
    const [modal, setModal] = useState(false)
    const [documentdata, setDocumentdata] = useState();
    const [loder, setLoder] = useState(false);
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState([]);

    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [incidentID, setIncidentID] = useState('');
    const [LoginPinID, setLoginPinID] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '' }),
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
                setIncidentID(parseInt(localStoreArray?.IncidentID));
                get_Documentdata(localStoreArray?.IncidentID);
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    // useEffect(() => {
    //     get_Documentdata();
    //     getScreenPermision();
    // }, [])

    const get_Documentdata = (incidentID) => {
        const val = {
            'IncidentId': incidentID
        }
        fetchPostData('IncidentDocumentManagement/GetData_IncidentDocManagement', val).then((res) => {
            if (res) {
                setDocumentdata(res); setLoder(true)
            } else {
                setDocumentdata([]); setLoder(true)
            }
        })
    }

    const getScreenPermision = (LoginAgencyID, LoginPinID) => {
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
                    <Link to={`#`} onClick={() => window.open(row?.DocumentFile)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" >
                        <i className="fa fa-eye"></i>
                    </Link>
                </div>
            </>
        },
        {
            name: 'Document Name',
            selector: (row) => row.DocumentName,
            sortable: true
        },
        {
            name: 'Notes',
            selector: (row) => row.DocumentNotes,
            sortable: true
        },
        {
            name: 'Document Type',
            selector: (row) => row.DocumentType_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 0 }}>Delete</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 4, right: 8 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <>
                                <Link to={`#`} onClick={() => { setDocumentID(row.DocumentID) }} className="btn btn-sm bg-green text-white px-1 py-0 m/-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </Link>
                            </>
                            :
                            <></>
                            :
                            <>
                                <Link to={`#`} onClick={() => { setDocumentID(row.DocumentID); }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </Link>
                            </>
                    }
                </div>
            </>
        }
    ]

    const set_Edit_Value = (row) => {
        setStatus(true);
        setDocumentID(row.DocumentID)
        setUpdateStatus(updateStatus + 1);
        setModal(true)
    }

    const DeleteDocumentManagement = () => {
        const val = {
            'DocumentID': DocumentID,
            'IsActive': '0',
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate('IncidentDocumentManagement/Delete_IncidentDocManagement', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_IncidentTab_Count(incidentID);
                get_Documentdata(incidentID);
            } else console.log("Somthing Wrong");
        })
    }

    const setStatusFalse = (e) => {
        setStatus(false);
        setModal(true);
        setUpdateStatus(updateStatus + 1);
    }

    return (
        <>
            <div className="col-md-12 mt-2">
                <div className="row">
                    <div className="col-md-12">
                        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0">Document</p>
                            <div>
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
                                    array={IncDocumentListDropDownArray}
                                />
                            </div>
                        </div>
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
            <Document_Add_Up {...{ LoginPinID, incidentID, LoginAgencyID, get_Documentdata, updateStatus, modal, setModal, status, setStatus, DocumentID, setDocumentID, documentdata }} />
            <DeletePopUpModal func={DeleteDocumentManagement} />
        </>
    )
}

export default DocumentManagement