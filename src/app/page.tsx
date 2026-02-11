"use client";

import { useEffect, useState } from "react";

type Video = {
  url: string;
  public_id: string;
};

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [cloudinaryLoaded, setCloudinaryLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    script.onload = () => setCloudinaryLoaded(true); //mark loaded
    document.body.appendChild(script);
  }, []);

  const uploadVideo = async () => {
    if (!cloudinaryLoaded){
      alert("Cloudinary widget is still loading, please wait...");
      return;
    }

    const res = await fetch("/api/cloudinary-sign", { method: "POST" });
    const data = await res.json();

    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: data.cloudName,
        apiKey: data.apiKey,
        uploadSignature: data.signature,
        uploadSignatureTimestamp: data.timestamp,
        folder: "video-showcase",
        resourceType: "video",
        sources: ["local"],
        maxFileSize: 500_000_000, // 500MB,
        multiple: false,
      },
      (error: any, result: any) => {
        if (!error && result.event === "success") {
          setVideos((prev) => [
            ...prev,
            {
              url: result.info.secure_url,
              public_id: result.info.public_id,
              tags: result.info.tags,
            },
          ]);
        }
      }
    );

    widget.open();
  };

  return (
    <main className="container">
      <h1 className="title">🎬 Cloudinary Video Showcase</h1>

      <button onClick={uploadVideo} className="upload-btn">
        Upload Video
      </button>

      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video.public_id} video={video} />
        ))}
      </div>
    </main>
  );
}

function VideoCard({ video }: { video: Video }) {
  const thumbnail = video.url.replace(
    "/upload/",
    "/upload/so_1,w_400,h_250,c_fill/"
  );

  const optimizedVideo = video.url.replace(
    "/upload/",
    "/upload/f_auto,q_auto,w_640,h_360,c_fill/"
  );


  return (
    <div className="video-card">
      <img src={thumbnail} alt="Thumbnail" className="video-thumbnail" />
      <video src={optimizedVideo} controls className="video-player" />
    </div>
  );
}
