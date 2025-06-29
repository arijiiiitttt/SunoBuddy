import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

import Signup from './components/pages/Signup';
import Signin from './components/pages/Signin';
import NotFound from './components/Frags/NotFound';
import UnderProcess from './components/Frags/UnderProcess';
import Explainer from './components/pages/Explainer';
import LandingPg from './components/Main/LandingPg';

const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPg />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/read"
          element={
            <ProtectedRoute>
              <Explainer />
            </ProtectedRoute>
          }
        />
        <Route path="/underprocess" element={<UnderProcess />} />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/notfound" />} />
      </Routes>
    </Router>
  );
};

export default App;
