import React from 'react'

export const ExpireMessage = () => {

    return (
        <div className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="DeleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="box text-center py-5">
                        <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                        <div className="btn-box mt-3">
                          
                            <button type="button" className="btn btn-sm btn-secondary ml-2 " data-dismiss="modal"> Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


