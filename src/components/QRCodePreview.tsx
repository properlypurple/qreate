
import { useEffect, useState } from "react";
import { QRCodeOptions, generateQRCode, downloadQRCode, shareQRCode, hasGoodContrast } from "@/utils/qrCodeUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Share, Check, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      } finally {
        setIsLoading(false);
      }
    };

    updateQRCode();
  }, [options, downloadFormat]);

  const handleDownload = async () => {
    await downloadQRCode(options, downloadFormat);
  };

  const handleShare = async () => {
    await shareQRCode(options);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeImage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  // Apply styling based on options
  const applyQRCodeStyling = (svgString: string) => {
    const parser = new DOMParser();
    const svg = parser.parseFromString(svgString, 'image/svg+xml').documentElement;
    
    // Apply corner square styling
    const cornerSquares = svg.querySelectorAll('path');
    if (cornerSquares && cornerSquares.length > 0) {
      const { cornerSquareType, dotType, cornerRadius } = options.style;
      
      cornerSquares.forEach((path, index) => {
        const isCornerSquare = index < 3; // The first three paths are typically corner squares in QRCode.js

        if (isCornerSquare && cornerSquareType !== 'square') {
          if (cornerSquareType === 'rounded') {
            path.setAttribute('rx', `${cornerRadius || 8}`);
            path.setAttribute('ry', `${cornerRadius || 8}`);
          } else if (cornerSquareType === 'dot') {
            const d = path.getAttribute('d');
            if (d) {
              path.setAttribute('d', makeDotPath(d));
            }
          }
        } 
        else if (!isCornerSquare && dotType !== 'square') {
          if (dotType === 'rounded') {
            path.setAttribute('rx', `${cornerRadius || 4}`);
            path.setAttribute('ry', `${cornerRadius || 4}`);
          } else if (dotType === 'dot') {
            const d = path.getAttribute('d');
            if (d) {
              path.setAttribute('d', makeDotPath(d));
            }
          }
        }
      });
    }

    return new XMLSerializer().serializeToString(svg);
  };

  const makeDotPath = (pathD: string) => {
    // This is a simplistic implementation. A full implementation would need to parse the path and modify it
    return pathD.replace(/Z/g, 'A5,5 0 0 1 5,5 Z');
  };

  // Process QR code image with selected styling options and logo if present
  useEffect(() => {
    if (qrCodeImage && !isLoading) {
      if (qrCodeImage.startsWith('<svg')) {
        // It's an SVG, apply styling directly
        const styledSvg = applyQRCodeStyling(qrCodeImage);
        // Convert SVG string to data URL
        const svgBlob = new Blob([styledSvg], {type: 'image/svg+xml'});
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            setQrCodeImage(e.target.result.toString());
          }
        };
        reader.readAsDataURL(svgBlob);
      } else {
        // It's a data URL (PNG), use canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Apply custom styling through canvas manipulation
          // This is a simplified approach as full styling would require more complex image processing
          
          // Draw logo in the center if present
          if (options.logo) {
            const logoImg = new Image();
            logoImg.onload = () => {
              // Calculate logo size (25% of QR code)
              const logoSize = img.width * 0.25;
              const logoX = (img.width - logoSize) / 2;
              const logoY = (img.height - logoSize) / 2;

              // Create a white background for the logo
              ctx.fillStyle = options.style.background;
              ctx.fillRect(logoX - 2, logoY - 2, logoSize + 4, logoSize + 4);
              
              // Draw the logo
              ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
              
              // Update QR code image with logo
              setQrCodeImage(canvas.toDataURL("image/png"));
            };
            logoImg.src = options.logo;
          }
        };
        img.src = qrCodeImage;
      }
    }
  }, [qrCodeImage, options.logo, options.style, isLoading]);

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
