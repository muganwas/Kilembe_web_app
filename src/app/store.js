import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { apiMiddleware } from 'redux-api-middleware';
import logger from 'redux-logger';
import { intlReducer } from 'react-intl-redux';
import moment from 'moment';
import Moment from 'react-moment';
import localeData from './locales/lang.json'
import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/dist/locale-data/en';
import '@formatjs/intl-relativetimeformat/dist/locale-data/fr'
import promise from 'redux-promise-middleware';
import genInfoReducer from 'reduxFiles/reducers/genInfoReducer';
import loginReducer from 'reduxFiles/reducers/loginReducer';
import signupReducer from 'reduxFiles/reducers/signupReducer'

Moment.globalMoment = moment;

const middleware = applyMiddleware(promise(), thunk, apiMiddleware, logger);
// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage;

// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0]

Moment.globalLocale = languageWithoutRegionCode;

// Try full locale, fallback to locale without region code, fallback to en
const messages = localeData[ languageWithoutRegionCode ] || localeData[language] || localeData.en

const initialState = {
  intl: {
    defaultLocale: 'en',
    locale: languageWithoutRegionCode,
    messages
  }
};

const allReducers = combineReducers({
    genInfo: genInfoReducer,
    intl: intlReducer,
    loginInfo: loginReducer,
    signupInfo: signupReducer
});

const store = createStore(
    allReducers,
    initialState,
    middleware 
)

export default store