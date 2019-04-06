import LocalizedStrings, { 
  LocalizedStringsMethods
} from 'localized-strings';

export interface LocaleStrings extends LocalizedStringsMethods {

}

const strings: LocaleStrings = new LocalizedStrings({
  en: require("./en.json")
});

export default strings;