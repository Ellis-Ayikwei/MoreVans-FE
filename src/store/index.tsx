import { combineReducers, configureStore, Store } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import usersSlice from './usersSlice';
import vehicleSlice from './slices/vehicleSlice';
import paymentSlice from './slices/paymentSlice';
import serviceRequestSlice from './slices/serviceRequestSice';

import { FLUSH, PAUSE, PERSIST, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authSlice from './authSlice';
import createRequestSlice from './slices/createRequestSlice';
import draftRequestsSlice from './slices/draftRequestsSlice';
const authPersistConfig = {
    key: 'auth',
    storage,
};

// const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);
const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    auth: authSlice,
    usersdata: usersSlice,
    vehicle: vehicleSlice,
    payments: paymentSlice,
    serviceRequests: serviceRequestSlice,
    serviceRequest: createRequestSlice,
    draftRequests: draftRequestsSlice,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export default store;

const persistor = persistStore(store);

export { persistor };

export type IRootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
