import { toastifyError } from "../../../Common/AlertMsg";

export const PinValidator = (PIN) => {
	if (PIN === '' || PIN === null) {
		return 'Required *';
	} else if (PIN.match(`(?:11|33|22|44|55|66|77|88|99|112233|123456|123|1234|12345|67890|7890|890)`)) {
		return 'Please enter a valid code (eg:895471)';
	} else if (PIN.match(`(^[0-9]{6}$)`)) {
		return 'true'
	}
	else {
		return 'Please enter a valid code (eg:895471)';
	}
};

export const HeightComparision = (HeightFrom, HeightTo) => {
	// console.log(HeightFrom)
	// console.log(HeightTo)
	if (HeightFrom || HeightTo) {
		if (HeightFrom.length >= 5 && HeightTo.length >= 5) {
			if (parseFloat(HeightFrom) > parseFloat(HeightTo)) {
				toastifyError('HeightTo is not less then HeightFrom')
				// return 'HeightTo is not less then HeightFrom *';
			} else {
				return 'true';
			}
		} else {
			toastifyError('Invalid Format *');
		}
	} else {
		return 'true';
	}
};

export const Comparision = (ValueFrom, ValueTo, Name) => {
	// console.log('ValueFrom', ValueFrom);
	// console.log('ValueTo', ValueTo);
	if (ValueFrom || ValueTo) {
		// if (parseFloat(ValueFrom) >= parseFloat(ValueTo)) {
		if (parseFloat(ValueFrom) > parseFloat(ValueTo)) {
			toastifyError(`${Name}To not less then ${Name}From`);
			return (`${Name}To not less then ${Name}From`)
		}
		else {
			// alert("The second number is larger");
			return 'true'
		}
	} else {
		return 'true'
	}
}


export const RequiredField = (field) => {
	if (field.trim() === '' || field.trim() === null) {
		return 'Required *';
	} else if (field.match(/^\S.*[a-zA-Z\s]*$/)) {
		return 'true';
	} else {
		return 'Space Not Allow';
	}
};

export const RequiredFieldSelectBox = (field) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else {
		return 'true';
	}
};

export const PasswordField = (passwordSettingVal, field, UserName) => {
	if (field === '' || field === null) {
		return 'true'
	} else if (field === UserName) {
		return "Password can't be same as Login UserID"
	}
	else {
		const val = field
		let Color1
		// const passwordSettingVal = JSON.parse(localStorage.getItem('data'))
		if (val?.length >= passwordSettingVal?.MinPasswordLength && val.match(`(?=(.*[A-Z]){${passwordSettingVal?.MinUpperCaseInPassword}})`) && val.match(`(?=(.*[a-z]){${passwordSettingVal?.MinLowerCaseInPassword}})`) && val.match(`(?=(.*[0-9]){${passwordSettingVal?.MinNumericDigitsInPassword}})`) && val.match(`(?=(.*[-\#\$\.\%\&\@\*]){${passwordSettingVal?.MinSpecialCharsInPassword}})`)) {
			if (val.match(/^\S.*[a-zA-Z\s]*$/)) {
				Color1 = 'true'
			} else {
				Color1 = 'false'
			}
		} else {
			Color1 = 'false'
		}
		return Color1
	}
};

export const ReEnterPasswordVal = (password, confirmPass) => {
	if (password === '' || password === null && confirmPass === '' || confirmPass === null) {
		return 'true';
	} else if (password === confirmPass) {
		return 'true';
	} else {
		return "password doesn't match"
	}
}

export const PhoneField = (field) => {
	if (field === '' || field === null) {
		return 'true';
	} else if (field.length === 12) {
		return 'true'
	} else {
		return 'Please enter a valid Phone number (eg: 876-987-8940)';
	}
}

export const CellPhoneField = (field) => {
	if (field === '' || field === null) {
		return 'Required *';
	} else if (field.length === 12) {
		return 'true'
	} else {
		return 'Please enter a valid Phone number (eg: 876-987-8940)';
	}
}

export const WorkPhone_Ext_Field = (field) => {
	if (field === '' || field === null) {
		return 'true';
	} else if (String(field).match(`(^[0-9]{3}$)`)) {
		return 'true';
	} else {
		return 'Please enter a valid Ext. (eg: 876)';
	}
}

export const SSN_Field = (field) => {
	if (field === '' || field === null) {
		return 'true';
	} else if (field.length === 11) {
		return 'true'
	} else {
		return 'Please enter a valid SSN number (eg: 876-97-8940)'
	}
}

export const Deactivate_Date_Field = (DeactivateDate, HiredDate) => {
	console.log((new Date(DeactivateDate).getTime() >= new Date(HiredDate).getTime()))
	if (DeactivateDate === '' || DeactivateDate === null) {
		return 'true';
	} else if (new Date(DeactivateDate).getTime() >= new Date(HiredDate).getTime()) {
		return 'true'
	} else {
		return 'Date not valid'
	}
}

export const Deceased_Date_Field = (DeceasedDate, HiredDate) => {
	if (DeceasedDate === '' || DeceasedDate === null) {
		return 'true';
	} else if (new Date(DeceasedDate).getTime() >= new Date(HiredDate).getTime()) {
		return 'true'
	} else {
		return 'Date not valid'
	}
}

// /^\S.*[a-zA-Z\s]*$/

export const Email_Field = (email) => {
	if (email.trim() === '' || email.trim() === null) {
		return 'true';
	} else if (email.toLowerCase().match(
		/^\S.*(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))*$/
	)) {
		return 'true'
	} else {
		return 'Email not valid'
	}
}





