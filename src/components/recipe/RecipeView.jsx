// components/recipe/RecipeView.tsx
import { useRecoilState } from 'recoil'
import { currentRecipeState } from '../../store/atoms'

function RecipeView() {
  const [recipe, setRecipe] = useRecoilState(currentRecipeState)

  return (
    <div>
      <h1>{recipe.title}</h1>
      <div className="steps">
        {recipe.steps.map((step, index) => (
          <div 
            key={index}
            className={index === recipe.currentStep ? 'current-step' : ''}
          >
            <h3>Step {index + 1}</h3>
            <p>{step}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecipeView