import React from 'react'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'



const VehiclePawn = () => {


    return (
        <>
            <div className="col-12 mt-3">
                <div className="bg-green text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                    <p className="p-0 m-0 d-flex align-items-center">
                        Vehicle
                    </p>
                    <p className="p-0 m-0">
                        <Link to="/vehicletab?page=VehiclePawn" className="text-white"
                            data-toggle="modal" data-target="#PawnModal" >
                            <i className="fa fa-plus"></i>
                        </Link>
                    </p>
                </div>
                <div className="table-responsive mt-2">
                    <div className="col-12">
                        <div className="row ">
                            <div className="col-12">
                                <DataTable
                                    // columns={columns}
                                    // data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? filterDataList : '' : ''}
                                    dense
                                    paginationPerPage={'10'}
                                    paginationRowsPerPageOptions={[5, 10, 15]}
                                    highlightOnHover
                                    noContextMenu
                                    pagination
                                    responsive
                                    subHeaderAlign="right"
                                    // fixedHeader
                                    subHeaderWrap
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VehiclePawn