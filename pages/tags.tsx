import React, { useState } from "react";
import { TextField, Paper, Typography, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from "@/styles/tags.module.css";
import {
  useGetAlltagsQuery,
  useUpdateTagMutation,
} from "@/src/redux/api/tagsApi";
import ShortUniqueId from "short-unique-id";
import { InvoiceTagItem } from "@/src/server/utils/interfaces";
import { toast } from "react-toastify";
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
  const { data } = useGetAlltagsQuery({});

  console.log(JSON.stringify(data));

  const [updateTag, { isLoading }] = useUpdateTagMutation();

  const [tagState, setTagState] = useState(createEmptyTag());

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
          {data?.data?.map((tag: any) => (
            <Paper key={tag.tag_id} elevation={1} className={styles.tagCard}>
              <Box className={styles.tagHeader}>
                <span className={styles.tagIcon}>{tag.icon || "🏷️"}</span>

                <Typography fontWeight={600}>{tag.name}</Typography>
              </Box>

              {tag.icon && (
                <Typography variant="caption" color="text.secondary">
                  {tag.icon}
                </Typography>
              )}
            </Paper>
          ))}
        </div>
      </div>
    </div>
  );
}
