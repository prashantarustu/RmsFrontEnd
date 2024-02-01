// Import Component
import React, { useState, useEffect, useContext } from 'react'
import DataTable from 'react-data-table-component';
import { Link, useLocation } from "react-router-dom";
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import PersonnelModal from '../../../PersonnelCom/PersonnelModal/PersonnelModal';

const Personnel = ({ aId }) => {

    const { getAgency, get_CountList, get_Personnel_Lists, personnelList, setPersonnelStatus, setPersonnelEffectiveScreenPermission, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext)
    // Hooks Initialization
    const [modalOpen, setModalOpen] = useState(false);
    // const [personnelList, setPersonnelList] = useState([])
    const [editValueList, setEditValueData] = useState([])
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [PINID, setPINID] = useState();
    const [LoginPinId, setLoginPinID] = useState('');

    const useQuery = () => new URLSearchParams(useLocation().search);
    let agencyID = useQuery().get('id');

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
                setLoginPinID(localStoreArray?.PINID);
                get_Personnel_Lists(aId);
                get_CountList(aId);
                get_EffectiveScreen_Permission(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    // useEffect(() => {
    //     get_EffectiveScreen_Permission(aId, pinId);
    //     get_Personnel_Lists(aId);
    //     get_CountList(aId);
    //     // get_Personnel_Lists(agencyID.split(" ", 3)[0].split("/", 1)[0].substring(10,));
    //     // get_CountList(agencyID.split(" ", 3)[0].split("/", 1)[0].substring(10,));

    //     // getAgency();
    // }, [aId])

    // get Personnel Data
    // const get_Personnel_Lists = () => {
    //     // console.log(Decrypt_Id('U2FsdGVkX1+nsc+d6iSDbsrmqwVnAixi7wpConjFb6g=', 'AForAgencyID'));
    //     const val = {
    //         AgencyID: 
    //     }
    //     fetchPostData('Personnel/GetData_Personnel', val)
    //         .then((res) => {
    //             console.log(res);
    //             if (res) setPersonnelList(res)
    //             else setPersonnelList()
    //         })
    // }

    // get password Setting list
   
    const get_PasswordSetting_List = () => {
        const val = {
            // AgencyID: agencyID.split(" ", 3)[0].split("/", 1)[0].substring(10,)
            AgencyID: aId,
        }
        // fetchPostData('PasswordSetting/PasswordSetting_getData', val)
        //     .then((res) => {
        //         if (res) {
        //             localStorage.setItem('data', JSON.stringify(res[0]))
        //         }
        //     })
    }

    // Get Effective Screeen Permission
    const get_EffectiveScreen_Permission = (aId, pinId) => {
        const val = {
            // PINID: Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
            // AgencyID: agencyID.split(" ", 3)[0].split("/", 1)[0].substring(10,),
            AgencyID: aId,
            PINID: pinId,
            ApplicationID: '1',
            code: 'A006',
        }
        fetchPostData("EffectivePermission/GetData_EffectiveScreenPermission", val)
            .then(res => {
                if (res) { setEffectiveScreenPermission(res); setPersonnelEffectiveScreenPermission(res) }
                else { setEffectiveScreenPermission(); setPersonnelEffectiveScreenPermission() }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const editValueSet = (e, Data) => {
        e.preventDefault()
        setPINID(Data?.PINID)
        get_PasswordSetting_List()
        setModalOpen(true)
        setEditValueData(Data)
    }

    // Delete Peronnel Fuction
    const delete_Personnel = (e, id) => {
        e.preventDefault()
        const val = {
            PINID: PINID,
            DeletedByUserFK: LoginPinId,
            // DeletedByUserFK: Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
        }
        AddDeleteUpadate('Personnel/DeletePersonnel', val)
            .then((res) => {
                if (res) {
                    toastifySuccess(res.Message);
                    get_CountList(aId);
                    // get_CountList(agencyID.split(" ", 3)[0].split("/", 1)[0].substring(10,))
                };
                get_Personnel_Lists(aId);
                // get_Personnel_Lists(agencyID.split(" ", 3)[0].split("/", 1)[0].substring(10,))
            })
    }

    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 7, }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={`/personnelTab?id=U2FsdGVkX1${agencyID.split(" ", 3)[0].split("/", 1)[0].substring(10,)}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=&pd=89zw03LXTG${row.PINID}/2Wga0gJLXEgctxh79FeM/G`}
                                onClick={(e) => setPersonnelStatus(true)}
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1"><i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <></>
                    }
                    {/* {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`/agencyTab?id=U2FsdGVkX1${agencyID.split(" ", 3)[0].split("/", 1)[0].substring(10,)}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`} onClick={(e) => setPINID(row.PINID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <></>
                    } */}
                    {/* <Link to={`#`} onClick={(e) => delete_Personnel(e, row.PINID)}
                        className="btn btn-sm bg-green text-white px-1 py-0"><i className="fa fa-trash"></i>
                    </Link> */}
                </div>
            </>
        },
        {
            name: 'PIN',
            selector: (row) => row.PIN,
            sortable: true
        },
        {
            name: 'Last Name',
            selector: (row) => row.LastName
        },
        {
            name: 'First Name',
            selector: (row) => row.FirstName,
            sortable: true
        },
        {
            name: 'User Name',
            selector: (row) => row.UserName,
            sortable: true
        },
        {
            name: 'Division Name',
            selector: (row) => row.Division_Name,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 7, right: 42 }}>Delete</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, right: 50 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`/agencyTab?id=U2FsdGVkX1${agencyID.split(" ", 3)[0].split("/", 1)[0].substring(10,)}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`}
                             onClick={(e) => setPINID(row.PINID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <></>
                    }
                    {/* <Link to={`#`} onClick={(e) => delete_Personnel(e, row.PINID)}
                        className="btn btn-sm bg-green text-white px-1 py-0"><i className="fa fa-trash"></i>
                    </Link> */}
                </div>
            </>
        }
    ]

    return (
        <>
            <div className="row px-3">
                <div className="col-12 pt-2 p-0">
                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0 d-flex align-items-center">
                            Personnel
                        </p>
                        {
                            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                                <Link to={`/personnelTab?id=U2FsdGVkX1${agencyID.split(" ", 3)[0].split("/", 1)[0].substring(10,)}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=&pd=89zw03LXTG0000/2Wga0gJLXEgctxh79FeM/G`} className="btn btn-sm bg-green text-white px-2 py-0"
                                    data-toggle="modal" data-target="#PersonnelModal" onClick={(e) => { setModalOpen(true); setEditValueData(); get_PasswordSetting_List(); setPINID(); setPersonnelStatus(false) }} >
                                    <i className="fa fa-plus"></i>
                                </Link>
                                : <></>
                                : <></>
                        }
                    </div>
                    <DataTable
                        dense
                        columns={columns}
                        data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? personnelList : '' : ''}
                        paginationPerPage={'10'}
                        paginationRowsPerPageOptions={[10, 15]}
                        highlightOnHover
                        noContextMenu
                        pagination
                        responsive
                        subHeaderAlign="right"
                        subHeaderWrap
                        noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    // fixedHeader
                    // fixedHeaderScrollHeight="195px"
                    />
                </div>
            </div>
            {/* Personnel Modal Component */}
            {/* {
                modalOpen ?
                    <PersonnelModal {...{PINID, setPINID, agencyID, setModalOpen, editValueList, setEditValueData, EffectiveScreenPermission, get_Personnel_Lists }} />
                    :
                    ''
            } */}
            <DeletePopUpModal func={delete_Personnel} />
        </>
    )
}

export default Personnel