import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingDateText } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import VehicleNotes_Add_Up from './VehicleNotes_Add_Up';
import { VeNotesListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../../Common/FindListDropDown';
import Loader from '../../../../Common/Loader';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const VehicleNotes = () => {

    const { get_vehicle_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    const [status, setStatus] = useState(false);
    const [modal, setModal] = useState(false);
    const [loder, setLoder] = useState(false);
    const [VehicleNotesData, setVehicleNotesData] = useState([]);
    const [VehicleNotesID, setVehicleNotesID] = useState('');
    const [upDateCount, setUpDateCount] = useState(0);
    //screen permission 
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [LoginAgencyID, setLoginAgencyID] = useState('')
    const [vehicleID, setVehicleID] = useState('')
    const [LoginPinID, setLoginPinID] = useState('');
    const [MainIncidentID, setMainIncidentID] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', VehicleID: '', }),
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
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(parseInt(localStoreArray?.PINID));
                setMainIncidentID(parseInt(localStoreArray?.IncidentID));
                if (localStoreArray?.VehicleID) {
                    setVehicleID(localStoreArray?.VehicleID);
                    get_VehicleNotesData(localStoreArray?.VehicleID);
                } else {
                    setVehicleID('');
                }
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    const get_VehicleNotesData = (vehicleID) => {
        const val = {
            'VehicleID': vehicleID,
        }
        fetchPostData('VehicleNotes/GetData_VehicleNotes', val)
            .then(res => {
                if (res) {
                    setVehicleNotesData(res); setLoder(true)
                } else {
                    setVehicleNotesData([]); setLoder(true)
                }
            })
    }

    const getScreenPermision = (LoginAgencyID, LoginPinID) => {
        ScreenPermision("I033", LoginAgencyID, LoginPinID).then(res => {
            if (res) {
                setEffectiveScreenPermission(res)
            } else {
                setEffectiveScreenPermission()
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
                            <Link to={''} onClick={(e) => editVehicleNotes(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#VehicleNotes" >
                                <i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <Link to={''} onClick={(e) => editVehicleNotes(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#VehicleNotes" >
                                <i className="fa fa-edit"></i>
                            </Link>
                    }

                </div>
            </>
        },
        {
            width: '200px',
            name: 'Date/Time',
            selector: (row) => getShowingDateText(row.getShowingDateText),
            sortable: true
        },
        {
            name: 'Vehicle Notes',
            selector: (row) => <>{row?.Notes ? row?.Notes.substring(0, 60) : ''}{row?.Notes?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'Officer',
            selector: (row) => row.OfficerName,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 3 }}>Delete</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, right: 7 }}>
                    {/* {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={''} onClick={(e) => editVehicleNotes(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#VehicleNotes" >
                                <i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <Link to={''} onClick={(e) => editVehicleNotes(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#VehicleNotes" >
                                <i className="fa fa-edit"></i>
                            </Link>
                    } */}
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} onClick={(e) => setVehicleNotesID(row.VehicleNotesID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={`#`} onClick={(e) => setVehicleNotesID(row.VehicleNotesID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                    }
                </div>
            </>
        }
    ]

    const editVehicleNotes = (e, val) => {
        e.preventDefault();
        get_vehicle_Count(vehicleID)
        // setMasterPropertyID(val.MasterPropertyID);
        setVehicleNotesID(val.VehicleNotesID);
        setUpDateCount(upDateCount + 1);
        setStatus(true)
        setModal(true);
    }
    const setStatusFalse = (e,row) => {
        setStatus(false)
        setModal(true)
        setUpDateCount(upDateCount + 1);
    }
    const DeleteVehicleNotes = () => {
        const val = {
            'VehicleNotesID': VehicleNotesID,
            DeletedByUserFK: LoginPinID,
        }
        AddDeleteUpadate('VehicleNotes/Delete_VehicleNotes', val).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message);
                get_vehicle_Count()
                get_VehicleNotesData(vehicleID);
            } else console.log("Somthing Wrong");
        })
    }

    return (
        <>
            <div className="col-md-12 mt-1 p-0">
                <div className="row">
                    <div className="col-md-12">
                        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0">Vehicle Notes</p>
                            <p className="p-0 m-0">
                                {
                                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                                        <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                                             onClick={setStatusFalse}
                                            data-toggle="modal" data-target="#VehicleNotes" style={{ marginTop: '-6px' }}>
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                        : <></>
                                        : <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                                             onClick={setStatusFalse}
                                            data-toggle="modal" data-target="#VehicleNotes" style={{ marginTop: '-6px' }}>
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                }
                            </p>
                        </div>
                        <div className="col-12 ">
                            {
                                loder ?
                                    <DataTable
                                        dense
                                        columns={columns}
                                        data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? VehicleNotesData : '' : VehicleNotesData}
                                        pagination
                                        selectableRowsHighlight
                                        highlightOnHover
                                        noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                    />
                                    :
                                    <Loader />
                            }
                        </div>
                    </div>
                </div>
            </div>
            <DeletePopUpModal func={DeleteVehicleNotes} />
            <VehicleNotes_Add_Up {...{ LoginPinID, vehicleID, LoginAgencyID, upDateCount, VehicleNotesID, status, modal, setModal, get_VehicleNotesData }} />
        </>
    )
}

export default VehicleNotes;