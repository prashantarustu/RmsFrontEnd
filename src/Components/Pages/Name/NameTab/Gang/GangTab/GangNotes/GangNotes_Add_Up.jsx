import React from 'react'

const GangNotes_Add_Up = () => {
    return (
        <>

            <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="GangNotesModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="false">
                <div class="modal-dialog modal-dialog-centered modal-lg" role="document" >
                    <div class="modal-content">
                        <div class="modal-body">
                            <div className="m-1">
                                <fieldset style={{ border: '1px solid gray' }}>
                                    <legend style={{ fontWeight: 'bold' }}>Gang Notes</legend>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12 col-md-12 col-lg-12 ">
                                                    <div className="text-field">
                                                        <textarea name="Notes" id="Notes" cols="30" rows="6" required></textarea>
                                                        <label>Notes</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="btn-box text-right mt-3 mr-1 mb-2">
                            <button type="button" class="btn btn-sm btn-success mr-1">Save</button>
                            <button type="button" data-dismiss="modal" class="btn btn-sm btn-success mr-1" >Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GangNotes_Add_Up