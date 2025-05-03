import { Routes, Route } from 'react-router-dom';
import UserProfileTabs from '../pages/user/UserDetail';
import SupportTicketDetail from '../pages/admin/SupportTicketDetail';
import AdminSidebar from '../components/layout/AdminSidebar';
import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import AdminSettings from '../pages/admin/AdminSettings';
import UserManagement from '../pages/admin/UserManagement';
import ProviderManagement from '../pages/admin/ProviderManagement';
import BookingManagement from '../pages/admin/BookingManagement';
import RevenueManagement from '../pages/admin/RevenueManagement';
import DisputeManagement from '../pages/admin/DisputeManagement';
import SupportTickets from '../pages/admin/SupportTickets';
import RolesPermissions from '../pages/admin/RolesPermissions';
import SystemMaintenance from '../pages/admin/SystemMaintenance';
import AdminDashboard from '../pages/admin/AdminDashboard';

const AdminRoutes = () => {
    const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

    return (
        <Flex direction="row" h="100vh" w="100%">
            <AdminSidebar isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
            <Box 
                flex="1" 
                ml={isOpen ? { base: 0, md: '250px' } : 0}
                transition="margin-left 0.3s"
                overflowY="auto"
                p={4}
            >
                <Routes>
                    {/* We'll use the existing pages/admin components */}
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/providers" element={<ProviderManagement />} />
                    <Route path="/admin/bookings" element={<BookingManagement />} />
                    <Route path="/admin/revenue" element={<RevenueManagement />} />
                    <Route path="/admin/disputes" element={<DisputeManagement />} />
                    <Route path="/admin/support" element={<SupportTickets />} />
                    <Route path="/admin/support-tickets/:ticketId" element={<SupportTicketDetail />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                    <Route path="/admin/permissions" element={<RolesPermissions />} />
                    <Route path="/admin/maintenance" element={<SystemMaintenance />} />
                    <Route path="/user/profile" element={<UserProfileTabs />} />
                </Routes>
            </Box>
        </Flex>
    );
};

export default AdminRoutes;