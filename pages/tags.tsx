import React, { useState } from "react";
import { TextField, Paper, Typography, Box, IconButton } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from "@/styles/tags.module.css";

import {
  useDeleteTagMutation,
  useGetAllTagsQuery,
  useUpdateTagMutation,
} from "@/src/redux/api/tagsApi";
import ShortUniqueId from "short-unique-id";
import { InvoiceTagItem } from "@/src/server/utils/interfaces";
import { toast } from "react-toastify";
import TagItem from "@/components/elements/TagItem";

const uuid = new ShortUniqueId({ length: 16 });

const createEmptyTag = () => {
  return {
    id: uuid.randomUUID(),
    name: "",
    icon: "",
    created_at: new Date().getTime(),
  } as InvoiceTagItem;
};

export default function TagsScreen() {
  const { data: { data: tagData = [] } = {} } = useGetAllTagsQuery({});

  const [updateTag, { isLoading }] = useUpdateTagMutation();

  const [deleteTag, { isLoading: isLoadingDelete }] = useDeleteTagMutation();

  const [tagState, setTagState] = useState(createEmptyTag());

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this tag?");

    if (!confirm) return;

    deleteTag(id)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
      })
      .catch((err) => {
        toast.error(
          err?.data?.error ||
            err.data ||
            "An error occurred. Please try again.",
        );
        console.log({ err });
      });
  };

  const handleSubmit = async () => {
    if (!tagState.id || !tagState.name) {
      return console.log("fill all fields");
    }

    await updateTag(tagState)
      .unwrap()
      .then((res) => {
        toast.success(res.message);
        setTagState(createEmptyTag());
      })
      .catch((err) => console.log({ err }));
  };

  const handleEdit = (tag: InvoiceTagItem) => {
    setTagState(tag);
  };

  return (
    <div className="home_container">
      <div className={styles.container}>
        <Typography variant="h4" className={styles.heading}>
          Your Tags
        </Typography>

        <Paper elevation={2} className={styles.formCard}>
          <Typography variant="h6" gutterBottom>
            Create Tag
          </Typography>

          <form className={styles.form}>
            <TextField
              required
              label="Tag Name"
              value={tagState.name}
              size="small"
              onChange={(event) =>
                setTagState((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
            />

            <TextField
              label="Icon Key (optional)"
              value={tagState.icon}
              size="small"
              placeholder="fuel, food, salary..."
              onChange={(event) =>
                setTagState((prev) => ({
                  ...prev,
                  icon: event.target.value,
                }))
              }
            />

            <LoadingButton
              variant="contained"
              type="submit"
              loading={isLoading}
              sx={{ minWidth: 120 }}
              onClick={handleSubmit}
            >
              Save
            </LoadingButton>
          </form>
        </Paper>

        <div className={styles.tagsGrid}>
          {tagData?.map((tag: InvoiceTagItem) => (
            <TagItem
              key={tag.id}
              tag={tag}
              handleEdit={() => handleEdit(tag)}
              handleDelete={() => handleDelete(tag.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
