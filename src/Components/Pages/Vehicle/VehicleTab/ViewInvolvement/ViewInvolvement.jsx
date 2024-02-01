import React from 'react'
import { Link } from 'react-router-dom'

const ViewInvolvement = () => {
    
    return (
        <>
            <div className="col-12 col-md-12 pt-1 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">View Involvements</p>
                    
                    {/* <div style={{ marginLeft: 'auto' }}>
                        <Link to="" className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#">
                            <i className="fa fa-plus"></i>
                        </Link>
                    </div> */}
                </div>
                <div className="row ">
                    <div className="col-12  mb-3">
                        <div className="table-responsive">
                            <table className="table">
                                <tr className="border-bottom">
                                    <th>transaction name</th>
                                    <th>transaction id</th>
                                    <th>loss code</th>
                                    <th>reported date/time</th>
                                    <th>property value</th>
                                    <th>expiration date</th>
                                </tr>
                                <tr>
                                    <td>Testing </td>
                                    <td>Testing </td>
                                    <td>Testing </td>
                                    <td>Testing </td>
                                    <td>Testing </td>
                                    <td>Testing </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewInvolvement