import { ModelPackage } from "./models";

interface SyntheticModel {
  id: string;
  name: string;
  context_length: number;
  hugging_face_id: string;
}

/**
 * Convert Synthetic model data to ModelPackage format
 */
function convertSyntheticModelToPackage(model: SyntheticModel): ModelPackage {
  return {
    title: model.name,
    description: model.name, //Synthetic's API doesn't return a description, so use the name instead
    refUrl: "https://dev.synthetic.new/docs/api/models",
    params: {
      model: model.id,
      contextLength: model.context_length,
    },
    isOpenSource: true, //All Synthetic models are openweight models
  };
}

/**
 * Fetch Synthetic models from the API
 */
async function fetchSyntheticModelsFromAPI(): Promise<SyntheticModel[]> {
  const SYNTHETIC_MODELS_API_URL = "https://api.synthetic.new/openai/v1/models";

  try {
    const response = await fetch(SYNTHETIC_MODELS_API_URL);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Synthetic models: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      console.warn("Invalid Synthetic models data structure from API");
      return [];
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching Synthetic models from API:", error);
    return [];
  }
}

/**
 * Generate ModelPackage objects from Synthetic models API
 */
async function generateSyntheticModels(): Promise<{
  [key: string]: ModelPackage;
}> {
  const models: { [key: string]: ModelPackage } = {};

  const apiModels = await fetchSyntheticModelsFromAPI();

  apiModels.forEach((model: SyntheticModel) => {
    if (!model.id || !model.name) {
      console.warn("Skipping model with missing id or name", model);
      return;
    }

    // Create a unique key from the model id (replace /.: with _)
    const key = model.id.replace(/[/.:]/g, "_");

    try {
      models[key] = convertSyntheticModelToPackage(model);
    } catch (error) {
      console.error(`Failed to convert model ${model.id}:`, error);
    }
  });

  return models;
}

/**
 * Export a function to fetch all Synthetic models
 * This returns a promise since we're now fetching from the API
 */
export async function getSyntheticModels(): Promise<{
  [key: string]: ModelPackage;
}> {
  return generateSyntheticModels();
}

/**
 * Export a function to get Synthetic models as an array
 */
export async function getSyntheticModelsList(): Promise<ModelPackage[]> {
  const models = await getSyntheticModels();
  return Object.values(models);
}
