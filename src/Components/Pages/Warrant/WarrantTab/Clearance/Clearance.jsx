import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingDateText } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import Loader from '../../../../Common/Loader';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import Clearance_Add_Up from './Clearance_Add_Up';

const Clearance = () => {

    const { get_Warrent_Count, localStoreArray, get_LocalStorage } = useContext(AgencyContext)
    const [CommentData, setCommentData] = useState([])
    const [WarrantClearanceID, setWarrantClearanceID] = useState('')
    const [upDateCount, setUpDateCount] = useState(0)
    const [status, setStatus] = useState(false)
    const [modal, setModal] = useState(false);
    const [loder, setLoder] = useState(false)
    //screen permission 
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [dispositionData, setDispositionData] = useState([])
    const [WarrantID, setWarrentID] = useState('');
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');
    const [MainIncidentID, setMainIncidentID] = useState('');
    const [userName, setUserName] = useState('')

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', WarrantID: '', UserName: '' }),
    }

    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                setMainIncidentID(localStoreArray?.IncidentID);
                setUserName(localStoreArray?.UserName)
                if (localStoreArray?.WarrantID) {
                    setWarrentID(localStoreArray?.WarrantID); get_DispositionData(localStoreArray?.WarrantID)
                } else {
                    setWarrentID('');
                }
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])


    const get_DispositionData = (WarrantID) => {
        const val = {
            'WarrantID': WarrantID,
        }
        fetchPostData('WarrantClearance/GetData_WarrantClearance', val)
            .then(res => {
                if (res) {

                    setDispositionData(res);
                } else {
                    setDispositionData([]);
                }
            })
    }


    const getScreenPermision = (LoginAgencyID, LoginPinID) => {
        ScreenPermision("I033", LoginAgencyID, LoginPinID).then(res => {
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
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={''} onClick={(e) => editComments(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#ClearanceModal" >
                                <i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <Link to={''} onClick={(e) => editComments(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#ClearanceModal" >
                                <i className="fa fa-edit"></i>
                            </Link>
                    }
                </div>
            </>
        },

        {
            name: 'Date',
            selector: (row) => getShowingDateText(row.ClearanceDateTime),
            sortable: true
        },
        {
            name: 'By Pin',
            selector: (row) => row.OfficerName,
            sortable: true
        },
        {
            name: 'Dispositions',
            selector: (row) => row.Description,
            sortable: true
        },
        {
            name: 'Comment',
            selector: (row) => row.Remarks,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, right: 5 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} onClick={(e) => setWarrantClearanceID(row.WarrantClearanceID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={`#`} onClick={(e) => setWarrantClearanceID(row.WarrantClearanceID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                    }
                </div>
            </>
        }
    ]

    const editComments = (e, val) => {
        get_Warrent_Count(val.WarrantID)
        e.preventDefault();
        setWarrantClearanceID(val.WarrantClearanceID);
        setUpDateCount(upDateCount + 1);
        setStatus(true)
        setModal(true);
    }

    const DeleteClearance = () => {
        const val = {
            'WarrantClearanceID': WarrantClearanceID,
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate('WarrantClearance/Delete_WarrantClearance', val).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message);
                get_DispositionData(WarrantID)
                get_Warrent_Count(WarrantID)
            } else console.log("Somthing Wrong");
        })
    }

    return (
        <>
            <div className="col-md-12 mt-2">
                <div className="row">
                    <div className="col-md-12">
                        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0">Clearance</p>
                            <p className="p-0 m-0">
                                {/* <Link to="" className="text-white">
                                    <i className="fa fa-filter mr-2"></i>
                                </Link>
                                <Link to="" className="text-white">
                                    <i className="fa fa-print mr-2"></i>
                                </Link> */}
                                {
                                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                                        <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                                            onClick={() => { setStatus(false); setModal(true); setUpDateCount(upDateCount + 1) }}
                                            data-toggle="modal" data-target="#ClearanceModal">
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                        : <></>
                                        : <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                                            onClick={() => { setStatus(false); setModal(true); setUpDateCount(upDateCount + 1) }}
                                            data-toggle="modal" data-target="#ClearanceModal">
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                }
                            </p>
                        </div>
                        <div className="col-12 ">
                            {
                                // loder ?

                                <DataTable
                                    dense
                                    columns={columns}
                                    data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? dispositionData : '' : dispositionData}
                                    pagination
                                    selectableRowsHighlight
                                    highlightOnHover
                                    noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                />
                                // :
                                // <Loader />
                            }
                        </div>
                    </div>
                </div>
            </div>
            <DeletePopUpModal func={DeleteClearance} />
            <Clearance_Add_Up {...{ upDateCount, WarrantClearanceID, get_DispositionData, status, dispositionData, modal, setModal, CommentData, LoginPinID, LoginAgencyID, WarrantID, }} />
        </>
    )
}
export default Clearance;