import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <img src="/src/assets/logo.svg" className="h-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                EasyInvoice
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              to="/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Link>
          </div>
        </div>
      </div>
      {location.pathname !== "/" && (
        <motion.div
          className="h-1 bg-indigo-600"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </nav>
  );
}
