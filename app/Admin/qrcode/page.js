"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function QRCodeGenerator() {
  const [loginLink, setLoginLink] = useState("");
  const [success, setSuccess] = useState("");
  const [mounted, setMounted] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [manualUrl, setManualUrl] = useState("");

  useEffect(() => {
    setMounted(true);
    
    // Get current URL and replace localhost with network IP if needed
    if (typeof window !== "undefined") {
      const currentUrl = window.location.origin;
      if (currentUrl.includes("localhost") || currentUrl.includes("127.0.0.1")) {
        // Try to get network IP from localStorage or prompt user
        const savedUrl = localStorage.getItem("networkBaseUrl");
        if (savedUrl) {
          setBaseUrl(savedUrl);
          setManualUrl(savedUrl);
        } else {
          // Default to localhost for now, user can change it
          setBaseUrl(currentUrl);
          setManualUrl(currentUrl);
        }
      } else {
        setBaseUrl(currentUrl);
        setManualUrl(currentUrl);
      }
      
      // Generate the login link immediately
      generateLoginLink();
    }
  }, []);

  const updateBaseUrl = (url) => {
    setManualUrl(url);
    setBaseUrl(url);
    localStorage.setItem("networkBaseUrl", url);
    // Regenerate link with new URL
    generateLoginLink(url);
  };

  const generateLoginLink = (customUrl = null) => {
    const urlToUse = customUrl || baseUrl || (typeof window !== "undefined" ? window.location.origin : "");
    const link = `${urlToUse}/login`;
    setLoginLink(link);
    setSuccess("QR code link updated!");
    setTimeout(() => setSuccess(""), 2000);
  };

  const copyLink = () => {
    if (loginLink) {
      navigator.clipboard.writeText(loginLink);
      setSuccess("Link copied to clipboard!");
      setTimeout(() => setSuccess(""), 2000);
    }
  };

  const downloadQR = () => {
    if (!mounted || !loginLink) return;
    
    const svg = document.querySelector("#qr-code svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `user-login-qrcode.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="w-full flex flex-col h-full overflow-hidden">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex-shrink-0">
          Generate User Login QR Code
        </h1>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="grid md:grid-cols-2 gap-6">
            {/* QR Code Generator */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Generate New QR Code
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="baseUrl" className="text-gray-700">
                    Server URL (for mobile access)
                  </Label>
                  <Input
                    id="baseUrl"
                    type="text"
                    placeholder="http://192.168.1.100:3000"
                    value={manualUrl}
                    onChange={(e) => updateBaseUrl(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1") ? (
                      <span className="text-orange-600 font-semibold">
                        ⚠️ Replace localhost with your network IP (e.g., http://192.168.1.100:3000) so phones can access it
                      </span>
                    ) : (
                      "Current URL will be used for QR code and links"
                    )}
                  </p>
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-gray-700">
                    <p className="font-semibold mb-1">How to find your network IP:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Windows: Open CMD and type <code className="bg-white px-1 rounded">ipconfig</code>, look for "IPv4 Address"</li>
                      <li>Mac/Linux: Open Terminal and type <code className="bg-white px-1 rounded">ifconfig</code> or <code className="bg-white px-1 rounded">ip addr</code></li>
                      <li>Format: <code className="bg-white px-1 rounded">http://YOUR_IP:3000</code></li>
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={() => generateLoginLink()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Refresh QR Code & Link
                </Button>

                {success && (
                  <div className="p-3 bg-green-100 text-green-800 rounded text-sm">
                    {success}
                  </div>
                )}

                {/* QR Code Display */}
                {mounted && loginLink && (
                  <div className="space-y-4 pt-4 border-t">
                    <div id="qr-code" className="flex justify-center bg-white p-4 rounded border">
                      <QRCodeSVG value={loginLink} size={250} />
                    </div>

                    <div>
                      <Label className="text-gray-700 mb-2 block">
                        Login Link (for desktop/laptop users):
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          value={loginLink}
                          readOnly
                          className="text-sm"
                        />
                        <Button
                          onClick={copyLink}
                          className="flex-shrink-0 border border-gray-300 bg-white hover:bg-gray-50"
                        >
                          Copy
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={downloadQR}
                      className="w-full border border-gray-300 bg-white hover:bg-gray-50"
                    >
                      Download QR Code Image
                    </Button>

                    <div className="bg-blue-50 p-4 rounded text-sm text-gray-700">
                      <p className="font-semibold mb-2">Instructions:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Print or display the QR code on the door</li>
                        <li>Mobile users can scan the QR code to quickly access the login page</li>
                        <li>Desktop/Laptop users can use the login link above</li>
                        <li>The QR code redirects to the login page where users enter their credentials</li>
                        <li>This QR code does not expire - everyone can use it</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About User Login
              </h2>
              
              <div className="space-y-3 text-sm text-gray-700">
                <div className="p-3 bg-green-50 rounded border border-green-200">
                  <p className="font-semibold text-green-800 mb-2">✓ Public QR Code</p>
                  <p className="text-green-700">
                    This QR code can be used by anyone. It simply redirects to the login page for convenience.
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="font-semibold text-blue-800 mb-2">How it works:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>QR code links directly to the login page</li>
                    <li>Mobile users scan QR code to quickly access login</li>
                    <li>Users enter their credentials (email and password)</li>
                    <li>System routes them based on their account type (admin or user)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
