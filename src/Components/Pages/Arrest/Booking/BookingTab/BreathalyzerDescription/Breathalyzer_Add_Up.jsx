import React from 'react'

const Breathalyzer_Add_Up = () => {
    return (
        <>
            <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="BreathalyzerModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                <div class="modal-dialog modal-dialog-centered modal-md" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            <div className="m-1 mt-3">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <legend style={{ fontWeight: 'bold' }}>Breathalyzer Result</legend>
                                    <div className="row">
                                        <div className="col-12 col-md-12 col-lg-12 mt-1">
                                            <div class="text-field">
                                                <input type="text" name='Breathalyzer' id='Breathalyzer' className='' required />
                                                <label >Breathalyzer Description</label>
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

export default Breathalyzer_Add_Up