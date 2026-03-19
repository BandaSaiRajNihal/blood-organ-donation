import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Filter, MapPin, Phone, Search } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { DonorType } from "../backend";
import { useDonationCenters } from "../hooks/useQueries";
import { formatBloodType, formatDonorType } from "../lib/helpers";

const LOADING_KEYS = ["lk1", "lk2", "lk3", "lk4"];

export default function Locations() {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<DonorType | "all">("all");

  const { data: centers = [], isLoading } = useDonationCenters(
    cityFilter === "all" ? null : cityFilter,
    typeFilter === "all" ? null : typeFilter,
  );

  const cities = useMemo(() => {
    const all = centers.map((c) => c.city);
    return Array.from(new Set(all)).sort();
  }, [centers]);

  const filtered = useMemo(() => {
    if (!search.trim()) return centers;
    const q = search.toLowerCase();
    return centers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q),
    );
  }, [centers, search]);

  const isOpen = (hours: string) =>
    hours.includes("24") || hours.includes("Open");

  return (
    <main className="container max-w-7xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl mb-2">
            Nearby Donation Centers
          </h1>
          <p className="text-muted-foreground">
            Find blood banks and organ donation centers near you.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8 p-4 bg-card rounded-xl shadow-card">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="locations.search_input"
            />
          </div>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger
              className="w-[160px]"
              data-ocid="locations.city.select"
            >
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={typeFilter}
            onValueChange={(v) => setTypeFilter(v as DonorType | "all")}
          >
            <SelectTrigger
              className="w-[180px]"
              data-ocid="locations.type.select"
            >
              <SelectValue placeholder="All Types" />
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
          <Button
            variant="outline"
            className="gap-2 border-primary text-primary"
            onClick={() => {
              setSearch("");
              setCityFilter("all");
              setTypeFilter("all");
            }}
            data-ocid="locations.clear.button"
          >
            <Filter className="w-4 h-4" /> Clear Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl bg-card shadow-card overflow-hidden h-[500px] flex flex-col items-center justify-center border border-border">
            <MapPin className="w-16 h-16 text-primary/30 mb-4" />
            <p className="text-muted-foreground font-medium">Interactive Map</p>
            <p className="text-xs text-muted-foreground mt-1">
              {filtered.length} centers in your area
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 px-6 w-full">
              {filtered.slice(0, 4).map((c) => (
                <div
                  key={String(c.id)}
                  className="bg-background rounded-lg p-2 text-xs"
                >
                  <p className="font-medium truncate">{c.name}</p>
                  <p className="text-muted-foreground truncate">{c.city}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
            {isLoading ? (
              LOADING_KEYS.map((k) => (
                <div
                  key={k}
                  className="bg-card rounded-xl p-4 shadow-card"
                  data-ocid="locations.loading_state"
                >
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="locations.empty_state"
              >
                <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No centers found for your search.</p>
              </div>
            ) : (
              filtered.map((center, idx) => (
                <motion.div
                  key={String(center.id)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-card rounded-xl p-4 shadow-card hover:shadow-card-hover transition-shadow"
                  data-ocid={`locations.item.${idx + 1}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge
                        className={`text-xs mb-1 ${
                          center.donorType === DonorType.blood
                            ? "bg-red-100 text-red-700 border-red-200"
                            : center.donorType === DonorType.organ
                              ? "bg-blue-100 text-blue-700 border-blue-200"
                              : "bg-purple-100 text-purple-700 border-purple-200"
                        }`}
                        variant="outline"
                      >
                        {formatDonorType(center.donorType)}
                      </Badge>
                      <h3 className="font-heading font-semibold">
                        {center.name}
                      </h3>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${isOpen(center.hours) ? "text-green-700 border-green-300 bg-green-50" : "text-gray-500 border-gray-300"}`}
                    >
                      {isOpen(center.hours) ? "Open" : "Check Hours"}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {center.address}, {center.city}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      {center.phone}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {center.hours}
                    </p>
                  </div>
                  {center.availableBloodTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {center.availableBloodTypes.map((bt) => (
                        <span
                          key={bt}
                          className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full"
                        >
                          {formatBloodType(bt)}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
