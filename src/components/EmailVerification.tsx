import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface EmailVerificationProps {
  email: string;
  isVerified: boolean;
}

export function EmailVerification({ email, isVerified }: EmailVerificationProps) {
  const isGoogleEmail = email.toLowerCase().endsWith('@gmail.com');

  if (!isGoogleEmail) {
    return null;
  }

  return (
    <div className="absolute right-3 top-2 flex items-center">
      {isVerified ? (
        <div className="flex items-center text-green-500">
          <CheckCircle className="h-5 w-5 mr-1" />
          <span className="text-xs">Verified</span>
        </div>
      ) : (
        <div className="flex items-center text-red-500">
          <XCircle className="h-5 w-5 mr-1" />
          <span className="text-xs">Not verified</span>
        </div>
      )}
    </div>
  );
}