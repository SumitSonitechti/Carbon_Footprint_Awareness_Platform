export interface CarbonInputs {
  // Transportation
  carMilesPerWeek: number;
  carType: 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'none';
  publicTransitHoursPerWeek: number;
  flightsPerYear: number;

  // Home Energy
  electricityKwhPerMonth: number;
  heatingSource: 'gas' | 'electricity' | 'oil' | 'renewable';
  cleanEnergyPercent: number;

  // Diet
  dietType: 'vegan' | 'vegetarian' | 'pescatarian' | 'meat-average' | 'meat-heavy';

  // Waste & Consumption
  recyclePercent: number;
  shoppingHabits: 'minimal' | 'average' | 'frequent';
}

export interface GeminiResponse {
  category: string;
  tip: string;
}

export async function getCarbonHotSpotTip(inputs: CarbonInputs): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not defined. Falling back to local heuristic analysis.");
    return getLocalHeuristicTip(inputs);
  }

  const prompt = `
Analyze the following lifestyle data of a user and identify their primary carbon footprint hot spot (the category contributing the most emissions or having the highest reduction potential).
Provide exactly ONE actionable, specific, and highly impactful tip to reduce their footprint in that category.
Keep the tip short, engaging, and direct (max 2-3 sentences).

User Data:
- Transportation:
  * Drives a ${inputs.carType} car, ${inputs.carMilesPerWeek} miles/week
  * Public transit: ${inputs.publicTransitHoursPerWeek} hours/week
  * Flights: ${inputs.flightsPerYear} per year
- Home Energy:
  * Electricity: ${inputs.electricityKwhPerMonth} kWh/month
  * Heating source: ${inputs.heatingSource}
  * Clean/Renewable energy: ${inputs.cleanEnergyPercent}%
- Diet:
  * Diet type: ${inputs.dietType}
- Waste & Consumption:
  * Recycles: ${inputs.recyclePercent}% of waste
  * Shopping frequency: ${inputs.shoppingHabits}

Respond in clean JSON format with two keys:
1. "category": The name of the hot spot category (e.g., "Transportation", "Home Energy", "Diet", or "Waste & Consumption").
2. "tip": The single actionable tip.
Do not include any markdown formatting (like \`\`\`json) in your response. Just return the JSON object.
`;

  try {
    const model = "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      throw new Error("Empty response from Gemini API");
    }

    const parsed: GeminiResponse = JSON.parse(textContent.trim());
    return parsed;
  } catch (error) {
    console.error("Error fetching tip from Gemini API, using fallback heuristics:", error);
    return getLocalHeuristicTip(inputs);
  }
}

// Smart local fallback in case Gemini API is not configured or fails
function getLocalHeuristicTip(inputs: CarbonInputs): GeminiResponse {
  // Let's approximate emissions for categories to find the highest
  const carEmissions = inputs.carMilesPerWeek * 52 * (inputs.carType === 'petrol' ? 0.4 : inputs.carType === 'diesel' ? 0.43 : inputs.carType === 'hybrid' ? 0.22 : inputs.carType === 'electric' ? 0.1 : 0);
  const flightEmissions = inputs.flightsPerYear * 900 * 0.25; // average flight km and co2
  const transportScore = carEmissions + flightEmissions;

  const energyEmissions = inputs.electricityKwhPerMonth * 12 * 0.4 * (1 - inputs.cleanEnergyPercent / 100) + 
                          (inputs.heatingSource === 'gas' ? 1500 : inputs.heatingSource === 'oil' ? 2200 : inputs.heatingSource === 'electricity' ? 1000 : 200);
  
  const dietScore = inputs.dietType === 'meat-heavy' ? 3000 : inputs.dietType === 'meat-average' ? 2000 : inputs.dietType === 'pescatarian' ? 1400 : inputs.dietType === 'vegetarian' ? 1200 : 900;
  
  const wasteScore = (inputs.shoppingHabits === 'frequent' ? 2000 : inputs.shoppingHabits === 'average' ? 1200 : 600) * (1 - (inputs.recyclePercent * 0.4) / 100);

  const scores = [
    { category: 'Transportation', score: transportScore },
    { category: 'Home Energy', score: energyEmissions },
    { category: 'Diet', score: dietScore },
    { category: 'Waste & Consumption', score: wasteScore }
  ];

  // Sort to find the highest
  scores.sort((a, b) => b.score - a.score);
  const topCategory = scores[0].category;

  let tip = "";
  if (topCategory === 'Transportation') {
    if (inputs.flightsPerYear > 2) {
      tip = "Your frequent flying is your largest carbon driver. Consider replacing one long-distance flight per year with a train journey or choosing a local vacation spot to significantly lower your footprint.";
    } else if (inputs.carMilesPerWeek > 100 && (inputs.carType === 'petrol' || inputs.carType === 'diesel')) {
      tip = "Your private vehicle driving is a major carbon source. Committing to carpooling once a week or using public transit for routes under 10 miles can decrease your emissions by hundreds of pounds annually.";
    } else {
      tip = "To lower your travel impact further, prioritize walking or bicycling for short errands under two miles, which also yields health benefits.";
    }
  } else if (topCategory === 'Home Energy') {
    if (inputs.cleanEnergyPercent < 50) {
      tip = "Your home relies heavily on carbon-intensive grid electricity. Look into switching to a certified renewable energy plan with your local utility provider, which can wipe out your home energy emissions in one step.";
    } else if (inputs.heatingSource === 'gas' || inputs.heatingSource === 'oil') {
      tip = "Fossil-fueled home heating is a major carbon contributor. Setting your thermostat just 2°F lower in winter and insulating drafts around windows and doors can reduce heating energy consumption by 10%.";
    } else {
      tip = "Unplug vampire appliances and switch to smart power strips for electronics, which can cut electricity bills and save energy when devices are not in use.";
    }
  } else if (topCategory === 'Diet') {
    if (inputs.dietType === 'meat-heavy' || inputs.dietType === 'meat-average') {
      tip = "Animal-based foods produce significantly more greenhouse gases than plant-based ones. Substituting red meat with lentils, beans, or vegetables just three days a week can cut your dietary carbon footprint by up to 30%.";
    } else {
      tip = "Since you already eat low-carbon foods, focus on reducing food waste by planning meals and freezing leftovers. Decomposing food in landfills creates highly potent methane gas.";
    }
  } else {
    if (inputs.recyclePercent < 50) {
      tip = "A low recycling rate increases your landfill waste footprint. Set up a simple two-bin sorting system at home and check local recycling guidelines to ensure paper, metal, and glass are diverted from landfills.";
    } else {
      tip = "Your shopping habits are a primary carbon driver. Try adopting a 'one-in, one-out' rule for clothes and electronics, and purchase items secondhand whenever possible to prevent manufacturing emissions.";
    }
  }

  return {
    category: topCategory,
    tip
  };
}
