import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Select from "react-select";
import { colourStyles, customStylesWithOutColor } from '../../../../../Common/Utility';
import NameAddUpdate from './NameAddUpdate';

const Name = () => {

    const [modal, setModal] = useState(true);

    const columns = [
        {
            name: 'Fullname',
            selector: 'Fullname',
            sortable: true,
        },
        {
            name: 'Gender',
            selector: 'Gender',
            sortable: true,
        },
        {
            name: 'Date of Birth',
            selector: 'Date of Birth',
            sortable: true,
        },
        {
            name: 'Race',
            selector: 'Race',
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
            "Fullname": "Dev Test",
            "Gender": "Male",
            "Date of Birth": "04/30/2000",
            "Race": "..."
        },
    ]
    
    return (
        <>
            <div className="tab-pane fade" id="Names">
                <div className="row">
                    <div className="col-12 col-md-12 mb-2 p-0" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">Name</p>
                            <p className="p-0 m-0">
                                <Link to={'#'} data-toggle="modal" data-target="#OpenModal" className="btn btn-sm bg-green text-white px-2 py-0" >
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

               <NameAddUpdate />

            </div>
        </>
    )
}

export default Name