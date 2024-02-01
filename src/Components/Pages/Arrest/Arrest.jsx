import React from 'react'
import Tab from '../../Utility/Tab/Tab';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AgencyContext } from '../../../Context/Agency/Index';
import { useEffect } from 'react';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name, Encrypted_Id_Name } from '../../Common/Utility';
import { toastifySuccess } from '../../Common/AlertMsg';
import { AddDeleteUpadate } from '../../hooks/Api';
import DeletePopUpModal from '../../Common/DeleteModal';
import ThreeFilter from '../../Filter/ThreeFilter';

const Arrest = () => {

    const { localStoreArray, setIncStatus, get_LocalStorage, setLocalStoreArray, get_Incident_Count, updateCount, setUpdateCount, arrestData, get_Data_Arrest, setIncidentStatus, arrestFilterData, setArrestFilterData, get_Arrest_Count, deleteStoreData, storeData, arrestStatus, setArrestStatus, } = useContext(AgencyContext)

    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [arrestID, setArrestID] = useState();
    const [MainIncidentID, setMainIncidentID] = useState('');
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', IncidentStatus: '', IncidentNumber: '', }),
    }

    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID || !localStoreArray.IncidentID || !localStoreArray.IncidentStatus) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                if (localStoreArray?.IncidentID) {
                    setMainIncidentID(localStoreArray?.IncidentID); get_Data_Arrest(localStoreArray?.IncidentID);
                } else {
                    setMainIncidentID('')
                }
            }
            setIncidentStatus(true);
        }
    }, [localStoreArray])

    const columns = [
        {
            width: '120px',
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                            <Link to={'/arresttab'} onClick={(e) => set_Edit_Value(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                                <i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <Link to={'/arresttab'} onClick={(e) => set_Edit_Value(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                                <i className="fa fa-edit"></i>
                            </Link>
                    }
                </div>
            </>
        },
        {
            width: '150px',
            name: 'Arrest Number',
            selector: (row) => row.ArrestNumber,
            sortable: true
        },
        {
            width: '150px',
            name: 'Agency Name',
            selector: (row) => row.Agency_Name,
            sortable: true
        },
        {
            width: '200px',
            name: 'Supervisor Name',
            // selector: (row) => row.Supervisor_Name,
            selector: (row) => <>{row?.Supervisor_Name ? row?.Supervisor_Name.substring(0, 60) : ''}{row?.Supervisor_Name?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'PoliceForce Description',
            selector: (row) => row.PoliceForce_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
            cell: row => <>
                {/* {
                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
                        <Link to={'/arresttab'} onClick={(e) => set_Edit_Value(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                            <i className="fa fa-edit"></i>
                        </Link>
                        : <></>
                        : <Link to={'/arresttab'} onClick={(e) => set_Edit_Value(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                            <i className="fa fa-edit"></i>
                        </Link>
                } */}
                <div style={{ position: 'absolute', top: 4, right: 3 }}>
                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} onClick={() => setArrestID(row.ArrestID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={`#`} onClick={() => setArrestID(row.ArrestID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                    }
                </div>
            </>
        }
    ]

    const set_Edit_Value = (e, row) => {
        setIncStatus(true);
        setArrestStatus(true);
        if (row.ArrestID) {
            // console.log(row)
            setArrestID(row.ArrestID);
            get_Arrest_Count(row.ArrestID);
            storeData({ 'ArrestID': row.ArrestID, 'ArrestStatus': true, 'ArrestNumber': row.ArrestNumber })
        }
        setUpdateCount(updateCount + 1)
    }

    const DeleteArrest = () => {
        const val = {
            'ArrestID': arrestID,
            'DeletedByUserFK': LoginPinID
        }
        AddDeleteUpadate('Arrest/Delete_Arrest', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Data_Arrest(MainIncidentID);
                get_Incident_Count(MainIncidentID)
                get_Arrest_Count(arrestID);
            } else console.log("Somthing Wrong");
        })
    }

    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row  ">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row">
                                            <div className="col-12 pl-3  inc__tabs">
                                                <Tab />
                                            </div>
                                            <div className="col-12  mt-2">
                                                <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                                    <p className="p-0 m-0">Arrest</p>
                                                    <p className="p-0 m-0">
                                                        <Link to={'/arresttab'} className="btn btn-sm bg-green text-white px-2 py-0" onClick={() => {
                                                            setIncStatus(false); setArrestStatus(false);
                                                            get_Arrest_Count('0');
                                                            deleteStoreData({ 'ArrestID': '', 'ArrestStatus': '' });
                                                            // storeData({ 'ArrestStatus': false })
                                                        }}>
                                                            <i className="fa fa-plus"></i>
                                                        </Link>
                                                    </p>
                                                </div>
                                                <DataTable
                                                    dense
                                                    columns={columns}
                                                    data={arrestFilterData}
                                                    pagination
                                                    selectableRowsHighlight
                                                    highlightOnHover
                                                    subHeader
                                                    responsive
                                                    showPaginationBottom={10}
                                                    subHeaderComponent={<ThreeFilter Data={arrestData} setResult={setArrestFilterData} Col1='ArrestNumber' Col2='Agency_Name' Col3='Supervisor_Name' searchName1='Arrest Number' searchName2='Agency Name' searchName3='Supervisor Name' />}
                                                    subHeaderAlign='left'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DeletePopUpModal func={DeleteArrest} />
        </>
    )
}

export default Arrest