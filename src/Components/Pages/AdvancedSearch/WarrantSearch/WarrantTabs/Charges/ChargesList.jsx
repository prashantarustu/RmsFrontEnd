import React from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component';
const ChargesList = () => {
    const columns = [
        {
            name: 'Charges Code',
            selector: 'Charges Code',
            sortable: true,
        },
        {
            name: 'Charges Description',
            selector: 'Charges Description',
            sortable: true,
        },
        {
            name: 'Incident',
            selector: 'Incident',
            sortable: true,
        },
        {
            name: 'Arrest',
            selector: 'Arrest',
            sortable: true,
        },
        {
            name: 'Warrant',
            selector: 'Warrant',
            sortable: true,
        },
        {
            name: 'Citation',
            selector: 'Citation',
            sortable: true,
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                <Link to={'#'} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                    <i className="fa fa-edit"></i>
                </Link>
                <Link to={'#'} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                    <i className="fa fa-trash"></i>
                </Link>

            </>
        }

    ];
    const data = [
        {
            "Charges Code": "CCON",
            "Charges Description": "Criminal",
            "Incident": "...",
            "Arrest": "...",
            "Warrant": "WAR-150000",
            "Citation": "...",
        },
    ]
    return (
        <>
            <div className="tab-pane fade" id="Charges">
                <div className="row">
                    <div className="col-12 col-md-12 mb-2 p-0" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">Charges</p>
                            <p className="p-0 m-0">
                                <Link to={'/charges'}  data-toggle="modal" data-target="#ChargesModal" className="btn btn-sm bg-green text-white px-2 py-0" >
                                    <i className="fa fa-plus"></i>
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="col-12">
                        <DataTable
                            dense
                            columns={columns}
                            data={data}
                            pagination
                            selectableRowsHighlight
                            highlightOnHover
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChargesList