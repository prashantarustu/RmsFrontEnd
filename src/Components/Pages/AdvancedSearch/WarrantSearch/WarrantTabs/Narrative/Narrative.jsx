import React from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component';
import NarrativeAddUpdate from './NarrativeAddUpdate';
const Narrative = () => {
    const columns = [
        {
            name: 'Narrative',
            selector: 'Narrative',
            sortable: true,
        },
        {
            name: 'Reported By',
            selector: 'Reported By',
            sortable: true,
        },
        {
            name: 'As of Date',
            selector: 'As of Date',
            sortable: true,
        },
        {
            name: 'Type',
            selector: 'Type',
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
            "Narrative": "Dev Test",
            "Reported By": "Male",
            "As of Date": "04/30/2000",
            "Type": "..."
        },
    ]
    return (
        <>
            <div className="tab-pane fade" id="Narrative">
                <div className="row">
                    <div className="col-12 col-md-12 mb-2 p-0" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">Narrative</p>
                            <p className="p-0 m-0">
                                <Link to={'#'}  data-toggle="modal" data-target="#NarrativeModal" className="btn btn-sm bg-green text-white px-2 py-0" >
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
                <NarrativeAddUpdate />
            </div>
        </>
    )
}

export default Narrative