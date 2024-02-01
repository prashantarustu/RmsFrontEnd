import React from 'react'
import Select from "react-select";
import { customStylesWithOutColor } from '../../../../Common/Utility';

const Other = () => {
    return (
        <>
            <div className="col-12 col-md-12 col-lg-12 mt-2" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Other</p>
                </div>
                <div className="row">
                    <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='Brand' id='Brand' required />
                            <label htmlFor="">Brand</label>
                        </div>
                    </div>
                    <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='SerialID' id='SerialID' required />
                            <label htmlFor="">Serial Id</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='TopColorID'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label>Top Color</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-6 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='BottomColorID'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label>Bottom Color</label>
                        </div>
                    </div>
                    <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='ModelID' id='ModelID' required />
                            <label htmlFor="">Model Id</label>
                        </div>
                    </div>
                    <div className="col-3  col-md-6 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='Quantity' id='Quantity' required />
                            <label htmlFor="">Quantity</label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Other