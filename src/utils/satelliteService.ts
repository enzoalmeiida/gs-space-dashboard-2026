export async function fetchLatestSatelliteImage(areaId: string): Promise<{ uri: string; timestamp: string }> {
  // Mock implementation: return a public placeholder or local asset.
  // In real use replace with API call to provider (Sentinel, Planet, AWS S3, etc.)
  const now = new Date().toISOString();
  return {
    uri: `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=${encodeURIComponent(areaId)}`,
    timestamp: now,
  };
}
