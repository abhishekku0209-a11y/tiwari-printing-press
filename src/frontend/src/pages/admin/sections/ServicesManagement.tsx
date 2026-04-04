import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ImagePlus,
  Layers,
  Pencil,
  PlusCircle,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { type ServiceItem, serviceStore } from "../../../store/adminStore";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ServicesManagement() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    icon: "",
    name: "",
    description: "",
    imageDataUrl: "",
  });
  const [newData, setNewData] = useState({
    icon: "",
    name: "",
    description: "",
    imageDataUrl: "",
  });

  const newImageInputRef = useRef<HTMLInputElement>(null);
  const editImageInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => setServices(serviceStore.get()), []);
  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (s: ServiceItem) => {
    setEditId(s.id);
    setEditData({
      icon: s.icon,
      name: s.name,
      description: s.description,
      imageDataUrl: s.imageDataUrl || "",
    });
  };

  const saveEdit = () => {
    if (!editData.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    serviceStore.update(editId!, {
      icon: editData.icon,
      name: editData.name,
      description: editData.description,
      imageDataUrl: editData.imageDataUrl || undefined,
    });
    setEditId(null);
    toast.success("Service updated.");
    load();
  };

  const deleteService = (id: string) => {
    serviceStore.delete(id);
    toast.success("Service deleted.");
    load();
  };

  const addService = () => {
    if (!newData.name.trim() || !newData.description.trim()) {
      toast.error("Name and description required.");
      return;
    }
    serviceStore.add({
      icon: newData.icon || "🖨️",
      name: newData.name.trim(),
      description: newData.description.trim(),
      imageDataUrl: newData.imageDataUrl || undefined,
    });
    setNewData({ icon: "", name: "", description: "", imageDataUrl: "" });
    if (newImageInputRef.current) newImageInputRef.current.value = "";
    toast.success("Service added.");
    load();
  };

  const handleNewImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setNewData((prev) => ({ ...prev, imageDataUrl: dataUrl }));
  };

  const handleEditImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setEditData((prev) => ({ ...prev, imageDataUrl: dataUrl }));
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-navy mb-6">
        Services Management
      </h2>

      <div className="space-y-3 mb-8">
        {services.map((s, i) => (
          <div
            key={s.id}
            data-ocid={`services.item.${i + 1}`}
            className="bg-white rounded-xl border border-border p-5"
          >
            {editId === s.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                      Icon (emoji)
                    </Label>
                    <Input
                      value={editData.icon}
                      onChange={(e) =>
                        setEditData({ ...editData, icon: e.target.value })
                      }
                      placeholder="🖨️"
                      className="text-xl"
                      data-ocid="services.input"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                      Service Name
                    </Label>
                    <Input
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      data-ocid="services.input"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                    Description
                  </Label>
                  <Textarea
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    rows={2}
                    data-ocid="services.textarea"
                  />
                </div>
                {/* Edit image upload */}
                <div>
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                    Service Image (optional)
                  </Label>
                  {editData.imageDataUrl ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={editData.imageDataUrl}
                        alt="Service preview"
                        className="rounded-lg object-cover border border-border"
                        style={{ maxHeight: 80 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEditData((prev) => ({
                            ...prev,
                            imageDataUrl: "",
                          }));
                          if (editImageInputRef.current)
                            editImageInputRef.current.value = "";
                        }}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
                        data-ocid="services.delete_button"
                      >
                        <X className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 cursor-pointer w-fit">
                      <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-border bg-secondary/50 text-xs text-muted-foreground hover:bg-secondary transition-colors">
                        <ImagePlus className="w-3.5 h-3.5" />
                        Upload image
                      </span>
                      <input
                        ref={editImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleEditImageChange}
                        data-ocid="services.upload_button"
                      />
                    </label>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={saveEdit}
                    data-ocid="services.save_button"
                    className="bg-navy text-white hover:bg-navy-light"
                  >
                    <Save className="w-3.5 h-3.5 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditId(null)}
                    data-ocid="services.cancel_button"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {s.imageDataUrl ? (
                    <img
                      src={s.imageDataUrl}
                      alt={s.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-border"
                    />
                  ) : (
                    <span className="text-3xl flex-shrink-0">{s.icon}</span>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-navy">{s.name}</p>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {s.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(s)}
                    data-ocid={`services.edit_button.${i + 1}`}
                    className="h-8"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteService(s.id)}
                    data-ocid={`services.delete_button.${i + 1}`}
                    className="border-red-200 text-red-500 hover:bg-red-50 h-8"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {services.length === 0 && (
          <div
            className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-2xl"
            data-ocid="services.empty_state"
          >
            <Layers className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="font-semibold">No services yet</p>
          </div>
        )}
      </div>

      {/* Add new */}
      <div className="bg-secondary/50 rounded-2xl p-6 border border-border">
        <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          Add New Service
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                Icon (emoji)
              </Label>
              <Input
                value={newData.icon}
                onChange={(e) =>
                  setNewData({ ...newData, icon: e.target.value })
                }
                placeholder="🖨️"
                className="text-xl"
                data-ocid="services.input"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
                Service Name
              </Label>
              <Input
                placeholder="e.g. Flex Printing"
                value={newData.name}
                onChange={(e) =>
                  setNewData({ ...newData, name: e.target.value })
                }
                data-ocid="services.input"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
              Description
            </Label>
            <Textarea
              placeholder="Describe the service..."
              value={newData.description}
              onChange={(e) =>
                setNewData({ ...newData, description: e.target.value })
              }
              rows={2}
              data-ocid="services.textarea"
            />
          </div>
          {/* New service image upload */}
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">
              Service Image (optional)
            </Label>
            {newData.imageDataUrl ? (
              <div className="flex items-center gap-3">
                <img
                  src={newData.imageDataUrl}
                  alt="New service preview"
                  className="rounded-lg object-cover border border-border"
                  style={{ maxHeight: 80 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setNewData((prev) => ({ ...prev, imageDataUrl: "" }));
                    if (newImageInputRef.current)
                      newImageInputRef.current.value = "";
                  }}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
                  data-ocid="services.delete_button"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-border bg-white text-xs text-muted-foreground hover:bg-secondary/50 transition-colors">
                  <ImagePlus className="w-3.5 h-3.5" />
                  Upload image
                </span>
                <input
                  ref={newImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleNewImageChange}
                  data-ocid="services.upload_button"
                />
              </label>
            )}
          </div>
          <Button
            onClick={addService}
            data-ocid="services.primary_button"
            className="bg-gold hover:bg-gold-dark text-navy font-bold"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>
    </div>
  );
}
