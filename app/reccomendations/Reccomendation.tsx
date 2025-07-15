'use client'
import React, { useEffect, useState } from 'react';
import HotelListing from '../hotels/HotelSearchResults';
import ReccomendationsList from './ReccomendationsList';
import { Home } from 'lucide-react';

const Reccomendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [titles, setTitles] = useState<string[]>([]);
  const [error, setError] = useState(null);
  const [hasdata, setHasData] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/recommendations');
        if (!res.ok || res.status === 500) {
          setHasData(false);
          throw new Error('No current bookings or server error');
        }

        const data = await res.json();
        console.log("Data:", data)
        const extractedTitles = data.slice(0, 5).map((item: any) => item.title);
        setTitles(extractedTitles);
        setRecommendations(data);
        setHasData(true);
      } catch (err: any) {
        setError(err.message);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);
console.log("Titles:", titles)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl font-semibold text-gray-800">Getting your recommendations...</p>
      </div>
    );
  }

  if (!hasdata) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-white shadow-lg rounded-2xl p-6 w-3/4 max-w-lg text-center">
          <Home className="w-16 h-16 text-gray-500 mx-auto" />
          <h2 className="text-2xl font-semibold mt-4">No Current Recommendations</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-24">
        <ReccomendationsList titles={titles} />
      </div>
    </div>
  );
};

export default Reccomendation;
