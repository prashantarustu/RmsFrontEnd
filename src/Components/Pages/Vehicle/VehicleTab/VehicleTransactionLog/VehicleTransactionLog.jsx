import React, { useState } from 'react'
import { useContext } from 'react';
import DataTable from 'react-data-table-component';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Link, useLocation } from 'react-router-dom';

const VehicleTransactionLog = () => {

    const { nameFilterData } = useContext(AgencyContext);

    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    const columns = [
        {
            width: '120px',
            name: 'Full Name',
            selector: (row) => row.LastName + ' ' + row.FirstName + ',' + row.MiddleName,
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
                                <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} className="btn btn-sm bg-green text-white px-1 py-0" >
                                    <i className="fa fa-eye"></i>
                                </Link>
                            </>
                            : <></>
                            :
                            <>
                                <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} className="btn btn-sm bg-green text-white px-1 py-0" >
                                    <i className="fa fa-eye"></i>
                                </Link>
                            </>
                    }
                </div>
            </>
        },
    ]

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
                        data={nameFilterData}
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

export default VehicleTransactionLog