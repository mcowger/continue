import { LLMOptions } from "../../index.js";

import OpenAI from "./OpenAI.js";

class Synthetic extends OpenAI {
  static providerName = "Synthetic";
  static defaultOptions: Partial<LLMOptions> = {
    apiBase: "https://api.synthetic.new/openai/v1",
  };
}

export default Synthetic;
