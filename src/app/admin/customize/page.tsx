// src/app/admin/customize/page.tsx
'use client'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getVideos, getSiteSettings, updateSiteSettings } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

export default function CustomizePage() {
  const { toast } = useToast();
  const [allVideos, setAllVideos] = useState([]);
  const [settings, setSettings] = useState({
    theme: { primaryColor: '#FF4757', accentColor: '#E25822', fontFamily: 'PT Sans' },
    banner: {
        text: "🎬 READY TO LEARN 📚 Don't Miss the Course Sale! GET 30% OFF!",
        color: '#2ed573',
        enabled: true,
    },
    siteName: 'StreamVerse',
    siteLogoUrl: '/logo-placeholder.svg',
    siteMotto: 'Your universe of video content.',
    showFeatured: true,
    featuredVideoIds: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siteSettings, allVideosData] = await Promise.all([
            getSiteSettings(),
            getVideos()
        ]);
        
        setAllVideos(allVideosData);

        if (siteSettings && Object.keys(siteSettings).length > 0) {
          setSettings(prev => ({
            ...prev,
            ...siteSettings,
            theme: siteSettings.theme || prev.theme,
            banner: siteSettings.banner || prev.banner,
            featuredVideoIds: siteSettings.featuredVideoIds || []
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
      toast({ variant: "destructive", title: "Error", description: `Failed to save settings: ${error.message}` });
    }
  };
  
  const handleInputChange = (part, value) => {
    setSettings(prev => ({ ...prev, [part]: value }));
  };
  
  const handleThemeChange = (key, value) => {
     setSettings(prev => ({ ...prev, theme: { ...prev.theme, [key]: value } }));
  }

  const handleBannerChange = (key, value) => {
     setSettings(prev => ({ ...prev, banner: { ...prev.banner, [key]: value } }));
  }

  const handleFeaturedVideoChange = (videoId, checked) => {
    setSettings(prev => {
        const newFeaturedIds = checked
            ? [...prev.featuredVideoIds, videoId]
            : prev.featuredVideoIds.filter(id => id !== videoId);
        return { ...prev, featuredVideoIds: newFeaturedIds };
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Customize Site</h1>
      <div className="grid gap-8">

        <Card>
          <CardHeader>
            <CardTitle>Site Identity & SEO</CardTitle>
            <CardDescription>Manage your website's name, logo, and motto for search engines.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name (Title)</Label>
              <Input id="site-name" value={settings.siteName} onChange={(e) => handleInputChange('siteName', e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="site-logo-url">Site Logo URL</Label>
              <Input id="site-logo-url" value={settings.siteLogoUrl} onChange={(e) => handleInputChange('siteLogoUrl', e.target.value)} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="site-motto">Site Motto (Meta Description)</Label>
              <Textarea id="site-motto" value={settings.siteMotto} onChange={(e) => handleInputChange('siteMotto', e.target.value)} />
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
            <CardDescription>Edit the text and appearance of the top promotional banner.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center space-x-2">
                <Switch 
                    id="banner-enabled" 
                    checked={settings.banner.enabled} 
                    onCheckedChange={(checked) => handleBannerChange('enabled', checked)}
                />
                <Label htmlFor="banner-enabled">Show promotional banner</Label>
            </div>
            <div className="space-y-2">
                <Label htmlFor="banner-text">Banner Text</Label>
                <Textarea id="banner-text" value={settings.banner.text} onChange={(e) => handleBannerChange('text', e.target.value)} disabled={!settings.banner.enabled} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="banner-color">Banner Color</Label>
              <div className="flex items-center gap-2">
                <Input type="color" id="banner-color" value={settings.banner.color} onChange={(e) => handleBannerChange('color', e.target.value)} className="w-12 h-10 p-1" disabled={!settings.banner.enabled}/>
                <Input type="text" value={settings.banner.color} onChange={(e) => handleBannerChange('color', e.target.value)} disabled={!settings.banner.enabled} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Landing Page Videos</CardTitle>
                <CardDescription>Choose which videos to feature on the homepage.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex items-center space-x-2 mb-4">
                    <Switch 
                        id="show-featured" 
                        checked={settings.showFeatured} 
                        onCheckedChange={(checked) => handleInputChange('showFeatured', checked)}
                    />
                    <Label htmlFor="show-featured">Show featured videos section</Label>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded-md">
                    {allVideos.map((video) => (
                        <div key={video.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`video-${video.id}`}
                                checked={settings.featuredVideoIds.includes(video.id)}
                                onCheckedChange={(checked) => handleFeaturedVideoChange(video.id, checked)}
                                disabled={!settings.showFeatured}
                            />
                            <Label htmlFor={`video-${video.id}`}>{video.title}</Label>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button onClick={handleSaveSettings} size="lg">Save All Settings</Button>
        </div>
      </div>
    </div>
  )
}
