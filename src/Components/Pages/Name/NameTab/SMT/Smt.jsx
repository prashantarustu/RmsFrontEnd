import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import { useEffect } from 'react';
import { Decrypt_Id_Name, getShowingDateText } from '../../../../Common/Utility';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import Smt_Add_Up from './Smt_Add_Up';
import { NaSMTListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../../Common/FindListDropDown';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Smt = () => {

    const { get_Name_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);
    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    const [SmtData, setSmtData] = useState();
    const [status, setStatus] = useState(false);
    const [modal, setModal] = useState(false)
    const [updateStatus, setUpdateStatus] = useState(0)
    const [smtId, setSmtId] = useState();
    //screen permission 
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
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
                setNameID(localStoreArray?.NameID); setMasterNameID(localStoreArray?.MasterNameID);
                get_Smt_Data(localStoreArray?.NameID, localStoreArray?.MasterNameID);
            }
        }
    }, [localStoreArray])

    // useEffect(() => {
    //     get_Smt_Data();
    // }, [])

    const get_Smt_Data = (NameID, MasterNameID) => {
        const val = {
            'NameID': NameID,
        }
        const req = {
            'MasterNameID': MasterNameID,
        }
        fetchPostData(openPage === 'mastername' ? 'MainMasterNameSMT/GetData_MainMasterNameSMT' : 'NameSMT/GetData_NameSMT', openPage === 'mastername' ? req : val).then((res) => {
            if (res) {
                setSmtData(res)
            } else {
                setSmtData([]);
            }
        })
    }

    const getScreenPermision = () => {
        //   ScreenPermision("O041", Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID')).then(res => {
        //     if (res) {
        //       setEffectiveScreenPermission(res)
        //     } else {
        //       setEffectiveScreenPermission()
        //     }
        //   });
    }

    const columns = [
        {
            width: '120px',
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#SMTModal" >
                                <i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#SMTModal" >
                                <i className="fa fa-edit"></i></Link>
                    }

                </div>
            </>
        },
        {
            name: 'SMT Type',
            selector: (row) => <>{row?.SMTType_Description} </>,
            sortable: true
        },
        {
            name: 'SMT Location',
            selector: (row) => <>{row?.SMTLocation_Description} </>,
            sortable: true
        },
        {
            name: 'Description',
            selector: (row) => <>{row?.SMT_Description ? row?.SMT_Description.substring(0, 50) : ''}{row?.SMT_Description?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 3 }}>Delete</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 4, right: 7 }}>
                    {/* {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#SMTModal" >
                                <i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#SMTModal" >
                                <i className="fa fa-edit"></i></Link>
                    } */}
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={() => { setSmtId(row.SMTID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={() => { setSmtId(row.SMTID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                    }
                </div>
            </>
        }
    ]

    const set_Edit_Value = (e, row) => {
        setStatus(true);
        setModal(true)
        setUpdateStatus(updateStatus + 1);
        setSmtId(row.SMTID);
    }

    const DeleteCourtDisposition = () => {
        const val = {
            'SMTID': smtId,
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate('NameSMT/Delete_NameSMT', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Name_Count(nameID);
                get_Smt_Data(nameID, MasterNameID); setSmtId('');
            } else console.log("Somthing Wrong");
        })
    }

    const setStatusFalse = (e) => {
        setStatus(false); setModal(true); setSmtId();
        setUpdateStatus(updateStatus + 1);

    }

    return (
        <>
            <div className="col-md-12 mt-2">
                <div className="bg-line text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">
                        SMT
                    </p>
                    <div>
                        {
                            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                                <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} className="btn btn-sm bg-green text-white px-2 py-0" onClick={setStatusFalse}
                                    data-toggle="modal" data-target="#SMTModal" style={{ marginTop: '-7px' }}>
                                    <i className="fa fa-plus"></i>
                                </Link>
                                : <></>
                                : <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} className="btn btn-sm bg-green text-white px-2 py-0" onClick={setStatusFalse}
                                    data-toggle="modal" data-target="#SMTModal" style={{ marginTop: '-7px' }}>
                                    <i className="fa fa-plus"></i>
                                </Link>
                        }
                        <FindListDropDown
                            array={NaSMTListDropDownArray}
                        />
                    </div>
                </div>
                <DataTable
                    dense
                    columns={columns}
                    data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? SmtData : '' : SmtData}
                    pagination
                    highlightOnHover
                    noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
            </div>
            <DeletePopUpModal func={DeleteCourtDisposition} />
            <Smt_Add_Up {...{ nameID, MasterNameID, LoginPinID, LoginAgencyID, status, setStatus, setSmtId, smtId, modal, setModal, get_Smt_Data, updateStatus }} />
        </>
    )
}

export default Smt