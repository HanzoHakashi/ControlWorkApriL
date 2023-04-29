const form = document.querySelector('form');
const cocktailList = document.querySelector('#cocktailList');
const modal = document.querySelector('#modal');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
     const cocktailName = form.elements.cocktailName.value;
    const ingredientName = form.elements.ingredientName.value;
    let url = `https://www.thecocktaildb.com/api/json/v1/1/`;

    if (cocktailName) {
        url += `search.php?s=${cocktailName}`;
    } else if (ingredientName) {
        url += `filter.php?i=${ingredientName}`;
    } else {
        return;
    }

    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    const cocktails = data.drinks;

    if (cocktails) {
        cocktailList.innerHTML = '';
        cocktails.forEach(cocktail => {
            const cocktailDiv = document.createElement('div');
            cocktailDiv.classList.add('col');
            cocktailDiv.innerHTML = `
                <div class="card w-100">
                    <img src="${cocktail.strDrinkThumb}" class="card-img-top img-thumbnail" alt="${cocktail.strDrink}">
                    <div class="card-body">
                        <h5 class="card-title">${cocktail.strDrink}</h5>
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#cocktailModal" data-cocktail-id="${cocktail.idDrink}">
                            Details
                        </button>
                    </div>
                </div>
            `;
            cocktailList.appendChild(cocktailDiv);
        });
    } else {
        cocktailList.innerHTML = '<p>No cocktails found</p>';
    }
});



cocktailList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const cocktailId = e.target.dataset.cocktailId;
        showCocktailDetails(cocktailId);
    }
});

function showCocktailDetails(cocktailId) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailId}`)
        .then(response => response.json())
        .then(data => {
                const cocktail = data.drinks[0];
                const cocktailImg = document.getElementById('cocktailImg');
                if (cocktailImg) {
                    cocktailImg.src = cocktail.strDrinkThumb;
                    cocktailImg.alt = cocktail.strDrink;
                }
                document.getElementById('cocktailName').innerText = cocktail.strDrink;
                document.getElementById('cocktailCategory').innerText = cocktail.strCategory;
                document.getElementById('cocktailGlass').innerText = cocktail.strGlass;
                document.getElementById('cocktailAlcoholic').innerText = cocktail.strAlcoholic;
                document.getElementById('cocktailInstructions').innerText = cocktail.strInstructions;
                const ingredientList = document.getElementById('ingredientList');
                ingredientList.innerHTML = '';
                for (let i = 1; i <= 15; i++) {
                    const ingredient = cocktail[`strIngredient${i}`];
                    const measure = cocktail[`strMeasure${i}`];
                    if (ingredient && measure) {
                       const li = document.createElement('li');
                       const img = document.createElement('img');
                       img.src = `https://www.thecocktaildb.com/images/ingredients/${ingredient}-Small.png`;
                       img.alt = ingredient;
                       li.appendChild(img);
                       const span = document.createElement('span');
                       span.innerText = `${measure} ${cocktail[`strMeasure${i}`]} of ${ingredient}`;
                       li.appendChild(span);
                       ingredientList.appendChild(li);
                    }}$('#cocktailModal').modal('show');
                        })
                        .catch(error => console.error(error));
                        }




