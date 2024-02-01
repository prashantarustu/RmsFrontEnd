import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RecoveredProperty_Add_Up from './RecoveredProperty_Add_Up'
import { useState } from 'react'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import DataTable from 'react-data-table-component'
import { toastifySuccess } from '../../../../Common/AlertMsg'
import DeletePopUpModal from '../../../../Common/DeleteModal'
import { ProRecoveredListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray'
import FindListDropDown from '../../../../Common/FindListDropDown'
import { AgencyContext } from '../../../../../Context/Agency/Index'

const RecoveredProperty = () => {

    const { get_Property_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, setIncidentStatus } = useContext(AgencyContext);

    //screen permission 
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [modal, setModal] = useState(false)
    const [updateStatus, setUpdateStatus] = useState(0)
    const [propertyData, setPropertyData] = useState([]);
    const [recoveredPropertyID, setRecoveredPropertyID] = useState();
    const [status, setStatus] = useState(false);

    const [propertyID, setPropertyID] = useState();
    const [masterPropertyID, setMasterPropertyID] = useState('');
    const [MainIncidentID, setMainIncidentID] = useState('');
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');

    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID || !localStoreArray.IncidentID || !localStoreArray.IncidentStatus) {
            get_LocalStorage();
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(parseInt(localStoreArray?.PINID));
                setMainIncidentID(parseInt(localStoreArray?.IncidentID));
                // setRecoveredPropertyID(parseInt(localStoreArray?.recoveredPropertyID))
                if (localStoreArray?.PropertyID)
                    setPropertyID(localStoreArray?.PropertyID)
                get_property_Data(localStoreArray?.PropertyID);
            }
            else {
                // setVehicleID('');
                setRecoveredPropertyID('');

            }
            setIncidentStatus(true);

        }
    }, [localStoreArray])


    // useEffect(() => {
    //     get_property_Data(propertyID);
    // }, [propertyID])

    const get_property_Data = (propertyID) => {
        const val = {
            'PropertyID': propertyID,
        }
        fetchPostData('RecoveredProperty/GetData_RecoveredProperty', val).then((res) => {
            if (res) {
                setPropertyData(res)
            } else {
                setPropertyData();
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
            name: 'Recovered ID Number',
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
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 30 }}>Action</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 4, right: 30 }}>

                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} onClick={() => { setRecoveredPropertyID(row.RecoveredPropertyID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={`#`} onClick={() => { setRecoveredPropertyID(row.RecoveredPropertyID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                    }
                </div>
            </>
        }
    ]

    const set_Edit_Value = (e, row) => {
        setModal(true)
        setUpdateStatus(updateStatus + 1);
        setRecoveredPropertyID(row.RecoveredPropertyID);
        setStatus(true);
    }

    // const setStatusFalse = (e) => {
    //     setModal(true)
    // }
    const setStatusFalse = (e, row) => {
        setStatus(false)
        setModal(true)
        // setUpdateStatus(updateStatus + 1);
        setRecoveredPropertyID(row.RecoveredPropertyID);
        // setRecoveredPropertyID('')

    }

    const Delete_RecoveredProperty = () => {
        const val = {
            'RecoveredPropertyID': recoveredPropertyID,
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate('RecoveredProperty/Delete_RecoveredProperty', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_property_Data(propertyID);
                get_Property_Count(propertyID); setRecoveredPropertyID('')
            } else console.log("Somthing Wrong");
        })
    }

    return (
        <>
            <div className="col-12 col-md-12 pt-1 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Recovered Property</p>
                    <div style={{ marginLeft: 'auto' }}>
                        <Link to="" onClick={setStatusFalse} className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#RecoveredPropertyModal" style={{ marginTop: '-6px' }}>
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
                    <DataTable
                        dense
                        columns={columns}
                        data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? propertyData : '' : propertyData}
                        pagination
                        highlightOnHover
                        noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    />
                </div>
            </div>
            <DeletePopUpModal func={Delete_RecoveredProperty} />
            <RecoveredProperty_Add_Up {...{ masterPropertyID, propertyID, LoginPinID, LoginAgencyID, MainIncidentID, recoveredPropertyID, setRecoveredPropertyID, setRecoveredPropertyID, modal, setModal, updateStatus, get_property_Data, propertyData, status, setStatus, }} />
        </>
    )
}

export default RecoveredProperty