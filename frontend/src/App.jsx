import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Matches from './pages/Matches';
import Schemes from './pages/Schemes';
import SchemeDetails from './pages/SchemeDetails';
import Compare from './pages/Compare';
import Calculator from './pages/Calculator';
import Documents from './pages/Documents';
import Partners from './pages/Partners';
import Applications from './pages/Applications';
import Profile from './pages/Profile';

import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminSchemes from './admin/AdminSchemes';
import AdminRules from './admin/AdminRules';
import AdminPartners from './admin/AdminPartners';
import AdminDocuments from './admin/AdminDocuments';
import AdminUpdates from './admin/AdminUpdates';
import AdminUsers from './admin/AdminUsers';
import AdminApplications from './admin/AdminApplications';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/schemes/:id" element={<SchemeDetails />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/partners" element={<Partners />} />

        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
        <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="schemes" element={<AdminSchemes />} />
          <Route path="rules" element={<AdminRules />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="updates" element={<AdminUpdates />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="applications" element={<AdminApplications />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">404</h1>
      <p className="text-slate-500">Page not found.</p>
    </div>
  );
}
