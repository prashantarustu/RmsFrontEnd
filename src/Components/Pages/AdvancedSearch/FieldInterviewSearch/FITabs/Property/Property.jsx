import React from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component';
import PropertyAddUpdate from './PropertyAddUpdate';

const Property = () => {
    const columns = [
        {
            name: 'Property Ticket',
            selector: 'Property Ticket',
            sortable: true,
        },
        {
            name: 'Property Type',
            selector: 'Property Type',
            sortable: true,
        },
        {
            name: 'Property Reason',
            selector: 'Property Reason',
            sortable: true,
        },
        {
            name: 'Description',
            selector: 'Description',
            sortable: true,
        },
        {
            name: 'Classification',
            selector: 'Classification',
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
            "Property Ticket": "Dev Test",
            "Property Type": "Vehicle",
            "Property Reason": "Dummy",
            "Description": "Desc Test",
            "Classification": "Testing",
        },
    ]
    return (
        <>
            <div className="tab-pane fade" id="Property">
                <div className="row">
                    <div className="col-12 col-md-12 mb-2 p-0" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">Property</p>
                            <p className="p-0 m-0">
                                <Link to={'#'}  data-toggle="modal" data-target="#PropertyModal" className="btn btn-sm bg-green text-white px-2 py-0" >
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
                <PropertyAddUpdate />
            </div>

        </>
    )
}

export default Property