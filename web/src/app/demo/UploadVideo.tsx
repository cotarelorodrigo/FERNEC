"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { uploadVideo } from "@/lib/actions";
import { useToast } from "@/components/ui/use-toast";

export default function UploadVideo({ className }: { className?: string }) {
  const [submitFile, setSubmitFile] = useState<File>();
  const { toast } = useToast();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!submitFile) return;

    const response = await uploadVideo({
      video: submitFile,
      fileName: submitFile.name,
      fileType: submitFile.type,
    });

    toast({
      description: response.ok ? "File upload" : "Error uploading file",
      variant: response.ok ? "default" : "destructive",
    });
  };

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>Upload Interview</CardTitle>
        <CardDescription>
          Select a video from your device to upload.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit} className="flex-1 flex flex-col">
        <CardContent className="flex flex-1">
          <input
            id="pickImage"
            type="file"
            accept="video/mp4,video/x-m4v,video/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                setSubmitFile(e.target.files[0]);
              }
            }}
          />
          <label
            htmlFor="pickImage"
            className="border-2 border-dashed border-gray-200/40 rounded-lg w-full flex items-center justify-center relative overflow-hidden"
          >
            {submitFile ? (
              <video
                className="flex-none object-cover"
                src={URL.createObjectURL(submitFile)}
              />
            ) : (
              <svg
                className="w-16 h-16 text-gray-200"
                fill="none"
                height="64"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="64"
              >
                <polygon points="23 7 16 12 23 17 23 7 23 7" />
                <rect height="14" width="3" x="1" y="5" />
              </svg>
            )}
          </label>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            Upload
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}