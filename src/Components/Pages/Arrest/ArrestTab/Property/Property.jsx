import React from 'react'
import { Link } from 'react-router-dom'
import Property_Add_Up from './Property_Add_Up'
import { useState } from 'react'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility'
import { useEffect } from 'react'
import { toastifySuccess } from '../../../../Common/AlertMsg'
import DeletePopUpModal from '../../../../Common/DeleteModal'
import DataTable from 'react-data-table-component'
import { ArrPropertyListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray'
import FindListDropDown from '../../../../Common/FindListDropDown'
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat'
import { useLocation } from 'react-router-dom';
import Loader from '../../../../Common/Loader'
import { useContext } from 'react'
import { AgencyContext } from '../../../../../Context/Agency/Index'

const IncidentProperty = () => {

    const { get_Arrest_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    const [modal, setModal] = useState();
    const [arrestPropetyID, setArrestPropertyID] = useState();
    const [arrestPropetyData, setArrestPropetyData] = useState();
    const [arrestDrpData, setArrestDrpData] = useState([]);
    const [loder, setLoder] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0)
    //screen permission 
    const [IncidentID, setIncidentID] = useState('');
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID] = useState('');
    const [ArrestID, setArrestID] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", }),
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
                setIncidentID(parseInt(localStoreArray?.IncidentID));
                get_Arrest_Property(localStoreArray?.IncidentID);
                get_Arrest_Propety(localStoreArray?.ArrestID);
                setArrestID(localStoreArray?.ArrestID)
                //  getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    // useEffect(() => {
    //     get_Arrest_Propety();
    // }, [])

    const get_Arrest_Propety = (ArrestID) => {
        const val = {
            'ArrestID': ArrestID
        }
        fetchPostData('ArrestProperty/GetData_ArrestProperty', val).then((res) => {
            console.log(res)
            if (res) {
                setArrestPropetyData(res); setLoder(true)
            } else {
                setArrestPropetyData([]); setLoder(true)
            }
        })
    }

    const columns = [
        // {
        //     name: 'PropertyNumber',
        //     selector: (row) => row.PropertyNumber,
        //     sortable: true
        // },
        {
            name: 'Property Number',
            selector: (row) => row.PropertyNumber,
            sortable: true
        },
        // {
        //     name: 'PropertyReason',
        //     selector: (row) => row.PropertyLossCode_Description, 
        //     sortable: true
        // },
        {
            name: 'Reported Date/Time',
            // selector: (row) => row.ReportedDtTm,
            selector: (row) => getShowingDateText(row.ReportedDtTm),
            sortable: true
        },
        {
            name: 'Property Type',
            selector: (row) => row.PropertyType_Description,
            sortable: true
        },
        {
            name: 'Property Value',
            // selector: (row) => row.Value,
            selector: (row) => row.Value,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 0 }}>Delete</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 4, right: 5 }}>
                    {/* {
                EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                  <Link to={''} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#PinModal" >
                    <i className="fa fa-edit"></i>
                  </Link>
                  : <></>
                  : <Link to={''} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#PinModal" >
                    <i className="fa fa-edit"></i></Link>
              } */}
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} onClick={() => { setArrestPropertyID(row.ArrestPropertyID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={`#`} onClick={() => { setArrestPropertyID(row.ArrestPropertyID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                    }
                </div>
            </>
        }
    ]


    const set_Edit_Value = (e, row) => {
        setModal(true)
        setArrestPropertyID(row.ArrestPropertyID);
    }

    const setStatusFalse = (e,row) => {
        // setStatus(false)
        setModal(true)
        setUpdateStatus(updateStatus + 1);
    }
    const Delete_Arrest_Property = () => {
        const val = {
            'ArrestPropertyID': arrestPropetyID,
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate('ArrestProperty/Delete_ArrestProperty', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Arrest_Count(ArrestID)
                get_Arrest_Propety(ArrestID);
                get_Arrest_Property(IncidentID);

            } else console.log("Somthing Wrong");
        })
    }

    const get_Arrest_Property = (incidentID) => {
        const val = {
            IncidentID: incidentID
        }
        fetchPostData('ArrestProperty/GetData_InsertArrestProperty', val).then((data) => {
            console.log(data)
            if (data) {
                setArrestDrpData(Comman_changeArrayFormat(data, 'PropertyID', 'PropertyNumber'));
            }
            else {
                setArrestDrpData([])
            }
        })
    };

    return (
        <>
            <div className="col-12 col-md-12 pt-2 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Property</p>
                    <div style={{ marginLeft: 'auto' }}>
                        <Link to={'#'} onClick={setStatusFalse} className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#PropertyModal" style={{ marginTop: '-6px' }}>
                            <i className="fa fa-plus"></i>
                        </Link>
                        <FindListDropDown
                            array={ArrPropertyListDropDownArray}
                        />
                    </div>
                </div>
                <div className="col-12 ">
                    {
                        loder ?
                            <DataTable
                                dense
                                columns={columns}
                                data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? arrestPropetyData : '' : arrestPropetyData}
                                pagination
                                highlightOnHover
                                noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                            />
                            :
                            <Loader />

                    }
                </div>
            </div>
            <Property_Add_Up {...{ LoginPinID, ArrestID, IncidentID, LoginAgencyID, modal, setModal, get_Arrest_Propety, arrestPropetyID, setArrestDrpData, arrestDrpData, get_Arrest_Property,updateStatus }} />
            <DeletePopUpModal func={Delete_Arrest_Property} />
        </>
    )
}

export default IncidentProperty