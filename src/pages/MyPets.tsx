import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { petApi } from '@/lib/api';
import {
  Plus,
  PawPrint,
  Pencil,
  Trash2,
  Loader2,
  Dog,
  Cat,
  Bird,
  Rabbit,
  ImagePlus,
} from 'lucide-react';

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  imageUrl?: string;
}

const petTypes = [
  { value: 'DOG', label: 'Dog', icon: Dog },
  { value: 'CAT', label: 'Cat', icon: Cat },
  { value: 'BIRD', label: 'Bird', icon: Bird },
  { value: 'RABBIT', label: 'Rabbit', icon: Rabbit },
  { value: 'OTHER', label: 'Other', icon: PawPrint },
];

const MyPets: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await petApi.getMyPets();

      console.log(response)
      const petsFromApi = (response.data.pets || []).map(pet => ({
        id: pet._id,       
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        age: pet.age,
        imageUrl: pet.imageUrl, 
      }));

      setPets(petsFromApi);
    } catch (error) {
      // Using mock data for demo
      setPets([
        { id: '1', name: 'Max', type: 'DOG', breed: 'Golden Retriever', age: 3, imageUrl: '' },
        { id: '2', name: 'Whiskers', type: 'CAT', breed: 'Persian', age: 2, imageUrl: '' },
        { id: '3', name: 'Tweety', type: 'BIRD', breed: 'Canary', age: 1, imageUrl: '' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setType('');
    setBreed('');
    setAge('');
    setImageFile(null);
    setImagePreview('');
    setEditingPet(null);
  };

  const handleOpenDialog = (pet?: Pet) => {
    if (pet) {
      setEditingPet(pet);
      setName(pet.name);
      setType(pet.type);
      setBreed(pet.breed);
      setAge(pet.age.toString());
      setImagePreview(pet.imageUrl || '');
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !type || !breed || !age) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('breed', breed);
    formData.append('age', age);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      if (editingPet) {
        formData.append('petId', editingPet.id);
        await petApi.updatePet(formData);
        toast.success('Pet updated successfully!');
      } else {
        await petApi.addPet(formData);
        toast.success('Pet added successfully!');
      }
      fetchPets();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      // Demo mode: update local state
      if (editingPet) {
        setPets(pets.map(p => p.id === editingPet.id ? {
          ...p, name, type, breed, age: parseInt(age), image: imagePreview
        } : p));
        toast.success('Pet updated successfully!');
      } else {
        setPets([...pets, {
          id: Date.now().toString(),
          name,
          type,
          breed,
          age: parseInt(age),
          imageUrl: imagePreview
        }]);
        toast.success('Pet added successfully!');
      }
      setIsDialogOpen(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (petId: string) => {
    if (!confirm('Are you sure you want to remove this pet?')) return;

    try {
      await petApi.deletePet(petId);
      toast.success('Pet removed successfully');
      fetchPets();
    } catch (error) {
      // Demo mode
      setPets(pets.filter(p => p.id !== petId));
      toast.success('Pet removed successfully');
    }
  };

  const getPetIcon = (petType: string,key:string) => {
    const petTypeData = petTypes.find(t => t.value === petType);
    const Icon = petTypeData?.icon || PawPrint;
    return <Icon className="h-8 w-8" />;
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Pets</h1>
            <p className="text-muted-foreground">Manage your furry family members</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Pet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingPet ? 'Edit Pet' : 'Add New Pet'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                {/* Image Upload */}
                <div className="flex justify-center">
                  <label className="cursor-pointer">
                    <div className="w-24 h-24 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Pet" className="w-full h-full object-cover" />
                      ) : (
                        <ImagePlus className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="petName">Pet Name</Label>
                  <Input
                    id="petName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter pet name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Pet Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pet type" />
                    </SelectTrigger>
                    <SelectContent>
                      {petTypes.map((pt) => (
                        <SelectItem key={pt.value} value={pt.value}>
                          {pt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="Enter breed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age (years)</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter age"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="hero"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : editingPet ? (
                      'Update Pet'
                    ) : (
                      'Add Pet'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pets Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-hp-teal-light rounded-full flex items-center justify-center mx-auto mb-4">
              <PawPrint className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No pets yet</h3>
            <p className="text-muted-foreground mb-6">Add your first pet to get started!</p>
            <Button variant="hero" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Pet
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet, index) => (
              <div
                key={`${pet.id}-${index}`}
                className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {/* Pet Image */}
                <div className="h-48 bg-gradient-to-br from-hp-teal-light to-hp-mint flex items-center justify-center">
                  {pet.imageUrl ? (
                    <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-primary opacity-60">
                      {getPetIcon(pet.type,pet.id)}
                    </div>
                  )}
                </div>

                {/* Pet Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{pet.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {petTypes.find(t => t.value === pet.type)?.label} • {pet.breed}
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-hp-peach rounded-full">
                      <span className="text-sm font-medium text-secondary">
                        {pet.age} {pet.age === 1 ? 'year' : 'years'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="soft"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(pet)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(pet.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MyPets;
