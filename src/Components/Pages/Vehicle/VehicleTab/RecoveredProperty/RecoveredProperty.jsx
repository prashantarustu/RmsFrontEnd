import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import DataTable from 'react-data-table-component'
import { toastifySuccess } from '../../../../Common/AlertMsg'
import DeletePopUpModal from '../../../../Common/DeleteModal'
import { ProRecoveredListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray'
import FindListDropDown from '../../../../Common/FindListDropDown'
import RecoveredProperty_Add_Up from './RecoveredProperty_Add'
import Loader from '../../../../Common/Loader'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { useContext } from 'react'

const RecoveredProperty = () => {

    const { get_vehicle_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    //screen permission 
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [modal, setModal] = useState(false)
    const [updateStatus, setUpdateStatus] = useState(0)
    const [vehicleData, setvehicleData] = useState([]);
    const [VehicleRecoveredID, setVehicleRecoveredID] = useState();
    const [loder, setLoder] = useState(false);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [vehicleID, setVehicleID] = useState('');
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
                setLoginPinID(localStoreArray?.PINID);
                setMainIncidentID(localStoreArray?.IncidentID);
                if (localStoreArray?.VehicleID) {
                    setVehicleID(localStoreArray?.VehicleID);
                    get_property_Data(localStoreArray?.VehicleID);
                } else {
                    setVehicleID('');
                }
            }
        }
    }, [localStoreArray])

    const get_property_Data = (vehicleID) => {
        const val = {
            'VehicleID': vehicleID,
        }
        fetchPostData('VehicleRecovered/GetData_VehicleRecovered', val).then((res) => {
            if (res) {
                // console.log(res)
                setvehicleData(res); setLoder(true)
            } else {
                setvehicleData(); setLoder(true)
            }
        })
    }

    const columns = [
        // {
        //     name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
        //     cell: row => <>
        //         <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
        //             {
        //                 EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
        //                     <Link to={''} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#RecoveredPropertyModal" >
        //                         <i className="fa fa-edit"></i>
        //                     </Link>
        //                     : <></>
        //                     : <Link to={''} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#RecoveredPropertyModal" >
        //                         <i className="fa fa-edit"></i></Link>
        //             }
        //         </div>
        //     </>
        // },
        {
            name: 'RecoveredID Number',
            selector: (row) => row.RecoveredIDNumber,
            sortable: true
        },
        {
            name: 'Comments',
            selector: (row) => row.Comments,
            sortable: true
        },
        {
            name: 'RecoveredValue',
            selector: (row) => row.RecoveredValue,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Delete</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 4, right: 65 }}>
                    {/* {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={''} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#RecoveredPropertyModal" >
                                <i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <Link to={''} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#RecoveredPropertyModal" >
                                <i className="fa fa-edit"></i></Link>
                    } */}
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} onClick={() => { setVehicleRecoveredID(row.VehicleRecoveredID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={`#`} onClick={() => { setVehicleRecoveredID(row.VehicleRecoveredID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                    }
                </div>
            </>
        }
    ]

    const set_Edit_Value = (e, row) => {
        e.preventDefault();
        get_vehicle_Count(row.VehicleID)
        setVehicleRecoveredID(row.VehicleRecoveredID);
        setUpdateStatus(updateStatus + 1);
        setModal(true);
    }

    const setStatusFalse = (e) => {
        setModal(true);
        setUpdateStatus(updateStatus + 1)
    }

    const Delete_RecoveredProperty = () => {
        const val = {
            'VehicleRecoveredID': VehicleRecoveredID,
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate('VehicleRecovered/Delete_VehicleRecovered', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_property_Data(vehicleID);
                get_vehicle_Count(vehicleID)
                setVehicleRecoveredID('');
            } else console.log("Somthing Wrong");
        })
    }

    return (
        <>
            <div className="col-12 col-md-12 pt-1 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Vehicle Recovered</p>
                    <div style={{ marginLeft: 'auto' }}>
                        <Link to="" onClick={() => { setModal(true); setUpdateStatus(updateStatus + 1) }} className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#RecoveredPropertyModal" style={{ marginTop: '-6px' }}>
                            <i className="fa fa-plus"></i>
                        </Link>
                        <FindListDropDown
                            array={ProRecoveredListDropDownArray}
                        />
                    </div>
                    {/* {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                            <Link to="" className="btn btn-sm bg-green text-white px-2 py-0" onClick={setStatusFalse}
                                data-toggle="modal" data-target="#PinModal" >
                                <i className="fa fa-plus"></i>
                            </Link>
                            : <></>
                            : <Link to="" className="btn btn-sm bg-green text-white px-2 py-0" onClick={setStatusFalse}
                                data-toggle="modal" data-target="#PinModal" >
                                <i className="fa fa-plus"></i>
                            </Link>
                    } */}
                </div>
                <div className="col-12">
                    {
                        loder ?
                            <DataTable
                                dense
                                columns={columns}
                                data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? vehicleData : '' : vehicleData}
                                pagination
                                highlightOnHover
                                noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                            />
                            :
                            <Loader />

                    }
                </div>
            </div>
            <DeletePopUpModal func={Delete_RecoveredProperty} />
            <RecoveredProperty_Add_Up {...{ VehicleRecoveredID, setVehicleRecoveredID, modal, setModal, updateStatus, get_property_Data, vehicleData, LoginPinID, LoginAgencyID, vehicleID, MainIncidentID }} />
        </>
    )
}

export default RecoveredProperty