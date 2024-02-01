import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
import Comments_Add_Up from './Comments_Add_Up';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import Loader from '../../../../Common/Loader';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Comments = () => {

  const { get_Arrest_Count, localStoreArray, get_LocalStorage } = useContext(AgencyContext);

  const [CommentData, setCommentData] = useState([])
  const [ArrestCommentsID, setArrestCommentsID] = useState('')
  const [upDateCount, setUpDateCount] = useState(0)
  const [status, setStatus] = useState(false)
  const [modal, setModal] = useState(false);
  const [loder, setLoder] = useState(false)
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState();
  // const [IncidentID, setIncidentID] = useState('')
  const [ArrestID, setArrestID] = useState('');
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", ArrestID: '', }),
  }

  useEffect(() => {
    if (!localStoreArray?.AgencyID || !localStoreArray?.PINID) {
      get_LocalStorage(localStore);
    }
  }, []);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(parseInt(localStoreArray?.PINID));
        // setIncidentID(localStoreArray?.IncidentID);
        if (localStoreArray.ArrestID) { setArrestID(localStoreArray?.ArrestID); get_CommentsData(localStoreArray?.ArrestID) } else { setArrestID() }
        getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
      }
    }
  }, [localStoreArray])

  // useEffect(() => {
  //   get_CommentsData(); getScreenPermision();
  // }, [])

  const get_CommentsData = (ArrestID) => {
    const val = {
      'ArrestID': ArrestID
    }
    fetchPostData('ArrestComments/GetData_ArrestComments', val)
      .then(res => {
        if (res) {
          setCommentData(res); setLoder(true)
        } else {
          setCommentData([]); setLoder(true)
        }
      })
  }

  const getScreenPermision = (LoginAgencyID, LoginPinID) => {
    ScreenPermision("I033", LoginAgencyID, LoginPinID).then(res => {
      if (res) {
        setEffectiveScreenPermission(res)
      } else {
        setEffectiveScreenPermission()
      }
    });
  }

  const columns = [
    {
      width: '120px',
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Action</p>,
      cell: row => <>
        <div style={{ position: 'absolute', top: 4, left: 20 }}>
          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.Changeok ?
              <Link to={''} onClick={(e) => editComments(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#CommentsModal" >
                <i className="fa fa-edit"></i>
              </Link>
              : <></>
              : <Link to={''} onClick={(e) => editComments(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#CommentsModal" >
                <i className="fa fa-edit"></i>
              </Link>
          }
        </div>
      </>
    },
    {
      name: 'Comments',
      selector: (row) => <>{row?.Comments ? row?.Comments.substring(0, 60) : ''}{row?.Comments?.length > 40 ? '  . . .' : null} </>,
      sortable: true
    },
    // {
    //   name: 'OfficerName',
    //   selector: (row) => row.OfficerName,
    //   sortable: true
    // },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
      cell: row => <>
        <div style={{ position: 'absolute', top: 4, right: 5 }}>

          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} onClick={(e) => setArrestCommentsID(row.ArrestCommentsID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} onClick={(e) => setArrestCommentsID(row.ArrestCommentsID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>
      </>
    }
  ]

  const editComments = (e, val) => {
    e.preventDefault();
    get_Arrest_Count(val.ArrestID)
    setArrestCommentsID(val.ArrestCommentsID);
    setUpDateCount(upDateCount + 1);
    setStatus(true)
    setModal(true);
  }

  const DeleteComments = () => {
    const val = {
      'ArrestCommentsID': ArrestCommentsID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('ArrestComments/Delete_ArrestComments', val).then((res) => {
      if (res.success) {
        toastifySuccess(res.Message);
        get_Arrest_Count(ArrestID);
        get_CommentsData(ArrestID);
      } else console.log("Somthing Wrong");
    })
  }

  return (
    <>
      <div className="col-md-12 mt-2">
        <div className="row">
          <div className="col-md-12">
            <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
              <p className="p-0 m-0">Comments</p>
              <p className="p-0 m-0">
                {/* <Link to="" className="text-white">
                                    <i className="fa fa-filter mr-2"></i>
                                </Link>
                                <Link to="" className="text-white">
                                    <i className="fa fa-print mr-2"></i>
                                </Link> */}
                {
                  EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                    <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                      onClick={() => { setStatus(false); setModal(true); setUpDateCount(upDateCount + 1); }}
                      data-toggle="modal" data-target="#CommentsModal">
                      <i className="fa fa-plus"></i>
                    </Link>
                    : <></>
                    : <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                      onClick={() => { setStatus(false); setModal(true); setUpDateCount(upDateCount + 1); }}
                      data-toggle="modal" data-target="#CommentsModal">
                      <i className="fa fa-plus"></i>
                    </Link>
                }
              </p>
            </div>
            <div className="col-12 ">
              {
                loder ?
                  <DataTable
                    dense
                    columns={columns}
                    data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? CommentData : '' : CommentData}
                    pagination
                    selectableRowsHighlight
                    highlightOnHover
                    noDataComponent={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                  />
                  :
                  <Loader />
              }
            </div>
          </div>
        </div>
      </div>
      <DeletePopUpModal func={DeleteComments} />
      <Comments_Add_Up {...{ LoginPinID, ArrestID, LoginAgencyID, upDateCount, ArrestCommentsID, status, modal, setModal, get_CommentsData, CommentData }} />
    </>
  )
}
export default Comments;