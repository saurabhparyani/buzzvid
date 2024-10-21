import { useState, lazy, Suspense, useRef, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_POST } from "@/graphql/mutations/CreatePost";
import { toast } from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import mobileCaseImage from "@/assets/mobile-case.png";
import { Pause, Play } from "lucide-react";

const VideoUploader = lazy(() => import("@/components/VideoUploader"));

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [createPost, { loading }] = useMutation(CREATE_POST);

  const handleFileChange = (newFile: File) => {
    setFile(newFile);
    const url = URL.createObjectURL(newFile);
    setIsPlaying(true);
    setVideoPreviewUrl(url);
  };

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, videoPreviewUrl]);

  const handleChangeVideo = (e: React.MouseEvent) => {
    e.preventDefault();
    setFile(null);
    setVideoPreviewUrl(null);
    setIsPlaying(false);
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCaption = e.target.value.slice(0, 150);
    setCaption(newCaption);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload a video");
      return;
    }

    try {
      const result = await createPost({
        variables: {
          text: caption,
          video: file,
        },
        context: {
          hasUpload: true,
        },
      });

      if (result.data?.createPost) {
        toast.success("Post created successfully");
        navigate({ to: "/feed" });
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    }
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleDiscardVideo = (e: React.MouseEvent) => {
    e.preventDefault();
    setFile(null);
    setVideoPreviewUrl(null);
    setIsPlaying(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 space-y-6">
            <Suspense fallback={<Spinner />}>
              {file ? (
                <div className="space-y-4">
                  <Button
                    onClick={handleChangeVideo}
                    variant="outline"
                    className="w-full"
                    type="button"
                  >
                    Change Video
                  </Button>
                  <Button
                    onClick={handleDiscardVideo}
                    variant="destructive"
                    className="w-full"
                    type="button"
                  >
                    Discard Video
                  </Button>
                </div>
              ) : (
                <VideoUploader onFileChange={handleFileChange} />
              )}
            </Suspense>
            <div>
              <div className="flex justify-between mb-2">
                <label htmlFor="caption" className="block text-sm font-medium">
                  Caption
                </label>
                <span className="text-sm text-gray-500">
                  {caption.length}/150 characters
                </span>
              </div>
              <Textarea
                id="caption"
                placeholder="Write a caption..."
                value={caption}
                onChange={handleCaptionChange}
                className="w-full p-2 mb-5"
                maxLength={150}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Uploading..." : "Upload Post"}
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative">
            <div className="max-w-[300px] mx-auto relative">
              <img
                src={mobileCaseImage}
                alt="Mobile Case"
                className="w-full h-auto"
              />
              {videoPreviewUrl && (
                <div className="absolute top-[6%] left-[5%] w-[90%] h-[88%] rounded-[22px] overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                  >
                    <source src={videoPreviewUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <button
                    onClick={togglePlayPause}
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-full p-2 transition-opacity duration-300 hover:bg-opacity-75"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Upload;
