import {
    Bell,
    Calendar,
    DollarSign,
    Eye,
    Heart,
    Package,
    Plus,
    Settings,
    TrendingUp,
    Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Donation } from '../types';

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    connectedUsers: 0,
    thisMonth: 0,
  });

  useEffect(() => {
    // Mock data - in real app, fetch from Firebase
    if (userProfile) {
      setRecentDonations([
        {
          id: '1',
          donor_id: 'donor1',
          ngo_id: 'ngo1',
          amount: 500,
          currency: 'USD',
          status: 'completed',
          message: 'Monthly donation',
          anonymous: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          donor_id: 'donor1',
          ngo_id: 'ngo2',
          amount: 200,
          currency: 'USD',
          status: 'completed',
          message: 'Food items donation',
          anonymous: false,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);

      if (userProfile.userType === 'donor') {
        setStats({
          totalDonations: 15,
          totalAmount: 2500,
          connectedUsers: 8,
          thisMonth: 3,
        });
      } else {
        setStats({
          totalDonations: 45,
          totalAmount: 8500,
          connectedUsers: 25,
          thisMonth: 12,
        });
      }
    }
  }, [userProfile]);

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const isDonor = userProfile.userType === 'donor';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userProfile.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {isDonor 
              ? 'Track your donations and see your impact'
              : 'Manage your organization and donations'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Heart className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <Users className="h-6 w-6 text-secondary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {isDonor ? 'Connected NGOs' : 'Connected Donors'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.connectedUsers}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Recent Donations */}
            <div className="card mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Donations</h2>
                <Link to="/donations" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View all
                </Link>
              </div>
              
              {recentDonations.length > 0 ? (
                <div className="space-y-4">
                  {recentDonations.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          {donation.type === 'money' ? (
                            <DollarSign className="h-5 w-5 text-primary-600" />
                          ) : (
                            <Package className="h-5 w-5 text-primary-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900">
                            {isDonor ? donation.ngoName : donation.donorName}
                          </p>
                          <p className="text-sm text-gray-600">{donation.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {donation.type === 'money' 
                            ? `$${donation.amount}` 
                            : `${donation.quantity} ${donation.unit}`
                          }
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          donation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          donation.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {donation.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No donations yet</p>
                  <Link to="/donations" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Make your first donation
                  </Link>
                </div>
              )}
            </div>

            {/* NGO-specific sections */}
            {!isDonor && (
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Requirements</h2>
                  <Link to="/requirements" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View all
                  </Link>
                </div>
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No requirements posted yet</p>
                  <Link to="/requirements/new" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Post a requirement
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {isDonor ? (
                  <>
                    <Link
                      to="/ngos"
                      className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Eye className="h-5 w-5 mr-3" />
                      Browse NGOs
                    </Link>
                    <Link
                      to="/donations/new"
                      className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-3" />
                      Make Donation
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/requirements/new"
                      className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-3" />
                      Post Requirement
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      Update Profile
                    </Link>
                  </>
                )}
                <Link
                  to="/connections"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Users className="h-5 w-5 mr-3" />
                  Manage Connections
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
                  <span className="text-gray-600">New donation received</span>
                  <span className="ml-auto text-gray-400">2h ago</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-success-600 rounded-full mr-3"></div>
                  <span className="text-gray-600">Donation delivered</span>
                  <span className="ml-auto text-gray-400">1d ago</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-secondary-600 rounded-full mr-3"></div>
                  <span className="text-gray-600">New connection</span>
                  <span className="ml-auto text-gray-400">3d ago</span>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming events</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 