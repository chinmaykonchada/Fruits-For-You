// import express from "express";
// import bodyParser from "body-parser";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const apiKey = process.env.API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// const app = express();
// const port = 3000;

// app.use(bodyParser.urlencoded({ extended: true }));

// async function generateFruitRecommendation(healthConditions, improvementArea) {
//   const prompt = `Suggest 3 fruits suitable for someone with ${healthConditions} who wants to improve ${improvementArea}. 
//   Provide the response in JSON format with the following structure, without any additional text or formatting:
//   {
//     "fruits": [
//       {
//         "name": "Fruit Name",
//         "amount": "Daily amount in kg",
//         "benefits": "Brief description of benefits"
//       }
//     ]
//   }
//   Ensure the JSON is valid and contains exactly 3 fruit recommendations.`;

//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   let text = response.text();
  
//   // Remove any markdown formatting
//   text = text.replace(/```json\n?|\n?```/g, '').trim();
  
//   try {
//     return JSON.parse(text);
//   } catch (error) {
//     console.error("Error parsing JSON:", error);
//     console.error("Received text:", text);
//     throw new Error("Failed to generate a valid JSON response");
//   }
// }

// app.get("/", (req, res) => {
//   // Render your index.ejs with a form for health conditions and improvement area
//   res.render("index.ejs", { /* data for the form */ });
// });

// app.post("/fruit", async (req, res) => {
//   const {healthConditions, improvementArea} = req.body;
//   // console.log(improvementArea, healthConditions);
//   try {
//     const recommendation = await generateFruitRecommendation(healthConditions, improvementArea);
//     res.send(recommendation);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("An error occurred while generating the recommendation.");
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
import express from "express";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

async function generateFruitRecommendation(healthConditions, improvementArea) {
  const prompt = `Suggest 3 fruits suitable for someone with ${healthConditions} who wants to improve ${improvementArea}. 
  Provide the response in JSON format with the following structure, without any additional text or formatting:
  {
    "fruits": [
      {
        "name": "Fruit Name",
        "amount": "Daily amount in kg",
        "benefits": "Brief description of benefits"
      }
    ]
  }
  Ensure the JSON is valid and contains exactly 3 fruit recommendations.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  
  // Remove any markdown formatting
  text = text.replace(/```json\n?|\n?```/g, '').trim();
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    console.error("Received text:", text);
    throw new Error("Failed to generate a valid JSON response");
  }
}

app.get("/", (req, res) => {
  res.render("index", { fruits: [] });
});

app.post("/fruit", async (req, res) => {
  const { healthConditions, improvementArea } = req.body;
  try {
    const recommendation = await generateFruitRecommendation(healthConditions, improvementArea);
    res.render("index", { fruits: recommendation.fruits });
  } catch (error) {
    console.error(error);
    res.status(500).render("index", { fruits: [], error: "An error occurred while generating the recommendation." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});