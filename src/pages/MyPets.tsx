import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { petApi, petDetailsApi } from "@/lib/api";
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
  Calendar,
  Syringe,
  Stethoscope,
  Cake,
  X,
  MoreVertical,
  PlusCircle,
} from "lucide-react";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  imageUrl?: string;
}

interface PetDetail {
  id: string;
  petId: string;
  type: "VACCINE" | "VET_CHECKUP" | "BIRTHDAY";
  date: string;
  description: string;
  notes?: string;
}

const petTypes = [
  { value: "DOG", label: "Dog", icon: Dog },
  { value: "CAT", label: "Cat", icon: Cat },
  { value: "BIRD", label: "Bird", icon: Bird },
  { value: "RABBIT", label: "Rabbit", icon: Rabbit },
  { value: "OTHER", label: "Other", icon: PawPrint },
];

const petDetailTypes = [
  { value: "VACCINE", label: "Vaccine", icon: Syringe, color: "text-blue-600" },
  {
    value: "VET_CHECKUP",
    label: "Vet Checkup",
    icon: Stethoscope,
    color: "text-green-600",
  },
  { value: "BIRTHDAY", label: "Birthday", icon: Cake, color: "text-pink-600" },
];

const MyPets: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [petDetails, setPetDetails] = useState<PetDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddDetailDialogOpen, setIsAddDetailDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [detailType, setDetailType] = useState<
    "VACCINE" | "VET_CHECKUP" | "BIRTHDAY"
  >("VACCINE");
  const [detailDate, setDetailDate] = useState("");
  const [detailDescription, setDetailDescription] = useState("");
  const [detailNotes, setDetailNotes] = useState("");

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await petApi.getMyPets();

      console.log(response);
      const petsFromApi = (response.data.pets || []).map((pet) => ({
        id: pet._id,
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        age: pet.age,
        imageUrl: pet.imageUrl,
      }));

      setPets(petsFromApi);
    } catch (error) {
      toast.error("Failed to fetch pets. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPetDetails = async (petId: string) => {
    try {
      const response = await petDetailsApi.getPetDetails(petId);

      const detailsFromApi = (response.data.details || []).map((detail) => ({
        id: detail._id,
        petId: detail.petId,
        type: detail.type,
        date: detail.date,
        description: detail.description,
        notes: detail.notes,
      }));

      setPetDetails(detailsFromApi);
    } catch (error) {
      toast.error("Failed to load pet details");
    }
  };

  const resetForm = () => {
    setName("");
    setType("");
    setBreed("");
    setAge("");
    setImageFile(null);
    setImagePreview("");
    setEditingPet(null);
  };

  const resetDetailForm = () => {
    setDetailType("VACCINE");
    setDetailDate("");
    setDetailDescription("");
    setDetailNotes("");
  };

  const handleOpenDialog = (pet?: Pet) => {
    if (pet) {
      setEditingPet(pet);
      setName(pet.name);
      setType(pet.type);
      setBreed(pet.breed);
      setAge(pet.age.toString());
      setImagePreview(pet.imageUrl || "");
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleOpenDetailsDialog = async (pet: Pet) => {
    setSelectedPet(pet);
    setIsDetailsDialogOpen(true);

    await fetchPetDetails(pet.id);
  };

  const handleAddDetail = async (e: React.FormEvent) => {
    console.log("handle add detail called...");

    e.preventDefault();

    if (
      !selectedPet ||
      !detailType ||
      !detailDate ||
      !detailDescription ||
      !detailNotes
    ) {
      toast.error("Please fill in all required fields");
      return;
    }


    setIsSubmitting(true);

    const data = {
      petId: selectedPet.id,
      type: detailType,
      date: detailDate,
      description: detailDescription,
      notes: detailNotes,
    };

    try {
      await petDetailsApi.addPetDetail(data);
      toast.success("Detail added!");

      fetchPetDetails(selectedPet.id);
      resetDetailForm();
      setIsAddDetailDialogOpen(false);
    } catch (error) {
      toast.error("Failed to add detail");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDetail = async (detailId: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      await petDetailsApi.deletePetDetail(detailId);
      toast.success("Detail removed!");

      fetchPetDetails(selectedPet!.id);
    } catch (error) {
      toast.error("Failed to delete detail");
    }
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
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    formData.append("breed", breed);
    formData.append("age", age);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editingPet) {
        formData.append("petId", editingPet.id);
        await petApi.updatePet(formData);
        toast.success("Pet updated successfully!");
      } else {
        await petApi.addPet(formData);
        toast.success("Pet added successfully!");
      }
      fetchPets();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      if (editingPet) {
        toast.error("Pet updating process Failed...!");
      } else {
        toast.error("Pet added process Failed...!");
      }
      setIsDialogOpen(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (petId: string) => {
    if (!confirm("Are you sure you want to remove this pet?")) return;

    try {
      await petApi.deletePet(petId);
      toast.success("Pet removed successfully");
      fetchPets();
    } catch (error) {
      toast.error("Failed to Delete Pet. Please try again.");
    }
  };

  const getPetIcon = (petType: string, key: string) => {
    const petTypeData = petTypes.find((t) => t.value === petType);
    const Icon = petTypeData?.icon || PawPrint;
    return <Icon className="h-8 w-8" />;
  };

  const getPetDetails = (petId: string) => {
    return petDetails.filter((detail) => detail.petId === petId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDetailIcon = (type: string) => {
    const detailType = petDetailTypes.find((t) => t.value === type);
    const Icon = detailType?.icon || Calendar;
    return <Icon className={`h-4 w-4 ${detailType?.color}`} />;
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Pets</h1>
            <p className="text-muted-foreground">
              Manage your furry family members
            </p>
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
                  {editingPet ? "Edit Pet" : "Add New Pet"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="flex justify-center">
                  <label className="cursor-pointer">
                    <div className="w-24 h-24 rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Pet"
                          className="w-full h-full object-cover"
                        />
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
                      "Update Pet"
                    ) : (
                      "Add Pet"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-hp-teal-light rounded-full flex items-center justify-center mx-auto mb-4">
              <PawPrint className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No pets yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Add your first pet to get started!
            </p>
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
                <div className="h-48 bg-gradient-to-br from-hp-teal-light to-hp-mint flex items-center justify-center">
                  {pet.imageUrl ? (
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-primary opacity-60">
                      {getPetIcon(pet.type, pet.id)}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {pet.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {petTypes.find((t) => t.value === pet.type)?.label} •{" "}
                        {pet.breed}
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-hp-peach rounded-full">
                      <span className="text-sm font-medium text-secondary">
                        {pet.age} {pet.age === 1 ? "year" : "years"}
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
                    <Button
                      variant="soft"
                      size="sm"
                      onClick={() => handleOpenDetailsDialog(pet)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        >
          <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {selectedPet?.name}'s Details
              </DialogTitle>
            </DialogHeader>

            {selectedPet && (
              <>
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg mb-6">
                  {selectedPet.imageUrl ? (
                    <img
                      src={selectedPet.imageUrl}
                      alt={selectedPet.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-hp-teal-light flex items-center justify-center">
                      {getPetIcon(selectedPet.type, selectedPet.id)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{selectedPet.name}</h3>
                    <p className="text-muted-foreground">
                      {
                        petTypes.find((t) => t.value === selectedPet.type)
                          ?.label
                      }{" "}
                      • {selectedPet.breed} • {selectedPet.age} years
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Pet Records</h3>

                  <Button
                    variant="hero"
                    size="sm"
                    onClick={() => setIsAddDetailDialogOpen(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Detail
                  </Button>
                </div>

                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">
                            Type
                          </th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">
                            Date
                          </th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">
                            Description
                          </th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">
                            Notes
                          </th>
                          <th className="py-3 px-4 text-left text-sm font-semibold text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-border">
                        {petDetails.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="py-8 text-center text-muted-foreground"
                            >
                              <div className="flex flex-col items-center justify-center gap-2">
                                <Calendar className="h-8 w-8 opacity-40" />
                                <p className="text-sm">No records found</p>
                                <p className="text-xs text-muted-foreground/70">
                                  Add your first pet detail to get started
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          petDetails.map((detail) => (
                            <tr
                              key={detail.id}
                              className="hover:bg-muted/30 transition-colors"
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center justify-center">
                                    {getDetailIcon(detail.type)}
                                  </div>
                                  <span className="text-sm font-medium">
                                    {
                                      petDetailTypes.find(
                                        (t) => t.value === detail.type
                                      )?.label
                                    }
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-sm font-medium">
                                  {formatDate(detail.date)}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-sm">
                                  {detail.description}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-sm text-muted-foreground max-w-xs truncate">
                                  {detail.notes || "-"}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteDetail(detail.id)}
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={isAddDetailDialogOpen}
          onOpenChange={setIsAddDetailDialogOpen}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Pet Detail</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddDetail} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Detail Type</Label>
                <Select
                  value={detailType}
                  onValueChange={(
                    value: "VACCINE" | "VET_CHECKUP" | "BIRTHDAY"
                  ) => setDetailType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select detail type" />
                  </SelectTrigger>
                  <SelectContent>
                    {petDetailTypes.map((dt) => (
                      <SelectItem key={dt.value} value={dt.value}>
                        <div className="flex items-center gap-2">
                          {getDetailIcon(dt.value)}
                          {dt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailDate">Reminder Date</Label>
                <Input
                  id="detailDate"
                  type="date"
                  value={detailDate}
                  onChange={(e) => setDetailDate(e.target.value)}
                  required
                  min={
                    new Date(new Date().setDate(new Date().getDate() + 1))
                      .toISOString()
                      .split("T")[0]
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailDescription">Description *</Label>
                <Input
                  id="detailDescription"
                  value={detailDescription}
                  onChange={(e) => setDetailDescription(e.target.value)}
                  placeholder="e.g., Annual Rabies Vaccine"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailNotes">Notes</Label>
                <Input
                  id="detailNotes"
                  value={detailNotes}
                  onChange={(e) => setDetailNotes(e.target.value)}
                  placeholder="Additional notes or reminders"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsAddDetailDialogOpen(false);
                    resetDetailForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="hero" className="flex-1">
                  Add Detail
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default MyPets;
