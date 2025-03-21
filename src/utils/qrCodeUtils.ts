
import QRCode from 'qrcode';

export type QRCodeType = 'url' | 'text' | 'wifi' | 'email' | 'phone';

export interface QRCodeOptions {
  type: QRCodeType;
  data: {
    url?: string;
    text?: string;
    wifi?: {
      ssid: string;
      password: string;
      encryption: 'WPA' | 'WEP' | 'nopass';
      hidden: boolean;
    };
    email?: {
      address: string;
      subject?: string;
      body?: string;
    };
    phone?: string;
  };
  style: {
    foreground: string;
    background: string;
    cornerRadius: number;
    cornerSquareType: 'square' | 'rounded' | 'dot';
    dotType: 'square' | 'rounded' | 'dot';
  };
  logo?: string | null;
}

export const defaultQRCodeOptions: QRCodeOptions = {
  type: 'url',
  data: {
    url: 'https://example.com',
  },
  style: {
    foreground: '#000000',
    background: '#ffffff',
    cornerRadius: 0,
    cornerSquareType: 'square',
    dotType: 'square',
  },
  logo: null,
};

export function formatQRCodeData(options: QRCodeOptions): string {
  switch (options.type) {
    case 'url':
      return options.data.url || '';
    case 'text':
      return options.data.text || '';
    case 'wifi':
      if (!options.data.wifi) return '';
      const { ssid, password, encryption, hidden } = options.data.wifi;
      return `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden ? 'true' : 'false'};;`;
    case 'email':
      if (!options.data.email) return '';
      const { address, subject = '', body = '' } = options.data.email;
      return `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    case 'phone':
      return `tel:${options.data.phone || ''}`;
    default:
      return '';
  }
}

// Function to check contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  // Convert hex to RGB
  const getRGB = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  // Calculate relative luminance
  const getLuminance = (rgb: number[]) => {
    const [r, g, b] = rgb.map(v => {
      v = v / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const rgb1 = getRGB(color1);
  const rgb2 = getRGB(color2);
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);

  // Calculate contrast ratio - (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter color
  const ratio = l1 > l2 
    ? (l1 + 0.05) / (l2 + 0.05) 
    : (l2 + 0.05) / (l1 + 0.05);
  
  return parseFloat(ratio.toFixed(2));
}

// Check if colors meet WCAG AA contrast requirements
export function hasGoodContrast(color1: string, color2: string): boolean {
  const ratio = getContrastRatio(color1, color2);
  return ratio >= 4.5; // WCAG AA standard
}

export async function generateQRCode(options: QRCodeOptions, format: 'svg' | 'dataURL' = 'dataURL'): Promise<string> {
  const data = formatQRCodeData(options);
  
  try {
    const qrCodeOptions = {
      color: {
        dark: options.style.foreground,
        light: options.style.background,
      },
      width: 300,
      margin: 1,
      errorCorrectionLevel: 'H' as 'H' // Type assertion to QRCodeErrorCorrectionLevel
    };

    // Generate basic QR code
    if (format === 'svg') {
      return await QRCode.toString(data, {
        ...qrCodeOptions,
        type: 'svg',
      });
    } else {
      return await QRCode.toDataURL(data, qrCodeOptions);
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
}

export async function downloadQRCode(options: QRCodeOptions, format: 'svg' | 'png' = 'png'): Promise<void> {
  try {
    const qrCode = format === 'svg' 
      ? await generateQRCode(options, 'svg')
      : await generateQRCode(options, 'dataURL');
    
    const link = document.createElement('a');
    
    if (format === 'svg') {
      const blob = new Blob([qrCode], { type: 'image/svg+xml' });
      link.href = URL.createObjectURL(blob);
      link.download = 'qrcode.svg';
    } else {
      link.href = qrCode;
      link.download = 'qrcode.png';
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading QR code:', error);
  }
}

export async function shareQRCode(options: QRCodeOptions): Promise<void> {
  try {
    const qrCode = await generateQRCode(options);
    
    if (navigator.share) {
      const blob = await (await fetch(qrCode)).blob();
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });
      
      await navigator.share({
        title: 'QR Code',
        text: 'Check out this QR code I created with QReative!',
        files: [file],
      });
    } else {
      console.log('Web Share API not supported');
      // Fallback - copy to clipboard
      const textArea = document.createElement('textarea');
      textArea.value = qrCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('QR code copied to clipboard!');
    }
  } catch (error) {
    console.error('Error sharing QR code:', error);
  }
}
