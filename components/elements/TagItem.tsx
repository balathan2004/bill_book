import { InvoiceTagItem } from "@/src/server/utils/interfaces";
import styles from "@/styles/tags.module.css";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

type Props = {
  tag: InvoiceTagItem;
  handleEdit: () => void;
  handleDelete: () => void;
};

export default function TagItem({ tag, handleEdit, handleDelete }: Props) {
  return (
    <Paper key={tag.id} elevation={1} className={styles.tagCard}>
      <Box className={styles.tagHeader}>
        <Box className={styles.tagIconWrapper}>
          <span className={styles.tagIcon}>{tag.icon || "🏷️"}</span>
        </Box>

        <Box className={styles.tagInfo}>
          <Typography
            className={styles.tagName}
            variant="subtitle1"
            fontWeight={600}
          >
            {tag.name}
          </Typography>

          <Typography variant="caption" className={styles.tagSubtitle}>
            Invoice category
          </Typography>
        </Box>

        <Box className={styles.tagActions}>
          <IconButton
            size="small"
            aria-label={`Edit ${tag.name}`}
            onClick={handleEdit}
            className={styles.editButton}
          >
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            aria-label={`Delete ${tag.name}`}
            onClick={handleDelete}
            className={styles.deleteButton}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}
