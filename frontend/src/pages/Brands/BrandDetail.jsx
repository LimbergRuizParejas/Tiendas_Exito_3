import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBrandById } from '../services/brandService'; // corregido el import
import Loader from '../../components/Loader';

const BrandDetail = () => {
  const { id } = useParams();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const data = await getBrandById(id);
        setBrand(data);
      } catch (error) {
        console.error('Error fetching brand:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id]);

  if (loading) return <Loader />;
  if (!brand) return <p>Marca no encontrada.</p>;

  return (
    <div className="brand-detail" style={{ padding: '20px' }}>
      <h1>{brand.nombre}</h1>
      {brand.imagen && (
        <img
          src={brand.imagen}
          alt={brand.nombre}
          style={{ maxWidth: '300px', borderRadius: '10px' }}
        />
      )}
      <p><strong>ID:</strong> {brand.id}</p>
    </div>
  );
};

export default BrandDetail;
