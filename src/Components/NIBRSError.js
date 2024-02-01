//-------------- Name--------------
export const NameTypeError = '{401} Victim Type must be present - Mandatory field';
export const NameSexError = '{404} Invalid Sex Code ';
export const NameRaceError = '{404} Invalid Race Code ';
export const NameEthnicityError = '{404} Invalid Ethnicity Code';
export const NameResidentError = '{404} Invalid Resident Code';

// Name -----> Victem -----------
export const NameVictimError = '{404} Invalid Victim Type ';
export const NameVictimOffenses = '{401} Atleast one UCR Offense Code must be present - Mandatory field ';


export const ErrorTooltip = (Error) => (<span className='hovertext' style={{ marginLeft: '15px' }} data-hover={Error} ><i className='fa fa-exclamation-circle'></i></span>);
export const ErrorShow = ({ Error }) => (<span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{Error}</span>);

export const ErrorStyle = (type) => {
    const colour_Styles = { control: (styles) => ({ ...styles, backgroundColor: type ? "rgb(255 202 194)" : "#fce9bf", height: 20, minHeight: 30, fontSize: 14, margintop: 2, boxShadow: 0, }), };
    return colour_Styles;
};

export const VictimError = (victimCode, Data, type) => {
    switch (victimCode) {
        case 'I':
        case 'P': {
            if (Data?.Gender_Code) {
                switch (Data?.Gender_Code) {
                    case 'M': { break; }
                    case 'F': { break; }
                    case 'U': { break; }
                    default: return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(NameSexError)
                }
            }
            if (Data?.Race_Code) {
                switch (Data?.Race_Code) {
                    case 'W': { break; }
                    case 'B': { break; }
                    case 'I': { break; }
                    case 'A': { break; }
                    case 'U': { break; }
                    default: return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(NameRaceError)
                }
            }
            if (Data?.Ethnicity_Code) {
                switch (Data?.Ethnicity_Code) {
                    case 'H': { break; }
                    case 'N': { break; }
                    case 'U': { break; }
                    default: return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(NameEthnicityError)
                }
            }
            break;
        }
        case 'B': {
            if (type === 'Color') return (ErrorStyle(false))
            else break;
        }
        case 'F': {
            if (type === 'Color') return (ErrorStyle(false))
            else break;
        }
        case 'G': {
            if (type === 'Color') return (ErrorStyle(false))
            else break;
        }
        case 'R': {
            if (type === 'Color') return (ErrorStyle(false))
            else break;
        }
        case 'S': {
            if (type === 'Color') return (ErrorStyle(false))
            else break;
        }
        case 'O': {
            if (type === 'Color') return (ErrorStyle(false))
            else break;
        }
        case 'U': {
            if (type === 'Color') return (ErrorStyle(false))
            else break;
        }
        case null: {
            if (type === 'Color') return (ErrorStyle(false))
            else break;
        }
        default: return type === 'Color' ? ErrorStyle(true) : ErrorTooltip(NameVictimError)
    }
}


export const VictimOffensesError = (Data, ) => {

}