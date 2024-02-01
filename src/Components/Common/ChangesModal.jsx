import React, { useContext } from "react";
import { Link } from 'react-router-dom'
import { AgencyContext } from '../../Context/Agency/Index'

const ChangesModal = (props) => {

    const { changesStatus, setChangesStatus, setChangesStatusCount, changesStatusCount, setStatus, setAgencyName, setPersonnelStatus } = useContext(AgencyContext)

    const { func } = props

    return (
        <>
            {
                changesStatus ?
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="SaveModal" tabindex="-1" data-backdrop="false" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                            <div className="modal-content">
                                <div className="box text-center py-5">
                                    <h5 className="modal-title mt-2" id="exampleModalLabel">Are you sure you want to save changes you made for the current record?</h5>
                                    <div className="btn-box mt-4">
                                        <Link to={`#`} onClick={(e) => { func(e); setChangesStatus(false) }}>
                                            <button type="button" className="btn btn-sm text-white" style={{ background: "#ef233c" }} data-dismiss="modal">Save</button>
                                        </Link>
                                        <button type="button" className="btn btn-sm btn-secondary ml-2 " data-dismiss="modal" onClick={() => { setChangesStatus(false); setChangesStatusCount(changesStatusCount + 1); setStatus(false); setPersonnelStatus(false); setAgencyName(''); }}> Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
            }
        </>
    )
}

export default ChangesModal