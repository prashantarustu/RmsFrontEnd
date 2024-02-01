// Import Component
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api'
import Unit_Add_Up from './Unit_Add_up'
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../../Common/DeleteModal'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { useContext } from 'react'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'

const Unit = ({ aId }) => {

    // const useQuery = () => new URLSearchParams(useLocation().search);
    // let aId = useQuery().get('id').split(" ", 3)[0].split("/", 1)[0].substring(10,);
    const { get_CountList, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    // Hooks Initialization
    const [unitList, setUnitList] = useState([])
    const [unitEditData, setUnitEditData] = useState([])
    const [status, setStatus] = useState(false)
    const [uiniId, setUnitID] = useState();
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [modal, setModal] = useState(false)
    const [countUpd, setUpdCount] = useState(0)
    const [pinId, setPinID] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", LocalAgencyID: "", }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID  || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setPinID(localStoreArray?.PINID);
                get_Unit_List(aId);
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    // Onload Function
    // useEffect(() => {
    //     get_Unit_List(aId);
    //     getScreenPermision(aId, pinId)
    // }, [aId])


    // Get Screeen Permission
    const getScreenPermision = (aId, pinId) => {
        ScreenPermision("A005", aId, pinId).then(res => {
            if (res) setEffectiveScreenPermission(res)
            else setEffectiveScreenPermission()
        });
    }

    const get_Unit_List = (aId) => {
        const value = {
            AgencyID: aId
        }
        fetchPostData('Unit/UnitGetData', value)
            .then((res) => {
                if (res) {
                    setUnitList(res)
                }
                else setUnitList([]);
            })
    }

    // Table Columns Array
    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={`/agencyTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`} data-toggle="modal" data-target="#UnitModal" onClick={(e) => set_Edit_Value(e, row)}
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1"><i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <></>
                    }

                </div>
            </>

        },
        {
            name: 'Unit Name',
            selector: (row) => row.UnitName,
            sortable: true
        },

        {
            name: 'Unit Code',
            selector: (row) => row.UnitCode,
            sortable: true
        },
        {
            name: 'Shift Code',
            selector: (row) => row.ShiftCode,
            sortable: true
        },
        {
            name: 'Shift Description',
            selector: (row) => row.ShiftDescription,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 53 }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, right: 60 }}>

                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`/agencyTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`} onClick={(e) => setUnitID(row.UnitId)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <></>
                    }
                </div>
            </>

        }
    ]

    // Delete unit
    const delete_Unit = async (e, id) => {
        e.preventDefault()
        const value = {
            UnitId: uiniId,
            DeletedByUserFK: pinId
        }
        AddDeleteUpadate('Unit/UnitDelete', value).then((data) => {
            if (data.success) {
                toastifySuccess(data.Message)
                get_Unit_List(aId)
                get_CountList(aId)
            } else {
                toastifyError(data.Message)
            }
        });
    }

    const set_Edit_Value = (e, row) => {
        e.preventDefault()
        setStatus(true); setUnitEditData(row); setModal(true); setUpdCount(countUpd + 1)
    }

    const set_Status = () => {
        setModal(true); setStatus(false); setUnitEditData()
    }

    return (
        <>
            <div className="row px-3">
                <div className="col-12 pt-2 p-0">
                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0 d-flex align-items-center">
                            Unit
                        </p>
                        {
                            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                                <button
                                    className=" btn btn-sm bg-green text-white px-2 py-0" onClick={set_Status} data-toggle="modal" data-target="#UnitModal" >
                                    <i className="fa fa-plus"></i>
                                </button>
                                : <></>
                                : <></>
                        }
                    </div>
                    <div className="col-12">
                        <DataTable
                            columns={columns}
                            data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? unitList : '' : ''}
                            dense
                            paginationRowsPerPageOptions={[10, 15]}
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
            </div>
            <Unit_Add_Up {... { aId, pinId, unitEditData, status, get_Unit_List, unitList, modal, setModal, countUpd }} />
            <DeletePopUpModal func={delete_Unit} />
        </>
    )
}

export default Unit