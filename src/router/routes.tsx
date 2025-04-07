import { lazy, useEffect, useState } from 'react';
import AdminDashboard from '../pages/Dasboard/AdminDashboard';
import Homepage from '../pages/Homepage';
import HowItWorks from '../pages/HowItWorks';

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
import UserDetail from '../pages/user/UserDetail';
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
import ServiceRequestForm from '../pages/ServiceRequest/servicesRequest';
import VehicleManagement from '../pages/vehicleManagement/vehicleManagment';
import DriversManagement from '../pages/DriverManagement/driverManagement';
// import HelpCenter from '../pages/support/HelpCenter';
// import LiveChat from '../pages/support/LiveChat';
// import DisputeResolution from '../pages/support/DisputeResolution';
// import InstantQuote from '../pages/booking/InstantQuote';
// import SpecialRequirements from '../pages/booking/SpecialRequirements';
// import ProviderFeedback from '../pages/provider/ProviderFeedback';
// import ProviderResponses from '../pages/provider/ProviderResponses';
// import ProviderScore from '../pages/provider/ProviderScore';
// import ProviderVehicles from '../pages/provider/ProviderVehicles';
// import ProviderProfile from '../pages/provider/ProviderProfile';
// import ProviderHelpCenter from '../pages/provider/ProviderHelpCenter';
// import ProviderLiveChat from '../pages/provider/ProviderLiveChat';



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
    // // Public routes
    // {
    //     path: '/',
    //     element: <Homepage />,
    //     layout: 'blank',
    // },
    {
        path: '/',
        element: <Home />,
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
        element: <DisputesPage  />,
        layout: 'default',
    },
    
    // Customer routes - aligned with sidebar
    {
        path: '/dashboard',
        element: <UserDashboard />,
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
        path: '/bookings/:bookingId/review',
        element: <LeaveReviewPage/>,
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
        path: '/bookings',
        element: <MyBookings />,
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
        path: '/provider/job/:id',
        element: <JobDetail />,
        layout: 'default',
    },
    
    // {
    //     path: '/provider/vehicles',
    //     element: <ProviderVehicles />,
    //     layout: 'default',
    // },
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
        element: <BookingDetail />,
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
        layout: 'default',
    },
    {
        path: '/admin/users/:id',
        element: <UserDetail />,
        layout: 'default',
    },
    // {
    //     path: '/analytics',
    //     element: <AnalyticsPage />,
    //     layout: 'default',
    // },
];

export { routes };
