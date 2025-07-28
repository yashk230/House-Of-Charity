import { Globe, Heart, MapPin, Phone, Search, Star, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NGO } from '../types';

const NGOs: React.FC = () => {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [filteredNGOs, setFilteredNGOs] = useState<NGO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app, fetch from Firebase
    const mockNGOs: NGO[] = [
      {
        id: '1',
        email: 'info@savethechildren.org',
        name: 'John Smith',
        user_type: 'ngo',
        description: 'Save the Children - Working to improve the lives of children through better education, health care, and economic opportunities.',
        phone: '+1 (555) 123-4567',
        address: '123 Charity St, New York, NY 10001',
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        email: 'contact@foodbank.org',
        name: 'Sarah Johnson',
        user_type: 'ngo',
        description: 'Food Bank International - Providing food assistance to families in need across the country.',
        phone: '+1 (555) 987-6543',
        address: '456 Hope Ave, Los Angeles, CA 90210',
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        email: 'hello@cleanwater.org',
        name: 'Michael Brown',
        user_type: 'ngo',
        description: 'Clean Water Initiative - Bringing clean water to communities in developing countries.',
        phone: '+1 (555) 456-7890',
        address: '789 Water Way, Seattle, WA 98101',
        verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    setNgos(mockNGOs);
    setFilteredNGOs(mockNGOs);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = ngos;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(ngo =>
        (ngo.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (ngo.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category (verification status)
    if (selectedCategory === 'verified') {
      filtered = filtered.filter(ngo => ngo.verified);
    } else if (selectedCategory === 'unverified') {
      filtered = filtered.filter(ngo => !ngo.verified);
    }

    setFilteredNGOs(filtered);
  }, [searchTerm, selectedCategory, ngos]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading NGOs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse NGOs</h1>
          <p className="text-gray-600">
            Discover and connect with verified non-governmental organizations making a difference
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search NGOs by name, description, or mission..."
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-48">
              <select
                className="input-field"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All NGOs</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredNGOs.length} of {ngos.length} NGOs
          </p>
        </div>

        {/* NGO Grid */}
        {filteredNGOs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNGOs.map((ngo) => (
              <div key={ngo.id} className="card hover:shadow-lg transition-shadow">
                {/* NGO Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {ngo.name}
                      </h3>
                      {ngo.verified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Star className="h-3 w-3 mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{ngo.mission}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {ngo.description}
                </p>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="truncate">{ngo.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{ngo.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>{ngo.email}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{ngo.connectedDonors.length} donors</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Heart className="h-4 w-4 mr-1" />
                    <span>{ngo.donationHistory.length} donations</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/ngos/${ngo.id}`}
                    className="flex-1 btn-outline text-center py-2"
                  >
                    View Details
                  </Link>
                  <button className="flex-1 btn-primary py-2">
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No NGOs found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="btn-primary"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Load More */}
        {filteredNGOs.length > 0 && (
          <div className="text-center mt-8">
            <button className="btn-outline">
              Load More NGOs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NGOs; 