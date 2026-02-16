'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .error-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .error-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          max-width: 520px;
          width: 100%;
          padding: 3rem 2.5rem;
          position: relative;
          overflow: hidden;
        }
        
        .error-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: #633493;
        }
        
        .icon-wrapper {
          width: 64px;
          height: 64px;
          margin: 0 auto 2rem;
          background: linear-gradient(135deg, #633493 0%, #7e4bb3 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(99, 52, 147, 0.2);
        }
        
        .icon-wrapper svg {
          width: 32px;
          height: 32px;
          color: white;
        }
        
        .error-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 1rem 0;
          text-align: center;
          letter-spacing: -0.025em;
        }
        
        .error-message {
          font-size: 1rem;
          color: #6b7280;
          line-height: 1.625;
          text-align: center;
          margin: 0 0 2.5rem 0;
        }
        
        .button-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }
        
        .btn {
          padding: 0.875rem 1.5rem;
          font-size: 0.9375rem;
          font-weight: 600;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }
        
        .btn-primary {
          background: #633493;
          color: white;
          box-shadow: 0 2px 8px rgba(99, 52, 147, 0.25);
        }
        
        .btn-primary:hover {
          background: #52297a;
          box-shadow: 0 4px 12px rgba(99, 52, 147, 0.35);
          transform: translateY(-1px);
        }
        
        .btn-primary:active {
          transform: translateY(0);
        }
        
        .btn-secondary {
          background: white;
          color: #633493;
          border: 2px solid #633493;
        }
        
        .btn-secondary:hover {
          background: #f8f5fc;
          border-color: #52297a;
          color: #52297a;
        }
        
        .support-section {
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }
        
        .support-text {
          font-size: 0.875rem;
          color: #9ca3af;
          margin: 0;
        }
        
        .support-link {
          color: #633493;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .support-link:hover {
          color: #52297a;
          text-decoration: underline;
        }
        
        @media (max-width: 640px) {
          .error-card {
            padding: 2rem 1.5rem;
          }
          
          .error-title {
            font-size: 1.5rem;
          }
          
          .error-message {
            font-size: 0.9375rem;
          }
        }
      `}</style>
      
      <div className="error-container">
        <div className="error-card">
          <div className="icon-wrapper">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          
          <h1 className="error-title">Something Went Wrong</h1>
          <p className="error-message">
            We encountered an unexpected error while processing your request. 
            Our team has been notified and is working to resolve the issue.
          </p>
          
          <div className="button-group">
            <button onClick={() => reset()} className="btn btn-primary">
              Try Again
            </button>
            <button onClick={() => window.location.href = '/'} className="btn btn-secondary">
              Return to Dashboard
            </button>
          </div>
          
          <div className="support-section">
            <p className="support-text">
              Need assistance?{' '}
              <a href="/support" className="support-link">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}