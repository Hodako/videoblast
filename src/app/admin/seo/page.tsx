// src/app/admin/seo/page.tsx
'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getVideos, updateVideo } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getSEOSuggestions } from "@/ai/flows/seo-suggestions";
import { Sparkles, Wand2 } from "lucide-react";

export default function AdminSEOPage() {
  const { toast } = useToast();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentDescription, setCurrentDescription] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useState(() => {
    const fetchVids = async () => {
        const vids = await getVideos();
        setVideos(vids);
    }
    fetchVids();
  }, []);

  const handleVideoSelect = (videoId) => {
    const video = videos.find(v => v.id.toString() === videoId);
    if(video) {
        setSelectedVideo(video);
        setCurrentTitle(video.meta_data?.seo_title || video.title);
        setCurrentDescription(video.meta_data?.seo_description || video.description);
        setSuggestions(null);
    }
  };

  const handleGenerateSuggestions = async () => {
    if(!selectedVideo) {
        toast({ variant: "destructive", title: "Error", description: "Please select a video first." });
        return;
    }
    setIsLoading(true);
    setSuggestions(null);
    try {
        const result = await getSEOSuggestions({
            currentTitle: selectedVideo.title,
            currentDescription: selectedVideo.description,
            tags: selectedVideo.tags
        });
        setSuggestions(result);
    } catch(error) {
        toast({ variant: "destructive", title: "Error", description: `Failed to get suggestions: ${error.message}` });
    } finally {
        setIsLoading(false);
    }
  }

  const handleUpdateSEO = async () => {
     if(!selectedVideo) return;
     try {
         const updatedVideo = {
             ...selectedVideo,
             meta_data: {
                 ...selectedVideo.meta_data,
                 seo_title: currentTitle,
                 seo_description: currentDescription
             }
         }
         await updateVideo(updatedVideo);
         toast({ title: "Success", description: "SEO data updated successfully." });
     } catch (error) {
         toast({ variant: "destructive", title: "Error", description: `Failed to update SEO: ${error.message}` });
     }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Sparkles className="text-primary"/> AI SEO Assistant</h1>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select a Video</CardTitle>
          <CardDescription>Choose a video to optimize its SEO title and description.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleVideoSelect}>
            <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Select a video..." />
            </SelectTrigger>
            <SelectContent>
                {videos.map((video: any) => (
                    <SelectItem key={video.id} value={video.id.toString()}>{video.title}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedVideo && (
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Edit SEO</CardTitle>
                    <CardDescription>Manually edit the SEO metadata for your video.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                        <Label htmlFor="seo-title" className="font-semibold">SEO Title</Label>
                        <Textarea id="seo-title" value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} className="mt-2" />
                    </div>
                     <div>
                        <Label htmlFor="seo-desc" className="font-semibold">SEO Description</Label>
                        <Textarea id="seo-desc" value={currentDescription} onChange={(e) => setCurrentDescription(e.target.value)} className="mt-2 h-32"/>
                    </div>
                    <Button onClick={handleUpdateSEO}>Save SEO Changes</Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>AI Suggestions</CardTitle>
                    <CardDescription>Let AI generate optimized suggestions for you.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleGenerateSuggestions} disabled={isLoading}>
                        <Wand2 className="mr-2 h-4 w-4"/>
                        {isLoading ? 'Generating...' : 'Generate Suggestions'}
                    </Button>

                    {suggestions && (
                        <div className="mt-6 space-y-4 animate-in fade-in-50">
                            <div>
                                <h4 className="font-semibold mb-2">Title Suggestions:</h4>
                                <ul className="list-disc pl-5 space-y-2">
                                    {suggestions.titleSuggestions.map((title, index) => (
                                        <li key={index} className="text-sm cursor-pointer hover:text-primary" onClick={() => setCurrentTitle(title)}>{title}</li>
                                    ))}
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold mb-2">Description Suggestions:</h4>
                                 <ul className="list-disc pl-5 space-y-2">
                                    {suggestions.descriptionSuggestions.map((desc, index) => (
                                        <li key={index} className="text-sm cursor-pointer hover:text-primary" onClick={() => setCurrentDescription(desc)}>{desc}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
          </div>
      )}
    </div>
  )
}
