import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Loader2, Save, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type SiteSettings, settingsStore } from "../../../store/adminStore";

export default function SettingsManagement() {
  const [settings, setSettings] = useState<SiteSettings>(settingsStore.get());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSettings(settingsStore.get());
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    settingsStore.update(settings);
    toast.success("Settings saved successfully!");
    setSaving(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-navy mb-6">Site Settings</h2>

      <div className="bg-white rounded-2xl border border-border p-6 lg:p-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-navy/10 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-navy" />
          </div>
          <div>
            <h3 className="font-bold text-navy">General Settings</h3>
            <p className="text-xs text-muted-foreground">
              These settings are reflected on the public website.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* WhatsApp + Instagram side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">
                WhatsApp Number
              </Label>
              <Input
                placeholder="e.g. +91 98765 43210"
                value={settings.whatsappNumber}
                onChange={(e) =>
                  setSettings({ ...settings, whatsappNumber: e.target.value })
                }
                data-ocid="settings.input"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used for the WhatsApp chat button.
              </p>
            </div>

            <div>
              <Label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">
                <span className="flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5" />
                  Instagram Username
                </span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  @
                </span>
                <Input
                  placeholder="yourhandle"
                  value={settings.instagramUsername}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      instagramUsername: e.target.value.replace(/^@/, ""),
                    })
                  }
                  className="pl-7"
                  data-ocid="settings.instagram_input"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Used for the Instagram button link.
              </p>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">
              Hero Tagline
            </Label>
            <Input
              placeholder="Your main headline"
              value={settings.heroTagline}
              onChange={(e) =>
                setSettings({ ...settings, heroTagline: e.target.value })
              }
              data-ocid="settings.input"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">
              About Text
            </Label>
            <Textarea
              placeholder="Short description about the company"
              value={settings.aboutText}
              onChange={(e) =>
                setSettings({ ...settings, aboutText: e.target.value })
              }
              rows={4}
              data-ocid="settings.textarea"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-navy uppercase tracking-wider mb-1.5 block">
              Years of Experience
            </Label>
            <Input
              type="number"
              min={1}
              max={100}
              value={settings.yearsExperience}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  yearsExperience: Number(e.target.value),
                })
              }
              className="w-32"
              data-ocid="settings.input"
            />
          </div>

          <div className="pt-2 border-t border-border">
            <Button
              onClick={handleSave}
              disabled={saving}
              data-ocid="settings.save_button"
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
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
