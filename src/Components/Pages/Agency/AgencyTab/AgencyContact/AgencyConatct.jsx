import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link, useLocation } from 'react-router-dom'
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { AddDeleteUpadate, ScreenPermision, fetchPostData } from '../../../../hooks/Api';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useContext } from 'react';
import AgencyContactAddUpp from './AgencyContact_Add_Up';


const AgencyContact = ({ aId }) => {

    const { get_CountList, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    // const useQuery = () => new URLSearchParams(useLocation().search);
    // let aId = useQuery().get('id').split(" ", 3)[0].split("/", 1)[0].substring(10,);

    const [agencyContactData, setAgencyContactData] = useState();
    const [agencyContactEditData, setAgencyContactEditData] = useState();
    const [updateID, setUpdateID] = useState('')
    const [status, setStatus] = useState(false)
    const [agencyContactId, setAgencyContactId] = useState()
    const [modal, setModal] = useState(false)
    const [relationUpdStatus, setRelationUpdStatus] = useState(0)
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
    const [pinId, setPinID] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", LocalAgencyID: "", }),
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
                setPinID(localStoreArray?.PINID);
                get_Agency_Contact_data(aId);
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])


    // useEffect(() => {
    //     get_Agency_Contact_data(aId); getScreenPermision(aId, pinId);
    // }, [aId])

    const get_Agency_Contact_data = (aId) => {
        const val = {
            'AgencyID': aId,
        }
        fetchPostData('AgencyEmergencyContact/GetDataAgency_EmergencyContact', val).then((res) => {
            if (res) {
                setAgencyContactData(res)
                // console.log("thi is AgencyContact",res)
            }
        })
    }

    // Get Effective Screeen Permission
    const getScreenPermision = (aId, pinId) => {
        ScreenPermision("A027", aId, pinId).then(res => {
            if (res) setEffectiveScreenPermission(res)
            else setEffectiveScreenPermission()
        });
    }

    // Table Columns Array
    const Columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={`/agencyTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`} onClick={(e) => { getAgencyContEditData(e, row); }} data-toggle="modal" data-target="#AgencyContact"
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1"><i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <></>
                    }
                </div>
            </>
        },
        {
            name: 'First Name',
            selector: (row) => row.FirstName,
            sortable: true
        },
        {
            name: 'Last Name',
            selector: (row) => row.LastName,
            sortable: true
        },
        {
            name: 'Phone 1',
            selector: (row) => row.Phone1,
            sortable: true
        },
        {
            name: 'Phone 2',
            selector: (row) => row.Phone2,
            sortable: true
        },
        {
            name: 'Cell',
            selector: (row) => row.Cell,
            sortable: true
        },
        {
            name: 'Fax',
            selector: (row) => row.Fax,
            sortable: true
        },
        {
            name: 'Email',
            selector: (row) => row.Email,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>

                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`/agencyTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`} onClick={(e) => { setAgencyContactId(row.AgencyEmergencyID) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <></>
                    }

                </div>
            </>

        }
    ]

    const getAgencyContEditData = (e, row) => {
        setAgencyContactEditData(row)
        setUpdateID(row.AgencyEmergencyID)
        setModal(true); setRelationUpdStatus(relationUpdStatus + 1)
        setStatus(true)
        // console.log("this is row",row)
    }

    const set_Status = () => {
        setStatus(false)
        setModal(true)
        // setDivisionEditValue()
    }

    // Delete Division Function
    const delete_Agency_Contact = async (e) => {
        e.preventDefault()
        const value = {
            AgencyEmergencyID: agencyContactId,
            DeletedByUserFK: pinId,
            // DeletedByUserFK: Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
        }
        AddDeleteUpadate('AgencyEmergencyContact/DeleteAgency_EmergencyContact', value).then((data) => {
            if (data.success) {
                toastifySuccess(data.Message)
                get_Agency_Contact_data(aId);
                get_CountList(aId)
            } else {
                alert(data.Message)
            }
        });
    }

    return (
        <>
            <div className="row px-3">
                <div className="col-12 pt-2 p-0">
                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0 d-flex align-items-center">
                            Agency Contact
                        </p>
                        <button
                            className="btn btn-sm bg-green text-white px-2 py-0" onClick={() => { setUpdateID(''); set_Status(); }} data-toggle="modal" data-target="#AgencyContact" >
                            <i className="fa fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div className="col-12">

                    <DataTable
                        columns={Columns}
                        data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? agencyContactData : "" : agencyContactData}
                        dense
                        // paginationPerPage={'5'}
                        paginationRowsPerPageOptions={[10, 15]}
                        // fixedHeader
                        // fixedHeaderScrollHeight="195px" 
                        highlightOnHover
                        noContextMenu
                        pagination
                        responsive
                        subHeaderAlign="right"
                        subHeaderWrap
                        noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    />
                </div>
            </div>
            <AgencyContactAddUpp {...{ aId, pinId, get_Agency_Contact_data, agencyContactEditData, relationUpdStatus, updateID, modal, setModal, agencyContactData, status, setStatus }} />
            <DeletePopUpModal func={delete_Agency_Contact} />
        </>
    )
}

export default AgencyContact