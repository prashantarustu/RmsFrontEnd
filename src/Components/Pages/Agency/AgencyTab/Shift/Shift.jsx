import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData, ScreenPermision } from '../../../../hooks/Api'
import DataTable from 'react-data-table-component';
import Shift_Add_Up from './Shift_Add_Up'
import DeletePopUpModal from '../../../../Common/DeleteModal'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { useContext } from 'react'
import { AgencyContext } from '../../../../../Context/Agency/Index'

const Shift = ({ aId }) => {

    const { get_CountList, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    // const useQuery = () => new URLSearchParams(useLocation().search);
    // let aId = useQuery().get('id').split(" ", 3)[0].split("/", 1)[0].substring(10,);
    // Hooks Initialization
    const [shiftList, setShiftList] = useState([])
    const [shiftEditData, setShiftEditData] = useState([])
    const [status, setStatus] = useState(false)
    const [shiftId, setShiftId] = useState('')
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [modal, setModal] = useState(false)
    const [countUpd, setUpdCount] = useState(0);
    const [pinId, setPinID] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", LocalAgencyID: "", }),
    }

    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray.AgencyID && localStoreArray.PINID) {
                setPinID(localStoreArray?.PINID);
                get_Shift(aId);
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    // Onload Function
    // useEffect(() => {
    //     get_Shift(aId);
    //     getScreenPermision(aId, pinId)
    // }, [aId])

    // Get Screeen Permission
    const getScreenPermision = (aId, pinId) => {
        ScreenPermision("A020", aId, pinId).then(res => {
            if (res) setEffectiveScreenPermission(res)
            else setEffectiveScreenPermission()
        });
    }

    // Get Shift List 
    const get_Shift = (aId) => {
        const value = {
            AgencyId: aId
        }
        fetchPostData('MasterPersonnel/GetData_Shift', value)
            .then(res => {
                if (res) setShiftList(res)
                else setShiftList()
            })
    }

    // Edit value Set in hooks
    const set_Edit_Value = (e, row) => {
        setStatus(true); setShiftEditData(row); setModal(true); setUpdCount(countUpd + 1)
    }

    // Table Columns Array
    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={`/agencyTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`} onClick={(e) => set_Edit_Value(e, row)} data-toggle="modal" data-target="#ShiftModal"
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1"><i className="fa fa-edit"></i></Link>
                            : <></>
                            : <></>
                    }

                </div>
            </>

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
            name: 'Start Time',
            selector: (row) => row.Starttime.substr(0, 5),
            sortable: true
        },
        {
            name: 'End Time',
            selector: (row) => row.EndTime.substr(0, 5),
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 50 }}>Delete</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, right: 60 }}>

                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`/agencyTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`} onClick={() => setShiftId(row.ShiftId)} data-toggle="modal" data-target="#DeleteModal"
                                className="btn btn-sm bg-green text-white px-1 py-0"><i className="fa fa-trash"></i></Link>
                            : <></>
                            : <></>
                    }
                </div>
            </>

        }
    ]

    const set_Status = () => {
        setStatus(false)
        setModal(true)
        setShiftEditData()
    }

    // Delete Shift Function
    const deleteShift = async (e) => {
        e.preventDefault()
        const value = {
            ShiftId: shiftId,
            DeletedByUserFK: pinId,
            // DeletedByUserFK: Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
        }
        AddDeleteUpadate('MasterPersonnel/DeleteShift', value).then((data) => {
            if (data.success) {
                toastifySuccess(data.Message)
                get_Shift(aId)
                get_CountList(aId)
            } else {
                toastifyError("Shift Can't be Deleted !!")
            }
        });
    }

    return (
        <>
            <div className="row px-3">
                <div className="col-12 pt-2 p-0">
                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0 d-flex align-items-center">
                            Shift
                        </p>
                        {
                            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                                <button
                                    className="btn btn-sm bg-green text-white px-2 py-0" onClick={set_Status} data-toggle="modal" data-target="#ShiftModal">
                                    <i className="fa fa-plus"></i>
                                </button>
                                : <></>
                                : <></>
                        }
                    </div>
                </div>
                <div className="col-12">
                    <DataTable
                        dense
                        columns={columns}
                        data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? shiftList : '' : ''}
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
            <Shift_Add_Up {...{ aId, pinId, get_Shift, shiftEditData, status, modal, setModal, countUpd, shiftList }} />
            <DeletePopUpModal func={deleteShift} />
        </>
    )
}

export default Shift