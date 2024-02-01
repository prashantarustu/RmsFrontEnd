import React, { useState, useEffect } from 'react'
import { useContext } from 'react'
import DataTable from 'react-data-table-component'  
import { Link, useLocation } from 'react-router-dom'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { toastifySuccess } from '../../../../Common/AlertMsg'
import DeletePopUpModal from '../../../../Common/DeleteModal'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api'
import Emergency_Add_Up from './Emergency_Add_Up'

const Emergency = ({ pId, aId, pinId }) => {

    // const useQuery = () => new URLSearchParams(useLocation().search);
    // let aId = useQuery().get('id').split(" ", 3)[0].split("/", 1)[0].substring(10,);
    // let pId = useQuery().get('pd').split(" ", 3)[0].split("/", 1)[0].substring(10,);

    const [emergencyContact, setEmergencyContact] = useState([])
    const [emergencyEditValue, setEmergencyEditValue] = useState([])
    const [status, setStatus] = useState(false)
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [modal, setModal] = useState(false)
    const [countUpd, setUpdCount] = useState(0)
    const [emergencyId, setEmergencyId] = useState('')
    const { get_CountList } = useContext(AgencyContext)

    useEffect(() => {
        get_EmergencyContact(pId);
        getScreenPermision(aId, pinId);
        get_CountList(aId, pId);
    }, [aId])

    // Get Screeen Permission
    const getScreenPermision = (aId, pinId) => {
        ScreenPermision("P014", aId, pinId).then(res => {
            if (res) setEffectiveScreenPermission(res)
            else setEffectiveScreenPermission()
        });
    }

    const get_EmergencyContact = (pId) => {
        const val = {
            PINID: pId
        }
        fetchPostData("EmergencyContact/GetData_EmergencyContact", val)
            .then(res => {
                if (res) {
                    get_CountList(aId, pId)
                    setEmergencyContact(res)
                }
                else setEmergencyContact()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 6, }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={`/personnelTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=&pd=89zw03LXTG${pId}/2Wga0gJLXEgctxh79FeM/G`} onClick={(e) => set_Edit_Value(e, row)} data-toggle="modal" data-target="#EmergencyModal"
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1"><i className="fa fa-edit"></i></Link>
                            : <></>
                            : <></>}
                </div>
            </>
        },
        {
            name: 'Contact Name',
            selector: (row) => row.ContactName
        },
        {
            name: 'Phone',
            selector: (row) => row.Phone_No,
            sortable: true
        },
        {
            name: 'Fax',
            selector: (row) => row.Fax_No,
            sortable: true
        },
        {
            name: 'Email',
            selector: (row) => row.Email,
            sortable: true
        },
        {
            name: 'Address',
            selector: (row) => row.Address,
            sortable: true
        },
        {
            name: 'Notes',
            selector: (row) => row.Notes,
            sortable: true
        },

        {
            name: <p className='text-end' style={{ position: 'absolute', top: 6, right: 50 }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 0, right: 40 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`/personnelTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=&pd=89zw03LXTG${pId}/2Wga0gJLXEgctxh79FeM/G`} onClick={(e) => setEmergencyId(row.EmergencyID)} data-toggle="modal" data-target="#DeleteModal"
                                className="btn btn-sm bg-green text-white px-1 py-0"><i className="fa fa-trash"></i></Link>
                            : <></>
                            : <></>
                    }

                </div>
            </>

        }
    ]

    const set_Edit_Value = (e, row) => {
        e.preventDefault()
        setStatus(true); setEmergencyEditValue(row); setModal(true); setUpdCount(countUpd + 1)
    }

    const set_Status = (e) => {
        e.preventDefault()
        setStatus(false); setEmergencyEditValue([]); setModal(true)
    }

    const delete_EmergencyContact = (e, EmergencyID) => {
        e.preventDefault();
        const val = {
            'DeletedByUserFK': pinId,
            'EmergencyID': emergencyId
        }
        AddDeleteUpadate('EmergencyContact/DeleteEmergencyContact', val)
            .then((res) => {
                if (res.success === true) {
                    toastifySuccess(res.Message)
                    get_CountList(aId, pId)
                    get_EmergencyContact(pId)
                }
            })
    }

    return (
        <>
            <div className="row px-3">
                <div className="col-12  ">
                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0 d-flex align-items-center">
                            Emergency Contact
                        </p>
                        {
                            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                                <Link to={`/personnelTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=&pd=89zw03LXTG${pId}/2Wga0gJLXEgctxh79FeM/G`} className="btn btn-sm bg-green text-white px-2 py-0" onClick={set_Status}
                                    data-toggle="modal" data-target="#EmergencyModal" >
                                    <i className="fa fa-plus"></i>
                                </Link>
                                : <></>
                                : <></>
                        }
                    </div>
                    <DataTable
                        columns={columns}
                        data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? emergencyContact : '' : ''}
                        dense
                        paginationPerPage={'5'}
                        paginationRowsPerPageOptions={[5, 10, 15]}
                        highlightOnHover
                        noContextMenu
                        pagination
                        responsive
                        subHeaderAlign="right"
                        fixedHeader
                        fixedHeaderScrollHeight="195px"
                        subHeaderWrap
                        noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    />
                </div>
            </div>
            <Emergency_Add_Up {...{ pId, aId, pinId, emergencyEditValue, status, get_EmergencyContact, modal, setModal, countUpd }} />
            <DeletePopUpModal func={delete_EmergencyContact} />
        </>
    )
}

export default Emergency