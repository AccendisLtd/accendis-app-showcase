import type { Role, RoleId } from "@/data/apps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ANY_ROLE = "any";

interface RoleSelectProps {
  roles: Role[];
  placeholder: string;
  value: RoleId | null;
  onChange: (role: RoleId | null) => void;
  id?: string;
  className?: string;
}

export function RoleSelect({ roles, placeholder, value, onChange, id, className }: RoleSelectProps) {
  return (
    <Select
      value={value ?? ANY_ROLE}
      onValueChange={(v) => onChange(v === ANY_ROLE ? null : (v as RoleId))}
    >
      <SelectTrigger
        id={id}
        className={cn(
          "h-12 w-full rounded-lg border-input bg-background px-4 text-base shadow-none sm:w-64",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ANY_ROLE}>{placeholder}</SelectItem>
        {roles.map((role) => (
          <SelectItem key={role.id} value={role.id}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
