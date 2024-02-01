import React, { useContext, useState } from 'react'
import { Link, useLocation } from "react-router-dom";
import { Decrypt_Id_Name, Encrypted_Id_Name } from '../../Common/Utility';
import { AgencyContext } from '../../../Context/Agency/Index';

const SearchSidebar = () => {

    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');
    // console.log(openPage);

    const page = new URLSearchParams(window.location.search).get("page")

    const [expand, setExpand] = useState()
    const [expandList, setExpandList] = useState()
    const [plusMinus, setPlusMinus] = useState(false)
    const [plusMinus1, setPlusMinus1] = useState(false)
    const [plusMinus2, setPlusMinus2] = useState(false)
    const [plusMinus3, setPlusMinus3] = useState(false)
    const [plusMinus4, setPlusMinus4] = useState(false)

    const callReportModules = (type, val) => {
        if (type === 'List') {
            setPlusMinus1(!plusMinus1)
            setPlusMinus2(!plusMinus2)
            setPlusMinus3(!plusMinus2)
            setPlusMinus4(!plusMinus2)
            setExpand(expand ?
                expand[0].id === val ? { id: val } : '' : { id: val })
        }
        else {
            setExpandList(expandList === val ? '' : val)
        }
    }

    return (
        <>
            <div className="row px-1">
                <div className="col-12 mt-4">
                    <input type="text" className='form-control input-fixed mt-1'
                        placeholder='Search By List ...' />
                </div>
            </div>
            {/* incident */}


            <li className='mt-2 pt-1'>
                <Link to="/incident-advanceSearch?page=incidentAdvanceSearch" class="has-arrow arrow-c" aria-expanded={plusMinus} style={{ cursor: 'pointer', background: openPage === 'incidentAdvanceSearch' ? '#EEE' : '' }} >
                    <i class="fa fa-lock  "></i>
                    <span>Incident</span>
                </Link>
            </li>
            <li className=''>
                <Link to="/name-advanceSearch?page=nameAdvanceSearch" class="has-arrow arrow-c" style={{ cursor: 'pointer', background: openPage === 'nameAdvanceSearch' ? '#EEE' : '' }} aria-expanded={plusMinus2}><i class="fa fa-lock "></i><span>Name</span></Link>
            </li>
            {/* property */}
            <li className=''>
                <Link to="/property-advanceSearch?page=propertyAdvanceSearch" class="has-arrow arrow-c" aria-expanded={plusMinus3} style={{ cursor: 'pointer', background: openPage === 'propertyAdvanceSearch' ? '#EEE' : '' }}><i class="fa fa-lock "></i><span>Property</span></Link>

            </li>
            {/* arrest */}
            <li className=''>
                <Link to="/arrest-advanceSearch?page=arrestAdvanceSearch" class="has-arrow arrow-c" aria-expanded={plusMinus4} style={{ cursor: 'pointer', background: openPage === 'arrestAdvanceSearch' ? '#EEE' : '' }}><i class="fa fa-lock "></i><span>Arrest</span></Link>
            </li>
            {/* vehicle */}
            <li className=''>
                <Link to="/vehicle-advanceSearch?page=vehicleAdvanceSearch" class="has-arrow arrow-c" aria-expanded={plusMinus4} style={{ cursor: 'pointer', background: openPage === 'vehicleAdvanceSearch' ? '#EEE' : '' }}><i class="fa fa-lock "></i><span>Vehicle</span></Link>
            </li>
            <li className=''>
                <Link to="#" class="has-arrow arrow-c" aria-expanded={plusMinus4} onClick={() => callReportModules('Table4', 'Master Table4')}><i class="fa fa-lock "></i><span>Warrant</span></Link>

            </li>

        </>
    )
}

export default SearchSidebar