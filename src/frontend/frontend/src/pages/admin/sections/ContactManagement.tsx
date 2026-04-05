import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookUser, Loader2, Mail, MapPin, Phone, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type ContactInfo, contactStore } from "../../../store/adminStore";

export default function ContactManagement() {
  const [contact, setContact] = useState<ContactInfo>(contactStore.get());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setContact(contactStore.get());
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    contactStore.update(contact);
    toast.success("Contact info saved successfully!");
    setSaving(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-navy mb-6">Contact Info</h2>

      <div className="bg-white rounded-2xl border border-border p-6 lg:p-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-navy/10 rounded-xl flex items-center justify-center">
            <BookUser className="w-5 h-5 text-navy" />
          </div>
          <div>
            <h3 className="font-bold text-navy">Business Contact Details</h3>
            <p className="text-xs text-muted-foreground">
              Shown in the website footer and contact section.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <Label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Shop Address
              </span>
            </Label>
            <Textarea
              placeholder="Full shop address..."
              value={contact.address}
              onChange={(e) =>
                setContact({ ...contact, address: e.target.value })
              }
              rows={3}
              data-ocid="contact.address_input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Phone Number
                </span>
              </Label>
              <Input
                placeholder="e.g. +91 98765 43210"
                value={contact.phone}
                onChange={(e) =>
                  setContact({ ...contact, phone: e.target.value })
                }
                data-ocid="contact.phone_input"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Email Address
                </span>
              </Label>
              <Input
                type="email"
                placeholder="e.g. info@tiwariprinting.com"
                value={contact.email}
                onChange={(e) =>
                  setContact({ ...contact, email: e.target.value })
                }
                data-ocid="contact.email_input"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Google Maps Embed URL
              </span>
            </Label>
            <Input
              placeholder="Paste the src URL from Google Maps embed code..."
              value={contact.mapEmbedUrl}
              onChange={(e) =>
                setContact({ ...contact, mapEmbedUrl: e.target.value })
              }
              data-ocid="contact.map_input"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Go to Google Maps &rarr; Share &rarr; Embed a map &rarr; copy the
              URL inside{" "}
              <code className="bg-secondary px-1 rounded text-[11px]">
                src="..."
              </code>
              .
            </p>
          </div>

          <div className="pt-2 border-t border-border">
            <Button
              onClick={handleSave}
              disabled={saving}
              data-ocid="contact.save_button"
              className="bg-gold hover:bg-gold-dark text-navy font-bold px-8"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Contact Info
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
