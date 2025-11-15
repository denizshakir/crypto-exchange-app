import { Link } from '@heroui/link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
} from '@heroui/navbar';

import ThemeSwitch from '@/components/ThemeSwitch/ThemeSwitch';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent justify="start">
        <NavbarBrand>
          <Link
            as={RouterLink}
            to="/"
            color="foreground"
            className="text-xl font-bold tracking-tight no-underline"
            onClick={() => navigate('/')}
          >
            Crypto Exchange App
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        <ThemeSwitch />
      </NavbarContent>
    </HeroUINavbar>
  );
};

export default Navbar;
