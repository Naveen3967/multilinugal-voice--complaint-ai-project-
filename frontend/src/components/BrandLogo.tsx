import { Shield } from "lucide-react";
import { useState } from "react";

type BrandLogoProps = {
  sizeClassName?: string;
  className?: string;
};

export default function BrandLogo({
  sizeClassName = "w-10 h-10",
  className = "",
}: BrandLogoProps) {
  const logoSources = [
    "/cyberguard-logo.png",
    "/cyberguard-logo.jpg",
    "/cyberguard-logo.jpeg",
    "/cyberguard-logo.webp",
    "/logo.png",
    "/logo.jpg",
    "/logo.jpeg",
    "/logo.webp",
  ];
  const [logoIndex, setLogoIndex] = useState(0);

  return (
    <div className={`${sizeClassName} rounded-md overflow-hidden bg-white/90 ${className}`}>
      <img
        src={logoSources[logoIndex]}
        alt="CyberGuard AI"
        className="w-full h-full object-cover"
        onError={(e) => {
          if (logoIndex < logoSources.length - 1) {
            setLogoIndex((prev) => prev + 1);
            return;
          }
          e.currentTarget.style.display = "none";
          const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
          if (fallback) fallback.style.display = "flex";
        }}
      />
      <div className="hidden w-full h-full items-center justify-center bg-accent text-accent-foreground">
        <Shield className="w-6 h-6" />
      </div>
    </div>
  );
}