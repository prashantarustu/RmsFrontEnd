import React from 'react'
import { useLocation } from 'react-router-dom';
import ChargeCode from '../NIBRS/ChargeCode.jsx/ChargeCode';
import CourtName from '../NIBRS/CourtName/CourtName';
import SMTLocation from '../NIBRS/SMTLocation/SMTLocation';
import ListTableCom from './ListTableCom';
import WarrantORI from '../NIBRS/WarrantORI/WarrantORI';
import PropertyVehicleMake from '../NIBRS/PropertyVehicleMake/PropertyVehicleMake';
import PropertyClassification from '../NIBRS/PropertyClassification/PropertyClassification';
import PropertyGunMake from '../NIBRS/PropertyGunMake/PropertyGunMake';
import PropertyBoatMake from '../NIBRS/PropertyBoatMakes/PropertyBoatMake';

const ListManagement = () => {

  const useQuery = () => new URLSearchParams(useLocation().search);
  let openPage = useQuery().get('page');

  return (
    <>
      <div className="section-body view_page_design pt-3">
        <div className="row clearfix">
          <div className="col-12 col-sm-12">
            <div className="card Agency">
              <div className="card-body">
                {
                  openPage === 'Race' ?
                    <ListTableCom
                      {...{ openPage }} col4='IsEditable'
                      col1='RaceCode' col2='Description' col3='RaceTypeID'
                      getUrl='TableManagement/GetData_Race'
                      addUrl='TableManagement/InsertRaceType'
                      singleDataUrl='TableManagement/GetSingleData_RaceType'
                      upUrl='TableManagement/UpdateRaceType'
                      delUrl='TableManagement/DeleteRaceType'
                    />
                    :
                    openPage === 'Gender' ?
                      <ListTableCom
                        {...{ openPage }} col4='IsEditable'
                        col1='SexCode' col2='Description' col3='SexCodeID'
                        getUrl='TableManagement/GetData_Gender'
                        addUrl='TableManagement/InsertSexType'
                        singleDataUrl='TableManagement/GetSingleData_SexType'
                        upUrl='TableManagement/UpdateSexType'
                        delUrl='TableManagement/DeleteSexType'
                      />
                      :
                      openPage === 'Court Dispositions' ?
                        <ListTableCom
                          {...{ openPage }} col4='IsEditable'
                          col1='CourtDispositionCode' col2='Description' col3='CourtDispositionID'
                          getUrl='CourtDispositions/GetData_CourtDispositions'
                          addUrl='CourtDispositions/InsertCourtDispositions'
                          singleDataUrl='CourtDispositions/GetSingleData_CourtDispositions'
                          upUrl='CourtDispositions/UpdateCourtDispositions'
                          delUrl='CourtDispositions/DeleteCourtDispositions'
                        />
                        :
                        //------------------dd--------------//

                        // openPage === 'Property Vehicle Make' ?
                        //   <ListTableCom
                        //     {...{ openPage }} col4='IsEditable'
                        //     col1='PropertyVehicleMakeCode' col2='Description' col3='PropertyVehicleMakeID'
                        //     getUrl='PropertyVehicleMake/GetData_PropertyVehicleMake'
                        //     addUrl='PropertyVehicleMake/InsertPropertyVehicleMake'
                        //     singleDataUrl='PropertyVehicleMake/GetSingleData_PropertyVehicleMake'
                        //     upUrl='PropertyVehicleMake/UpdatePropertyVehicleMake'
                        //     delUrl='PropertyVehicleMake/DeletePropertyVehicleMake'
                        //   />
                        //   :
                        openPage === 'Age Unit' ?
                          <ListTableCom
                            {...{ openPage }} col4='IsEditable'
                            col1='AgeUnitCode' col2='Description' col3='AgeUnitID'
                            getUrl='AgeUnit/GetData_AgeUnit'
                            addUrl='AgeUnit/InsertAgeUnit'
                            singleDataUrl='AgeUnit/GetSingleData_AgeUnit'
                            upUrl='AgeUnit/UpdateAgeUnit'
                            delUrl='AgeUnit/DeleteAgeUnit'
                          />
                          :
                          openPage === 'Appearance Type' ?
                            <ListTableCom
                              {...{ openPage }} col4='IsEditable'
                              col1='AppearanceCode' col2='Description' col3='AppearanceID'
                              getUrl='AppearanceType/GetData_AppearanceType'
                              addUrl='AppearanceType/InsertAppearanceType'
                              singleDataUrl='AppearanceType/GetSingleData_AppearanceType'
                              upUrl='AppearanceType/UpdateAppearanceType'
                              delUrl='AppearanceType/DeleteAppearanceType'
                            />
                            :
                            openPage === 'Arrest Juvenile Disposition' ?
                              <ListTableCom
                                {...{ openPage }} col4='IsEditable'
                                col1='ArrestJuvenileDispositionCode' col2='Description' col3='ArrestJuvenileDispositionID'
                                getUrl='ArrestJuvenileDisposition/GetData_ArrestJuvenileDisposition'
                                addUrl='ArrestJuvenileDisposition/InsertArrestJuvenileDisposition'
                                singleDataUrl='ArrestJuvenileDisposition/GetSingleData_ArrestJuvenileDisposition'
                                upUrl='ArrestJuvenileDisposition/UpdateArrestJuvenileDisposition'
                                delUrl='ArrestJuvenileDisposition/DeleteArrestJuvenileDisposition'
                              />
                              :
                              openPage === 'Arrest Type' ?
                                <ListTableCom
                                  {...{ openPage }} col4='IsEditable'
                                  col1='ArrestTypeCode' col2='Description' col3='ArrestTypeID'
                                  getUrl='ArrestType/GetData_ArrestType'
                                  addUrl='ArrestType/InsertArrestType'
                                  singleDataUrl='ArrestType/GetSingleData_ArrestType'
                                  upUrl='ArrestType/UpdateArrestType'
                                  delUrl='ArrestType/DeleteArrestType'
                                />
                                :
                                openPage === 'Body Build' ?
                                  <ListTableCom
                                    {...{ openPage }} col4='IsEditable'
                                    col1='BodyBuildCode' col2='Description' col3='BodyBuildID'
                                    getUrl='BodyBuild/GetData_BodyBuild'
                                    addUrl='BodyBuild/InsertBodyBuild'
                                    singleDataUrl='BodyBuild/GetSingleData_BodyBuild'
                                    upUrl='BodyBuild/UpdateBodyBuild'
                                    delUrl='BodyBuild/DeleteBodyBuild'
                                  />
                                  :
                                  openPage === 'Caution Type' ?
                                    <ListTableCom
                                      {...{ openPage }} col4='IsEditable'
                                      col1='CautionTypeCode' col2='Description' col3='CautionTypeId'
                                      getUrl='CautionType/GetData_CautionType'
                                      addUrl='CautionType/InsertCautionType'
                                      singleDataUrl='CautionType/GetSingleData_CautionType'
                                      upUrl='CautionType/UpdateCautionType'
                                      delUrl='CautionType/DeleteCautionType'
                                    />
                                    :
                                    openPage === 'CFS Type' ?
                                      <ListTableCom
                                        {...{ openPage }} col4='IsEditable'
                                        col1='CFSTypeCode' col2='Description' col3='CFSTypeID'
                                        getUrl='CFSType/GetData_CFSType'
                                        addUrl='CFSType/InsertCFSType'
                                        singleDataUrl='CFSType/GetSingleData_CFSType'
                                        upUrl='CFSType/UpdateCFSType'
                                        delUrl='CFSType/DeleteCFSType'
                                      />
                                      :
                                      openPage === 'Charge Category' ?
                                        <ListTableCom
                                          {...{ openPage }} col4='IsEditable'
                                          col1='ChargeCategoryCode' col2='Description' col3='ChargeCategoryID'
                                          getUrl='ChargeCategory/GetData_ChargeCategory'
                                          addUrl='ChargeCategory/InsertChargeCategory'
                                          singleDataUrl='ChargeCategory/GetSingleData_ChargeCategory'
                                          upUrl='ChargeCategory/UpdateChargeCategory'
                                          delUrl='ChargeCategory/DeleteChargeCategory'
                                        />
                                        :
                                        openPage === 'Charge Class' ?
                                          <ListTableCom
                                            {...{ openPage }} col4='IsEditable'
                                            col1='ChargeClassCode' col2='Description' col3='ChargeClassID'
                                            getUrl='ChargeClass/GetData_ChargeClass'
                                            addUrl='ChargeClass/InsertChargeClass'
                                            singleDataUrl='ChargeClass/GetSingleData_ChargeClass'
                                            upUrl='ChargeClass/UpdateChargeClass'
                                            delUrl='ChargeClass/DeleteChargeClass'
                                          />
                                          :
                                          openPage === 'Charge Degree' ?
                                            <ListTableCom
                                              {...{ openPage }} col4='IsEditable'
                                              col1='ChargeDegreeCode' col2='Description' col3='ChargeDegreeID'
                                              getUrl='ChargeDegree/GetData_ChargeDegree'
                                              addUrl='ChargeDegree/InsertChargeDegree'
                                              singleDataUrl='ChargeDegree/GetSingleData_ChargeDegree'
                                              upUrl='ChargeDegree/UpdateChargeDegree'
                                              delUrl='ChargeDegree/DeleteChargeDegree'
                                            />
                                            :
                                            openPage === 'Charge Type' ?
                                              <ListTableCom
                                                {...{ openPage }} col4='IsEditable'
                                                col1='ChargeTypeCode' col2='Description' col3='ChargeTypeID'
                                                getUrl='ChargeType/GetData_ChargeType'
                                                addUrl='ChargeType/InsertChargeType'
                                                singleDataUrl='ChargeType/GetSingleData_ChargeType'
                                                upUrl='ChargeType/UpdateChargeType'
                                                delUrl='ChargeType/DeleteChargeType'
                                              />
                                              :
                                              openPage === 'Cleared Exceptionally' ?
                                                <ListTableCom
                                                  {...{ openPage }} col4='IsEditable'
                                                  col1='ClearanceCode' col2='Description' col3='ClearanceID'
                                                  getUrl='ExceptionalClearance/GetData_ExceptionalClearance'
                                                  addUrl='ExceptionalClearance/InsertExceptionalClearance'
                                                  singleDataUrl='ExceptionalClearance/GetSingleData_ExceptionalClearance'
                                                  upUrl='ExceptionalClearance/UpdateExceptionalClearance'
                                                  delUrl='ExceptionalClearance/DeleteExceptionalClearance'
                                                />
                                                :
                                                openPage === 'Complexion Type' ?
                                                  <ListTableCom
                                                    {...{ openPage }} col4='IsEditable'
                                                    col1='ComplexionCode' col2='Description' col3='ComplexionID'
                                                    getUrl='ComplexionType/GetData_ComplexionType'
                                                    addUrl='ComplexionType/InsertComplexionType'
                                                    singleDataUrl='ComplexionType/GetSingleData_ComplexionType'
                                                    upUrl='ComplexionType/UpdateComplexionType'
                                                    delUrl='ComplexionType/DeleteComplexionType'
                                                  />
                                                  :
                                                  openPage === 'Condition Type' ?
                                                    <ListTableCom
                                                      {...{ openPage }} col4='IsEditable'
                                                      col1='ConditionCode' col2='Description' col3='ConditionId'
                                                      getUrl='ConditionType/GetData_ConditionType'
                                                      addUrl='ConditionType/InsertConditionType'
                                                      singleDataUrl='ConditionType/GetSingleData_ConditionType'
                                                      upUrl='ConditionType/UpdateConditionType'
                                                      delUrl='ConditionType/DeleteConditionType'
                                                    />
                                                    :
                                                    openPage === 'Contact Phone Type' ?
                                                      <ListTableCom
                                                        {...{ openPage }} col4='IsEditable'
                                                        col1='ContactPhoneTypeCode' col2='Description' col3='ContactPhoneTypeID'
                                                        getUrl='ContactPhoneType/GetData_ContactPhoneType'
                                                        addUrl='ContactPhoneType/InsertContactPhoneType'
                                                        singleDataUrl='ContactPhoneType/GetSingleData_ContactPhoneType'
                                                        upUrl='ContactPhoneType/UpdateContactPhoneType'
                                                        delUrl='ContactPhoneType/DeleteContactPhoneType'
                                                      />
                                                      :
                                                      openPage === 'Contact Type' ?
                                                        <ListTableCom
                                                          {...{ openPage }} col4='IsEditable'
                                                          col1='ContactTypeCode' col2='Description' col3='ContactTypeID'
                                                          getUrl='ContactType/GetData_ContactType'
                                                          addUrl='ContactType/InsertContactType'
                                                          singleDataUrl='ContactType/GetSingleData_ContactType'
                                                          upUrl='ContactType/UpdateContactType'
                                                          delUrl='ContactType/DeleteContactType'
                                                        />
                                                        :
                                                        openPage === 'Court Appear Reason' ?
                                                          <ListTableCom
                                                            {...{ openPage }} col4='IsEditable'
                                                            col1='CourtAppearReasonCode' col2='Description' col3='CourtAppearReasonID'
                                                            getUrl='CourtAppearReason/GetData_CourtAppearReason'
                                                            addUrl='CourtAppearReason/InsertCourtAppearReason'
                                                            singleDataUrl='CourtAppearReason/GetSingleData_CourtAppearReason'
                                                            upUrl='CourtAppearReason/UpdateCourtAppearReason'
                                                            delUrl='CourtAppearReason/DeleteCourtAppearReason'
                                                          />
                                                          :
                                                          openPage === 'Crime Bias Category' ?
                                                            <ListTableCom
                                                              {...{ openPage }} col4='IsEditable'
                                                              col1='BiasCategoryCode' col2='Description' col3='BiasCategoryID'
                                                              getUrl='CrimeBiasCategory/GetData_CrimeBiasCategory'
                                                              addUrl='CrimeBiasCategory/InsertCrimeBiasCategory'
                                                              singleDataUrl='CrimeBiasCategory/GetSingleData_CrimeBiasCategory'
                                                              upUrl='CrimeBiasCategory/UpdateCrimeBiasCategory'
                                                              delUrl='CrimeBiasCategory/DeleteCrimeBiasCategory'
                                                            />
                                                            :
                                                            openPage === 'Crime Left  Scene' ?
                                                              <ListTableCom
                                                                {...{ openPage }} col4='IsEditable'
                                                                col1='LeftSceneCode' col2='Description' col3='LeftSceneId'
                                                                getUrl='CrimeLeftScene/GetData_CrimeLeftScene'
                                                                addUrl='CrimeLeftScene/InsertCrimeLeftScene'
                                                                singleDataUrl='CrimeLeftScene/GetSingleData_CrimeLeftScene'
                                                                upUrl='CrimeLeftScene/UpdateCrimeLeftScene'
                                                                delUrl='CrimeLeftScene/DeleteCrimeLeftScene'
                                                              />
                                                              :
                                                              openPage === 'Crime Security Violated' ?
                                                                <ListTableCom
                                                                  {...{ openPage }} col4='IsEditable'
                                                                  col1='SecurityviolatedCode' col2='Description' col3='SecurityviolatedID'
                                                                  getUrl='CrimeSecurityviolated/GetData_CrimeSecurityviolated'
                                                                  addUrl='CrimeSecurityviolated/InsertCrimeSecurityviolated'
                                                                  singleDataUrl='CrimeSecurityviolated/GetSingleData_CrimeSecurityviolated'
                                                                  upUrl='CrimeSecurityviolated/UpdateCrimeSecurityviolated'
                                                                  delUrl='CrimeSecurityviolated/DeleteCrimeSecurityviolated'
                                                                />
                                                                :
                                                                openPage === 'Crime Suspect' ?
                                                                  <ListTableCom
                                                                    {...{ openPage }} col4='IsEditable'
                                                                    col1='SuspectCode' col2='Description' col3='SuspectID'
                                                                    getUrl='CrimeSuspect/GetData_CrimeSuspect'
                                                                    addUrl='CrimeSuspect/InsertCrimeSuspect'
                                                                    singleDataUrl='CrimeSuspect/GetSingleData_CrimeSuspect'
                                                                    upUrl='CrimeSuspect/UpdateCrimeSuspect'
                                                                    delUrl='CrimeSuspect/DeleteCrimeSuspect'
                                                                  />
                                                                  :
                                                                  openPage === 'Crime Target' ?
                                                                    <ListTableCom
                                                                      {...{ openPage }} col4='IsEditable'
                                                                      col1='TargetCode' col2='Description' col3='TargetID'
                                                                      getUrl='CrimeTarget/GetData_CrimeTarget'
                                                                      addUrl='CrimeTarget/InsertCrimeTarget'
                                                                      singleDataUrl='CrimeTarget/GetSingleData_CrimeTarget'
                                                                      upUrl='CrimeTarget/UpdateCrimeTarget'
                                                                      delUrl='CrimeTarget/DeleteCrimeTarget'
                                                                    />
                                                                    :
                                                                    openPage === 'Criminal Activity' ?
                                                                      <ListTableCom
                                                                        {...{ openPage }} col4='IsEditable'
                                                                        col1='CriminalActivityCode' col2='Description' col3='CriminalActivityID'
                                                                        getUrl='CriminalActivity/GetData_CriminalActivity'
                                                                        addUrl='CriminalActivity/InsertCriminalActivity'
                                                                        singleDataUrl='CriminalActivity/GetSingleData_CriminalActivity'
                                                                        upUrl='CriminalActivity/UpdateCriminalActivity'
                                                                        delUrl='CriminalActivity/DeleteCriminalActivity'
                                                                      />
                                                                      :
                                                                      openPage === 'Employee Type' ?
                                                                        <ListTableCom
                                                                          {...{ openPage }} col4='IsEditable'
                                                                          col1='EmployeeCode' col2='Description' col3='EmployeeTypeID'
                                                                          getUrl='TableManagement/GetData_EmployeeType'
                                                                          addUrl='TableManagement/InsertEmployeeType'
                                                                          singleDataUrl='TableManagement/GetSingleData_EmployeeType'
                                                                          upUrl='TableManagement/UpdateEmployeeType'
                                                                          delUrl='TableManagement/DeleteEmployeeType'
                                                                        />
                                                                        :
                                                                        openPage === 'Ethnicity' ?
                                                                          <ListTableCom
                                                                            {...{ openPage }} col4='IsEditable'
                                                                            col1='EthnicityCode' col2='Description' col3='EthnicityID'
                                                                            getUrl='TableManagement/GetData_Ethnicity'
                                                                            addUrl='TableManagement/InsertEthnicity'
                                                                            singleDataUrl='TableManagement/GetSingleData_Ethnicity'
                                                                            upUrl='TableManagement/UpdateEthnicity'
                                                                            delUrl='TableManagement/DeleteEthnicity'
                                                                          />
                                                                          :
                                                                          openPage === 'Facial Oddity' ?
                                                                            <ListTableCom
                                                                              {...{ openPage }} col4='IsEditable'
                                                                              col1='FacialCode' col2='Description' col3='OddityID'
                                                                              getUrl='FacialOddity/GetData_FacialOddity'
                                                                              addUrl='FacialOddity/InsertFacialOddity'
                                                                              singleDataUrl='FacialOddity/GetSingleData_FacialOddity'
                                                                              upUrl='FacialOddity/UpdateFacialOddity'
                                                                              delUrl='FacialOddity/DeleteFacialOddity'
                                                                            />
                                                                            :
                                                                            openPage === 'Facial Shape' ?
                                                                              <ListTableCom
                                                                                {...{ openPage }} col4='IsEditable'
                                                                                col1='FacialShapeCode' col2='Description' col3='FacialShapeID'
                                                                                getUrl='FacialShape/GetData_FacialShape'
                                                                                addUrl='FacialShape/InsertFacialShape'
                                                                                singleDataUrl='FacialShape/GetSingleData_FacialShape'
                                                                                upUrl='FacialShape/UpdateFacialShape'
                                                                                delUrl='FacialShape/DeleteFacialShape'
                                                                              />
                                                                              :
                                                                              openPage === 'Hair Length' ?
                                                                                <ListTableCom
                                                                                  {...{ openPage }} col4='IsEditable'
                                                                                  col1='HairLengthCode' col2='Description' col3='HairLengthID'
                                                                                  getUrl='HairLength/GetData_HairLength'
                                                                                  addUrl='HairLength/InsertHairLength'
                                                                                  singleDataUrl='HairLength/GetSingleData_HairLength'
                                                                                  upUrl='HairLength/UpdateHairLength'
                                                                                  delUrl='HairLength/DeleteHairLength'
                                                                                />
                                                                                :
                                                                                openPage === 'Bias Motivation' ?
                                                                                  <ListTableCom
                                                                                    {...{ openPage }} col4='IsEditable'
                                                                                    col1='BiasCode' col2='Description' col3='BiasID'
                                                                                    getUrl='CrimeBias/GetData_CrimeBias'
                                                                                    addUrl='CrimeBias/InsertCrimeBias'
                                                                                    singleDataUrl='CrimeBias/GetSingleData_CrimeBias'
                                                                                    upUrl='CrimeBias/UpdateCrimeBias'
                                                                                    delUrl='CrimeBias/DeleteCrimeBias'
                                                                                  />
                                                                                  :
                                                                                  openPage === 'Blood Type' ?
                                                                                    <ListTableCom
                                                                                      {...{ openPage }} col4='IsEditable'
                                                                                      col1='BloodTypeCode' col2='Description' col3='BloodTypeID'
                                                                                      getUrl='TableManagement/GetData_BloodType'
                                                                                      addUrl='TableManagement/Insert_BloodType'
                                                                                      singleDataUrl='TableManagement/GetSingleData_BloodType'
                                                                                      upUrl='TableManagement/Update_BloodType'
                                                                                      delUrl='TableManagement/Delete_BloodType'
                                                                                    />
                                                                                    :
                                                                                    openPage === 'Color' ?
                                                                                      <ListTableCom
                                                                                        {...{ openPage }} col4='IsEditable'
                                                                                        col1='ColorCode' col2='Description' col3='ColorID'
                                                                                        getUrl='TableManagement/GetData_Color'
                                                                                        addUrl='TableManagement/Insert_Color'
                                                                                        singleDataUrl='TableManagement/GetSingleData_Color'
                                                                                        upUrl='TableManagement/Update_Color'
                                                                                        delUrl='TableManagement/Delete_Color'
                                                                                      />

                                                                                      :
                                                                                      openPage === 'Charge Dispositions' ?
                                                                                        <ListTableCom
                                                                                          {...{ openPage }} col4='IsEditable'
                                                                                          col1='ChargeDispositionCode' col2='Description' col3='ChargeDispositionID'
                                                                                          getUrl='ChargeDispositions/GetData_ChargeDispositions'
                                                                                          addUrl='ChargeDispositions/InsertChargeDispositions'
                                                                                          singleDataUrl='ChargeDispositions/GetSingleData_ChargeDispositions'
                                                                                          upUrl='ChargeDispositions/UpdateChargeDispositions'
                                                                                          delUrl='ChargeDispositions/DeleteChargeDispositions'
                                                                                        />
                                                                                        :
                                                                                        openPage === 'Hair Shades' ?
                                                                                          <ListTableCom
                                                                                            {...{ openPage }} col4='IsEditable'
                                                                                            col1='HairShadeCode' col2='Description' col3='HairShadeID'
                                                                                            getUrl='HairShades/GetData_HairShades'
                                                                                            addUrl='HairShades/InsertHairShades'
                                                                                            singleDataUrl='HairShades/GetSingleData_HairShades'
                                                                                            upUrl='HairShades/UpdateHairShades'
                                                                                            delUrl='HairShades/DeleteHairShades'
                                                                                          />
                                                                                          :
                                                                                          openPage === 'Hair Styles' ?
                                                                                            <ListTableCom
                                                                                              {...{ openPage }} col4='IsEditable'
                                                                                              col1='HairStyleCode' col2='Description' col3='HairStyleID'
                                                                                              getUrl='HairStyles/GetData_HairStyles'
                                                                                              addUrl='HairStyles/InsertHairStyles'
                                                                                              singleDataUrl='HairStyles/GetSingleData_HairStyles'
                                                                                              upUrl='HairStyles/UpdateHairStyles'
                                                                                              delUrl='HairStyles/DeleteHairStyles'
                                                                                            />
                                                                                            :
                                                                                            openPage === 'Handedness' ?
                                                                                              <ListTableCom
                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                col1='HandedCode' col2='Description' col3='HandedID'
                                                                                                getUrl='Handedness/GetData_Handedness'
                                                                                                addUrl='Handedness/InsertHandedness'
                                                                                                singleDataUrl='Handedness/GetSingleData_Handedness'
                                                                                                upUrl='Handedness/UpdateHandedness'
                                                                                                delUrl='Handedness/DeleteHandedness'
                                                                                              />
                                                                                              :
                                                                                              openPage === 'Handicap Type' ?
                                                                                                <ListTableCom
                                                                                                  {...{ openPage }} col4='IsEditable'
                                                                                                  col1='HandicapCode' col2='Description' col3='HandicapID'
                                                                                                  getUrl='HandicapType/GetData_HandicapType'
                                                                                                  addUrl='HandicapType/InsertHandicapType'
                                                                                                  singleDataUrl='HandicapType/GetSingleData_HandicapType'
                                                                                                  upUrl='HandicapType/UpdateHandicapType'
                                                                                                  delUrl='HandicapType/DeleteHandicapType'
                                                                                                />
                                                                                                :
                                                                                                openPage === 'ID Types' ?
                                                                                                  <ListTableCom
                                                                                                    {...{ openPage }} col4='IsEditable'
                                                                                                    col1='Code' col2='Description' col3='IDTypeID'
                                                                                                    getUrl='IDTypes/GetData_IDTypes'
                                                                                                    addUrl='IDTypes/InsertIDTypes'
                                                                                                    singleDataUrl='IDTypes/GetSingleData_IDTypes'
                                                                                                    upUrl='IDTypes/UpdateIDTypes'
                                                                                                    delUrl='IDTypes/DeleteIDTypes'
                                                                                                  />
                                                                                                  :
                                                                                                  openPage === 'Incident Disposition' ?
                                                                                                    <ListTableCom
                                                                                                      {...{ openPage }} col4='IsEditable'
                                                                                                      col1='DispositionCode' col2='Description' col3='IncidentDispositionsID'
                                                                                                      getUrl='IncidentDispositions/GetData_IncidentDispositions'
                                                                                                      addUrl='IncidentDispositions/InsertIncidentDispositions'
                                                                                                      singleDataUrl='IncidentDispositions/GetSingleData_IncidentDispositions'
                                                                                                      upUrl='IncidentDispositions/UpdateIncidentDispositions'
                                                                                                      delUrl='IncidentDispositions/DeleteIncidentDispositions'
                                                                                                    />
                                                                                                    :
                                                                                                    openPage === 'Incident Scene' ?
                                                                                                      <ListTableCom
                                                                                                        {...{ openPage }} col4='IsEditable'
                                                                                                        col1='SceneCode' col2='Description' col3='SceneID'
                                                                                                        getUrl='IncidentScene/GetData_IncidentScene'
                                                                                                        addUrl='IncidentScene/InsertIncidentScene'
                                                                                                        singleDataUrl='IncidentScene/GetSingleData_IncidentScene'
                                                                                                        upUrl='IncidentScene/UpdateIncidentScene'
                                                                                                        delUrl='IncidentScene/DeleteIncidentScene'
                                                                                                      />
                                                                                                      :
                                                                                                      openPage === 'Incident Security' ?
                                                                                                        <ListTableCom
                                                                                                          {...{ openPage }} col4='IsEditable'
                                                                                                          col1='SecurityCode' col2='Description' col3='SecurityId'
                                                                                                          getUrl='IncidentSecurity/GetData_IncidentSecurity'
                                                                                                          addUrl='IncidentSecurity/InsertIncidentSecurity'
                                                                                                          singleDataUrl='IncidentSecurity/GetSingleData_IncidentSecurity'
                                                                                                          upUrl='IncidentSecurity/UpdateIncidentSecurity'
                                                                                                          delUrl='IncidentSecurity/DeleteIncidentSecurity'
                                                                                                        />
                                                                                                        :
                                                                                                        openPage === 'Law Category' ?
                                                                                                          <ListTableCom
                                                                                                            {...{ openPage }} col4='IsEditable'
                                                                                                            col1='LawCategoryCode' col2='Description' col3='LawCategoryID'
                                                                                                            getUrl='LawCategory/GetData_LawCategory'
                                                                                                            addUrl='LawCategory/InsertLawCategory'
                                                                                                            singleDataUrl='LawCategory/GetSingleData_LawCategory'
                                                                                                            upUrl='LawCategory/UpdateLawCategory'
                                                                                                            delUrl='LawCategory/DeleteLawCategory'
                                                                                                          />
                                                                                                          :
                                                                                                          openPage === 'Law Class' ?
                                                                                                            <ListTableCom
                                                                                                              {...{ openPage }} col4='IsEditable'
                                                                                                              col1='LawClassCode' col2='Description' col3='LawClassID'
                                                                                                              getUrl='LawClass/GetData_LawClass'
                                                                                                              addUrl='LawClass/InsertLawClass'
                                                                                                              singleDataUrl='LawClass/GetSingleData_LawClass'
                                                                                                              upUrl='LawClass/UpdateLawClass'
                                                                                                              delUrl='LawClass/DeleteLawClass'
                                                                                                            />
                                                                                                            :
                                                                                                            openPage === 'Law Title' ?
                                                                                                              <ListTableCom
                                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                                col1='LawTitleCode' col2='Description' col3='LawTitleID'
                                                                                                                getUrl='LawTitle/GetData_LawTitle'
                                                                                                                addUrl='LawTitle/InsertLawTitle'
                                                                                                                singleDataUrl='LawTitle/GetSingleData_LawTitle'
                                                                                                                upUrl='LawTitle/UpdateLawTitle'
                                                                                                                delUrl='LawTitle/DeleteLawTitle'
                                                                                                              />
                                                                                                              :
                                                                                                              openPage === 'Location Type' ?
                                                                                                                <ListTableCom
                                                                                                                  {...{ openPage }} col4='IsEditable'
                                                                                                                  col1='LocationTypeCode' col2='Description' col3='LocationTypeID'
                                                                                                                  getUrl='LocationType/GetData_LocationType'
                                                                                                                  Charge Dispositions addUrl='LocationType/InsertLocationType'
                                                                                                                  singleDataUrl='LocationType/GetSingleData_LocationType'
                                                                                                                  upUrl='LocationType/UpdateLocationType'
                                                                                                                  delUrl='LocationType/DeleteLocationType'
                                                                                                                />
                                                                                                                :
                                                                                                                openPage === 'Marital Status' ?
                                                                                                                  <ListTableCom
                                                                                                                    {...{ openPage }} col4='IsEditable'
                                                                                                                    col1='MaritalStatusCode' col2='Description' col3='MaritalStatusID'
                                                                                                                    getUrl='MaritalStatus/GetData_MaritalStatus'
                                                                                                                    addUrl='MaritalStatus/InsertMaritalStatus'
                                                                                                                    singleDataUrl='MaritalStatus/GetSingleData_MaritalStatus'
                                                                                                                    upUrl='MaritalStatus/UpdateMaritalStatus'
                                                                                                                    delUrl='MaritalStatus/DeleteMaritalStatus'
                                                                                                                  />
                                                                                                                  :
                                                                                                                  openPage === 'Method Of Entry' ?
                                                                                                                    <ListTableCom
                                                                                                                      {...{ openPage }} col4='IsEditable'
                                                                                                                      col1='MethodOfEntryCode' col2='Description' col3='EntryMethodID'
                                                                                                                      getUrl='CrimeMethodOfEntry/GetData_CrimeMethodOfEntry'
                                                                                                                      addUrl='CrimeMethodOfEntry/InsertCrimeMethodOfEntry'
                                                                                                                      singleDataUrl='CrimeMethodOfEntry/GetSingleData_CrimeMethodOfEntry'
                                                                                                                      upUrl='CrimeMethodOfEntry/UpdateCrimeMethodOfEntry'
                                                                                                                      delUrl='CrimeMethodOfEntry/DeleteCrimeMethodOfEntry'
                                                                                                                    />
                                                                                                                    :
                                                                                                                    openPage === 'Method Of Operation' ?
                                                                                                                      <ListTableCom
                                                                                                                        {...{ openPage }} col4='IsEditable'
                                                                                                                        col1='MethodOfOperationCode' col2='Description' col3='MethodOfOperationID'
                                                                                                                        getUrl='CrimeMethodOfOperation/GetData_CrimeMethodOfOperation'
                                                                                                                        addUrl='CrimeMethodOfOperation/InsertCrimeMethodOfOperation'
                                                                                                                        singleDataUrl='CrimeMethodOfOperation/GetSingleData_CrimeMethodOfOperation'
                                                                                                                        upUrl='CrimeMethodOfOperation/UpdateCrimeMethodOfOperation'
                                                                                                                        delUrl='CrimeMethodOfOperation/DeleteCrimeMethodOfOperation'
                                                                                                                      />
                                                                                                                      :
                                                                                                                      openPage === 'Name Reason Code' ?
                                                                                                                        <ListTableCom
                                                                                                                          {...{ openPage }} col4='IsEditable'
                                                                                                                          col1='ReasonCode' col2='Description' col3='NameReasonCodeID'
                                                                                                                          getUrl='NameReasonCode/GetData_NameReasonCode'
                                                                                                                          addUrl='NameReasonCode/InsertNameReasonCode'
                                                                                                                          singleDataUrl='NameReasonCode/GetSingleData_NameReasonCode'
                                                                                                                          upUrl='NameReasonCode/UpdateNameReasonCode'
                                                                                                                          delUrl='NameReasonCode/DeleteNameReasonCode'
                                                                                                                        />
                                                                                                                        :
                                                                                                                        openPage === 'Occupation' ?
                                                                                                                          <ListTableCom
                                                                                                                            {...{ openPage }} col4='IsEditable'
                                                                                                                            col1='OccupationCode' col2='Description' col3='OccupationID'
                                                                                                                            getUrl='Occupation/GetData_Occupation'
                                                                                                                            addUrl='Occupation/InsertOccupation'
                                                                                                                            singleDataUrl='Occupation/GetSingleData_Occupation'
                                                                                                                            upUrl='Occupation/UpdateOccupation'
                                                                                                                            delUrl='Occupation/DeleteOccupation'
                                                                                                                          />
                                                                                                                          :
                                                                                                                          openPage === 'Court Name' ?
                                                                                                                            // <ListTableCom
                                                                                                                            //   {...{ openPage }} col4 ='IsEditable'
                                                                                                                            //   col1='CourtNameCode' col2='Description' col3='CourtID'
                                                                                                                            //   getUrl='CourtName/GetData_CourtName'
                                                                                                                            //   addUrl='CourtName/InsertCourtName'
                                                                                                                            //   singleDataUrl='CourtName/GetSingleData_CourtName'
                                                                                                                            //   upUrl='CourtName/UpdateCourtName'
                                                                                                                            //   delUrl='CourtName/DeleteCourtName'
                                                                                                                            // />
                                                                                                                            <CourtName />
                                                                                                                            :
                                                                                                                            openPage === 'FBI Code' ?
                                                                                                                              <ListTableCom
                                                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                                                col1='FBICode' col2='Description' col3='FBIID'
                                                                                                                                getUrl='FBICodes/GetData_FBICodes'
                                                                                                                                addUrl='FBICodes/InsertFBICodes'
                                                                                                                                singleDataUrl='FBICodes/GetSingleData_FBICodes'
                                                                                                                                upUrl='FBICodes/UpdateFBICodes'
                                                                                                                                delUrl='FBICodes/DeleteFBICodes'
                                                                                                                              />
                                                                                                                              :
                                                                                                                              openPage === 'Weapon Type' ?
                                                                                                                                <ListTableCom
                                                                                                                                  {...{ openPage }} col4='IsEditable'
                                                                                                                                  col1='WeaponCode' col2='Description' col3='WeaponID'
                                                                                                                                  getUrl='WeaponType/GetData_WeaponType'
                                                                                                                                  addUrl='WeaponType/Insert_WeaponType'
                                                                                                                                  singleDataUrl='WeaponType/GetSingleData_WeaponType'
                                                                                                                                  upUrl='WeaponType/Update_WeaponType'
                                                                                                                                  delUrl='WeaponType/Delete_WeaponType'
                                                                                                                                />
                                                                                                                                :
                                                                                                                                openPage === 'Relationship Type' ?
                                                                                                                                  <ListTableCom
                                                                                                                                    {...{ openPage }} col4='IsEditable'
                                                                                                                                    col1='VictimRelationshipTypeCode' col2='Description' col3='VictimRelationshipTypeID'
                                                                                                                                    getUrl='VictimRelationshipType/GetData_VictimRelationshipType'
                                                                                                                                    addUrl='VictimRelationshipType/InsertVictimRelationshipType'
                                                                                                                                    singleDataUrl='VictimRelationshipType/GetSingleData_VictimRelationshipType'
                                                                                                                                    upUrl='VictimRelationshipType/UpdateVictimRelationshipType'
                                                                                                                                    delUrl='VictimRelationshipType/DeleteVictimRelationshipType'
                                                                                                                                  />
                                                                                                                                  :
                                                                                                                                  openPage === 'Injury Type' ?
                                                                                                                                    <ListTableCom
                                                                                                                                      {...{ openPage }} col4='IsEditable'
                                                                                                                                      col1='InjuryCode' col2='Description' col3='VictimInjuryID'
                                                                                                                                      getUrl='VictimInjury/GetData_VictimInjury'
                                                                                                                                      addUrl='VictimInjury/InsertVictimInjury'
                                                                                                                                      singleDataUrl='VictimInjury/GetSingleData_VictimInjury'
                                                                                                                                      upUrl='VictimInjury/UpdateVictimInjury'
                                                                                                                                      delUrl='VictimInjury/DeleteVictimInjury'
                                                                                                                                    />
                                                                                                                                    :
                                                                                                                                    openPage === 'Victim Call Type' ?
                                                                                                                                      <ListTableCom
                                                                                                                                        {...{ openPage }} col4='IsEditable'
                                                                                                                                        col1='CallTypeCode' col2='Description' col3='VictimCallTypeID'
                                                                                                                                        getUrl='VictimCallType/GetData_VictimCallType'
                                                                                                                                        addUrl='VictimCallType/InsertVictimCallType'
                                                                                                                                        singleDataUrl='VictimCallType/GetSingleData_VictimCallType'
                                                                                                                                        upUrl='VictimCallType/UpdateVictimCallType'
                                                                                                                                        delUrl='VictimCallType/DeleteVictimCallType'
                                                                                                                                        drop1=''
                                                                                                                                      />
                                                                                                                                      :
                                                                                                                                      openPage === 'Property Vehicle Style' ?
                                                                                                                                        <ListTableCom
                                                                                                                                          {...{ openPage }} col4='IsEditable'
                                                                                                                                          col1='VehicleStyleCode' col2='Description' col3='VehicleStyleID'
                                                                                                                                          getUrl='PropertyVehicleStyle/GetData_PropertyVehicleStyle'
                                                                                                                                          addUrl='PropertyVehicleStyle/InsertPropertyVehicleStyle'
                                                                                                                                          singleDataUrl='PropertyVehicleStyle/GetSingleData_PropertyVehicleStyle'
                                                                                                                                          upUrl='PropertyVehicleStyle/UpdatePropertyVehicleStyle'
                                                                                                                                          delUrl='PropertyVehicleStyle/DeletePropertyVehicleStyle'
                                                                                                                                        />
                                                                                                                                        :
                                                                                                                                        openPage === 'Resident' ?
                                                                                                                                          <ListTableCom
                                                                                                                                            {...{ openPage }} col4='IsEditable'
                                                                                                                                            col1='ResidentCode' col2='Description' col3='ResidentID'
                                                                                                                                            getUrl='Resident/GetData_Resident'
                                                                                                                                            addUrl='Resident/InsertResident'
                                                                                                                                            singleDataUrl='Resident/GetSingleData_Resident'
                                                                                                                                            upUrl='Resident/UpdateResident'
                                                                                                                                            delUrl='Resident/DeleteResident'
                                                                                                                                          />
                                                                                                                                          :
                                                                                                                                          openPage === 'Offender Suspected of Using' ?
                                                                                                                                            <ListTableCom
                                                                                                                                              {...{ openPage }} col4='IsEditable'
                                                                                                                                              col1='OffenderUseCode' col2='Description' col3='OffenderUseID'
                                                                                                                                              getUrl='CrimeOffenderUse/GetData_CrimeOffenderUse'
                                                                                                                                              addUrl='CrimeOffenderUse/InsertCrimeOffenderUse'
                                                                                                                                              singleDataUrl='CrimeOffenderUse/GetSingleData_CrimeOffenderUse'
                                                                                                                                              upUrl='CrimeOffenderUse/UpdateCrimeOffenderUse'
                                                                                                                                              delUrl='CrimeOffenderUse/DeleteCrimeOffenderUse'
                                                                                                                                            />
                                                                                                                                            :
                                                                                                                                            openPage === 'Victim Officer Assignment Type' ?
                                                                                                                                              <ListTableCom
                                                                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                                                                col1='AssignmentTypeCode' col2='Description' col3='VictimAssignmentTypeID'
                                                                                                                                                getUrl='VictimAssignmentType/GetData_VictimAssignmentType'
                                                                                                                                                addUrl='VictimAssignmentType/InsertVictimAssignmentType'
                                                                                                                                                singleDataUrl='VictimAssignmentType/GetSingleData_VictimAssignmentType'
                                                                                                                                                upUrl='VictimAssignmentType/UpdateVictimAssignmentType'
                                                                                                                                                delUrl='VictimAssignmentType/DeleteVictimAssignmentType'
                                                                                                                                              />
                                                                                                                                              :
                                                                                                                                              openPage === 'Point Of Entry' ?
                                                                                                                                                <ListTableCom
                                                                                                                                                  {...{ openPage }} col4='IsEditable'
                                                                                                                                                  col1='EntryPointCode' col2='Description' col3='EntryPointID'
                                                                                                                                                  getUrl='CrimePointOfEntry/GetData_CrimePointOfEntry'
                                                                                                                                                  addUrl='CrimePointOfEntry/InsertCrimePointOfEntry'
                                                                                                                                                  singleDataUrl='CrimePointOfEntry/GetSingleData_CrimePointOfEntry'
                                                                                                                                                  upUrl='CrimePointOfEntry/UpdateCrimePointOfEntry'
                                                                                                                                                  delUrl='CrimePointOfEntry/DeleteCrimePointOfEntry'
                                                                                                                                                />
                                                                                                                                                :
                                                                                                                                                openPage === 'Point Of Exit' ?
                                                                                                                                                  <ListTableCom
                                                                                                                                                    {...{ openPage }} col4='IsEditable'
                                                                                                                                                    col1='PointOfExitCode' col2='Description' col3='PointOfExit'
                                                                                                                                                    getUrl='CrimePointOfexit/GetData_CrimePointOfexit'
                                                                                                                                                    addUrl='CrimePointOfexit/InsertCrimePointOfexit'
                                                                                                                                                    singleDataUrl='CrimePointOfexit/GetSingleData_CrimePointOfexit'
                                                                                                                                                    upUrl='CrimePointOfexit/UpdateCrimePointOfexit'
                                                                                                                                                    delUrl='CrimePointOfexit/DeleteCrimePointOfexit'
                                                                                                                                                  />
                                                                                                                                                  :
                                                                                                                                                  openPage === 'Property Description' ?
                                                                                                                                                    <ListTableCom
                                                                                                                                                      {...{ openPage }} col4='IsEditable'
                                                                                                                                                      col1='PropDescCode' col2='Description' col3='PropertyDescID'
                                                                                                                                                      getUrl='PropertyDescriptionCodes/GetData_PropertyDescriptionCodes'
                                                                                                                                                      addUrl='PropertyDescriptionCodes/InsertPropertyDescriptionCodes'
                                                                                                                                                      singleDataUrl='PropertyDescriptionCodes/GetSingleData_PropertyDescriptionCodes'
                                                                                                                                                      upUrl='PropertyDescriptionCodes/UpdatePropertyDescriptionCodes'
                                                                                                                                                      delUrl='PropertyDescriptionCodes/DeletePropertyDescriptionCodes'
                                                                                                                                                    />
                                                                                                                                                    :
                                                                                                                                                    openPage === 'Property Dispositions' ?
                                                                                                                                                      <ListTableCom
                                                                                                                                                        {...{ openPage }} col4='IsEditable'
                                                                                                                                                        col1='DispositionCode' col2='Description' col3='PropertyDispositionsID'
                                                                                                                                                        getUrl='PropertyDispositions/GetData_PropertyDispositions'
                                                                                                                                                        addUrl='PropertyDispositions/InsertPropertyDispositions'
                                                                                                                                                        singleDataUrl='PropertyDispositions/GetSingleData_PropertyDispositions'
                                                                                                                                                        upUrl='PropertyDispositions/UpdatePropertyDispositions'
                                                                                                                                                        delUrl='PropertyDispositions/DeletePropertyDispositions'
                                                                                                                                                      />
                                                                                                                                                      :
                                                                                                                                                      openPage === 'Property Reason Code' ?
                                                                                                                                                        <ListTableCom
                                                                                                                                                          {...{ openPage }} col4='IsEditable'
                                                                                                                                                          col1='PropertyReasonsCode' col2='Description' col3='PropertyReasonCodeID'
                                                                                                                                                          getUrl='PropertyReasonCode/GetData_PropertyReasonCode'
                                                                                                                                                          addUrl='PropertyReasonCode/InsertPropertyReasonCode'
                                                                                                                                                          singleDataUrl='PropertyReasonCode/GetSingleData_PropertyReasonCode'
                                                                                                                                                          upUrl='PropertyReasonCode/UpdatePropertyReasonCode'
                                                                                                                                                          delUrl='PropertyReasonCode/DeletePropertyReasonCode'
                                                                                                                                                        />
                                                                                                                                                        :
                                                                                                                                                        openPage === 'Property Type' ?
                                                                                                                                                          <ListTableCom
                                                                                                                                                            {...{ openPage }} col4='IsEditable'
                                                                                                                                                            col1='TypeCode' col2='Description' col3='PropertyTypeID'
                                                                                                                                                            getUrl='PropertyType/GetData_PropertyType'
                                                                                                                                                            addUrl='PropertyType/InsertPropertyType'
                                                                                                                                                            singleDataUrl='PropertyType/GetSingleData_PropertyType'
                                                                                                                                                            upUrl='PropertyType/UpdatePropertyType'
                                                                                                                                                            delUrl='PropertyType/DeletePropertyType'
                                                                                                                                                          />
                                                                                                                                                          :
                                                                                                                                                          openPage === 'Property Weapon Make' ?
                                                                                                                                                            <ListTableCom
                                                                                                                                                              {...{ openPage }} col4='IsEditable'
                                                                                                                                                              col1='PropertyWeaponMakeCode' col2='Description' col3='PropertyWeaponMakeID'
                                                                                                                                                              getUrl='PropertyWeaponMake/GetData_PropertyWeaponMake'
                                                                                                                                                              addUrl='PropertyWeaponMake/InsertPropertyWeaponMake'
                                                                                                                                                              singleDataUrl='PropertyWeaponMake/GetSingleData_PropertyWeaponMake'
                                                                                                                                                              upUrl='PropertyWeaponMake/UpdatePropertyWeaponMake'
                                                                                                                                                              delUrl='PropertyWeaponMake/DeletePropertyWeaponMake'
                                                                                                                                                            />
                                                                                                                                                            :
                                                                                                                                                            openPage === 'Rank Type' ?
                                                                                                                                                              <ListTableCom
                                                                                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                                                                                col1='RankTypeCode' col2='Description' col3='RankTypeID'
                                                                                                                                                                getUrl='RankType/GetData_RankType'
                                                                                                                                                                addUrl='RankType/InsertRankType'
                                                                                                                                                                singleDataUrl='RankType/GetSingleData_RankType'
                                                                                                                                                                upUrl='RankType/UpdateRankType'
                                                                                                                                                                delUrl='RankType/DeleteRankType'
                                                                                                                                                              />
                                                                                                                                                              :
                                                                                                                                                              openPage === 'Report Due' ?
                                                                                                                                                                <ListTableCom
                                                                                                                                                                  {...{ openPage }} col4='IsEditable'
                                                                                                                                                                  col1='ReportDueCode' col2='Description' col3='ReportDueId'
                                                                                                                                                                  getUrl='IncidentReportDue/GetData_IncidentReportDue'
                                                                                                                                                                  addUrl='IncidentReportDue/InsertIncidentReportDue'
                                                                                                                                                                  singleDataUrl='IncidentReportDue/GetSingleData_IncidentReportDue'
                                                                                                                                                                  upUrl='IncidentReportDue/UpdateIncidentReportDue'
                                                                                                                                                                  delUrl='IncidentReportDue/DeleteIncidentReportDue'
                                                                                                                                                                />
                                                                                                                                                                :
                                                                                                                                                                openPage === 'SMT Type' ?
                                                                                                                                                                  <ListTableCom
                                                                                                                                                                    {...{ openPage }} col4='IsEditable'
                                                                                                                                                                    col1='SMTTypeCode' col2='Description' col3='SMTTypeID'
                                                                                                                                                                    getUrl='SMTTypes/GetData_SMTTypes'
                                                                                                                                                                    addUrl='SMTTypes/InsertSMTTypes'
                                                                                                                                                                    singleDataUrl='SMTTypes/GetSingleData_SMTTypes'
                                                                                                                                                                    upUrl='SMTTypes/UpdateSMTTypes'
                                                                                                                                                                    delUrl='SMTTypes/DeleteSMTTypes'
                                                                                                                                                                  />
                                                                                                                                                                  :
                                                                                                                                                                openPage === 'Speech Codes' ?
                                                                                                                                                                  <ListTableCom
                                                                                                                                                                    {...{ openPage }} col4='IsEditable'
                                                                                                                                                                    col1='SpeechCode' col2='Description' col3='SpeechID'
                                                                                                                                                                    getUrl='SpeechCodes/GetData_SpeechCodes'
                                                                                                                                                                    addUrl='SpeechCodes/InsertSpeechCodes'
                                                                                                                                                                    singleDataUrl='SpeechCodes/GetSingleData_SpeechCodes'
                                                                                                                                                                    upUrl='SpeechCodes/UpdateSpeechCodes'
                                                                                                                                                                    delUrl='SpeechCodes/DeleteSpeechCodes'
                                                                                                                                                                  />
                                                                                                                                                                  :
                                                                                                                                                                  openPage === 'Suffix' ?
                                                                                                                                                                    <ListTableCom
                                                                                                                                                                      {...{ openPage }} col4='IsEditable'
                                                                                                                                                                      col1='SuffixCode' col2='Description' col3='SuffixID'
                                                                                                                                                                      getUrl='Suffix/GetData_Suffix'
                                                                                                                                                                      addUrl='Suffix/InsertSuffix'
                                                                                                                                                                      singleDataUrl='Suffix/GetSingleData_Suffix'
                                                                                                                                                                      upUrl='Suffix/UpdateSuffix'
                                                                                                                                                                      delUrl='Suffix/DeleteSuffix'
                                                                                                                                                                    />
                                                                                                                                                                    :
                                                                                                                                                                    openPage === 'Suspected Drug Type' ?
                                                                                                                                                                      <ListTableCom
                                                                                                                                                                        {...{ openPage }} col4='IsEditable'
                                                                                                                                                                        col1='DrugTypeCode' col2='Description' col3='DrugTypeID'
                                                                                                                                                                        getUrl='PropertyDrugType/GetData_PropertyDrugType'
                                                                                                                                                                        addUrl='PropertyDrugType/InsertPropertyDrugType'
                                                                                                                                                                        singleDataUrl='PropertyDrugType/GetSingleData_PropertyDrugType'
                                                                                                                                                                        upUrl='PropertyDrugType/UpdatePropertyDrugType'
                                                                                                                                                                        delUrl='PropertyDrugType/DeletePropertyDrugType'
                                                                                                                                                                      />
                                                                                                                                                                      :
                                                                                                                                                                      openPage === 'Teeth Code' ?
                                                                                                                                                                        <ListTableCom
                                                                                                                                                                          {...{ openPage }} col4='IsEditable'
                                                                                                                                                                          col1='TeethCode' col2='Description' col3='TeethID'
                                                                                                                                                                          getUrl='TeethCodes/GetData_TeethCodes'
                                                                                                                                                                          addUrl='TeethCodes/InsertTeethCodes'
                                                                                                                                                                          singleDataUrl='TeethCodes/GetSingleData_TeethCodes'
                                                                                                                                                                          upUrl='TeethCodes/UpdateTeethCodes'
                                                                                                                                                                          delUrl='TeethCodes/DeleteTeethCodes'
                                                                                                                                                                        />
                                                                                                                                                                        :
                                                                                                                                                                        openPage === 'Tools Use' ?
                                                                                                                                                                          <ListTableCom
                                                                                                                                                                            {...{ openPage }} col4='IsEditable'
                                                                                                                                                                            col1='ToolsUseCode' col2='Description' col3='ToolsUseID'
                                                                                                                                                                            getUrl='CrimeToolsUse/GetData_CrimeToolsUse'
                                                                                                                                                                            addUrl='CrimeToolsUse/InsertCrimeToolsUse'
                                                                                                                                                                            singleDataUrl='CrimeToolsUse/GetSingleData_CrimeToolsUse'
                                                                                                                                                                            upUrl='CrimeToolsUse/UpdateCrimeToolsUse'
                                                                                                                                                                            delUrl='CrimeToolsUse/DeleteCrimeToolsUse'
                                                                                                                                                                          />
                                                                                                                                                                          :
                                                                                                                                                                          openPage === 'Type Drug Measurement' ?
                                                                                                                                                                            <ListTableCom
                                                                                                                                                                              {...{ openPage }} col4='IsEditable'
                                                                                                                                                                              col1='DrugMeasureTypeCode' col2='Description' col3='DrugMeasureTypeID'
                                                                                                                                                                              getUrl='PropertyDrugMeasureType/GetData_PropertyDrugMeasureType'
                                                                                                                                                                              addUrl='PropertyDrugMeasureType/InsertPropertyDrugMeasureType'
                                                                                                                                                                              singleDataUrl='PropertyDrugMeasureType/GetSingleData_PropertyDrugMeasureType'
                                                                                                                                                                              upUrl='PropertyDrugMeasureType/UpdatePropertyDrugMeasureType'
                                                                                                                                                                              delUrl='PropertyDrugMeasureType/DeletePropertyDrugMeasureType'
                                                                                                                                                                            />
                                                                                                                                                                            :
                                                                                                                                                                            openPage === 'Type of Victim' ?
                                                                                                                                                                              <ListTableCom
                                                                                                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                col1='VictimCode' col2='Description' col3='VictimTypeID'
                                                                                                                                                                                getUrl='VictimType/GetData_VictimType'
                                                                                                                                                                                addUrl='VictimType/InsertVictimType'
                                                                                                                                                                                singleDataUrl='VictimType/GetSingleData_VictimType'
                                                                                                                                                                                upUrl='VictimType/UpdateVictimType'
                                                                                                                                                                                delUrl='VictimType/DeleteVictimType'
                                                                                                                                                                              />
                                                                                                                                                                              :
                                                                                                                                                                              openPage === 'Property Vehicle Plate Type' ?
                                                                                                                                                                                <ListTableCom
                                                                                                                                                                                  {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                  col1='PlateTypeCode' col2='Description' col3='PlateTypeID'
                                                                                                                                                                                  getUrl='PropertyVehiclePlateType/GetData_PropertyVehiclePlateType'
                                                                                                                                                                                  addUrl='PropertyVehiclePlateType/InsertPropertyVehiclePlateType'
                                                                                                                                                                                  singleDataUrl='PropertyVehiclePlateType/GetSingleData_PropertyVehiclePlateType'
                                                                                                                                                                                  upUrl='PropertyVehiclePlateType/UpdatePropertyVehiclePlateType'
                                                                                                                                                                                  delUrl='PropertyVehiclePlateType/DeletePropertyVehiclePlateType'
                                                                                                                                                                                />
                                                                                                                                                                                :
                                                                                                                                                                                openPage === 'Type' ?
                                                                                                                                                                                  <ListTableCom
                                                                                                                                                                                    {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                    col1='TypeCode' col2='Description' col3='TypeID'
                                                                                                                                                                                    getUrl='Type/GetData_Type'
                                                                                                                                                                                    addUrl='Type/InsertType'
                                                                                                                                                                                    singleDataUrl='Type/GetSingleData_Type'
                                                                                                                                                                                    upUrl='Type/UpdateType'
                                                                                                                                                                                    delUrl='Type/DeleteType'
                                                                                                                                                                                  />
                                                                                                                                                                                  :
                                                                                                                                                                                  // openPage === 'SMT Location' ?
                                                                                                                                                                                  //   <ListTableCom
                                                                                                                                                                                  //     {...{ openPage }} col4 ='IsEditable'
                                                                                                                                                                                  //     col1='SMTLocationCode' col2='Description' col3='SMTLocationID'
                                                                                                                                                                                  //     getUrl='SMTLocations/GetData_SMTLocations'
                                                                                                                                                                                  //     addUrl='SMTLocations/InsertSMTLocations'
                                                                                                                                                                                  //     singleDataUrl='SMTLocations/GetSingleData_SMTLocations'
                                                                                                                                                                                  //     upUrl='SMTLocations/UpdateSMTLocations'
                                                                                                                                                                                  //     delUrl='SMTLocations/DeleteSMTLocations'
                                                                                                                                                                                  //   />
                                                                                                                                                                                  //   :
                                                                                                                                                                                  openPage === 'Property Vehicle Model' ?
                                                                                                                                                                                    <ListTableCom
                                                                                                                                                                                      {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                      col1='PropertyVehicleModelCode' col2='Description' col3='PropertyVehicleModelID'
                                                                                                                                                                                      getUrl='PropertyVehicleModel/GetData_PropertyVehicleModel'
                                                                                                                                                                                      addUrl='PropertyVehicleModel/InsertPropertyVehicleModel'
                                                                                                                                                                                      singleDataUrl='PropertyVehicleModel/GetSingleData_PropertyVehicleModel'
                                                                                                                                                                                      upUrl='PropertyVehicleModel/UpdatePropertyVehicleModel'
                                                                                                                                                                                      delUrl='PropertyVehicleModel/DeletePropertyVehicleModel'
                                                                                                                                                                                    />
                                                                                                                                                                                    :
                                                                                                                                                                                    openPage === 'UCR Arrest' ?
                                                                                                                                                                                      <ListTableCom
                                                                                                                                                                                        {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                        col1='UCRArrestCode' col2='Description' col3='UCRArrestID'
                                                                                                                                                                                        getUrl='UCRArrest/GetData_UCRArrest'
                                                                                                                                                                                        addUrl='UCRArrest/InsertUCRArrest'
                                                                                                                                                                                        singleDataUrl='UCRArrest/GetSingleData_UCRArrest'
                                                                                                                                                                                        upUrl='UCRArrest/UpdateUCRArrest'
                                                                                                                                                                                        delUrl='UCRArrest/DeleteUCRArrest'
                                                                                                                                                                                      />
                                                                                                                                                                                      :
                                                                                                                                                                                      openPage === 'UCR Code' ?
                                                                                                                                                                                        <ListTableCom
                                                                                                                                                                                          {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                          col1='UCRCode' col2='Description' col3='UCRCodeID'
                                                                                                                                                                                          getUrl='UCRCodes/GetData_UCRCodes'
                                                                                                                                                                                          addUrl='UCRCodes/InsertUCRCodes'
                                                                                                                                                                                          singleDataUrl='UCRCodes/GetSingleData_UCRCodes'
                                                                                                                                                                                          upUrl='UCRCodes/UpdateUCRCodes'
                                                                                                                                                                                          delUrl='UCRCodes/DeleteUCRCodes'
                                                                                                                                                                                        />
                                                                                                                                                                                        :
                                                                                                                                                                                        openPage === 'Charge Group' ?
                                                                                                                                                                                          <ListTableCom
                                                                                                                                                                                            {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                            col1='ChargeGroupCode' col2='Description' col3='ChargeGroupID'
                                                                                                                                                                                            getUrl='ChargeGroup/GetData_ChargeGroup'
                                                                                                                                                                                            addUrl='ChargeGroup/InsertChargeGroup'
                                                                                                                                                                                            singleDataUrl='ChargeGroup/GetSingleData_ChargeGroup'
                                                                                                                                                                                            upUrl='ChargeGroup/UpdateChargeGroup'
                                                                                                                                                                                            delUrl='ChargeGroup/DeleteChargeGroup'
                                                                                                                                                                                          />
                                                                                                                                                                                          :

                                                                                                                                                                                          //----------------------dd-----------------------------//
                                                                                                                                                                                          // openPage === 'Property Make Code' ?
                                                                                                                                                                                          //   <ListTableCom
                                                                                                                                                                                          //     {...{ openPage }} col4 ='IsEditable'
                                                                                                                                                                                          //     col1='PropertyMakeCode' col2='Description' col3='PropertyMakeCodeID'
                                                                                                                                                                                          //     getUrl='PropertyMakeCodes/GetData_PropertyMakeCodes'
                                                                                                                                                                                          //     addUrl='PropertyMakeCodes/InsertPropertyMakeCodes'
                                                                                                                                                                                          //     singleDataUrl='PropertyMakeCodes/GetSingleData_PropertyMakeCodes'
                                                                                                                                                                                          //     upUrl='PropertyMakeCodes/UpdatePropertyMakeCodes'
                                                                                                                                                                                          //     delUrl='PropertyMakeCodes/DeletePropertyMakeCodes'
                                                                                                                                                                                          //   />
                                                                                                                                                                                          //   :
                                                                                                                                                                                          openPage === 'Property make Model' ?
                                                                                                                                                                                            <ListTableCom
                                                                                                                                                                                              {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                              col1='PropertymakeModelCode' col2='Description' col3='PropertymakeModelId'
                                                                                                                                                                                              getUrl=''
                                                                                                                                                                                              addUrl=''
                                                                                                                                                                                              singleDataUrl=''
                                                                                                                                                                                              upUrl=''
                                                                                                                                                                                              delUrl=''
                                                                                                                                                                                            />
                                                                                                                                                                                            :

                                                                                                                                                                                            openPage === 'Property Gun Model' ?
                                                                                                                                                                                              <ListTableCom
                                                                                                                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                col1='PropertyGunModelCode' col2='Description' col3='PropertyGunModelID'
                                                                                                                                                                                                getUrl='PropertyGunModel/GetData_PropertyGunModel'
                                                                                                                                                                                                addUrl='PropertyGunModel/InsertPropertyGunModel'
                                                                                                                                                                                                singleDataUrl='PropertyGunModel/GetSingleData_PropertyGunModel'
                                                                                                                                                                                                upUrl='PropertyGunModel/UpdatePropertyGunModel'
                                                                                                                                                                                                delUrl='PropertyGunModel/DeletePropertyGunModel'
                                                                                                                                                                                              />
                                                                                                                                                                                              :
                                                                                                                                                                                              openPage === 'Property Category Code' ?
                                                                                                                                                                                                <ListTableCom
                                                                                                                                                                                                  {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                  col1='PropertyCategoryCode' col2='Description' col3='PropertyCategoryCodeID'
                                                                                                                                                                                                  getUrl='PropertyCategoryCodes/GetData_PropertyCategoryCodes'
                                                                                                                                                                                                  addUrl='PropertyCategoryCodes/InsertPropertyCategoryCodes'
                                                                                                                                                                                                  singleDataUrl='PropertyCategoryCodes/GetSingleData_PropertyCategoryCodes'
                                                                                                                                                                                                  upUrl='PropertyCategoryCodes/UpdatePropertyCategoryCodes'
                                                                                                                                                                                                  delUrl='PropertyCategoryCodes/DeletePropertyCategoryCodes'
                                                                                                                                                                                                />
                                                                                                                                                                                                :
                                                                                                                                                                                                openPage === 'Property Drug Measure' ?
                                                                                                                                                                                                  <ListTableCom
                                                                                                                                                                                                    {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                    col1='PropertyDrugMeasureCode' col2='Description' col3='PropertyDrugMeasureID'
                                                                                                                                                                                                    getUrl='PropertyDrugMeasure/GetData_PropertyDrugMeasure'
                                                                                                                                                                                                    addUrl='PropertyDrugMeasure/InsertPropertyDrugMeasure'
                                                                                                                                                                                                    singleDataUrl='PropertyDrugMeasure/GetSingleData_PropertyDrugMeasure'
                                                                                                                                                                                                    upUrl='PropertyDrugMeasure/UpdatePropertyDrugMeasure'
                                                                                                                                                                                                    delUrl='PropertyDrugMeasure/DeletePropertyDrugMeasure'
                                                                                                                                                                                                  />
                                                                                                                                                                                                  :
                                                                                                                                                                                                  // openPage === 'Property Classification' ?
                                                                                                                                                                                                  //   <ListTableCom
                                                                                                                                                                                                  //     {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                  //     col1='PropertyClassificationCode' col2='Description' col3='PropertyClassificationID'
                                                                                                                                                                                                  //     getUrl='PropertyClassification/GetData_PropertyClassification'
                                                                                                                                                                                                  //     addUrl='PropertyClassification/InsertPropertyClassification'
                                                                                                                                                                                                  //     singleDataUrl='PropertyClassification/GetSingleData_PropertyClassification'
                                                                                                                                                                                                  //     upUrl='PropertyClassification/UpdatePropertyClassification'
                                                                                                                                                                                                  //     delUrl='PropertyClassification/DeletePropertyClassification'
                                                                                                                                                                                                  //   />
                                                                                                                                                                                                  //   :

                                                                                                                                                                                                  openPage === 'Boat Out Hull' ?
                                                                                                                                                                                                    <ListTableCom
                                                                                                                                                                                                      {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                      col1='BoatOutHullCode' col2='Description' col3='BoatOutHullID'
                                                                                                                                                                                                      getUrl='BoatOutHull/GetData_BoatOutHull'
                                                                                                                                                                                                      addUrl='BoatOutHull/InsertBoatOutHull'
                                                                                                                                                                                                      singleDataUrl='BoatOutHull/GetSingleData_BoatOutHull'
                                                                                                                                                                                                      upUrl='BoatOutHull/UpdateBoatOutHull'
                                                                                                                                                                                                      delUrl='BoatOutHull/DeleteBoatOutHull'
                                                                                                                                                                                                    />
                                                                                                                                                                                                    :
                                                                                                                                                                                                    openPage === 'Boat Type' ?
                                                                                                                                                                                                      <ListTableCom
                                                                                                                                                                                                        {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                        col1='BoatTypeCode' col2='Description' col3='BoatTypeID'
                                                                                                                                                                                                        getUrl='BoatType/GetData_BoatType'
                                                                                                                                                                                                        addUrl='BoatType/InsertBoatType'
                                                                                                                                                                                                        singleDataUrl='BoatType/GetSingleData_BoatType'
                                                                                                                                                                                                        upUrl='BoatType/UpdateBoatType'
                                                                                                                                                                                                        delUrl='BoatType/DeleteBoatType'
                                                                                                                                                                                                      />
                                                                                                                                                                                                      :
                                                                                                                                                                                                      openPage === 'Name Facial Hair' ?
                                                                                                                                                                                                        <ListTableCom
                                                                                                                                                                                                          {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                          col1='NameFacialHairCode' col2='Description' col3='NameFacialHairID'
                                                                                                                                                                                                          getUrl='NameFacialHair/GetData_NameFacialHair'
                                                                                                                                                                                                          addUrl='NameFacialHair/InsertNameFacialHair'
                                                                                                                                                                                                          singleDataUrl='NameFacialHair/GetSingleData_NameFacialHair'
                                                                                                                                                                                                          upUrl='NameFacialHair/UpdateNameFacialHair'
                                                                                                                                                                                                          delUrl='NameFacialHair/DeleteNameFacialHair'
                                                                                                                                                                                                        />
                                                                                                                                                                                                        :
                                                                                                                                                                                                        openPage === 'Name Business Type' ?
                                                                                                                                                                                                          <ListTableCom
                                                                                                                                                                                                            {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                            col1='NameBusinessTypeCode' col2='Description' col3='NameBusinessTypeID'
                                                                                                                                                                                                            getUrl='NameBusinessType/GetData_NameBusinessType'
                                                                                                                                                                                                            addUrl='NameBusinessType/InsertNameBusinessType'
                                                                                                                                                                                                            singleDataUrl='NameBusinessType/GetSingleData_NameBusinessType'
                                                                                                                                                                                                            upUrl='NameBusinessType/UpdateNameBusinessType'
                                                                                                                                                                                                            delUrl='NameBusinessType/DeleteNameBusinessType'
                                                                                                                                                                                                          />
                                                                                                                                                                                                          :
                                                                                                                                                                                                          openPage === 'Property Boat OH Material' ?
                                                                                                                                                                                                            <ListTableCom
                                                                                                                                                                                                              {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                              col1='PropertyBoatOHMaterialCode' col2='Description' col3='PropertyBoatOHMaterialID'
                                                                                                                                                                                                              getUrl='PropertyBoatOHMaterial/GetData_PropertyBoatOHMaterial'
                                                                                                                                                                                                              addUrl='PropertyBoatOHMaterial/InsertPropertyBoatOHMaterial'
                                                                                                                                                                                                              singleDataUrl='PropertyBoatOHMaterial/GetSingleData_PropertyBoatOHMaterial'
                                                                                                                                                                                                              upUrl='PropertyBoatOHMaterial/UpdatePropertyBoatOHMaterial'
                                                                                                                                                                                                              delUrl='PropertyBoatOHMaterial/DeletePropertyBoatOHMaterial'
                                                                                                                                                                                                            />
                                                                                                                                                                                                            :
                                                                                                                                                                                                            openPage === 'Property Boat Make' ?
                                                                                                                                                                                                              <PropertyBoatMake
                                                                                                                                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                col1='PropertyBoatMakeCode' col2='Description' col3='PropertyBoatMakeID'
                                                                                                                                                                                                                getUrl='PropertyBoatMake/GetData_PropertyBoatMake'
                                                                                                                                                                                                                addUrl='PropertyBoatMake/InsertPropertyBoatMake'
                                                                                                                                                                                                                singleDataUrl='PropertyBoatMake/GetSingleData_PropertyBoatMake'
                                                                                                                                                                                                                upUrl='PropertyBoatMake/UpdatePropertyBoatMake'
                                                                                                                                                                                                                delUrl='PropertyBoatMake/DeletePropertyBoatMake'
                                                                                                                                                                                                              />
                                                                                                                                                                                                              :
                                                                                                                                                                                                              openPage === 'Property Boat Model' ?
                                                                                                                                                                                                                <ListTableCom
                                                                                                                                                                                                                  {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                  col1='PropertyBoatModelCode' col2='Description' col3='PropertyBoatModelID'
                                                                                                                                                                                                                  getUrl='PropertyBoatModel/GetData_PropertyBoatModel'
                                                                                                                                                                                                                  addUrl='PropertyBoatModel/InsertPropertyBoatModel'
                                                                                                                                                                                                                  singleDataUrl='PropertyBoatModel/GetSingleData_PropertyBoatModel'
                                                                                                                                                                                                                  upUrl='PropertyBoatModel/UpdatePropertyBoatModel'
                                                                                                                                                                                                                  delUrl='PropertyBoatModel/DeletePropertyBoatModel'
                                                                                                                                                                                                                />
                                                                                                                                                                                                                :
                                                                                                                                                                                                                //----------------dd---------------------//
                                                                                                                                                                                                                openPage === 'Charge Code' ?
                                                                                                                                                                                                                  <ChargeCode />
                                                                                                                                                                                                                  :
                                                                                                                                                                                                                  openPage === 'Name Glass Type' ?
                                                                                                                                                                                                                    <ListTableCom
                                                                                                                                                                                                                      {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                      col1='NameGlassesTypeCode' col2='Description' col3='NameGlassesTypeID'
                                                                                                                                                                                                                      getUrl='NameGlassesTypes/GetData_NameGlassesTypes'
                                                                                                                                                                                                                      addUrl='NameGlassesTypes/InsertNameGlassesTypes'
                                                                                                                                                                                                                      singleDataUrl='NameGlassesTypes/GetSingleData_NameGlassesTypes'
                                                                                                                                                                                                                      upUrl='NameGlassesTypes/UpdateNameGlassesTypes'
                                                                                                                                                                                                                      delUrl='NameGlassesTypes/DeleteNameGlassesTypes'
                                                                                                                                                                                                                    />
                                                                                                                                                                                                                    :
                                                                                                                                                                                                                    openPage === 'Name Distinct Feature Code' ?
                                                                                                                                                                                                                      <ListTableCom
                                                                                                                                                                                                                        {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                        col1='NameDistinctFeaturesCodes' col2='Description' col3='NameDistinctFeaturesCodeID'
                                                                                                                                                                                                                        getUrl='NameDistinctFeaturesCode/GetData_NameDistinctFeaturesCode'
                                                                                                                                                                                                                        addUrl='NameDistinctFeaturesCode/InsertNameDistinctFeaturesCode'
                                                                                                                                                                                                                        singleDataUrl='NameDistinctFeaturesCode/GetSingleData_NameDistinctFeaturesCode'
                                                                                                                                                                                                                        upUrl='NameDistinctFeaturesCode/UpdateNameDistinctFeaturesCode'
                                                                                                                                                                                                                        delUrl='NameDistinctFeaturesCode/DeleteNameDistinctFeaturesCode'
                                                                                                                                                                                                                      />
                                                                                                                                                                                                                      :
                                                                                                                                                                                                                      openPage === 'Name Gang Type' ?
                                                                                                                                                                                                                        <ListTableCom
                                                                                                                                                                                                                          {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                          col1='NameGangTypeCode' col2='Description' col3='NameGangTypeID'
                                                                                                                                                                                                                          getUrl='NameGangType/GetData_NameGangType'
                                                                                                                                                                                                                          addUrl='NameGangType/InsertNameGangType'
                                                                                                                                                                                                                          singleDataUrl='NameGangType/GetSingleData_NameGangType'
                                                                                                                                                                                                                          upUrl='NameGangType/UpdateNameGangType'
                                                                                                                                                                                                                          delUrl='NameGangType/DeleteNameGangType'
                                                                                                                                                                                                                        />
                                                                                                                                                                                                                        :
                                                                                                                                                                                                                        openPage === 'Property Gun Make' ?
                                                                                                                                                                                                                          <PropertyGunMake
                                                                                                                                                                                                                            {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                            col1='PropertyGunMakeCode' col2='Description' col3='PropertyGunMakeID'
                                                                                                                                                                                                                            getUrl='PropertyGunMake/GetData_PropertyGunMake'
                                                                                                                                                                                                                            addUrl='PropertyGunMake/InsertPropertyGunMake'
                                                                                                                                                                                                                            singleDataUrl='PropertyGunMake/GetSingleData_PropertyGunMake'
                                                                                                                                                                                                                            upUrl='PropertyGunMake/UpdatePropertyGunMake'
                                                                                                                                                                                                                            delUrl='PropertyGunMake/DeletePropertyGunMake'
                                                                                                                                                                                                                          />
                                                                                                                                                                                                                          :
                                                                                                                                                                                                                          openPage === 'Property Category' ?
                                                                                                                                                                                                                            <ListTableCom
                                                                                                                                                                                                                              {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                              col1='PropertyCategoryCode' col2='Description' col3='PropertyCategoryID'
                                                                                                                                                                                                                              getUrl='PropertyCategory/GetData_PropertyCategory'
                                                                                                                                                                                                                              addUrl='PropertyCategory/InsertPropertyCategory'
                                                                                                                                                                                                                              singleDataUrl='PropertyCategory/GetSingleData_PropertyCategory'
                                                                                                                                                                                                                              upUrl='PropertyCategory/UpdatePropertyCategory'
                                                                                                                                                                                                                              delUrl='PropertyCategory/DeletePropertyCategory'
                                                                                                                                                                                                                            />
                                                                                                                                                                                                                            :
                                                                                                                                                                                                                            openPage === 'Property Boat Type' ?
                                                                                                                                                                                                                              <ListTableCom
                                                                                                                                                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                col1='PropertyBoatTypeCode' col2='Description' col3='PropertyBoatTypeID'
                                                                                                                                                                                                                                getUrl='PropertyBoatType/GetData_PropertyBoatType'
                                                                                                                                                                                                                                addUrl='PropertyBoatType/InsertPropertyBoatType'
                                                                                                                                                                                                                                singleDataUrl='PropertyBoatType/GetSingleData_PropertyBoatType'
                                                                                                                                                                                                                                upUrl='PropertyBoatType/UpdatePropertyBoatType'
                                                                                                                                                                                                                                delUrl='PropertyBoatType/DeletePropertyBoatType'
                                                                                                                                                                                                                              />
                                                                                                                                                                                                                              :
                                                                                                                                                                                                                              openPage === 'Property Boat Propulsion' ?
                                                                                                                                                                                                                                <ListTableCom
                                                                                                                                                                                                                                  {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                  col1='PropertyBoatPropulsionCode' col2='Description' col3='PropertyBoatPropulsionID'
                                                                                                                                                                                                                                  getUrl='PropertyBoatPropulsion/GetData_PropertyBoatPropulsion'
                                                                                                                                                                                                                                  addUrl='PropertyBoatPropulsion/InsertPropertyBoatPropulsion'
                                                                                                                                                                                                                                  singleDataUrl='PropertyBoatPropulsion/GetSingleData_PropertyBoatPropulsion'
                                                                                                                                                                                                                                  upUrl='PropertyBoatPropulsion/UpdatePropertyBoatPropulsion'
                                                                                                                                                                                                                                  delUrl='PropertyBoatPropulsion/DeletePropertyBoatPropulsion'
                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                :
                                                                                                                                                                                                                                openPage === 'Incident Receive Source' ?
                                                                                                                                                                                                                                  <ListTableCom
                                                                                                                                                                                                                                    {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                    col1='ReceiveSourceCode' col2='Description' col3='ReceiveSourceID'
                                                                                                                                                                                                                                    getUrl='IncidentReceiveSource/GetData_IncidentReceiveSource'
                                                                                                                                                                                                                                    addUrl='IncidentReceiveSource/InsertIncidentReceiveSource'
                                                                                                                                                                                                                                    singleDataUrl='IncidentReceiveSource/GetSingleData_IncidentReceiveSource'
                                                                                                                                                                                                                                    upUrl='IncidentReceiveSource/UpdateIncidentReceiveSource'
                                                                                                                                                                                                                                    delUrl='IncidentReceiveSource/DeleteIncidentReceiveSource'
                                                                                                                                                                                                                                  />
                                                                                                                                                                                                                                  :
                                                                                                                                                                                                                                  openPage === 'MNU Type' ?
                                                                                                                                                                                                                                    <ListTableCom
                                                                                                                                                                                                                                      {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                      col1='MNUTypeCode' col2='Description' col3='MNUTypeID'
                                                                                                                                                                                                                                      getUrl='MNUType/GetData_MNUType'
                                                                                                                                                                                                                                      addUrl='MNUType/InsertMNUType'
                                                                                                                                                                                                                                      singleDataUrl='MNUType/GetSingleData_MNUType'
                                                                                                                                                                                                                                      upUrl='MNUType/UpdateMNUType'
                                                                                                                                                                                                                                      delUrl='MNUType/DeleteMNUType'
                                                                                                                                                                                                                                    />
                                                                                                                                                                                                                                    :
                                                                                                                                                                                                                                    openPage === 'Indentification Type' ?
                                                                                                                                                                                                                                      <ListTableCom
                                                                                                                                                                                                                                        {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                        col1='IndentificationTypesCode' col2='Description' col3='IndentificationTypeID'
                                                                                                                                                                                                                                        getUrl='IndentificationType/GetData_IndentificationType'
                                                                                                                                                                                                                                        addUrl='IndentificationType/InsertIndentificationType'
                                                                                                                                                                                                                                        singleDataUrl='IndentificationType/GetSingleData_IndentificationType'
                                                                                                                                                                                                                                        upUrl='IndentificationType/UpdateIndentificationType'
                                                                                                                                                                                                                                        delUrl='IndentificationType/DeleteIndentificationType'
                                                                                                                                                                                                                                      />
                                                                                                                                                                                                                                      :
                                                                                                                                                                                                                                      openPage === 'Parole Unit Code' ?
                                                                                                                                                                                                                                        <ListTableCom
                                                                                                                                                                                                                                          {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                          col1='ParoleUnitsCode' col2='Description' col3='ParoleUnitsCodeID'
                                                                                                                                                                                                                                          getUrl='ParoleUnitsCode/GetData_ParoleUnitsCode'
                                                                                                                                                                                                                                          addUrl='ParoleUnitsCode/InsertParoleUnitsCode'
                                                                                                                                                                                                                                          singleDataUrl='ParoleUnitsCode/GetSingleData_ParoleUnitsCode'
                                                                                                                                                                                                                                          upUrl='ParoleUnitsCode/UpdateParoleUnitsCode'
                                                                                                                                                                                                                                          delUrl='ParoleUnitsCode/DeleteParoleUnitsCode'
                                                                                                                                                                                                                                        />
                                                                                                                                                                                                                                        :
                                                                                                                                                                                                                                        openPage === 'Parole Probation Status' ?
                                                                                                                                                                                                                                          <ListTableCom
                                                                                                                                                                                                                                            {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                            col1='ParoleProbationStatusCode' col2='Description' col3='ParoleProbationStatusID'
                                                                                                                                                                                                                                            getUrl='ParoleProbationStatus/GetData_ParoleProbationStatus'
                                                                                                                                                                                                                                            addUrl='ParoleProbationStatus/InsertParoleProbationStatus'
                                                                                                                                                                                                                                            singleDataUrl='ParoleProbationStatus/GetSingleData_ParoleProbationStatus'
                                                                                                                                                                                                                                            upUrl='ParoleProbationStatus/UpdateParoleProbationStatus'
                                                                                                                                                                                                                                            delUrl='ParoleProbationStatus/DeleteParoleProbationStatus'
                                                                                                                                                                                                                                          />
                                                                                                                                                                                                                                          :
                                                                                                                                                                                                                                          openPage === 'Name Type' ?
                                                                                                                                                                                                                                            <ListTableCom
                                                                                                                                                                                                                                              {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                              col1='NameTypeCode' col2='Description' col3='NameTypeID'
                                                                                                                                                                                                                                              getUrl='NameType/GetData_NameType'
                                                                                                                                                                                                                                              addUrl='NameType/InsertNameType'
                                                                                                                                                                                                                                              singleDataUrl='NameType/GetSingleData_NameType'
                                                                                                                                                                                                                                              upUrl='NameType/UpdateNameType'
                                                                                                                                                                                                                                              delUrl='NameType/DeleteNameType'
                                                                                                                                                                                                                                            />
                                                                                                                                                                                                                                            :
                                                                                                                                                                                                                                            openPage === 'Narrative Type' ?
                                                                                                                                                                                                                                              <ListTableCom
                                                                                                                                                                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                col1='NarrativeTypeCode' col2='Description' col3='NarrativeTypeID'
                                                                                                                                                                                                                                                getUrl='NarrativeType/GetData_NarrativeType'
                                                                                                                                                                                                                                                addUrl='NarrativeType/InsertNarrativeType'
                                                                                                                                                                                                                                                singleDataUrl='NarrativeType/GetSingleData_NarrativeType'
                                                                                                                                                                                                                                                upUrl='NarrativeType/UpdateNarrativeType'
                                                                                                                                                                                                                                                delUrl='NarrativeType/DeleteNarrativeType'
                                                                                                                                                                                                                                              />
                                                                                                                                                                                                                                              :
                                                                                                                                                                                                                                              openPage === 'Document Type' ?
                                                                                                                                                                                                                                                <ListTableCom
                                                                                                                                                                                                                                                  {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                  col1='DocumentCode' col2='Description' col3='DocumentTypeID'
                                                                                                                                                                                                                                                  getUrl='DocumentType/GetData_DocumentType'
                                                                                                                                                                                                                                                  addUrl='DocumentType/InsertDocumentType'
                                                                                                                                                                                                                                                  singleDataUrl='DocumentType/GetSingleData_DocumentType'
                                                                                                                                                                                                                                                  upUrl='DocumentType/UpdateDocumentType'
                                                                                                                                                                                                                                                  delUrl='DocumentType/DeleteDocumentType'
                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                :
                                                                                                                                                                                                                                                openPage === 'Pretend To Be' ?
                                                                                                                                                                                                                                                  <ListTableCom
                                                                                                                                                                                                                                                    {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                    col1='PretendToBeCode' col2='Description' col3='PretendToBeID'
                                                                                                                                                                                                                                                    getUrl='PretendToBe/GetData_PretendToBe'
                                                                                                                                                                                                                                                    addUrl='PretendToBe/InsertPretendToBe'
                                                                                                                                                                                                                                                    singleDataUrl='PretendToBe/GetSingleData_PretendToBe'
                                                                                                                                                                                                                                                    upUrl='PretendToBe/UpdatePretendToBe'
                                                                                                                                                                                                                                                    delUrl='PretendToBe/DeletePretendToBe'
                                                                                                                                                                                                                                                  />
                                                                                                                                                                                                                                                  :
                                                                                                                                                                                                                                                  openPage === 'Verify' ?
                                                                                                                                                                                                                                                    <ListTableCom
                                                                                                                                                                                                                                                      {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                      col1='VerifyCode' col2='Description' col3='VerifyID'
                                                                                                                                                                                                                                                      getUrl='Verify/GetData_Verify'
                                                                                                                                                                                                                                                      addUrl='Verify/InsertVerify'
                                                                                                                                                                                                                                                      singleDataUrl='Verify/GetSingleData_Verify'
                                                                                                                                                                                                                                                      upUrl='Verify/UpdateVerify'
                                                                                                                                                                                                                                                      delUrl='Verify/DeleteVerify'
                                                                                                                                                                                                                                                    />
                                                                                                                                                                                                                                                    :
                                                                                                                                                                                                                                                    openPage === 'Justifiable Homicide' ?
                                                                                                                                                                                                                                                      <ListTableCom
                                                                                                                                                                                                                                                        {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                        col1='JustifiableHomicideCode' col2='Description' col3='JustifiableHomicideID'
                                                                                                                                                                                                                                                        getUrl='JustifiableHomicide/GetData_JustifiableHomicide'
                                                                                                                                                                                                                                                        addUrl='JustifiableHomicide/InsertJustifiableHomicide'
                                                                                                                                                                                                                                                        singleDataUrl='JustifiableHomicide/GetSingleData_JustifiableHomicide'
                                                                                                                                                                                                                                                        upUrl='JustifiableHomicide/UpdateJustifiableHomicide'
                                                                                                                                                                                                                                                        delUrl='JustifiableHomicide/DeleteJustifiableHomicide'
                                                                                                                                                                                                                                                      />
                                                                                                                                                                                                                                                      :
                                                                                                                                                                                                                                                      openPage === 'Assault Type' ?
                                                                                                                                                                                                                                                        <ListTableCom
                                                                                                                                                                                                                                                          {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                          col1='AssaultCode' col2='Description' col3='AssaultTypeID'
                                                                                                                                                                                                                                                          getUrl='AssaultType/GetData_AssaultType'
                                                                                                                                                                                                                                                          addUrl='AssaultType/InsertAssaultType'
                                                                                                                                                                                                                                                          singleDataUrl='AssaultType/GetSingleData_AssaultType'
                                                                                                                                                                                                                                                          upUrl='AssaultType/UpdateAssaultType'
                                                                                                                                                                                                                                                          delUrl='AssaultType/DeleteAssaultType'
                                                                                                                                                                                                                                                        />
                                                                                                                                                                                                                                                        :
                                                                                                                                                                                                                                                        openPage === 'Additional Justification' ?
                                                                                                                                                                                                                                                          <ListTableCom
                                                                                                                                                                                                                                                            {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                            col1='AdditionalJustificationCode' col2='Description' col3='AdditionalJustificationID'
                                                                                                                                                                                                                                                            getUrl='AdditionalJustification/GetData_AdditionalJustification'
                                                                                                                                                                                                                                                            addUrl='AdditionalJustification/InsertAdditionalJustification'
                                                                                                                                                                                                                                                            singleDataUrl='AdditionalJustification/GetSingleData_AdditionalJustification'
                                                                                                                                                                                                                                                            upUrl='AdditionalJustification/UpdateAdditionalJustification'
                                                                                                                                                                                                                                                            delUrl='AdditionalJustification/DeleteAdditionalJustification'
                                                                                                                                                                                                                                                          />
                                                                                                                                                                                                                                                          :
                                                                                                                                                                                                                                                          openPage === 'Body Armor' ?
                                                                                                                                                                                                                                                            <ListTableCom
                                                                                                                                                                                                                                                              {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                              col1='BodyArmorCode' col2='Description' col3='BodyArmorID'
                                                                                                                                                                                                                                                              getUrl='BodyArmor/GetData_BodyArmor'
                                                                                                                                                                                                                                                              addUrl='BodyArmor/InsertBodyArmor'
                                                                                                                                                                                                                                                              singleDataUrl='BodyArmor/GetSingleData_BodyArmor'
                                                                                                                                                                                                                                                              upUrl='BodyArmor/UpdateBodyArmor'
                                                                                                                                                                                                                                                              delUrl='BodyArmor/DeleteBodyArmor'
                                                                                                                                                                                                                                                            />
                                                                                                                                                                                                                                                            :
                                                                                                                                                                                                                                                            openPage === 'Police Force' ?
                                                                                                                                                                                                                                                              <ListTableCom
                                                                                                                                                                                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                col1='PoliceForceCode' col2='Description' col3='PoliceForceID'
                                                                                                                                                                                                                                                                getUrl='PoliceForce/GetData_PoliceForce'
                                                                                                                                                                                                                                                                addUrl='PoliceForce/InsertPoliceForce'
                                                                                                                                                                                                                                                                singleDataUrl='PoliceForce/GetSingleData_PoliceForce'
                                                                                                                                                                                                                                                                upUrl='PoliceForce/UpdatePoliceForce'
                                                                                                                                                                                                                                                                delUrl='PoliceForce/DeletePoliceForce'
                                                                                                                                                                                                                                                              />
                                                                                                                                                                                                                                                              :
                                                                                                                                                                                                                                                              openPage === 'UCR Clear' ?
                                                                                                                                                                                                                                                                <ListTableCom
                                                                                                                                                                                                                                                                  {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                  col1='UCRClearCode' col2='Description' col3='UCRClearID'
                                                                                                                                                                                                                                                                  getUrl='UCRClear/GetData_UCRClear'
                                                                                                                                                                                                                                                                  addUrl='UCRClear/InsertUCRClear'
                                                                                                                                                                                                                                                                  singleDataUrl='UCRClear/GetSingleData_UCRClear'
                                                                                                                                                                                                                                                                  upUrl='UCRClear/UpdateUCRClear'
                                                                                                                                                                                                                                                                  delUrl='UCRClear/DeleteUCRClear'
                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                                :
                                                                                                                                                                                                                                                                openPage === 'Arrest Plea' ?
                                                                                                                                                                                                                                                                  <ListTableCom
                                                                                                                                                                                                                                                                    {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                    col1='ArrestPleaCode' col2='Description' col3='ArrestPleaID'
                                                                                                                                                                                                                                                                    getUrl='ArrestPlea/GetData_ArrestPlea'
                                                                                                                                                                                                                                                                    addUrl='ArrestPlea/InsertArrestPlea'
                                                                                                                                                                                                                                                                    singleDataUrl='ArrestPlea/GetSingleData_ArrestPlea'
                                                                                                                                                                                                                                                                    upUrl='ArrestPlea/UpdateArrestPlea'
                                                                                                                                                                                                                                                                    delUrl='ArrestPlea/DeleteArrestPlea'
                                                                                                                                                                                                                                                                  />
                                                                                                                                                                                                                                                                  :
                                                                                                                                                                                                                                                                  openPage === 'Court Judge Name' ?
                                                                                                                                                                                                                                                                    <ListTableCom
                                                                                                                                                                                                                                                                      {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                      col1='CourtJudgeNameCode' col2='Description' col3='CourtJudgeNameID'
                                                                                                                                                                                                                                                                      getUrl='CourtJudgeName/GetData_CourtJudgeName'
                                                                                                                                                                                                                                                                      addUrl='CourtJudgeName/InsertCourtJudgeName'
                                                                                                                                                                                                                                                                      singleDataUrl='CourtJudgeName/GetSingleData_CourtJudgeName'
                                                                                                                                                                                                                                                                      upUrl='CourtJudgeName/UpdateCourtJudgeName'
                                                                                                                                                                                                                                                                      delUrl='CourtJudgeName/DeleteCourtJudgeName'
                                                                                                                                                                                                                                                                    />
                                                                                                                                                                                                                                                                    :
                                                                                                                                                                                                                                                                    openPage === 'Property Loss Code' ?
                                                                                                                                                                                                                                                                      <ListTableCom
                                                                                                                                                                                                                                                                        {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                        col1='PropertyLossCode' col2='Description' col3='PropertyLossCodeID'
                                                                                                                                                                                                                                                                        getUrl='PropertyLossCode/GetData_PropertyLossCode'
                                                                                                                                                                                                                                                                        addUrl='PropertyLossCode/InsertPropertyLossCode'
                                                                                                                                                                                                                                                                        singleDataUrl='PropertyLossCode/GetSingleData_PropertyLossCode'
                                                                                                                                                                                                                                                                        upUrl='PropertyLossCode/UpdatePropertyLossCode'
                                                                                                                                                                                                                                                                        delUrl='PropertyLossCode/DeletePropertyLossCode'
                                                                                                                                                                                                                                                                      />
                                                                                                                                                                                                                                                                      :
                                                                                                                                                                                                                                                                      openPage === 'Boat VOD' ?
                                                                                                                                                                                                                                                                        <ListTableCom
                                                                                                                                                                                                                                                                          {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                          col1='BoatVODCode' col2='Description' col3='PropertyBoatVODID'
                                                                                                                                                                                                                                                                          getUrl='PropertyBoatVOD/GetData_PropertyBoatVOD'
                                                                                                                                                                                                                                                                          addUrl='PropertyBoatVOD/InsertPropertyBoatVOD'
                                                                                                                                                                                                                                                                          singleDataUrl='PropertyBoatVOD/GetSingleData_PropertyBoatVOD'
                                                                                                                                                                                                                                                                          upUrl='PropertyBoatVOD/UpdatePropertyBoatVOD'
                                                                                                                                                                                                                                                                          delUrl='PropertyBoatVOD/DeletePropertyBoatVOD'
                                                                                                                                                                                                                                                                        />
                                                                                                                                                                                                                                                                        :
                                                                                                                                                                                                                                                                        openPage === 'Vehicle VOD' ?
                                                                                                                                                                                                                                                                          <ListTableCom
                                                                                                                                                                                                                                                                            {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                            col1='VehicleVODCode' col2='Description' col3='VehicleVODID'
                                                                                                                                                                                                                                                                            getUrl='VehicleVOD/GetData_VehicleVOD'
                                                                                                                                                                                                                                                                            addUrl='VehicleVOD/InsertVehicleVOD'
                                                                                                                                                                                                                                                                            singleDataUrl='VehicleVOD/GetSingleData_VehicleVOD'
                                                                                                                                                                                                                                                                            upUrl='VehicleVOD/UpdateVehicleVOD'
                                                                                                                                                                                                                                                                            delUrl='VehicleVOD/DeleteVehicleVOD'
                                                                                                                                                                                                                                                                          />
                                                                                                                                                                                                                                                                          :
                                                                                                                                                                                                                                                                          openPage === 'Recovery Type' ?
                                                                                                                                                                                                                                                                            <ListTableCom
                                                                                                                                                                                                                                                                              {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                              col1='RecoveryTypeCode' col2='Description' col3='RecoveryTypeID'
                                                                                                                                                                                                                                                                              getUrl='RecoveryType/GetData_RecoveryType'
                                                                                                                                                                                                                                                                              addUrl='RecoveryType/InsertRecoveryType'
                                                                                                                                                                                                                                                                              singleDataUrl='RecoveryType/GetSingleData_RecoveryType'
                                                                                                                                                                                                                                                                              upUrl='RecoveryType/UpdateRecoveryType'
                                                                                                                                                                                                                                                                              delUrl='RecoveryType/DeleteRecoveryType'
                                                                                                                                                                                                                                                                            />
                                                                                                                                                                                                                                                                            :
                                                                                                                                                                                                                                                                            openPage === 'UCR Recovered' ?
                                                                                                                                                                                                                                                                              <ListTableCom
                                                                                                                                                                                                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                col1='UCRRecoveredCode' col2='Description' col3='UCRRecoveredID'
                                                                                                                                                                                                                                                                                getUrl='UCRRecovered/GetData_UCRRecovered'
                                                                                                                                                                                                                                                                                addUrl='UCRRecovered/InsertUCRRecovered'
                                                                                                                                                                                                                                                                                singleDataUrl='UCRRecovered/GetSingleData_UCRRecovered'
                                                                                                                                                                                                                                                                                upUrl='UCRRecovered/UpdateUCRRecovered'
                                                                                                                                                                                                                                                                                delUrl='UCRRecovered/DeleteUCRRecovered'
                                                                                                                                                                                                                                                                              />
                                                                                                                                                                                                                                                                              :
                                                                                                                                                                                                                                                                              openPage === 'Apartment Type' ?
                                                                                                                                                                                                                                                                                <ListTableCom
                                                                                                                                                                                                                                                                                  {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                  col1='ApartmentTypeCode' col2='Description' col3='ApartmentTypeID'
                                                                                                                                                                                                                                                                                  getUrl="AppartmentType/GetData_AppartmentType"
                                                                                                                                                                                                                                                                                  addUrl='AppartmentType/InsertAppartmentType'
                                                                                                                                                                                                                                                                                  singleDataUrl='AppartmentType/GetSingleData_AppartmentType'
                                                                                                                                                                                                                                                                                  upUrl='AppartmentType/UpdateAppartmentType'
                                                                                                                                                                                                                                                                                  delUrl='AppartmentType/DeleteAppartmentType'
                                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                                                :

                                                                                                                                                                                                                                                                                openPage === 'Direction Prefix/Suffix' ?
                                                                                                                                                                                                                                                                                  <ListTableCom
                                                                                                                                                                                                                                                                                    {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                    col1='DirectionPrefixSuffixCode' col2='Description' col3='DirectionPrefixSuffixID'
                                                                                                                                                                                                                                                                                    getUrl='DirectionPrefixSuffix/GetData_DirectionPrefixSuffix'
                                                                                                                                                                                                                                                                                    addUrl='DirectionPrefixSuffix/InsertDirectionPrefixSuffix'
                                                                                                                                                                                                                                                                                    singleDataUrl='DirectionPrefixSuffix/GetSingleData_DirectionPrefixSuffix'
                                                                                                                                                                                                                                                                                    upUrl='DirectionPrefixSuffix/UpdateDirectionPrefixSuffix'
                                                                                                                                                                                                                                                                                    delUrl='DirectionPrefixSuffix/DeleteDirectionPrefixSuffix'
                                                                                                                                                                                                                                                                                  />
                                                                                                                                                                                                                                                                                  :
                                                                                                                                                                                                                                                                                  openPage === 'Type Suffix' ?
                                                                                                                                                                                                                                                                                    <ListTableCom
                                                                                                                                                                                                                                                                                      {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                      col1='SuffixCode' col2='Description' col3='TypeSuffixID'
                                                                                                                                                                                                                                                                                      getUrl='TypeSuffix/GetData_TypeSuffix'
                                                                                                                                                                                                                                                                                      addUrl='TypeSuffix/InsertTypeSuffix'
                                                                                                                                                                                                                                                                                      singleDataUrl='TypeSuffix/GetSingleData_TypeSuffix'
                                                                                                                                                                                                                                                                                      upUrl='TypeSuffix/UpdateTypeSuffix'
                                                                                                                                                                                                                                                                                      delUrl='TypeSuffix/DeleteTypeSuffix'
                                                                                                                                                                                                                                                                                    />
                                                                                                                                                                                                                                                                                    :
                                                                                                                                                                                                                                                                                    openPage === 'Class Type' ?
                                                                                                                                                                                                                                                                                      <ListTableCom
                                                                                                                                                                                                                                                                                        {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                        col1='ClassTypeCode' col2='Description' col3='ClassTypeID'
                                                                                                                                                                                                                                                                                        getUrl='ClassType/GetData_ClassType'
                                                                                                                                                                                                                                                                                        addUrl='ClassType/InsertClassType'
                                                                                                                                                                                                                                                                                        singleDataUrl='ClassType/GetSingleData_ClassType'
                                                                                                                                                                                                                                                                                        upUrl='ClassType/UpdateClassType'
                                                                                                                                                                                                                                                                                        delUrl='ClassType/DeleteClassType'
                                                                                                                                                                                                                                                                                      />
                                                                                                                                                                                                                                                                                      :
                                                                                                                                                                                                                                                                                      openPage === 'Property Source Drug Type' ?
                                                                                                                                                                                                                                                                                        <ListTableCom
                                                                                                                                                                                                                                                                                          {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                          col1='SourceDrugTypeCode' col2='Description' col3='SourceDrugTypeID'
                                                                                                                                                                                                                                                                                          getUrl='PropertySourceDrugType/GetData_PropertySourceDrugType'
                                                                                                                                                                                                                                                                                          addUrl='PropertySourceDrugType/InsertPropertySourceDrugType'
                                                                                                                                                                                                                                                                                          singleDataUrl='PropertySourceDrugType/GetSingleData_PropertySourceDrugType'
                                                                                                                                                                                                                                                                                          upUrl='PropertySourceDrugType/UpdatePropertySourceDrugType'
                                                                                                                                                                                                                                                                                          delUrl='PropertySourceDrugType/DeletePropertySourceDrugType'
                                                                                                                                                                                                                                                                                        />
                                                                                                                                                                                                                                                                                        :
                                                                                                                                                                                                                                                                                        openPage === 'Warrant Type' ?
                                                                                                                                                                                                                                                                                          <ListTableCom
                                                                                                                                                                                                                                                                                            {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                            col1='WarrantTypeCode' col2='Description' col3='WarrantTypeID'
                                                                                                                                                                                                                                                                                            getUrl='WarrantType/GetData_WarrantType'
                                                                                                                                                                                                                                                                                            addUrl='WarrantType/InsertWarrantType'
                                                                                                                                                                                                                                                                                            singleDataUrl='WarrantType/GetSingleData_WarrantType'
                                                                                                                                                                                                                                                                                            upUrl='WarrantType/UpdateWarrantType'
                                                                                                                                                                                                                                                                                            delUrl='WarrantType/DeleteWarrantType'
                                                                                                                                                                                                                                                                                          />
                                                                                                                                                                                                                                                                                          :
                                                                                                                                                                                                                                                                                          openPage === 'Warrant Status' ?
                                                                                                                                                                                                                                                                                            <ListTableCom
                                                                                                                                                                                                                                                                                              {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                              col1='WarrantStatusCode' col2='Description' col3='WarrantStatusID'
                                                                                                                                                                                                                                                                                              getUrl='WarrantStatus/GetData_WarrantStatus'
                                                                                                                                                                                                                                                                                              addUrl='WarrantStatus/InsertWarrantStatus'
                                                                                                                                                                                                                                                                                              singleDataUrl='WarrantStatus/GetSingleData_WarrantStatus'
                                                                                                                                                                                                                                                                                              upUrl='WarrantStatus/UpdateWarrantStatus'
                                                                                                                                                                                                                                                                                              delUrl='WarrantStatus/DeleteWarrantStatus'
                                                                                                                                                                                                                                                                                            />
                                                                                                                                                                                                                                                                                            :
                                                                                                                                                                                                                                                                                            openPage === 'Warrant Classification' ?
                                                                                                                                                                                                                                                                                              <ListTableCom
                                                                                                                                                                                                                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                                col1='WarrantClassificationCode' col2='Description' col3='WarrantClassificationID'
                                                                                                                                                                                                                                                                                                getUrl='WarrantClassification/GetData_WarrantClassification'
                                                                                                                                                                                                                                                                                                addUrl='WarrantClassification/InsertWarrantClassification'
                                                                                                                                                                                                                                                                                                singleDataUrl='WarrantClassification/GetSingleData_WarrantClassification'
                                                                                                                                                                                                                                                                                                upUrl='WarrantClassification/UpdateWarrantClassification'
                                                                                                                                                                                                                                                                                                delUrl='WarrantClassification/DeleteWarrantClassification'
                                                                                                                                                                                                                                                                                              />
                                                                                                                                                                                                                                                                                              :
                                                                                                                                                                                                                                                                                              openPage === 'Bail Type' ?
                                                                                                                                                                                                                                                                                                <ListTableCom
                                                                                                                                                                                                                                                                                                  {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                                  col1='BailTypeCode' col2='Description' col3='BailTypeID'
                                                                                                                                                                                                                                                                                                  getUrl='BailType/GetData_BailType'
                                                                                                                                                                                                                                                                                                  addUrl='BailType/InsertBailType'
                                                                                                                                                                                                                                                                                                  singleDataUrl='BailType/GetSingleData_BailType'
                                                                                                                                                                                                                                                                                                  upUrl='BailType/UpdateBailType'
                                                                                                                                                                                                                                                                                                  delUrl='BailType/DeleteBailType'
                                                                                                                                                                                                                                                                                                />
                                                                                                                                                                                                                                                                                                :
                                                                                                                                                                                                                                                                                                openPage === 'Type of Drug Manufactured' ?
                                                                                                                                                                                                                                                                                                  <ListTableCom
                                                                                                                                                                                                                                                                                                    {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                                    col1='DrugManufacturedCode' col2='Description' col3='DrugManufacturedID'
                                                                                                                                                                                                                                                                                                    getUrl='DrugManufactured/GetData_DrugManufactured'
                                                                                                                                                                                                                                                                                                    addUrl='DrugManufactured/InsertDrugManufactured'
                                                                                                                                                                                                                                                                                                    singleDataUrl='DrugManufactured/GetSingleData_DrugManufactured'
                                                                                                                                                                                                                                                                                                    upUrl='DrugManufactured/UpdateDrugManufactured'
                                                                                                                                                                                                                                                                                                    delUrl='DrugManufactured/DeleteDrugManufactured'
                                                                                                                                                                                                                                                                                                  />
                                                                                                                                                                                                                                                                                                  :
                                                                                                                                                                                                                                                                                                  openPage === 'Type Marijuana Fields and Gardens' ?
                                                                                                                                                                                                                                                                                                    <ListTableCom
                                                                                                                                                                                                                                                                                                      {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                                      col1='MarijuanaTypeCode' col2='Description' col3='MarijuanaTypeID'
                                                                                                                                                                                                                                                                                                      getUrl='MarijuanaType/GetData_MarijuanaType'
                                                                                                                                                                                                                                                                                                      addUrl='MarijuanaType/InsertMarijuanaType'
                                                                                                                                                                                                                                                                                                      singleDataUrl='MarijuanaType/GetSingleData_MarijuanaType'
                                                                                                                                                                                                                                                                                                      upUrl='MarijuanaType/UpdateMarijuanaType'
                                                                                                                                                                                                                                                                                                      delUrl='MarijuanaType/DeleteMarijuanaType'
                                                                                                                                                                                                                                                                                                    />
                                                                                                                                                                                                                                                                                                    :

                                                                                                                                                                                                                                                                                                    //----------------dd---------------------//
                                                                                                                                                                                                                                                                                                    openPage === 'Charge Code' ?
                                                                                                                                                                                                                                                                                                      <ChargeCode
                                                                                                                                                                                                                                                                                                      />
                                                                                                                                                                                                                                                                                                      :
                                                                                                                                                                                                                                                                                                      openPage === 'Warrant ORI' ?
                                                                                                                                                                                                                                                                                                        <WarrantORI />
                                                                                                                                                                                                                                                                                                        :
                                                                                                                                                                                                                                                                                                        openPage === 'SMT Location' ?
                                                                                                                                                                                                                                                                                                          <SMTLocation
                                                                                                                                                                                                                                                                                                            {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                                            col1='SMTLocationCode' col2='Description' col3='SMTLocationID'
                                                                                                                                                                                                                                                                                                            getUrl='SMTLocations/GetData_SMTLocations'
                                                                                                                                                                                                                                                                                                            addUrl='SMTLocations/InsertSMTLocations'
                                                                                                                                                                                                                                                                                                            singleDataUrl='SMTLocations/GetSingleData_SMTLocations'
                                                                                                                                                                                                                                                                                                            upUrl='SMTLocations/UpdateSMTLocations'
                                                                                                                                                                                                                                                                                                            delUrl='SMTLocations/DeleteSMTLocations'
                                                                                                                                                                                                                                                                                                          />
                                                                                                                                                                                                                                                                                                          :
                                                                                                                                                                                                                                                                                                          openPage === 'Property Vehicle Make' ?
                                                                                                                                                                                                                                                                                                            <PropertyVehicleMake
                                                                                                                                                                                                                                                                                                              {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                                              col1='PropertyVehicleMakeCode' col2='Description' col3='PropertyVehicleMakeID'
                                                                                                                                                                                                                                                                                                              getUrl='PropertyVehicleMake/GetData_PropertyVehicleMake'
                                                                                                                                                                                                                                                                                                              addUrl='PropertyVehicleMake/InsertPropertyVehicleMake'
                                                                                                                                                                                                                                                                                                              singleDataUrl='PropertyVehicleMake/GetSingleData_PropertyVehicleMake'
                                                                                                                                                                                                                                                                                                              upUrl='PropertyVehicleMake/UpdatePropertyVehicleMake'
                                                                                                                                                                                                                                                                                                              delUrl='PropertyVehicleMake/DeletePropertyVehicleMake'
                                                                                                                                                                                                                                                                                                            />
                                                                                                                                                                                                                                                                                                            :
                                                                                                                                                                                                                                                                                                            // openPage === 'Property Vehicle Make' ?
                                                                                                                                                                                                                                                                                                            // <PropertyVehicleMake 
                                                                                                                                                                                                                                                                                                            // {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                                            // col1='PropertyVehicleMakeCode' col2='Description' col3='PropertyVehicleMakeID'
                                                                                                                                                                                                                                                                                                            // getUrl='PropertyVehicleMake/GetData_PropertyVehicleMake'
                                                                                                                                                                                                                                                                                                            // addUrl='PropertyVehicleMake/InsertPropertyVehicleMake'
                                                                                                                                                                                                                                                                                                            // singleDataUrl='PropertyVehicleMake/GetSingleData_PropertyVehicleMake'
                                                                                                                                                                                                                                                                                                            // upUrl='PropertyVehicleMake/UpdatePropertyVehicleMake'
                                                                                                                                                                                                                                                                                                            // delUrl='PropertyVehicleMake/DeletePropertyVehicleMake'
                                                                                                                                                                                                                                                                                                            // />
                                                                                                                                                                                                                                                                                                            // :

                                                                                                                                                                                                                                                                                                            openPage === 'Property Classification' ?
                                                                                                                                                                                                                                                                                                              <PropertyClassification
                                                                                                                                                                                                                                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                                                col1='PropertyClassificationCode' col2='Description' col3='PropertyClassificationID'
                                                                                                                                                                                                                                                                                                                getUrl='PropertyClassification/GetData_PropertyClassification'
                                                                                                                                                                                                                                                                                                                addUrl='PropertyClassification/InsertPropertyClassification'
                                                                                                                                                                                                                                                                                                                singleDataUrl='PropertyClassification/GetSingleData_PropertyClassification'
                                                                                                                                                                                                                                                                                                                upUrl='PropertyClassification/UpdatePropertyClassification'
                                                                                                                                                                                                                                                                                                                delUrl='PropertyClassification/DeletePropertyClassification'
                                                                                                                                                                                                                                                                                                              />
                                                                                                                                                                                                                                                                                                              :
                                                                                                                                                                                                                                                                                                              openPage === 'Warrant Disposition' ?
                                                                                                                                                                                                                                                                                                              <ListTableCom
                                                                                                                                                                                                                                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                                                col1='WarrantDispositionsCode' col2='Description' col3='WarrantDispositionsID'
                                                                                                                                                                                                                                                                                                                getUrl='WarrantDispositions/GetData_WarrantDispositions'
                                                                                                                                                                                                                                                                                                                addUrl='WarrantDispositions/InsertWarrantDispositions'
                                                                                                                                                                                                                                                                                                                singleDataUrl='WarrantDispositions/GetSingleData_WarrantDispositions'
                                                                                                                                                                                                                                                                                                                upUrl='WarrantDispositions/UpdateWarrantDispositions'
                                                                                                                                                                                                                                                                                                                delUrl='WarrantDispositions/DeleteWarrantDispositions'
                                                                                                                                                                                                                                                                                                              />
                                                                                                                                                                                                                                                                                                              :
                                                                                                                                                                                                                                                                                                              openPage === 'Pawn Shop' ?
                                                                                                                                                                                                                                                                                                              <ListTableCom
                                                                                                                                                                                                                                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                                                col1='PawnShopCode' col2='Description' col3='PawnShopID'
                                                                                                                                                                                                                                                                                                                getUrl='PawnShop/GetData_PawnShop'
                                                                                                                                                                                                                                                                                                                addUrl='PawnShop/InsertPawnShop'
                                                                                                                                                                                                                                                                                                                singleDataUrl='PawnShop/GetSingleData_PawnShop'
                                                                                                                                                                                                                                                                                                                upUrl='PawnShop/UpdatePawnShop'
                                                                                                                                                                                                                                                                                                                delUrl='PawnShop/DeletePawnShop'
                                                                                                                                                                                                                                                                                                              />
                                                                                                                                                                                                                                                                                                              :
                                                                                                                                                                                                                                                                                                              openPage === 'Pawn Status' ?
                                                                                                                                                                                                                                                                                                              <ListTableCom
                                                                                                                                                                                                                                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                                                col1='PawnStatusCode' col2='Description' col3='PawnStatusID'
                                                                                                                                                                                                                                                                                                                getUrl='PawnStatus/GetData_PawnStatus'
                                                                                                                                                                                                                                                                                                                addUrl='PawnStatus/InsertPawnStatus'
                                                                                                                                                                                                                                                                                                                singleDataUrl='PawnStatus/GetSingleData_PawnStatus'
                                                                                                                                                                                                                                                                                                                upUrl='PawnStatus/UpdatePawnStatus'
                                                                                                                                                                                                                                                                                                                delUrl='PawnStatus/DeletePawnStatus'
                                                                                                                                                                                                                                                                                                              />
                                                                                                                                                                                                                                                                                                              :
                                                                                                                                                                                                                                                                                                              openPage === 'Transaction Type' ?
                                                                                                                                                                                                                                                                                                              <ListTableCom
                                                                                                                                                                                                                                                                                                                {...{ openPage }} col4='IsEditable'
                                                                                                                                                                                                                                                                                                                col1='TransactionTypeCode' col2='Description' col3='TransactionTypeID'
                                                                                                                                                                                                                                                                                                                getUrl='TransactionType/GetData_TransactionType'
                                                                                                                                                                                                                                                                                                                addUrl='TransactionType/InsertTransactionType'
                                                                                                                                                                                                                                                                                                                singleDataUrl='TransactionType/GetSingleData_TransactionType'
                                                                                                                                                                                                                                                                                                                upUrl='TransactionType/UpdateTransactionType'
                                                                                                                                                                                                                                                                                                                delUrl='TransactionType/DeleteTransactionType'
                                                                                                                                                                                                                                                                                                              />
                                                                                                                                                                                                                                                                                                              :
                                                                                                                                                                                                                                                                                                              <p className='text-center' style={{ color: 'rgb(39, 76, 119)' }}>
                                                                                                                                                                                                                                                                                                                <h5 className='mt-2'>
                                                                                                                                                                                                                                                                                                                  <i className='fa fa-arrow-left'></i>
                                                                                                                                                                                                                                                                                                                  <span className='p-2'>Select Table From Left Console</span>
                                                                                                                                                                                                                                                                                                                </h5>
                                                                                                                                                                                                                                                                                                              </p>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ListManagement