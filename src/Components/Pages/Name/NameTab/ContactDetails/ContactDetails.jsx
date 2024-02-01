import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { fetchPostData, AddDeleteUpadate, } from '../../../../hooks/Api';
import { useEffect } from 'react';
import { Decrypt_Id_Name, } from '../../../../Common/Utility';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import ContactDetails_Add_Up from './ContactDetails_Add_Up';
import FindListDropDown from '../../../../Common/FindListDropDown';
import { NaContactListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const ContactDetails = () => {

  const { get_Name_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext)

  const useQuery = () => new URLSearchParams(useLocation().search);
  let openPage = useQuery().get('page');

  const [ContactDetailsData, setContactDetailsData] = useState([]);
  const [masterContactData, setMasterContactData] = useState([]);
  const [status, setStatus] = useState(false);
  const [modal, setModal] = useState(false)
  const [NameContactID, setNameContactID] = useState();
  const [updateStatus, setUpdateStatus] = useState(0)
  const [IncidentPINActivityID, setIncidentPINActivityID] = useState('');
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()

  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');
  const [MasterNameID, setMasterNameID,] = useState('');
  const [nameID, setNameID] = useState();

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", MasterNameID: '', NameID: '', Agency_Name: "", }),
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
      get_LocalStorage(localStore);
    }
  }, []);

  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(parseInt(localStoreArray?.PINID));
        setNameID(localStoreArray?.NameID); setMasterNameID(localStoreArray?.MasterNameID);
        if (openPage === 'mastername' && localStoreArray?.MasterNameID) {
          Get_Master_ContactData(localStoreArray?.MasterNameID)
        } else {
          Get_ContactDetailsData(localStoreArray?.NameID);
          getScreenPermision();
        }
      }
    }
  }, [localStoreArray])

  // useEffect(() => {
  //   if (openPage === 'mastername') {
  //     Get_Master_ContactData()
  //   } else {
  //     Get_ContactDetailsData();
  //     getScreenPermision();
  //   }
  // }, [])

  const Get_ContactDetailsData = (NameID) => {
    const val = {
      'NameID': NameID,
    }
    fetchPostData('NameContactDetails/GetData_NameContactDetails', val).then((res) => {
      if (res) {
        // console.log(res)
        setContactDetailsData(res)
      } else {
        setContactDetailsData();
      }
    })
  }

  const Get_Master_ContactData = (MasterNameID) => {
    const val = {
      'MasterNameID': MasterNameID,
    }
    fetchPostData('MainMasterNameContactDetails/GetData_MainMasterNameContactDetails', val).then((res) => {
      if (res) {
        setMasterContactData(res)
      } else {
        setMasterContactData([]);
      }
    })
  }

  const getScreenPermision = () => {
    // ScreenPermision("I028", Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID')).then(res => {
    //   if (res) {
    //     setEffectiveScreenPermission(res)
    //   } else {
    //     setEffectiveScreenPermission()
    //   }
    // });
  }

  const columns = [
    {
      width: '120px',
      name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
              <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#PinModal" >
                <i className="fa fa-edit"></i>
              </Link>
              : <></>
              : <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={(e) => { set_Edit_Value(e, row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#PinModal" >
                <i className="fa fa-edit"></i></Link>
          }

        </div>
      </>
    },
    {
      name: 'Phone/Email',
      selector: (row) => row.Phone_Email,
      sortable: true
    },
    {
      name: 'Verify',
      selector: (row) => row.Verify_Description,
      sortable: true
    },
    {
      name: 'Contact Type',
      selector: (row) => row.ContactType_Description,
      sortable: true
    },
    {
      name: 'Current Phone',
      selector: (row) => <><input type="checkbox" name="" id="" checked={row.IsCurrentPh} /></>,
      sortable: true
    },
    {
      name: 'Unlisted Phone',
      selector: (row) => <><input type="checkbox" name="" id="" checked={row.IsInListedPh} /></>,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 3 }}>Delete</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, right: 5 }}>

          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={() => { setNameContactID(row.NameContactID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={() => { setNameContactID(row.NameContactID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>
      </>
    }
  ]

  const set_Edit_Value = (e, row) => {
    setStatus(true);
    setModal(true)
    setUpdateStatus(updateStatus + 1);
    setNameContactID(row.NameContactID);
  }

  const DeleteContactDetail = () => {
    const val = {
      'NameContactID': NameContactID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate(openPage === 'mastername' ? 'MainMasterNameContactDetails/Delete_MainMasterNameContactDetails' : 'NameContactDetails/Delete_NameContactDetails', val).then((res) => {
      if (res) {
        // console.log(val)
        toastifySuccess(res.Message);
        get_Name_Count(nameID)
        if (openPage === 'mastername') Get_Master_ContactData(MasterNameID)
        else Get_ContactDetailsData(nameID);
      } else console.log("Somthing Wrong");
    })
  }

  const setStatusFalse = (e) => {
    setStatus(false)
    setModal(true)
    setUpdateStatus(updateStatus + 1);

  }

  return (
    <>
      <div className="col-md-12 mt-2">
        <div className="bg-line text-white py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0 d-flex align-items-center">
            Contact Details
          </p>
          <div>
            {
              EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} className="btn btn-sm bg-green text-white px-2 py-0" onClick={setStatusFalse}
                  data-toggle="modal" data-target="#PinModal" style={{ marginTop: '-7px' }}>
                  <i className="fa fa-plus"></i>
                </Link>
                : <></>
                : <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} className="btn btn-sm bg-green text-white px-2 py-0" onClick={setStatusFalse}
                  data-toggle="modal" data-target="#PinModal" style={{ marginTop: '-7px' }}>
                  <i className="fa fa-plus"></i>
                </Link>
            }
            <FindListDropDown
              array={NaContactListDropDownArray}
            />
          </div>
        </div>
        <DataTable
          dense
          columns={columns}
          data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? openPage === 'mastername' ? masterContactData : ContactDetailsData : '' : openPage === 'mastername' ? masterContactData : ContactDetailsData}
          pagination
          highlightOnHover
          noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
        />
      </div>
      <DeletePopUpModal func={DeleteContactDetail} />
      <ContactDetails_Add_Up {...{ nameID, MasterNameID, LoginAgencyID, LoginPinID, status, setStatus, NameContactID, setNameContactID, setModal, modal, Get_ContactDetailsData, updateStatus, Get_Master_ContactData }} />
    </>
  )
}

export default ContactDetails; 