"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

interface ChapterVideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

interface GDVideo {
  id: string;
  name: string;
  folderId: string;
}

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [videoOptions, setVideoOptions] = useState<GDVideo[]>([]);
  
  const [folders, setFolders] = useState<any[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');
  
  const [selectedFolder, setSelectedFolder] = useState<string>('');

  const router = useRouter();

  const fetchAllFolders = async () => {
    try {
      const response = await fetch("/api/folder");
      const data = await response.json();
      setFolders(data)
    } catch (error) {
      console.error("Error fetching Folders:", error);
    }
  };

  const fetchVideos = async (folderId: string) => {
    try {
      if(!folderId){
        setVideoOptions([])
        setSelectedVideoId('')
        return
      }
      const response = await fetch(`/api/courses?folderId=${folderId}`);
      const data = await response.json();
      setVideoOptions(data);
    } catch (error) {
      console.error("Error fetching GD videos:", error);
    }
  };
  
  useEffect(() => {
    fetchAllFolders()
  },[]
  )



  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async () => {
    try {
      if (selectedVideoId) {
        const response = await axios.get(`https://gdapi.viatg.workers.dev/generate.aspx?id=${selectedVideoId}`);
        const newselectedVideoId = response.data.link;
        
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}`,
          { videoUrl: newselectedVideoId }
        );
        
        toast.success("The section has been updated");
        toggleEdit();
        router.refresh();
        setSelectedVideoId('');
      } else {
        toast.error("Please select a video");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("Oh! Something went wrong");
    }
  };  

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Video section
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? "To cancel" : (initialData.videoUrl ? "Change the video" : "Add video")}
        </Button>
      </div>
      {!isEditing && (
        <div>
          {initialData.videoUrl ? (
            <div className="relative aspect-video mt-2">
              <Plyr source={{ type: 'video', sources: [{ src: initialData.videoUrl }]}}/>
            </div>
          ) : (
            <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
              <Video className="h-10 w-10 text-slate-500" />
            </div>
          )}
          {initialData.videoUrl && (
            <div className="text-xs text-muted-foreground">
              Video processing may take a while. Try updating the page if the video is not displayed.
            </div>
          )}
        </div>
      )}
      {isEditing && (
        <div>
           <select
            value={selectedFolder}
            onChange={(e) =>{
              {
                setSelectedFolder(e.target.value)
                fetchVideos(e.target.value)
              }
            }}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value=''>Select a video</option>
            {folders?.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
          <div className="text-xs text-muted-foreground mt-4">
            Select a Folder  for this section
          </div>
          <select
            value={selectedVideoId}
            onChange={(e) => setSelectedVideoId(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value=''>Select a video</option>
            {videoOptions?.map((video) => (
              <option key={video.id} value={video.id}>
                {video.name}
              </option>
            ))}
          </select>
          <div className="text-xs text-muted-foreground mt-4">
            Select a video for this section
          </div>
          <Button onClick={onSubmit} className="mt-4">
            Save
          </Button>
        </div>
      )}
    </div>
  );
};