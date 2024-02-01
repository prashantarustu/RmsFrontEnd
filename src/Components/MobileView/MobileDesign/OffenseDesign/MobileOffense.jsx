import React from 'react'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import MobileTab from '../../MobileUtility/MobileTab'
import { Decrypt_Id_Name, Encrypted_Id_Name, tableCustomStyles } from '../../../Common/Utility'
import { useEffect } from 'react'
import { useState } from 'react'
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api'
import { toastifySuccess } from '../../../Common/AlertMsg'
import { useContext } from 'react';
import { AgencyContext } from '../../../../Context/Agency/Index';
import {  ScreenPermision } from '../../../hooks/Api';
const MobileOffense = () => {


    const { get_Incident_Count, incidentNumber, setIncidentNumber, setIncidentCount, setIncStatus, setTabCount, crimeId, setCrimeId, offenceData,  offenceFillterData, setOffenceFillterData, get_Offence_Count, setIncidentStatus, offenceShowPage, setOffenceShowPage, localStoreArray, setLocalStoreArray, get_LocalStorage, offenceStatus, setOffenceStatus, deleteStoreData, storeData } = useContext(AgencyContext);

    //screen permission 
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
    const [MainIncidentID, setMainIncidentID] = useState('');
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', IncidentStatus: '', IncidentNumber: '', })
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray.IncidentID || !localStoreArray.IncidentStatus) {
            get_LocalStorage(localStore);
        }
    }, []);

    const [OffenceData, setOffenceData] = useState([]);
    const [CrimeID, setCrimeID] = useState('');
    const [modalStatus, setModalstatus] = useState(false)
    const [updateCount, setUpdateCount] = useState(0);

    useEffect(() => {
        get_Offence_Data();
    }, [])

    const get_Offence_Data = () => {
        const val = {
            'IncidentId': ''
        }
        fetchPostData('Crime_FRW/GetData_Crime_FRW', val)
            .then(res => {
                if (res) {
                    setOffenceData(res);
                }
                else { setOffenceData([]) }
            })
    };

    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray.AgencyID && localStoreArray.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                if (localStoreArray.IncidentID) {
                    setMainIncidentID(localStoreArray?.IncidentID);
                    get_Offence_Data(localStoreArray.IncidentID);
                    get_Incident_Count(localStoreArray.IncidentID)
                }
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
        setOffenceShowPage('home')
    }, [localStoreArray])

    const getScreenPermision = (LoginAgencyID, PinID) => {
        ScreenPermision("O036", LoginAgencyID, PinID).then(res => {
            if (res) {
                setEffectiveScreenPermission(res)
            } else {
                setEffectiveScreenPermission([])
            }
        });
    }

    console.log(localStore ,'session')
    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px',left:10 }}>Action</p>,
            cell: row => <>
                            <div className="div" style={{ position: 'absolute',left:10 }}>

                {
                    <Link to={'/mobile-offense'} onClick={() => { setEditVal(row); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button">
                        <i className="fa fa-edit"></i>
                    </Link>
                }
                </div>
            </>
        },
        {
            name: 'NIBRS Code',
            selector: (row) => row.FBIID_Description,
            sortable: true
        },
        {
            name: 'Offense',
            selector: (row) => row.OffenseName_Description,
            sortable: true
        },
        {
            name: 'Law Title',
            selector: (row) => row.LawTitle_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px',right:0 }}>Delete</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute',right:7 }}>
                    {
                        <Link to={'#'} onClick={() => { setCrimeId(row.CrimeID); setModalstatus(true) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1 new-button" data-toggle="modal" data-target="#myModal2">
                            <i className="fa fa-trash"></i>
                        </Link>
                    }
                </div>
            </>
        },
    ]

    const setEditVal = (row) => {

        console.log(row.CrimeID,'crimee')
        if (row.CrimeID) {
            get_Offence_Count(row.CrimeID)
            setCrimeId(row.CrimeID);
            setOffenceStatus(true);
            storeData({ 'OffenceID': row.CrimeID, 'OffenceStatus': true })
        }
        setUpdateCount(updateCount + 1)
        setIncStatus(true)
    }

    

    const DeleteOffence = () => {
        const val = {
            'CrimeID': crimeId,
            'DeletedByUserFK': '',
        }
        AddDeleteUpadate('Crime_FRW/Delete_Crime_FRW', val).then((res) => {
            toastifySuccess(res.Message);
            get_Offence_Data();
            setModalstatus(false)
            setCrimeId('');
        })
    }

    

    const CloseModal = () => {
        setModalstatus(false)
    }

    return (
        <>
            <div class="section-body view_page_design ">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12 px-2">
                        <div className="card Agency " style={{ borderRight: 'none', borderLeft: 'none', borderRadius: '0' }}>
                            <div className="card-body ">
                                <div className="row  ">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row">
                                            <div className="col-12  mobile__tabs" style={{ marginTop: '-18px', marginBottom: '-20px' }}>
                                                <MobileTab />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-12 px-3">
                        <div className="bg-line text-white py-1  px-0 d-flex justify-content-between align-items-center" >
                            <p className="p-0 m-0 pl-3 py-1 col-4" style={{ fontSize: '18px', }}>
                                Offense
                            </p>
                            {
                                EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                                <Link to={'/mobile-offense'} onClick={() => {
                                    deleteStoreData({ 'OffenceID': '', 'OffenceStatus': '' });
                                    // storeData({ 'OffenceStatus': false })
                                    setIncStatus(false); setOffenceStatus(false);
                                }} className="btn btn-sm bg-green text-white px-2 py-0" >
                                    <i className="fa fa-plus"></i>
                                </Link>
                                : <></>
                                : <Link to={'/mobile-offense'} onClick={() => {
                                    deleteStoreData({ 'OffenceID': '', 'OffenceStatus': '' });
                                    // storeData({ 'OffenceStatus': false })
                                    setIncStatus(false); setOffenceStatus(false);
                                }} className="btn btn-sm bg-green text-white px-2 py-0" >
                                    <i className="fa fa-plus"></i>
                                </Link>
                            }
                        </div>
                        <div className=" mt-1 mobile-datatable" >
                            <DataTable
                                columns={columns}
                                data={OffenceData}
                                dense
                                pagination
                                paginationPerPage={'5'}
                                paginationRowsPerPageOptions={[5]}
                                highlightOnHover
                                // subHeader
                                responsive
                                customStyles={tableCustomStyles}
                                className='mobile-datatable'
                                showPaginationBottom={5}
                                subHeaderComponent={''}
                                subHeaderAlign='left'
                            />
                        </div>
                    </div>
                </div>
            </div>
            {
                modalStatus ?
                    <div class="modal" id="myModal2" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s' }} data-backdrop="false">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div className="box text-center py-5">
                                    <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                                    <div className="btn-box mt-3">
                                        <button type="button" onClick={DeleteOffence} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                                        <button type="button" onClick={() => { CloseModal(); }} className="btn btn-sm btn-secondary ml-2 " > Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
        </>
    )
}

export default MobileOffense