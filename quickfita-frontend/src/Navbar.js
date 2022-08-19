import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import React from 'react';

const Links = [
  { label: 'TV Shows', href: '#' },
  { label: 'Movies', href: '#' }
];

const NavLink = ({ href, children }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={href}>
    {children}
  </Link>
);
NavLink.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node
}

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return <Box boxShadow='base' bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
    <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
      <IconButton
        size={'md'}
        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
        aria-label={'Open Menu'}
        display={{ md: 'none' }}
        onClick={isOpen ? onClose : onOpen}
      />
      <HStack spacing={8} alignItems={'center'}>
        <Box><Link href="#" _hover={{ textDecoration: 'none' }}>Quickfita</Link></Box>
        <HStack
          as={'nav'}
          spacing={4}
          display={{ base: 'none', md: 'flex' }}>
          {Links.map((link) => (
            <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
          ))}
        </HStack>
      </HStack>
      <Flex alignItems={'center'}>
        <Menu>
          <MenuButton
            as={Button}
            rounded={'full'}
            variant={'link'}
            cursor={'pointer'}
            minW={0}>
            <Avatar size={'sm'} />
          </MenuButton>
          <MenuList>
            <MenuItem>Settings</MenuItem>
            <MenuItem>Profile</MenuItem>
            <MenuDivider />
            <MenuItem>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>

    {isOpen ? (
      <Box pb={4} display={{ md: 'none' }}>
        <Stack as={'nav'} spacing={4}>
          {Links.map((link) => (
            <NavLink key={link}>{link}</NavLink>
          ))}
        </Stack>
      </Box>
    ) : null}
  </Box>;
}