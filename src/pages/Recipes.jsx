import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from '@/contexts/SupabaseContext';
import {
  Plus,
  Book,
  Search,
  Edit2,
  Trash2,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import RecipeForm from '@/components/recipes/RecipeForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRecipes, setExpandedRecipes] = useState(new Set());
  const { supabase, userId } = useSupabase();
  const { toast } = useToast();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select(
          `
          *,
          recipe_ingredients (
            *,
            inventory_items (
              name,
              unit,
              default_price,
              last_price
            )
          ),
          recipe_prep_items (
            *,
            prep_items (
              name,
              yield_unit,
              prep_item_ingredients (
                *,
                inventory_items (
                  name,
                  unit,
                  default_price,
                  last_price
                )
              )
            )
          )
        `
        )
        .eq('user_id', userId)
        .order('name');

      if (recipesError) throw recipesError;

      // Calculate costs for each recipe
      const recipesWithCosts = recipesData.map(recipe => {
        let totalCost = 0;

        // Calculate cost from direct ingredients
        for (const ingredient of recipe.recipe_ingredients || []) {
          const price =
            ingredient.inventory_items?.default_price ||
            ingredient.inventory_items?.last_price ||
            0;
          totalCost += price * ingredient.quantity;
        }

        // Calculate cost from prep items
        for (const prepItem of recipe.recipe_prep_items || []) {
          const prepItemIngredients =
            prepItem.prep_items?.prep_item_ingredients || [];
          const prepItemCost = prepItemIngredients.reduce((sum, ingredient) => {
            const price =
              ingredient.inventory_items?.default_price ||
              ingredient.inventory_items?.last_price ||
              0;
            return sum + price * ingredient.quantity;
          }, 0);

          // Scale the prep item cost based on the quantity used in the recipe
          const scaledPrepItemCost = prepItemCost * prepItem.quantity;
          totalCost += scaledPrepItemCost;
        }

        const costPerPortion = totalCost / recipe.portions;
        const foodCostPercentage = recipe.target_price
          ? (costPerPortion / recipe.target_price) * 100
          : 0;

        return {
          ...recipe,
          totalCost,
          costPerPortion,
          foodCostPercentage,
        };
      });

      setRecipes(recipesWithCosts || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch recipes. Please try again.',
      });
    }
  };

  const handleEditClick = recipe => {
    setSelectedRecipe(recipe);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = recipe => {
    setSelectedRecipe(recipe);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteRecipe = async () => {
    if (!selectedRecipe) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', selectedRecipe.id)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Recipe deleted successfully',
      });

      setIsDeleteDialogOpen(false);
      fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete recipe. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRecipeExpansion = recipeId => {
    const newExpanded = new Set(expandedRecipes);
    if (newExpanded.has(recipeId)) {
      newExpanded.delete(recipeId);
    } else {
      newExpanded.add(recipeId);
    }
    setExpandedRecipes(newExpanded);
  };

  const getFoodCostColor = percentage => {
    if (percentage > 33) return 'text-red-500';
    if (percentage > 28) return 'text-yellow-500';
    return 'text-green-500';
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          <Book className="w-6 h-6 mr-2" />
          Recipes
        </h1>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Recipe
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredRecipes.map(recipe => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold">{recipe.name}</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(recipe)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(recipe)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      Portions:
                    </span>
                    <span className="font-medium">{recipe.portions}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500 mr-2">
                      Cost/Portion:
                    </span>
                    <span className="font-medium">
                      ${recipe.costPerPortion.toFixed(2)}
                    </span>
                  </div>
                  {recipe.target_price && (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">
                        Food Cost:
                      </span>
                      <span
                        className={`font-medium ${getFoodCostColor(recipe.foodCostPercentage)}`}
                      >
                        {recipe.foodCostPercentage.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleRecipeExpansion(recipe.id)}
              className="w-full mt-2"
            >
              {expandedRecipes.has(recipe.id) ? (
                <ChevronUp className="w-4 h-4 mr-2" />
              ) : (
                <ChevronDown className="w-4 h-4 mr-2" />
              )}
              {expandedRecipes.has(recipe.id) ? 'Hide Details' : 'Show Details'}
            </Button>

            {expandedRecipes.has(recipe.id) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Raw Ingredients:</h4>
                      <div className="grid gap-2">
                        {recipe.recipe_ingredients.map(item => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <span>{item.inventory_items?.name}</span>
                            <span>
                              {item.quantity} {item.inventory_items?.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">Prep Items:</h4>
                      <div className="grid gap-2">
                        {recipe.recipe_prep_items.map(item => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <span>{item.prep_items?.name}</span>
                            <span>
                              {item.quantity} {item.prep_items?.yield_unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t sm:border-t-0 sm:border-l pt-4 sm:pl-6">
                    <h4 className="font-medium mb-2">Cost Summary:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Recipe Cost:</span>
                        <span className="font-medium">
                          ${recipe.totalCost.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Cost per Portion:</span>
                        <span className="font-medium">
                          ${recipe.costPerPortion.toFixed(2)}
                        </span>
                      </div>
                      {recipe.target_price && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span>Target Price:</span>
                            <span className="font-medium">
                              ${recipe.target_price.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Food Cost %:</span>
                            <span
                              className={`font-medium ${getFoodCostColor(recipe.foodCostPercentage)}`}
                            >
                              {recipe.foodCostPercentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Profit per Portion:</span>
                            <span className="font-medium">
                              $
                              {(
                                recipe.target_price - recipe.costPerPortion
                              ).toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Recipe</DialogTitle>
          </DialogHeader>
          <RecipeForm
            onSuccess={() => {
              setIsAddDialogOpen(false);
              fetchRecipes();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Recipe</DialogTitle>
          </DialogHeader>
          <RecipeForm
            recipe={selectedRecipe}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              fetchRecipes();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Recipe</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this recipe? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRecipe}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Recipes;
