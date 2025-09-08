// src/app/admin/customize/page.tsx
'use client'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getVideos, reorderVideos, getSiteSettings, updateSiteSettings } from "@/lib/data"
import { GripVertical } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function CustomizePage() {
  const { toast } = useToast();
  const [videos, setVideos] = useState([]);
  const [settings, setSettings] = useState({
    theme: { primaryColor: '#FF4757', accentColor: '#E25822', fontFamily: 'PT Sans' },
    bannerText: "🎬 READY TO LEARN 📚 Don't Miss the Course Sale! GET 30% OFF!",
    siteName: 'StreamVerse',
    siteLogoUrl: '/logo-placeholder.svg', // Default placeholder
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videosData = await getVideos();
        setVideos(videosData.slice(0, 5)); // show first 5 for reordering
        const siteSettings = await getSiteSettings();
        // Merge fetched settings with defaults
        if (siteSettings) {
          setSettings(prev => ({
            theme: siteSettings.theme || prev.theme,
            bannerText: siteSettings.bannerText || prev.bannerText,
            siteName: siteSettings.siteName || prev.siteName,
            siteLogoUrl: siteSettings.siteLogoUrl || prev.siteLogoUrl,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to load site data." });
      }
    };
    fetchData();
  }, [toast]);

  const handleSaveSettings = async () => {
    try {
      await updateSiteSettings({ key: 'siteSettings', value: settings });
      toast({ title: "Success", description: "Site settings updated." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: `Failed to save settings.` });
    }
  };

  const handleOrderSave = async () => {
    try {
        const orderedVideos = videos.map((video, index) => ({ id: video.id, order: index }));
        await reorderVideos(orderedVideos);
        toast({ title: "Success", description: "Video order saved." });
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to save video order." });
    }
  };
  
  const handleInputChange = (part, value) => {
    setSettings(prev => ({ ...prev, [part]: value }));
  };
  
  const handleThemeChange = (key, value) => {
     setSettings(prev => ({ ...prev, theme: { ...prev.theme, [key]: value } }));
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Customize Site</h1>
      <div className="grid gap-8">

        <Card>
          <CardHeader>
            <CardTitle>Site Identity</CardTitle>
            <CardDescription>Manage your website's name and logo.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input id="site-name" value={settings.siteName} onChange={(e) => handleInputChange('siteName', e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="site-logo-url">Site Logo URL</Label>
              <Input id="site-logo-url" value={settings.siteLogoUrl} onChange={(e) => handleInputChange('siteLogoUrl', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
            <CardDescription>Change the look and feel of your site.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input type="color" id="primary-color" value={settings.theme.primaryColor} onChange={(e) => handleThemeChange('primaryColor', e.target.value)} className="w-12 h-10 p-1" />
                <Input type="text" value={settings.theme.primaryColor} onChange={(e) => handleThemeChange('primaryColor', e.target.value)} />
              </div>
              <p className="text-xs text-muted-foreground">Used for buttons, links, and highlights.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex items-center gap-2">
                <Input type="color" id="accent-color" value={settings.theme.accentColor} onChange={(e) => handleThemeChange('accentColor', e.target.value)} className="w-12 h-10 p-1" />
                <Input type="text" value={settings.theme.accentColor} onChange={(e) => handleThemeChange('accentColor', e.target.value)} />
              </div>
               <p className="text-xs text-muted-foreground">Used for interactive elements.</p>
            </div>
             <div className="space-y-2">
              <Label htmlFor="font-family">Font Family</Label>
              <Input id="font-family" value={settings.theme.fontFamily} onChange={(e) => handleThemeChange('fontFamily', e.target.value)} />
              <p className="text-xs text-muted-foreground">Enter a font name from Google Fonts.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Promotional Banner</CardTitle>
            <CardDescription>Edit the text displayed in the top promotional banner.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={settings.bannerText} onChange={(e) => handleInputChange('bannerText', e.target.value)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Landing Page Videos</CardTitle>
            <CardDescription>Drag and drop to reorder the videos on the main page.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
                {videos.map((video) => (
                    <div key={video.id} className="flex items-center gap-4 p-2 rounded-lg bg-muted">
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                        <span className="font-medium text-sm">{video.title}</span>
                    </div>
                ))}
            </div>
            <Button className="mt-4" onClick={handleOrderSave}>Save Order</Button>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button onClick={handleSaveSettings} size="lg">Save All Settings</Button>
        </div>
      </div>
    </div>
  )
}
