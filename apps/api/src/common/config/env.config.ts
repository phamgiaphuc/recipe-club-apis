export default (): Record<string, any> => ({
  // API_SERVICE
  API_SERVICE_NAME:
    process.env.API_SERVICE || "Recipe Club Backend (API Service)",
  API_SERVICE_PORT: parseInt(process.env.API_SERVICE_PORT, 10) || 3000,
  API_SERVICE_GLOBAL_PREFIX: process.env.API_SERVICE_GLOBAL_PREFIX || "/api/v1",
});
