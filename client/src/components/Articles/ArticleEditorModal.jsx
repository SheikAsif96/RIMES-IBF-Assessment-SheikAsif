import { useEffect, useMemo, useState } from "react";
import Modal from "../Common/Modal.jsx";
import { useCreateArticle, useUpdateArticle } from "../../api/hooks.js";

export default function ArticleEditorModal({
  open,
  initial,
  onClose,
  onSaved,
}) {
  const isEdit = Boolean(initial?._id);
  const [title, setTitle] = useState(initial?.title || "");
  const [body, setBody] = useState(initial?.body || "");
  const [errors, setErrors] = useState({});
  const create = useCreateArticle();
  const update = useUpdateArticle(initial?._id);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || "");
      setBody(initial?.body || "");
      setErrors({});
    }
  }, [open, initial]);

  const live = useMemo(() => {
    const t = (body || "").toLowerCase();
    const m = { r: 0, i: 0, m: 0, e: 0, s: 0 };
    for (const ch of t) if (m.hasOwnProperty(ch)) m[ch]++;
    return m;
  }, [body]);

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required";
    if (!body.trim()) e.body = "Body is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    if (isEdit) {
      await update.mutateAsync({ title, body });
    } else {
      await create.mutateAsync({ title, body });
    }
    onSaved?.();
    onClose();
  };

  if (!open) return null;

  return (
    <Modal
      title={isEdit ? "Edit Article" : "Create Article"}
      onClose={onClose}
      footer={[
        <button key="cancel" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>,
        <button
          key="save"
          className="btn btn-primary"
          onClick={onSubmit}
          disabled={create.isPending || update.isPending}
        >
          {isEdit
            ? update.isPending
              ? "Saving…"
              : "Save Changes"
            : create.isPending
            ? "Creating…"
            : "Create"}
        </button>,
      ]}
    >
      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
        />
        {errors.title && (
          <small style={{ color: "#dc2626" }}>{errors.title}</small>
        )}
      </div>
      <div className="form-group">
        <label className="form-label">Body</label>
        <textarea
          className="form-textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write the article body…"
        />
        {errors.body && (
          <small style={{ color: "#dc2626" }}>{errors.body}</small>
        )}
      </div>
      <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
        Live r/i/m/e/s: {live.r}/{live.i}/{live.m}/{live.e}/{live.s}
      </div>
    </Modal>
  );
}
