import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus, Trash2 } from "lucide-react";

type Field =
  | { name: string; label: string; type: "text" | "textarea" | "url" }
  | { name: string; label: string; type: "list"; itemLabel: string };

type Block = {
  key: string;
  title: string;
  description?: string;
  fields: Field[];
};

const BLOCKS: Block[] = [
  {
    key: "hero",
    title: "Главный экран (Hero)",
    description: "Самое первое, что видят посетители на сайте.",
    fields: [
      { name: "eyebrow", label: "Подпись сверху", type: "text" },
      { name: "name_line_1", label: "Имя — 1-я строка", type: "text" },
      { name: "name_line_2", label: "Имя — 2-я строка (выделение)", type: "text" },
      { name: "subtitle", label: "Подзаголовок", type: "textarea" },
      { name: "cta_label", label: "Кнопка — текст", type: "text" },
      { name: "cta_href", label: "Кнопка — ссылка (например, #courses)", type: "text" },
      { name: "cta_secondary_label", label: "Вторая кнопка — текст (пусто = скрыть)", type: "text" },
      { name: "cta_secondary_href", label: "Вторая кнопка — ссылка", type: "text" },
    ],
  },
  {
    key: "stats",
    title: "Цифры на главной — заголовок секции",
    description: "Сами цифры редактируются на вкладке «Цифры».",
    fields: [
      { name: "title", label: "Подпись сверху", type: "text" },
      { name: "subtitle", label: "Заголовок (последнее слово выделится)", type: "text" },
      { name: "description", label: "Описание", type: "textarea" },
    ],
  },
  {
    key: "about",
    title: "Обо мне",
    fields: [
      { name: "eyebrow", label: "Подпись сверху", type: "text" },
      { name: "title", label: "Заголовок", type: "text" },
      { name: "title_accent", label: "Заголовок — выделение", type: "text" },
      { name: "image_url", label: "Фото (URL, оставьте пустым для дефолтного)", type: "url" },
      { name: "paragraphs", label: "Абзацы текста", type: "list", itemLabel: "Абзац" },
    ],
  },
  {
    key: "method",
    title: "О методе",
    fields: [
      { name: "eyebrow", label: "Подпись сверху", type: "text" },
      { name: "title", label: "Заголовок", type: "text" },
      { name: "title_accent", label: "Заголовок — выделение", type: "text" },
      { name: "description", label: "Описание метода", type: "textarea" },
      { name: "interactive_hint", label: "Подсказка к интерактиву", type: "textarea" },
    ],
  },
  {
    key: "author",
    title: "Об авторе метода",
    fields: [
      { name: "eyebrow", label: "Подпись сверху", type: "text" },
      { name: "title", label: "Имя", type: "text" },
      { name: "title_accent", label: "Фамилия (выделение)", type: "text" },
      { name: "image_url", label: "Фото (URL)", type: "url" },
      { name: "paragraphs", label: "Абзацы биографии", type: "list", itemLabel: "Абзац" },
      { name: "link_label", label: "Ссылка — текст", type: "text" },
      { name: "link_url", label: "Ссылка — URL", type: "url" },
    ],
  },
  {
    key: "why",
    title: "Почему НейроГрафика — заголовок секции",
    description: "Сами карточки редактируются на вкладке «Карточки».",
    fields: [
      { name: "eyebrow", label: "Подпись сверху", type: "text" },
      { name: "title", label: "Заголовок", type: "text" },
      { name: "title_accent", label: "Заголовок — выделение", type: "text" },
      { name: "subtitle", label: "Подзаголовок", type: "textarea" },
    ],
  },
  {
    key: "courses_section",
    title: "Курсы и Мастер-классы — заголовок и блок «Для новичков»",
    description: "Сами карточки курсов редактируются на вкладке «Карточки».",
    fields: [
      { name: "eyebrow", label: "Подпись сверху", type: "text" },
      { name: "title", label: "Заголовок", type: "text" },
      { name: "title_accent", label: "Заголовок — выделение", type: "text" },
      { name: "others_title", label: "«Другие продукты» — слово 1", type: "text" },
      { name: "others_title_accent", label: "«Другие продукты» — слово 2 (выделение)", type: "text" },
      { name: "beginner_title", label: "Для новичков — название", type: "text" },
      { name: "beginner_description", label: "Для новичков — описание", type: "textarea" },
      { name: "beginner_price", label: "Для новичков — цена", type: "text" },
      { name: "beginner_cta", label: "Для новичков — кнопка", type: "text" },
      { name: "beginner_payment_url", label: "Для новичков — ссылка GetCourse", type: "url" },
    ],
  },
  {
    key: "lotus",
    title: "НейроЛотос — тексты и продающий блок",
    description: "Сами послания редактируются на вкладке «Карточки».",
    fields: [
      { name: "eyebrow", label: "Подпись сверху", type: "text" },
      { name: "title", label: "Заголовок — часть 1", type: "text" },
      { name: "title_accent", label: "Заголовок — часть 2 (выделение)", type: "text" },
      { name: "subtitle", label: "Подзаголовок", type: "textarea" },
      { name: "cta_text", label: "После выбора — заголовок", type: "text" },
      { name: "cta_text_accent", label: "После выбора — заголовок (выделение)", type: "text" },
      { name: "cta_description", label: "После выбора — описание", type: "textarea" },
      { name: "cta_button_label", label: "Кнопка — текст с ценой", type: "text" },
      { name: "cta_payment_url", label: "Кнопка — ссылка GetCourse", type: "url" },
    ],
  },
  {
    key: "contacts",
    title: "Контакты и футер",
    fields: [
      { name: "eyebrow", label: "Форма — подпись сверху", type: "text" },
      { name: "title", label: "Форма — заголовок", type: "text" },
      { name: "title_accent", label: "Форма — заголовок (выделение)", type: "text" },
      { name: "footer_tagline", label: "Футер — короткое описание", type: "textarea" },
    ],
  },
];

const AdminContent = () => {
  const [data, setData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data: rows } = await supabase.from("site_content").select("key, value");
    if (rows) {
      const map: Record<string, any> = {};
      rows.forEach((r: any) => {
        map[r.key] = r.value;
      });
      setData(map);
    }
  };

  const updateField = (blockKey: string, fieldName: string, fieldValue: any) => {
    setData((prev) => ({
      ...prev,
      [blockKey]: { ...(prev[blockKey] || {}), [fieldName]: fieldValue },
    }));
  };

  const save = async (blockKey: string) => {
    setSaving(blockKey);
    const { error } = await supabase
      .from("site_content")
      .upsert({ key: blockKey, value: data[blockKey] || {} }, { onConflict: "key" });
    setSaving(null);
    if (error) {
      toast({ title: "Ошибка сохранения", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Сохранено!", description: "Изменения появятся на сайте сразу." });
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Здесь редактируются все тексты на сайте. После «Сохранить» изменения появляются мгновенно.
      </p>

      {BLOCKS.map((block) => {
        const blockData = data[block.key] || {};
        return (
          <div key={block.key} className="bg-card border border-border rounded-xl p-6">
            <div className="mb-4">
              <h3 className="font-heading text-lg font-semibold text-foreground">{block.title}</h3>
              {block.description && (
                <p className="text-xs text-muted-foreground mt-1">{block.description}</p>
              )}
            </div>

            <div className="space-y-4">
              {block.fields.map((field) => {
                if (field.type === "list") {
                  const items: string[] = Array.isArray(blockData[field.name])
                    ? blockData[field.name]
                    : [];
                  return (
                    <div key={field.name}>
                      <Label className="text-sm">{field.label}</Label>
                      <div className="space-y-2 mt-1.5">
                        {items.map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <Textarea
                              value={item}
                              onChange={(e) => {
                                const next = [...items];
                                next[idx] = e.target.value;
                                updateField(block.key, field.name, next);
                              }}
                              placeholder={`${field.itemLabel} ${idx + 1}`}
                              rows={3}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const next = items.filter((_, i) => i !== idx);
                                updateField(block.key, field.name, next);
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateField(block.key, field.name, [...items, ""])}
                        >
                          <Plus size={14} /> Добавить {field.itemLabel.toLowerCase()}
                        </Button>
                      </div>
                    </div>
                  );
                }

                const val = blockData[field.name] ?? "";
                return (
                  <div key={field.name}>
                    <Label className="text-sm">{field.label}</Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        value={val}
                        onChange={(e) => updateField(block.key, field.name, e.target.value)}
                        rows={3}
                        className="mt-1.5"
                      />
                    ) : (
                      <Input
                        type={field.type === "url" ? "url" : "text"}
                        value={val}
                        onChange={(e) => updateField(block.key, field.name, e.target.value)}
                        className="mt-1.5"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-5">
              <Button
                onClick={() => save(block.key)}
                disabled={saving === block.key}
                className="gradient-primary text-primary-foreground"
              >
                <Save size={16} />
                {saving === block.key ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminContent;
