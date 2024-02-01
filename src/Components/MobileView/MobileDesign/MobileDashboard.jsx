import React from 'react'
import { Link } from 'react-router-dom'


const MobileDashboard = () => {

  return (
    <>
      <div className="section-body mt-4">
        <div className="container-fluid">
          <div className="row clearfix">
            <div className="card">
              <div className="main-dashboard col-12 mb-2">
                <div className="box-container-incident ">
                  <div className="box-Incident">
                    <Link to={'/incident-main'}>
                      <i className="fa fa-stack-exchange size-fa-32px" aria-hidden="true"></i>
                      <p>My Incident</p>
                    </Link>
                  </div>
                  <div className="box-Incident">
                    <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                    <p>Approved Reports</p>
                  </div>
                  <div className="box-Incident">
                    <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                    <p>Reject Reports</p>
                  </div>
                  {/* <div className="box-Incident">
                    <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                    <p>Call Details</p>
                  </div>
                  <div className="box-Incident">
                    <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                    <p>MV Stop</p>
                  </div> */}
                </div>
                <div className="col-12 text-right" style={{ marginTop: '10px' }}>
                  {/* <button type="button" className="btn btn-lg  btn-success new-button mr-3">New</button>
                  <button type="button" className="btn btn-lg  btn-success new-button mr-3">Save</button> */}
                  <Link to={''}>
                    {/* <button type="button" className="btn btn-lg btn-success new-button" >Close</button> */}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default MobileDashboard