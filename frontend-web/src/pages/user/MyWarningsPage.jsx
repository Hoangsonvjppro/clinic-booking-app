import React from 'react';
import { WarningList } from '../../components/warnings';

export default function MyWarningsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-custom">
        <WarningList />
      </div>
    </div>
  );
}
