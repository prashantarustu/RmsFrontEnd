// Import Component
import React, { useEffect, useState } from 'react'
import Division_Add_Up from './Division_Add_Up'
import { Link, useLocation } from 'react-router-dom'
import { Decrypt_Id_Name, getShowingYearMonthDate } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData, ScreenPermision } from '../../../../hooks/Api'
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../../Common/DeleteModal'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { useContext } from 'react'
import { AgencyContext } from '../../../../../Context/Agency/Index'


const Division = ({ aId }) => {

    // const useQuery = () => new URLSearchParams(useLocation().search);
    // let aId = useQuery().get('id').split(" ", 3)[0].split("/", 1)[0].substring(10,);
    const { get_CountList, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    // Hooks Initialization
    const [divisionList, setDivisionList] = useState([])
    const [divisionEditValue, setDivisionEditValue] = useState([])
    const [status, setStatus] = useState(false)
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [divisionid, setDivisionID] = useState('')
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
                get_Division(aId);
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    // Onload Function
    // useEffect(() => {
    //     get_Division(aId);
    //     getScreenPermision(aId, pinId)
    // }, [aId])

    // Get Division List 
    const get_Division = (aId) => {
        const value = {
            AgencyId: aId
        }
        fetchPostData('Division/GetData_Division', value)
            .then(res => {
                if (res) setDivisionList(res)
                else setDivisionList()
            })
    }

    // Get Effective Screeen Permission
    const getScreenPermision = (aId, pinId) => {
        ScreenPermision("A004", aId, pinId).then(res => {
            if (res) setEffectiveScreenPermission(res)
            else setEffectiveScreenPermission()
        });
    }

    // Edit value Set in hooks
    const set_Edit_Value = (e, row) => {
        setStatus(true)
        setDivisionEditValue(row)
        setModal(true)
        setUpdCount(countUpd + 1)
    }

    // Table Columns Array
    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={`/agencyTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`} onClick={(e) => set_Edit_Value(e, row)} data-toggle="modal" data-target="#DivisionModal"
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1"><i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <></>
                    }
                </div>
            </>

        },
        {
            name: 'Division Code',
            selector: (row) => row.DivisionCode,
            sortable: true
        },
        {
            name: 'Division Name',
            selector: (row) => row.Name,
            sortable: true
        },
        {
            name: 'Head of division',
            selector: (row) => row.PINName,
            sortable: true
        },
        {
            name: 'Parent division',
            selector: (row) => row.ParentDivisionname,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 53 }}>Delete</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, right: 60 }}>
                    {/* {
                        EffectiveScreenPermission?EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={`/agencyTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`} onClick={(e) => set_Edit_Value(e, row)} data-toggle="modal" data-target="#DivisionModal"
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1"><i className="fa fa-edit"></i>
                            </Link>
                            : <></>                                
                            :<></>
                    } */}
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`/agencyTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`} onClick={(e) => setDivisionID(row.DivisionID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
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
        setDivisionEditValue()
    }

    // Delete Division Function
    const delete_Division = async (e, id) => {
        e.preventDefault()
        const value = {
            IsActive: 0,
            DeletedDtTm: getShowingYearMonthDate(new Date()),
            DivisionID: divisionid,
            DeletedByUserFK: pinId
        }
        AddDeleteUpadate('Division/DivisionDelete', value).then((data) => {
            if (data.success) {
                toastifySuccess(data.Message)
                get_Division(aId)
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

                    <div className="bg-line text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0 d-flex align-items-center">
                            Division
                        </p>
                        {/* <i className="fa fa-plus"></i> */}
                        {
                            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                                <button type='button' className="btn btn-sm bg-green text-white px-2 py-0" onClick={set_Status}
                                    data-toggle="modal" data-target="#DivisionModal" >
                                    <i className="fa fa-plus"></i>
                                </button>
                                : <></>
                                : <></>
                        }
                    </div>
                    <DataTable
                        columns={columns}
                        dense
                        data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? divisionList : '' : ''}
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
            <Division_Add_Up {...{ aId, pinId, status, divisionEditValue, setStatus, get_Division, divisionList, modal, setModal, countUpd, setUpdCount }} />
            <DeletePopUpModal func={delete_Division} />
        </>
    )
}

export default Division