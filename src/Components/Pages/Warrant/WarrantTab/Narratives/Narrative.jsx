import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
// import Narrative_Add_Up from './Narrative_Add_Up';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import DatePicker from 'react-datepicker';
import { ArrNarrativesListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../../Common/FindListDropDown';
import Loader from '../../../../Common/Loader';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import Narrative_Add_Up from './Narratives_Add_Up';


const Narrative = () => {

  const { get_Warrent_Count, localStoreArray, get_LocalStorage } = useContext(AgencyContext)
  const [NarrativeData, setNarrativeData] = useState([])
  const [upDateCount, setUpDateCount] = useState(0)
  const [status, setStatus] = useState(false)
  const [modal, setModal] = useState(false);
  const [WarrantNarrativeID, setWarrantNarrativeID] = useState('')
  const [loder, setLoder] = useState(false)
  //screen permission 
  const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState()

  const [WarrantID, setWarrantID] = useState('');
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", WarrantID: '', }),
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
        if (localStoreArray.WarrantID) { setWarrantID(localStoreArray?.WarrantID); get_NarrativesData(localStoreArray?.WarrantID) } else { setWarrantID('') }
        getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
      }
    }
  }, [localStoreArray])

  // useEffect(() => {
  //   get_NarrativesData(); getScreenPermision();
  // }, [])

  const get_NarrativesData = (WarrantID) => {
    const val = {
      'WarrantID': WarrantID,
    }
    fetchPostData('WarrantNarrative/GetData_WarrantNarrative', val)
      .then(res => {
        if (res) {

          setNarrativeData(res); setLoder(true)
        } else {
          setNarrativeData([]); setLoder(true)
        }
      })
  }

  const getScreenPermision = (LoginAgencyID, LoginPinID) => {
    ScreenPermision("I032", LoginAgencyID, LoginPinID).then(res => {
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
              <Link to={''} onClick={(e) => editNarratives(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#NarrativeModal" >
                <i className="fa fa-edit"></i>
              </Link>
              : <></>
              : <Link to={''} onClick={(e) => editNarratives(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#NarrativeModal" >
                <i className="fa fa-edit"></i>
              </Link>
          }

        </div>
      </>
    },
    {
      name: 'Date',
      selector: (row) => getShowingDateText(row.NarrativeDtTm),
      sortable: true
    },
    {
      name: 'Narrative',
      selector: (row) => <>{row?.NarrativeComments ? row?.NarrativeComments.substring(0, 50) : ''}{row?.NarrativeComments?.length > 40 ? '  . . .' : null} </>,
      sortable: true
    },
    {
      name: 'Reported By',
      selector: (row) => row.ReportedBy_Description,
      sortable: true
    },
    {
      name: 'Type',
      selector: (row) => row.NarrativeDescription,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: '0px' }}>Delete</p>,
      cell: row => <>
        <div style={{ position: 'absolute', top: 4, right: 5 }}>

          {
            EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} onClick={(e) => setWarrantNarrativeID(row.WarrantNarrativeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} onClick={(e) => setWarrantNarrativeID(row.WarrantNarrativeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>
      </>
    }
  ]

  const editNarratives = (e, val) => {
    e.preventDefault();
    get_Warrent_Count(val.WarrantID)
    setWarrantNarrativeID(val.WarrantNarrativeID);
    setUpDateCount(upDateCount + 1);
    setStatus(true)
    setModal(true);
  }

  const DeleteNarratives = () => {
    const val = {
      'WarrantNarrativeID': WarrantNarrativeID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate('WarrantNarrative/Delete_WarrantNarrative', val).then((res) => {
      if (res.success) {
        toastifySuccess(res.Message);
        get_Warrent_Count(WarrantID);
        get_NarrativesData(WarrantID);
      }
      else console.log("Somthing Wrong");
    })
  }

  // Custom Style
  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      height: 50,
      minHeight: 50,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  return (
    <>
      <div className="col-md-12 mt-2">
        <div className="row">
          <div className="col-md-12">
            <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
              <p className="p-0 m-0">Narratives</p>
              <p className="p-0 m-0">
                {/* <Link to="" className="text-white">
                                    <i className="fa fa-filter mr-2"></i>
                                </Link>
                                <Link to="" className="text-white">
                                    <i className="fa fa-print mr-2"></i>
                                </Link> */}
                <div>
                  {
                    EffectiveScreenPermission ? EffectiveScreenPermission[0]?.AddOK ?
                      <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                        onClick={() => { setStatus(false); setModal(true); setUpDateCount(upDateCount + 1) }}
                        data-toggle="modal" data-target="#NarrativeModal" style={{ marginTop: '-6px' }}>
                        <i className="fa fa-plus"></i>
                      </Link>
                      : <></>
                      : <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                        onClick={() => { setStatus(false); setModal(true); setUpDateCount(upDateCount + 1) }}
                        data-toggle="modal" data-target="#NarrativeModal" style={{ marginTop: '-6px' }}>
                        <i className="fa fa-plus"></i>
                      </Link>
                  }
                  <FindListDropDown
                    array={ArrNarrativesListDropDownArray}
                  />
                </div>
              </p>
            </div>
            <div className="col-12 pl-0 ml-0">
              <div className="row ">
                <div className="col-12 pl-0 ml-0">
                  <div className="row ">
                    {/* <div className="col-4">
                      <input type="text" value='' onChange='' className='form-control' placeholder='Search By DESC ...' />
                    </div>
                    <div className="col-4">
                      <input type="text" value='' onChange='' className='form-control' placeholder='Search By Reported ...' />
                    </div> */}
                    {/* <div className="col-4">
                      <DatePicker
                        dateFormat="MM/dd/yyyy"
                        timeInputLabel
                        name='ReportedDate'
                        value=''
                        onChange=''
                        placeholderText='Search By Date ...'
                        showTimeInput
                        className='form-control datepicker-custom'
                      />
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            {
              loder ?
                <DataTable
                  dense
                  columns={columns}
                  data={EffectiveScreenPermission ? EffectiveScreenPermission[0]?.DisplayOK ? NarrativeData : '' : NarrativeData}
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
      <DeletePopUpModal func={DeleteNarratives} />
      <Narrative_Add_Up {...{ LoginPinID, WarrantID, LoginAgencyID, upDateCount, WarrantNarrativeID, status, modal, setModal, NarrativeData, get_NarrativesData }} />
    </>
  )
}
export default Narrative;