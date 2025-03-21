
import { useEffect, useState } from "react";
import { QRCodeOptions, generateQRCode, downloadQRCode, shareQRCode, hasGoodContrast } from "@/utils/qrCodeUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share, Check, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface QRCodePreviewProps {
  options: QRCodeOptions;
}

export function QRCodePreview({ options }: QRCodePreviewProps) {
  const [qrCodeImage, setQrCodeImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [downloadFormat, setDownloadFormat] = useState<"png" | "svg">("png");
  const [hasContrastWarning, setHasContrastWarning] = useState<boolean>(false);

  useEffect(() => {
    const updateQRCode = async () => {
      setIsLoading(true);
      try {
        const dataUrl = await generateQRCode(options, downloadFormat === "svg" ? "svg" : "dataURL");
        setQrCodeImage(dataUrl);
        
        // Check contrast after getting QR code
        setHasContrastWarning(!hasGoodContrast(options.style.foreground, options.style.background));
      } catch (error) {
        console.error("Error generating QR code:", error);
        toast.error("Failed to generate QR code");
      } finally {
        setIsLoading(false);
      }
    };

    updateQRCode();
  }, [options, downloadFormat]);

  const handleDownload = async () => {
    try {
      await downloadQRCode(options, downloadFormat);
      toast.success(`QR code downloaded as ${downloadFormat.toUpperCase()}`);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Failed to download QR code");
    }
  };

  const handleShare = async () => {
    try {
      await shareQRCode(options);
      toast.success("QR code shared successfully");
    } catch (error) {
      console.error("Error sharing QR code:", error);
      toast.error("Failed to share QR code");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeImage);
      setCopied(true);
      toast.success("QR code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="space-y-6 p-4 animate-fade-in">
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center">
          {hasContrastWarning && (
            <Alert variant="destructive" className="mb-4 w-full">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Low contrast between foreground and background colors may affect QR code scanning.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="w-full max-w-xs mx-auto">
            {isLoading ? (
              <Skeleton className="h-64 w-64 rounded-lg mx-auto" />
            ) : (
              <div className="relative overflow-hidden bg-background border rounded-lg p-2 mx-auto w-64 h-64 flex items-center justify-center shadow-sm transition-all hover:shadow-md">
                {qrCodeImage.startsWith('<svg') ? (
                  <div dangerouslySetInnerHTML={{ __html: qrCodeImage }} className="w-full h-full" />
                ) : (
                  <img
                    src={qrCodeImage}
                    alt="QR Code"
                    className="max-w-full max-h-full transition-all duration-300 ease-in-out"
                  />
                )}
              </div>
            )}
          </div>
          
          <div className="mt-6 w-full space-y-4">
            <h3 className="text-lg font-medium text-center">Download Options</h3>
            
            <Tabs defaultValue="png" onValueChange={(v) => setDownloadFormat(v as "png" | "svg")} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="png">PNG Image</TabsTrigger>
                <TabsTrigger value="svg">SVG Vector</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <Download className="h-4 w-4" />
                <span>Download {downloadFormat.toUpperCase()}</span>
              </Button>
              
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <Share className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
            
            <Button
              onClick={handleCopy}
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              disabled={isLoading || copied}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <span>Copy to Clipboard</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
