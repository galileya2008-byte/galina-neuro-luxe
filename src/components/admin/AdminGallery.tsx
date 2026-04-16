import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload } from "lucide-react";

type GalleryImage = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  sort_order: number;
};

const AdminGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchImages(); }, []);

  const fetchImages = async () => {
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setImages(data);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Ошибка загрузки", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);

    await supabase.from("gallery_images").insert({
      image_url: urlData.publicUrl,
      title: file.name.replace(/\.[^/.]+$/, ""),
      sort_order: images.length,
    });

    toast({ title: "Изображение загружено!" });
    setUploading(false);
    fetchImages();
  };

  const remove = async (image: GalleryImage) => {
    if (!confirm("Удалить изображение?")) return;
    
    // Extract file name from URL
    const parts = image.image_url.split("/");
    const fileName = parts[parts.length - 1];
    await supabase.storage.from("gallery").remove([fileName]);
    await supabase.from("gallery_images").delete().eq("id", image.id);
    fetchImages();
  };

  const updateTitle = async (id: string, title: string) => {
    await supabase.from("gallery_images").update({ title }).eq("id", id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl">Галерея ({images.length})</h2>
        <label>
          <Button asChild className="gradient-primary text-primary-foreground cursor-pointer">
            <span>
              <Upload size={16} /> {uploading ? "Загрузка..." : "Загрузить"}
            </span>
          </Button>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group bg-card border border-border rounded-xl overflow-hidden">
            <img src={image.image_url} alt={image.title || ""} className="w-full h-40 object-cover" />
            <div className="p-3">
              <Input
                defaultValue={image.title || ""}
                placeholder="Название"
                className="text-xs"
                onBlur={(e) => updateTitle(image.id, e.target.value)}
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              onClick={() => remove(image)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
        {images.length === 0 && (
          <p className="col-span-3 text-center text-muted-foreground py-8">Изображений пока нет</p>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
