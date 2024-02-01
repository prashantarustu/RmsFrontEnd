import { useContext } from "react";
import { AgencyContext } from "../../../../Context/Agency/Index";

export const ORIValidator = (ORI) => {
	if (ORI.trim() === '' || ORI.trim() === null) {
		return 'Required *';
	}
	if (ORI.toUpperCase().match(`(^[A-Z]{2})([0-9]{5})([0]{2}$)`)) {
		return 'true';
	} else {
		return 'Please enter a valid format (eg: WV0034500)';
	}
};

export const RequiredFieldWithoutTrim = (field) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else {
		return 'true'
	}
};

export const RequiredField = (field) => {
	if (field === '' || field === null) {
		return 'Required *';
	}
	else {
		return 'true'
	}
};

export const RequiredFieldSpaceNotAllow = (field) => {
	if (!field || field === null || field === "Invalid date") {
		return 'Required *';
	} else if (field.match(/^\S.*[a-zA-Z\s]*$/)) {
		return 'true';
	} else {
		return 'Space Not Allow';
	}
};

export const PhoneField = (field) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field.length === 12) {
		return 'true'
	} else {
		return 'Please enter a valid Phone number [876-987-8940]'
	}

};

export const FaxField = (field) => {
	if (field === '' || field === null) {
		return 'true';
	} else if (field.length === 12) {
		return 'true'
	} else {
		return 'Please enter a valid Fax number [876-987-8940]'
	}
};

export const MunicipalityCodeValidator = (MunicipalityCode) => {
	if (MunicipalityCode === '' || MunicipalityCode === null) {
		return 'Required *';
	} if (MunicipalityCode.match(`(^[0-9]{4}$)`)) {
		return 'true';
	} else {
		return 'Please enter a valid Municipality code';
	}
};


// Password Setting
export const Max_Password_Age = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field > checkField[0]?.MaxPasswordAge) {
		return "Max Valid for 90 days"
	} else if (field < 1) {
		return "Max Valid for 90 days"
	} else {
		return "true"
	}
};

export const Min_Password_Length = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field < checkField[0]?.MinPasswordLength) {
		return "Min Length 8"
	} else {
		return "true"
	}
};

export const Max_Login_Attempts = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field > checkField[0]?.MaxLoginAttempts) {
		return "Max Login Attempts " + checkField[0]?.MaxLoginAttempts
	} else if (field < 1) {
		return "Max Login Attempts " + checkField[0]?.MaxLoginAttempts
	} else {
		return "true"
	}
};

export const Min_LowerCase_InPassword = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field < checkField[0]?.MinLowerCaseInPassword) {
		return "Min Lowercase Char " + checkField[0]?.MinLowerCaseInPassword
	} else {
		return "true"
	}
};

export const Min_NumericDigits_InPassword = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field < checkField[0]?.MinNumericDigitsInPassword) {
		return "Min Numeric Digit " + checkField[0]?.MinNumericDigitsInPassword
	} else {
		return "true"
	}
};

export const Min_SpecialChars_InPassword = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field < checkField[0]?.MinSpecialCharsInPassword) {
		return "Min Special Char " + checkField[0]?.MinSpecialCharsInPassword
	} else {
		return "true"
	}
};

export const Min_UpperCase_InPassword = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field < checkField[0]?.MinUpperCaseInPassword) {
		return "Min Uppercase Char " + checkField[0]?.MinUpperCaseInPassword
	} else {
		return "true"
	}
};

export const Password_Hist_UniquenessDepth = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field > checkField[0]?.PasswordHistUniquenessDepth) {
		return "Max Uniqueness Depth " + checkField[0]?.PasswordHistUniquenessDepth
	} else if (field < 1) {
		return "Max Uniqueness Depth " + checkField[0]?.PasswordHistUniquenessDepth
	} else {
		return "true"
	}
};
export const Password_MessageDays = (field, checkField) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field > checkField[0]?.PasswordMessageDays) {
		return "Max Message Days " + checkField[0]?.PasswordMessageDays
	} else if (field < 1) {
		return "Max Message Days " + checkField[0]?.PasswordMessageDays
	} else {
		return "true"
	}
};


export const Email_Field = (email) => {
	if (email === '' || email === null) {
		return 'true';
	} else if (email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
		return 'true'
	} else {
		return 'Email not valid'
	}

};

export const Email_Field_Contact = (email) => {
	if (email === '' || email === null) {
		return 'Required *';
	}
	else if (email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
		return 'true'
	} else {
		return 'Email not valid';
	}
}

export const PhoneFieldNotReq = (field) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field.length === 12) {
		return 'true'
	} else {
		return 'Please enter a valid Phone number (eg: 876-987-8940)';
	}
}

//  Agency field Permission

// export const check_field_Permission_OnChange = (status, agencyEditVal, fieldPermisionAgency) => {
// 	const data = []
// 	if (fieldPermisionAgency?.Agency_Fax[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Fax[0]?.AddOK === 0 && status) {
// 		data[ 'Agency_Fax'] = false
// 	} else if (fieldPermisionAgency?.Agency_Fax[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Fax[0]?.AddOK === 1 && agencyEditVal?.Agency_Fax === '' && status) {
// 		data[ 'Agency_Fax'] = true
// 	} else if (fieldPermisionAgency?.Agency_Fax[0]?.AddOK === 1 && !status) {
// 		data[ 'Agency_Fax'] = true
// 	} else if (fieldPermisionAgency?.Agency_Fax[0]?.Changeok === 1 && status) {
// 		data[ 'Agency_Fax'] = true
// 	} else {
// 		data[ 'Agency_Fax'] = false
// 	}

// 	if (fieldPermisionAgency?.ORI[0]?.Changeok === 0 && fieldPermisionAgency?.ORI[0]?.AddOK === 0 && status) {
// 		data[ 'ORI'] = false
// 	} else if (fieldPermisionAgency?.ORI[0]?.Changeok === 0 && fieldPermisionAgency?.ORI[0]?.AddOK === 1 && agencyEditVal?.ORI === '' && status) {
// 		data[ 'ORI'] = true
// 	} else if (fieldPermisionAgency?.ORI[0]?.AddOK === 1 && !status) {
// 		data[ 'ORI'] = true
// 	} else if (fieldPermisionAgency?.ORI[0]?.Changeok === 1 && status) {
// 		data[ 'ORI'] = true
// 	} else {
// 		data[ 'ORI'] = false
// 	}

// 	if (fieldPermisionAgency?.MunicipalityCode[0]?.Changeok === 0 && fieldPermisionAgency?.MunicipalityCode[0]?.AddOK === 0 && status) {
// 		data[ 'MunicipalityCode'] = false
// 	} else if (fieldPermisionAgency?.MunicipalityCode[0]?.Changeok === 0 && fieldPermisionAgency?.MunicipalityCode[0]?.AddOK === 1 && agencyEditVal?.MunicipalityCode === '' && status) {
// 		data[ 'MunicipalityCode'] = true
// 	} else if (fieldPermisionAgency?.MunicipalityCode[0]?.AddOK === 1 && !status) {
// 		data[ 'MunicipalityCode'] = true
// 	} else if (fieldPermisionAgency?.MunicipalityCode[0]?.Changeok === 1 && status) {
// 		data[ 'MunicipalityCode'] = true
// 	} else {
// 		data[ 'MunicipalityCode'] = false
// 	}

// 	if (fieldPermisionAgency?.Agency_Name[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Name[0]?.AddOK === 0 && status) {
// 		data[ 'Agency_Name'] = false
// 	} else if (fieldPermisionAgency?.Agency_Name[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Name[0]?.AddOK === 1 && agencyEditVal?.Agency_Name === '' && status) {
// 		data[ 'Agency_Name'] = true
// 	} else if (fieldPermisionAgency?.Agency_Name[0]?.AddOK === 1 && !status) {
// 		data[ 'Agency_Name'] = true
// 	} else if (fieldPermisionAgency?.Agency_Name[0]?.Changeok === 1 && status) {
// 		data[ 'Agency_Name'] = true
// 	} else {
// 		data[ 'Agency_Name'] = false
// 	}

// 	if (fieldPermisionAgency?.ShortName[0]?.Changeok === 0 && fieldPermisionAgency?.ShortName[0]?.AddOK === 0 && status) {
// 		data[ 'ShortName'] = false
// 	} else if (fieldPermisionAgency?.ShortName[0]?.Changeok === 0 && fieldPermisionAgency?.ShortName[0]?.AddOK === 1 && agencyEditVal?.ShortName === '' && status) {
// 		data[ 'ShortName'] = true
// 	} else if (fieldPermisionAgency?.ShortName[0]?.AddOK === 1 && !status) {
// 		data[ 'ShortName'] = true
// 	} else if (fieldPermisionAgency?.ShortName[0]?.Changeok === 1 && status) {
// 		data[ 'ShortName'] = true
// 	} else {
// 		data[ 'ShortName'] = false
// 	}

// 	if (fieldPermisionAgency?.Agency_Address1[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Address1[0]?.AddOK === 0 && status) {
// 		data[ 'Agency_Address1'] = false
// 	} else if (fieldPermisionAgency?.Agency_Address1[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Address1[0]?.AddOK === 1 && agencyEditVal?.Agency_Address1 === '' && status) {
// 		data[ 'Agency_Address1'] = true
// 	} else if (fieldPermisionAgency?.Agency_Address1[0]?.AddOK === 1 && !status) {
// 		data[ 'Agency_Address1'] = true
// 	} else if (fieldPermisionAgency?.Agency_Address1[0]?.Changeok === 1 && status) {
// 		data[ 'Agency_Address1'] = true
// 	} else {
// 		data[ 'Agency_Address1'] = false
// 	}

// 	if (fieldPermisionAgency?.Agency_StateId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_StateId[0]?.AddOK === 0 && status) {
// 		data[ 'Agency_StateId'] = false
// 	} else if (fieldPermisionAgency?.Agency_StateId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_StateId[0]?.AddOK === 1 && agencyEditVal?.Agency_StateId === '' && status) {
// 		data[ 'Agency_StateId'] = true
// 	} else if (fieldPermisionAgency?.Agency_StateId[0]?.AddOK === 1 && !status) {
// 		data[ 'Agency_StateId'] = true
// 	} else if (fieldPermisionAgency?.Agency_StateId[0]?.Changeok === 1 && status) {
// 		data[ 'Agency_StateId'] = true
// 	} else {
// 		data[ 'Agency_StateId'] = false
// 	}

// 	if (fieldPermisionAgency?.Agency_CityId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_CityId[0]?.AddOK === 0 && status) {
// 		data[ 'Agency_CityId'] = false
// 	} else if (fieldPermisionAgency?.Agency_CityId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_CityId[0]?.AddOK === 1 && agencyEditVal?.Agency_CityId === '' && status) {
// 		data[ 'Agency_CityId'] = true
// 	} else if (fieldPermisionAgency?.Agency_CityId[0]?.AddOK === 1 && !status) {
// 		data[ 'Agency_CityId'] = true
// 	} else if (fieldPermisionAgency?.Agency_CityId[0]?.Changeok === 1 && status) {
// 		data[ 'Agency_CityId'] = true
// 	} else {
// 		data[ 'Agency_CityId'] = false
// 	}

// 	if (fieldPermisionAgency?.Agency_Phone[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Phone[0]?.AddOK === 0 && status) {
// 		data[ 'Agency_Phone'] = false
// 	} else if (fieldPermisionAgency?.Agency_Phone[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_Phone[0]?.AddOK === 1 && agencyEditVal?.Agency_Phone === '' && status) {
// 		data[ 'Agency_Phone'] = true
// 	} else if (fieldPermisionAgency?.Agency_Phone[0]?.AddOK === 1 && !status) {
// 		data[ 'Agency_Phone'] = true
// 	} else if (fieldPermisionAgency?.Agency_Phone[0]?.Changeok === 1 && status) {
// 		data[ 'Agency_Phone'] = true
// 	} else {
// 		data[ 'Agency_Phone'] = false
// 	}

// 	if (fieldPermisionAgency?.Agency_ZipId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_ZipId[0]?.AddOK === 0 && status) {
// 		data[ 'Agency_ZipId'] = false
// 	} else if (fieldPermisionAgency?.Agency_ZipId[0]?.Changeok === 0 && fieldPermisionAgency?.Agency_ZipId[0]?.AddOK === 1 && agencyEditVal?.Agency_ZipId === '' && status) {
// 		data[ 'Agency_ZipId'] = true
// 	} else if (fieldPermisionAgency?.Agency_ZipId[0]?.AddOK === 1 && !status) {
// 		data[ 'Agency_ZipId'] = true
// 	} else if (fieldPermisionAgency?.Agency_ZipId[0]?.Changeok === 1 && status) {
// 		data[ 'Agency_ZipId'] = true
// 	} else {
// 		data[ 'Agency_ZipId'] = false
// 	}
// 	return data
// }

// onChange={
// 	fieldPermisionAgency?.ORI[0]?.Changeok === 0 && fieldPermisionAgency?.ORI[0]?.AddOK === 0 && status ? '' : fieldPermisionAgency?.ORI[0]?.Changeok === 0 && fieldPermisionAgency?.ORI[0]?.AddOK === 1 && agencyEditVal?.ORI === '' && status ? handleChange : fieldPermisionAgency?.ORI[0]?.AddOK === 1 && !status ? handleChange : fieldPermisionAgency?.ORI[0]?.Changeok === 1 && status ? handleChange : ''
// }
// readOnly={
// 	fieldPermisionAgency?.ORI[0]?.Changeok === 0 && fieldPermisionAgency?.ORI[0]?.AddOK === 0 && status ? true : fieldPermisionAgency?.ORI[0]?.Changeok === 0 && fieldPermisionAgency?.ORI[0]?.AddOK === 1 && agencyEditVal?.ORI === '' && status ? false : fieldPermisionAgency?.ORI[0]?.AddOK === 1 && !status ? false : fieldPermisionAgency?.ORI[0]?.Changeok === 1 && status ? false : true
// }


