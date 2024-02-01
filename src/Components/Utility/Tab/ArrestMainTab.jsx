import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";

const ArrestMainTab = () => {
    const [active] = useState(window.location.pathname)
    return (
        <>
            <div className="col-12 inc__tabs" style={{marginTop:'-10px'}}>
                <ul className="nav nav-tabs">
                    <li className="nav-item ">
                        <Link className={`nav-link   ${active === `/arresttab` ? 'active' : ''}`} data-toggle="pill" to={`/arresttab`}>Arrest</Link>
                    </li>
                    
                    {/* <li className="nav-item">
                        <Link className={`nav-link disabled ${active === `/booking` ? 'active' : ''}  ${sessionStorage.getItem('') === 'true' ? '' : ''}`} data-toggle="pill" to={`/booking`}>Booking</Link>
                    </li> */}
                </ul>
            </div>
        </>
    )
}

export default ArrestMainTab