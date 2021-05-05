import React from "react"; 
import map from './map.config';

export default function Maintenance({ location }) {
  return (
    <div className="container text-center mt-2">
      <div className="error mx-auto" data-text="503">503</div>
      <p className="lead text-gray-800 mb-2">BẢO TRÌ, NÂNG CẤP HỆ THỐNG</p>
      <p className="text-gray-500 mb-0">Hệ thống đang tạm dừng hoạt động để IT nâng cấp hệ thống</p>
    </div>
  );
}