import React from 'react';
import { PenaltyDisplay } from '../../components/penalties';

export default function MyPenaltiesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-custom">
        <PenaltyDisplay showHistory={true} />
      </div>
    </div>
  );
}
