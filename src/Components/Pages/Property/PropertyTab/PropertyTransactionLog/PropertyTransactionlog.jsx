import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import DataTable from 'react-data-table-component';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Link, useLocation } from 'react-router-dom';
import { Decrypt_Id_Name, Encrypted_Id_Name } from '../../../../Common/Utility';
import { fetchPostData } from '../../../../hooks/Api';

const PropertyTransactionlog = () => {

    const { setNameStatus, setNameData, nameData, localStoreArray, setLocalStoreArray, get_LocalStorage, setIncidentStatus } = useContext(AgencyContext);
    // const { nameFilterData } = useContext(AgencyContext)

    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    const [TransactionData, setTransactionData] = useState([]);
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();

    const [propertyID, setPropertyID] = useState();
    const [masterPropertyID, setMasterPropertyID] = useState('');

    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID || !localStoreArray.IncidentID || !localStoreArray.IncidentStatus) {
            get_LocalStorage();
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setPropertyID(localStoreArray.PropertyID)
                if (localStoreArray.MasterPropertyID) Get_TransactionData(localStoreArray?.MasterPropertyID);
            }
            setIncidentStatus(true);
        }
    }, [localStoreArray])

    const Get_TransactionData = (masterPropertyID) => {
        const val = {
            'MasterNameID': masterPropertyID,
        }
        fetchPostData('TransactionLog/GetData_TransactionLog', val).then((res) => {
            if (res) {
                setTransactionData(res)
            } else {
                setTransactionData();
            }
        })
    }

    const columns = [
        {
            width: '120px',
            name: 'Full Name',
            // selector: (row) => row.LastName + ' ' + row.FirstName + ',' + row.MiddleName,
            selector: (row) => row.Name,
            // selector: (row) => <>{row?.FirstName ? row?.FirstName.substring(0, 10) : ''}{row?.FirstName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            width: '180px',
            name: 'Transaction Name',
            selector: (row) => row.TransactionName,
            sortable: true
        },
        {
            width: '180px',
            name: 'Transaction Number',
            selector: (row) => row.TransactionNumber,
            sortable: true
        },
        {
            width: '100px',
            name: 'DOB',
            selector: (row) => row.DOB,
            sortable: true
        },
        {
            width: '90px',
            name: 'Age',
            selector: (row) => row.Age,
            sortable: true
        },
        {
            width: '100px',
            name: 'Race',
            selector: (row) => row.Race,
            sortable: true
        },
        {
            width: '130px',
            name: 'Reason Code',
            selector: (row) => <>{row?.ReasonCode ? row?.ReasonCode.substring(0, 10) : ''}{row?.ReasonCode?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 0 }}>Action</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 4, right: 4 }}>

                    {
                        EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                            <>
                                <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={(e) => set_IncidentId(row)} className="btn btn-sm bg-green text-white px-1 py-0" >
                                    <i className="fa fa-eye"></i>
                                </Link>
                            </>
                            : <></>
                            :
                            <>
                                <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={(e) => set_IncidentId(row)} className="btn btn-sm bg-green text-white px-1 py-0" >
                                    <i className="fa fa-eye"></i>
                                </Link>

                            </>
                    }
                </div>
            </>
        },
    ]

    const set_IncidentId = (row) => {
        let newData = [...nameData];

        let currentItem = newData.find((item) => row.NameID === item.NameID || row.MasterNameID === item.MasterNameID);

        if (!currentItem) {
            newData.push(row);
        }
        setNameData(newData);
        setNameStatus(true);
        if (row.NameID || row.MasterNameID) {
            // sessionStorage.setItem("NameID", Encrypted_Id_Name(row.NameID, 'NForNameId'));
            // sessionStorage.setItem("MasterNameID", Encrypted_Id_Name(row.MasterNameID, 'MForMasterNameID'));
        }
        sessionStorage.setItem('nameStatus', true)
    }

    return (
        <>
            <div className="col-md-12 mt-2">
                <div className="bg-line text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">
                        Transaction Log
                    </p>
                </div>
                <div className="col-12">
                    <DataTable
                        dense
                        columns={columns}
                        data={TransactionData}
                        pagination
                        selectableRowsHighlight
                        highlightOnHover
                        responsive
                        showPaginationBottom={10}
                    />
                </div>
            </div>
        </>
    )
}

export default PropertyTransactionlog