import React from 'react'
import { Link } from 'react-router-dom'

const AuditLog = () => {
    return (
        <>
              <div className="col-12 col-md-12 pt-2 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Audit Log</p>
                    <div style={{ marginLeft: 'auto' }}>
                        {/* <Link to={''} className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#">
                            <i className="fa fa-plus"></i>
                        </Link> */}
                    </div>
                </div>
                <div className="row mt-1">
                    <div className="col-12  mb-3">
                        <div className="table-responsive">
                            <table className="table">
                                <tr className="border-bottom">
                                    <th>date/time</th>
                                    <th>log</th>
                                </tr>
                                <tr>
                                    <td>24/04/23</td>
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

export default AuditLog