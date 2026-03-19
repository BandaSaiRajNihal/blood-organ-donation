import { BloodType, DonorType, Gender, Organ } from "../backend";

export function formatBloodType(bt: BloodType): string {
  const map: Record<BloodType, string> = {
    [BloodType.A_Pos]: "A+",
    [BloodType.A_Neg]: "A−",
    [BloodType.B_Pos]: "B+",
    [BloodType.B_Neg]: "B−",
    [BloodType.AB_Pos]: "AB+",
    [BloodType.AB_Neg]: "AB−",
    [BloodType.O_Pos]: "O+",
    [BloodType.O_Neg]: "O−",
  };
  return map[bt] ?? String(bt);
}

export function formatDonorType(dt: DonorType): string {
  const map: Record<DonorType, string> = {
    [DonorType.blood]: "Blood",
    [DonorType.organ]: "Organ",
    [DonorType.both]: "Blood & Organ",
  };
  return map[dt] ?? String(dt);
}

export function formatOrgan(o: Organ): string {
  const map: Record<Organ, string> = {
    [Organ.kidney]: "Kidney",
    [Organ.liver]: "Liver",
    [Organ.heart]: "Heart",
    [Organ.lungs]: "Lungs",
    [Organ.corneas]: "Corneas",
    [Organ.pancreas]: "Pancreas",
    [Organ.intestines]: "Intestines",
  };
  return map[o] ?? String(o);
}

export function formatGender(g: Gender): string {
  const map: Record<Gender, string> = {
    [Gender.male]: "Male",
    [Gender.female]: "Female",
    [Gender.other]: "Other",
  };
  return map[g] ?? String(g);
}

export function formatNanoDate(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
