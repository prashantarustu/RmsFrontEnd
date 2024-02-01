export const OffenderUseError_N = '{207} Mutually exclusive values for offenderusing';
export const OffenderUseError_Other = '{204} Offender Using must be A,C,D or N';
export const BiasError = '{204} Biascode invalid';
export const LocationError = '{257} Number Of Premises Must be present Only with an offense code of 220 and a location type of 14 or 19';
export const WeaponError = '{207} Mutually exclusive values for Weapon Code';
export const MethodEntryError = '{204} Method of Entry is invalid';
export const MethodEntryError2 = '{253} Method of Entry Must be present when offense code is 220';
 
export const ErrorTooltip = ({ Error }) => (<span className='hovertext' style={{ marginLeft: '15px' }} data-hover={Error} ><i className='fa fa-exclamation-circle'></i></span>);

export const ErrorShow = ({ Error }) => (<span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{Error}</span>);

export const ErrorStyleNIBRS = (code) => {
    const colour_Styles_NIBRS = { control: (styles) => ({ ...styles, backgroundColor: code === '09C' ? "rgb(255 202 194)" : "#fce9bf", height: 20, minHeight: 30, fontSize: 14, margintop: 2, boxShadow: 0, }), };
    return colour_Styles_NIBRS;
};

export const ErrorStyleOffenderUse = (data) => {
    const res = data?.filter((obj) => {
        if (obj.code === 'N') return 'N'
        else if (obj.code === 'A' || obj.code === 'C' || obj.code === 'D') { }
        else return "Not"
    })
    return res[0]?.code;
};

export const ErrorStyleBias = (data) => {
    var arr = []
    const res = data?.map((obj) => {
        if (obj.code === "11" || obj.code === "12" || obj.code === "13" || obj.code === "14" || obj.code === "15" || obj.code === "21" || obj.code === "22" || obj.code === "23" || obj.code === "24" || obj.code === "25" || obj.code === "26" || obj.code === "27" || obj.code === "32" || obj.code === "33" || obj.code === "41" || obj.code === "42" || obj.code === "43" || obj.code === "44" || obj.code === "45" || obj.code === "51" || obj.code === "52" || obj.code === "88" || obj.code === "99") {
        } else arr.push({ code: 'N' })
    })
    if (arr.length > 0) return 'N'
    else return 'y';
};

export const ErrorStyleLocation = (code, nibrsCode, premisesentered) => {
    const colour_Styles = { control: (styles) => ({ ...styles, backgroundColor: (code === '14' || code === '19') && nibrsCode === '220' && premisesentered == '0' ? "rgb(255 202 194)" : '', height: 20, minHeight: 30, fontSize: 14, margintop: 2, boxShadow: 0, }), };
    return colour_Styles;
};

export const ErrorStyleWeapon = (code) => {
    const colour_Styles = { control: (styles) => ({ ...styles, backgroundColor: code === '99' ? "rgb(255 202 194)" : '#fce9bf', height: 20, minHeight: 30, fontSize: 14, margintop: 2, boxShadow: 0, }), };
    return colour_Styles;
};