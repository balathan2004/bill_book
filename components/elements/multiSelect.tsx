import { Autocomplete, Box, Chip, TextField } from "@mui/material";
import { InvoiceTagItem } from "@/src/server/utils/interfaces";
import Link from "next/link";

type Props = {
  options: InvoiceTagItem[];
  value: InvoiceTagItem[];
  onChange: (value: InvoiceTagItem[]) => void;
};

export default function TagPicker({ options, value, onChange }: Props) {
  if (options.length == 0) {
    return (
      <Box>
        <Link href={"/tags/"}>
          <span>No Tags found</span>
        </Link>
      </Box>
    );
  }

  return (
    <Autocomplete
      multiple
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={(option) => option.name}
      sx={{
        "& .MuiOutlinedInput-root": {
          minHeight: 56,
          alignItems: "center",
        },
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={index}
            label={option.name}
            // {...getTagProps({ index })}
            size="small"
          />
        ))
      }
      renderInput={(params) => (
        <TextField {...params} label="Tags" placeholder="Select tags" />
      )}
    />
  );
}
