require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = require('../models/User');
const Scheme = require('../models/Scheme');
const EligibilityRule = require('../models/EligibilityRule');
const { DocumentType } = require('../models/DocumentRecord');
const ChannelPartner = require('../models/ChannelPartner');

const NSFDC_SOURCE = 'https://nsfdc.nic.in/';
const NSFDC_FAQ = 'https://nsfdc.nic.in/faqs';
const DFS_SOURCE = 'https://financialservices.gov.in/';
const PMMY_SOURCE = 'https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy';
const SUPI_SOURCE = 'https://financialservices.gov.in/stand-india-scheme-supi';

const now = new Date();

const schemesData = [
  {
    name: 'NSFDC Micro Finance Scheme',
    shortName: 'NSFDC Micro Finance',
    organization: 'NSFDC',
    department: 'Ministry of Social Justice and Empowerment',
    schemeType: 'NSFDC',
    description: 'Small-ticket collateral-free loans channeled through State Channelising Agencies (SCAs) / eligible NBFC-MFIs to help SC beneficiaries take up small income-generating activities.',
    purpose: 'Provide small, collateral-free credit support for micro-enterprises and self-employment activities.',
    beneficiaryCategories: ['SC'],
    businessTypes: ['Micro Enterprise', 'Self Employment'],
    eligibleActivities: ['Small trading', 'Service activities', 'Small manufacturing', 'Agri-allied activities'],
    minAge: 18,
    maxAge: 55,
    minIncome: 0,
    maxIncome: 300000,
    minProjectCost: 5000,
    maxProjectCost: 150000,
    minLoanAmount: 5000,
    maxLoanAmount: 150000,
    interestRate: 'Concessional rate as notified by NSFDC (channelised through SCA/NBFC-MFI); refer official source for current rate.',
    repaymentPeriod: 'Up to 5 years (varies by loan size)',
    moratorium: 'Typically up to 6 months, as applicable',
    subsidy: 'Not applicable / refer scheme guidelines',
    benefits: ['Collateral-free credit', 'Concessional interest rate', 'Support for first-time entrepreneurs'],
    locationRules: 'All India, channelised through State Channelising Agencies (SCA) / eligible NBFC-MFIs',
    requiredDocuments: ['Aadhaar/Identity Proof', 'Caste Certificate', 'Income Certificate', 'Address Proof', 'Bank Account Details', 'Business/Project Report'],
    channelPartnerTypes: ['SCA', 'NBFC-MFI'],
    applicationMethod: 'Through State Channelising Agency (SCA) or empanelled NBFC-MFI',
    applicationInstructions: 'Contact your state SCA or an NSFDC-empanelled NBFC-MFI with the required documents and a brief project proposal.',
    officialApplicationUrl: NSFDC_SOURCE,
    officialSourceUrl: NSFDC_SOURCE,
    sourceName: 'National Scheduled Castes Finance and Development Corporation (NSFDC)',
    lastVerifiedAt: now,
    version: 1,
    status: 'active',
  },
  {
    name: 'NSFDC Aajeevika Micro-Finance Yojana',
    shortName: 'Aajeevika Micro-Finance',
    organization: 'NSFDC',
    department: 'Ministry of Social Justice and Empowerment',
    schemeType: 'NSFDC',
    description: 'Micro-finance scheme aimed at SC beneficiaries, particularly women, for setting up small livelihood/income-generating activities through channel partners.',
    purpose: 'Promote livelihood generation and self-reliance among SC beneficiaries, with focus on women entrepreneurs.',
    beneficiaryCategories: ['SC', 'Women'],
    businessTypes: ['Micro Enterprise', 'Self Employment', 'Livelihood Activity'],
    eligibleActivities: ['Tailoring', 'Small retail', 'Food processing', 'Handicrafts', 'Livestock rearing'],
    minAge: 18,
    maxAge: 55,
    minIncome: 0,
    maxIncome: 300000,
    minProjectCost: 5000,
    maxProjectCost: 125000,
    minLoanAmount: 5000,
    maxLoanAmount: 125000,
    interestRate: 'Concessional rate as notified by NSFDC; refer official source for current rate.',
    repaymentPeriod: 'Up to 5 years',
    moratorium: 'As applicable, typically up to 6 months',
    subsidy: 'Not applicable / refer scheme guidelines',
    benefits: ['Collateral-free micro-credit', 'Focus on women beneficiaries', 'Livelihood support'],
    locationRules: 'All India, channelised through SCA / eligible NBFC-MFI',
    requiredDocuments: ['Aadhaar/Identity Proof', 'Caste Certificate', 'Income Certificate', 'Address Proof', 'Bank Account Details', 'Business/Project Report'],
    channelPartnerTypes: ['SCA', 'NBFC-MFI'],
    applicationMethod: 'Through State Channelising Agency (SCA) or empanelled NBFC-MFI',
    applicationInstructions: 'Approach the nearest SCA/NBFC-MFI channel partner with identity, caste, income proof and a short activity plan.',
    officialApplicationUrl: NSFDC_SOURCE,
    officialSourceUrl: NSFDC_SOURCE,
    sourceName: 'National Scheduled Castes Finance and Development Corporation (NSFDC)',
    lastVerifiedAt: now,
    version: 1,
    status: 'active',
  },
  {
    name: 'NSFDC Term Loan',
    shortName: 'NSFDC Term Loan',
    organization: 'NSFDC',
    department: 'Ministry of Social Justice and Empowerment',
    schemeType: 'NSFDC',
    description: 'Term loan financing for SC beneficiaries to set up viable income-generating ventures larger than typical micro-finance limits, channelised through SCAs/PSBs/RRBs.',
    purpose: 'Enable medium-scale self-employment ventures with structured term financing.',
    beneficiaryCategories: ['SC'],
    businessTypes: ['Small Enterprise', 'Manufacturing Unit', 'Service Enterprise'],
    eligibleActivities: ['Manufacturing', 'Service sector ventures', 'Trading establishments'],
    minAge: 18,
    maxAge: 55,
    minIncome: 0,
    maxIncome: 300000,
    minProjectCost: 100000,
    maxProjectCost: 3000000,
    minLoanAmount: 100000,
    maxLoanAmount: 3000000,
    interestRate: 'Concessional rate as notified by NSFDC, slab-based on loan amount; refer official source.',
    repaymentPeriod: 'Up to 10 years depending on project',
    moratorium: 'Project-dependent, refer scheme guidelines',
    subsidy: 'Not applicable / refer scheme guidelines',
    benefits: ['Larger ticket-size financing', 'Structured term repayment', 'Support for scaling existing micro-enterprises'],
    locationRules: 'All India, channelised through SCA / PSB / RRB',
    requiredDocuments: ['Aadhaar/Identity Proof', 'Caste Certificate', 'Income Certificate', 'Address Proof', 'Bank Account Details', 'Business/Project Report', 'Quotation'],
    channelPartnerTypes: ['SCA', 'PSB', 'RRB'],
    applicationMethod: 'Through State Channelising Agency (SCA), Public Sector Bank (PSB) or Regional Rural Bank (RRB)',
    applicationInstructions: 'Submit a detailed project report along with required documents to the designated channel partner.',
    officialApplicationUrl: NSFDC_SOURCE,
    officialSourceUrl: NSFDC_SOURCE,
    sourceName: 'National Scheduled Castes Finance and Development Corporation (NSFDC)',
    lastVerifiedAt: now,
    version: 1,
    status: 'active',
  },
  {
    name: 'NSFDC Udyam Nidhi Yojana',
    shortName: 'Udyam Nidhi',
    organization: 'NSFDC',
    department: 'Ministry of Social Justice and Empowerment',
    schemeType: 'NSFDC',
    description: 'Scheme to promote self-employment ventures among SC youth by financing project costs above the micro-finance ceiling but requiring more structured entrepreneurial planning.',
    purpose: 'Support entrepreneurial SC youth in setting up self-employment ventures.',
    beneficiaryCategories: ['SC'],
    businessTypes: ['Self Employment Venture', 'Small Enterprise'],
    eligibleActivities: ['Manufacturing', 'Trading', 'Service ventures'],
    minAge: 18,
    maxAge: 45,
    minIncome: 0,
    maxIncome: 300000,
    minProjectCost: 50000,
    maxProjectCost: 1000000,
    minLoanAmount: 50000,
    maxLoanAmount: 1000000,
    interestRate: 'Concessional rate as notified by NSFDC; refer official source for current rate.',
    repaymentPeriod: 'Up to 8 years',
    moratorium: 'As applicable',
    subsidy: 'Not applicable / refer scheme guidelines',
    benefits: ['Support for youth entrepreneurship', 'Structured term financing'],
    locationRules: 'All India, channelised through SCA / eligible channel partner',
    requiredDocuments: ['Aadhaar/Identity Proof', 'Caste Certificate', 'Income Certificate', 'Address Proof', 'Bank Account Details', 'Business/Project Report'],
    channelPartnerTypes: ['SCA', 'NBFC-MFI'],
    applicationMethod: 'Through State Channelising Agency (SCA)',
    applicationInstructions: 'Approach the SCA with a project proposal and required eligibility documents.',
    officialApplicationUrl: NSFDC_SOURCE,
    officialSourceUrl: NSFDC_SOURCE,
    sourceName: 'National Scheduled Castes Finance and Development Corporation (NSFDC)',
    lastVerifiedAt: now,
    version: 1,
    status: 'active',
  },
  {
    name: 'NSFDC Educational Loan Scheme',
    shortName: 'NSFDC Education Loan',
    organization: 'NSFDC',
    department: 'Ministry of Social Justice and Empowerment',
    schemeType: 'NSFDC',
    description: 'Educational loans for SC students to pursue professional/technical education in India and abroad, channelised through SCAs.',
    purpose: 'Enable access to higher/professional education for SC students facing financial constraints.',
    beneficiaryCategories: ['SC'],
    businessTypes: ['N/A - Education'],
    eligibleActivities: ['Professional courses', 'Technical education', 'Higher education'],
    minAge: 16,
    maxAge: 35,
    minIncome: 0,
    maxIncome: 300000,
    minProjectCost: 10000,
    maxProjectCost: 2000000,
    minLoanAmount: 10000,
    maxLoanAmount: 2000000,
    interestRate: 'Concessional educational loan rate as notified by NSFDC; refer official source.',
    repaymentPeriod: 'Course duration plus moratorium, then up to 10 years',
    moratorium: 'Course duration + 1 year (typical, refer scheme guidelines)',
    subsidy: 'Not applicable / refer scheme guidelines',
    benefits: ['Concessional education financing', 'Covers domestic and foreign courses (as applicable)'],
    locationRules: 'All India, channelised through SCA',
    requiredDocuments: ['Aadhaar/Identity Proof', 'Caste Certificate', 'Income Certificate', 'Address Proof', 'Bank Account Details', 'Admission/Course Proof'],
    channelPartnerTypes: ['SCA'],
    applicationMethod: 'Through State Channelising Agency (SCA)',
    applicationInstructions: 'Apply through your state SCA with admission proof, course fee structure, and eligibility documents.',
    officialApplicationUrl: NSFDC_FAQ,
    officialSourceUrl: NSFDC_FAQ,
    sourceName: 'National Scheduled Castes Finance and Development Corporation (NSFDC) — FAQs',
    lastVerifiedAt: now,
    version: 1,
    status: 'active',
  },
  {
    name: 'Pradhan Mantri MUDRA Yojana',
    shortName: 'PMMY',
    organization: 'Department of Financial Services',
    department: 'Ministry of Finance',
    schemeType: 'Other Government Scheme',
    description: 'PMMY provides loans up to ₹20 lakh to non-corporate, non-farm small/micro enterprises, categorized as Shishu, Kishor, Tarun and Tarun Plus based on loan amount, offered through banks, NBFCs and MFIs. Not an NSFDC scheme.',
    purpose: 'Provide institutional credit to micro and small enterprises across all beneficiary categories.',
    beneficiaryCategories: ['General', 'SC', 'ST', 'OBC', 'EWS', 'Women', 'All categories'],
    businessTypes: ['Micro Enterprise', 'Small Enterprise', 'Non-farm income generating activity'],
    eligibleActivities: ['Manufacturing', 'Trading', 'Services', 'Allied agricultural activities'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: null,
    minProjectCost: 0,
    maxProjectCost: 2000000,
    minLoanAmount: 0,
    maxLoanAmount: 2000000,
    interestRate: 'Determined by the lending bank/NBFC/MFI as per RBI/PMMY guidelines; refer official source for current rates.',
    repaymentPeriod: 'As per lending institution norms, typically up to 5 years',
    moratorium: 'As per lending institution norms',
    subsidy: 'Not applicable',
    benefits: ['Collateral-free loans (as per RBI guidelines)', 'Four category tiers (Shishu, Kishor, Tarun, Tarun Plus)', 'Wide network of lending institutions'],
    locationRules: 'All India',
    requiredDocuments: ['Aadhaar/Identity Proof', 'Address Proof', 'Bank Account Details', 'Business/Project Report', 'Passport-size photograph'],
    channelPartnerTypes: ['PSB', 'RRB', 'NBFC-MFI', 'Small Finance Bank', 'Cooperative Bank'],
    applicationMethod: 'Through participating banks, NBFCs, MFIs or the Udyamimitra / PSB Loan portal',
    applicationInstructions: 'Apply through any participating bank/NBFC/MFI branch, or via the official PMMY digital channels.',
    officialApplicationUrl: PMMY_SOURCE,
    officialSourceUrl: PMMY_SOURCE,
    sourceName: 'Department of Financial Services, Ministry of Finance',
    lastVerifiedAt: now,
    version: 1,
    status: 'active',
  },
  {
    name: 'Stand-Up India',
    shortName: 'Stand-Up India',
    organization: 'Department of Financial Services',
    department: 'Ministry of Finance',
    schemeType: 'Other Government Scheme',
    description: 'Facilitates bank loans between ₹10 lakh and ₹1 crore to at least one SC/ST borrower and one woman borrower per bank branch for setting up a greenfield enterprise. Not an NSFDC scheme.',
    purpose: 'Promote entrepreneurship among SC/ST and women borrowers through greenfield enterprise loans.',
    beneficiaryCategories: ['SC', 'ST', 'Women'],
    businessTypes: ['Greenfield Enterprise'],
    eligibleActivities: ['Manufacturing', 'Services', 'Trading', 'Agri-allied activities (as permitted)'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: null,
    minProjectCost: 1000000,
    maxProjectCost: 10000000,
    minLoanAmount: 1000000,
    maxLoanAmount: 10000000,
    interestRate: 'As per bank norms, capped at a defined rate above base rate/MCLR; refer official source.',
    repaymentPeriod: 'Up to 7 years with a maximum moratorium of 18 months',
    moratorium: 'Up to 18 months',
    subsidy: 'Not applicable',
    benefits: ['Composite loan covering term loan and working capital', 'Focused on greenfield ventures for SC/ST and women', 'Handholding support available'],
    locationRules: 'All India, through scheduled commercial bank branches',
    requiredDocuments: ['Aadhaar/Identity Proof', 'Caste Certificate (if applicable)', 'Address Proof', 'Bank Account Details', 'Business/Project Report', 'Quotation'],
    channelPartnerTypes: ['PSB', 'RRB', 'Small Finance Bank', 'Cooperative Bank'],
    applicationMethod: 'Through scheduled commercial bank branches or the Stand-Up India online portal',
    applicationInstructions: 'Apply via the Stand-Up India portal or approach a scheduled commercial bank branch with a detailed project report.',
    officialApplicationUrl: SUPI_SOURCE,
    officialSourceUrl: SUPI_SOURCE,
    sourceName: 'Department of Financial Services, Ministry of Finance',
    lastVerifiedAt: now,
    version: 1,
    status: 'active',
  },
];

// Eligibility rules per scheme, keyed by scheme shortName for readability
function buildRules(schemeMap) {
  const rules = [];

  const push = (shortName, list) => {
    const scheme = schemeMap[shortName];
    if (!scheme) return;
    list.forEach((r) => rules.push({ ...r, schemeId: scheme._id }));
  };

  push('NSFDC Micro Finance', [
    { field: 'category', operator: 'IN', value: ['SC'], ruleType: 'mandatory', priority: 5, explanation: 'Category requirement satisfied (SC beneficiaries)', active: true },
    { field: 'age', operator: 'BETWEEN', value: [18, 55], ruleType: 'mandatory', priority: 4, explanation: 'Age falls within the configured range (18–55)', active: true },
    { field: 'annualIncome', operator: '<=', value: 300000, ruleType: 'mandatory', priority: 4, explanation: 'Income falls within the configured range', active: true },
    { field: 'projectCost', operator: 'BETWEEN', value: [5000, 150000], ruleType: 'mandatory', priority: 3, explanation: 'Project cost falls within the scheme range', active: true },
    { field: 'loanRequired', operator: '<=', value: 150000, ruleType: 'mandatory', priority: 3, explanation: 'Loan requirement falls within the configured limit', active: true },
    { field: 'previousLoanHistory', operator: '!=', value: 'Defaulted', ruleType: 'conditional', priority: 2, explanation: 'No prior default on record — please clarify repayment history with the channel partner', active: true },
  ]);

  push('Aajeevika Micro-Finance', [
    { field: 'category', operator: 'IN', value: ['SC'], ruleType: 'mandatory', priority: 5, explanation: 'Category requirement satisfied (SC beneficiaries)', active: true },
    { field: 'age', operator: 'BETWEEN', value: [18, 55], ruleType: 'mandatory', priority: 4, explanation: 'Age falls within the configured range (18–55)', active: true },
    { field: 'annualIncome', operator: '<=', value: 300000, ruleType: 'mandatory', priority: 4, explanation: 'Income falls within the configured range', active: true },
    { field: 'projectCost', operator: 'BETWEEN', value: [5000, 125000], ruleType: 'mandatory', priority: 3, explanation: 'Project cost falls within the scheme range', active: true },
    { field: 'loanRequired', operator: '<=', value: 125000, ruleType: 'mandatory', priority: 3, explanation: 'Loan requirement falls within the configured limit', active: true },
    { field: 'gender', operator: '==', value: 'Female', ruleType: 'informational', priority: 1, explanation: 'This scheme places special emphasis on women beneficiaries, though it is not restricted to them', active: true },
  ]);

  push('NSFDC Term Loan', [
    { field: 'category', operator: 'IN', value: ['SC'], ruleType: 'mandatory', priority: 5, explanation: 'Category requirement satisfied (SC beneficiaries)', active: true },
    { field: 'age', operator: 'BETWEEN', value: [18, 55], ruleType: 'mandatory', priority: 4, explanation: 'Age falls within the configured range (18–55)', active: true },
    { field: 'annualIncome', operator: '<=', value: 300000, ruleType: 'mandatory', priority: 4, explanation: 'Income falls within the configured range', active: true },
    { field: 'projectCost', operator: 'BETWEEN', value: [100000, 3000000], ruleType: 'mandatory', priority: 3, explanation: 'Project cost falls within the scheme range', active: true },
    { field: 'loanRequired', operator: '<=', value: 3000000, ruleType: 'mandatory', priority: 3, explanation: 'Loan requirement falls within the configured limit', active: true },
    { field: 'businessCategory', operator: 'IN', value: ['Manufacturing', 'Service', 'Trading'], ruleType: 'conditional', priority: 2, explanation: 'Business activity matches an eligible category', active: true },
  ]);

  push('Udyam Nidhi', [
    { field: 'category', operator: 'IN', value: ['SC'], ruleType: 'mandatory', priority: 5, explanation: 'Category requirement satisfied (SC beneficiaries)', active: true },
    { field: 'age', operator: 'BETWEEN', value: [18, 45], ruleType: 'mandatory', priority: 4, explanation: 'Age falls within the configured youth range (18–45)', active: true },
    { field: 'annualIncome', operator: '<=', value: 300000, ruleType: 'mandatory', priority: 4, explanation: 'Income falls within the configured range', active: true },
    { field: 'projectCost', operator: 'BETWEEN', value: [50000, 1000000], ruleType: 'mandatory', priority: 3, explanation: 'Project cost falls within the scheme range', active: true },
    { field: 'loanRequired', operator: '<=', value: 1000000, ruleType: 'mandatory', priority: 3, explanation: 'Loan requirement falls within the configured limit', active: true },
  ]);

  push('NSFDC Education Loan', [
    { field: 'category', operator: 'IN', value: ['SC'], ruleType: 'mandatory', priority: 5, explanation: 'Category requirement satisfied (SC beneficiaries)', active: true },
    { field: 'age', operator: 'BETWEEN', value: [16, 35], ruleType: 'mandatory', priority: 4, explanation: 'Age falls within the configured range (16–35)', active: true },
    { field: 'annualIncome', operator: '<=', value: 300000, ruleType: 'mandatory', priority: 4, explanation: 'Family income falls within the configured range', active: true },
    { field: 'loanRequired', operator: '<=', value: 2000000, ruleType: 'mandatory', priority: 3, explanation: 'Loan requirement falls within the configured limit', active: true },
  ]);

  push('PMMY', [
    { field: 'age', operator: 'BETWEEN', value: [18, 65], ruleType: 'mandatory', priority: 4, explanation: 'Age falls within the configured range (18–65)', active: true },
    { field: 'loanRequired', operator: '<=', value: 2000000, ruleType: 'mandatory', priority: 4, explanation: 'Loan requirement falls within the PMMY limit of ₹20 lakh', active: true },
    { field: 'newOrExistingBusiness', operator: 'IN', value: ['New', 'Existing'], ruleType: 'informational', priority: 1, explanation: 'PMMY supports both new and existing non-farm micro/small enterprises', active: true },
    { field: 'businessCategory', operator: 'IN', value: ['Manufacturing', 'Service', 'Trading'], ruleType: 'conditional', priority: 2, explanation: 'Business activity matches an eligible non-farm category', active: true },
  ]);

  push('Stand-Up India', [
    { field: 'category', operator: 'IN', value: ['SC', 'ST'], ruleType: 'conditional', priority: 3, explanation: 'At least one borrower per bank branch under this scheme must be SC/ST or a woman — category or gender criteria apply', active: true },
    { field: 'age', operator: 'BETWEEN', value: [18, 65], ruleType: 'mandatory', priority: 4, explanation: 'Age falls within the configured range (18–65)', active: true },
    { field: 'loanRequired', operator: 'BETWEEN', value: [1000000, 10000000], ruleType: 'mandatory', priority: 4, explanation: 'Loan requirement falls within the Stand-Up India range (₹10 lakh–₹1 crore)', active: true },
    { field: 'newOrExistingBusiness', operator: '==', value: 'New', ruleType: 'mandatory', priority: 3, explanation: 'Scheme is restricted to greenfield (new) enterprises', active: true },
  ]);

  return rules;
}

const documentTypesData = [
  { name: 'Aadhaar/Identity Proof', category: 'Identity', description: 'Government-issued identity document (Aadhaar, Voter ID, etc.)' },
  { name: 'Caste Certificate', category: 'Identity', description: 'Valid caste certificate issued by competent authority' },
  { name: 'Income Certificate', category: 'Income', description: 'Family/individual income certificate issued by competent authority' },
  { name: 'Address Proof', category: 'Address', description: 'Proof of current residential address' },
  { name: 'Bank Account Details', category: 'Financial', description: 'Bank passbook/statement with account and IFSC details' },
  { name: 'Business/Project Report', category: 'Business', description: 'Brief write-up or project report describing the proposed activity' },
  { name: 'Quotation', category: 'Business', description: 'Vendor quotation for machinery/equipment/assets to be purchased' },
  { name: 'Admission/Course Proof', category: 'Other', description: 'Proof of admission and fee structure for educational loans' },
  { name: 'Passport-size photograph', category: 'Identity', description: 'Recent passport-size photograph' },
  { name: 'Other scheme-specific documents', category: 'Other', description: 'Any additional documents specified by the channel partner' },
];

const partnersData = [
  { name: 'Telangana SC Cooperative Finance Corporation (TSCFC)', type: 'SCA', state: 'Telangana', district: 'Hyderabad', address: 'BC Bhavan, Masab Tank, Hyderabad', latitude: 17.4062, longitude: 78.4691, phone: '040-23310832', schemeShortNames: ['NSFDC Micro Finance', 'Aajeevika Micro-Finance', 'NSFDC Term Loan', 'Udyam Nidhi', 'NSFDC Education Loan'] },
  { name: 'Andhra Pradesh SC Cooperative Finance Corporation', type: 'SCA', state: 'Andhra Pradesh', district: 'Vijayawada', address: 'MG Road, Vijayawada', latitude: 16.5062, longitude: 80.6480, phone: '0866-2571220', schemeShortNames: ['NSFDC Micro Finance', 'NSFDC Term Loan', 'NSFDC Education Loan'] },
  { name: 'Karnataka SC/ST Development Corporation', type: 'SCA', state: 'Karnataka', district: 'Bengaluru Urban', address: 'Rajajinagar, Bengaluru', latitude: 12.9915, longitude: 77.5540, phone: '080-23153391', schemeShortNames: ['NSFDC Micro Finance', 'Aajeevika Micro-Finance', 'Udyam Nidhi'] },
  { name: 'Tamil Nadu Adi Dravidar Housing & Development Corp', type: 'SCA', state: 'Tamil Nadu', district: 'Chennai', address: 'Kamarajar Salai, Chennai', latitude: 13.0604, longitude: 80.2824, phone: '044-25619116', schemeShortNames: ['NSFDC Term Loan', 'NSFDC Education Loan'] },
  { name: 'Canara Bank — Punjagutta Branch', type: 'PSB', state: 'Telangana', district: 'Hyderabad', address: 'Punjagutta, Hyderabad', latitude: 17.4239, longitude: 78.4483, phone: '040-23417890', schemeShortNames: ['PMMY', 'Stand-Up India', 'NSFDC Term Loan'] },
  { name: 'State Bank of India — Ameerpet Branch', type: 'PSB', state: 'Telangana', district: 'Hyderabad', address: 'Ameerpet, Hyderabad', latitude: 17.4374, longitude: 78.4483, phone: '040-23730001', schemeShortNames: ['PMMY', 'Stand-Up India'] },
  { name: 'Telangana Grameena Bank — Warangal Branch', type: 'RRB', state: 'Telangana', district: 'Warangal', address: 'Main Road, Warangal', latitude: 17.9689, longitude: 79.5941, phone: '0870-2444555', schemeShortNames: ['PMMY', 'NSFDC Term Loan'] },
  { name: 'Andhra Pragathi Grameena Bank — Kadapa Branch', type: 'RRB', state: 'Andhra Pradesh', district: 'Kadapa', address: 'Railway Station Road, Kadapa', latitude: 14.4674, longitude: 78.8241, phone: '08562-244556', schemeShortNames: ['PMMY', 'Stand-Up India'] },
  { name: 'Bharat Financial Inclusion (NBFC-MFI)', type: 'NBFC-MFI', state: 'Telangana', district: 'Hyderabad', address: 'Gachibowli, Hyderabad', latitude: 17.4401, longitude: 78.3489, phone: '040-30422300', schemeShortNames: ['NSFDC Micro Finance', 'Aajeevika Micro-Finance', 'PMMY'] },
  { name: 'Ujjivan Small Finance Bank — Kukatpally Branch', type: 'Small Finance Bank', state: 'Telangana', district: 'Hyderabad', address: 'KPHB Colony, Kukatpally, Hyderabad', latitude: 17.4849, longitude: 78.3915, phone: '040-49005000', schemeShortNames: ['PMMY', 'Stand-Up India'] },
];

async function seed() {
  await connectDB();
  console.log('Seeding Disha database...');

  // Admin user
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@disha.gov.in').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    admin = await User.create({ name: 'Disha Admin', email: adminEmail, password: hashed, role: 'ADMIN' });
    console.log(`Created admin user: ${adminEmail}`);
  } else {
    console.log('Admin user already exists, skipping creation.');
  }

  // Demo end user
  const demoEmail = 'demo.user@disha.gov.in';
  let demoUser = await User.findOne({ email: demoEmail });
  if (!demoUser) {
    const hashed = await bcrypt.hash('Demo@12345', 10);
    demoUser = await User.create({
      name: 'Demo Beneficiary',
      email: demoEmail,
      password: hashed,
      role: 'USER',
      age: 28,
      gender: 'Female',
      category: 'SC',
      state: 'Telangana',
      district: 'Hyderabad',
      residenceType: 'Urban',
      annualIncome: 180000,
      educationStatus: 'Graduate',
      employmentStatus: 'Self-employed (informal)',
      businessType: 'Micro Enterprise',
      businessActivity: 'Tailoring',
      businessCategory: 'Service',
      newOrExistingBusiness: 'New',
      projectCost: 80000,
      loanRequired: 75000,
      previousLoanHistory: 'None',
    });
    console.log(`Created demo user: ${demoEmail}`);
  }

  // Schemes — upsert by name
  await EligibilityRule.deleteMany({});
  const schemeMap = {};
  for (const s of schemesData) {
    const existing = await Scheme.findOneAndUpdate({ name: s.name }, s, { upsert: true, new: true, setDefaultsOnInsert: true });
    schemeMap[s.shortName] = existing;
  }
  console.log(`Upserted ${schemesData.length} schemes.`);

  // Eligibility rules
  const rules = buildRules(schemeMap);
  await EligibilityRule.insertMany(rules);
  console.log(`Inserted ${rules.length} eligibility rules.`);

  // Document types
  for (const d of documentTypesData) {
    await DocumentType.findOneAndUpdate({ name: d.name }, d, { upsert: true, setDefaultsOnInsert: true });
  }
  console.log(`Upserted ${documentTypesData.length} document types.`);

  // Channel partners
  await ChannelPartner.deleteMany({});
  const partnerDocs = partnersData.map((p) => ({
    name: p.name,
    type: p.type,
    state: p.state,
    district: p.district,
    address: p.address,
    latitude: p.latitude,
    longitude: p.longitude,
    phone: p.phone,
    supportedSchemes: p.schemeShortNames.map((sn) => schemeMap[sn]?._id).filter(Boolean),
    supportedPartnerTypes: [p.type],
    activeStatus: true,
    eligibilityStatus: 'eligible',
    fundUtilizationStatus: 'Demo data — not real-time',
    overdueStatus: 'Demo data — not real-time',
    dataLabel: 'Prototype / Admin-verified dataset',
    lastVerifiedAt: now,
    sourceUrl: p.type === 'SCA' || p.type === 'NBFC-MFI' ? NSFDC_SOURCE : DFS_SOURCE,
  }));
  await ChannelPartner.insertMany(partnerDocs);
  console.log(`Inserted ${partnerDocs.length} channel partners.`);

  console.log('\nSeed complete.');
  console.log(`Admin login -> email: ${adminEmail} | password: ${adminPassword}`);
  console.log(`Demo user login -> email: ${demoEmail} | password: Demo@12345`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
