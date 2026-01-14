"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Tables, { Product } from "./_components/Tables";
import Search from "../../(components)/Search";
import { getProducts, searchByName, deleteProductId } from "./api";

const PageProductos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getProducts();
      setProducts(res);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error fetching products");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = React.useCallback(
    async (term: string) => {
      try {
        setIsLoading(true);
        setError(null);
        if (term.trim() === "") {
          await fetchProducts();
        } else {
          const res = await searchByName(term);
          setProducts(res);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error searching products");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [fetchProducts]
  );

  const handleDelete = async (id: number) => {
    try {
      await deleteProductId(id);
      setProducts(products.filter((product) => product.id !== id));
    } catch (err: unknown) {
      console.error("Error deleting product:", err);
      alert("Error al eliminar el producto");
    }
  };

  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchProducts();
      hasFetched.current = true;
    }
  }, [fetchProducts]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-auto">
          <h2 className="text-2xl mb-4">Productos</h2>
          <Search onSearch={handleSearch} />
        </div>
        <Link
          href="/productos/agregar-productos"
          className="mt-2 text-nowrap p-3 rounded-md flex flex-row items-center gap-2 bg-[#e5e5d0] text-black cursor-pointer hover:bg-[#d8d8b9]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-plus"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 5l0 14" />
            <path d="M5 12l14 0" />
          </svg>
          Agregar Producto
        </Link>
      </div>
      <div className="w-full border border-gray-200 rounded-lg">
        <Tables
          products={products}
          isLoading={isLoading}
          error={error}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default PageProductos;
