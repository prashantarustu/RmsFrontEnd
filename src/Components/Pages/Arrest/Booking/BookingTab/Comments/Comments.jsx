import React from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component';
import Comments_Add_Up from './Comments_Add_Up';
const Comments = () => {
    const columns = [
        {
            name: 'Comments',
            selector: 'Comments',
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
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Action</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 0, right: 48 }}>
                    <Link to={'#'} data-toggle="modal" data-target="#CommentsModal" className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                        <i className="fa fa-edit"></i>
                    </Link>
                    <Link to={'#'} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                        <i className="fa fa-trash"></i>
                    </Link>
                </div>
            </>
        }

    ];
    const data = [
        {
            "Comments": "CCON",
            "Date/Time": "05-07-2023",
            "Officer": "Criminal",
        },
    ]
    return (
        <>
            <div className="col-12 col-md-12 " >
                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">Comments</p>
                    <p className="p-0 m-0">
                        <Link to={''} data-toggle="modal" data-target="#CommentsModal" className="btn btn-sm bg-green text-white px-2 py-0" >
                            <i className="fa fa-plus"></i>
                        </Link>
                    </p>
                </div>
                <DataTable
                    dense
                    columns={columns}
                    data={data}
                    pagination
                    selectableRowsHighlight
                    highlightOnHover
                />
            </div>
            <Comments_Add_Up />
        </>
    )
}

export default Comments