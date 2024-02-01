import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Document_Add_Up from './Document_Add_Up'
import { useState } from 'react';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { ProDocumentListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../../Common/FindListDropDown';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';


const Document = () => {

  const { get_Property_Count, localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);
  const useQuery = () => new URLSearchParams(useLocation().search);
  let openPage = useQuery().get('page');

  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [propertyDocID, setPropertyDocID] = useState('');
  const [modal, setModal] = useState(false)
  const [documentdata, setDocumentdata] = useState();
  const [status, setStatus] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(0);

  const [propertyID, setPropertyID] = useState();
  const [masterPropertyID, setMasterPropertyID] = useState();
  const [MainIncidentID, setMainIncidentID] = useState('');
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');

  const localStore = {
    Value: "",
    UniqueId: localStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(localStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', propertyID: '', masterPropertyID: '', }),
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
        setMainIncidentID(parseInt(localStoreArray?.IncidentID));
        // setMainIncidentID(localStoreArray?.IncidentID);
        if (localStoreArray?.PropertyID || localStoreArray.MasterPropertyID) {
          setMasterPropertyID(localStoreArray?.MasterPropertyID);
          setPropertyID(localStoreArray?.PropertyID);
          get_Documentdata(localStoreArray?.PropertyID, localStoreArray?.MasterPropertyID);
        }
        else {
          setPropertyID('');
          setMasterPropertyID('');
        }
      }
    }
  }, [localStoreArray])


  useEffect(() => {
    get_Documentdata(propertyID, masterPropertyID);
  }, [propertyID, masterPropertyID])

  const get_Documentdata = (propertyID, masterPropertyID) => {
    const val = {
      'PropertyID': propertyID,
      'MasterPropertyID': masterPropertyID,
    }
    const val2 = {
      'MasterPropertyID': masterPropertyID,
      'PropertyID': 0,
    }
    fetchPostData(openPage === 'masterProperty' ? 'MainMasterPropertyDocument/GetData_MainMasterPropertyDocument' : 'PropertyDocument/GetData_PropertyDocument', openPage === 'masterProperty' ? val2 : val).then((res) => {
      if (res) {
        console.log(res)
        setDocumentdata(res)
      } else {
        setDocumentdata([]);
      }
    })
  }

  const columns = [
    {
      width: '120px',
      name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
          {/* {
                  EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                      <Link to={`#`} onClick={() => { setPropertyDocID(row.propertyDocID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                          <i className="fa fa-trash"></i>
                      </Link>
                      : <></>
                      : <Link to={`#`} onClick={() => { setPropertyDocID(row.propertyDocID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                          <i className="fa fa-trash"></i>
                      </Link>
              } */}
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <>
                <Link to={openPage === 'masterProperty' ? '/propertytab?page=masterProperty' : '/propertytab'} onClick={() => window.open(row?.FileAttachment)} className="btn btn-sm bg-green text-white px-1 py-0" >
                  <i className="fa fa-eye"></i>
                </Link>
                {/* <Link to={`#`} onClick={() => { setPropertyDocID(row.PropertyDocID) }} className="btn btn-sm bg-green text-white px-1 py-0 m/-1" data-toggle="modal" data-target="#DeleteModal">
                  <i className="fa fa-trash"></i>
                </Link> */}
              </>
              : <></>
              :
              <>
                <Link to={openPage === 'masterProperty' ? '/propertytab?page=masterProperty' : '/propertytab'} onClick={() => window.open(row?.FileAttachment)} className="btn btn-sm bg-green text-white px-1 py-0" >
                  <i className="fa fa-eye"></i>
                </Link>
                {/* <Link to={`#`} onClick={() => { setPropertyDocID(row.PropertyDocID);  }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" data-toggle="modal" data-target="#DeleteModal">
                  <i className="fa fa-trash"></i>
                </Link> */}
              </>
          }
        </div>
      </>
    },
    {
      width: '250px',
      name: 'Document Name',
      selector: (row) => row.DocName,
      sortable: true
    },
    {
      width: '250px',
      name: 'Document Notes',
      selector: (row) => row.Notes,
      sortable: true
    },
    {
      name: 'Document Type',
      selector: (row) => row.DocumentType_Description,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 0 }}>Delete</p>,
      cell: row => <>
        <div className="div" style={{ position: 'absolute', top: 4, right: 7 }}>
          {/* {
                  EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
                      <Link to={`#`} onClick={() => { setPropertyDocID(row.propertyDocID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                          <i className="fa fa-trash"></i>
                      </Link>
                      : <></>
                      : <Link to={`#`} onClick={() => { setPropertyDocID(row.propertyDocID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                          <i className="fa fa-trash"></i>
                      </Link>
              } */}
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <>
                {/* <Link to={`#`} onClick={() => window.open(row?.FileAttachment)} className="btn btn-sm bg-green text-white px-1 py-0" >
                  <i className="fa fa-eye"></i>
                </Link> */}
                <Link to={openPage === 'masterProperty' ? '/propertytab?page=masterProperty' : '/propertytab'} onClick={() => { setPropertyDocID(row.PropertyDocID) }} className="btn btn-sm bg-green text-white px-1 py-0 m/-1" data-toggle="modal" data-target="#DeleteModal">
                  <i className="fa fa-trash"></i>
                </Link>
              </>
              : <></>
              :
              <>
                {/* <Link to={`#`} onClick={() => window.open(row?.FileAttachment)} className="btn btn-sm bg-green text-white px-1 py-0" >
                  <i className="fa fa-eye"></i>
                </Link> */}
                <Link to={openPage === 'masterProperty' ? '/propertytab?page=masterProperty' : '/propertytab'} onClick={() => { setPropertyDocID(row.PropertyDocID); }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" data-toggle="modal" data-target="#DeleteModal">
                  <i className="fa fa-trash"></i>
                </Link>
              </>
          }
        </div>
      </>
    }
  ]

  const DeleteDocumentManagement = () => {
    const val = {
      'PropertyDocID': propertyDocID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('PropertyDocument/Delete_PropertyDocument', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Property_Count(propertyID);
        get_Documentdata(propertyID, masterPropertyID);
      } else console.log("Somthing Wrong");
    })
  }
  const setStatusFalse = (e, row) => {
    setStatus(false)
    setModal(true)
    setUpdateStatus(updateStatus + 1);
    setPropertyDocID(row.PropertyDocID);
  }
  return (
    <>
      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0">Document</p>
          <div style={{ marginLeft: 'auto' }}>
            <Link to={openPage === 'masterProperty' ? '/propertytab?page=masterProperty' : '/propertytab'} onClick={setStatusFalse} className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#DocumentModal" style={{ marginTop: '-6px' }}>
              <i className="fa fa-plus"></i>
            </Link>
            <FindListDropDown
              array={ProDocumentListDropDownArray}
            />
          </div>
        </div>
        <div className=" col-12">
          <DataTable
            dense
            columns={columns}
            data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? documentdata : '' : documentdata}
            pagination
            highlightOnHover
            noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
          />
        </div>
      </div>
      <Document_Add_Up {...{ masterPropertyID, propertyID, LoginPinID, LoginAgencyID, MainIncidentID, modal, get_Documentdata, setModal, documentdata,updateStatus }} />
      <DeletePopUpModal func={DeleteDocumentManagement} />
    </>
  )
}

export default Document