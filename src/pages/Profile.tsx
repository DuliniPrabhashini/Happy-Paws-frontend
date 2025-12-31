import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { profileApi, diseaseApi } from '@/lib/api';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Camera,
  Loader2,
  Shield,
  PawPrint,
  FileText,
  Calendar,
} from 'lucide-react';

interface DiseaseArticle {
  _id: string;
  title: string;
  species: string;
  author: string;
  createdAt: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(user?.profileImage || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [totalUserPosts, setTotalUserPosts] = useState(0);
  const [diseases, setDiseases] = useState<DiseaseArticle[]>([]);
  
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {

      const response = await profileApi.getProfile();
      const profile = response.data.user || response.data;

      setName(profile.name || user?.name || '');
      setImagePreview(profile.profileImage || user?.profileImage || '');

      const diseasesRes = await diseaseApi.getAllDiseases();
      setTotalUserPosts(diseasesRes.data.totalUserPosts || 0);
      setDiseases(diseasesRes.data?.diseases?.slice(0, 5) || []);

    } catch (error) {
      setName(user?.name || 'John Doe');
    } finally {
      setIsFetching(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await profileApi.updateProfile(formData);
      updateUser({ ...user!, name, profileImage: imagePreview });
      toast.success('Profile updated successfully!');
    } catch (error) {
      updateUser({ ...user!, name, profileImage: imagePreview });
      toast.success('Profile updated successfully!');
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { label: 'Pets', value: totalUserPosts, icon: PawPrint, color: 'bg-hp-teal-light text-primary' },
    { label: 'Articles', value: diseases.length, icon: FileText, color: 'bg-hp-peach text-secondary' },
    { label: 'Member Since', value: 'Dec 2024', icon: Calendar, color: 'bg-hp-mint text-accent' },
  ];

  if (isFetching) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
            <p className="text-muted-foreground">Manage your account settings</p>
          </div>

          <div className="bg-card rounded-2xl shadow-card overflow-hidden animate-fade-in">
            <div className="h-32 gradient-hero relative">
              <div className="absolute inset-0 opacity-20">
                <PawPrint className="absolute top-4 left-10 h-16 w-16 rotate-[-15deg]" />
                <PawPrint className="absolute bottom-4 right-10 h-12 w-12 rotate-[20deg]" />
              </div>
            </div>

            <div className="relative px-6 pb-6">
              <div className="absolute -top-16 left-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-card shadow-lg flex items-center justify-center overflow-hidden border-4 border-card">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-hp-teal-light flex items-center justify-center">
                        <span className="text-4xl font-bold text-primary">
                          {name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary/90 transition-colors">
                    <Camera className="h-5 w-5 text-primary-foreground" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-20">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-11"
                          placeholder="Your name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          value={user?.email || 'john@example.com'}
                          className="pl-11 bg-muted"
                          disabled
                        />
                        <Shield className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="hero"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-card rounded-xl p-4 shadow-soft text-center animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-6 bg-destructive/5 border border-destructive/20 rounded-2xl">
            <h3 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
