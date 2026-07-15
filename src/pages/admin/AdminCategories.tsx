import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, AlertCircle, Check, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useAppStore } from "@/context/AppContext";
import { Category } from "@/types";

const PRESET_COLORS = [
  "#FF6B35",
  "#00D9FF",
  "#A855F7",
  "#22C55E",
  "#EAB308",
  "#EF4444",
  "#EC4899",
  "#14B8A6",
];

export default function AdminCategories() {
  const categories = useAppStore((s) => s.categories);
  const addCategory = useAppStore((s) => s.addCategory);
  const updateCategory = useAppStore((s) => s.updateCategory);
  const deleteCategory = useAppStore((s) => s.deleteCategory);

  const [editing, setEditing] = useState<Category | null>(null);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const startEdit = (cat: Category) => {
    setEditing(cat);
    setNewName(cat.name);
    setNewColor(cat.color);
  };

  const cancelEdit = () => {
    setEditing(null);
    setNewName("");
    setNewColor(PRESET_COLORS[0]);
  };

  const handleSave = () => {
    if (!newName.trim()) return;
    if (editing) {
      updateCategory({ ...editing, name: newName.trim(), color: newColor });
    } else {
      addCategory({
        id: uuidv4(),
        name: newName.trim(),
        color: newColor,
        articleCount: 0,
      });
    }
    cancelEdit();
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteCategory(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-text tracking-wider">
        分类管理
      </h1>

      <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors"
            placeholder={editing ? "编辑分类名称" : "新建分类名称"}
          />
          <div className="flex items-center gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setNewColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  newColor === color ? "border-white scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!newName.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-all"
          >
            <Check className="w-4 h-4" />
            {editing ? "更新" : "新增"}
          </button>
          {editing && (
            <button
              onClick={cancelEdit}
              className="flex items-center gap-2 px-4 py-2 bg-surface-light text-text rounded-lg text-sm transition-all"
            >
              <X className="w-4 h-4" />
              取消
            </button>
          )}
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-light/50">
              <th className="text-left px-4 py-3 text-text-muted font-medium">
                名称
              </th>
              <th className="text-left px-4 py-3 text-text-muted font-medium">
                颜色
              </th>
              <th className="text-left px-4 py-3 text-text-muted font-medium">
                文章数
              </th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="border-b border-border hover:bg-background/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-text">{cat.name}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-text-muted text-xs">{cat.color}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {cat.articleCount}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-1.5 text-text-muted hover:text-primary transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className={`p-1.5 transition-colors ${
                        deleteConfirm === cat.id
                          ? "text-primary"
                          : "text-text-muted hover:text-primary"
                      }`}
                    >
                      {deleteConfirm === cat.id ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
