import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import {
  PawPrint,
  FileText,
  Bell,
  ArrowRight,
  Syringe,
  Calendar,
  TrendingUp,
} from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();

  const quickStats = [
    {
      label: 'My Pets',
      value: '3',
      icon: PawPrint,
      color: 'bg-hp-teal-light text-primary',
      link: '/my-pets',
    },
    {
      label: 'Disease Posts',
      value: '12',
      icon: FileText,
      color: 'bg-hp-peach text-secondary',
      link: '/diseases',
    },
    {
      label: 'Health Score',
      value: '98%',
      icon: TrendingUp,
      color: 'bg-hp-mint text-accent',
      link: '/my-pets',
    },
  ];

  const upcomingReminders = [
    {
      pet: 'Max',
      type: 'Vaccination',
      date: 'Dec 20, 2024',
      icon: Syringe,
    },
    {
      pet: 'Bella',
      type: 'Vet Checkup',
      date: 'Dec 25, 2024',
      icon: Calendar,
    },
  ];

  const recentArticles = [
    {
      title: 'Common Cold in Dogs',
      species: 'Dog',
      author: 'Dr. Smith',
      date: '2 days ago',
    },
    {
      title: 'Feline Diabetes Guide',
      species: 'Cat',
      author: 'PetHealth Team',
      date: '5 days ago',
    },
    {
      title: 'Preventing Heartworm',
      species: 'All Pets',
      author: 'Dr. Johnson',
      date: '1 week ago',
    },
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 animate-fade-in">
            Welcome back, <span className="text-gradient-gold">{user?.name}!</span>
          </h1>
          <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Here's what's happening with your pets today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                to={stat.link}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up group"
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pet Alerts Panel */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 shadow-card animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-hp-peach rounded-xl flex items-center justify-center">
                  <Bell className="h-5 w-5 text-secondary" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Upcoming Reminders</h2>
              </div>

              <div className="space-y-4">
                {upcomingReminders.map((reminder, index) => {
                  const Icon = reminder.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{reminder.pet}</p>
                        <p className="text-sm text-muted-foreground">{reminder.type}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{reminder.date}</p>
                    </div>
                  );
                })}
              </div>

              <Button variant="soft" className="w-full mt-6">
                View All Reminders
              </Button>
            </div>
          </div>

          {/* Recent Disease Articles */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-6 shadow-card animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-hp-teal-light rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Recent Disease Articles</h2>
                </div>
                <Link to="/diseases">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentArticles.map((article, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 gradient-hero rounded-xl flex items-center justify-center flex-shrink-0">
                      <PawPrint className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{article.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {article.species} • By {article.author}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground flex-shrink-0">{article.date}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-hp-mint rounded-xl">
                <p className="text-sm text-foreground">
                  <strong>💡 Tip:</strong> Regular health checkups can prevent many common pet diseases. 
                  Schedule your next appointment today!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;
