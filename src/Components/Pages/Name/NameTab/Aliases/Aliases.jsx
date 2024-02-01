import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import { useEffect } from 'react';
import { Decrypt_Id_Name, getShowingDateText, getShowingWithOutTime } from '../../../../Common/Utility';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import Aliases_Add_Up from './Aliases_Add_Up';
import { NaAliasesListDropDownArray, NaIdentificationListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../../Common/FindListDropDown';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Aliases = () => {

  const { get_Name_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext)
  const useQuery = () => new URLSearchParams(useLocation().search);
  let openPage = useQuery().get('page');

  const [AliasesData, setAliasesData] = useState();
  const [status, setStatus] = useState(false);
  const [modal, setModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(0);
  const [NameAliasesID, setNameAliasesID] = useState('');
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');
  const [MasterNameID, setMasterNameID,] = useState('');
  const [nameID, setNameID] = useState('');

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
        // setLoginPinID(localStoreArray?.PINID);
        setLoginPinID(parseInt(localStoreArray?.PINID));
        setNameID(localStoreArray?.NameID); setMasterNameID(localStoreArray?.MasterNameID);
        get_Aliases_Data(localStoreArray?.NameID, localStoreArray?.MasterNameID);
        getScreenPermision();
      }
    }
  }, [localStoreArray])

  const get_Aliases_Data = (NameID, MasterNameID) => {
    const val = {
      'NameID': openPage === 'mastername' ? '' : NameID,
    }
    const req = {
      'MasterNameID': MasterNameID,
    }
    fetchPostData(openPage === 'mastername' ? 'MainMasterNameAliases/GetData_MainMasterNameAliases' : 'NameAliases/GetData_NameAliases', openPage === 'mastername' ? req : val).then((res) => {
      if (res) {
        console.log(res);
        setAliasesData(res)
      } else {
        setAliasesData([]);
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


  // Get Effective Screeen Permission
  // const getScreenPermision = () => {
  //   const val = {
  //     PINID: Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
  //     ApplicationID: '1',
  //     Code: 'I028',
  //     AgencyID: Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID')
  //   }
  //   fetchPostData("EffectivePermission/GetData_EffectiveScreenPermission", val)
  //     .then(res => {
  //       console.log(res);
  //       if (res) { setEffectiveScreenPermission(res); }
  //       else { setEffectiveScreenPermission(); }
  //     })
  //     .catch(error => {
  //       console.error('There was an error!', error);
  //     });
  // }


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
      name: 'Last Name',
      selector: (row) => row.LastName,
      sortable: true
    },
    {
      name: 'First Name',
      selector: (row) => row.FirstName,
      sortable: true
    },
    {
      name: 'Middle Name',
      selector: (row) => row.MiddleName,
      sortable: true
    },
    {
      name: 'DOB',
      selector: (row) => row.DOB ? getShowingWithOutTime(row.DOB) : '',
      sortable: true
    },
    {
      name: 'Alias SSN',
      selector: (row) => row.AliasSSN,
      sortable: true
    },
    {
      name: 'Suffix',
      selector: (row) => row.Suffix_Des,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 0 }}>Delete</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, right: 5 }}>

          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={() => { setNameAliasesID(row.NameAliasesID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={openPage === 'mastername' ? '/nametab?page=mastername' : '/nametab'} onClick={() => { setNameAliasesID(row.NameAliasesID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>
      </>
    }
  ]

  const set_Edit_Value = (e, row) => {
    console.log(row)
    setStatus(true);
    setModal(true)
    setUpdateStatus(updateStatus + 1);
    setNameAliasesID(row.NameAliasesID);
  }

  const DeleteNameAliases = () => {
    const val = {
      'NameAliasesID': NameAliasesID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('NameAliases/Delete_NameAliases', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Name_Count(nameID);
        get_Aliases_Data(nameID, MasterNameID);
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
            Aliases
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
              array={NaAliasesListDropDownArray}
            />
          </div>
        </div>
        <DataTable
          dense
          columns={columns}
          data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? AliasesData : '' : AliasesData}
          pagination
          highlightOnHover
          noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
        />
      </div>
      <DeletePopUpModal func={DeleteNameAliases} />
      <Aliases_Add_Up {...{ nameID, MasterNameID, LoginPinID, LoginAgencyID, status, setStatus, NameAliasesID, setModal, modal, get_Aliases_Data, updateStatus }} />
    </>
  )
}
export default Aliases; 