import { useForm } from "react-hook-form";
import { useCreateArticle, useUpdateArticle } from "../../api/hooks.js";

export default function ArticleEditor({ initial, onSaved }) {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: initial || { title: "", body: "" },
  });
  const create = useCreateArticle();
  const update = useUpdateArticle(initial?._id);

  const body = watch("body") || "";
  const lower = body.toLowerCase();
  const live = { r: 0, i: 0, m: 0, e: 0, s: 0 };
  for (const ch of lower) if (live.hasOwnProperty(ch)) live[ch]++;

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        if (initial) await update.mutateAsync(data);
        else await create.mutateAsync(data);
        onSaved();
      })}
    >
      <input placeholder="Title" {...register("title")} />
      <textarea rows={6} placeholder="Body" {...register("body")} />
      <div>
        Live r/i/m/e/s: {live.r}/{live.i}/{live.m}/{live.e}/{live.s}
      </div>
      <button type="submit">{initial ? "Update" : "Create"}</button>
    </form>
  );
}
