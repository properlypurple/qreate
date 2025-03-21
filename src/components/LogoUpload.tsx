
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, X } from "lucide-react";

interface LogoUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export function LogoUpload({ value, onChange }: LogoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onChange(null);
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative w-full">
          <img 
            src={value} 
            alt="Logo" 
            className="w-24 h-24 mx-auto object-contain border rounded-lg p-1" 
          />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={removeLogo}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/20"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-2">
            <Image className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag & drop an image here or click to select
            </p>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id="logo-upload"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => document.getElementById("logo-upload")?.click()}
            >
              Select Logo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
