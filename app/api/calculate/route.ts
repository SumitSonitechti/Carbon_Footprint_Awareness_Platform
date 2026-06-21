import { NextResponse } from 'next/server';
import { getCarbonHotSpotTip, CarbonInputs } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inputs: CarbonInputs = body;

    // --- EMISSION CALCULATIONS (in kg CO2e per year) ---

    // 1. Transportation
    let carFactor = 0;
    if (inputs.carType === 'petrol') carFactor = 0.40;
    else if (inputs.carType === 'diesel') carFactor = 0.43;
    else if (inputs.carType === 'hybrid') carFactor = 0.22;
    else if (inputs.carType === 'electric') carFactor = 0.10;

    const carEmissions = inputs.carMilesPerWeek * 52 * carFactor;
    // Assuming an average speed of 25 mph for transit hours, factor is ~0.14 kg CO2 per passenger mile
    const transitEmissions = inputs.publicTransitHoursPerWeek * 52 * 25 * 0.14;
    // Average short/medium haul flight emits ~750 kg CO2
    const flightEmissions = inputs.flightsPerYear * 750;
    const transportTotal = (carEmissions + transitEmissions + flightEmissions) / 1000; // in metric tons

    // 2. Home Energy
    const electricityEmissions = (inputs.electricityKwhPerMonth * 12 * 0.4) * (1 - inputs.cleanEnergyPercent / 100);
    
    let heatingEmissions = 0;
    if (inputs.heatingSource === 'gas') heatingEmissions = 1600;
    else if (inputs.heatingSource === 'oil') heatingEmissions = 2400;
    else if (inputs.heatingSource === 'electricity') heatingEmissions = 1100;
    else if (inputs.heatingSource === 'renewable') heatingEmissions = 200;

    const energyTotal = (electricityEmissions + heatingEmissions) / 1000; // in metric tons

    // 3. Diet
    let dietEmissions = 0; // in kg
    if (inputs.dietType === 'meat-heavy') dietEmissions = 2900;
    else if (inputs.dietType === 'meat-average') dietEmissions = 2000;
    else if (inputs.dietType === 'pescatarian') dietEmissions = 1400;
    else if (inputs.dietType === 'vegetarian') dietEmissions = 1200;
    else if (inputs.dietType === 'vegan') dietEmissions = 800;

    const dietTotal = dietEmissions / 1000; // in metric tons

    // 4. Waste & Consumption
    let baseShoppingEmissions = 0;
    if (inputs.shoppingHabits === 'frequent') baseShoppingEmissions = 2100;
    else if (inputs.shoppingHabits === 'average') baseShoppingEmissions = 1200;
    else if (inputs.shoppingHabits === 'minimal') baseShoppingEmissions = 500;

    // Recycling reduces waste carbon output (up to 40% reduction)
    const recycleReduction = (inputs.recyclePercent / 100) * 0.40;
    const wasteTotal = (baseShoppingEmissions * (1 - recycleReduction)) / 1000; // in metric tons

    // --- BREAKDOWN AND TOTAL ---
    const transportVal = parseFloat(transportTotal.toFixed(2));
    const energyVal = parseFloat(energyTotal.toFixed(2));
    const dietVal = parseFloat(dietTotal.toFixed(2));
    const wasteVal = parseFloat(wasteTotal.toFixed(2));

    const totalVal = parseFloat((transportVal + energyVal + dietVal + wasteVal).toFixed(2));

    // --- GEMINI TIP ---
    const geminiResult = await getCarbonHotSpotTip(inputs);

    return NextResponse.json({
      success: true,
      breakdown: {
        transportation: transportVal,
        energy: energyVal,
        diet: dietVal,
        waste: wasteVal,
      },
      total: totalVal,
      aiTip: geminiResult,
    });

  } catch (error: any) {
    console.error("Calculate API route error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to calculate carbon footprint" },
      { status: 500 }
    );
  }
}
