import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PawPrint, Heart, Shield, MessageCircle, Sparkles } from 'lucide-react';

const Landing: React.FC = () => {
  const features = [
    {
      icon: PawPrint,
      title: 'Pet Management',
      description: 'Keep track of all your pets\' details, from health records to daily routines.',
      color: 'bg-hp-teal-light text-primary',
    },
    {
      icon: Shield,
      title: 'Disease Information',
      description: 'Share and learn about pet diseases with our community of pet lovers.',
      color: 'bg-hp-peach text-secondary',
    },
    {
      icon: MessageCircle,
      title: 'AI Assistant',
      description: 'Get instant answers to your pet care questions from our smart assistant.',
      color: 'bg-hp-mint text-accent',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <div className="inline-flex items-center gap-3 mb-8 animate-fade-in">
              <div className="w-16 h-16 gradient-hero rounded-2xl flex items-center justify-center shadow-glow animate-float">
                <PawPrint className="h-9 w-9 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
                Happy-Paws
              </h1>
            </div>

            {/* Tagline */}
            <p className="text-2xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Care, Protect & Love
              <span className="block text-gradient-gold">
                Your Pets
              </span>
            </p>

            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Your all-in-one platform for managing pet health, connecting with fellow pet lovers, 
              and getting expert advice from our AI assistant.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/register">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative paw prints */}
        <div className="absolute bottom-10 left-1/4 opacity-10">
          <PawPrint className="h-20 w-20 text-primary rotate-[-15deg]" />
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-10">
          <PawPrint className="h-16 w-16 text-secondary rotate-[20deg]" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything Your Pet Needs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover all the features that make Happy-Paws the perfect companion for pet owners.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-8 shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-card rounded-3xl p-10 md:p-16 shadow-card relative overflow-hidden">
            <div className="absolute inset-0 gradient-hero opacity-5" />
            <div className="relative">
              <div className="flex justify-center mb-6">
                <Heart className="h-12 w-12 text-secondary fill-secondary/30 animate-pulse-soft" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Ready to give your pets the best care?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of pet lovers who trust Happy-Paws for their pet care needs.
              </p>
              <Link to="/register">
                <Button variant="hero" size="lg">
                  Start Your Journey
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-hero rounded-lg flex items-center justify-center">
                <PawPrint className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Happy-Paws</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Happy-Paws. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
