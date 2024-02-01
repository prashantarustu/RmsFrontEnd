import React from 'react'
import { Link } from 'react-router-dom';
import Select from "react-select";
const Property = () => {
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
            <p className="p-0 m-0">Property</p>
          </div>
        </div>
        <div className="row">
          <div className="col-6 col-md-6 col-lg-4 mt-2">
            <div className='dropdown__box'>
              <Select
                name='Property'
                styles={customStylesWithOutColor}
                isClearable
                options={''}
                placeholder="Select..."
                isMulti

              />
              <label htmlFor="">Property</label>
            </div>
          </div>
          <div className="col-2 col-md-6 col-lg-8    pl-3" style={{ marginTop: '22px' }}>
            <Link to=''>
              <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" >Save</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="col-12 mt-2 mb-3">
        <table className="w-100 table">
          <tr className="border-bottom">
            <th>property number</th>
            <th>property type</th>
            <th>property reason</th>
            <th>date reported</th>
            <th>property value</th>
            <th className='text-right'>Action</th>
          </tr>
          <tr>
            <td>Testing</td>
            <td>M</td>
            <td>03/24/23</td>
            <td>Testing</td>
            <td>Testing</td>
            <td className='text-right'>

              <button type='button' className="btn btn-sm bg-green text-white py-0 ml-1"><i className="fa fa-trash"></i>
              </button>
            </td>
          </tr>

        </table>
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

export default Property