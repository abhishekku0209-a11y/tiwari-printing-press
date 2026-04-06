import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { HttpAgent } from "@icp-sdk/core/agent";
import {
  ImageIcon,
  Instagram,
  Loader2,
  Save,
  Settings,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createActorWithConfig, loadConfig } from "../../../config";
import {
  type DesignItem,
  type SiteSettings,
  designStore,
  settingsStore,
} from "../../../store/adminStore";
import { StorageClient } from "../../../utils/StorageClient";

const ADMIN_DATA = { id: "1234tiwari", password: "123456" };

export default function SettingsManagement() {
  const [settings, setSettings] = useState<SiteSettings>(settingsStore.get());
  const [saving, setSaving] = useState(false);

  // Hero image state
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [currentHeroUrl, setCurrentHeroUrl] = useState<string | null>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);

  // Design images for "choose from existing"
  const [designImages, setDesignImages] = useState<DesignItem[]>([]);

  useEffect(() => {
    setSettings(settingsStore.get());
    loadCurrentHeroImage();
    setDesignImages(designStore.get());
  }, []);

  async function loadCurrentHeroImage() {
    // Check localStorage override first
    const localDataUrl = localStorage.getItem("tpp_hero_dataurl");
    if (localDataUrl) {
      setCurrentHeroUrl(localDataUrl);
      return;
    }
    try {
      const actor = await createActorWithConfig();
      const hash = await actor.getHeroImageHash();
      if (!hash || hash.trim() === "") return;
      const config = await loadConfig();
      const gatewayUrl =
        !config.storage_gateway_url ||
        config.storage_gateway_url === "nogateway"
          ? "https://blob.caffeine.ai"
          : config.storage_gateway_url;
      const agent = new HttpAgent({ host: config.backend_host });
      const storageClient = new StorageClient(
        config.bucket_name,
        gatewayUrl,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const url = await storageClient.getDirectURL(hash);
      setCurrentHeroUrl(url);
    } catch {
      // Ignore
    }
  }

  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setHeroFile(f);
    if (heroPreview) URL.revokeObjectURL(heroPreview);
    setHeroPreview(URL.createObjectURL(f));
  };

  const handleHeroUpload = async () => {
    if (!heroFile) {
      toast.error("Please select an image file.");
      return;
    }
    setHeroUploading(true);
    setHeroProgress(0);
    try {
      const config = await loadConfig();
      const gatewayUrl =
        !config.storage_gateway_url ||
        config.storage_gateway_url === "nogateway"
          ? "https://blob.caffeine.ai"
          : config.storage_gateway_url;
      const agent = new HttpAgent({ host: config.backend_host });
      const storageClient = new StorageClient(
        config.bucket_name,
        gatewayUrl,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
      const bytes = new Uint8Array(await heroFile.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes, (pct) =>
        setHeroProgress(pct),
      );
      // Save hash to backend
      const actor = await createActorWithConfig();
      await actor.setHeroImageHash(ADMIN_DATA, hash);
      // Clear localStorage override so the backend-stored image takes precedence
      localStorage.removeItem("tpp_hero_dataurl");
      // Update preview to live URL
      const url = await storageClient.getDirectURL(hash);
      setCurrentHeroUrl(url);
      setHeroFile(null);
      if (heroPreview) URL.revokeObjectURL(heroPreview);
      setHeroPreview(null);
      if (heroFileRef.current) heroFileRef.current.value = "";
      toast.success("Hero image updated! All visitors will see the new image.");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setHeroUploading(false);
      setHeroProgress(0);
    }
  };

  const handleSelectDesignAsHero = (design: DesignItem) => {
    localStorage.setItem("tpp_hero_dataurl", design.dataUrl);
    setCurrentHeroUrl(design.dataUrl);
    setHeroFile(null);
    if (heroPreview) URL.revokeObjectURL(heroPreview);
    setHeroPreview(null);
    if (heroFileRef.current) heroFileRef.current.value = "";
    toast.success("Hero image updated from gallery!");
  };

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

      {/* Hero Image Section */}
      <div className="bg-white rounded-2xl border border-border p-6 lg:p-8 max-w-2xl mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="font-bold text-navy">Hero Background Image</h3>
            <p className="text-xs text-muted-foreground">
              Upload a new hero image or choose from your design uploads.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Current image preview */}
          {currentHeroUrl && (
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Current Hero Image
              </Label>
              <img
                src={currentHeroUrl}
                alt="Current hero background"
                className="w-full max-h-48 object-cover rounded-xl border border-border"
              />
            </div>
          )}

          {/* File picker */}
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Upload New Image (any size)
            </Label>
            <Input
              ref={heroFileRef}
              type="file"
              accept="image/*"
              onChange={handleHeroFileChange}
              data-ocid="settings.hero_image_upload"
            />
          </div>

          {/* New image preview */}
          {heroPreview && (
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Preview
              </Label>
              <img
                src={heroPreview}
                alt="New hero preview"
                className="w-full max-h-48 object-cover rounded-xl border border-border"
              />
            </div>
          )}

          {heroUploading && (
            <div>
              <Progress value={heroProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Uploading... {heroProgress}%
              </p>
            </div>
          )}

          <Button
            onClick={handleHeroUpload}
            disabled={heroUploading || !heroFile}
            data-ocid="settings.hero_image_upload_button"
            className="bg-gold hover:bg-gold-dark text-navy font-bold px-8"
          >
            {heroUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Set as Hero Image
              </>
            )}
          </Button>

          {/* Divider */}
          <div className="pt-2">
            <Separator className="mb-4" />
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
              Or choose from uploaded images:
            </Label>

            {designImages.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No images yet — upload designs in the Designs tab first.
              </p>
            ) : (
              <div
                className="overflow-y-auto rounded-xl border border-border bg-muted/30 p-2"
                style={{ maxHeight: "300px" }}
                data-ocid="settings.hero_gallery_panel"
              >
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {designImages.map((design, idx) => (
                    <div
                      key={design.id}
                      className="group relative aspect-square rounded-lg overflow-hidden border border-border cursor-pointer"
                      data-ocid={`settings.hero_gallery.item.${idx + 1}`}
                    >
                      <img
                        src={design.dataUrl}
                        alt={`Design ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleSelectDesignAsHero(design)}
                          data-ocid={`settings.hero_gallery.select_button.${idx + 1}`}
                          className="bg-gold hover:bg-gold-dark text-navy font-bold text-xs px-2 py-1 h-auto"
                        >
                          Use as Hero
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* General Settings */}
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
