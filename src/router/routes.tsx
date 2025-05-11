import { lazy, useEffect, useState } from 'react';
import AdminDashboard from '../pages/Dasboard/AdminDashboard';
import Homepage from '../pages/Homepage';
import HowItWorks from '../pages/HowItWorks';
import About from '../pages/About';
import Contact from '../pages/Contact';

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
import UserSettings from '../pages/user/UserSettings';
import MyBookings from '../pages/user/MyBookings';
import CustomerPayments from '../pages/user/MyPayments';
import ProviderPayments from '../pages/provider/ProviderPayments';
import InstantQuoteCalculator from '../pages/InstantQuoteCalculator';
import NotificationsPage from '../pages/Notifications/NotificationsPage';
import NotificationDetail from '../pages/Notifications/NotificationDetail';
import BookingDetail from '../pages/user/BookingDetail';
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

// Import vehicle components
import VehicleList from '../components/vehicle/VehicleList';
import VehicleDetail from '../components/vehicle/VehicleDetail';
import BiddingJobs from '../pages/provider/BiddingJobs';
import WatchingJobs from '../pages/provider/WatchingJobs';
import PricingAdmin from '../pages/admin/pricing';
import BlogPostDetail from '../pages/BlogPostDetail';
import Blog from '../pages/Blog';
import Services from '../pages/Services';
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
    // Public routes
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
        path: '/login',
        element: <Login />,
        layout: 'blank',
    },
    {
        path: '/register',
        element: <Register />,
        layout: 'blank',
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />,
        layout: 'blank',
    },
    {
        path: '/how-it-works',
        element: <HowItWorks />,
        layout: 'blank',
    },
    {
        path: '/faq',
        element: <FAQPage />,
        layout: 'default',
    },
    {
        path: '/disputes',
        element: <DisputesPage />,
        layout: 'default',
    },

    // Customer routes - aligned with sidebar
    {
        path: '/dashboard',
        element: <UserDashboard />,
        layout: 'default',
    },
    {
        path: '/testmap-api',
        element: <TestMapApi />,
        layout: 'default',
    },

    {
        path: '/instant-quote',
        element: <InstantQuoteCalculator />,
        layout: 'default',
    },
    {
        path: '/service-request',
        element: <ServiceRequestForm />,
        layout: 'default',
    },
    {
        path: '/service-request2',
        element: <ServiceRequestForm />,
        layout: 'default',
    },

    {
        path: '/service-requests/:id',
        element: <ServiceRequestDetailPage />,
        layout: 'default',
    },
    {
        path: '/bookings/:bookingId/review',
        element: <LeaveReviewPage />,
        layout: 'default',
    },
    {
        path: '/edit-request/:id',
        element: <EditRequestForm />,
        layout: 'default',
    },
    {
        path: '/notifications',
        element: <NotificationsPage />,
        layout: 'default',
    },
    {
        path: '/notifications/:id',
        element: <NotificationDetail />,
        layout: 'default',
    },
    {
        path: '/saved-providers',
        element: <SavedProviders />,
        layout: 'default',
    },
    {
        path: '/chat',
        element: <ChatPage />,
        layout: 'default',
    },
    {
        path: '/chat/:id',
        element: <ChatPage />,
        layout: 'default',
    },
    // {
    //     path: '/special-requirements',
    //     element: <SpecialRequirements />,
    //     layout: 'default',
    // },
    // My Moves route
    {
        path: '/my-bookings',
        element: <MyBookings />,
        layout: 'default',
    },
    {
        path: '/bookings/new',
        element: <ServiceRequestForm />,
        layout: 'default',
    },
    {
        path: '/bookings/:id',
        element: <BookingDetail />,
        layout: 'default',
    },
    {
        path: '/bookings/:id/review',
        element: <LeaveReviewPage />,
        layout: 'default',
    },
    {
        path: '/bidding/:serviceId',
        element: <BidSelection />,
        layout: 'default',
    },
    // Payments route
    {
        path: '/payments',
        element: <CustomerPayments />,
        layout: 'default',
    },
    // Support routes
    // {
    //     path: '/help-center',
    //     element: <HelpCenter />,
    //     layout: 'default',
    // },
    // {
    //     path: '/live-chat',
    //     element: <LiveChat />,
    //     layout: 'default',
    // },
    // {
    //     path: '/disputes',
    //     element: <DisputeResolution />,
    //     layout: 'default',
    // },
    {
        path: '/contact-support',
        element: <ContactSupportPage />,
        layout: 'default',
    },
    // Account settings
    {
        path: '/profile',
        element: <UserSettings />,
        layout: 'default',
    },

    // Provider routes - aligned with sidebar
    {
        path: '/provider/dashboard',
        element: <ProviderDashboard />,
        layout: 'default',
    },
    {
        path: '/provider/jobs',
        element: <JobBoard />,
        layout: 'default',
    },
    {
        path: '/provider/my-jobs',
        element: <MyJobs />,
        layout: 'default',
    },
    {
        path: '/provider/my-jobs-bidding',
        element: <BiddingJobs />,
        layout: 'default',
    },
    {
        path: '/provider/my-jobs-watching',
        element: <WatchingJobs />,
        layout: 'default',
    },
    {
        path: '/provider/job/:id',
        element: <JobDetail />,
        layout: 'default',
    },
    {
        path: '/provider/job/:id',
        element: <UserBookingDetail />,
        layout: 'default',
    },
    {
        path: '/provider/payouts',
        element: <ProviderPayments />,
        layout: 'default',
    },
    // Provider Ratings & Reviews routes
    // {
    //     path: '/provider/feedback',
    //     element: <ProviderFeedback />,
    //     layout: 'default',
    // },
    // {
    //     path: '/provider/responses',
    //     element: <ProviderResponses />,
    //     layout: 'default',
    // },
    // {
    //     path: '/provider/score',
    //     element: <ProviderScore />,
    //     layout: 'default',
    // },
    // Provider Support routes
    // {
    //     path: '/provider/help-center',
    //     element: <ProviderHelpCenter />,
    //     layout: 'default',
    // },
    // {
    //     path: '/provider/live-chat',
    //     element: <ProviderLiveChat />,
    //     layout: 'default',
    // },
    // Provider Profile Settings
    // {
    //     path: '/provider/profile',
    //     element: <ProviderProfile />,
    //     layout: 'default',
    // },

    // Additional flow routes
    {
        path: '/providers/:requestId',
        element: <ProviderListings />,
        layout: 'default',
    },
    {
        path: '/providers/:providerId/ratings',
        element: <ProviderReviews />,
        layout: 'default',
    },
    {
        path: '/booking-confirmation/:requestId/:providerId',
        element: <BookingConfirmation />,
        layout: 'default',
    },
    {
        path: '/tracking/:id',
        element: <BookingTracking />,
        layout: 'default',
    },
    {
        path: '/bookings/:id',
        element: <UserBookingDetail />,
        layout: 'default',
    },
    {
        path: '/bidding/:serviceId',
        element: <BidSelection />,
        layout: 'default',
    },
    {
        path: 'vehicle-management',
        element: <VehicleManagement />,
        layout: 'default',
    },
    {
        path: 'driver-management',
        element: <DriversManagement />,
        layout: 'default',
    },
    {
        path: '/provider/onboarding',
        element: <ProviderOnboarding />,
        layout: 'default',
    },

    // Admin routes
    {
        path: '/admin/dashboard',
        element: <AdminDashboard />,
        layout: 'admin',
    },
    {
        path: '/admin/users',
        element: <UserManagement />,
        layout: 'admin',
    },
    // {
    //     path: '/admin/users/:id',
    //     element: <UserDetail userData={{ /* Provide appropriate userData object here */ }} />,
    //     layout: 'admin',
    // },
    {
        path: '/admin/users/:id/edit',
        element: <UserEdit />,
        layout: 'admin',
    },
    {
        path: '/admin/providers',
        element: <ProviderManagement />,
        layout: 'admin',
    },
    {
        path: '/admin/providers/:id',
        element: <ProviderDetail />,
        layout: 'admin',
    },
    {
        path: '/admin/providers/:id/edit',
        element: <ProviderEdit />,
        layout: 'admin',
    },
    {
        path: '/admin/bookings',
        element: <BookingManagement />,
        layout: 'admin',
    },
    {
        path: '/admin/bookings/:id',
        element: <UserBookingDetail />,
        layout: 'admin',
    },
    {
        path: '/admin/revenue',
        element: <RevenueManagement />,
        layout: 'admin',
    },
    {
        path: '/admin/pricing',
        element: <PricingAdmin />,
        layout: 'admin',
    },
    {
        path: '/admin/disputes',
        element: <DisputeManagement />,
        layout: 'admin',
    },
    {
        path: '/admin/settings',
        element: <AdminSettings />,
        layout: 'admin',
    },
    {
        path: '/admin/permissions',
        element: <RolesPermissions />,
        layout: 'admin',
    },
    {
        path: '/admin/maintenance',
        element: <SystemMaintenance />,
        layout: 'admin',
    },
    {
        path: '/admin/support',
        element: <SupportTickets />,
        layout: 'admin',
    },
    // {
    //     path: '/analytics',
    //     element: <AnalyticsPage />,
    //     layout: 'default',
    // },

    // Vehicle routes
    {
        path: '/vehicles',
        element: <VehicleList />,
        layout: 'default',
    },
    {
        path: '/vehicles/:id',
        element: <VehicleDetail />,
        layout: 'default',
    },
    {
        path: '/payment/:requestId?',
        element: <PaymentPage />,
        layout: 'default',
    },
    {
        path: '/payment/detail/:requestId',
        element: <PaymentDetail />,
        layout: 'default',
    },
];

export { routes };
