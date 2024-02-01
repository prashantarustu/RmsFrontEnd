import React from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component';

const Drug = () => {
    return (
        <>
            <div className="col-12 col-md-12 pt-2 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Drug</p>
                    <div style={{ marginLeft: 'auto' }}>
                        <Link to="" className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#DrugModal">
                            <i className="fa fa-plus"></i>
                        </Link>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-12">
                        <DataTable
                            dense
                            pagination
                            highlightOnHover
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Drug