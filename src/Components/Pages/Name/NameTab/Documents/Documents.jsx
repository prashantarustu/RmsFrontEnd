import React, { useState } from 'react'
import { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Link, useLocation } from 'react-router-dom'
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Decrypt_Id_Name, getShowingDateText } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import Documents_Add_Up from './Documents_Add_Up';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import FindListDropDown from '../../../../Common/FindListDropDown';
import { NaDocumentsListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
// import Document_Add_Up from './Document_Add_Up';

const Documents = () => {

    const { get_Name_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [DocumentID, setDocumentID] = useState('');
    const [status, setStatus] = useState(false);
    const [documentEditValue, setdocumentEditValue] = useState();
    const [updateStatus, setUpdateStatus] = useState(0)
    const [modal, setModal] = useState(false)
    const [documentdata, setDocumentdata] = useState();
    const [MainIncidentID, setMainIncidentID] = useState('');
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const [MasterNameID, setMasterNameID,] = useState('');
    const [nameID, setNameID] = useState();

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", MasterNameID: '', NameID: '', Agency_Name: "", }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(parseInt(localStoreArray?.PINID));
                setMainIncidentID(parseInt(localStoreArray?.IncidentID));
                setNameID(localStoreArray?.NameID); setMasterNameID(localStoreArray?.MasterNameID);
                get_Documentdata(localStoreArray?.NameID, localStoreArray?.MasterNameID);
            }
            getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
        }
    }, [localStoreArray])

    // useEffect(() => {
    //     get_Documentdata();
    //     getScreenPermision();
    // }, [])

    const get_Documentdata = (NameID, MasterNameID) => {
        const val = { 'NameID': NameID }
        const val2 = { 'MasterNameID': MasterNameID }
        fetchPostData(openPage === 'mastername' ? 'MainMasterNameDocument/GetData_MainMasterNameDocument' : 'NameDocument/GetData_NameDocument', openPage === 'mastername' ? val2 : val).then((res) => {
            if (res) {
                setDocumentdata(res)
            } else {
                setDocumentdata([]);
            }
        })
    }

    const getScreenPermision = () => {
        // ScreenPermision("I035", Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID')).then(res => {
        //     if (res) {
        //         console.log(res);
        //         setEffectiveScreenPermission(res)
        //     } else {
        //         setEffectiveScreenPermission()
        //     }
        // });
    }

    const columns = [
        {
            width: '120px',
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
                    {/* {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={''} onClick={(e) => { set_Edit_Value(row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DocumentModal" >
                                <i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <Link to={''} onClick={(e) => { set_Edit_Value(row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DocumentModal" >
                                <i className="fa fa-edit"></i>
                            </Link>
                    } */}
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <>
                                <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={() => window.open(row?.FileAttachment)} className="btn btn-sm bg-green text-white px-1 py-0" >
                                    <i className="fa fa-eye"></i>
                                </Link>

                            </>
                            : <></>
                            :
                            <>
                                <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={() => window.open(row?.FileAttachment)} className="btn btn-sm bg-green text-white px-1 py-0" >
                                    <i className="fa fa-eye"></i>
                                </Link>

                            </>
                    }
                </div>
            </>
        },
        {
            name: 'Document Name',
            selector: (row) => row.DocFileName,
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
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 5 }}>Delete</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 4, right: 12 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <>
                                {/* <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={() => window.open(row?.FileAttachment)} className="btn btn-sm bg-green text-white px-1 py-0" >
                                    <i className="fa fa-eye"></i>
                                </Link> */}
                                <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={() => { setDocumentID(row.DocumentID) }} className="btn btn-sm bg-green text-white px-1 py-0 m/-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </Link>
                            </>
                            : <></>
                            :
                            <>
                                {/* <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={() => window.open(row?.FileAttachment)} className="btn btn-sm bg-green text-white px-1 py-0" >
                                    <i className="fa fa-eye"></i>
                                </Link> */}
                                <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={() => { setDocumentID(row.DocumentID); }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" data-toggle="modal" data-target="#DeleteModal">
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
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate('NameDocument/Delete_NameDocument', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Name_Count(nameID);
                get_Documentdata(nameID, MasterNameID);
            } else console.log("Somthing Wrong");
        })
    }

    const setStatusFalse = (e,row) => {
        setStatus(false)
        setModal(true)
        setUpdateStatus(updateStatus + 1);
        // setDocumentID(row.DocumentID)


    }

    return (
        <>
            <div className="col-md-12 mt-2">
                <div className="bg-line text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0">Documents</p>
                    <div>
                        {
                            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                                <>
                                    <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} className="btn btn-sm bg-green text-white px-2 py-0"
                                        data-toggle="modal" data-target="#DocumentModal" onClick={setStatusFalse} style={{ marginTop: '-7px' }}>
                                        <i className="fa fa-plus"></i>
                                    </Link>

                                </>
                                : <></>
                                :
                                <>
                                    <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} className="btn btn-sm bg-green text-white px-2 py-0"
                                        data-toggle="modal" data-target="#DocumentModal" onClick={setStatusFalse} style={{ marginTop: '-7px' }}>
                                        <i className="fa fa-plus"></i>
                                    </Link>
                                </>
                        }
                        <FindListDropDown
                            array={NaDocumentsListDropDownArray}
                        />
                    </div>
                </div>
                <DataTable
                    dense
                    columns={columns}
                    data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? documentdata : '' : documentdata}
                    pagination
                    highlightOnHover
                    noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
            </div>
            <Documents_Add_Up {...{ nameID, MasterNameID, LoginPinID, LoginAgencyID, get_Documentdata, updateStatus, modal, setModal, status, setStatus, DocumentID, setDocumentID,MainIncidentID }} />
            <DeletePopUpModal func={DeleteDocumentManagement} />
        </>
    )
}

export default Documents