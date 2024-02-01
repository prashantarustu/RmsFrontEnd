import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { AddDeleteUpadate, ScreenPermision } from '../../hooks/Api';
import { Decrypt_Id_Name, Encrypted_Id_Name } from '../../Common/Utility';
import DeletePopUpModal from '../../Common/DeleteModal';
import { toastifySuccess } from '../../Common/AlertMsg';
import { useContext } from 'react';
import { AgencyContext } from '../../../Context/Agency/Index';
import ThreeFilter from '../../Filter/ThreeFilter';

const Offense = () => {

    const { get_Incident_Count, incidentNumber, setIncidentNumber, setIncidentCount, setIncStatus, get_Offence_Data, setTabCount, crimeId, setCrimeId, offenceData, updateCount, setUpdateCount, offenceFillterData, setOffenceFillterData, get_Offence_Count, setIncidentStatus, offenceShowPage, setOffenceShowPage, localStoreArray, setLocalStoreArray, get_LocalStorage, offenceStatus, setOffenceStatus, deleteStoreData, storeData } = useContext(AgencyContext);

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

    // Onload Function
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

    const columns = [
        {
            width: '120px',
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={'/OffenseHome'} onClick={(e) => setEditVal(row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                                <i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <Link to={'/OffenseHome'} onClick={(e) => setEditVal(row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
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
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, right: 5 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} onClick={(e) => setCrimeId(row.CrimeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={`#`} onClick={(e) => setCrimeId(row.CrimeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                    }
                </div>
            </>
        }
    ]

    const setEditVal = (row) => {
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
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate('Crime/Delete_Offense', val).then((res) => {
            toastifySuccess(res.Message);
            get_Incident_Count(MainIncidentID)
            get_Offence_Data(MainIncidentID);
        })
    }

    return (
        <>
            <div className="col-md-12 mt-1">
                <div className="row">
                    <div className="col-md-12">
                        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0">Offense</p>
                            <p className="p-0 m-0">
                                {
                                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                                        <Link to={'/OffenseHome'} onClick={() => {
                                            deleteStoreData({ 'OffenceID': '', 'OffenceStatus': '' });
                                            // storeData({ 'OffenceStatus': false })
                                            setIncStatus(false); setOffenceStatus(false);
                                        }} className="btn btn-sm bg-green text-white px-2 py-0" >
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                        : <></>
                                        : <Link to={'/OffenseHome'} onClick={() => {
                                            deleteStoreData({ 'OffenceID': '', 'OffenceStatus': '' });
                                            // storeData({ 'OffenceStatus': false })
                                            setIncStatus(false); setOffenceStatus(false);
                                        }} className="btn btn-sm bg-green text-white px-2 py-0" >
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                }
                            </p>
                        </div>
                        <div className="col-12 ">
                            <DataTable
                                dense
                                columns={columns}
                                // data={offenceData}
                                data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? offenceFillterData : '' : offenceFillterData}
                                pagination
                                selectableRowsHighlight
                                highlightOnHover
                                noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                subHeader
                                responsive
                                showPaginationBottom={10}
                                subHeaderComponent={<ThreeFilter Data={offenceData} setResult={setOffenceFillterData} Col1='FBIID_Description' Col2='OffenseName_Description' Col3='LawTitle_Description' searchName1='NIBRS Code' searchName2='Offense' searchName3='LawTitle' />}
                                subHeaderAlign='left'
                            />
                        </div>
                    </div>
                </div>
            </div>
            <DeletePopUpModal func={DeleteOffence} />
        </>
    )
}

export default Offense