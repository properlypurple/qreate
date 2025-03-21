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
      // Note: Basic QRCode library doesn't support cornerSquareType, dotType, cornerRadius
      // We'll handle those in the UI layer with custom rendering
    };

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
