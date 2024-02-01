import React, { useContext } from "react";
import { AgencyContext } from '../../../Context/Agency/Index';
// import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Encrypted_Id_Name } from '../../Common/Utility';

export const NameSearchSidebar = () => {

    const { nameSearchData, setUpdateCount, setIncStatus, updateCount } = useContext(AgencyContext);

    return (
        <div className="row px-1">
            <div className="col-12">
                <input type="text" className='form-control' placeholder='Search By Name ...' />
            </div>
            <li>
                <ul style={{ marginLeft: '-23px' }}>
                    <>
                        {
                            nameSearchData?.map((val, key) => (
                                <li className="ml-3 p-0" key={key}>
                                    <Link to={`/nametab?page=mastername`}
                                        onClick={() => {
                                            // sessionStorage.setItem("MasterNameID", Encrypted_Id_Name(val.MasterNameID, 'MForMasterNameID'));
                                            setIncStatus(true)
                                            setUpdateCount(updateCount + 1)
                                        }}
                                    >
                                        <i className=" fa fa-arrow-right"></i>
                                        <span className="m-0 p-0">{val.LastName}</span>
                                    </Link>
                                </li>
                            ))
                        }
                    </>
                </ul>
            </li>
        </div>
    )
}
