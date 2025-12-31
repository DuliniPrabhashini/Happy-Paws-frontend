import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { diseaseApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  Plus,
  FileText,
  Pencil,
  Trash2,
  Loader2,
  MessageCircle,
  Calendar,
  User,
  ImagePlus,
  Send,
} from 'lucide-react';

interface Disease {
  id: string;
  title: string;
  description: string;
  species: string;
  symptoms: string[];
  image?: string;
  author: string;
  authorId: string;
  createdAt: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

const speciesOptions = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Hamster', 'All Pets'];

interface DiseaseCardProps {
  disease: Disease;
  showActions?: boolean;
  onEdit: (disease: Disease) => void;
  onDelete: (diseaseId: string) => void;
  onViewComments: (disease: Disease) => void;
}

const DiseaseCard: React.FC<DiseaseCardProps> = ({ 
  disease, 
  showActions = false, 
  onEdit, 
  onDelete, 
  onViewComments 
}) => {
  const diseaseSymptoms = disease.symptoms || [];
  
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300">
      <div className="h-40 bg-gradient-to-br from-hp-teal-light to-hp-mint flex items-center justify-center">
        {disease.image ? (
          <img src={disease.image} alt={disease.title} className="w-full h-full object-cover" />
        ) : (
          <FileText className="h-12 w-12 text-primary opacity-40" />
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-hp-peach text-secondary text-xs font-medium rounded-full">
            {disease.species}
          </span>
        </div>

        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">{disease.title}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{disease.description}</p>

        <div className="flex flex-wrap gap-2 mb-3">
          {diseaseSymptoms.slice(0, 3).map((symptom, i) => (
            <span
              key={`${disease.id}-symptom-${i}`}
              className="px-2 py-1 bg-muted text-xs rounded-full"
            >
              {symptom}
            </span>
          ))}

          {diseaseSymptoms.length > 3 && (
            <span className="px-2 py-1 text-xs text-muted-foreground">
              +{diseaseSymptoms.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0 flex-1">
            <User className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{disease.author}</span>
            <span className="flex-shrink-0">•</span>
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{disease.createdAt}</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 flex-shrink-0 relative"
              onClick={() => onViewComments(disease)}
            >
              <MessageCircle className="h-4 w-4" />
              {(disease.comments || []).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {(disease.comments || []).length}
                </span>
              )}
            </Button>

            {showActions && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 flex-shrink-0"
                  onClick={() => onEdit(disease)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 flex-shrink-0 text-destructive hover:text-destructive"
                  onClick={() => onDelete(disease.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Diseases: React.FC = () => {
  const { user } = useAuth();
  const [allDiseases, setAllDiseases] = useState<Disease[]>([]);
  const [myDiseases, setMyDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDisease, setEditingDisease] = useState<Disease | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [commentText, setCommentText] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [species, setSpecies] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async () => {
    try {
      const [allRes, myRes] = await Promise.all([
        diseaseApi.getAllDiseases(),
        diseaseApi.getMyDiseases(),
      ]);

      console.log("all : ",allRes)
      console.log("my re : ",myRes)
      setAllDiseases(
  allRes.data.diseases.map((d: any) => ({
    id: d._id,
    title: d.title,
    description: d.description,
    species: d.species,
    symptoms: d.symptoms || [],
    image: d.imageUrl, 
    author: d.createdBy?.email || 'Unknown',
    authorId: d.createdBy?._id || '',
    createdAt: d.createdAt,
    comments: [], 
  }))
);
     setMyDiseases(
  myRes.data.diseases.map((d: any) => ({
    id: d._id,
    title: d.title,
    description: d.description,
    species: d.species,
    symptoms: d.symptoms || [],
    image: d.imageUrl, 
    author: d.createdBy?.email || 'Unknown',
    authorId: d.createdBy?._id || '',
    createdAt: d.createdAt,
    comments: [], 
  }))
);
    } catch (error) {
      const mockDiseases: Disease[] = [
        {
          id: '1',
          title: 'Canine Parvovirus',
          description: 'A highly contagious viral disease that can produce life-threatening illness. The virus attacks rapidly dividing cells in a dog\'s body.',
          species: 'Dog',
          symptoms: ['Severe vomiting', 'Bloody diarrhea', 'Lethargy', 'Loss of appetite'],
          author: 'Dr. Smith',
          authorId: '1',
          createdAt: '2024-12-10',
          comments: [
            { id: '1', text: 'Very informative article!', author: 'John', createdAt: '2024-12-11' },
          ],
        },
        {
          id: '2',
          title: 'Feline Upper Respiratory Infection',
          description: 'Common illness in cats caused by various viruses and bacteria. Similar to a human cold but can be more serious.',
          species: 'Cat',
          symptoms: ['Sneezing', 'Runny nose', 'Eye discharge', 'Fever'],
          author: 'Dr. Johnson',
          authorId: '2',
          createdAt: '2024-12-08',
          comments: [],
        },
        {
          id: '3',
          title: 'Heartworm Disease Prevention',
          description: 'Heartworm disease is a serious and potentially fatal disease in pets. It is caused by foot-long worms that live in the heart and lungs.',
          species: 'All Pets',
          symptoms: ['Persistent cough', 'Fatigue', 'Reduced appetite', 'Weight loss'],
          author: user?.name || 'You',
          authorId: user?.id || '3',
          createdAt: '2024-12-05',
          comments: [],
        },
      ];
      setAllDiseases(mockDiseases);
      setMyDiseases(mockDiseases.filter(d => d.authorId === user?.id || d.authorId === '3'));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSpecies('');
    setSymptoms('');
    setImageFile(null);
    setImagePreview('');
    setEditingDisease(null);
  };

  const handleOpenDialog = (disease?: Disease) => {
    if (disease) {
      setEditingDisease(disease);
      setTitle(disease.title);
      setDescription(disease.description);
      setSpecies(disease.species);
      setSymptoms(disease.symptoms?.join(', ') || '');
      setImagePreview(disease.image || '');
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
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !species || !symptoms) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('species', species);
    formData.append('symptoms', symptoms);
    if (imageFile) formData.append('image', imageFile);

    try {
     if (editingDisease) {
        formData.append('diseaseId', (editingDisease as any).id || (editingDisease as any)._id);
        await diseaseApi.updateDisease(formData);
        toast.success('Article updated successfully!');
      } else {
        await diseaseApi.addDisease(formData);
        toast.success('Article published successfully!');
      }
      fetchDiseases();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      const newDisease: Disease = {
        id: editingDisease?.id || Date.now().toString(),
        title,
        description,
        species,
        symptoms: symptoms.split(',').map(s => s.trim()).filter(s => s.length > 0),
        image: imagePreview,
        author: user?.name || 'You',
        authorId: user?.id || '3',
        createdAt: new Date().toISOString().split('T')[0],
        comments: editingDisease?.comments || [],
      };

      if (editingDisease) {
        setAllDiseases(allDiseases.map(d => d.id === editingDisease.id ? newDisease : d));
        setMyDiseases(myDiseases.map(d => d.id === editingDisease.id ? newDisease : d));
        toast.success('Article updated successfully!');
      } else {
        setAllDiseases([newDisease, ...allDiseases]);
        setMyDiseases([newDisease, ...myDiseases]);
        toast.success('Article published successfully!');
      }
      setIsDialogOpen(false);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (diseaseId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      await diseaseApi.deleteDisease(diseaseId);
      toast.success('Article deleted successfully');
      fetchDiseases();
    } catch (error) {
      setAllDiseases(allDiseases.filter(d => d.id !== diseaseId));
      setMyDiseases(myDiseases.filter(d => d.id !== diseaseId));
      toast.success('Article deleted successfully');
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedDisease) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText,
      author: user?.name || 'You',
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedDisease = {
      ...selectedDisease,
      comments: [...(selectedDisease.comments || []), newComment],
    };

    setSelectedDisease(updatedDisease);
    setAllDiseases(allDiseases.map(d => d.id === selectedDisease.id ? updatedDisease : d));
    setMyDiseases(myDiseases.map(d => d.id === selectedDisease.id ? updatedDisease : d));
    setCommentText('');
    toast.success('Comment added!');
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Disease Articles</h1>
            <p className="text-muted-foreground">Share and learn about pet health</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingDisease ? 'Edit Article' : 'Create New Article'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="flex justify-center">
                  <label className="cursor-pointer">
                    <div className="w-full h-32 rounded-xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <ImagePlus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Upload cover image</p>
                        </div>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Article title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Species</Label>
                  <Select value={species} onValueChange={setSpecies}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      {speciesOptions.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the disease..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms (comma separated)</Label>
                  <Input
                    id="symptoms"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g., Fever, Cough, Lethargy"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="hero" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editingDisease ? 'Update' : 'Publish'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger key="all" value="all">All Articles</TabsTrigger>
            <TabsTrigger key="mine" value="mine">My Articles</TabsTrigger>
          </TabsList>

          <TabsContent key="all-content" value="all">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : allDiseases.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No articles yet</h3>
                <p className="text-muted-foreground">Be the first to share knowledge!</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allDiseases.map((disease, index) => (
                  <div key={`all-${disease.id}`} className="animate-fade-in-up min-w-0" style={{ animationDelay: `${0.1 * index}s` }}>
                    <DiseaseCard 
                      disease={disease} 
                      onEdit={handleOpenDialog}
                      onDelete={handleDelete}
                      onViewComments={setSelectedDisease}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent key="mine-content" value="mine">
            {myDiseases.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No articles yet</h3>
                <p className="text-muted-foreground mb-6">Share your pet health knowledge!</p>
                <Button variant="hero" onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Article
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myDiseases.map((disease, index) => (
                  <div key={`mine-${disease.id}`} className="animate-fade-in-up min-w-0" style={{ animationDelay: `${0.1 * index}s` }}>
                    <DiseaseCard 
                      disease={disease} 
                      showActions 
                      onEdit={handleOpenDialog}
                      onDelete={handleDelete}
                      onViewComments={setSelectedDisease}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedDisease} onOpenChange={() => setSelectedDisease(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Comments on "{selectedDisease?.title}"</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {!selectedDisease?.comments || selectedDisease.comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No comments yet. Be the first!</p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedDisease.comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-muted rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-xs text-primary-foreground font-semibold">
                            {comment.author.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-sm text-foreground">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                      </div>
                      <p className="text-sm text-foreground">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-border">
                <Input
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button variant="hero" size="icon" onClick={handleAddComment}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Diseases;