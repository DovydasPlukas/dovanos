import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

interface RowsPerPageSelectProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
}

export function RowsPerPageSelect({
  value,
  onChange,
  options = [10, 25, 50, 100]
}: RowsPerPageSelectProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-700">Eilučių puslapyje:</span>
      <Select
        value={value.toString()}
        onValueChange={(value) => onChange(Number(value))}
      >
        <SelectTrigger className="w-[70px]">
          <SelectValue placeholder={value} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
