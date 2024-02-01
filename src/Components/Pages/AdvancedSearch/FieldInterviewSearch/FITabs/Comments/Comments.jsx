import React from 'react'
import { Link } from 'react-router-dom'
import CommentsAddUpdate from './CommentsAddUpdate'
import DataTable from 'react-data-table-component';

const Comments = () => {
    const columns = [
        {
            name: 'Comment',
            selector: 'Comment',
            sortable: true,
        },
        {
            name: 'Date/Time',
            selector: 'Date/Time',
            sortable: true,
        },
       
        {
            name: 'Officer',
            selector: 'Officer',
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
            "Comment": "Comments Test",
            "Date/Time": "08/20/2015 08:34:17",
            "Officer": "..."
        },
    ]
    return (
        <>
            <div className="tab-pane fade" id="Comments">
                <div className="row">
                    <div className="col-12 col-md-12 mb-2 p-0" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">Comments</p>
                            <p className="p-0 m-0">
                                <Link to={'#'} data-toggle="modal" data-target="#CommentsModal" className="btn btn-sm bg-green text-white px-2 py-0" >
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

                <CommentsAddUpdate />
            </div>
        </>
    )
}

export default Comments