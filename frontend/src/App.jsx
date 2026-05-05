import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PatientDashboard from './components/Dashboards/PatientDashboard';
import DoctorDashboard from './components/Dashboards/DoctorDashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './components/Pages/Home';
import About from './components/Pages/About';
import Features from './components/Pages/Features';
import Contact from './components/Pages/Contact';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-teal-500/30 relative overflow-hidden flex flex-col">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-950 to-slate-950 pointer-events-none z-0"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-emerald-500/10 blur-[120px] pointer-events-none z-0 rounded-full"></div>

      <Navbar />

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/patient/*" element={
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
              <ProtectedRoute allowedRole="Patient">
                <PatientDashboard />
              </ProtectedRoute>
            </div>
          } />
          
          <Route path="/doctor/*" element={
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
              <ProtectedRoute allowedRole="Doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            </div>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
