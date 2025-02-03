import React from "react";
import { 
  ArrowRight, Building2, Home as HomeIcon, 
  Users, BookUp, BookDown, Package, ReceiptText, UserSearch 
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/header/Navbar";

const FeatureCard = ({ icon: Icon, title, description, color, url }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate(url)}
      className={`bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center 
      m-2 w-full md:w-64 cursor-pointer transition-all duration-300 
      hover:scale-105 hover:shadow-xl ${color}`}
    >
      <div className={color.includes('text') ? color : color.replace('bg', 'text')}>
        <Icon className="w-12 h-12 mb-4" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const HomePage = () => {
  const features = [
    {
      icon: BookUp,
      title: "ઉધાર ચલણ",
      description: "Efficiently manage credit transactions and records",
      color: "text-red-600 hover:bg-red-50",
      url: "/udharchallan"
    },
    {
      icon: BookDown,
      title: "જમા ચલણ",
      description: "Track and manage all debit entries seamlessly",
      color: "text-green-600 hover:bg-green-50",
      url: "/jamachallan"
    },
    {
      icon: UserSearch,
      title: "ખાતાવહી",
      description: "Comprehensive ledger management system",
      color: "text-blue-600 hover:bg-blue-50",
      url: "/khatawahi"
    },
    {
      icon: Package,
      title: "રોજમેલ(સ્ટોક)",
      description: "Daily stock management and tracking",
      color: "text-purple-600 hover:bg-purple-50",
      url: "/rojmel"
    },
    {
      icon: ReceiptText,
      title: "બિલ",
      description: "Streamlined billing and invoice management",
      color: "text-teal-600 hover:bg-teal-50",
      url: "/bills"
    }
  ];

  const navigate = useNavigate();

  return (
    <Navbar>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {/* Hero Section */}
        <div className="flex flex-col justify-center items-center px-4 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to Business Management
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent mb-6">
            NO WERE TECH
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mb-8">
            Streamline your business operations with our comprehensive management system.
            Handle transactions, inventory, and accounts all in one place.
          </p>
          
          <button 
            onClick={() => navigate('/udharchallan')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 transform"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features Section */}
        <div className="px-4 py-12 md:py-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800">
            Comprehensive Business Management Tools
          </h2>
          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                url={feature.url}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/50 backdrop-blur-sm py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-gray-600">Customer Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600">System Availability</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">50+</div>
                <div className="text-gray-600">Active Businesses</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default HomePage;