import React from 'react'
import Select from "react-select";

const Picture_Add_Up = () => {

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
            <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="PictureModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                    <div class="modal-content">
                        <div class="modal-body">
                            <div className="m-1 mt-3">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <legend style={{ fontWeight: 'bold' }}>Picture</legend>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12 col-md-12 col-lg-9 pt-2 " >
                                                    <div className="row">
                                                        <div className="col-12 col-md-12 col-lg-12 ">
                                                            <div className=" dropdown__box">
                                                                <Select
                                                                    name='imagecategory'
                                                                    styles={customStylesWithOutColor}
                                                                    isClearable
                                                                    options={''}
                                                                    placeholder="Select..."
                                                                />
                                                                <label htmlFor="">Image Category</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-md-12 col-lg-12 mt-3">
                                                            <div className="text-field">
                                                                <textarea name="comments" id="comments" cols="30" rows="6" required></textarea>
                                                                <label>Comments</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-5 col-md-4 col-lg-3 pt-3">
                                                    <div className="img-box" >
                                                        <label className="picture" >
                                                            <span className="picture__image"></span>
                                                        </label>
                                                        <input type="file" name="picture__input" id="picture__input" />
                                                    </div>
                                                    <button type="button" data-toggle="modal" data-target="#" className="btn btn-sm btn-success ml-5">Clear</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="btn-box text-right mt-3 mr-1 mb-2">
                            <button type="button"  class="btn btn-sm btn-success mr-1">Save</button>
                            <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" >Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Picture_Add_Up