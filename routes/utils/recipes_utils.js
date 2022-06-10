const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}

async function getRecipeDetailsExtended(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, servings, extendedIngredients } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        servings: servings,
        extendedIngredients: extendedIngredients,
        
    }
}

async function searchRecipe(query, number, cuisine, diet, intolerance){
    return await axios.get(`${api_domain}/complexSearch`, {
        params:{
            query: query,
            number: number,
            cuisine: cuisine,
            diet: diet, 
            intolerance: intolerance,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function getFoundedRecipesDetails(query, number, cuisine, diet, intolerance){
    let answer = await searchRecipe(query, number, cuisine, diet, intolerance);
    let results = answer.data.results;
    let promises = []
    details = []
    for (let i=0; i < results.length; i++){
        promises.push(getRecipeInformation(i.id))
    }
    let info_res = await Promise.all(promises);
    return info_res.map((recipe_id) => {
        return getRecipeDetailsExtended(recipe_id)
    })
}





exports.getRecipeDetails = getRecipeDetails;
exports.getRecipeDetailsExtended = getRecipeDetailsExtended;
exports.searchRecipe = searchRecipe;
exports.getFoundedRecipesDetails = getFoundedRecipesDetails;





