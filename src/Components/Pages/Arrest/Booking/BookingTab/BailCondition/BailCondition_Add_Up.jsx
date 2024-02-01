import React from 'react'
import { customStylesWithOutColor } from '../../../../../Common/Utility'
import Select from "react-select";
const BailCondition_Add_Up = () => {
    return (
        <>
            <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="BailConditionModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            <div className="m-1 mt-3">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <legend style={{ fontWeight: 'bold' }}>Bail Condition</legend>
                                    <div className="row">
                                        <div className="col-12 col-md-4 col-lg-4 mt-1">
                                            <div className=" dropdown__box">
                                                <Select
                                                    name="bailcondition"
                                                    styles={customStylesWithOutColor}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                                <label htmlFor="">Condition Type</label>
                                            </div>
                                        </div>
                                        <div className="col-12  col-md-8 col-lg-8 pt-1">
                                            <div className="dropdown__box">
                                                <textarea name='ConditionDescription' id="ConditionDescription" cols="30" rows='1' className="form-control" ></textarea>
                                                <label htmlFor="" >Condition Description</label>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="btn-box text-right  mr-1 mb-2">
                            <button type="button" class="btn btn-sm btn-success mr-1">Save</button>
                            <button type="button" class="btn btn-sm btn-success mr-1" data-dismiss="modal" >Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BailCondition_Add_Up