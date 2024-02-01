import React, { useEffect, useState } from 'react'
import SelectBox from '../../../../../Common/SelectBox';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { Decrypt_Id_Name } from '../../../../../Common/Utility';
import { Comman_changeArrayFormatBasicInfo, threeColArrayWithCode } from '../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../Common/AlertMsg';
import { components } from "react-select";
import makeAnimated from "react-select/animated";

const Option = props => {
  return (
    <div>
      <components.Option {...props}>
        <input type="checkbox" checked={props.isSelected} onChange={() => null} />
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
const MobileBasicInfromation = () => {
  //--------------------Drop-Down-------------------------------
  const [pretentedDrp, setPretentedDrp] = useState([]);
  const [pointExitDrp, setPointExitDrp] = useState([]);
  const [pointEntryDrp, setPointEntryDrp] = useState([]);
  const [CrimeOffenderUseDrp, setCrimeOffenderUseDrp] = useState([]);
  const [CrimeActivityDrp, setCrimeActivityDrp] = useState([]);
  const [ToolsUseIDDrp, setToolsUseIDDrp] = useState([]);
  const [CrimeTargetDrp, setCrimeTargetDrp] = useState([]);
  const [CrimeSecurityviolatedDrp, setCrimeSecurityviolatedDrp] = useState([]);
  const [CrimeBiasCategoryDrp, setCrimeBiasCategoryDrp] = useState([]);
  const [CrimeSuspectDrp, setCrimeSuspectDrp] = useState([]);

  //----------Editvalue------------------------
  const [editval, setEditval] = useState([]);
  const [pointExitEditVal, setPointExitEditVal] = useState([]);
  const [pointEntryEditVal, setPointEntryEditVal] = useState([]);
  const [CrimeOffenderUseEditVal, setCrimeOffenderUseEditVal] = useState([]);
  const [CriminalActivityEditVal, setCriminalActivityEditVal] = useState([]);
  const [CrimeToolsUseEditVal, setCrimeToolsUseEditVal] = useState([]);
  const [CrimeTargeteEditVal, setCrimeTargeteEditVal] = useState([]);
  const [SecurityViolatedEditVal, setSecurityViolatedEditVal] = useState([]);
  const [CrimeBiasCategoryEditVal, setCrimeBiasCategoryEditVal] = useState([]);
  const [CrimeSuspectEditVal, setCrimeSuspectEditVal] = useState([]);

  const [disabled, setDisabled] = useState(false)
  const [Selected, setSelected] = useState({
    PretendToBeID: null, CrimePointOfExitID: null, CrimePointOfEntry: null, CrimeOffenderUse: null, CrimeActivity: null, CrimeBiasCategory: null, CrimeToolsUse: null, CrimeTarget: null, CrimeSuspect: null, SecurityViolated: null
  })
  //-----------------------------editvalue----------------------------
  useEffect(() => {
    if (editval) { setSelected(prevValues => { return { ...prevValues, ['PretendToBeID']: editval } }) }
    if (pointExitEditVal) { setSelected(prevValues => { return { ...prevValues, ['CrimePointOfExitID']: pointExitEditVal } }) }
    if (pointEntryEditVal) { setSelected(prevValues => { return { ...prevValues, ['CrimePointOfEntry']: pointEntryEditVal } }) }
    if (CrimeOffenderUseEditVal) { setSelected(prevValues => { return { ...prevValues, ['CrimeOffenderUse']: CrimeOffenderUseEditVal } }) }
    if (CriminalActivityEditVal) { setSelected(prevValues => { return { ...prevValues, ['CrimeActivity']: CriminalActivityEditVal } }) }
    if (CrimeToolsUseEditVal) { setSelected(prevValues => { return { ...prevValues, ['CrimeToolsUse']: CrimeToolsUseEditVal } }) }
    if (CrimeTargeteEditVal) { setSelected(prevValues => { return { ...prevValues, ['CrimeTarget']: CrimeTargeteEditVal } }) }
    if (CrimeBiasCategoryEditVal) { setSelected(prevValues => { return { ...prevValues, ['CrimeBiasCategory']: CrimeBiasCategoryEditVal } }) }
    if (SecurityViolatedEditVal) { setSelected(prevValues => { return { ...prevValues, ['SecurityViolated']: SecurityViolatedEditVal } }) }
    if (CrimeSuspectEditVal) { setSelected(prevValues => { return { ...prevValues, ['CrimeSuspect']: CrimeSuspectEditVal } }) }

    // if (Crimalvolitile)

  }, [editval, pointExitEditVal, pointEntryEditVal, CrimeOffenderUseEditVal, CriminalActivityEditVal, CrimeToolsUseEditVal, CrimeTargeteEditVal, SecurityViolatedEditVal, CrimeBiasCategoryEditVal, CrimeSuspectEditVal])
  //----------------------------------Get_Data-------------------------------------------
  useEffect(() => {
    GetBasicInfoData(); get_Point_Exit_Data(); get_Point_Entry_Data(); get_Crime_OffenderUse_Data(); get_Criminal_Activity_Data(); get_Crime_Tools_Use_Data(); get_Crime_Target_Data(); get_Security_Violated_Data(); get_Crime_Bias_Category_Data(); get_Crime_Suspect_Data();
  }, [])

  const GetBasicInfoData = () => {
    const val = {
      'CrimeID': '',
    }
    fetchPostData('CrimePretendToBe_FRW/GetData_CrimePretendToBe_FRW', val)
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
      'CrimeID': '',
    }
    fetchPostData('CrimePointOfExit_FRW/GetData_CrimePointOfExit_FRW', val)
      .then((res) => {
        if (res) {
          setPointExitEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimePointOfExitID', 'Description', 'PretendToBeID', 'PointOfExitID', 'PointOfExitCode'));
        } else { setPointExitEditVal([]); }
      })
  }

  const get_Point_Entry_Data = () => {
    const val = {
      'CrimeID': '',
    }
    fetchPostData('CrimePointOfEntry_FRW/GetData_OffensePointOfEntry_FRW', val)
      .then((res) => {
        if (res) {
          setPointEntryEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimePointOfEntryID', 'Description', 'PretendToBeID', 'PointOfEntryID', 'EntryPointCode'));
        } else { setPointEntryEditVal([]); }
      })
  }

  const get_Crime_OffenderUse_Data = () => {
    const val = {
      'CrimeID': '',
    }
    fetchPostData('OffenseOffenderUse_FRW/GetData_OffenseOffenderUse_FRW', val)
      .then((res) => {
        if (res) {
          setCrimeOffenderUseEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeOffenderUseID', 'Description', 'PretendToBeID', 'OffenderUseID', 'OffenderUseCode'));
        } else { setCrimeOffenderUseEditVal([]); }
      })
  }

  const get_Criminal_Activity_Data = () => {
    const val = {
      'CrimeID': '',
    }
    fetchPostData('CriminalActivity_FRW/GetData_OffenseCriminalActivity_FRW', val)
      .then((res) => {
        if (res) {
          setCriminalActivityEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeActivityID', 'Description', 'PretendToBeID', 'ActivityID', 'CriminalActivityCode'));
        }
        else { setCriminalActivityEditVal([]); }
      })
  }
  const get_Crime_Tools_Use_Data = () => {
    const val = {
      'CrimeID': '',
    }
    fetchPostData('OffenseToolsUse_FRW/GetData_OffenseToolsUse_FRW', val)
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
      'CrimeID': '',
    }
    fetchPostData('OffenseTarget_FRW/GetData_OffenseTarget_FRW', val)
      .then((res) => {
        if (res) {
          setCrimeTargeteEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeTargetID', 'Description', 'PretendToBeID', 'TargetID', 'TargetCode'));
        }
        else {
          setCrimeTargeteEditVal([]);
        }
      })
  }
  const get_Security_Violated_Data = () => {
    const val = {
      'CrimeID': '',
    }
    fetchPostData('OffenseSecurityViolated_FRW/GetData_OffenseSecurityViolated_FRW', val)
      .then((res) => {
        if (res) {
          setSecurityViolatedEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeSecurityviolatedID', 'Description', 'PretendToBeID', 'SecurityviolatedID', 'SecurityviolatedCode'));
        }
        else {
          setSecurityViolatedEditVal([]);
        }
      })
  }
  const get_Crime_Bias_Category_Data = () => {
    const val = {
      'CrimeID': '',
    }
    fetchPostData('OffenseBiasCategory_FRW/GetData_OffenseBiasCategory_FRW', val)
      .then((res) => {
        if (res) {
          setCrimeBiasCategoryEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeBiasCategoryID', 'Description', 'PretendToBeID', 'BiasCategoryID', 'BiasCode'));
        }
        else {
          setCrimeBiasCategoryEditVal([]);
        }
      })
  }

  const get_Crime_Suspect_Data = () => {
    const val = {
      'CrimeID': '',
    }
    fetchPostData('OffenseSuspect_FRW/GetData_OffenseSuspect_FRW', val)
      .then((res) => {
        if (res) {
          setCrimeSuspectEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeSuspectID', 'Description', 'PretendToBeID', 'SuspectID', 'SuspectCode'));
        }
        else {
          setCrimeSuspectEditVal([]);
        }
      })
  }
  //-------------------------------------Get_Drop_Down-List-----------------------------------------------

  useEffect(() => {
    getPretendTobeDrpVal(); getPointExitTobeDrpVal(); getPointEntryTobeDrpVal(); getCrimeOffenderUseDrpVal(); getCrimeActivityDrpVal(); getCrimeToolsUseDrpVal(); getCrimeTargetDrpVal(); getCrimeSecurityviolatedDrpVal(); getCrimeBiasCategoryDrpVal(); getCrimeSuspectDrpVal();

  }, [])

  const getPretendTobeDrpVal = () => {
    const val = {
      AgencyID: '',
    }
    fetchPostData('PretendToBe/GetDataDropDown_PretendToBe', val).then((data) => {
      if (data) {
        setPretentedDrp(threeColArrayWithCode(data, 'PretendToBeID', 'Description', 'PretendToBeCode'))
      } else { setPretentedDrp([]); }
    })
  }

  const getPointExitTobeDrpVal = () => {
    const val = {
      AgencyID: '',
    }
    fetchPostData('CrimePointOfexit/GetDataDropDown_CrimePointOfexit', val).then((data) => {
      if (data) {
        setPointExitDrp(threeColArrayWithCode(data, 'PointOfExit', 'Description', 'PointOfExitCode'))
      } else { setPointExitDrp([]); }
    })
  }
  const getPointEntryTobeDrpVal = () => {
    const val = {
      AgencyID: '',
    }
    fetchPostData('CrimePointOfEntry/GetDataDropDown_CrimePointOfEntry', val).then((data) => {
      if (data) {
        setPointEntryDrp(threeColArrayWithCode(data, 'EntryPointId', 'Description', 'EntryPointCode'))
      } else { setPointEntryDrp([]); }
    })
  }

  const getCrimeOffenderUseDrpVal = () => {
    const val = {
      AgencyID: '',
    }
    fetchPostData('CrimeOffenderUse/GetDataDropDown_CrimeOffenderUse', val).then((data) => {
      if (data) {
        setCrimeOffenderUseDrp(threeColArrayWithCode(data, 'OffenderUseID', 'Description', 'OffenderUseCode'))
      } else { setCrimeOffenderUseDrp([]); }
    })
  }

  const getCrimeActivityDrpVal = () => {
    const val = {
      AgencyID: '',
    }
    fetchPostData('CriminalActivity/GetDataDropDown_CriminalActivity', val).then((data) => {
      if (data) {
        setCrimeActivityDrp(threeColArrayWithCode(data, 'CriminalActivityID', 'Description', 'CriminalActivityCode'))
      } else { setCrimeActivityDrp([]); }
    })
  }

  const getCrimeToolsUseDrpVal = () => {
    const val = {
      AgencyID: '',
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
      AgencyID: '',
    }
    fetchPostData('CrimeTarget/GetDataDropDown_CrimeTarget', val).then((data) => {
      if (data) {
        setCrimeTargetDrp(threeColArrayWithCode(data, 'TargetID', 'Description', 'TargetCode'))
      } else {
        setCrimeTargetDrp([]);
      }
    })
  }

  const getCrimeSecurityviolatedDrpVal = () => {
    const val = {
      AgencyID: '',
    }
    fetchPostData('CrimeSecurityviolated/GetDataDropDown_CrimeSecurityviolated', val).then((data) => {
      if (data) {
        setCrimeSecurityviolatedDrp(threeColArrayWithCode(data, 'SecurityviolatedID', 'Description', 'SecurityviolatedCode'))
      } else {
        setCrimeSecurityviolatedDrp([]);
      }
    })
  }
  const getCrimeBiasCategoryDrpVal = () => {
    const val = {
      AgencyID: '',
    }
    fetchPostData('CrimeBias/GetDataDropDown_CrimeBias', val).then((data) => {
      if (data) {
        setCrimeBiasCategoryDrp(threeColArrayWithCode(data, 'BiasID', 'Description', 'BiasCode'))
      } else {
        setCrimeBiasCategoryDrp([]);
      }
    })
  }
  const getCrimeSuspectDrpVal = () => {
    const val = {
      AgencyID: '',
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
  // -----------------Onchange Fuction---------------------
  const Agencychange = (selected) => {
    setSelected({ ...Selected, PretendToBeID: selected })
    const len = selected.length - 1
    if (selected?.length < editval?.length) {
      var missing = null;
      var i = editval.length;
      while (i) { missing = (~selected.indexOf(editval[--i])) ? missing : editval[i]; }
      DelSertBasicInfo(missing.id, 'CrimePretendID', 'CrimePretendToBe_FRW/Delete_CrimePretendToBe_FRW')
    } else { InSertBasicInfo(selected[len].value, 'PretendToBeID', 'CrimePretendToBe_FRW/Insert_CrimePretendToBe_FRW') }
  }
  const poinOfExitchange = (selected) => {
    setSelected({ ...Selected, CrimePointOfExitID: selected })
    const len = selected.length - 1
    if (selected?.length < pointExitEditVal?.length) {
      var missing = null;
      var i = pointExitEditVal.length;
      while (i) { missing = (~selected.indexOf(pointExitEditVal[--i])) ? missing : pointExitEditVal[i]; }
      DelSertBasicInfo(missing.id, 'PointOfExitID', 'CrimePointOfExit_FRW/DeleteCrimePointOfExit_FRW')
    } else { InSertBasicInfo(selected[len].value, 'CrimePointOfExitID', 'CrimePointOfExit_FRW/InsertCrimePointOfExit_FRW') }
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
      while (i) { missing = (~selected.indexOf(pointEntryEditVal[--i])) ? missing : pointEntryEditVal[i]; }
      DelSertBasicInfo(missing.id, 'PointOfEntryID', 'CrimePointOfEntry_FRW/DeleteOffensePointOfEntry_FRW')
    } else { InSertBasicInfo(selected[len].value, 'CrimePointOfEntryID', 'CrimePointOfEntry_FRW/InsertOffensePointOfEntry_FRW') }
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
      while (i) { missing = (~selected.indexOf(CrimeOffenderUseEditVal[--i])) ? missing : CrimeOffenderUseEditVal[i]; }
      DelSertBasicInfo(missing.id, 'OffenderUseID', 'OffenseOffenderUse_FRW/DeleteOffenseOffenderUse_FRW')
    } else { InSertBasicInfo(selected[len].value, 'CrimeOffenderUseID', 'OffenseOffenderUse_FRW/InsertOffenseOffenderUse_FRW') }
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
      DelSertBasicInfo(missing.id, 'ActivityID', 'CriminalActivity_FRW/DeleteOffenseCriminalActivity_FRW')
    } else { InSertBasicInfo(selected[len].value, 'CrimeActivityID', 'CriminalActivity_FRW/InsertOffenseCriminalActivity_FRW') }
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
      DelSertBasicInfo(missing.id, 'BiasCategoryID', 'OffenseBiasCategory_FRW/DeleteOffenseBiasCategory_FRW')
    } else {
      InSertBasicInfo(selected[len].value, 'CrimeBiasCategoryID', 'OffenseBiasCategory_FRW/InsertOffenseBiasCategory_FRW')
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
      DelSertBasicInfo(missing.id, 'ToolsUseID', 'OffenseToolsUse_FRW/DeleteOffenseToolsUse_FRW')
    } else {
      InSertBasicInfo(selected[len].value, 'CrimeToolsUseID', 'OffenseToolsUse_FRW/InsertOffenseToolsUse_FRW')
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
      DelSertBasicInfo(missing.id, 'TargetID', 'OffenseTarget_FRW/DeleteOffenseTarget_FRW')
    } else {
      InSertBasicInfo(selected[len].value, 'CrimeTargetID', 'OffenseTarget_FRW/InsertOffenseTarget_FRW')
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
      DelSertBasicInfo(missing.id, 'SuspectID', 'OffenseSuspect_FRW/DeleteOffenseSuspect_FRW')
    } else {
      InSertBasicInfo(selected[len].value, 'CrimeSuspectID', 'OffenseSuspect_FRW/InsertOffenseSuspect_FRW')
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
      DelSertBasicInfo(missing.id, 'SecurityviolatedID', 'OffenseSecurityViolated_FRW/DeleteOffenseSecurityViolated_FRW')
    } else {
      InSertBasicInfo(selected[len].value, 'CrimeSecurityviolatedID', 'OffenseSecurityViolated_FRW/InsertOffenseSecurityViolated_FRW')
    }
  }


  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      height: 20,
      minHeight: 40,
      fontSize: 18,
      margintop: 2,
      boxShadow: 0,
    }),
  };
  const InSertBasicInfo = (id, col1, url) => {
    const val = {
      'CrimeID': '',
      [col1]: id,
      'CreatedByUserFK': ''
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        setDisabled(false);
        toastifySuccess(res.Message);
        col1 === 'PretendToBeID' && GetBasicInfoData();
        col1 === 'CrimePointOfExitID' && get_Point_Exit_Data();
        col1 === 'CrimePointOfEntryID' && get_Point_Entry_Data();
        col1 === 'CrimeOffenderUseID' && get_Crime_OffenderUse_Data();
        col1 === 'CrimeActivityID' && get_Criminal_Activity_Data();
        col1 === 'CrimeSuspectID' && get_Crime_Suspect_Data();
        col1 === 'CrimeToolsUseID' && get_Crime_Tools_Use_Data();
        col1 === 'CrimeTargetID' && get_Crime_Target_Data();
        col1 === 'CrimeSecurityviolatedID' && get_Security_Violated_Data();
        col1 === 'CrimeBiasCategoryID' && get_Crime_Bias_Category_Data();


      } else {
        console.log("Somthing Wrong");
      }
    })
  }

  const DelSertBasicInfo = (CrimePretendID, col1, url) => {
    setDisabled(true)
    const val = {
      [col1]: CrimePretendID,

      'DeletedByUserFK': ''
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        setDisabled(false); toastifySuccess(res.Message);
        col1 === 'CrimePretendID' && GetBasicInfoData();
        col1 === 'PointOfExitID' && get_Point_Exit_Data();
        col1 === 'PointOfEntryID' && get_Point_Entry_Data();
        col1 === 'OffenderUseID' && get_Crime_OffenderUse_Data();
        col1 === 'ActivityID' && get_Criminal_Activity_Data();
        col1 === 'ToolsUseID' && get_Crime_Tools_Use_Data();
        col1 === 'TargetID' && get_Crime_Target_Data();
        col1 === 'SecurityviolatedID' && get_Security_Violated_Data();
        col1 === 'SuspectID' && get_Crime_Suspect_Data();


      } else {
        console.log("Somthing Wrong");
      }
    })
  }
  return (
    <>
      <div className="col-12 col-md-12  p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0" style={{ fontSize: '18px' }}>Basic Information</p>
        </div>
        <div className="row ">
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className="text__dropdwon">
              <SelectBox
                options={pretentedDrp}
                isClearable={false}
                // styles={customStylesWithOutColor}
                isDisabled={disabled}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option, MultiValue, animatedComponents }}
                onChange={(e) => Agencychange(e)}
                value={Selected.PretendToBeID}
              />
              <label htmlFor="" className='pt-1'>Pretented To Be</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className="text__dropdwon">
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
              <label htmlFor="" className='pt-1'>Point Of Exit</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className="text__dropdwon">
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
              <label htmlFor="" className='pt-1'>Point Of Entry</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6  mt-2">
            <div className=" text__dropdwon">
              <SelectBox
                name='offenderusing'
                options={CrimeOffenderUseDrp}
                isClearable={false}
                isDisabled={disabled}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option, MultiValue, animatedComponents }}
                onChange={(e) => OffenderUsechange(e)}
                value={Selected.CrimeOffenderUse}

              />
              <label htmlFor="" className='pt-1'>Offender Using</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className=" text__dropdwon">
              <SelectBox
                name='criminalactivity'
                options={CrimeActivityDrp}
                isClearable={false}
                isDisabled={disabled}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option, MultiValue, animatedComponents }}
                onChange={(e) => CrimeActivitychange(e)}
                menuPlacement='top'

              />
              <label htmlFor="" className='pt-1'>Criminal Activity</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className=" text__dropdwon">
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
                menuPlacement='top'
                value={Selected.CrimeBiasCategory}

              />
              <label htmlFor="" className='pt-1'>Bias</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className=" text__dropdwon">
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
                menuPlacement='top'
                value={Selected.CrimeToolsUse}
              />
              <label htmlFor="" className='pt-1'>Tools</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className=" text__dropdwon">
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
                menuPlacement='top'

              />
              <label htmlFor="" className='pt-1'>Target</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className="text__dropdwon">
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
                menuPlacement='top'
                value={Selected.CrimeSuspect}

              />
              <label htmlFor="" className='pt-1'>Suspect Action</label>
            </div>
          </div>
          <div className="col-6 col-md-6 col-lg-6 mt-2">
            <div className=" text__dropdwon">
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
                value={Selected.SecurityViolated}
                menuPlacement='top'
              />
              <label htmlFor="" className='pt-1'>Security Violated</label>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default MobileBasicInfromation