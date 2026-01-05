import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { profileApi, diseaseApi, petApi } from "@/lib/api";
import { toast } from "sonner";
import {
  User,
  Mail,
  Camera,
  Loader2,
  Shield,
  PawPrint,
  FileText,
  Calendar,
} from "lucide-react";

interface DiseaseArticle {
  _id: string;
  title: string;
  species: string;
  author: string;
  createdAt: string;
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(user?.profileImage || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [totalUserPosts, setTotalUserPosts] = useState(0);
  const [diseases, setDiseases] = useState<DiseaseArticle[]>([]);
  const [pets, setPets] = useState<any[]>([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileApi.getProfile();
      const profile = response.data.user || response.data.profile?.[0];

      setName(profile?.name || user?.name || "");
      setImagePreview(profile?.imageUrl || user?.profileImage || "");

      const petsRes = await petApi.getMyPets();
      setPets(petsRes.data?.pets || []);

      const diseasesRes = await diseaseApi.getMyDiseases();
      const diseaseList = diseasesRes.data?.diseases || [];

      setDiseases(diseaseList.slice(0, 5));
      setTotalUserPosts(diseaseList.length);
    } catch (error) {
      toast.error("Failed to load profile");
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
      toast.error("Name is required");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await profileApi.updateProfile(formData);
      updateUser({ ...user!, name, profileImage: imagePreview });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Profile update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteEmail || !deletePassword) {
      toast.error("Email and password are required");
      return;
    }

    try {
      await profileApi.deleteAccount(deleteEmail, deletePassword);
      toast.success("Account deleted successfully");

      localStorage.clear();
      window.location.href = "/";
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const stats = [
    {
      label: "Pets",
      value: pets.length,
      icon: PawPrint,
      color: "bg-hp-teal-light text-primary",
    },
    {
      label: "Articles",
      value: totalUserPosts,
      icon: FileText,
      color: "bg-hp-peach text-secondary",
    },
    {
      label: "Member Since",
      value: "Dec 2024",
      icon: Calendar,
      color: "bg-hp-mint text-accent",
    },
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
            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            <div className="h-32 gradient-hero" />

            <div className="relative px-6 pb-6">
              <div className="absolute -top-16 left-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-card shadow-lg overflow-hidden border-4 border-card">
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-4xl font-bold">
                          {name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer">
                    <Camera className="h-5 w-5 text-white" />
                    <input type="file" hidden onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              <div className="pt-20">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label>Full Name</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div>
                      <Label>Email</Label>
                      <Input value={user?.email} disabled />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-card rounded-xl p-4 text-center">
                <p className="text-lg font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-destructive/5 border border-destructive/20 rounded-2xl">
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Danger Zone
            </h3>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-destructive mb-4">
              Confirm Account Deletion
            </h3>

            <Input
              placeholder="Email"
              value={deleteEmail}
              onChange={(e) => setDeleteEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              className="mt-3"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Profile;
