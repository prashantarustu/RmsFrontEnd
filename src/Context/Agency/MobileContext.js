import React, { createContext, useState } from 'react'

export const MobileContext = createContext()

const MobileData = ({ children }) => {

    const [showPage, setShowPage] = useState('Mobilenarrative');
    
    return (
        <MobileContext.Provider value={{ showPage, setShowPage }}>
            {children}
        </MobileContext.Provider>
    )
}

export default MobileData