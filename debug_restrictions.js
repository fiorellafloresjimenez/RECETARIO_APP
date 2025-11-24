const fetch = require('node-fetch');

const BASE_URL = "https://recetario-app-backend.onrender.com";

async function checkRestrictions() {
  try {
    const res = await fetch(`${BASE_URL}/api/recipes`);
    const recipes = await res.json();
    
    console.log("Total recipes:", recipes.length);
    recipes.forEach(r => {
      console.log(`Recipe: ${r.name}`);
      console.log(`  Restrictions (raw):`, r.restrictions);
    });
  } catch (e) {
    console.error(e);
  }
}

checkRestrictions();
