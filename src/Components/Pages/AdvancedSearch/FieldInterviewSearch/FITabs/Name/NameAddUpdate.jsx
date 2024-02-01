import React from 'react'
import Select from "react-select";
import { colourStyles } from '../../../../../Common/Utility';

const NameAddUpdate = () => {
    return (
        <>
            <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="OpenModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                <div class="modal-dialog modal-dialog-centered" role="document" >
                    <div class="modal-content">
                        <div class="modal-body">
                            <div className="mt-2">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <legend style={{ fontWeight: 'bold' }}>Name</legend>
                                    <div className="row">
                                        <div class="col-12 col-md-12 mb-1 dropdown__box">
                                            <Select
                                                name='ContactTypeID'
                                                styles={colourStyles}
                                                isClearable
                                                placeholder="Select..."
                                            />
                                            {/* <label htmlFor='' className='mt-1'>Name</label> */}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="btn-box text-right mr-2 mb-2">
                            <button type="button" className="btn btn-sm btn-success mr-1">Save</button>
                            <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" >Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NameAddUpdate