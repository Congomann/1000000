
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/website/Home';
import { Services } from './pages/website/Services';
import { Advisors } from './pages/website/Advisors';
import { About } from './pages/website/About'; 
import { Resources } from './pages/website/Resources'; 
import { Contact } from './pages/website/Contact';
import { Login } from './pages/Login';
import { ClientPortal } from './pages/client/ClientPortal';
import { CRMLayout } from './components/CRMData';
import { Dashboard } from './pages/crm/Dashboard';
import { Leads } from './pages/crm/Leads';
import { LeadIntake } from './pages/crm/LeadIntake'; 
import { Clients } from './pages/crm/Clients';
import { Commissions } from './pages/crm/Commissions';
import { Calendar } from './pages/crm/Calendar';
import { Inbox } from './pages/crm/Inbox';
import { Chat } from './pages/crm/Chat'; 
import { ProfileSettings } from './pages/crm/ProfileSettings';
import { AdminUsers } from './pages/admin/AdminUsers';
import { WebsiteSettings } from './pages/admin/WebsiteSettings';
import { CarrierAssignment } from './pages/admin/CarrierAssignment';
import { UserRole } from './types';
import { AdvisorMicrosite } from './pages/website/AdvisorMicrosite';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';
import { EmailSignature } from './pages/admin/EmailSignature'; 
import { MarketingIntegrations } from './pages/admin/MarketingIntegrations'; 
import { JoinTeam } from './pages/website/JoinTeam'; 
import { Onboarding } from './pages/crm/Onboarding'; 
import { AdvisorOnboardingFlow } from './pages/crm/AdvisorOnboardingFlow'; // New Import
import { PoliciesApps, CommercialQuotes, PoliciesRenewals, AutoQuotes, FleetManager, Claims } from './pages/crm/insurance/InsurancePages'; 
import { PropertyPipeline, TransactionsEscrow } from './pages/crm/real-estate/RealEstatePages'; 
import { PortfolioMgmt, ComplianceDocs, AdvisoryFees } from './pages/crm/securities/SecuritiesPages'; 

// Protected Route Component for CRM
const ProtectedCRMRoute: React.FC = () => {
  const { user } = useData();
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only Admins, Managers and Advisors can access CRM
  const allowedRoles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.SUB_ADMIN, UserRole.ADVISOR];
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/client-portal" replace />;
  }

  // MANDATORY ONBOARDING: Redirect new advisors to the flow
  if (user.role === UserRole.ADVISOR && !user.onboardingCompleted && location.pathname !== '/crm/onboarding-flow') {
      return <Navigate to="/crm/onboarding-flow" replace />;
  }

  // If already completed or not an advisor, but trying to access onboarding flow, go to dashboard
  if (user.onboardingCompleted && location.pathname === '/crm/onboarding-flow') {
      return <Navigate to="/crm/dashboard" replace />;
  }

  // If on onboarding flow, don't wrap in CRMLayout as it has its own shell
  if (location.pathname === '/crm/onboarding-flow') {
      return <Outlet />;
  }

  return (
    <CRMLayout>
      <Outlet />
    </CRMLayout>
  );
};

// Protected Route for Admin - STRICTLY ADMIN ONLY
const AdminRoute: React.FC = () => {
    const { user } = useData();
    if (user?.role !== UserRole.ADMIN) {
        return <Navigate to="/crm/dashboard" replace />;
    }
    return <Outlet />;
};

// Layout wrapper for public pages to include Navbar and Footer
const PublicLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
        <Router>
          <Routes>
            {/* Public Website Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><Services /></PublicLayout>} />
            <Route path="/advisors" element={<PublicLayout><Advisors /></PublicLayout>} />
            <Route path="/advisor/:slug" element={<PublicLayout><AdvisorMicrosite /></PublicLayout>} />
            <Route path="/resources" element={<PublicLayout><Resources /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/join" element={<PublicLayout><JoinTeam /></PublicLayout>} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/client-portal" element={<ClientPortal />} />

            {/* Protected CRM Routes */}
            <Route path="/crm" element={<ProtectedCRMRoute />}>
              <Route index element={<Navigate to="/crm/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="onboarding-flow" element={<AdvisorOnboardingFlow />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path="chat" element={<Chat />} />
              <Route path="leads" element={<Leads />} />
              <Route path="intake" element={<LeadIntake />} /> 
              <Route path="clients" element={<Clients />} />
              <Route path="commissions" element={<Commissions />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="profile" element={<ProfileSettings />} />
              
              {/* Insurance Workflow Routes */}
              <Route path="applications" element={<PoliciesApps />} />
              <Route path="commercial-quotes" element={<CommercialQuotes />} />
              <Route path="renewals" element={<PoliciesRenewals />} />
              <Route path="auto-quotes" element={<AutoQuotes />} />
              <Route path="fleet" element={<FleetManager />} />
              <Route path="claims" element={<Claims />} />
              
              {/* Real Estate Workflow Routes */}
              <Route path="properties" element={<PropertyPipeline />} />
              <Route path="escrow" element={<TransactionsEscrow />} />
              
              {/* Securities Workflow Routes */}
              <Route path="portfolio" element={<PortfolioMgmt />} />
              <Route path="compliance" element={<ComplianceDocs />} />
              <Route path="fees" element={<AdvisoryFees />} />
              
              {/* Admin Routes - Strictly Admin Only */}
              <Route element={<AdminRoute />}>
                  <Route path="admin" element={<AdminUsers />} />
                  <Route path="admin/website" element={<WebsiteSettings />} />
                  <Route path="admin/carriers" element={<CarrierAssignment />} />
                  <Route path="admin/testimonials" element={<AdminTestimonials />} />
                  <Route path="admin/signature" element={<EmailSignature />} /> 
                  <Route path="admin/marketing" element={<MarketingIntegrations />} />
                  <Route path="onboarding" element={<Onboarding />} />
              </Route>
            </Route>
          </Routes>
        </Router>
    </DataProvider>
  );
};

export default App;
