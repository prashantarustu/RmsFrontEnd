// Import Component
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AddDeleteUpadate, fetchData, fetchPostData, ScreenPermision } from '../../../../hooks/Api';
import Group_Add_Up from './Group_Add_Up'
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';


const Group = ({ getAgency_List }) => {

    const { get_CountList, localStoreArray, setLocalStoreArray, getAgency, get_LocalStorage, } = useContext(AgencyContext);
    // Hooks Initialization
    const [groupList, setGroupList] = useState([]);
    const [application, setAppliation] = useState([]);
    const [applicationId, setAppliationId] = useState('');
    const [groupEditData, setGroupEditData] = useState([]);
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
    const [status, setStatus] = useState(false);
    const [modal, setModal] = useState(false);
    const [updateCount, setUpdateCount] = useState(0);
    // open Model
    const [groupId, setGroupID] = useState();
    const [pinId, setPinID] = useState('');
    const [allowMultipleLogin, setAllowMultipleLogin] = useState('');

    const useQuery = () => new URLSearchParams(useLocation().search);
    let aId = useQuery().get('id').split(" ", 3)[0].split("/", 1)[0].substring(10,);

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
            if (localStoreArray.AgencyID && localStoreArray.PINID) {
                application_List();
                setPinID(localStoreArray?.PINID);
                get_Group_List(aId);
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    // Onload Function
    // useEffect(() => {
    //     if (aId) {
    //         application_List();
    //         get_Group_List(aId);
    //         getScreenPermision(aId, pinId);
    //     }
    // }, [aId])

    // Get Group List
    const get_Group_List = (aId) => {
        const value = {
            AgencyId: aId
        }
        fetchPostData("Group/GetData_Group", value).then((res) => {
            if (res) {
                setGroupList(res)
            } else setGroupList()
        })
    }

    // Get Effective Screeen Permission
    const getScreenPermision = (aId, pinId) => {
        ScreenPermision("A002", aId, pinId).then(res => {
            if (res) setEffectiveScreenPermission(res)
            else setEffectiveScreenPermission()
        });
    }

    // Get Appliction List 
    const application_List = () => {
        fetchData("DropDown/GetData_Application").then((data) => {
            if (data) setAppliation(data)
            else setAppliation()
        })
    }

    // // Table Columns Array
    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        EffectiveScreenPermission ?
                            EffectiveScreenPermission[0]?.Changeok ?
                                <Link to={`#`} data-toggle="modal" data-target="#GroupModal" onClick={(e) => set_Edit_Value(e, row)}
                                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1"><i className="fa fa-edit"></i></Link>
                                : <></>
                            : <></>
                    }

                </div>
            </>
        },
        {
            name: 'Group Name',
            selector: (row) => row.GroupName,
            sortable: true
        },
        {
            name: 'Allow Multiple Agency',
            selector: (row) => <input type="checkbox" checked={row.IsAllowMultipleAgency} disabled />,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 53 }}>Delete</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, right: 60 }}>
                    {
                        EffectiveScreenPermission ?
                            EffectiveScreenPermission[0]?.DeleteOK ?
                                <Link to={`/agencyTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`} onClick={(e) => setGroupID(row.GroupID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </Link>
                                : <></>
                            : <></>
                    }
                </div>
            </>

        }
    ]

    const set_Edit_Value = (e, row) => {
        e.preventDefault()
        setStatus(true); setModal(true); setGroupEditData(row); setUpdateCount(updateCount + 1)
    }

    const set_Status = (e) => {
        e.preventDefault()
        setStatus(false); setModal(true); setGroupEditData()
    }

    // Delete Group data
    const deleteData = async () => {
        const value = {
            GroupID: groupId,
            DeletedByUserFK: pinId
        }
        AddDeleteUpadate('Group/GroupDelete', value).then((data) => {
            if (data.success) {
                toastifySuccess(data.Message)
                get_Group_List()
                get_CountList(aId)
            } else {
                toastifyError(data.Message)
            }
        });
    }

    return (
        <>
            <div className="row px-3">
                <div className="col-12 pt-2 p-0">
                    <div className="row ">
                        {/* <div className="col-6 mt-2 dropdown__box">
                            <select name="" id="" onChange={(e) => setAppliationId(e.target.value)} className='form-control form-control-sm' style={{ padding: '3px 4px' }}>
                                <option value=''>Select Application</option>
                                {
                                    application?.map((data, i) => {
                                        return (
                                            <option value={data?.ApplicationID}>{data?.ApplicationName}</option>
                                        )
                                    })
                                }
                            </select>
                        </div> */}
                    </div>
                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0 d-flex align-items-center">
                            Group
                        </p>
                        {
                            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                                <button type='button' className="btn btn-sm bg-green text-white px-2 py-0" onClick={set_Status}
                                    data-toggle="modal" data-target="#GroupModal" >
                                    <i className="fa fa-plus"></i>
                                </button>
                                : <></>
                                : <></>
                        }
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <DataTable
                                dense
                                columns={columns}
                                data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? groupList : '' : ''}
                                // paginationPerPage={'5'}
                                highlightOnHover
                                paginationRowsPerPageOptions={[10, 15]}
                                noContextMenu
                                pagination
                                responsive
                                subHeaderAlign="right"
                                subHeaderWrap
                                noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Group_Add_Up {...{ aId, pinId, groupEditData, status, get_Group_List, applicationId, groupList, getAgency_List, setModal, modal, updateCount }} />
            <DeletePopUpModal func={deleteData} />
        </>
    )
}

export default Group;