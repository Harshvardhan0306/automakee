
import React from 'react';

const AdminFooter = () => {
  return (
    <footer className="px-6 py-4 border-t border-border/40">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">
          © 2023 Automake. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-primary">Help Center</a>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
