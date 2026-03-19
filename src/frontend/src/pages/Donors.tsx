import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Users } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { BloodType, DonorType } from "../backend";
import { useDonors } from "../hooks/useQueries";
import {
  formatBloodType,
  formatDonorType,
  formatNanoDate,
} from "../lib/helpers";

const LOADING_KEYS = ["lk1", "lk2", "lk3", "lk4", "lk5"];

export default function Donors() {
  const { data: donors = [], isLoading } = useDonors();
  const [search, setSearch] = useState("");
  const [btFilter, setBtFilter] = useState<BloodType | "all">("all");
  const [typeFilter, setTypeFilter] = useState<DonorType | "all">("all");

  const filtered = useMemo(() => {
    return donors.filter((d) => {
      const matchSearch =
        !search.trim() ||
        d.firstName.toLowerCase().includes(search.toLowerCase());
      const matchBt = btFilter === "all" || d.bloodType === btFilter;
      const matchType = typeFilter === "all" || d.donorType === typeFilter;
      return matchSearch && matchBt && matchType;
    });
  }, [donors, search, btFilter, typeFilter]);

  return (
    <main className="container max-w-7xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2">
            Donor Directory
          </h1>
          <p className="text-muted-foreground">
            Our registered donors who are making a difference.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6 p-4 bg-card rounded-xl shadow-card">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search donors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="donors.search_input"
            />
          </div>
          <Select
            value={btFilter}
            onValueChange={(v) => setBtFilter(v as BloodType | "all")}
          >
            <SelectTrigger
              className="w-[140px]"
              data-ocid="donors.blood_type.select"
            >
              <SelectValue placeholder="Blood Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Blood Types</SelectItem>
              {Object.values(BloodType).map((bt) => (
                <SelectItem key={bt} value={bt}>
                  {formatBloodType(bt)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={typeFilter}
            onValueChange={(v) => setTypeFilter(v as DonorType | "all")}
          >
            <SelectTrigger className="w-[160px]" data-ocid="donors.type.select">
              <SelectValue placeholder="Donation Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.values(DonorType).map((dt) => (
                <SelectItem key={dt} value={dt}>
                  {formatDonorType(dt)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden md:grid grid-cols-5 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border mb-1">
          <span className="col-span-2">Donor</span>
          <span>Blood Type</span>
          <span>Donation Type</span>
          <span>Last Donation</span>
        </div>

        {isLoading ? (
          <div className="space-y-3" data-ocid="donors.loading_state">
            {LOADING_KEYS.map((k) => (
              <div
                key={k}
                className="flex items-center gap-4 p-4 bg-card rounded-xl"
              >
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="donors.empty_state"
          >
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No donors found matching your filters.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((donor, idx) => (
              <motion.div
                key={`${donor.firstName}-${donor.bloodType}-${donor.donorType}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 items-center bg-card rounded-xl p-4 shadow-xs hover:shadow-card transition-shadow"
                data-ocid={`donors.item.${idx + 1}`}
              >
                <div className="col-span-1 md:col-span-2 flex items-center gap-3">
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-accent text-primary font-semibold text-sm">
                      {donor.firstName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{donor.firstName}</p>
                    {donor.center && (
                      <p className="text-xs text-muted-foreground truncate">
                        {donor.center}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Badge
                    className="bg-red-50 text-red-700 border border-red-200 font-bold text-xs"
                    variant="outline"
                  >
                    {formatBloodType(donor.bloodType)}
                  </Badge>
                </div>
                <div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      donor.donorType === DonorType.blood
                        ? "text-red-600 border-red-200 bg-red-50"
                        : donor.donorType === DonorType.organ
                          ? "text-blue-600 border-blue-200 bg-blue-50"
                          : "text-purple-600 border-purple-200 bg-purple-50"
                    }`}
                  >
                    {formatDonorType(donor.donorType)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {donor.lastDonationDate
                    ? formatNanoDate(donor.lastDonationDate)
                    : "—"}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Showing {filtered.length} of {donors.length} registered donors.
          Personal information is protected.
        </p>
      </motion.div>
    </main>
  );
}
