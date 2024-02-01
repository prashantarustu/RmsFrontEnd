import React from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component';
import BailCondition_Add_Up from './BailCondition_Add_Up';
const BailCondition = () => {
    const columns = [
        {
            name: 'Condition Type',
            selector: 'Condition Type',
            sortable: true,
        },
        {
            name: 'Condition Description',
            selector: 'Condition Description',
            sortable: true,
        },

        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Action</p>,
            cell: row => <>
                <div className="div" style={{ position: 'absolute', top: 0, right: 48 }}>
                    <Link to={'#'} data-toggle="modal" data-target="#BailConditionModal" className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
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
            "Condition Type": "CCON",
            "Condition Description": "Criminal",
        },
    ]
    return (
        <>
            <div className="col-12 col-md-12 " >
                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">Bail Condition</p>
                    <p className="p-0 m-0">
                        <Link to={''} data-toggle="modal" data-target="#BailConditionModal" className="btn btn-sm bg-green text-white px-2 py-0" >
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
            <BailCondition_Add_Up />
        </>
    )
}

export default BailCondition