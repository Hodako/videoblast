
// src/app/admin/seo/page.tsx
'use client'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getSiteSettings, updateSiteSettings } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function SEOPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: 'NosuTube',
    siteMotto: 'Your universe of video content.',
    siteLogoUrl: '/logo.svg' // Default logo for OG image
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const siteSettings = await getSiteSettings();
        if (siteSettings) {
          setSettings(prev => ({
            ...prev,
            siteName: siteSettings.siteName || prev.siteName,
            siteMotto: siteSettings.siteMotto || prev.siteMotto,
            siteLogoUrl: siteSettings.siteLogoUrl || prev.siteLogoUrl,
          }));
        }
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to load site settings." });
      }
    };
    fetchData();
  }, [toast]);

  const handleSaveSettings = async () => {
    try {
        const fullSettings = await getSiteSettings() || {};
        const updatedSettings = { ...fullSettings, siteName: settings.siteName, siteMotto: settings.siteMotto, siteLogoUrl: settings.siteLogoUrl };

        await updateSiteSettings({ key: 'siteSettings', value: updatedSettings });
        toast({ title: "Success", description: "SEO & Site settings updated." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: `Failed to save settings: ${error.message}` });
    }
  };
  
  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({...prev, [field]: value}));
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">SEO & Site Identity</h1>
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Search Engine & Social Media Appearance</CardTitle>
            <CardDescription>
              This controls how your site appears on Google and in link previews on social media like Facebook and Twitter.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name (Title & OG:Site_Name)</Label>
              <Input 
                id="siteName" 
                value={settings.siteName} 
                onChange={(e) => handleInputChange('siteName', e.target.value)} 
              />
               <p className="text-xs text-muted-foreground">The main title for your website.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteMotto">Site Motto (Description & OG:Description)</Label>
              <Textarea 
                id="siteMotto" 
                value={settings.siteMotto} 
                onChange={(e) => handleInputChange('siteMotto', e.target.value)} 
              />
               <p className="text-xs text-muted-foreground">The short description that appears in search results and link previews.</p>
            </div>
             <div className="space-y-2">
              <Label htmlFor="siteLogoUrl">Default Preview Image URL (OG:Image)</Label>
              <Input 
                id="siteLogoUrl" 
                value={settings.siteLogoUrl} 
                onChange={(e) => handleInputChange('siteLogoUrl', e.target.value)}
              />
               <p className="text-xs text-muted-foreground">The default image shown when your homepage is shared. Should be a full URL.</p>
               {settings.siteLogoUrl && <Image src={settings.siteLogoUrl} alt="Logo Preview" width={100} height={100} className="mt-2 rounded-md border p-2"/>}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button onClick={handleSaveSettings} size="lg">Save Settings</Button>
        </div>
      </div>
    </div>
  )
}
