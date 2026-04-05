import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, PlusCircle, Star, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Testimonial } from "../../../backend";
import { createActorWithConfig } from "../../../config";

const ADMIN_DATA = { id: "1234tiwari", password: "123456" };

function StarRating({
  rating,
  onChange,
}: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`transition-colors ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
        >
          <Star
            className={`w-5 h-5 ${star <= rating ? "text-gold fill-gold" : "text-border"}`}
          />
        </button>
      ))}
    </div>
  );
}

export default function TestimonialsManagement() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({
    author: "",
    role: "",
    content: "",
    rating: 5,
  });

  const load = useCallback(async () => {
    try {
      const backend = await createActorWithConfig();
      const list = await backend.getTestimonials();
      setItems(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load testimonials.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const deleteItem = async (id: string) => {
    try {
      const backend = await createActorWithConfig();
      await backend.deleteTestimonial(ADMIN_DATA, id);
      toast.success("Testimonial deleted.");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete testimonial.");
    }
  };

  const addItem = async () => {
    if (!newData.author.trim() || !newData.content.trim()) {
      toast.error("Author and content are required.");
      return;
    }
    setLoading(true);
    try {
      const backend = await createActorWithConfig();
      await backend.addTestimonial(
        ADMIN_DATA,
        newData.author.trim(),
        newData.role.trim(),
        newData.content.trim(),
        BigInt(newData.rating),
      );
      setNewData({ author: "", role: "", content: "", rating: 5 });
      toast.success("Testimonial added.");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add testimonial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-navy mb-6">
        Testimonials Management
      </h2>

      <div className="space-y-3 mb-8">
        {items.map((t, i) => (
          <div
            key={t.id}
            data-ocid={`testimonials.item.${i + 1}`}
            className="bg-white rounded-xl border border-border p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {t.author[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm">{t.author}</p>
                    {t.role && (
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    )}
                  </div>
                  <StarRating rating={Number(t.rating)} />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteItem(t.id)}
                data-ocid={`testimonials.delete_button.${i + 1}`}
                className="border-red-200 text-red-500 hover:bg-red-50 flex-shrink-0 h-8"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div
            className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-2xl"
            data-ocid="testimonials.empty_state"
          >
            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="font-semibold">No testimonials yet</p>
          </div>
        )}
      </div>

      {/* Add new */}
      <div className="bg-secondary/50 rounded-2xl p-6 border border-border">
        <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Testimonial
        </h3>
        <div className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                Customer Name
              </Label>
              <Input
                placeholder="e.g. Rahul Gupta"
                value={newData.author}
                onChange={(e) =>
                  setNewData({ ...newData, author: e.target.value })
                }
                data-ocid="testimonials.input"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                Role / Company
              </Label>
              <Input
                placeholder="e.g. Shop Owner"
                value={newData.role}
                onChange={(e) =>
                  setNewData({ ...newData, role: e.target.value })
                }
                data-ocid="testimonials.input"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
              Testimonial
            </Label>
            <Textarea
              placeholder="What did the customer say?"
              value={newData.content}
              onChange={(e) =>
                setNewData({ ...newData, content: e.target.value })
              }
              rows={3}
              data-ocid="testimonials.textarea"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
              Rating
            </Label>
            <StarRating
              rating={newData.rating}
              onChange={(r) => setNewData({ ...newData, rating: r })}
            />
          </div>
          <Button
            onClick={addItem}
            disabled={loading}
            data-ocid="testimonials.primary_button"
            className="bg-gold hover:bg-gold-dark text-navy font-bold"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Testimonial
          </Button>
        </div>
      </div>
    </div>
  );
}
