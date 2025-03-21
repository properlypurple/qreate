import { useState } from "react";
import { QRCodeOptions, QRCodeType, defaultQRCodeOptions } from "@/utils/qrCodeUtils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Link, QrCode, Mail, Phone, Wifi, Type } from "lucide-react";
import { LogoUpload } from "./LogoUpload";

interface QRCodeFormProps {
  value: QRCodeOptions;
  onChange: (value: QRCodeOptions) => void;
}

export function QRCodeForm({ value, onChange }: QRCodeFormProps) {
  const handleQRTypeChange = (type: QRCodeType) => {
    onChange({
      ...value,
      type,
      data: {
        ...value.data,
        // Initialize default values for the selected type
        ...(type === "url" && { url: value.data.url || "https://" }),
        ...(type === "text" && { text: value.data.text || "" }),
        ...(type === "wifi" && { 
          wifi: value.data.wifi || { 
            ssid: "", 
            password: "", 
            encryption: "WPA", 
            hidden: false 
          } 
        }),
        ...(type === "email" && { 
          email: value.data.email || { 
            address: "", 
            subject: "", 
            body: "" 
          } 
        }),
        ...(type === "phone" && { phone: value.data.phone || "" }),
      },
    });
  };

  return (
    <div className="space-y-8 p-4 animate-fade-in">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">QR Code Type</h3>
              <p className="text-sm text-muted-foreground">
                Select the type of QR code you want to generate
              </p>
            </div>
            
            <Tabs 
              value={value.type} 
              onValueChange={(v) => handleQRTypeChange(v as QRCodeType)}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 h-auto">
                <TabsTrigger value="url" className="flex items-center gap-2 py-2">
                  <Link className="h-4 w-4" />
                  <span className="hidden md:inline">URL</span>
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-2 py-2">
                  <Type className="h-4 w-4" />
                  <span className="hidden md:inline">Text</span>
                </TabsTrigger>
                <TabsTrigger value="wifi" className="flex items-center gap-2 py-2">
                  <Wifi className="h-4 w-4" />
                  <span className="hidden md:inline">WiFi</span>
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2 py-2">
                  <Mail className="h-4 w-4" />
                  <span className="hidden md:inline">Email</span>
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex items-center gap-2 py-2">
                  <Phone className="h-4 w-4" />
                  <span className="hidden md:inline">Phone</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="mt-4 space-y-4">
                <TabsContent value="url" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      placeholder="https://example.com"
                      value={value.data.url || ""}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          data: { ...value.data, url: e.target.value },
                        })
                      }
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="text">Text</Label>
                    <Input
                      id="text"
                      placeholder="Enter text here"
                      value={value.data.text || ""}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          data: { ...value.data, text: e.target.value },
                        })
                      }
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="wifi" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ssid">WiFi Name (SSID)</Label>
                    <Input
                      id="ssid"
                      placeholder="WiFi network name"
                      value={value.data.wifi?.ssid || ""}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          data: { 
                            ...value.data, 
                            wifi: { 
                              ...(value.data.wifi || { 
                                ssid: "", 
                                password: "", 
                                encryption: "WPA", 
                                hidden: false 
                              }), 
                              ssid: e.target.value 
                            } 
                          },
                        })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="WiFi password"
                      value={value.data.wifi?.password || ""}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          data: { 
                            ...value.data, 
                            wifi: { 
                              ...(value.data.wifi || { 
                                ssid: "", 
                                password: "", 
                                encryption: "WPA", 
                                hidden: false 
                              }), 
                              password: e.target.value 
                            } 
                          },
                        })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Encryption</Label>
                    <RadioGroup
                      value={value.data.wifi?.encryption || "WPA"}
                      onValueChange={(v: "WPA" | "WEP" | "nopass") =>
                        onChange({
                          ...value,
                          data: { 
                            ...value.data, 
                            wifi: { 
                              ...(value.data.wifi || { 
                                ssid: "", 
                                password: "", 
                                hidden: false 
                              }), 
                              encryption: v 
                            } 
                          },
                        })
                      }
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="WPA" id="wpa" />
                        <Label htmlFor="wpa">WPA/WPA2</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="WEP" id="wep" />
                        <Label htmlFor="wep">WEP</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nopass" id="nopass" />
                        <Label htmlFor="nopass">None</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hidden"
                      checked={value.data.wifi?.hidden || false}
                      onCheckedChange={(checked) =>
                        onChange({
                          ...value,
                          data: { 
                            ...value.data, 
                            wifi: { 
                              ...(value.data.wifi || { 
                                ssid: "", 
                                password: "", 
                                encryption: "WPA" 
                              }), 
                              hidden: checked 
                            } 
                          },
                        })
                      }
                    />
                    <Label htmlFor="hidden">Hidden Network</Label>
                  </div>
                </TabsContent>
                
                <TabsContent value="email" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@example.com"
                      value={value.data.email?.address || ""}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          data: { 
                            ...value.data, 
                            email: { 
                              ...value.data.email || { subject: "", body: "" }, 
                              address: e.target.value 
                            } 
                          },
                        })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject (Optional)</Label>
                    <Input
                      id="subject"
                      placeholder="Email subject"
                      value={value.data.email?.subject || ""}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          data: { 
                            ...value.data, 
                            email: { 
                              ...value.data.email || { address: "", body: "" }, 
                              subject: e.target.value 
                            } 
                          },
                        })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="body">Body (Optional)</Label>
                    <Input
                      id="body"
                      placeholder="Email body"
                      value={value.data.email?.body || ""}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          data: { 
                            ...value.data, 
                            email: { 
                              ...value.data.email || { address: "", subject: "" }, 
                              body: e.target.value 
                            } 
                          },
                        })
                      }
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="phone" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1234567890"
                      value={value.data.phone || ""}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          data: { ...value.data, phone: e.target.value },
                        })
                      }
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Style Options</h3>
              <p className="text-sm text-muted-foreground">
                Customize the appearance of your QR code
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="foreground">Foreground Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="foreground"
                      type="color"
                      value={value.style.foreground}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          style: { ...value.style, foreground: e.target.value },
                        })
                      }
                      className="w-10 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={value.style.foreground}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          style: { ...value.style, foreground: e.target.value },
                        })
                      }
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="background">Background Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="background"
                      type="color"
                      value={value.style.background}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          style: { ...value.style, background: e.target.value },
                        })
                      }
                      className="w-10 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={value.style.background}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          style: { ...value.style, background: e.target.value },
                        })
                      }
                      placeholder="#FFFFFF"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Corner Square Style</Label>
                  <RadioGroup
                    value={value.style.cornerSquareType}
                    onValueChange={(v: 'square' | 'rounded' | 'dot') =>
                      onChange({
                        ...value,
                        style: { ...value.style, cornerSquareType: v },
                      })
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="square" id="corner-square" />
                      <Label htmlFor="corner-square">Square</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rounded" id="corner-rounded" />
                      <Label htmlFor="corner-rounded">Rounded</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dot" id="corner-dot" />
                      <Label htmlFor="corner-dot">Dot</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Dot Style</Label>
                  <RadioGroup
                    value={value.style.dotType}
                    onValueChange={(v: 'square' | 'rounded' | 'dot') =>
                      onChange({
                        ...value,
                        style: { ...value.style, dotType: v },
                      })
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="square" id="dot-square" />
                      <Label htmlFor="dot-square">Square</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rounded" id="dot-rounded" />
                      <Label htmlFor="dot-rounded">Rounded</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dot" id="dot-dot" />
                      <Label htmlFor="dot-dot">Dot</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="cornerRadius">Corner Radius: {value.style.cornerRadius}px</Label>
                  </div>
                  <Slider
                    id="cornerRadius"
                    min={0}
                    max={50}
                    step={1}
                    value={[value.style.cornerRadius]}
                    onValueChange={(values) =>
                      onChange({
                        ...value,
                        style: { ...value.style, cornerRadius: values[0] },
                      })
                    }
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Logo (Optional)</Label>
              <LogoUpload
                value={value.logo || null}
                onChange={(logo) => onChange({ ...value, logo })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
