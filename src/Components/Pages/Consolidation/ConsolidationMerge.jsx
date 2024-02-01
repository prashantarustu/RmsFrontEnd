import React from 'react'
import { Link } from 'react-router-dom'

const ConsolidationMerge = () => {
    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 col-md-12 mb-2 p-0" >
                                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                            <p className="p-0 m-0 d-flex align-items-center">Consolidation Merge</p>
                                        </div>
                                    </div>

                                    <div class="col-12">
                                        <table class="table table-striped">
                                            <thead >
                                                <tr>
                                                    <th>
                                                        Fields

                                                    </th>
                                                    <th>
                                                        Record 1
                                                    </th>
                                                    <th>
                                                        Record 2
                                                    </th>
                                                    <th>
                                                        Merge Record
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        First Name
                                                    </td>
                                                    <td>
                                                        Testing
                                                        <span className='ml-3'>
                                                            <input type="checkbox" name="" id="" />
                                                        </span>
                                                    </td>
                                                    <td>
                                                        User
                                                        <span className='ml-3'>
                                                            <input type="checkbox" name="" id="" />
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Middle Name
                                                    </td>
                                                    <td>
                                                        Testing
                                                        <span className='ml-3'>
                                                            <input type="checkbox" name="" id="" />
                                                        </span>
                                                    </td>
                                                    <td>
                                                        User

                                                        <span className='ml-3'>
                                                            <input type="checkbox" name="" id="" />
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Last Name
                                                    </td>
                                                    <td>
                                                        Testing
                                                        <span className='ml-3'>
                                                            <input type="checkbox" name="" id="" />
                                                        </span>
                                                    </td>
                                                    <td>
                                                        User

                                                        <span className='ml-3'>
                                                            <input type="checkbox" name="" id="" />
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        Suffix
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        DOB
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        DL Number
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className=" text-right col-12 col-md-12  col-lg-12 ">
                                        <Link to={'/Consolidation'}>

                                            <button type="button" className="btn btn-sm btn-success  mr-1" data-dismiss="modal" >Close</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ConsolidationMerge