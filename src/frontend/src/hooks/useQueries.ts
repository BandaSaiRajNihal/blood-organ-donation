import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  DonationCenter,
  DonationRecord,
  DonorProfile,
  DonorPublicInfo,
  DonorType,
  Stats,
  UserProfile,
} from "../backend";
import { useActor } from "./useActor";

export function useStats() {
  const { actor, isFetching } = useActor();
  return useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor)
        return { totalDonors: 0n, totalLivesSaved: 0n, totalBloodUnits: 0n };
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDonationCenters(
  city: string | null,
  donorType: DonorType | null,
) {
  const { actor, isFetching } = useActor();
  return useQuery<DonationCenter[]>({
    queryKey: ["centers", city, donorType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDonationCenters(city, donorType);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDonors() {
  const { actor, isFetching } = useActor();
  return useQuery<DonorPublicInfo[]>({
    queryKey: ["donors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDonors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useMyProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<[UserProfile, DonorProfile | null]>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getMyProfile();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["currentUserProfile"] });
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}

export function useRegisterDonor() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: DonorProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerDonor(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
      qc.invalidateQueries({ queryKey: ["donors"] });
    },
  });
}

export function useAddDonationRecord() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (record: DonationRecord) => {
      if (!actor) throw new Error("Not connected");
      return actor.addDonationRecord(record);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProfile"] });
    },
  });
}
