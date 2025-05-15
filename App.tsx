import React, { useState, useEffect } from 'react';
import LoanForm from './components/LoanForm';
import Results from './components/Results';
import InfoSection from './components/InfoSection';
import ModelInsights from './components/ModelInsights';
import ThemeToggle from './components/ThemeToggle';
import { predictLoanApproval } from './utils/predictionModel';

function App() {
  const [formData, setFormData] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Check for user preference in localStorage or system preference
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleFormSubmit = (data: any) => {
    setFormData(data);
    // Simulate processing delay
    setTimeout(() => {
      const result = predictLoanApproval(data);
      setPrediction(result);
    }, 1500);
  };

  const resetApplication = () => {
    setFormData(null);
    setPrediction(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">LoanEligibility</h1>
          <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {formData && prediction ? (
          <Results 
            approved={prediction.approved} 
            confidence={prediction.confidence} 
            formData={formData}
            onReset={resetApplication}
          />
        ) : formData && !prediction ? (
          <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="animate-pulse-slow inline-block p-4 rounded-full bg-blue-50 dark:bg-blue-900 mb-4">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Processing Your Application</h2>
            <p className="text-gray-600 dark:text-gray-400">We're analyzing your information to determine your loan eligibility...</p>
            <div className="mt-4 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="animate-reveal h-full bg-blue-500 rounded-full"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Check Your Loan Eligibility</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Fill out the form below to instantly check if you qualify for a loan. Our predictive model
                will analyze your information and provide you with a decision in seconds.
              </p>
            </div>
            <LoanForm onSubmit={handleFormSubmit} />
            <div className="mt-8">
              <ModelInsights />
              <InfoSection />
            </div>
          </>
        )}
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow-inner mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} LoanEligibility. This is a demonstration application. 
            Predictions are based on a sample model and should not be used for actual loan decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;