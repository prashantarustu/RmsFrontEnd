import React from 'react'
import Select from "react-select";

const Connection_Add_Up = () => {

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

    return (
        <>
            <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="ConnectionModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                    <div class="modal-content">
                        <div class="modal-body">
                            <div className="m-1">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <legend style={{ fontWeight: 'bold' }}>Connection</legend>
                                    <div className="col-12 col-md-12  p-0" >
                                        <div className="row ">
                                            <div className="col-6 col-md-6 col-lg-6 ">
                                                <div className=" dropdown__box">
                                                    <Select
                                                        name='name'
                                                        styles={customStylesWithOutColor}
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                    <label>Name</label>
                                                </div>
                                            </div>
                                            <div className="col-6 col-md-6 col-lg-6 ">
                                                <div className=" dropdown__box">
                                                    <Select
                                                        name='relationship'
                                                        styles={customStylesWithOutColor}
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                    <label>Relationship</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="btn-box text-right  mr-1 mb-2">
                            <button type="button" class="btn btn-sm btn-success mr-1">Save</button>
                            <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Connection_Add_Up