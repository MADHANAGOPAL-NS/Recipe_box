import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Header from '../components/Header/Header';
import recipeService from '../services/recipeService';
import authService from '../services/authService';
import './CreateRecipe.css';

const CreateRecipe = () => {
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    prepTime: '20',
    cookTime: '45',
    servings: '4',
    tags: [],
  });

  const [ingredients, setIngredients] = useState([
    { name: '', quantity: '', unit: 'g' }
  ]);

  const [instructions, setInstructions] = useState(['']);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleInputChange = (e) => {
    setRecipe({ ...recipe, [e.target.name]: e.target.value });
  };

  const handleIngredientChange = (index, e) => {
    const newIngredients = [...ingredients];
    newIngredients[index][e.target.name] = e.target.value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: 'g' }]);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleInstructionChange = (index, e) => {
    const newInstructions = [...instructions];
    newInstructions[index] = e.target.value;
    setInstructions(newInstructions);
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstruction = (index) => {
    const newInstructions = instructions.filter((_, i) => i !== index);
    setInstructions(newInstructions);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const user = authService.getCurrentUser();
    if (!user || !user.token) {
      setMessage({ type: 'error', text: 'You must be logged in to create a recipe' });
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', recipe.title);
      formData.append('description', recipe.description);
      formData.append('prepTime', recipe.prepTime);
      formData.append('cookTime', recipe.cookTime);
      formData.append('servings', recipe.servings);
      formData.append('ingredients', JSON.stringify(ingredients));
      formData.append('instructions', JSON.stringify(instructions));
      formData.append('tags', JSON.stringify(recipe.tags));
      if (image) {
        formData.append('image', image);
      }

      await recipeService.createRecipe(formData, user.token);
      setMessage({ type: 'success', text: 'Recipe created successfully! Redirecting...' });
      setTimeout(() => navigate('/feed'), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create recipe' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="create-page">
      <Header />
      <div className="create-container">
        <main className="recipe-editor">
          <div className="editor-header">
              <h1>Create New Alchemy</h1>
              <p>Transform your culinary experiments into permanent records. Detail every nuance of your creation.</p>
            </div>

            <form onSubmit={onSubmit} className="recipe-form">
              <section id="basic-details" className="form-section">
                <div className="form-group-alt">
                  <label>RECIPE TITLE</label>
                  <input
                    type="text"
                    name="title"
                    value={recipe.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Miso-Glazed Black Cod"
                    className="title-input"
                    required
                  />
                </div>

                <div className="form-group-alt">
                  <label>DESCRIPTION</label>
                  <textarea
                    name="description"
                    value={recipe.description}
                    onChange={handleInputChange}
                    placeholder="Briefly describe the soul of this dish..."
                    className="description-input"
                  />
                </div>

                <div className="stats-row">
                  <div className="stat-card">
                    <label>PREP TIME</label>
                    <div className="stat-input-group">
                      <input type="number" name="prepTime" value={recipe.prepTime} onChange={handleInputChange} />
                      <span>mins</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <label>COOK TIME</label>
                    <div className="stat-input-group">
                      <input type="number" name="cookTime" value={recipe.cookTime} onChange={handleInputChange} />
                      <span>mins</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <label>SERVINGS</label>
                    <div className="stat-input-group">
                      <input type="number" name="servings" value={recipe.servings} onChange={handleInputChange} />
                      <span>ppl</span>
                    </div>
                  </div>
                </div>
              </section>

              <section id="photography" className="form-section">
                <h3>Visual Soul</h3>
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} ${imagePreview ? 'has-image' : ''}`}>
                  <input {...getInputProps()} />
                  {imagePreview ? (
                    <div className="preview-container">
                      <img src={imagePreview} alt="Preview" className="image-preview" />
                      <div className="dropzone-overlay">
                        <span className="camera-icon-alt">📷</span>
                        <p>Change masterpiece</p>
                      </div>
                    </div>
                  ) : (
                    <div className="dropzone-empty">
                      <span className="camera-icon-large">📸</span>
                      <p>Drop your masterpiece here</p>
                      <span className="sub-text">or click to browse</span>
                    </div>
                  )}
                </div>
              </section>

              <section id="ingredients" className="form-section">
                <div className="section-header">
                  <h3>Ingredients</h3>
                  <button type="button" className="add-btn" onClick={addIngredient}>+ Add Ingredient</button>
                </div>
                <div className="ingredients-list">
                  {ingredients.map((ing, index) => (
                    <div key={index} className="ingredient-row">
                      <input
                        type="text"
                        name="name"
                        value={ing.name}
                        onChange={(e) => handleIngredientChange(index, e)}
                        placeholder="Ingredient name"
                        className="ing-name-input"
                        required={index === 0}
                      />
                      <input
                        type="text"
                        name="quantity"
                        value={ing.quantity}
                        onChange={(e) => handleIngredientChange(index, e)}
                        placeholder="Qty"
                        className="ing-qty-input"
                      />
                      <select
                        name="unit"
                        value={ing.unit}
                        onChange={(e) => handleIngredientChange(index, e)}
                        className="ing-unit-input"
                      >
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                        <option value="l">l</option>
                        <option value="tbsp">tbsp</option>
                        <option value="tsp">tsp</option>
                        <option value="cup">cup</option>
                        <option value="unit">unit</option>
                      </select>
                      {ingredients.length > 1 && (
                        <button type="button" className="remove-btn" onClick={() => removeIngredient(index)}>×</button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section id="process-steps" className="form-section">
                <div className="section-header">
                  <h3>Process Steps</h3>
                  <button type="button" className="add-btn" onClick={addInstruction}>+ Add Step</button>
                </div>
                <div className="instructions-list">
                  {instructions.map((step, index) => (
                    <div key={index} className="instruction-row">
                      <div className="step-number">{index + 1}</div>
                      <textarea
                        value={step}
                        onChange={(e) => handleInstructionChange(index, e)}
                        placeholder={`Describe step ${index + 1}...`}
                        required={index === 0}
                      />
                      {instructions.length > 1 && (
                        <button type="button" className="remove-btn" onClick={() => removeInstruction(index)}>×</button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {message.text && <div className={`alert-message ${message.type}`}>{message.text}</div>}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary submit-recipe-btn" disabled={loading}>
                  {loading ? 'Transmuting...' : 'Publish Alchemy'}
                </button>
              </div>
            </form>
          </main>

          <aside className="editor-sidebar">
            <div className="navigator-card">
              <h4>FORM NAVIGATOR</h4>
              <nav className="navigator-links">
                <a href="#basic-details" className="active">• Basic Details</a>
                <a href="#photography">• Photography</a>
                <a href="#ingredients">• Ingredients</a>
                <a href="#process-steps">• Process Steps</a>
              </nav>
            </div>

            <div className="tip-card">
              <span className="tip-icon">✨</span>
              <h4>Chef's Secret</h4>
              <p>"Good recipes are written for the hands, but great recipes are written for the mind. Be specific with your temperatures and texture cues."</p>
              <div className="tip-footer">
                <span className="tip-marker">📍</span>
                <span>ALCHEMY TIP</span>
              </div>
            </div>
          </aside>
      </div>
    </div>
  );
};

export default CreateRecipe;
