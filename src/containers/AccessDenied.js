import React from "react";
import map from './map.config';

export default function AccessDenied() {
  return (
    <div className="text-center">
      <div className="error mx-auto" data-text="403">403</div>
      <p className="lead text-gray-800 mb-3">Forbidden: Access Denied</p>
      <p className="text-gray-500 mb-0">It looks like you found a glitch in the matrix...</p>
      <a href={map.Dashboard}>&larr; Back to Dashboard</a>
    </div>
  );
}