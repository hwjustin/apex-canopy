import type { ProjectType, Region, Stage } from "./api";

export const STAGE_OPTIONS: { value: Stage; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "building", label: "Building" },
  { value: "beta", label: "Beta" },
  { value: "launched", label: "Launched" },
  { value: "growing", label: "Growing" },
];

export const REGION_OPTIONS: { value: Region; label: string }[] = [
  { value: "north_america", label: "North America" },
  { value: "south_america", label: "South America" },
  { value: "europe", label: "Europe" },
  { value: "africa", label: "Africa" },
  { value: "middle_east", label: "Middle East" },
  { value: "asia", label: "Asia" },
  { value: "oceania", label: "Oceania" },
  { value: "other", label: "Other" },
];

export const PROJECT_TYPE_OPTIONS: { value: ProjectType; label: string }[] = [
  { value: "agent_apps", label: "Agent applications" },
  { value: "ai_copilots", label: "AI copilots / assistants" },
  { value: "ai_workflow", label: "AI workflow automation" },
  { value: "ai_infra", label: "AI infrastructure / tooling" },
  { value: "dev_tools", label: "Developer tools" },
  { value: "apis_platform", label: "APIs / platform tools" },
  { value: "saas_productivity", label: "SaaS productivity" },
  { value: "data_analytics", label: "Data / analytics" },
  { value: "security_privacy", label: "Security / privacy" },
  { value: "enterprise_software", label: "Enterprise software" },
  { value: "fintech", label: "Fintech" },
  { value: "payments", label: "Payments" },
  { value: "commerce", label: "Commerce / e-commerce" },
  { value: "sales_crm", label: "Sales / CRM" },
  { value: "marketing_growth", label: "Marketing / growth" },
  { value: "customer_support", label: "Customer support" },
  { value: "hr_recruiting", label: "HR / recruiting" },
  { value: "education", label: "Education / learning" },
  { value: "health_wellness", label: "Health / wellness" },
  { value: "media_creator", label: "Media / creator tools" },
  { value: "consumer_social", label: "Consumer social" },
  { value: "community_tools", label: "Community tools" },
  { value: "marketplaces", label: "Marketplaces" },
  { value: "logistics_ops", label: "Logistics / operations" },
  { value: "legal_compliance", label: "Legal / compliance" },
  { value: "real_estate", label: "Real estate / proptech" },
  { value: "climate_energy", label: "Climate / energy" },
  { value: "robotics_hardware", label: "Robotics / hardware" },
  { value: "web3_crypto", label: "Web3 / crypto" },
  { value: "defi", label: "DeFi" },
  { value: "gaming", label: "Gaming" },
];

export const labelFor = <T extends string>(
  value: T | null | undefined,
  options: { value: string; label: string }[],
): string | null => {
  if (!value) return null;
  return options.find((o) => o.value === value)?.label ?? null;
};
