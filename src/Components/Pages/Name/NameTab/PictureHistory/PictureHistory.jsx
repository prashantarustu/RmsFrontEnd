import React from 'react'
import { Link } from 'react-router-dom'

const PictureHistory = () => {
    return (
        <>

            <div className="col-12 col-md-12 mt-2" >
                <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Picture History</p>
                    {/* <div style={{ marginLeft: 'auto' }}>
                        <Link to='' className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#IdentificationModal">
                            <i className="fa fa-plus"></i>
                        </Link>
                    </div> */}
                </div>
                <div className="row mt-1">
                    <div className="col-12  mb-3">
                        <table className="w-100 table">
                            <tr className="border-bottom">
                                <th>Image</th>
                                <th>file name</th>
                                <th>date/time</th>
                            </tr>
                            <tr>
                                <td>Testing</td>
                                <td>Testing </td>
                                <td>10-10-2000</td>
                            </tr>

                        </table>
                    </div>

                </div>
            </div>
        </>
    )
}

export default PictureHistory