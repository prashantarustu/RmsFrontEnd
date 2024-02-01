import React, { useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select";

const Name = () => {
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()

    // Custom Style   
    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };
    // custuom style withoutColor
    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const columns = [
        {
            name: 'Full Name',
            selector: (row) => row.FullName,
            sortable: true
        },
        {
            name: 'Gender',
            selector: (row) => row.Gender,
            sortable: true
        },
        {
            name: 'Date Of Birth',
            selector: (row) => row.Dob,
            sortable: true
        },
        {
            name: 'Race',
            selector: (row) => row.Race,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
            cell: row => <>

                {
                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                        <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                            <i className="fa fa-trash"></i>
                        </Link>
                        : <></>
                        : <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                            <i className="fa fa-trash"></i>
                        </Link>
                }
            </>
        }
    ]
    return (
        <>
            <div className="col-12 col-md-12 pt-2 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Name</p>
                </div>
                <div className="row mt-1">
                    <div className="col-6 col-md-6 col-lg-4 mt-2">
                        <div className=" dropdown__box">
                            <Select
                                name='CriminalID'
                                styles={colourStyles}
                                isClearable
                                placeholder="Select.."
                            />
                            <label htmlFor="">Name</label>
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-8 p-0" style={{ marginTop: '3px' }}>
                        <div className="col-6 col-md-6 col-lg-8 mt-3 pt-1 p-0">
                            <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" >Save</button>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <DataTable
                        columns={columns}
                        dense
                        pagination
                        selectableRowsHighlight
                        highlightOnHover
                        noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    />

                </div>
            </div>
        </>
    )
}

export default Name