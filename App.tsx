import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/website/Home';
import { Services } from './pages/website/Services';
import { RealEstate } from './pages/website/RealEstate';
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
import { AdvisorOnboardingFlow } from './pages/crm/AdvisorOnboardingFlow'; 
import { LegalCompliance } from './pages/crm/LegalCompliance';
import { PrivacyPolicy } from './pages/website/PrivacyPolicy';
import { TermsOfUse } from './pages/website/TermsOfUse';
import { 
  PoliciesApps, 
  CommercialQuotes, 
  PoliciesRenewals, 
  AutoQuotes, 
  FleetManager, 
  Claims 
} from './pages/crm/insurance/InsurancePages'; 
import { 
  PropertyPipeline, 
  TransactionsEscrow 
} from './pages/crm/real-estate/RealEstatePages'; 
import { 
  PortfolioMgmt, 
  ComplianceDocs, 
  AdvisoryFees 
} from './pages/crm/securities/SecuritiesPages'; 
import { 
  LoanApplications, 
  RateTools, 
  RefinanceCalc 
} from './pages/crm/mortgage/MortgagePages';
import { AIChatWidget } from './components/AIChatWidget';
import { IntegrationsHub } from './pages/crm/IntegrationsHub';
import { AutomationStudio } from './pages/crm/AutomationStudio';

/**
 * DEVELOPER NOTE: App Routing Architecture
 * This file serves as the main gateway for both the public-facing 
 * New Holland website and the private NHFG Advisor Terminal (CRM).
 */

const ProtectedCRMRoute: React.FC = () => {
  const { user } = useData();
  const location = useLocation();
  
  if (!user) return <Navigate to="/login" replace />;

  const allowedRoles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.SUB_ADMIN, UserRole.ADVISOR];
  if (!allowedRoles.includes(user.role)) return <Navigate to="/client-portal" replace />;

  // Force Onboarding completion for all new advisors
  if (user.role === UserRole.ADVISOR && !user.onboardingCompleted && location.pathname !== '/crm/onboarding-flow') {
      return <Navigate to="/crm/onboarding-flow" replace />;
  }

  if (location.pathname === '/crm/onboarding-flow') return <Outlet />;

  return (
    <CRMLayout>
      <Outlet />
    </CRMLayout>
  );
};

const AdminRoute: React.FC = () => {
    const { user } = useData();
    // PERMISSIONS: Restricting admin modules to core Administrators and Managers only, removing Sub-Admins.
    if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.MANAGER) return <Navigate to="/crm/dashboard" replace />;
    return <Outlet />;
};

const PublicLayout: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <AIChatWidget />
    </div>
);

const App: React.FC = () => {
  return (
    <DataProvider>
        <Router>
          <Routes>
            {/* PUBLIC WEBSITE */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><Services /></PublicLayout>} />
            <Route path="/real-estate" element={<PublicLayout><RealEstate /></PublicLayout>} />
            <Route path="/advisors" element={<PublicLayout><Advisors /></PublicLayout>} />
            <Route path="/advisor/:slug" element={<PublicLayout><AdvisorMicrosite /></PublicLayout>} />
            <Route path="/resources" element={<PublicLayout><Resources /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/join" element={<PublicLayout><JoinTeam /></PublicLayout>} />
            <Route path="/privacy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
            <Route path="/terms" element={<PublicLayout><TermsOfUse /></PublicLayout>} />
            
            {/* AUTHENTICATION */}
            <Route path="/login" element={<Login />} />
            <Route path="/client-portal" element={<PublicLayout><ClientPortal /></PublicLayout>} />

            {/* ADVISOR TERMINAL (CRM) */}
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
              <Route path="legal" element={<LegalCompliance />} />
              <Route path="integrations" element={<IntegrationsHub />} />
              <Route path="automation" element={<AutomationStudio />} />
              
              {/* VERTICAL HUBS */}
              <Route path="applications" element={<PoliciesApps />} />
              <Route path="properties" element={<PropertyPipeline />} />
              <Route path="escrow" element={<TransactionsEscrow />} />
              <Route path="loans" element={<LoanApplications />} />
              <Route path="rates" element={<RateTools />} />
              {/* Corrected typo: changed element={<RefianceCalc />} to element={<RefinanceCalc />} */}
              <Route path="refi-calc" element={<RefinanceCalc />} />
              <Route path="portfolio" element={<PortfolioMgmt />} />
              <Route path="compliance" element={<ComplianceDocs />} />
              <Route path="fees" element={<AdvisoryFees />} />
              
              {/* ADMIN CONTROL PANEL */}
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
    </DataProvider>
  );
};

export default App;