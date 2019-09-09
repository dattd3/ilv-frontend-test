import React from "react";
import { Link } from 'react-router-dom';
import PageNotFound from '../assets/img/404.png';

export default function NotFound({ location }) {
  return (
    <div>
      <img src={PageNotFound} style={{ display: 'block', margin: 'auto', position: 'relative' }} />
      <center><Link to="/">Return to Home Page</Link></center>
    </div>
  );
}
