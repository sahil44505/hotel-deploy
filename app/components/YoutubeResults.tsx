'use client';

import { useEffect, useState } from 'react';

interface YouTubeResultsProps {
  decodedTitle: any;
}

const YouTubeResults = ({ decodedTitle }: YouTubeResultsProps) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
 

  useEffect(() => {
    if (decodedTitle && API_KEY) {
      const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&q=${encodeURIComponent(
        decodedTitle
      )}&type=video&maxResults=6`;

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
          }
          return response.json();
        })
        .then(data => {
          setResults(data.items || []);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
          setLoading(false);
        });
    }
  }, [decodedTitle, API_KEY]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (results.length === 0) {
    return <p>No results found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((item:any, index) => {
        const videoId = item.id.videoId;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        return (
          <div
            key={index}
            className="bg-white p-4 rounded shadow-lg hover:shadow-xl transition duration-300"
          >
            <a href={videoUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={item.snippet.thumbnails.medium.url}
                alt={item.snippet.title}
                className="rounded-lg transform scale-105 hover:scale-110 transition duration-300 ease-in-out shadow-md"
              />
            </a>
            <h3 className="text-xl mb-2 pt-4">
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {item.snippet.title}
              </a>
            </h3>
            <p className="text-gray-700 mb-3">{item.snippet.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default YouTubeResults;
