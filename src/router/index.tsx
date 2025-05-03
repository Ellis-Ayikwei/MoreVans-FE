import { createBrowserRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import AdminLayout from '../components/Layouts/AdminLayout';
import { routes } from './routes';

const finalRoutes = routes.map((route) => {
    return {
        ...route,
        element:
            route.layout === 'blank' ? (
                <BlankLayout>{route.element}</BlankLayout>
            ) : route.layout === 'admin' ? (
                <AdminLayout>{route.element}</AdminLayout>
            ) : (
                <div>
                    <DefaultLayout>{route.element}</DefaultLayout>
                </div>
            ),
    };
});

const router = createBrowserRouter(finalRoutes);

export default router;
// const finalRoutes = routes.map((route) => {
//     return {
//         ...route,
//         element: (
//             <ProtectedRoute allowedRoles={route.allowedRoles}>
//                 {route.layout === 'blank' ? (
//                     <BlankLayout>{route.element}</BlankLayout>
//                 ) : (
//                     <DefaultLayout>{route.element}</DefaultLayout>
//                 )}
//             </ProtectedRoute>
//         ),
//     };
// });

// const router = createBrowserRouter(finalRoutes);

// export default router;
