import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Address_Add_Up from './Address_Add_Up'
import DataTable from 'react-data-table-component'
import { useState } from 'react'
import { useEffect } from 'react'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { Decrypt_Id_Name, getShowingDateText, getShowingWithOutTime } from '../../../../Common/Utility'
import DeletePopUpModal from '../../../../Common/DeleteModal'
import { toastifySuccess } from '../../../../Common/AlertMsg'
import { useContext } from 'react'
import { AgencyContext } from '../../../../../Context/Agency/Index'

const Address = () => {

    const { get_Name_Count, NameID, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    //screen permission 
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
    const [addressData, setAddressData] = useState([]);
    const [status, setStatus] = useState(false);
    const [modal, setModal] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0);
    const [NameAddressID, setNameAddressID] = useState('');

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
                if (localStoreArray?.NameID && localStoreArray?.MasterNameID) {
                    Get_ContactDetailsData(localStoreArray?.NameID, localStoreArray?.MasterNameID);
                }
            }
        }
    }, [localStoreArray])

    // useEffect(() => {
    //     Get_ContactDetailsData();
    // }, [])

    const Get_ContactDetailsData = (NameID, MasterNameID) => {
        const val = {
            'NameID': NameID,
            'MasterNameID': openPage ? MasterNameID : 0,
        }
        fetchPostData('NameAddress/GetData_NameAddress', val).then((res) => {
            if (res) {
                // console.log(res)
                setAddressData(res)
            } else {
                setAddressData();
            }
        })
    }

    const columns = [
        {
            width: '100px',
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={'#'} onClick={(e) => set_Edit_Value(row)} data-toggle="modal" data-target="#AddressModal" className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                                <i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <Link to={'#'} onClick={(e) => set_Edit_Value(row)} data-toggle="modal" data-target="#AddressModal" className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                                <i className="fa fa-edit"></i>
                            </Link>
                    }
                </div>
                {/* {
                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                        <Link to={`#`} onClick={(e) => setNameAddressID(row.NameAddressID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                            <i className="fa fa-trash"></i>
                        </Link>
                        : <></>
                        : <Link to={`#`} onClick={(e) => setNameAddressID(row.NameAddressID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                            <i className="fa fa-trash"></i>
                        </Link>
                } */}
            </>
        },
        {
            width: '500px',
            name: 'Address',
            // selector: (row) => row.Address,
            selector: (row) => <>{row?.Address ? row?.Address.substring(0, 70) : ''}{row?.Address?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'Address Type',
            selector: (row) => row.AddressFlags,
            sortable: true
        },
        {
            name: 'Address From',
            selector: (row) => row.DateFrom ? getShowingWithOutTime(row.DateFrom) : '',
            sortable: true
        },
        // {
        //     name: 'AddressTO',
        //     selector: (row) => row.AddressTO,
        //     sortable: true
        // },
        // {
        //     name: 'MiddleName',
        //     selector: (row) => row.MiddleName,
        //     sortable: true
        // },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, right: 0 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} onClick={(e) => setNameAddressID(row.NameAddressID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={`#`} onClick={(e) => setNameAddressID(row.NameAddressID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                    }
                </div>
            </>
        }
    ]

    const set_Edit_Value = (row) => {
        // console.log(row)
        setModal(true);
        setStatus(true);
        get_Name_Count(row.NameID);
        setUpdateStatus(updateStatus + 1);
        setNameAddressID(row.NameAddressID);

    }

    const DeleteContactDetail = () => {
        const val = {
            'NameAddressID': NameAddressID,
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate('NameAddress/Delete_NameAddress', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                Get_ContactDetailsData(nameID, MasterNameID);
                setNameAddressID('')
            } else {
                console.log("Somthing Wrong");
                setNameAddressID('')
            }
            Get_ContactDetailsData(nameID, MasterNameID);
            get_Name_Count(nameID);
        })
    }

    const setStatusFalse = (e) => {
        setStatus(false); setModal(true);
        setNameAddressID('');
        setUpdateStatus(updateStatus + 1);

    }

    return (
        <>
            <div className="col-12 col-md-12 pt-2 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Address</p>
                    <div style={{ marginLeft: 'auto' }}>
                        <Link to='' onClick={setStatusFalse} className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#AddressModal">
                            <i className="fa fa-plus"></i>
                        </Link>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-12 ">
                        <DataTable
                            dense
                            data={addressData}
                            columns={columns}
                            pagination
                            selectableRowsHighlight
                            highlightOnHover
                        />
                    </div>
                </div>
            </div>
            <Address_Add_Up {...{ nameID, MasterNameID, LoginPinID, LoginAgencyID, modal, setModal, NameAddressID, setNameAddressID, updateStatus, Get_ContactDetailsData, status, setStatus, }} />
            <DeletePopUpModal func={DeleteContactDetail} />
        </>
    )
}

export default Address
