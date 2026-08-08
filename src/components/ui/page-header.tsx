import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

function PageHeaderInner({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-3">{children}</div>
      )}
    </div>
  );
}

export const PageHeader = React.memo(PageHeaderInner);
