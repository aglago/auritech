// import { Link } from "react-router-dom";
// import { FileText } from "lucide-react";

// const Header = () => {
//   return (
//     <header className="bg-white shadow">
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center">
//             <FileText className="text-blue-500 mr-2" size={32} />
//             <span className="font-bold text-xl text-gray-800">InvoiceHub</span>
//           </div>
//           <div>
//             <Link
//               to="/login"
//               className="text-gray-600 hover:text-gray-800 mr-4"
//             >
//               Login
//             </Link>
//             <Link
//               to="/signup"
//               className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
//             >
//               Sign Up
//             </Link>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;

import { Link } from "react-router-dom";
import { FileText, FilePlus, Files } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <FileText className="text-blue-500 mr-2" size={32} />
            <span className="font-bold text-xl text-gray-800">InvoiceHub</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/invoices"
              className="flex items-center text-gray-600 hover:text-blue-500 transition duration-300"
            >
              <Files className="mr-2" size={20} />
              View All Invoices
            </Link>
            <Link
              to="/create"
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              <FilePlus className="mr-2" size={20} />
              Create Invoice
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;