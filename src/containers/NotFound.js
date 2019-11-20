import React from "react"; 
import map from './map.config';

export default function NotFound({ location }) {
  return (
    <div className="text-center">
      <div className="error mx-auto" data-text="404">404</div>
      <p className="lead text-gray-800 mb-2">Page Not Found</p>
      <p className="text-gray-500 mb-0">It looks like you found a glitch in the matrix...</p>
      <a href={map.Dashboard}>&larr; Back to Dashboard</a>
    </div>
  );
}
