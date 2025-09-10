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

export default function SEOPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: 'StreamVerse',
    siteMotto: 'Your universe of video content.',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const siteSettings = await getSiteSettings();
        if (siteSettings) {
          setSettings(prev => ({
            ...prev,
            siteName: siteSettings.siteName || prev.siteName,
            siteMotto: siteSettings.siteMotto || prev.siteMotto
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
        // First, fetch the full settings object to avoid overwriting other fields
        const fullSettings = await getSiteSettings() || {};
        const updatedSettings = { ...fullSettings, ...settings };

        await updateSiteSettings({ key: 'siteSettings', value: updatedSettings });
        toast({ title: "Success", description: "SEO settings updated." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: `Failed to save settings: ${error.message}` });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">SEO Management</h1>
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Search Engine Appearance</CardTitle>
            <CardDescription>
              This controls how your site appears on search engines like Google. The Site Name is your main title, and the Motto is the description that appears below the title.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name (Meta Title)</Label>
              <Input 
                id="siteName" 
                value={settings.siteName} 
                onChange={(e) => setSettings(prev => ({...prev, siteName: e.target.value}))} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteMotto">Site Motto (Meta Description)</Label>
              <Textarea 
                id="siteMotto" 
                value={settings.siteMotto} 
                onChange={(e) => setSettings(prev => ({...prev, siteMotto: e.target.value}))} 
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button onClick={handleSaveSettings} size="lg">Save SEO Settings</Button>
        </div>
      </div>
    </div>
  )
}
