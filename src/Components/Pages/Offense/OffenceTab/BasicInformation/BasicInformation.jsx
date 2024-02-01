import React, { useEffect, useState, } from 'react'
import { components } from "react-select";
import makeAnimated from "react-select/animated";
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import SelectBox from '../../../../Common/SelectBox';
import { Comman_changeArrayFormatBasicInfo, threeColArrayWithCode } from '../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import FindListDropDown from '../../../../Common/FindListDropDown';
import { OffBasicInfoListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import { BiasError, ErrorStyleBias, ErrorStyleOffenderUse, ErrorTooltip, OffenderUseError_N, OffenderUseError_Other } from '../ErrorNibrs';
import { useContext } from 'react';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const Option = props => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />
        <p className='ml-2 d-inline'>{props.label}</p>
      </components.Option>
    </div>
  );
};

const MultiValue = props => (
  <components.MultiValue {...props}>
    <span>{props.data.label}</span>
  </components.MultiValue>
);

const animatedComponents = makeAnimated()

const BasicInformation = ({ LoginPinID, LoginAgencyID, offenceID, MainIncidentID }) => {

  const { localStoreArray, setLocalStoreArray, get_LocalStorage, } = useContext(AgencyContext);

  // DropDown Value
  const [pretentedDrp, setPretentedDrp] = useState([]);
  const [pointExitDrp, setPointExitDrp] = useState([]);
  const [pointEntryDrp, setPointEntryDrp] = useState([]);
  const [CrimeOffenderUseDrp, setCrimeOffenderUseDrp] = useState([]);
  const [CrimeActivityDrp, setCrimeActivityDrp] = useState([]);
  const [CrimeBiasCategoryDrp, setCrimeBiasCategoryDrp] = useState([]);
  const [ToolsUseIDDrp, setToolsUseIDDrp] = useState([]);
  const [CrimeTargetDrp, setCrimeTargetDrp] = useState([]);
  const [CrimeSuspectDrp, setCrimeSuspectDrp] = useState([]);
  const [CrimeSecurityviolatedDrp, setCrimeSecurityviolatedDrp] = useState([]);

  // Edit Value Data
  const [editval, setEditval] = useState([]);
  const [pointExitEditVal, setPointExitEditVal] = useState([]);
  const [pointEntryEditVal, setPointEntryEditVal] = useState([]);
  const [CrimeOffenderUseEditVal, setCrimeOffenderUseEditVal] = useState([]);
  const [CriminalActivityEditVal, setCriminalActivityEditVal] = useState([]);
  const [CrimeBiasCategoryEditVal, setCrimeBiasCategoryEditVal] = useState([]);
  const [CrimeToolsUseEditVal, setCrimeToolsUseEditVal] = useState([]);
  const [CrimeTargeteEditVal, setCrimeTargeteEditVal] = useState([]);
  const [CrimeSuspectEditVal, setCrimeSuspectEditVal] = useState([]);
  const [SecurityViolatedEditVal, setSecurityViolatedEditVal] = useState([]);

  const [disabled, setDisabled] = useState(false);

  const [Selected, setSelected] = useState({
    PretendToBeID: null, CrimePointOfExitID: null, CrimePointOfEntry: null, CrimeOffenderUse: null, CrimeActivity: null, CrimeBiasCategory: null, CrimeToolsUse: null, CrimeTarget: null, CrimeSuspect: null, SecurityViolated: null
  })

  useEffect(() => {
    if (offenceID) GetBasicInfoData(); get_Point_Exit_Data(); get_Point_Entry_Data(); get_Crime_OffenderUse_Data(); get_Criminal_Activity_Data(); get_Crime_Bias_Category_Data(); get_Crime_Tools_Use_Data(); get_Crime_Target_Data(); get_Crime_Suspect_Data(); get_Security_Violated_Data();
  }, [offenceID])

  // Edit Data 
  const GetBasicInfoData = () => {
    const val = {
      // 'CrimeID': Decrypt_Id_Name(sessionStorage.getItem('OffenseCrimeId'), 'OforOffenseCrimeId'),
      'CrimeID': offenceID,
    }
    fetchPostData('CrimePretendToBe/GetData_CrimePretendToBe', val)
      .then((res) => {
        if (res) {
          setEditval(Comman_changeArrayFormatBasicInfo(res, 'PretendToBeID', 'Description', 'PretendToBeID', 'CrimePretendID', 'PretendToBeCode'));
        }
        else {
          setEditval([]);
        }
      })
  }

  const get_Point_Exit_Data = () => {
    const val = {
      'CrimeID': offenceID,
    }
    fetchPostData('OffensePointOfExit/GetDataOffensePointOfExit', val)
      .then((res) => {
        if (res) {
          setPointExitEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimePointOfExitID', 'Description', 'PretendToBeID', 'PointOfExitID', 'PointOfExitCode'));
        }
        else {
          setPointExitEditVal([]);
        }
      })
  }

  const get_Point_Entry_Data = () => {
    const val = {
      'CrimeID': offenceID,
    }
    fetchPostData('OffensePointOfEntry/GetData_OffensePointOfEntry', val)
      .then((res) => {
        console.log(res)
        if (res) {
          setPointEntryEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimePointOfEntryID', 'Description', 'PretendToBeID', 'PointOfEntryID', 'EntryPointCode'));
        }
        else {
          setPointEntryEditVal([]);
        }
      })
  }

  const get_Crime_OffenderUse_Data = () => {
    const val = {
      'CrimeID': offenceID,
    }
    fetchPostData('OffenseOffenderUse/GetData_OffenseOffenderUse', val)
      .then((res) => {
        if (res) {
          setCrimeOffenderUseEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeOffenderUseID', 'Description', 'PretendToBeID', 'OffenderUseID', 'OffenderUseCode'));
        }
        else {
          setCrimeOffenderUseEditVal([]);
        }
      })
  }

  const get_Criminal_Activity_Data = () => {
    const val = {
      'CrimeID': offenceID,
    }
    fetchPostData('CriminalActivity/GetData_OffenseCriminalActivity', val)
      .then((res) => {
        console.log(res)
        if (res) {
          setCriminalActivityEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeActivityID', 'Description', 'PretendToBeID', 'ActivityID', 'CriminalActivityCode'));
        }
        else {
          setCriminalActivityEditVal([]);
        }
      })
  }

  const get_Crime_Bias_Category_Data = () => {
    const val = {
      'CrimeID': offenceID,
    }
    fetchPostData('OffenseBiasCategory/GetData_OffenseBiasCategory', val)
      .then((res) => {
        console.log(res)
        if (res) {
          setCrimeBiasCategoryEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeBiasCategoryID', 'Description', 'PretendToBeID', 'BiasCategoryID', 'BiasCode'));
        }
        else {
          setCrimeBiasCategoryEditVal([]);
        }
      })
  }

  const get_Crime_Tools_Use_Data = () => {
    const val = {
      'CrimeID': offenceID,
    }
    fetchPostData('OffenseToolsUse/GetData_OffenseToolsUse', val)
      .then((res) => {
        if (res) {
          setCrimeToolsUseEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeToolsUseID', 'Description', 'PretendToBeID', 'ToolsUseID', 'ToolsUseCode'));
        }
        else {
          setCrimeToolsUseEditVal([]);
        }
      })
  }

  const get_Crime_Target_Data = () => {
    const val = {
      'CrimeID': offenceID,
    }
    fetchPostData('OffenseTarget/GetData_OffenseTarget', val)
      .then((res) => {
        if (res) {
          setCrimeTargeteEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeTargetID', 'Description', 'PretendToBeID', 'TargetID', 'TargetCode'));
        }
        else {
          setCrimeTargeteEditVal([]);
        }
      })
  }

  const get_Crime_Suspect_Data = () => {
    const val = {
      'CrimeID': offenceID,
    }
    fetchPostData('OffenseSuspect/GetData_OffenseSuspect', val)
      .then((res) => {
        if (res) {
          setCrimeSuspectEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeSuspectID', 'Description', 'PretendToBeID', 'SuspectID', 'SuspectCode'));
        }
        else {
          setCrimeSuspectEditVal([]);
        }
      })
  }

  const get_Security_Violated_Data = () => {
    const val = {
      'CrimeID': offenceID,
    }
    fetchPostData('OffenseSecurityViolated/GetData_OffenseSecurityViolated', val)
      .then((res) => {
        if (res) {
          setSecurityViolatedEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeSecurityviolatedID', 'Description', 'PretendToBeID', 'SecurityviolatedID', 'SecurityviolatedCode'));
        }
        else {
          setSecurityViolatedEditVal([]);
        }
      })
  }

  useEffect(() => {
    if (editval) { setSelected(prevValues => { return { ...prevValues, ['PretendToBeID']: editval } }) }
    if (pointExitEditVal) { setSelected(prevValues => { return { ...prevValues, ['CrimePointOfExitID']: pointExitEditVal } }) }
    if (pointEntryEditVal) { setSelected(prevValues => { return { ...prevValues, ['CrimePointOfEntry']: pointEntryEditVal } }) }
    if (CrimeOffenderUseEditVal) { setSelected(prevValues => { return { ...prevValues, ['CrimeOffenderUse']: CrimeOffenderUseEditVal } }) }
    if (CriminalActivityEditVal) { setSelected(prevValues => { return { ...prevValues, ['CrimeActivity']: CriminalActivityEditVal } }) }
    if (CrimeBiasCategoryEditVal) { setSelected(prevValues => { return { ...prevValues, ['CrimeBiasCategory']: CrimeBiasCategoryEditVal } }) }
    if (CrimeToolsUseEditVal) { setSelected(prevValues => { return { ...prevValues, ['CrimeToolsUse']: CrimeToolsUseEditVal } }) }
    if (CrimeTargeteEditVal) { setSelected(prevValues => { return { ...prevValues, ['CrimeTarget']: CrimeTargeteEditVal } }) }
    if (CrimeSuspectEditVal) { setSelected(prevValues => { return { ...prevValues, ['CrimeSuspect']: CrimeSuspectEditVal } }) }
    if (SecurityViolatedEditVal) { setSelected(prevValues => { return { ...prevValues, ['SecurityViolated']: SecurityViolatedEditVal } }) }
  }, [editval, pointExitEditVal, pointEntryEditVal, CrimeOffenderUseEditVal, CriminalActivityEditVal, CrimeBiasCategoryEditVal, CrimeToolsUseEditVal, CrimeTargeteEditVal, CrimeSuspectEditVal, SecurityViolatedEditVal])

  // Onchange Fuction
  const Agencychange = (selected) => {
    setSelected({
      ...Selected,
      PretendToBeID: selected
    })
    const len = selected.length - 1
    if (selected?.length < editval?.length) {
      var missing = null;
      var i = editval.length;
      while (i) {
        missing = (~selected.indexOf(editval[--i])) ? missing : editval[i];
      }
      // console.log(missing);
      DelSertBasicInfo(missing.id, 'CrimePretendID', 'CrimePretendToBe/DeleteCrimePretendToBe')
    } else {
      InSertBasicInfo(selected[len].value, 'PretendToBeID', 'CrimePretendToBe/InsertCrimePretendToBe')
    }
  }

  const poinOfExitchange = (selected) => {
    setSelected({
      ...Selected,
      CrimePointOfExitID: selected
    })
    const len = selected.length - 1
    if (selected?.length < pointExitEditVal?.length) {
      var missing = null;
      var i = pointExitEditVal.length;
      while (i) {
        missing = (~selected.indexOf(pointExitEditVal[--i])) ? missing : pointExitEditVal[i];
      }
      DelSertBasicInfo(missing.id, 'PointOfExitID', 'OffensePointOfExit/DeleteOffensePointOfExit')
    } else {
      InSertBasicInfo(selected[len].value, 'CrimePointOfExitID', 'OffensePointOfExit/InsertOffensePointOfExit')
    }
  }

  const poinOfEntrychange = (selected) => {
    setSelected({
      ...Selected,
      CrimePointOfEntry: selected
    })
    const len = selected.length - 1
    if (selected?.length < pointEntryEditVal?.length) {
      var missing = null;
      var i = pointEntryEditVal.length;
      while (i) {
        missing = (~selected.indexOf(pointEntryEditVal[--i])) ? missing : pointEntryEditVal[i];
      }
      DelSertBasicInfo(missing.id, 'PointOfEntryID', 'OffensePointOfEntry/DeleteOffensePointOfEntry')
    } else {
      InSertBasicInfo(selected[len].value, 'CrimePointOfEntryID', 'OffensePointOfEntry/InsertOffensePointOfEntry')
    }
  }

  const OffenderUsechange = (selected) => {
    setSelected({
      ...Selected,
      CrimeOffenderUse: selected
    })
    const len = selected.length - 1
    if (selected?.length < CrimeOffenderUseEditVal?.length) {
      var missing = null;
      var i = CrimeOffenderUseEditVal.length;
      while (i) {
        missing = (~selected.indexOf(CrimeOffenderUseEditVal[--i])) ? missing : CrimeOffenderUseEditVal[i];
      }
      DelSertBasicInfo(missing.id, 'OffenderUseID', 'OffenseOffenderUse/DeleteOffenseOffenderUse')
    } else {
      InSertBasicInfo(selected[len].value, 'CrimeOffenderUseID', 'OffenseOffenderUse/InsertOffenseOffenderUse')
    }
  }

  const CrimeActivitychange = (selected) => {
    setSelected({
      ...Selected,
      CrimeActivity: selected
    })
    const len = selected.length - 1
    if (selected?.length < CriminalActivityEditVal?.length) {
      var missing = null;
      var i = CriminalActivityEditVal.length;
      while (i) {
        missing = (~selected.indexOf(CriminalActivityEditVal[--i])) ? missing : CriminalActivityEditVal[i];
      }
      DelSertBasicInfo(missing.id, 'ActivityID', 'CriminalActivity/DeleteOffenseCriminalActivity')
    } else {
      InSertBasicInfo(selected[len].value, 'CrimeActivityID', 'CriminalActivity/InsertOffenseCriminalActivity')
    }
  }

  const CrimeBiasCategorychange = (selected) => {
    setSelected({
      ...Selected,
      CrimeBiasCategory: selected
    })
    const len = selected.length - 1
    if (selected?.length < CrimeBiasCategoryEditVal?.length) {
      var missing = null;
      var i = CrimeBiasCategoryEditVal.length;
      while (i) {
        missing = (~selected.indexOf(CrimeBiasCategoryEditVal[--i])) ? missing : CrimeBiasCategoryEditVal[i];
      }
      DelSertBasicInfo(missing.id, 'BiasCategoryID', 'OffenseBiasCategory/DeleteOffenseBiasCategory')
    } else {
      InSertBasicInfo(selected[len].value, 'CrimeBiasCategoryID', 'OffenseBiasCategory/InsertOffenseBiasCategory')
    }
  }

  const CrimeToolsUsechange = (selected) => {
    setSelected({
      ...Selected,
      CrimeToolsUse: selected
    })
    const len = selected.length - 1
    if (selected?.length < CrimeToolsUseEditVal?.length) {
      var missing = null;
      var i = CrimeToolsUseEditVal.length;
      while (i) {
        missing = (~selected.indexOf(CrimeToolsUseEditVal[--i])) ? missing : CrimeToolsUseEditVal[i];
      }
      DelSertBasicInfo(missing.id, 'ToolsUseID', 'OffenseToolsUse/DeleteOffenseToolsUse')
    } else {
      InSertBasicInfo(selected[len].value, 'CrimeToolsUseID', 'OffenseToolsUse/InsertOffenseToolsUse')
    }
  }

  const CrimeTargetchange = (selected) => {
    setSelected({
      ...Selected,
      CrimeTarget: selected
    })
    const len = selected.length - 1
    if (selected?.length < CrimeTargeteEditVal?.length) {
      var missing = null;
      var i = CrimeTargeteEditVal.length;
      while (i) {
        missing = (~selected.indexOf(CrimeTargeteEditVal[--i])) ? missing : CrimeTargeteEditVal[i];
      }
      DelSertBasicInfo(missing.id, 'TargetID', 'OffenseTarget/DeleteOffenseTarget')
    } else {
      InSertBasicInfo(selected[len].value, 'CrimeTargetID', 'OffenseTarget/InsertOffenseTarget')
    }
  }

  const CrimeSuspectchange = (selected) => {
    setSelected({
      ...Selected,
      CrimeSuspect: selected
    })
    const len = selected.length - 1
    if (selected?.length < CrimeSuspectEditVal?.length) {
      var missing = null;
      var i = CrimeSuspectEditVal.length;
      while (i) {
        missing = (~selected.indexOf(CrimeSuspectEditVal[--i])) ? missing : CrimeSuspectEditVal[i];
      }
      DelSertBasicInfo(missing.id, 'SuspectID', 'OffenseSuspect/DeleteOffenseSuspect')
    } else {
      InSertBasicInfo(selected[len].value, 'CrimeSuspectID', 'OffenseSuspect/InsertOffenseSuspect')
    }
  }

  const SecurityViolatedchange = (selected) => {
    setSelected({
      ...Selected,
      SecurityViolated: selected
    })
    const len = selected.length - 1
    if (selected?.length < SecurityViolatedEditVal?.length) {
      var missing = null;
      var i = SecurityViolatedEditVal.length;
      while (i) {
        missing = (~selected.indexOf(SecurityViolatedEditVal[--i])) ? missing : SecurityViolatedEditVal[i];
      }
      DelSertBasicInfo(missing.id, 'SecurityviolatedID', 'OffenseSecurityViolated/DeleteOffenseSecurityViolated')
    } else {
      InSertBasicInfo(selected[len].value, 'CrimeSecurityviolatedID', 'OffenseSecurityViolated/InsertOffenseSecurityViolated')
    }
  }


  useEffect(() => {
    getPretendTobeDrpVal(); getPointExitTobeDrpVal(); getPointEntryTobeDrpVal(); getCrimeOffenderUseDrpVal(); getCrimeActivityDrpVal(); getCrimeBiasCategoryDrpVal(); getCrimeToolsUseDrpVal(); getCrimeTargetDrpVal(); getCrimeSuspectDrpVal(); getCrimeSecurityviolatedDrpVal()
  }, [])

  const getPretendTobeDrpVal = () => {
    const val = {
      //  AgencyID: LoginAgencyID,
      AgencyID: LoginAgencyID,
    }
    fetchPostData('PretendToBe/GetDataDropDown_PretendToBe', val).then((data) => {
      if (data) {
        setPretentedDrp(threeColArrayWithCode(data, 'PretendToBeID', 'Description', 'PretendToBeCode'))
      } else {
        setPretentedDrp([]);
      }
    })
  }

  const getPointExitTobeDrpVal = () => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('CrimePointOfexit/GetDataDropDown_CrimePointOfexit', val).then((data) => {
      if (data) {
        setPointExitDrp(threeColArrayWithCode(data, 'PointOfExit', 'Description', 'PointOfExitCode'))
      } else {
        setPointExitDrp([]);
      }
    })
  }

  const getPointEntryTobeDrpVal = () => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('CrimePointOfEntry/GetDataDropDown_CrimePointOfEntry', val).then((data) => {
      if (data) {
        setPointEntryDrp(threeColArrayWithCode(data, 'EntryPointId', 'Description', 'EntryPointCode'))
      } else {
        setPointEntryDrp([]);
      }
    })
  }

  const getCrimeOffenderUseDrpVal = () => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('CrimeOffenderUse/GetDataDropDown_CrimeOffenderUse', val).then((data) => {
      if (data) {
        setCrimeOffenderUseDrp(threeColArrayWithCode(data, 'OffenderUseID', 'Description', 'OffenderUseCode'))
      } else {
        setCrimeOffenderUseDrp([]);
      }
    })
  }

  const getCrimeActivityDrpVal = () => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('CriminalActivity/GetDataDropDown_CriminalActivity', val).then((data) => {
      if (data) {
        setCrimeActivityDrp(threeColArrayWithCode(data, 'CriminalActivityID', 'Description', 'CriminalActivityCode'))
      } else {
        setCrimeActivityDrp([]);
      }
    })
  }

  const getCrimeBiasCategoryDrpVal = () => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('CrimeBias/GetDataDropDown_CrimeBias', val).then((data) => {
      if (data) {
        setCrimeBiasCategoryDrp(threeColArrayWithCode(data, 'BiasID', 'Description', 'BiasCode'))
      } else {
        setCrimeBiasCategoryDrp([]);
      }
    })
  }

  const getCrimeToolsUseDrpVal = () => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('CrimeToolsUse/GetDataDropDown_CrimeToolsUse', val).then((data) => {
      if (data) {
        setToolsUseIDDrp(threeColArrayWithCode(data, 'ToolsUseID', 'Description', 'ToolsUseCode'))
      } else {
        setToolsUseIDDrp([]);
      }
    })
  }

  const getCrimeTargetDrpVal = () => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('CrimeTarget/GetDataDropDown_CrimeTarget', val).then((data) => {
      if (data) {
        setCrimeTargetDrp(threeColArrayWithCode(data, 'TargetID', 'Description', 'TargetCode'))
      } else {
        setCrimeTargetDrp([]);
      }
    })
  }

  const getCrimeSuspectDrpVal = () => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('CrimeSuspect/GetDataDropDown_CrimeSuspect', val).then((data) => {
      if (data) {
        console.log(data)
        setCrimeSuspectDrp(threeColArrayWithCode(data, 'SuspectID', 'Description', 'SuspectCode'))
      } else {
        setCrimeSuspectDrp([]);
      }
    })
  }

  const getCrimeSecurityviolatedDrpVal = () => {
    const val = {
      AgencyID: LoginAgencyID,
    }
    fetchPostData('CrimeSecurityviolated/GetDataDropDown_CrimeSecurityviolated', val).then((data) => {
      if (data) {
        setCrimeSecurityviolatedDrp(threeColArrayWithCode(data, 'SecurityviolatedID', 'Description', 'SecurityviolatedCode'))
      } else {
        setCrimeSecurityviolatedDrp([]);
      }
    })
  }


  const InSertBasicInfo = (id, col1, url) => {
    setDisabled(true)
    const val = {
      'CrimeID': offenceID,
      [col1]: id,
      'CreatedByUserFK': LoginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        setDisabled(false); toastifySuccess(res.Message);
        col1 === 'PretendToBeID' && GetBasicInfoData();
        col1 === 'CrimePointOfExitID' && get_Point_Exit_Data();
        col1 === 'CrimePointOfEntryID' && get_Point_Entry_Data();
        col1 === 'CrimeOffenderUseID' && get_Crime_OffenderUse_Data();
        col1 === 'CrimeActivityID' && get_Criminal_Activity_Data();
        col1 === 'CrimeBiasCategoryID' && get_Crime_Bias_Category_Data();
        col1 === 'CrimeToolsUseID' && get_Crime_Tools_Use_Data();
        col1 === 'CrimeTargetID' && get_Crime_Target_Data();
        col1 === 'CrimeSuspectID' && get_Crime_Suspect_Data();
        col1 === 'CrimeSecurityviolatedID' && get_Security_Violated_Data();
      } else {
        console.log("Somthing Wrong");
      }
    })
  }

  const DelSertBasicInfo = (CrimePretendID, col1, url) => {
    setDisabled(true)
    const val = {
      [col1]: CrimePretendID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        setDisabled(false); toastifySuccess(res.Message);
        col1 === 'CrimePretendID' && GetBasicInfoData();
        col1 === 'PointOfExitID' && get_Point_Exit_Data();
        col1 === 'PointOfEntryID' && get_Point_Entry_Data();
        col1 === 'OffenderUseID' && get_Crime_OffenderUse_Data();
        col1 === 'ActivityID' && get_Criminal_Activity_Data();
        col1 === 'BiasCategoryID' && get_Crime_Bias_Category_Data();
        col1 === 'ToolsUseID' && get_Crime_Tools_Use_Data();
        col1 === 'TargetID' && get_Crime_Target_Data();
        col1 === 'SuspectID' && get_Crime_Suspect_Data();
        col1 === 'SecurityviolatedID' && get_Security_Violated_Data();
      } else {
        console.log("Somthing Wrong");
      }
    })
  }

  return (
    <>
      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0">Basic Information</p>
          <FindListDropDown
            array={OffBasicInfoListDropDownArray}
          />
        </div>
        <div className="row ">
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className=" dropdown__box">
              <SelectBox
                options={pretentedDrp}
                isClearable={false}
                isDisabled={disabled}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option, MultiValue, animatedComponents }}
                onChange={(e) => Agencychange(e)}
                value={Selected.PretendToBeID}
              />
              <label htmlFor="">Pretented To Be</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className=" dropdown__box">
              <SelectBox
                name='pointofexit'
                options={pointExitDrp}
                isClearable={false}
                isDisabled={disabled}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option, MultiValue, animatedComponents }}
                onChange={(e) => poinOfExitchange(e)}
                value={Selected.CrimePointOfExitID}
              />
              <label htmlFor="">Point Of Exit</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className=" dropdown__box">
              <SelectBox
                name='pointofentry'
                options={pointEntryDrp}
                isClearable={false}
                isDisabled={disabled}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option, MultiValue, animatedComponents }}
                onChange={(e) => poinOfEntrychange(e)}
                value={Selected.CrimePointOfEntry}
              />
              <label htmlFor="">Point Of Entry</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6  mt-2">
            <div className=" dropdown__box">
              <SelectBox
                name='offenderusing'
                options={CrimeOffenderUseDrp}
                isClearable={false}
                isDisabled={disabled}
                isMulti
                style={ErrorStyleOffenderUse(CrimeOffenderUseEditVal)}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option, MultiValue, animatedComponents }}
                onChange={(e) => OffenderUsechange(e)}
                value={Selected.CrimeOffenderUse}
              />
              <label htmlFor="">Offender Using {ErrorStyleOffenderUse(CrimeOffenderUseEditVal) === 'N' ? <ErrorTooltip Error={OffenderUseError_N} /> : ErrorStyleOffenderUse(CrimeOffenderUseEditVal) === 'A' || ErrorStyleOffenderUse(CrimeOffenderUseEditVal) === 'C' || ErrorStyleOffenderUse(CrimeOffenderUseEditVal) === 'D' || ErrorStyleOffenderUse(CrimeOffenderUseEditVal) === undefined ? <></> : <ErrorTooltip Error={OffenderUseError_Other} />}</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className=" dropdown__box">
              <SelectBox
                name='CrimeActivity'
                options={CrimeActivityDrp}
                isClearable={false}
                isDisabled={disabled}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option, MultiValue, animatedComponents }}
                onChange={(e) => CrimeActivitychange(e)}

                value={Selected.CrimeActivity}
              />
              <label htmlFor="">Criminal Activity</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className=" dropdown__box">
              <SelectBox
                name='bias'
                options={CrimeBiasCategoryDrp}
                isClearable={false}
                isDisabled={disabled}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option, MultiValue, animatedComponents }}
                onChange={(e) => CrimeBiasCategorychange(e)}

                value={Selected.CrimeBiasCategory}
              />
              <label htmlFor="">Bias {ErrorStyleBias(CrimeBiasCategoryEditVal) === 'N' ? <ErrorTooltip Error={BiasError} /> : <></>}</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className=" dropdown__box">
              <SelectBox
                name='btoolsias'
                options={ToolsUseIDDrp}
                isClearable={false}
                isDisabled={disabled}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option, MultiValue, animatedComponents }}
                onChange={(e) => CrimeToolsUsechange(e)}
                menuPlacement="top"

                value={Selected.CrimeToolsUse}
              />
              <label htmlFor="">Tools</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className=" dropdown__box">
              <SelectBox
                name='target'
                options={CrimeTargetDrp}
                isClearable={false}
                isDisabled={disabled}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option, MultiValue, animatedComponents }}
                onChange={(e) => CrimeTargetchange(e)}

                value={Selected.CrimeTarget}
                menuPlacement="top"

              />
              <label htmlFor="">Target</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className=" dropdown__box">
              <SelectBox
                name='suspectaction'
                options={CrimeSuspectDrp}
                isClearable={false}
                isDisabled={disabled}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option, MultiValue, animatedComponents }}
                onChange={(e) => CrimeSuspectchange(e)}
                menuPlacement="top"

                value={Selected.CrimeSuspect}
              />
              <label htmlFor="">Suspect Action</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className=" dropdown__box">
              <SelectBox
                name='SecurityViolated'
                options={CrimeSecurityviolatedDrp}
                isClearable={false}
                isDisabled={disabled}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option, MultiValue, animatedComponents }}
                onChange={(e) => SecurityViolatedchange(e)}
                menuPlacement="top"
                value={Selected.SecurityViolated}
              />
              <label htmlFor="">Security Violated</label>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BasicInformation