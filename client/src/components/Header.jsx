import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, FilePlus, Files, Home, Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { to: "/", icon: Home, text: "Home" },
    { to: "/invoices", icon: Files, text: "View All Invoices" },
    { to: "/create", icon: FilePlus, text: "Create Invoice" },
  ];

  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <FileText className="text-blue-500 mr-2" size={32} />
            <span className="font-bold text-xl text-gray-800">InvoiceHub</span>
          </Link>

          {/* Hamburger menu for small screens */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-800"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Menu items for larger screens */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center text-gray-600 hover:text-blue-500 transition duration-300"
              >
                <item.icon className="mr-2" size={20} />
                {item.text}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block py-2 text-gray-600 hover:text-blue-500 transition duration-300"
                onClick={toggleMenu}
              >
                <div className="flex items-center">
                  <item.icon className="mr-2" size={20} />
                  {item.text}
                </div>
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
