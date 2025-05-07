import React from 'react';
import { Box, Flex, Icon, Text, VStack, useBreakpointValue, IconButton } from '@chakra-ui/react';
import { Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/modal';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaTicketAlt, FaCog, FaBars, FaChartBar, FaMoneyBillWave, FaExchangeAlt, FaServer, FaDollarSign } from 'react-icons/fa';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen?: () => void;
}

const AdminSidebar = ({ isOpen, onClose, onOpen }: SidebarProps) => {
    const location = useLocation();
    const isMobile = useBreakpointValue({ base: true, md: false });

    const NavItem = ({ icon, children, path }: { icon: any; children: string; path: string }) => {
        const isActive = location.pathname.startsWith(path);

        return (
            <Link to={path}>
                <Flex
                    align="center"
                    p="4"
                    mx="4"
                    borderRadius="lg"
                    role="group"
                    cursor="pointer"
                    bg={isActive ? 'whiteAlpha.200' : 'transparent'}
                    _hover={{
                        bg: 'whiteAlpha.300',
                    }}
                >
                    <Icon mr="4" fontSize="16" as={icon} />
                    <Text>{children}</Text>
                </Flex>
            </Link>
        );
    };

    const SidebarContent = () => (
        <Box bg="primary.600" color="white" h="full" w="full" borderRight="1px" borderRightColor="gray.200" pt="5">
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontWeight="bold">
                    MoreVans Admin
                </Text>
            </Flex>
            <VStack spacing={0} align="stretch" mt="6">
                <NavItem icon={FaHome} path="/admin/dashboard">
                    Dashboard
                </NavItem>
                <NavItem icon={FaUsers} path="/admin/users">
                    User Management
                </NavItem>
                <NavItem icon={FaUsers} path="/admin/providers">
                    Provider Management
                </NavItem>
                <NavItem icon={FaTicketAlt} path="/admin/bookings">
                    Booking Management
                </NavItem>
                <NavItem icon={FaMoneyBillWave} path="/admin/revenue">
                    Revenue Management
                </NavItem>
                <NavItem icon={FaDollarSign} path="/admin/pricing">
                    Pricing Management
                </NavItem>
                <NavItem icon={FaExchangeAlt} path="/admin/disputes">
                    Dispute Management
                </NavItem>
                <NavItem icon={FaTicketAlt} path="/admin/support">
                    Support Tickets
                </NavItem>
                <NavItem icon={FaCog} path="/admin/settings">
                    Settings
                </NavItem>
                <NavItem icon={FaCog} path="/admin/permissions">
                    Roles & Permissions
                </NavItem>
                <NavItem icon={FaServer} path="/admin/maintenance">
                    System Maintenance
                </NavItem>
            </VStack>
        </Box>
    );

    // Show sidebar as drawer on mobile, and as a fixed sidebar on desktop
    if (isMobile) {
        return (
            <>
                <IconButton aria-label="Open Menu" icon={<FaBars />} position="fixed" top="4" left="4" zIndex="999" onClick={onOpen} display={{ base: 'flex', md: 'none' }} />
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton color="white" />
                        <DrawerHeader p={0}>
                            <Box bg="primary.600" w="full" h="full" pt="4" pb="4" pl="6">
                                <Text color="white">MoreVans Admin</Text>
                            </Box>
                        </DrawerHeader>
                        <DrawerBody p={0}>
                            <SidebarContent />
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </>
        );
    }

    return (
        <Box position="fixed" left={0} h="full" w="250px" visibility={isOpen ? 'visible' : 'hidden'} transform={isOpen ? 'translateX(0)' : 'translateX(-100%)'} transition="all 0.3s" zIndex={1000}>
            <SidebarContent />
        </Box>
    );
};

export default AdminSidebar;
