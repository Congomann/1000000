
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { ProductType, UserRole } from '../../types';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, EyeOff, DollarSign, Briefcase, Shield, Home, TrendingUp, User, FileText, Check, ChevronDown, Building2, Truck, Ruler, Scale, ArrowLeft, Landmark, Percent } from 'lucide-react';

// Reusable Components defined OUTSIDE the component to prevent re-rendering/focus loss
const SectionHeader = ({ icon: Icon, title, description }: any) => (
    <div className="mb-10 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-5 mb-2">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-[1.5rem]"><Icon className="h-7 w-7" /></div>
          <h3 className="text-2xl font-bold text-[#0B2240]">{title}</h3>
        </div>
        {description && <p className="text-slate-500 text-sm ml-[4.25rem] font-medium">{description}</p>}
    </div>
);

const InputGroup = ({ label, type = "text", value, onChange, placeholder, required = false, icon: Icon, isMasked, showMask, toggleMask }: any) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-2 tracking-wider">{label} {required && <span className="text-red-500">*</span>}</label>
        <div className="relative">
            {Icon && <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"><Icon className="h-5 w-5" /></div>}
            <input 
                type={isMasked && !showMask ? "password" : type}
                className={`w-full bg-white text-slate-900 border border-slate-200 rounded-[2rem] py-4 text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent transition-all focus:bg-white ${Icon ? 'pl-14' : 'pl-6'} ${isMasked ? 'pr-14' : 'pr-6'}`}
                placeholder={placeholder}
                value={value || ''}
                onChange={e => onChange(e.target.value)}
                required={required}
            />
            {isMasked && (
                <button type="button" onClick={toggleMask} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showMask ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            )}
        </div>
    </div>
);

const SelectGroup = ({ label, value, onChange, options, required }: any) => (
  <div>
      <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-2 tracking-wider">{label} {required && <span className="text-red-500">*</span>}</label>
      <div className="relative">
          <select 
              className="w-full bg-white text-slate-900 border border-slate-200 rounded-[2rem] px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent appearance-none focus:bg-white transition-all"
              value={value || ''}
              onChange={e => onChange(e.target.value)}
          >
              <option value="">Select...</option>
              {options.map((opt: any) => (
                  <option key={opt} value={opt}>{opt}</option>
              ))}
          </select>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown className="h-4 w-4" />
          </div>
      </div>
  </div>
);

export const LeadIntake: React.FC = () => {
  const { addLead, availableCarriers, allUsers } = useData();
  const navigate = useNavigate();
  
  // Form State
  const [productType, setProductType] = useState<ProductType>(ProductType.LIFE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignTo, setAssignTo] = useState('');

  // General Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [notes, setNotes] = useState('');

  // Specialized States
  const [details, setDetails] = useState<any>({});
  const [showSSN, setShowSSN] = useState(false);

  // Filter Advisors
  const advisors = useMemo(() => allUsers.filter(u => u.role === UserRole.ADVISOR), [allUsers]);

  const handleDetailsChange = (key: string, value: any) => {
      setDetails((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleProductChange = (type: ProductType) => {
    setProductType(type);
    setDetails({}); // Reset specialized details on type switch
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      const newLead: any = {
          name,
          email,
          phone,
          interest: productType,
          message: notes || `Manual intake for ${productType}`,
      };

      // Map details based on type
      if (productType === ProductType.LIFE || productType === ProductType.FINAL_EXPENSE || productType === ProductType.ANNUITY || productType === ProductType.IUL) {
          newLead.lifeDetails = { ...details, address: street, city, state, zip };
      } else if (productType === ProductType.REAL_ESTATE || productType === ProductType.MORTGAGE) {
          newLead.realEstateDetails = { ...details, location: `${city}, ${state}` };
      } else if (productType === ProductType.SECURITIES) {
          newLead.securitiesDetails = { ...details };
      } else if (productType === ProductType.AUTO) {
          newLead.customDetails = { ...details, address: street, city, state, zip };
      } else {
          newLead.customDetails = { ...details, address: street, city, state, zip };
      }

      // Simulate API delay
      setTimeout(() => {
        addLead(newLead, assignTo || undefined);
        setIsSubmitting(false);
        navigate('/crm/leads');
      }, 800);
  };

  // Filter available carriers based on product type
  const carrierOptions = useMemo(() => {
    let category = '';
    switch (productType) {
        case ProductType.LIFE:
        case ProductType.IUL:
        case ProductType.FINAL_EXPENSE:
            category = 'LIFE INSURANCE';
            break;
        case ProductType.ANNUITY:
            category = 'ANNUITIES';
            break;
        case ProductType.REAL_ESTATE:
            category = 'REAL ESTATE';
            break;
        case ProductType.SECURITIES:
            category = 'SECURITIES';
            break;
        case ProductType.PROPERTY:
            category = 'PROPERTY';
            break;
        case ProductType.AUTO:
        case ProductType.COMMERCIAL:
        case ProductType.BUSINESS:
        case ProductType.EO:
            category = 'AUTO / COMMERCIAL';
            break;
        case ProductType.MORTGAGE:
            category = 'REAL ESTATE'; // Re-use real estate for now or create new category if carriers added
            break;
        default: 
            // Try to map generic health/medicare if needed, or return all/none
            if (String(productType).includes('Health')) category = 'HEALTH / MEDICARE';
            break;
    }
    return availableCarriers.filter(c => c.category === category).map(c => c.name);
  }, [productType, availableCarriers]);
  
  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="mb-8">
          <button 
            onClick={() => navigate('/crm/leads')} 
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-sm transition-colors mb-4"
          >
              <ArrowLeft className="h-4 w-4" /> Back to Leads
          </button>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-[#0B2240] tracking-tight mb-2">New Lead Intake</h1>
            <p className="text-slate-500 text-lg font-medium">Create a new client record. Select the product vertical to customize the form.</p>
          </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden mb-12 p-3">
          <div className="p-4 bg-slate-50 rounded-[2.5rem] flex flex-wrap gap-3 justify-center md:justify-start">
            {Object.values(ProductType).map((pt) => {
                // Determine icon based on type (simplified mapping)
                let Icon = FileText;
                if (pt === ProductType.LIFE) Icon = Shield;
                if (pt === ProductType.REAL_ESTATE) Icon = Home;
                if (pt === ProductType.SECURITIES) Icon = TrendingUp;
                if (pt === ProductType.BUSINESS) Icon = Briefcase;
                if (pt === ProductType.ANNUITY) Icon = DollarSign;
                if (pt === ProductType.AUTO) Icon = Truck;
                if (pt === ProductType.MORTGAGE) Icon = Landmark;

                const isActive = productType === pt;
                return (
                    <button
                        key={pt}
                        onClick={() => handleProductChange(pt)}
                        className={`flex items-center gap-2 px-6 py-4 rounded-[2rem] text-sm font-bold transition-all duration-300 ${
                            isActive 
                            ? 'bg-[#0A62A7] text-white shadow-xl transform scale-105' 
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-100 hover:border-slate-200'
                        }`}
                    >
                        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        {pt}
                        {isActive && <Check className="h-3 w-3 ml-1" />}
                    </button>
                );
            })}
          </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Step 1: Core Information (Always Visible) */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 md:p-12">
            <SectionHeader icon={User} title="Personal Information" description="Basic contact details required for all leads." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="Full Name" value={name} onChange={setName} required placeholder="Jane Doe" />
                <InputGroup label="Email Address" type="email" value={email} onChange={setEmail} required placeholder="jane@example.com" />
                <InputGroup label="Phone Number" type="tel" value={phone} onChange={setPhone} required placeholder="(555) 555-5555" />
                <InputGroup label="Date of Birth" type="date" value={details.dob} onChange={(v: string) => handleDetailsChange('dob', v)} />
            </div>
        </div>

        {/* Step 2: Address (Conditional) */}
        {productType !== ProductType.SECURITIES && (
             <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 md:p-12">
                  <SectionHeader icon={Home} title="Residential Address" description="Primary residence for mailing and regional assignment." />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2">
                        <InputGroup label="Street Address" value={street} onChange={setStreet} placeholder="123 Maple Ave" />
                      </div>
                      <InputGroup label="City" value={city} onChange={setCity} placeholder="Springfield" />
                      <div className="grid grid-cols-2 gap-6">
                          <SelectGroup label="State" value={state} onChange={setState} options={['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']} />
                          <InputGroup label="Zip Code" value={zip} onChange={setZip} placeholder="12345" />
                      </div>
                  </div>
             </div>
        )}

        {/* Step 3: Product Specific Details */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 md:p-12 animate-fade-in">
             {/* Dynamic Content based on Product Type */}
             
             {/* LIFE / FINAL EXPENSE / IUL / ANNUITY */}
             {(productType === ProductType.LIFE || productType === ProductType.FINAL_EXPENSE || productType === ProductType.ANNUITY || productType === ProductType.IUL) && (
                  <>
                    <SectionHeader icon={Shield} title={`${productType} Details`} description="Coverage needs, financials, and health underwriting questions." />
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                             {carrierOptions.length > 0 && (
                                <SelectGroup label="Preferred Carrier" value={details.preferredCarrier} onChange={(v: string) => handleDetailsChange('preferredCarrier', v)} options={carrierOptions} />
                             )}
                             <InputGroup label="Preferred Coverage" icon={DollarSign} type="number" value={details.preferredCoverage} onChange={(v: string) => handleDetailsChange('preferredCoverage', v)} placeholder="500000" />
                             <InputGroup label="Monthly Premium Target" icon={DollarSign} type="number" value={details.monthlyPremium} onChange={(v: string) => handleDetailsChange('monthlyPremium', v)} placeholder="150" />
                             <InputGroup label="Annual Income" icon={DollarSign} type="number" value={details.annualIncome} onChange={(v: string) => handleDetailsChange('annualIncome', v)} placeholder="75000" />
                             <SelectGroup label="Smoker Status" value={details.smokingStatus} onChange={(v: string) => handleDetailsChange('smokingStatus', v)} options={['Non-Smoker', 'Smoker', 'Former Smoker']} />
                             <InputGroup label="SSN" isMasked showMask={showSSN} toggleMask={() => setShowSSN(!showSSN)} value={details.ssn} onChange={(v: string) => handleDetailsChange('ssn', v)} placeholder="000-00-0000" />
                             <InputGroup label="Net Worth" icon={DollarSign} type="number" value={details.netWorth} onChange={(v: string) => handleDetailsChange('netWorth', v)} placeholder="250000" />
                             
                             {/* Added Height and Weight */}
                             <InputGroup label="Height" icon={Ruler} value={details.height} onChange={(v: string) => handleDetailsChange('height', v)} placeholder="5' 10&quot;" />
                             <InputGroup label="Weight" icon={Scale} value={details.weight} onChange={(v: string) => handleDetailsChange('weight', v)} placeholder="180 lbs" />
                        </div>
                        
                        <div className="border-t border-slate-100 pt-8">
                            <h4 className="text-sm font-bold text-[#0B2240] mb-6 uppercase tracking-wider pl-2">Banking & Health</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InputGroup label="Bank Name" value={details.bankName} onChange={(v: string) => handleDetailsChange('bankName', v)} placeholder="Chase" />
                                <InputGroup label="Routing Number" value={details.routingNumber} onChange={(v: string) => handleDetailsChange('routingNumber', v)} placeholder="123456789" />
                                <InputGroup label="Account Number" value={details.accountNumber} onChange={(v: string) => handleDetailsChange('accountNumber', v)} placeholder="000123456" />
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-2 tracking-wider">Health Issues / Notes</label>
                                    <textarea 
                                        className="w-full bg-white text-slate-900 border border-slate-200 rounded-[2rem] p-6 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent resize-none font-medium transition-all focus:bg-white"
                                        rows={3}
                                        placeholder="List any major medical conditions..."
                                        value={details.healthIssues || ''}
                                        onChange={e => handleDetailsChange('healthIssues', e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                  </>
              )}

              {/* REAL ESTATE */}
              {productType === ProductType.REAL_ESTATE && (
                  <>
                    <SectionHeader icon={Home} title="Property Requirements" description="Specification for buying, selling, or investing in real estate." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {carrierOptions.length > 0 && (
                                <SelectGroup label="Preferred Carrier/Partner" value={details.preferredCarrier} onChange={(v: string) => handleDetailsChange('preferredCarrier', v)} options={carrierOptions} />
                          )}
                          <SelectGroup label="Property Type" value={details.propertyType} onChange={(v: string) => handleDetailsChange('propertyType', v)} options={['Residential', 'Commercial', 'Land', 'Multi-Family']} />
                          <SelectGroup label="Transaction Type" value={details.purpose} onChange={(v: string) => handleDetailsChange('purpose', v)} options={['Buy', 'Sell', 'Invest', 'Rent']} />
                          <InputGroup label="Budget / Price Range" icon={DollarSign} type="number" value={details.budget} onChange={(v: string) => handleDetailsChange('budget', v)} placeholder="350000" />
                          <SelectGroup label="Timeframe" value={details.timeframe} onChange={(v: string) => handleDetailsChange('timeframe', v)} options={['ASAP', '1-3 Months', '3-6 Months', '6+ Months']} />
                          <SelectGroup label="Pre-Approval Status" value={details.preApprovalStatus} onChange={(v: string) => handleDetailsChange('preApprovalStatus', v)} options={['Yes', 'No', 'Cash Buyer']} />
                      </div>
                  </>
              )}

              {/* MORTGAGE */}
              {productType === ProductType.MORTGAGE && (
                  <>
                    <SectionHeader icon={Landmark} title="Loan Details" description="Refinance, Purchase, or Equity Extraction details." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <SelectGroup label="Loan Purpose" value={details.purpose} onChange={(v: string) => handleDetailsChange('purpose', v)} options={['Purchase', 'Refinance (Rate/Term)', 'Refinance (Cash Out)', 'HELOC']} />
                          <InputGroup label="Estimated Property Value" icon={DollarSign} type="number" value={details.propertyValue} onChange={(v: string) => handleDetailsChange('propertyValue', v)} placeholder="450000" />
                          <InputGroup label="Current Loan Balance" icon={DollarSign} type="number" value={details.loanBalance} onChange={(v: string) => handleDetailsChange('loanBalance', v)} placeholder="320000" />
                          <InputGroup label="Current Interest Rate (%)" icon={Percent} type="number" value={details.currentRate} onChange={(v: string) => handleDetailsChange('currentRate', v)} placeholder="6.5" />
                          <InputGroup label="Desired Loan Amount" icon={DollarSign} type="number" value={details.desiredAmount} onChange={(v: string) => handleDetailsChange('desiredAmount', v)} placeholder="350000" />
                          <SelectGroup label="Credit Score Estimate" value={details.creditScore} onChange={(v: string) => handleDetailsChange('creditScore', v)} options={['Excellent (720+)', 'Good (680-719)', 'Fair (640-679)', 'Poor (<640)']} />
                      </div>
                  </>
              )}

              {/* SECURITIES */}
              {productType === ProductType.SECURITIES && (
                  <>
                      <SectionHeader icon={TrendingUp} title="Investment Profile" description="Risk assessment and asset management details." />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {carrierOptions.length > 0 && (
                                <SelectGroup label="Preferred Carrier/Broker" value={details.preferredCarrier} onChange={(v: string) => handleDetailsChange('preferredCarrier', v)} options={carrierOptions} />
                          )}
                          <SelectGroup label="Experience Level" value={details.experience} onChange={(v: string) => handleDetailsChange('experience', v)} options={['Novice', 'Intermediate', 'Expert']} />
                          <SelectGroup label="Risk Tolerance" value={details.riskTolerance} onChange={(v: string) => handleDetailsChange('riskTolerance', v)} options={['Conservative', 'Moderate', 'Aggressive', 'Speculative']} />
                          <InputGroup label="Est. Assets Under Management" icon={DollarSign} type="number" value={details.aum} onChange={(v: string) => handleDetailsChange('aum', v)} placeholder="500000" />
                          <SelectGroup label="Compliance Status" value={details.complianceStatus} onChange={(v: string) => handleDetailsChange('complianceStatus', v)} options={['Pending', 'Cleared', 'Flagged']} />
                      </div>
                  </>
              )}
              
              {/* BUSINESS / COMMERCIAL */}
              {(productType === ProductType.BUSINESS || productType === ProductType.COMMERCIAL || productType === ProductType.EO) && (
                  <>
                      <SectionHeader icon={Briefcase} title="Business Information" description="Commercial entity details and risk exposure." />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {carrierOptions.length > 0 && (
                                <SelectGroup label="Preferred Carrier" value={details.preferredCarrier} onChange={(v: string) => handleDetailsChange('preferredCarrier', v)} options={carrierOptions} />
                          )}
                          <InputGroup label="Business Name" value={details.businessName} onChange={(v: string) => handleDetailsChange('businessName', v)} placeholder="Acme Corp" />
                          <InputGroup label="Industry" value={details.industry} onChange={(v: string) => handleDetailsChange('industry', v)} placeholder="Technology" />
                          <InputGroup label="Annual Revenue" icon={DollarSign} type="number" value={details.revenue} onChange={(v: string) => handleDetailsChange('revenue', v)} placeholder="1000000" />
                          <InputGroup label="Number of Employees" type="number" value={details.employees} onChange={(v: string) => handleDetailsChange('employees', v)} placeholder="10" />
                      </div>
                  </>
              )}

              {/* AUTO INSURANCE */}
              {productType === ProductType.AUTO && (
                  <>
                      <SectionHeader icon={Truck} title="Auto Insurance Details" description="Vehicle and driver information." />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {carrierOptions.length > 0 && (
                                <SelectGroup label="Preferred Carrier" value={details.preferredCarrier} onChange={(v: string) => handleDetailsChange('preferredCarrier', v)} options={carrierOptions} />
                          )}
                          <InputGroup label="Current Insurer" value={details.currentInsurer} onChange={(v: string) => handleDetailsChange('currentInsurer', v)} placeholder="Geico, Progressive..." />
                          <div className="md:col-span-2">
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-2 tracking-wider">Vehicles to Insure</label>
                              <textarea
                                  className="w-full bg-white text-slate-900 border border-slate-200 rounded-[2rem] p-6 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent resize-none font-medium transition-all focus:bg-white"
                                  rows={3}
                                  placeholder="Year Make Model, VIN (if available)..."
                                  value={details.vehicles || ''}
                                  onChange={e => handleDetailsChange('vehicles', e.target.value)}
                              ></textarea>
                          </div>
                          <div className="md:col-span-2">
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-2 tracking-wider">Drivers</label>
                              <textarea
                                  className="w-full bg-white text-slate-900 border border-slate-200 rounded-[2rem] p-6 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent resize-none font-medium transition-all focus:bg-white"
                                  rows={2}
                                  placeholder="Name, DOB, License Number..."
                                  value={details.drivers || ''}
                                  onChange={e => handleDetailsChange('drivers', e.target.value)}
                              ></textarea>
                          </div>
                      </div>
                  </>
              )}

              {/* GENERIC FALLBACK */}
              {!([ProductType.LIFE, ProductType.FINAL_EXPENSE, ProductType.ANNUITY, ProductType.IUL, ProductType.REAL_ESTATE, ProductType.SECURITIES, ProductType.BUSINESS, ProductType.COMMERCIAL, ProductType.EO, ProductType.AUTO, ProductType.MORTGAGE].includes(productType)) && (
                   <div className="text-center py-12">
                        <div className="p-6 bg-slate-50 rounded-full inline-block mb-6">
                            <FileText className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Standard Inquiry</h3>
                        <p className="text-slate-500 mt-2 font-medium">Please provide any specific details in the notes section below.</p>
                   </div>
              )}
        </div>

        {/* Step 4: Notes & Submit */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 md:p-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-4 ml-2 tracking-wider">Internal Notes / Agent Remarks</label>
                      <textarea 
                        className="w-full bg-white text-slate-900 border border-slate-200 rounded-[2rem] p-6 text-sm focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent resize-none font-medium transition-all focus:bg-white"
                        rows={4}
                        placeholder="Source of lead, initial impressions, follow-up requirements..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                      ></textarea>
                </div>
                <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-4 ml-2 tracking-wider">Assign To Advisor (Optional)</label>
                     <div className="relative">
                          <select 
                              className="w-full bg-white text-slate-900 border border-slate-200 rounded-[2rem] px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent appearance-none focus:bg-white transition-all"
                              value={assignTo}
                              onChange={e => setAssignTo(e.target.value)}
                          >
                              <option value="">Unassigned (Pool)</option>
                              {advisors.map(adv => (
                                  <option key={adv.id} value={adv.id}>{adv.name} ({adv.category})</option>
                              ))}
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <ChevronDown className="h-4 w-4" />
                          </div>
                     </div>
                     <p className="text-xs text-slate-400 mt-3 ml-2 font-medium">Selected advisor will be notified immediately.</p>
                </div>
             </div>

              <div className="flex justify-end pt-10 mt-6 border-t border-slate-100">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-[#0A62A7] text-white px-12 py-5 rounded-full font-black text-base shadow-2xl shadow-blue-900/30 hover:bg-blue-700 transition-all flex items-center gap-3 transform active:scale-95 hover:scale-105"
                  >
                      {isSubmitting ? 'Saving...' : <><Save className="h-5 w-5" /> Save & Create Lead</>}
                  </button>
              </div>
        </div>

      </form>
    </div>
  );
};
