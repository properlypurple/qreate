
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QRCodeForm } from "@/components/QRCodeForm";
import { QRCodePreview } from "@/components/QRCodePreview";
import { QRCodeOptions, defaultQRCodeOptions } from "@/utils/qrCodeUtils";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  const [qrCodeOptions, setQrCodeOptions] = useState<QRCodeOptions>(defaultQRCodeOptions);
  const isMobile = useIsMobile();

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-20 pb-10">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-8 animate-slide-in">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">QReative</h1>
              <p className="text-lg mt-2 max-w-2xl mx-auto text-muted-foreground">
                Create beautiful, customizable QR codes in seconds
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
                  Configuration
                </div>
                <QRCodeForm value={qrCodeOptions} onChange={setQrCodeOptions} />
              </div>
              
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
                  Preview
                </div>
                <QRCodePreview options={qrCodeOptions} />
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default Index;
