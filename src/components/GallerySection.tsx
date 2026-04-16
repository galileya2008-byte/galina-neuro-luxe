import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

type GalleryImage = {
  id: string;
  image_url: string;
  title: string | null;
  description: string | null;
};

const GallerySection = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("gallery_images")
        .select("id, image_url, title, description")
        .order("sort_order", { ascending: true })
        .limit(12);
      if (data) setImages(data);
    };
    fetch();
  }, []);

  const paginate = useCallback(
    (dir: number) => {
      setDirection(dir);
      setCurrent((prev) => (prev + dir + images.length) % images.length);
    },
    [images.length]
  );

  // Auto-advance every 5s
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [images.length, paginate]);

  if (images.length === 0) return null;

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  // Show 3 images on desktop: prev, current, next
  const prevIdx = (current - 1 + images.length) % images.length;
  const nextIdx = (current + 1) % images.length;
  const visibleImages = images.length >= 3
    ? [images[prevIdx], images[current], images[nextIdx]]
    : images.length === 2
      ? [images[current], images[(current + 1) % 2]]
      : [images[0]];

  return (
    <section id="gallery" className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.2em] uppercase text-primary mb-3">
            Галерея
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            Мои <span className="italic text-primary">работы</span>
          </h2>
        </motion.div>

        {/* Mobile: single image carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden rounded-2xl shadow-card aspect-square">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.img
                key={images[current].id}
                src={images[current].image_url}
                alt={images[current].title || "Нейрографика"}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>
          {images.length > 1 && (
            <div className="flex justify-center gap-4 mt-4">
              <button onClick={() => paginate(-1)} className="p-2 rounded-full bg-card border border-border text-foreground hover:bg-primary/10 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => paginate(1)} className="p-2 rounded-full bg-card border border-border text-foreground hover:bg-primary/10 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Desktop: 3-image view */}
        <div className="hidden md:block relative">
          <div className="grid grid-cols-3 gap-6">
            {visibleImages.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="overflow-hidden rounded-2xl shadow-card group"
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
          {images.length > 3 && (
            <div className="flex justify-center gap-4 mt-6">
              <button onClick={() => paginate(-1)} className="p-2 rounded-full bg-card border border-border text-foreground hover:bg-primary/10 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <span className="flex items-center text-sm text-muted-foreground font-body">
                {current + 1} / {images.length}
              </span>
              <button onClick={() => paginate(1)} className="p-2 rounded-full bg-card border border-border text-foreground hover:bg-primary/10 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Link to full gallery */}
        <div className="text-center mt-10">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 font-body text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Смотреть все работы <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
