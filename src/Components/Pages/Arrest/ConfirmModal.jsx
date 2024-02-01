import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AgencyContext } from '../../../Context/Agency/Index'
import { Encrypted_Id_Name } from '../../Common/Utility'

const ConfirmModal = (props) => {

    const { show, setShowModal, arresteeChange, setValue, setErrors } = props
    const { setIncStatus, updateCount, setUpdateCount, setNameStatus, storeData } = useContext(AgencyContext);
    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    const yesChange = () => {
        setIncStatus(true); setUpdateCount(updateCount + 1);
        if (openPage != 'ArrestSearch') {
            storeData({ 'NameID': arresteeChange.NameID, 'MasterNameID': arresteeChange.MasterNameID, 'NameStatus': true })
            // sessionStorage.setItem("NameID", Encrypted_Id_Name(arresteeChange.NameID, 'NForNameId'));
            // sessionStorage.setItem("MasterNameID", Encrypted_Id_Name(arresteeChange.MasterNameID, 'MForMasterNameID'));
            // sessionStorage.setItem('nameStatus', true); setNameStatus(true)
        } else {
            storeData({ 'MasterNameID': arresteeChange.MasterNameID, 'NameStatus': true })
            // sessionStorage.setItem('nameStatus', true); setNameStatus(true)
            // sessionStorage.setItem("MasterNameID", Encrypted_Id_Name(arresteeChange.MasterNameID, 'MForMasterNameID'));
        }
        setShowModal(false);
    }

    return (
        <>
            {
                show &&
                <div className="modal fade show" data-backdrop="false" style={{ background: "rgba(0,0,0, 0.5)" }} id="myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
                    <div className="modal-dialog modal-dialog-centered" role="document" >

                        <div className="modal-content" style={{ backgroundColor: 'aliceblue' }} >
                            <div className="box text-center py-4">
                                <h5 className="modal-title  " style={{ color: 'cadetblue', fontWeight: '700' }} id="exampleModalLabel">{!arresteeChange?.LastName && 'LastName,'}
                                    {!arresteeChange?.DateOfBirth && ' DOB,'}
                                    {!arresteeChange?.Race_Description && ' Race,'}
                                    {!arresteeChange?.Gendre_Description && ' Gender, '}
                                    <span >
                                        Should not be Empty
                                    </span>
                                </h5>
                                <div className="btn-box mt-2">
                                    <Link to={openPage != 'ArrestSearch' ? '/nametab' : '/nametab?page=ArrestSearch'} >
                                        <button type="button" onClick={() => yesChange()} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Yes</button>
                                    </Link>
                                    <button type="button" onClick={() => {
                                        setValue(pre => { return { ...pre, ['ArresteeID']: '' } });
                                        setErrors(pre => { return { ...pre, ['ArresteeIDError']: '' } })
                                        setShowModal(false);
                                    }} className="btn btn-sm btn-secondary ml-2 " data-dismiss="modal"> No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default ConfirmModal;
