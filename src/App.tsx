import React from 'react';
import { Navigation } from 'react-native-navigation';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';

import { combinedReducer } from './core/reducers';
import { registerScreens } from './screens';
import { COLORS } from './utils/ColorUtil';

const reducer = combineReducers(combinedReducer);
const persistedReducer = persistReducer(
  // @ts-ignore
  {
    key: 'root',
    storage,
  },
  // @ts-ignore
  reducer
);
const store = createStore(
  persistedReducer,
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

registerScreens(store, Provider);

var homeIcon: any;
var statsIcon: any;
var profileIcon: any;

class App {
  constructor() {
    this._populateIcons()
      .then(() => {
        // Start app only if all icons are loaded
        this.startApp();
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  _populateIcons = () => {
    // @ts-ignore
    return new Promise((resolve: Function, reject: Function) => {
      // @ts-ignore
      Promise.all([
        Icon.getImageSource('md-home', 27),
        Icon.getImageSource('md-pulse', 27),
        Icon.getImageSource('ios-person', 27),
      ])
        .then((values: any[]) => {
          homeIcon = values[0];
          statsIcon = values[1];
          profileIcon = values[2];
          resolve(true);
        })
        .catch((error: any) => {
          console.log(error);
          reject(error);
        })
        .done();
    });
  };

  startApp() {
    // This will start our app
    Navigation.startTabBasedApp({
      tabs: [
        {
          label: 'Home',
          screen: 'dexpensify.Home',
          icon: homeIcon,
          navigatorStyle: {},
        },
        {
          label: 'Stats',
          screen: 'dexpensify.Stats',
          icon: statsIcon,
          navigatorStyle: {},
        },
        {
          label: 'Profile',
          screen: 'dexpensify.Profile',
          icon: profileIcon,
          navigatorStyle: {},
        },
      ],
      appStyle: {
        // @ts-ignore
        tabBarSelectedButtonColor: COLORS.BLACK,
        tabBarButtonColor: COLORS.GRAY,
        orientation: 'portrait',
        keepStyleAcrossPush: true,
      },
    });
  }
}

export default new App();
