import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, AlertCircle, Check, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useAppStore } from "@/context/AppContext";
import { Tag } from "@/types";

export default function AdminTags() {
  const tags = useAppStore((s) => s.tags);
  const addTag = useAppStore((s) => s.addTag);
  const updateTag = useAppStore((s) => s.updateTag);
  const deleteTag = useAppStore((s) => s.deleteTag);

  const [editing, setEditing] = useState<Tag | null>(null);
  const [newName, setNewName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const startEdit = (tag: Tag) => {
    setEditing(tag);
    setNewName(tag.name);
  };

  const cancelEdit = () => {
    setEditing(null);
    setNewName("");
  };

  const handleSave = () => {
    if (!newName.trim()) return;
    if (editing) {
      updateTag({ ...editing, name: newName.trim() });
    } else {
      addTag({
        id: uuidv4(),
        name: newName.trim(),
        articleCount: 0,
      });
    }
    cancelEdit();
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteTag(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-text tracking-wider">
        标签管理
      </h1>

      <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors"
            placeholder={editing ? "编辑标签名称" : "新建标签名称"}
          />
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
                文章数
              </th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr
                key={tag.id}
                className="border-b border-border hover:bg-background/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-text">{tag.name}</span>
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {tag.articleCount}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => startEdit(tag)}
                      className="p-1.5 text-text-muted hover:text-primary transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tag.id)}
                      className={`p-1.5 transition-colors ${
                        deleteConfirm === tag.id
                          ? "text-primary"
                          : "text-text-muted hover:text-primary"
                      }`}
                    >
                      {deleteConfirm === tag.id ? (
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
