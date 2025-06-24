import { lazy, useEffect, useState } from 'react';
import AdminDashboard from '../pages/Dasboard/AdminDashboard';
import Homepage from '../pages/website-preauth/Homepage';
import HowItWorks from '../pages/website-preauth/HowItWorks';
import About from '../pages/website-preauth/About';
import Contact from '../pages/website-preauth/Contact';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import AuthRedirect from '../components/Auth/AuthRedirect';

// import AnalyticsPage from '../pages/analytics';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import FAQPage from '../pages/help and support/faq';
import JobBoard from '../pages/provider/JobBoard';
import JobDetail from '../pages/provider/JobDetail';
import ProviderDashboard from '../pages/provider/ProviderDashboard';
import ProviderOnboarding from '../pages/provider/ProviderOnboarding';
import ServiceDetail from '../pages/service/ServiceDetail';
import ContactSupportPage from '../pages/help and support/supportPage';
import BookingConfirmation from '../pages/user/BookingConfirmation';
import BookingTracking from '../pages/user/BookingTracking';
import ProviderListings from '../pages/user/ProviderListings';
import UserDashboard from '../pages/user/UserDashboard';
import UserSettings from '../pages/user/userAccoutSettings/UserSettings';
import MyBookings from '../pages/user/MyBookings';
import CustomerPayments from '../pages/user/MyPayments';
import ProviderPayments from '../pages/provider/ProviderPayments';
import InstantQuoteCalculator from '../pages/website-preauth/InstantQuoteCalculator';
import NotificationsPage from '../pages/Notifications/NotificationsPage';
import NotificationDetail from '../pages/Notifications/NotificationDetail';
import BookingDetail from '../components/ServiceRequest/BookingDetail';
import BidSelection from '../pages/user/BidSelection';
import EditRequestForm from '../pages/EditRequestForm';
import DisputesPage from '../pages/help and support/DisputesPage';
import SavedProviders from '../pages/user/SavedProvider';
import ChatPage from '../pages/chat/ChatPage';
import LeaveReviewPage from '../pages/user/LeaveAReview';
import ProviderReviews from '../pages/provider/reviews';
import Home from '../pages/Home';
import ServiceRequestForm from '../pages/ServiceRequest/ServiceRequestForm';
import VehicleManagement from '../pages/vehicleManagement/vehicleManagment';
import DriversManagement from '../pages/DriverManagement/driverManagement';
import UserManagement from '../pages/admin/UserManagement';
import ProviderManagement from '../pages/admin/ProviderManagement';
import BookingManagement from '../pages/admin/BookingManagement';
import RevenueManagement from '../pages/admin/RevenueManagement';
import SystemMaintenance from '../pages/admin/SystemMaintenance';
import DisputeManagement from '../pages/admin/DisputeManagement';
import RolesPermissions from '../pages/admin/RolesPermissions';
import SupportTickets from '../pages/admin/SupportTickets';
import ProviderDetail from '../pages/admin/ProviderDetail';
import ProviderEdit from '../pages/admin/ProviderEdit';
import UserEdit from '../pages/admin/UserEdit';
import UserDetail from '../pages/user/UserDetail';
import AdminSettings from '../pages/admin/AdminSettings';
import PaymentPage from '../pages/PaymentPage';
import ServiceRequestDetailPage from '../pages/ServiceRequestDetailPage';
import ProviderJobDetailPage from '../pages/ProviderJobDetailPage';
import PaymentDetail from '../components/Payment/PaymentDetail';
import UserBookingDetail from '../pages/user/UserBookingDetail';
import MyJobs from '../pages/provider/MyJobs';
import PaymentSuccess from '../pages/user/PaymentSuccess';
import PaymentCancel from '../pages/user/PaymentCancel';

// Import vehicle components
import VehicleList from '../components/vehicle/VehicleList';
import VehicleDetail from '../components/vehicle/VehicleDetail';
import BiddingJobs from '../pages/provider/BiddingJobs';
import WatchingJobs from '../pages/provider/WatchingJobs';
import PricingAdmin from '../pages/admin/pricing';
import BlogPostDetail from '../pages/website-preauth/BlogPostDetail';
import Blog from '../pages/website-preauth/Blog';
import Services from '../pages/website-preauth/Services';
import ForgotPassword from '../pages/auth/forgot-password';
import TestMapApi from '../pages/testMapApi';

const userRole = localStorage.getItem('userRole') || '';
const adminUsers = ['SUPER_ADMIN', 'ADMIN', 'UNDERWRITER', 'PREMIUM_ADMIN', 'SALES'];
const personalUsers = ['MEMBER', 'REGULAR'];

const ConditionalDashboard = () => {
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const storedUserRole = localStorage.getItem('userRole');
        setUserRole(storedUserRole || '');
    }, []);

    if (!userRole) {
        return <div>Loading...</div>;
    }

    if (adminUsers.includes(userRole)) {
        return <AdminDashboard />;
    }

    // if (personalUsers.includes(userRole)) {
    //     return <MemberDashboard />;
    // }

    return <div>Unauthorized Access</div>;
};

const routes = [
    // Public routes (no authentication required)
    {
        path: '/',
        element: <Homepage />,
        layout: 'blank',
    },
    {
        path: '/about',
        element: <About />,
        layout: 'blank',
    },
    {
        path: '/contact',
        element: <Contact />,
        layout: 'blank',
    },
    {
        path: '/blog',
        element: <Blog />,
        layout: 'blank',
    },
    {
        path: '/blog/:id',
        element: <BlogPostDetail />,
        layout: 'blank',
    },
    {
        path: '/services',
        element: <Services />,
        layout: 'blank',
    },
    {
        path: '/how-it-works',
        element: <HowItWorks />,
        layout: 'blank',
    },
    {
        path: '/instant-quote',
        element: <InstantQuoteCalculator />,
        layout: 'blank',
    },

    // Auth routes (redirect if already authenticated)
    {
        path: '/login',
        element: (
            <AuthRedirect>
                <Login />
            </AuthRedirect>
        ),
        layout: 'blank',
    },
    {
        path: '/register',
        element: (
            <AuthRedirect>
                <Register />
            </AuthRedirect>
        ),
        layout: 'blank',
    },
    {
        path: '/forgot-password',
        element: (
            <AuthRedirect>
                <ForgotPassword />
            </AuthRedirect>
        ),
        layout: 'blank',
    },

    // Protected routes for authenticated users
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute customerOnly>
                <UserDashboard />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/faq',
        element: (
            <ProtectedRoute>
                <FAQPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/disputes',
        element: (
            <ProtectedRoute>
                <DisputesPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/testmap-api',
        element: (
            <ProtectedRoute>
                <TestMapApi />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    // Customer routes
    {
        path: '/service-request',
        element: <ServiceRequestForm />,
        layout: 'flexible',
    },
    {
        path: '/service-request2',
        element: <ServiceRequestForm />,
        layout: 'flexible',
    },
    {
        path: '/service-requests/:id',
        element: (
            <ProtectedRoute>
                <ServiceRequestDetailPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/bookings/:bookingId/review',
        element: (
            <ProtectedRoute customerOnly>
                <LeaveReviewPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/edit-request/:id',
        element: (
            <ProtectedRoute customerOnly>
                <EditRequestForm />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/notifications',
        element: (
            <ProtectedRoute>
                <NotificationsPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/notifications/:id',
        element: (
            <ProtectedRoute>
                <NotificationDetail />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/saved-providers',
        element: (
            <ProtectedRoute customerOnly>
                <SavedProviders />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/chat',
        element: (
            <ProtectedRoute>
                <ChatPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/chat/:id',
        element: (
            <ProtectedRoute>
                <ChatPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    // My Moves/Bookings routes
    {
        path: '/my-bookings',
        element: (
            <ProtectedRoute customerOnly>
                <MyBookings />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/bookings/new',
        element: (
            <ProtectedRoute customerOnly>
                <ServiceRequestForm />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/bookings/:id',
        element: (
            <ProtectedRoute>
                <BookingDetail />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/bookings/:id/review',
        element: (
            <ProtectedRoute customerOnly>
                <LeaveReviewPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/bidding/:serviceId',
        element: (
            <ProtectedRoute customerOnly>
                <BidSelection />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    // Payment routes
    {
        path: '/payments',
        element: (
            <ProtectedRoute>
                <CustomerPayments />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/payment/:requestId?',
        element: (
            <ProtectedRoute>
                <PaymentPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/payment/detail/:requestId',
        element: (
            <ProtectedRoute>
                <PaymentDetail />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/payment/success',
        element: (
            <ProtectedRoute>
                <PaymentSuccess />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/payment/cancel',
        element: (
            <ProtectedRoute>
                <PaymentCancel />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    // Support routes
    {
        path: '/contact-support',
        element: (
            <ProtectedRoute>
                <ContactSupportPage />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    // Account settings
    {
        path: '/profile',
        element: (
            <ProtectedRoute>
                <UserSettings />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    // Provider routes
    {
        path: '/provider/dashboard',
        element: (
            <ProtectedRoute providerOnly>
                <ProviderDashboard />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/jobs',
        element: (
            <ProtectedRoute providerOnly>
                <JobBoard />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/my-jobs',
        element: (
            <ProtectedRoute providerOnly>
                <MyJobs />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/my-jobs-bidding',
        element: (
            <ProtectedRoute providerOnly>
                <BiddingJobs />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/my-jobs-watching',
        element: (
            <ProtectedRoute providerOnly>
                <WatchingJobs />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/job/:id',
        element: (
            <ProtectedRoute providerOnly>
                <JobDetail />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/payouts',
        element: (
            <ProtectedRoute providerOnly>
                <ProviderPayments />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/provider/onboarding',
        element: (
            <ProtectedRoute providerOnly>
                <ProviderOnboarding />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    // Vehicle management
    {
        path: 'vehicle-management',
        element: (
            <ProtectedRoute providerOnly>
                <VehicleManagement />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: 'driver-management',
        element: (
            <ProtectedRoute providerOnly>
                <DriversManagement />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/vehicles',
        element: (
            <ProtectedRoute>
                <VehicleList />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/vehicles/:id',
        element: (
            <ProtectedRoute>
                <VehicleDetail />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    // Provider flow routes
    {
        path: '/providers/:requestId',
        element: (
            <ProtectedRoute customerOnly>
                <ProviderListings />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/providers/:providerId/ratings',
        element: (
            <ProtectedRoute>
                <ProviderReviews />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/booking-confirmation/:requestId/:providerId',
        element: (
            <ProtectedRoute customerOnly>
                <BookingConfirmation />
            </ProtectedRoute>
        ),
        layout: 'default',
    },
    {
        path: '/tracking/:id',
        element: (
            <ProtectedRoute>
                <BookingTracking />
            </ProtectedRoute>
        ),
        layout: 'default',
    },

    // Admin routes
    {
        path: '/admin/dashboard',
        element: (
            <ProtectedRoute adminOnly>
                <AdminDashboard />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/users',
        element: (
            <ProtectedRoute adminOnly>
                <UserManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/users/:id/edit',
        element: (
            <ProtectedRoute adminOnly>
                <UserEdit />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/providers',
        element: (
            <ProtectedRoute adminOnly>
                <ProviderManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/providers/:id',
        element: (
            <ProtectedRoute adminOnly>
                <ProviderDetail />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/providers/:id/edit',
        element: (
            <ProtectedRoute adminOnly>
                <ProviderEdit />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/bookings',
        element: (
            <ProtectedRoute adminOnly>
                <BookingManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/bookings/:id',
        element: (
            <ProtectedRoute adminOnly>
                <UserBookingDetail />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/revenue',
        element: (
            <ProtectedRoute adminOnly>
                <RevenueManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/pricing',
        element: (
            <ProtectedRoute adminOnly>
                <PricingAdmin />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/disputes',
        element: (
            <ProtectedRoute adminOnly>
                <DisputeManagement />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/settings',
        element: (
            <ProtectedRoute adminOnly>
                <AdminSettings />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/permissions',
        element: (
            <ProtectedRoute adminOnly>
                <RolesPermissions />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/maintenance',
        element: (
            <ProtectedRoute adminOnly>
                <SystemMaintenance />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
    {
        path: '/admin/support',
        element: (
            <ProtectedRoute adminOnly>
                <SupportTickets />
            </ProtectedRoute>
        ),
        layout: 'admin',
    },
];

export { routes };
