const searchBtn = document.getElementById("searchBtn");
const ingredientInput = document.getElementById("ingredientInput");
const results = document.getElementById("results");
const recipePopup = document.getElementById("recipePopup");
const closePopup = document.getElementById("closePopup");
const recipeTitle = document.getElementById("recipeTitle");
const recipeDetails = document.getElementById("recipeDetails");
const loadingSpinner = document.getElementById("loadingSpinner");

// Trigger search on Enter key
ingredientInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

// Fetch recipes based on the ingredient
searchBtn.addEventListener("click", async () => {
    const query = ingredientInput.value.trim();
    if (!query) {
        ingredientInput.classList.add("error");
        setTimeout(() => ingredientInput.classList.remove("error"), 1000);
        return;
    }

    loadingSpinner.classList.remove("hidden");

    try {
        const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        loadingSpinner.classList.add("hidden");
        results.innerHTML = "";

        if (!data.meals) {
            results.innerHTML = `<p>No recipes found for "${query}".</p>`;
            return;
        }

        data.meals.slice(0, 8).forEach(meal => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <button class="get-recipe" data-id="${meal.idMeal}">Get Recipe</button>
            `;

            results.appendChild(card);
        });

        document.querySelectorAll(".get-recipe").forEach(button => {
            button.addEventListener("click", async (e) => {
                const mealId = e.target.dataset.id;
                const recipeApi = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
                const recipeResponse = await fetch(recipeApi);
                const recipeData = await recipeResponse.json();

                const meal = recipeData.meals[0];
                recipeTitle.textContent = meal.strMeal;

                recipeDetails.innerHTML = meal.strInstructions
                    .split("\n")
                    .filter(line => line.trim() !== "")
                    .map(line => `<p>${line}</p>`)
                    .join("");

                recipePopup.classList.remove("hidden");
            });
        });

        ingredientInput.value = "";
    } catch (error) {
        console.error("Error fetching data", error);
        loadingSpinner.classList.add("hidden");
        results.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    }
});

closePopup.addEventListener("click", () => recipePopup.classList.add("hidden"));

recipePopup.addEventListener("click", (e) => {
    if (e.target === recipePopup) {
        recipePopup.classList.add("hidden");
    }
});
