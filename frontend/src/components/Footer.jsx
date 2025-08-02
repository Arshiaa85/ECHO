import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-neutral mt-auto">
      <div className="container mx-auto py-6 px-4 text-center sm:text-left">
        <div className="sm:flex sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm">&copy; 2025 Echo. All rights reserved.</p>
          </div>
          <div>
            <p className="text-xs">Disclaimer: Echo is a supportive tool and not a replacement for professional medical advice.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;