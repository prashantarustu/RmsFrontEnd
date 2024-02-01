import React from 'react'
import Select from "react-select";
import { customStylesWithOutColor } from '../../../../Common/Utility';
const Weopon = () => {
    return (
        <>
            <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                    <p className="p-0 m-0">Weapon</p>
                </div>
                <div className="row">

                    <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='Style' id='Style' required />
                            <label htmlFor="">Style</label>
                        </div>
                    </div>
                    <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='Finish' id='Finish' required />
                            <label htmlFor="">Finish</label>
                        </div>
                    </div>
                    <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='Caliber' id='Caliber' required />
                            <label htmlFor="">Caliber</label>
                        </div>
                    </div>
                    <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='Handle' id='Handle' required />
                            <label htmlFor="">Handle</label>
                        </div>
                    </div>
                    <div className="col-3  col-md-3 col-lg-1  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='SerialID' id='SerialID' required />
                            <label htmlFor="">Serial Id</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='MakeID'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label>Make</label>
                        </div>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 mt-1">
                        <div className=" dropdown__box">
                            <Select
                                name='WeaponModelID'
                                styles={customStylesWithOutColor}
                                isClearable
                                placeholder="Select..."
                            />
                            <label>Model Id</label>
                        </div>
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-4">
                        <div class="form-check ">
                            <input class="form-check-input" type="checkbox" name='auto' id="flexCheckDefault" />
                            <label class="form-check-label" name='IsAuto' id='IsAuto' for="flexCheckDefault">
                                Auto
                            </label>
                        </div>
                    </div>
                    <div className="col-3  col-md-3 col-lg-3  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='ManufactureYear' required />
                            <label htmlFor="">Manufacture Year</label>
                        </div>
                    </div>
                    <div className="col-3  col-md-3 col-lg-2  mt-1 pt-1" >
                        <div className="text-field">
                            <input type="text" name='BarrelLength' required />
                            <label htmlFor="">Barrel Length</label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Weopon