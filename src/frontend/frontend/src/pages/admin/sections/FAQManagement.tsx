import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Pencil, PlusCircle, Save, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { type FAQItem, faqStore } from "../../../store/adminStore";

export default function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editQ, setEditQ] = useState("");
  const [editA, setEditA] = useState("");
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");

  const load = useCallback(() => setFaqs(faqStore.get()), []);
  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (faq: FAQItem) => {
    setEditId(faq.id);
    setEditQ(faq.question);
    setEditA(faq.answer);
  };

  const saveEdit = () => {
    if (!editQ.trim() || !editA.trim()) {
      toast.error("Fields cannot be empty.");
      return;
    }
    faqStore.update(editId!, editQ.trim(), editA.trim());
    setEditId(null);
    toast.success("FAQ updated.");
    load();
  };

  const deleteFaq = (id: string) => {
    faqStore.delete(id);
    toast.success("FAQ deleted.");
    load();
  };

  const addFaq = () => {
    if (!newQ.trim() || !newA.trim()) {
      toast.error("Please fill in both fields.");
      return;
    }
    faqStore.add({ question: newQ.trim(), answer: newA.trim() });
    setNewQ("");
    setNewA("");
    toast.success("FAQ added.");
    load();
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-navy mb-6">FAQ Management</h2>

      {/* FAQ list */}
      <div className="space-y-3 mb-8">
        {faqs.map((faq, i) => (
          <div
            key={faq.id}
            data-ocid={`faq.item.${i + 1}`}
            className="bg-white rounded-xl border border-border p-5"
          >
            {editId === faq.id ? (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                    Question
                  </Label>
                  <Input
                    value={editQ}
                    onChange={(e) => setEditQ(e.target.value)}
                    data-ocid="faq.input"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                    Answer
                  </Label>
                  <Textarea
                    value={editA}
                    onChange={(e) => setEditA(e.target.value)}
                    rows={3}
                    data-ocid="faq.textarea"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={saveEdit}
                    data-ocid="faq.save_button"
                    className="bg-navy text-white hover:bg-navy-light"
                  >
                    <Save className="w-3.5 h-3.5 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditId(null)}
                    data-ocid="faq.cancel_button"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-sm">
                    {faq.question}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(faq)}
                    data-ocid={`faq.edit_button.${i + 1}`}
                    className="h-8"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteFaq(faq.id)}
                    data-ocid={`faq.delete_button.${i + 1}`}
                    className="border-red-200 text-red-500 hover:bg-red-50 h-8"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {faqs.length === 0 && (
          <div
            className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-2xl"
            data-ocid="faq.empty_state"
          >
            <HelpCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="font-semibold">No FAQs yet</p>
          </div>
        )}
      </div>

      {/* Add new FAQ */}
      <div className="bg-secondary/50 rounded-2xl p-6 border border-border">
        <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Add New FAQ
        </h3>
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
              Question
            </Label>
            <Input
              placeholder="Enter question..."
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              data-ocid="faq.input"
            />
          </div>
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
              Answer
            </Label>
            <Textarea
              placeholder="Enter answer..."
              value={newA}
              onChange={(e) => setNewA(e.target.value)}
              rows={3}
              data-ocid="faq.textarea"
            />
          </div>
          <Button
            onClick={addFaq}
            data-ocid="faq.primary_button"
            className="bg-gold hover:bg-gold-dark text-navy font-bold"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
        </div>
      </div>
    </div>
  );
}
