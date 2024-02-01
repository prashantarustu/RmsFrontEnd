import React from 'react'
import { Link } from 'react-router-dom';
import Select from "react-select";
const InjuryType = () => {
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
    return (
        <>
            <div className="col-12 " id='display-not-form'>
                <div className="col-12 col-md-12 mt-2 pt-1 p-0" >
                    <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0">Injury Type</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6 col-md-6 col-lg-4 mt-2">
                        <div className='dropdown__box'>
                            <Select
                                name='injurytype'
                                styles={customStylesWithOutColor}
                                isClearable
                                options={''}
                                placeholder="Select..."
                                isMulti
                            />
                            <label htmlFor="">Injury Type</label>
                        </div>
                    </div>
                    <div className="col-2 col-md-6 col-lg-8  pl-3" style={{ marginTop: '22px' }}>
                        <Link to=''>
                            <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" >Save</button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="col-12">
                {/* <DataTable
          columns={''}
          dense
          pagination
        /> */}
                {/* <p>Testing</p> */}
            </div>
        </>
    )
}

export default InjuryType