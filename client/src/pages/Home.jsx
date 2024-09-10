import { Link } from "react-router-dom";
import { FileText, BarChart, Cloud, Smartphone } from "lucide-react";

const FeatureCard = ({ Icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
    <Icon size={48} className="text-blue-500 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Streamline Your Invoicing Process
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create, manage, and track invoices with ease. Perfect for businesses
            of all sizes.
          </p>
          <Link
            to="/create"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 inline-block"
          >
            Create Your First Invoice
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <FeatureCard
            Icon={FileText}
            title="Easy Invoice Creation"
            description="Create professional invoices in minutes with our intuitive interface."
          />
          <FeatureCard
            Icon={BarChart}
            title="Financial Insights"
            description="Get real-time analytics and reports to track your business performance."
          />
          <FeatureCard
            Icon={Cloud}
            title="Cloud-Based Solution"
            description="Access your invoices from anywhere, anytime. Your data is always secure."
          />
          <FeatureCard
            Icon={Smartphone}
            title="Mobile Friendly"
            description="Manage your invoices on-the-go with our responsive mobile design."
          />
        </div>

        <div className="bg-gray-100 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-around items-center">
            <div className="text-center mb-8 md:mb-0">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                1
              </div>
              <h3 className="font-semibold mb-2">Create an Account</h3>
              <p className="text-gray-600">
                Sign up for free and set up your business profile.
              </p>
            </div>
            <div className="text-center mb-8 md:mb-0">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                2
              </div>
              <h3 className="font-semibold mb-2">Create Invoices</h3>
              <p className="text-gray-600">
                Use our templates or create custom invoices.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                3
              </div>
              <h3 className="font-semibold mb-2">Get Paid</h3>
              <p className="text-gray-600">
                Send invoices and receive payments quickly.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of businesses already using InvoiceHub.
          </p>
          <Link
            to="/signup"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 inline-block"
          >
            Sign Up for Free
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
