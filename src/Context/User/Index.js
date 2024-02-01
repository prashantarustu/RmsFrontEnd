import React, { createContext, useState } from 'react'

export const UserContext = createContext()

const AgencyData = ({ children }) => {
    const [agencyData, setAgencyData] = useState([])
  
    return (
        <AgencyContext.Provider value={{}}>
            {children}
        </AgencyContext.Provider>
    )
}

export default AgencyData