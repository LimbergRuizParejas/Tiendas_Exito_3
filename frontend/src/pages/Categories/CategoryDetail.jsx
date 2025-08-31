import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCategoryById } from '../services/categoryService';

import Loader from '../../components/Loader';

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getCategoryById(id);
        setCategory(data);
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading) return <Loader />;
  if (!category) return <p>Categoría no encontrada.</p>;

  return (
    <div className="category-detail">
      <h1>{category.nombre}</h1>
      <p><strong>ID:</strong> {category.id}</p>
    </div>
  );
};

export default CategoryDetail;
