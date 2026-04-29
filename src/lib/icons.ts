import {
  Sparkles,
  Package,
  Star,
  Heart,
  Brain,
  Compass,
  Smile,
  TrendingUp,
  Send,
  ExternalLink,
  Mail,
  Camera,
  MessageCircle,
  Globe,
  Phone,
  Music,
  Users,
  Palette,
  Award,
  Target,
  Zap,
  Sun,
  Flower,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  Package,
  Star,
  Heart,
  Brain,
  Compass,
  Smile,
  TrendingUp,
  Send,
  ExternalLink,
  Mail,
  Camera,
  MessageCircle,
  Globe,
  Phone,
  Music,
  Users,
  Palette,
  Award,
  Target,
  Zap,
  Sun,
  Flower,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export const getIcon = (name: string | null | undefined, fallback: LucideIcon = Sparkles): LucideIcon => {
  if (!name) return fallback;
  return ICON_MAP[name] ?? fallback;
};
