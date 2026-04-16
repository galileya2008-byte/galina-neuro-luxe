import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";

type GalleryImage = {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
};

const GalleryPage = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("gallery_images")
        .select("id, image_url, title, description")
        .order("sort_order", { ascending: true });
      if (data) setImages(data);
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-6 py-24">
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={16} /> На главную
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            Галерея <span className="italic text-primary">работ</span>
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="overflow-hidden rounded-xl shadow-card cursor-pointer group"
              onClick={() => setSelected(img)}
            >
              <img
                src={img.image_url}
                alt={img.title || "Нейрографика"}
                className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>

        {images.length === 0 && (
          <p className="text-center text-muted-foreground py-16 font-body">
            Работы пока не добавлены
          </p>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
            onClick={() => setSelected(null)}
          >
            <X size={28} />
          </button>
          <img
            src={selected.image_url}
            alt={selected.title || "Нейрографика"}
            className="max-w-full max-h-[85vh] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
