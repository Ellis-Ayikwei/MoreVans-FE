import { PropsWithChildren, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store, { IRootState } from './store';
import { toggleAnimation, toggleLayout, toggleLocale, toggleMenu, toggleNavbar, toggleRTL, toggleSemidark, toggleTheme } from './store/themeConfigSlice';

function App({ children }: PropsWithChildren) {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(toggleTheme((localStorage.getItem('theme') as any) || themeConfig.theme));
        dispatch(toggleMenu((localStorage.getItem('menu') as any) || themeConfig.menu));
        dispatch(toggleLayout((localStorage.getItem('layout') as any) || themeConfig.layout));
        dispatch(toggleRTL((localStorage.getItem('rtlClass') as any) || themeConfig.rtlClass));
        dispatch(toggleAnimation((localStorage.getItem('animation') as any) || themeConfig.animation));
        dispatch(toggleNavbar((localStorage.getItem('navbar') as any) || themeConfig.navbar));
        dispatch(toggleLocale(localStorage.getItem('i18nextLng') || themeConfig.locale));
        dispatch(toggleSemidark(localStorage.getItem('semidark') === 'true' || themeConfig.semidark));
    }, [dispatch, themeConfig.theme, themeConfig.menu, themeConfig.layout, themeConfig.rtlClass, themeConfig.animation, themeConfig.navbar, themeConfig.locale, themeConfig.semidark]);

    return (
        <div
            className={`${(store.getState().themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout} ${
                themeConfig.rtlClass
            } main-section antialiased relative font-nunito text-sm font-normal`}
        >
            {children}
        </div>
    );
}

export default App;
