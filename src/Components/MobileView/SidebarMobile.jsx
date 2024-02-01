import React from 'react'



const SidebarMobile = () => {

  return (
    <>
      <div className="wrapper">
        <nav id="sidebar">
          <div className="sidebar-header">
            <h3>BBBOOTSTRAP</h3>
            <hr />
          </div>
          <ul className="list-unstyled components">
            <p>MENUS</p>
            <li>
              <a href="#">Users</a>
            </li>
            <li>
              <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle">Subscribers</a>
              <ul className="collapse list-unstyled" id="pageSubmenu">	<li>
                <a href="#">Active</a>
              </li>
                <li>
                  <a href="#">Idle</a>
                </li>
                <li>
                  <a href="#">Non Active</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#">Timeline</a>
            </li>
            <li>
              <a href="#">Live Chat</a>	</li>	<li>	<a href="#">Likes</a>	</li>	<li>	<a href="#">Comments</a>	</li>	</ul>	<ul className="list-unstyled CTAs">	<li>	<a href="#" className="download">Subscribe</a>	</li>	</ul>	</nav>	<div className="content">	<nav className="navbar navbar-expand-lg navbar-light bg-light">	<button type="button" id="sidebarCollapse" className="btn btn-info">	<i className="fa fa-align-justify" />	</button>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"> <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                </div>
              </nav>
          <div className="content-wrapper">
            <div className="line" />
          </div>
        </div>
      </div>
    </>
  )
}

export default SidebarMobile