import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse';
import OpenAI from 'openai';
import pLimit from 'p-limit';
import { createReadStream } from 'fs';
import loadEnv from './load-env.mjs';

// Load environment variables
loadEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ITEMS_PER_MINUTE = 500;
const BATCH_SIZE = 50;
const DELAY_BETWEEN_BATCHES = Math.floor(60000 / (ITEMS_PER_MINUTE / BATCH_SIZE));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const limit = pLimit(BATCH_SIZE);

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function getEnhancedCheeseData(cheese) {
  const prompt = `Generate detailed information about ${cheese.cheese} cheese in JSON format.

Consider these data points in your response:
- Milk type: ${cheese.milk}
- Origin: ${cheese.country}${cheese.region ? `, ${cheese.region}` : ''}
- Type: ${cheese.type}
- Texture: ${cheese.texture}
- Flavor: ${cheese.flavor}
- Aroma: ${cheese.aroma}

Example output format:
{
  "description": "Detailed description of the cheese",
  "history": "Historical background and origin story",
  "pairings": ["Wine pairing 1", "Food pairing 2"],
  "serving_suggestions": ["Serving suggestion 1", "Serving suggestion 2"],
  "nutritional_benefits": ["Nutritional benefit 1", "Nutritional benefit 2"],
  "cultural_significance": ["Cultural significance 1", "Cultural significance 2"],
  "storage_tips": ["Storage tip 1", "Storage tip 2"],
  "additional_tags": ["tag1", "tag2", "tag3"],
  "meta_title": "Complete Guide to [Cheese Name]: Origins, Taste, and Pairings",
  "meta_description": "Discover everything about [Cheese Name], including its unique characteristics, history, and perfect food pairings. Learn about this exceptional cheese from [Region/Country]."
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{
        role: "system",
        content: "You are an expert cheese connoisseur providing detailed, accurate information in JSON format."
      }, {
        role: "user",
        content: prompt
      }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error(`Error generating data for ${cheese.cheese}:`, error);
    return {
      description: "",
      history: "",
      pairings: [],
      serving_suggestions: [],
      nutritional_benefits: [],
      cultural_significance: [],
      storage_tips: [],
      additional_tags: [],
      meta_title: `${cheese.cheese} Cheese Guide: Types, Origins & Pairings`,
      meta_description: `Learn about ${cheese.cheese} cheese from ${cheese.country}${cheese.region ? `, ${cheese.region}` : ''}. Discover its unique characteristics and perfect pairings.`
    };
  }
}

async function processCheeseData(cheeses) {
  const processedCount = { value: 0 };
  const startTime = Date.now();
  let lastLogTime = startTime;

  // Create directories if they don't exist
  await fs.mkdir(path.join(process.cwd(), 'data/generated/cheeses'), { recursive: true });
  await fs.mkdir(path.join(process.cwd(), 'data/generated/indexes'), { recursive: true });

  // Process cheeses in batches
  for (let i = 0; i < cheeses.length; i += BATCH_SIZE) {
    const batch = cheeses.slice(i, i + BATCH_SIZE);
    
    try {
      await Promise.all(
        batch.map(cheese => limit(async () => {
          const slug = createSlug(cheese.cheese);
          const filePath = path.join(process.cwd(), 'data/generated/cheeses', `${slug}.json`);

          // Skip if file already exists
          try {
            await fs.access(filePath);
            console.log(`Skipping ${cheese.cheese} - file already exists`);
            processedCount.value++;
            return;
          } catch {
            // File doesn't exist, proceed with generation
          }

          const enhancedData = await getEnhancedCheeseData(cheese);
          const finalData = {
            ...cheese,
            ...enhancedData,
            slug
          };

          await fs.writeFile(filePath, JSON.stringify(finalData, null, 2));
          processedCount.value++;

          // Log progress every 10 seconds
          const currentTime = Date.now();
          if (currentTime - lastLogTime >= 10000 || processedCount.value === cheeses.length) {
            const elapsedMinutes = (currentTime - startTime) / 60000;
            const itemsPerMinute = Math.round(processedCount.value / elapsedMinutes);
            const progress = Math.floor((processedCount.value / cheeses.length) * 100);
            const estimatedTotalMinutes = cheeses.length / itemsPerMinute;
            const remainingMinutes = Math.max(0, estimatedTotalMinutes - elapsedMinutes);
            
            console.log(
              `Progress: ${progress}% | ` +
              `${processedCount.value}/${cheeses.length} cheeses | ` +
              `${itemsPerMinute}/minute | ` +
              `~${Math.round(remainingMinutes)}m remaining`
            );
            lastLogTime = currentTime;
          }
        }))
      );

      if (i + BATCH_SIZE < cheeses.length) {
        await sleep(DELAY_BETWEEN_BATCHES);
      }
    } catch (error) {
      console.error('Error processing batch:', error);
      continue;
    }
  }

  // Generate index files
  await generateIndexFiles(cheeses);
}

async function generateIndexFiles(cheeses) {
  console.log('Generating index files...');

  const indexes = {
    milk: {},
    country: {},
    region: {},
    texture: {},
    flavor: {},
    dietary: {
      vegetarian: [],
      vegan: []
    }
  };

  // Build indexes
  for (const cheese of cheeses) {
    const slug = createSlug(cheese.cheese);

    // Milk type index
    if (cheese.milk && cheese.milk !== 'NA') {
      const milkType = createSlug(cheese.milk);
      indexes.milk[milkType] = indexes.milk[milkType] || [];
      indexes.milk[milkType].push(slug);
    }

    // Country index
    if (cheese.country && cheese.country !== 'NA') {
      const country = createSlug(cheese.country);
      indexes.country[country] = indexes.country[country] || [];
      indexes.country[country].push(slug);
    }

    // Region index
    if (cheese.region && cheese.region !== 'NA') {
      const region = createSlug(cheese.region);
      indexes.region[region] = indexes.region[region] || [];
      indexes.region[region].push(slug);
    }

    // Texture index
    if (cheese.texture && cheese.texture !== 'NA') {
      const textures = cheese.texture.split(',').map(t => t.trim());
      for (const texture of textures) {
        const textureSlug = createSlug(texture);
        indexes.texture[textureSlug] = indexes.texture[textureSlug] || [];
        indexes.texture[textureSlug].push(slug);
      }
    }

    // Flavor index
    if (cheese.flavor && cheese.flavor !== 'NA') {
      const flavors = cheese.flavor.split(',').map(f => f.trim());
      for (const flavor of flavors) {
        const flavorSlug = createSlug(flavor);
        indexes.flavor[flavorSlug] = indexes.flavor[flavorSlug] || [];
        indexes.flavor[flavorSlug].push(slug);
      }
    }

    // Dietary index
    if (cheese.vegetarian === 'TRUE') {
      indexes.dietary.vegetarian.push(slug);
    }
    if (cheese.vegan === 'TRUE') {
      indexes.dietary.vegan.push(slug);
    }
  }

  // Write index files
  const indexesPath = path.join(process.cwd(), 'data/generated/indexes');
  
  await Promise.all([
    fs.writeFile(
      path.join(indexesPath, 'milk-types.json'),
      JSON.stringify(indexes.milk, null, 2)
    ),
    fs.writeFile(
      path.join(indexesPath, 'countries.json'),
      JSON.stringify(indexes.country, null, 2)
    ),
    fs.writeFile(
      path.join(indexesPath, 'regions.json'),
      JSON.stringify(indexes.region, null, 2)
    ),
    fs.writeFile(
      path.join(indexesPath, 'textures.json'),
      JSON.stringify(indexes.texture, null, 2)
    ),
    fs.writeFile(
      path.join(indexesPath, 'flavors.json'),
      JSON.stringify(indexes.flavor, null, 2)
    ),
    fs.writeFile(
      path.join(indexesPath, 'dietary.json'),
      JSON.stringify(indexes.dietary, null, 2)
    )
  ]);

  console.log('Index files generated successfully');
}

async function main() {
  try {
    console.log('Starting data generation process...');

    // Read CSV file
    const cheeses = [];
    const parser = createReadStream(path.join(process.cwd(), 'data/data.csv')).pipe(
      parse({
        columns: true,
        skip_empty_lines: true
      })
    );

    for await (const record of parser) {
      cheeses.push(record);
    }

    console.log(`Processing ${cheeses.length} cheeses...`);
    await processCheeseData(cheeses);
    console.log('Data generation completed successfully!');
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

main();
