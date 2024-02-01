import React, { createContext, useState, useEffect } from 'react'

export const PersonnelContext = createContext()

const AgencyData = ({ children }) => {
    const [personnelList, setPersonnelList] = useState([])

    const get_Personnel_Lists = () => {
        const val = {
            AgencyID: agencyId
        }
        fetchPostData('Personnel/GetData_Personnel', val)
            .then((res) => {
                if (res) setPersonnelList(res)
                else setPersonnelList()
            })
    }

    return (
        <PersonnelContext.Provider value={{personnelList, get_Personnel_Lists}}>
            {children}
        </PersonnelContext.Provider>
    )
}

export default AgencyData