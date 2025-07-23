"use client";

import React, { ReactNode } from "react";
import Breadcrumb from "./Breadcrumb";

interface PageTitleProps {
  title: string;
  description?: string;
  breadcrumb?: boolean;
  actions?: ReactNode;
  className?: string;
}

const PageTitle = ({
  title,
  description,
  breadcrumb = true,
  actions,
  className = "",
}: PageTitleProps) => {
  return (
    <div className={`mb-6 ${className}`}>
      {breadcrumb && <Breadcrumb className="mb-3" />}
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-400">{description}</p>
          )}
        </div>
        
        {actions && (
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageTitle; 