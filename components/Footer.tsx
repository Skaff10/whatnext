import React from "react";

export function Footer() {
  return (
    <footer className="w-full bg-[#0E0B17] border-t-4 border-black py-6 px-4 mt-auto text-center">
      <div className="max-w-5xl mx-auto space-y-3 font-vt323 text-base sm:text-lg text-[#F4E9D0]/70">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span>&copy; {new Date().getFullYear()} Blacklist</span>
          <span>•</span>
          <span>PERSONAL ARCHIVE</span>
        
        </div>

        {/* Required API Attributions */}
        <div className="space-y-1 text-sm text-[#F4E9D0]/50 pt-2 border-t border-[#1F1A33]">
          <p>
            This product is created by Skaf and only for Skaf!!!
          </p>
          
        </div>
      </div>
    </footer>
  );
}
